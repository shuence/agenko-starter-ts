"use client";

import { SUGGESTIONS } from "@/lib/knowledge";

export function EmptyState({
  onPick,
  disabled = false,
}: {
  onPick: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rise flex min-h-[calc(100dvh-19rem)] flex-col justify-center">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        <span className="size-1.5 bg-accent" aria-hidden />
        Trust boundary · live receipts
      </div>

      <h1 className="mt-5 max-w-xl font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
        Chat with an agent you can{" "}
        <span className="text-accent">audit</span>.
      </h1>

      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-soft">
        Every tool call produces an Agenko receipt — what the agent claimed,
        what actually ran, a deterministic verdict, and a hash chained to the
        previous receipt. Irreversible actions stop until you approve them.
      </p>

      <div className="mt-8 grid gap-2 sm:grid-cols-3">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={suggestion.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(suggestion.prompt)}
            className="group border border-line bg-paper px-3.5 py-3 text-left transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              0{index + 1} · {suggestion.label}
            </span>
            <span className="mt-1.5 block text-[13px] leading-snug text-soft transition-colors group-hover:text-ink">
              {suggestion.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
