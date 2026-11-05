import type { ReceiptCheck, ReceiptVerdict } from "@agenko/sdk";

/**
 * A receipt as it travels over the wire.
 *
 * The Agenko SDK returns a `Receipt`; we send a trimmed, JSON-safe copy to the
 * browser so the trust ledger can render it without pulling the SDK client-side.
 */
export type ReceiptPayload = {
  id: string;
  function: string;
  claimed: string;
  actual: string;
  verdict: ReceiptVerdict;
  checks: ReceiptCheck[];
  grounding_score: number;
  estimated: true;
  hash: string;
  prev_hash: string;
  timestamp: string;
  tool_calls: string[];
};

export const VERDICT_LABEL: Record<ReceiptVerdict, string> = {
  grounded: "grounded",
  ungrounded: "ungrounded",
  silent_failure: "silent failure",
  error: "error",
};
