"use client";

import type { ChatAddToolApproveResponseFunction } from "ai";
import type { AgenkoMessage } from "@/lib/types";
import { Message } from "./message";
import { ThinkingRow } from "./thinking";

export function MessageList({
  messages,
  status,
  onApproval,
}: {
  messages: AgenkoMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  onApproval: ChatAddToolApproveResponseFunction;
}) {
  const last = messages[messages.length - 1];
  const lastId = last?.id;
  const waiting = status === "submitted" && last?.role === "user";

  return (
    <div className="flex flex-col gap-7">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          streaming={status === "streaming" && message.id === lastId}
          pending={status === "submitted" && message.id === lastId}
          onApproval={onApproval}
        />
      ))}

      {waiting ? (
        <div className="rise">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            <span className="size-1.5 bg-ink" aria-hidden />
            agent
          </div>
          <ThinkingRow label="thinking" />
        </div>
      ) : null}
    </div>
  );
}
