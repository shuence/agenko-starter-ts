"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { chainBreaks, collectReceipts } from "@/lib/receipts";
import type { AgenkoMessage } from "@/lib/types";
import { ChatHeader } from "./chat-header";
import { EmptyState } from "./empty-state";
import { MessageList } from "./message-list";
import { PromptInput } from "./prompt-input";
import { LedgerDrawer, TrustLedger } from "./trust-ledger";

const transport = new DefaultChatTransport({ api: "/api/chat" });

function friendlyError(error: Error): string {
  const message = error.message || "Something went wrong.";
  if (/401|403|unauthorized|unauthenticated|api[_ -]?key|credential/i.test(message)) {
    return "The AI Gateway rejected the request. Check AI_GATEWAY_API_KEY in .env, then restart the dev server.";
  }
  if (/failed to fetch|network/i.test(message)) {
    return "Could not reach /api/chat. Is the dev server still running?";
  }
  return message;
}

export function Chat({
  model,
  consoleUrl,
  configured,
  user,
}: {
  model: string;
  consoleUrl: string;
  configured: boolean;
  user: string;
}) {
  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    clearError,
    addToolApprovalResponse,
  } = useChat<AgenkoMessage>({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  const [ledgerOpen, setLedgerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);

  const busy = status === "submitted" || status === "streaming";
  const receipts = useMemo(() => collectReceipts(messages), [messages]);
  const breaks = useMemo(() => chainBreaks(receipts), [receipts]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !nearBottom.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (value: string) => {
    if (!value.trim() || busy || !configured) return;
    nearBottom.current = true;
    sendMessage({ parts: [{ type: "text", text: value.trim() }] });
  };

  return (
    <div className="flex h-dvh flex-col bg-paper">
      <ChatHeader
        model={model}
        receipts={receipts.length}
        busy={busy}
        configured={configured}
        user={user}
        onOpenLedger={() => setLedgerOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <main id="chat" className="flex min-w-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            onScroll={() => {
              const el = scrollRef.current;
              if (!el) return;
              nearBottom.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 96;
            }}
            className="scroll-thin min-h-0 flex-1 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
              {messages.length === 0 ? (
                <EmptyState onPick={send} disabled={!configured} />
              ) : (
                <MessageList
                  messages={messages}
                  status={status}
                  onApproval={addToolApprovalResponse}
                />
              )}
            </div>
          </div>

          <div className="border-t border-line bg-paper">
            <div className="mx-auto w-full max-w-3xl space-y-2.5 px-4 pb-4 pt-3 sm:px-6 lg:px-8">
              {!configured ? (
                <div className="border border-amber-200 bg-amber-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-amber-800">
                  No AI Gateway key. Add <code>AI_GATEWAY_API_KEY</code> to{" "}
                  <code>.env</code> and restart the dev server.
                </div>
              ) : null}

              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] leading-snug text-red-700"
                >
                  <span className="flex-1">{friendlyError(error)}</span>
                  <button
                    type="button"
                    onClick={clearError}
                    aria-label="Dismiss error"
                    className="text-red-500 transition-colors hover:text-red-700"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
              ) : null}

              <PromptInput
                busy={busy}
                disabled={!configured}
                onSend={send}
                onStop={stop}
              />

              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                irreversible actions pause for approval · every call leaves a
                receipt
              </p>
            </div>
          </div>
        </main>

        <TrustLedger
          receipts={receipts}
          breaks={breaks}
          consoleUrl={consoleUrl}
        />
      </div>

      {ledgerOpen ? (
        <LedgerDrawer
          receipts={receipts}
          breaks={breaks}
          consoleUrl={consoleUrl}
          onClose={() => setLedgerOpen(false)}
        />
      ) : null}
    </div>
  );
}
