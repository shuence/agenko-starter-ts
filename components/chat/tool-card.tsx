"use client";

import type { ChatAddToolApproveResponseFunction, ToolUIPart } from "ai";
import {
  Calculator,
  ChevronDown,
  Mail,
  RotateCcw,
  Search,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { StarterTools } from "@/lib/types";
import { cn } from "@/lib/utils";

type ToolPart = ToolUIPart<StarterTools>;

const ICONS: Record<string, LucideIcon> = {
  search_knowledge: Search,
  calculator: Calculator,
  send_email: Mail,
  issue_refund: RotateCcw,
  delete_account: Trash2,
};

const IRREVERSIBLE = new Set(["issue_refund", "delete_account"]);

const STATE_LABEL: Record<string, string> = {
  "input-streaming": "receiving input",
  "input-available": "running",
  "approval-requested": "awaiting approval",
  "approval-responded": "decision recorded",
  "output-available": "completed",
  "output-error": "error",
  "output-denied": "denied",
};

function prettify(value: unknown): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/** One-line preview of a tool payload, so the transcript stays scannable. */
function summarize(value: unknown, max = 96): string {
  if (value === undefined || value === null) return "";
  let text: string;
  if (typeof value === "string") {
    text = value;
  } else {
    try {
      text = JSON.stringify(value);
    } catch {
      text = String(value);
    }
  }
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function Header({
  toolName,
  irreversible,
  state,
  awaiting,
  withChevron,
}: {
  toolName: string;
  irreversible: boolean;
  state: string;
  awaiting: boolean;
  withChevron: boolean;
}) {
  const Icon = ICONS[toolName] ?? Search;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-2",
        awaiting ? "bg-accent-soft" : "bg-surface",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="size-3.5 shrink-0 text-soft" aria-hidden />
        <span className="truncate font-mono text-[11px] tracking-wide text-ink">
          {toolName}
        </span>
        {irreversible ? (
          <span className="shrink-0 border border-red-200 bg-red-50 px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em] text-red-600">
            irreversible
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "font-mono text-[9px] uppercase tracking-[0.12em]",
            awaiting ? "text-accent" : "text-muted",
          )}
        >
          {STATE_LABEL[state] ?? state}
        </span>
        {withChevron ? (
          <ChevronDown
            className="size-3 text-faint transition-transform group-open:rotate-180"
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}

export function ToolCard({
  part,
  toolName,
  onApproval,
}: {
  part: ToolPart;
  toolName: string;
  onApproval: ChatAddToolApproveResponseFunction;
}) {
  const irreversible = IRREVERSIBLE.has(toolName);
  const awaiting =
    part.state === "approval-requested" && part.approval.isAutomatic !== true;
  const input = "input" in part ? part.input : undefined;
  const output =
    part.state === "output-available" ? part.output : undefined;
  const errorText = part.state === "output-error" ? part.errorText : undefined;
  const denied = part.state === "output-denied";

  if (awaiting) {
    return (
      <div className="approval-enter overflow-hidden border border-accent bg-paper">
        <Header
          toolName={toolName}
          irreversible={irreversible}
          state={part.state}
          awaiting
          withChevron={false}
        />
        <div className="space-y-2.5 border-t border-accent/25 px-3 py-2.5">
          <pre className="scroll-thin max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-soft">
            {prettify(input)}
          </pre>
          <div className="space-y-2.5 border-t border-accent/25 pt-2.5">
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                Human approval required
              </p>
              {part.approval.requestReason ? (
                <p className="text-[12.5px] leading-snug text-soft">
                  {part.approval.requestReason}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onApproval({ id: part.approval.id, approved: true })
                }
                className="bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-accent"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() =>
                  onApproval({ id: part.approval.id, approved: false })
                }
                className="border border-line-strong bg-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-ink hover:text-ink"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <details className="group overflow-hidden border border-line bg-paper">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <Header
          toolName={toolName}
          irreversible={irreversible}
          state={part.state}
          awaiting={false}
          withChevron
        />
        {part.state === "input-streaming" ||
        part.state === "input-available" ? (
          <div className="thinking-bar h-px w-full" aria-hidden />
        ) : null}
        <div className="space-y-1 border-t border-line px-3 py-2">
          {input !== undefined ? (
            <p className="truncate font-mono text-[10px] text-muted">
              {summarize(input)}
            </p>
          ) : null}
          {output !== undefined ? (
            <p className="truncate font-mono text-[10px] text-soft">
              <span className="text-faint">→ </span>
              {summarize(output)}
            </p>
          ) : null}
          {errorText ? (
            <p className="truncate font-mono text-[10px] text-red-600">
              {errorText}
            </p>
          ) : null}
          {denied ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-600">
              blocked — no side effect executed
            </p>
          ) : null}
          {part.state === "approval-responded" ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {part.approval.approved ? "approved by you" : "denied by you"}
            </p>
          ) : null}
        </div>
      </summary>

      <div className="space-y-2.5 border-t border-line px-3 py-2.5">
        {input !== undefined ? (
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              input
            </p>
            <pre className="scroll-thin max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-soft">
              {prettify(input)}
            </pre>
          </div>
        ) : null}
        {output !== undefined ? (
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              output
            </p>
            <pre className="scroll-thin max-h-40 overflow-auto whitespace-pre-wrap break-words border-l-2 border-line-strong pl-2.5 font-mono text-[11px] leading-relaxed text-ink">
              {prettify(output)}
            </pre>
          </div>
        ) : null}
      </div>
    </details>
  );
}
