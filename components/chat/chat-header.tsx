"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DEMO_COOKIE } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function ChatHeader({
  model,
  receipts,
  busy,
  configured,
  user,
  onOpenLedger,
}: {
  model: string;
  receipts: number;
  busy: boolean;
  configured: boolean;
  user: string;
  onOpenLedger: () => void;
}) {
  const router = useRouter();

  const signOut = () => {
    document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-5 place-items-center bg-ink font-mono text-[10px] font-medium text-paper"
          >
            A
          </span>
          <span className="font-mono text-[12px] font-medium tracking-[0.16em]">
            AGENKO
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            starter
          </span>
        </Link>

        <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />

        <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:flex">
          <span
            aria-hidden
            className={cn(
              "size-1.5",
              !configured
                ? "bg-amber-500"
                : busy
                  ? "animate-pulse bg-accent"
                  : "bg-emerald-500",
            )}
          />
          {!configured
            ? "key missing"
            : busy
              ? "agent running"
              : "gateway ready"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden max-w-[200px] truncate border border-line px-2 py-1 font-mono text-[10px] text-muted lg:inline">
          {model}
        </span>

        <span className="hidden max-w-[180px] truncate font-mono text-[10px] text-soft md:inline">
          {user}
        </span>

        <button
          type="button"
          onClick={onOpenLedger}
          className="flex items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-ink hover:text-ink lg:hidden"
        >
          ledger
          <span className="tabular-nums text-muted">{receipts}</span>
        </button>

        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          title="Sign out"
          className="grid size-8 place-items-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
        >
          <LogOut className="size-3.5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
