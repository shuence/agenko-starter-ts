"use client";

import { ArrowUp, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PromptInput({
  busy,
  disabled = false,
  onSend,
  onStop,
}: {
  busy: boolean;
  disabled?: boolean;
  onSend: (value: string) => void;
  onStop: () => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || busy || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "border bg-paper transition-colors",
        busy ? "border-line" : "border-line-strong focus-within:border-ink",
      )}
    >
      <label htmlFor="prompt" className="sr-only">
        Message the agent
      </label>
      <textarea
        id="prompt"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder={
          disabled
            ? "Add AI_GATEWAY_API_KEY to .env to start…"
            : "Ask about Agenko, or approve a refund…"
        }
        className="scroll-thin block max-h-[200px] w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint disabled:cursor-not-allowed"
        aria-describedby="prompt-hint"
      />

      <div className="flex items-center justify-between gap-3 px-3 pb-2.5 pt-1.5">
        <span
          id="prompt-hint"
          className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-faint sm:inline"
        >
          enter to send · shift+enter for a new line
        </span>
        <span className="sm:hidden" />

        {busy ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1.5 border border-line-strong px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-ink hover:text-ink"
          >
            <Square className="size-3" aria-hidden />
            stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || value.trim().length === 0}
            className="flex items-center gap-1.5 bg-ink px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-paper"
          >
            send
            <ArrowUp className="size-3" aria-hidden />
          </button>
        )}
      </div>
    </form>
  );
}
