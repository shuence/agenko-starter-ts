"use client";

import { Brain } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span className={cn("thinking-dots", className)} aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

/** Shown before the first token of a response arrives. */
export function ThinkingRow({ label = "thinking" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
    >
      <ThinkingDots className="text-accent" />
      {label}
      <span className="thinking-bar ml-1 h-px w-16" aria-hidden />
    </div>
  );
}

/**
 * Model reasoning, as it streams. Open while the model is thinking, then
 * collapsible so the final answer stays the focus.
 */
export function ReasoningBlock({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const open = streaming ? true : !collapsed;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <details
      open={open}
      onToggle={(event) => {
        if (!streaming) setCollapsed(!event.currentTarget.open);
      }}
      className="group border border-line bg-surface/70"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          <Brain className="size-3 text-faint" aria-hidden />
          thinking
          {streaming ? <ThinkingDots className="text-accent" /> : null}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
          {streaming ? "streaming" : `${words} words`}
        </span>
      </summary>

      <div className="scroll-thin max-h-48 overflow-y-auto whitespace-pre-wrap border-t border-line px-3 py-2 text-[12px] leading-relaxed text-muted">
        {text}
        {streaming ? <span className="caret ml-0.5 align-baseline" aria-hidden /> : null}
      </div>
    </details>
  );
}
