import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { AGENT_ID, createSupportAgent } from "@/lib/ai/agent";
import { hasGatewayAuth } from "@/lib/ai/model";
import { actionFor } from "@/lib/ai/policy";
import { ensureAgenko, flushAgenko } from "@/lib/agenko/trust";
import { agenkoTelemetry } from "@/lib/agenko/telemetry";
import type { AgenkoMessage } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!hasGatewayAuth()) {
    return Response.json(
      {
        error:
          "No AI Gateway credentials. Set AI_GATEWAY_API_KEY, or link the project with `vercel link` to get an OIDC token.",
      },
      { status: 500 },
    );
  }

  // Initialise Agenko before the model call so the AI SDK telemetry spans are
  // exported through the Agenko OpenTelemetry provider.
  ensureAgenko();

  let messages: AgenkoMessage[];
  try {
    ({ messages } = (await req.json()) as { messages: AgenkoMessage[] });
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  // Only route a fresh user turn. After an approval, the last message is the
  // assistant's tool part — do not force the same action a second time.
  const last = messages[messages.length - 1];
  const lastText =
    last?.role === "user"
      ? last.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(" ")
          .trim()
      : "";
  const firstStepTool = actionFor(lastText);

  const modelMessages = await convertToModelMessages(messages);
  const debug = process.env.AGENKO_DEBUG === "1";

  const stream = createUIMessageStream<AgenkoMessage>({
    execute: async ({ writer }) => {
      const telemetry = agenkoTelemetry();
      const agent = createSupportAgent(writer, { firstStepTool, telemetry });

      const result = await agent.stream({
        messages: modelMessages,
        abortSignal: req.signal,
        onFinish: async () => {
          await telemetry.finish();
          await flushAgenko();
        },
        onToolExecutionStart: ({ toolCall }) => {
          if (debug) console.log(`[${AGENT_ID}] tool:start`, toolCall.toolName);
        },
        onToolExecutionEnd: ({ toolCall }) => {
          if (debug) console.log(`[${AGENT_ID}] tool:end`, toolCall.toolName);
        },
        onStepFinish: (step) => {
          if (!debug) return;
          console.log(`[${AGENT_ID}] step`, {
            tools: step.toolCalls.map((call) => call.toolName),
            finishReason: step.finishReason,
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
    onError: (error) =>
      error instanceof Error ? error.message : "Something went wrong.",
  });

  return createUIMessageStreamResponse({ stream });
}
