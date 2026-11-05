import {
  context as otelContext,
  SpanStatusCode,
  trace,
  type Context,
  type Span,
} from "@opentelemetry/api";
import type { Telemetry } from "ai";
import { flushAgenko } from "./trust";

const FALLBACK_MODEL = process.env.AI_GATEWAY_MODEL ?? "unknown";
const SERVICE = process.env.AGENKO_SERVICE_NAME ?? "agenko-starter";
const SESSION = process.env.AGENKO_SESSION_ID ?? "sess_starter_live";
const USER = process.env.AGENKO_USER_ID ?? "starter@agenko.app";
const ENVIRONMENT = process.env.AGENKO_ENV ?? "production";

// USD per 1M tokens. Unknown models fall back to zero.
const RATES: Record<string, [number, number]> = {
  "openai/gpt-6-astra": [2.5, 10],
  "anthropic/claude-sonnet-5.5": [3, 15],
  "google/gemini-3.1-pro": [1.25, 10],
  "alibaba/qwen3.7-flash": [0.15, 0.6],
};

function estimatedCost(model: string, inputTokens: number, outputTokens: number): number {
  const [inputRate, outputRate] = RATES[model] ?? [0, 0];
  return (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000;
}

/**
 * AI SDK telemetry integration.
 *
 * The starter talks to the Vercel AI Gateway, which the Agenko SDK does not
 * auto-instrument. This turns every chat turn into an OpenInference LLM span
 * (model, prompt/completion tokens, cost, input/output) plus child tool spans,
 * exported through the SDK's OpenTelemetry provider.
 */
export function agenkoTelemetry(): Telemetry & { finish: () => Promise<void> } {
  let root: Span | null = null;
  let rootContext: Context = otelContext.active();
  let modelId = FALLBACK_MODEL;
  let provider = FALLBACK_MODEL.split("/")[0] || "unknown";
  let responseText = "";
  let inputTokens = 0;
  let outputTokens = 0;
  let closed = false;
  let toolFailed = false;
  const toolSpans = new Map<string, Span>();

  const stampUsage = () => {
    if (!root) return;
    root.setAttribute("llm.token_count.prompt", inputTokens);
    root.setAttribute("llm.token_count.completion", outputTokens);
    root.setAttribute("llm.token_count.total", inputTokens + outputTokens);
    root.setAttribute("llm.cost_usd", estimatedCost(modelId, inputTokens, outputTokens));
  };

  const close = async () => {
    if (closed) return;
    closed = true;
    if (root) {
      stampUsage();
      root.setAttribute("output.value", responseText);
      if (toolFailed) root.setAttribute("agenko.receipt.verdict", "error");
      root.setStatus({ code: SpanStatusCode.OK });
      root.end();
      root = null;
    }
    for (const span of toolSpans.values()) span.end();
    toolSpans.clear();
    await flushAgenko();
  };

  return {
    finish: close,
    onStart(event: any) {
      if (root) return;
      modelId = event?.modelId ?? modelId;
      provider = event?.provider ?? provider;
      root = trace.getTracer(SERVICE).startSpan("chat.response", {
        attributes: {
          "openinference.span.kind": "LLM",
          "llm.model_name": modelId,
          "llm.provider": provider,
          "llm.token_count.prompt": 0,
          "llm.token_count.completion": 0,
          "llm.token_count.total": 0,
          "input.value": JSON.stringify(event?.messages ?? event?.prompt ?? ""),
          "session.id": SESSION,
          "user.id": USER,
          "langfuse.session.id": SESSION,
          "langfuse.user.id": USER,
          "langfuse.trace.name": "chat.response",
          "langfuse.trace.metadata.agent": "agenko-starter",
          "langfuse.trace.metadata.model": modelId,
          "langfuse.trace.metadata.release": "0.2.0",
          "langfuse.trace.metadata.source": "starter",
          "agenko.run.id": SESSION,
          "run.id": SESSION,
          "agenko.receipt.verdict": "grounded",
          "deployment.environment": ENVIRONMENT,
          "agenko.service.name": SERVICE,
        },
      });
      rootContext = trace.setSpan(otelContext.active(), root);
    },
    onStepEnd(event: any) {
      const usage = event?.usage ?? {};
      inputTokens += usage.inputTokens ?? usage.promptTokens ?? 0;
      outputTokens += usage.outputTokens ?? usage.completionTokens ?? 0;
      if (event?.text) responseText += event.text;
      stampUsage();
      if (responseText) root?.setAttribute("output.value", responseText);
    },
    onToolExecutionStart(event: any) {
      if (!root) return;
      const call = event?.toolCall ?? {};
      const name = call.toolName ?? event?.toolName ?? "tool";
      const id = call.toolCallId ?? event?.toolCallId ?? name;
      const child = trace.getTracer(SERVICE).startSpan(
        `tool.${name}`,
        {
          attributes: {
            "openinference.span.kind": "TOOL",
            "tool.name": name,
            "input.value": JSON.stringify(call.input ?? event?.input ?? ""),
          },
        },
        rootContext,
      );
      toolSpans.set(id, child);
    },
    onToolExecutionEnd(event: any) {
      const call = event?.toolCall ?? {};
      const name = call.toolName ?? event?.toolName ?? "tool";
      const id = call.toolCallId ?? event?.toolCallId ?? name;
      const child = toolSpans.get(id);
      if (!child) return;
      const output = event?.toolOutput;
      const ok = output?.type === "tool-result";
      if (!ok) {
        toolFailed = true;
        root?.setAttribute("agenko.receipt.verdict", "error");
      }
      child.setAttribute("output.value", JSON.stringify(ok ? output?.output : output?.error ?? ""));
      child.setStatus({ code: ok ? SpanStatusCode.OK : SpanStatusCode.ERROR });
      child.end();
      toolSpans.delete(id);
    },
    async onEnd(event: any) {
      const usage = event?.usage ?? {};
      inputTokens = usage.inputTokens ?? inputTokens;
      outputTokens = usage.outputTokens ?? outputTokens;
      if (event?.text) responseText = event.text;
      await close();
    },
    async onError() {
      await close();
    },
  };
}
