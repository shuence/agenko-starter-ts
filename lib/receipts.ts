import type { ReceiptPayload } from "@/lib/agenko/types";
import type { AgenkoMessage } from "@/lib/types";

/** Pull every streamed receipt out of the conversation, in arrival order. */
export function collectReceipts(messages: AgenkoMessage[]): ReceiptPayload[] {
  const receipts: ReceiptPayload[] = [];
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type === "data-receipt") receipts.push(part.data);
    }
  }
  return receipts;
}

/** Number of broken links in the local hash chain. 0 means every link holds. */
export function chainBreaks(receipts: ReceiptPayload[]): number {
  let breaks = 0;
  for (let i = 1; i < receipts.length; i += 1) {
    if (receipts[i].prev_hash !== receipts[i - 1].hash) breaks += 1;
  }
  return breaks;
}
