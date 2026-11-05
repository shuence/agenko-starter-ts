import agenko, { type Receipt } from "@agenko/sdk";
import type { ReceiptPayload } from "./types";

/**
 * Agenko trust boundary.
 *
 * Every tool runs inside `agenko.check(...)`, which returns a receipt:
 * what the agent claimed, what actually happened, a deterministic verdict and
 * a SHA-256 hash chained to the previous receipt in this process.
 *
 * Nothing here throws into your app. If Agenko is not configured we still
 * compute receipts locally; `agenko.init()` only ships them to a control plane
 * when credentials are present.
 */

let bootstrapped = false;

export function ensureAgenko(): void {
  if (bootstrapped || agenko.isInitialized()) return;
  bootstrapped = true;

  const apiKey = process.env.AGENKO_API_KEY;
  const httpEndpoint =
    process.env.AGENKO_HOST ?? process.env.AGENKO_HTTP_ENDPOINT;

  // Local mode: receipts are computed in-process and streamed to the UI.
  // Set AGENKO_API_KEY (and optionally AGENKO_HOST) to persist them in Agenko.
  if (!apiKey && !httpEndpoint) return;

  agenko.init({
    apiKey,
    httpEndpoint,
    endpoint: process.env.AGENKO_OTLP_ENDPOINT,
    serviceName: process.env.AGENKO_SERVICE_NAME ?? "agenko-starter",
    debug: process.env.AGENKO_DEBUG === "1",
  });
}

export type CheckedResult<T> = {
  output: T;
  receipt?: ReceiptPayload;
};

/**
 * Run a tool body through the trust boundary.
 *
 * The claim is the tool the agent decided to call. The SDK compares the claim
 * against the recorded execution and assigns grounded / silent_failure / error
 * without asking an LLM.
 */
export async function withReceipt<T extends object>(
  name: string,
  body: () => Promise<T>,
): Promise<CheckedResult<T>> {
  ensureAgenko();

  const runner = async () => body();
  Object.defineProperty(runner, "name", { value: name });

  const run = agenko.check({ claims: [name] })(runner);
  const result = await run();
  const { _agenko_receipt, ...output } = result as T & {
    _agenko_receipt?: Receipt;
  };

  return {
    output: output as T,
    receipt: _agenko_receipt ? toPayload(_agenko_receipt) : undefined,
  };
}

export function toPayload(receipt: Receipt): ReceiptPayload {
  return {
    id: receipt.id,
    function: receipt.function,
    claimed: receipt.claimed,
    actual: receipt.actual,
    verdict: receipt.verdict,
    checks: receipt.checks,
    grounding_score: receipt.grounding_score,
    estimated: true,
    hash: receipt.hash,
    prev_hash: receipt.prev_hash,
    timestamp: receipt.timestamp,
    tool_calls: receipt.tool_calls.map((call) => call.name),
  };
}

export function consoleUrl(): string {
  return (process.env.AGENKO_CONSOLE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}
