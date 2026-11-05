"use client";

import type { ChatAddToolApproveResponseFunction, ToolUIPart } from "ai";
import type { AgenkoMessage, StarterTools } from "@/lib/types";
import { Markdown } from "./markdown";
import { ReceiptChip } from "./receipt-chip";
import { ReasoningBlock, ThinkingRow } from "./thinking";
import { ToolCard } from "./tool-card";

function isToolPart(
  part: AgenkoMessage["parts"][number],
): part is ToolUIPart<StarterTools> {
  return part.type.startsWith("tool-");
}

export function Message({
  message,
  streaming,
  pending,
  onApproval,
}: {
  message: AgenkoMessage;
  streaming: boolean;
  pending: boolean;
  onApproval: ChatAddToolApproveResponseFunction;
}) {
  if (message.role === "user") {
    const text = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");

    return (
      <div className="rise flex justify-end">
        <div className="max-w-[85%] border border-line bg-surface px-4 py-2.5 text-[15px] leading-relaxed text-ink">
          {text}
        </div>
      </div>
    );
  }

  const hasText = message.parts.some(
    (part) => part.type === "text" && part.text.length > 0,
  );
  const hasTool = message.parts.some((part) => isToolPart(part));
  const hasReasoning = message.parts.some(
    (part) => part.type === "reasoning" && part.text.length > 0,
  );

  return (
    <div className="rise">
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <span className="size-1.5 bg-ink" aria-hidden />
        agent
      </div>

      <div className="space-y-3">
        {message.parts.map((part, index) => {
          if (part.type === "reasoning") {
            if (!part.text) return null;
            return (
              <ReasoningBlock
                key={`${message.id}-reasoning-${part.id ?? index}`}
                text={part.text}
                streaming={streaming && part.state !== "done"}
              />
            );
          }

          if (part.type === "text") {
            if (!part.text) return null;
            const isLast = index === message.parts.length - 1;
            return (
              <div key={`${message.id}-text-${index}`}>
                {isLast && streaming ? (
                  <div className="relative">
                    <Markdown text={part.text} />
                    <span className="caret" aria-hidden />
                  </div>
                ) : (
                  <Markdown text={part.text} />
                )}
              </div>
            );
          }

          if (part.type === "data-receipt") {
            return (
              <ReceiptChip
                key={`${message.id}-${part.id ?? index}`}
                receipt={part.data}
              />
            );
          }

          if (isToolPart(part)) {
            return (
              <ToolCard
                key={`${message.id}-${part.toolCallId}`}
                part={part}
                toolName={part.type.slice("tool-".length)}
                onApproval={onApproval}
              />
            );
          }

          return null;
        })}

        {(streaming || pending) && !hasText && !hasReasoning ? (
          <ThinkingRow label={hasTool ? "working" : "thinking"} />
        ) : null}
      </div>
    </div>
  );
}
