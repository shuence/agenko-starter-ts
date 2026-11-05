"use client";

import { VERDICT_LABEL, type ReceiptPayload } from "@/lib/agenko/types";
import { cn } from "@/lib/utils";

const VERDICT_TONE: Record<ReceiptPayload["verdict"], string> = {
  grounded: "text-emerald-600",
  ungrounded: "text-amber-600",
  silent_failure: "text-amber-600",
  error: "text-red-600",
};

/** A compact pointer to the receipt that the trust ledger expands on. */
export function ReceiptChip({ receipt }: { receipt: ReceiptPayload }) {
  return (
    <div className="rise flex flex-wrap items-center gap-x-2 gap-y-1 border border-line bg-surface px-2.5 py-1.5 font-mono text-[10px] text-muted">
      <span className="text-ink">receipt</span>
      <span className="truncate text-faint">{receipt.id}</span>
      <span className={cn("uppercase tracking-[0.08em]", VERDICT_TONE[receipt.verdict])}>
        {VERDICT_LABEL[receipt.verdict]}
      </span>
      <span className="ml-auto text-faint" title={receipt.hash}>
        sha {receipt.hash.slice(0, 8)}
      </span>
    </div>
  );
}
