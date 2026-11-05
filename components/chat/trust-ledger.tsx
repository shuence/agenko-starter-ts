"use client";

import { ExternalLink, ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";
import { VERDICT_LABEL, type ReceiptPayload } from "@/lib/agenko/types";
import { cn } from "@/lib/utils";

const VERDICT_TONE: Record<ReceiptPayload["verdict"], string> = {
  grounded: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  ungrounded: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  silent_failure: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  error: "border-red-500/40 bg-red-500/10 text-red-400",
};

const BAR_TONE: Record<ReceiptPayload["verdict"], string> = {
  grounded: "bg-emerald-400",
  ungrounded: "bg-amber-400",
  silent_failure: "bg-amber-400",
  error: "bg-red-400",
};

const GENESIS = "0".repeat(64);

function shortHash(hash: string): string {
  return hash === GENESIS ? "genesis" : hash.slice(0, 10);
}

function timeOf(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

function ReceiptRow({ receipt }: { receipt: ReceiptPayload }) {
  const passed = receipt.checks.filter((check) => check.passed).length;

  return (
    <li className="rise px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] text-panel-ink">
            {receipt.function}
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-panel-muted">
            {timeOf(receipt.timestamp)} · {receipt.id}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
            VERDICT_TONE[receipt.verdict],
          )}
        >
          {VERDICT_LABEL[receipt.verdict]}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="h-[3px] flex-1 bg-panel-line">
          <div
            className={cn("h-full", BAR_TONE[receipt.verdict])}
            style={{ width: `${Math.round(receipt.grounding_score * 100)}%` }}
          />
        </div>
        <span className="font-mono text-[9px] tabular-nums text-panel-muted">
          {Math.round(receipt.grounding_score * 100)}%
        </span>
      </div>

      <dl className="mt-3 space-y-1.5">
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-panel-muted">
            claimed
          </dt>
          <dd className="line-clamp-2 break-all font-mono text-[10px] leading-relaxed text-panel-muted">
            {receipt.claimed}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-panel-muted">
            actual
          </dt>
          <dd className="line-clamp-2 break-all font-mono text-[10px] leading-relaxed text-panel-ink">
            {receipt.actual}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-panel-muted/70">
        <span title={receipt.hash}>sha {shortHash(receipt.hash)}</span>
        <span aria-hidden className="text-panel-line">
          ←
        </span>
        <span title={receipt.prev_hash}>prev {shortHash(receipt.prev_hash)}</span>
        <span className="ml-auto">
          {passed}/{receipt.checks.length} checks
        </span>
      </div>
    </li>
  );
}

function LedgerBody({
  receipts,
  breaks,
  consoleUrl,
  onClose,
}: {
  receipts: ReceiptPayload[];
  breaks: number;
  consoleUrl: string;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-panel-line pl-5 pr-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-panel-ink">
          <ShieldCheck className="size-3.5 text-emerald-400" aria-hidden />
          trust ledger
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tabular-nums text-panel-muted">
            {String(receipts.length).padStart(2, "0")}
          </span>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close trust ledger"
              className="grid size-8 place-items-center text-panel-muted transition-colors hover:text-panel-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-b border-panel-line px-5 py-3.5">
        {receipts.length === 0 ? (
          <p className="text-[11px] leading-relaxed text-panel-muted">
            No actions yet. Every tool call lands here with a verdict and a
            hash, linked to the previous receipt.
          </p>
        ) : (
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-panel-muted">
            <span
              aria-hidden
              className={cn(
                "size-1.5",
                breaks === 0 ? "bg-emerald-400" : "bg-red-400",
              )}
            />
            {breaks === 0
              ? `hash chain intact · ${receipts.length} ${
                  receipts.length === 1 ? "link" : "links"
                }`
              : `${breaks} broken ${breaks === 1 ? "link" : "links"}`}
          </p>
        )}
      </div>

      <ol className="scroll-thin-dark min-h-0 flex-1 divide-y divide-panel-line overflow-y-auto">
        {[...receipts].reverse().map((receipt) => (
          <ReceiptRow key={receipt.id} receipt={receipt} />
        ))}
      </ol>

      <footer className="shrink-0 border-t border-panel-line px-5 py-4">
        <p className="text-[11px] leading-relaxed text-panel-muted">
          Deterministic: claimed vs. actual, no LLM judge. Grounding scores are
          always estimates.
        </p>
        <a
          href={`${consoleUrl}/traces`}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-panel-ink transition-colors hover:text-emerald-400"
        >
          open console
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </footer>
    </>
  );
}

export function TrustLedger({
  receipts,
  breaks,
  consoleUrl,
}: {
  receipts: ReceiptPayload[];
  breaks: number;
  consoleUrl: string;
}) {
  return (
    <aside className="hidden w-[400px] shrink-0 flex-col border-l border-panel-line bg-panel lg:flex">
      <LedgerBody receipts={receipts} breaks={breaks} consoleUrl={consoleUrl} />
    </aside>
  );
}

export function LedgerDrawer({
  receipts,
  breaks,
  consoleUrl,
  onClose,
}: {
  receipts: ReceiptPayload[];
  breaks: number;
  consoleUrl: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close trust ledger"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        role="dialog"
        aria-label="Trust ledger"
        className="slide-in absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col border-l border-panel-line bg-panel"
      >
        <LedgerBody
          receipts={receipts}
          breaks={breaks}
          consoleUrl={consoleUrl}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
