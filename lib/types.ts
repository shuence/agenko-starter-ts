import type { InferUITools, UIMessage } from "ai";
import type { ReceiptPayload } from "@/lib/agenko/types";
import type { ChatTools } from "@/lib/ai/tools";

export type StarterTools = InferUITools<ChatTools>;

/**
 * The message type shared by the route handler and `useChat`.
 * `data-receipt` parts carry Agenko receipts to the trust ledger.
 */
export type AgenkoMessage = UIMessage<
  never,
  { receipt: ReceiptPayload },
  StarterTools
>;

export type ReceiptPart = Extract<
  AgenkoMessage["parts"][number],
  { type: "data-receipt" }
>;
