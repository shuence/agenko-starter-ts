"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { DEMO_COOKIE, DEMO_USER } from "@/lib/auth";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password needs at least 4 characters.");
      return;
    }

    setBusy(true);
    // Dummy session: a cookie the demo proxy can read. Replace with real auth.
    document.cookie = `${DEMO_COOKIE}=${encodeURIComponent(
      value,
    )}; path=/; max-age=604800; samesite=lax`;
    router.push(next);
  };

  return (
    <form onSubmit={signIn} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
        >
          Work email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          placeholder="you@company.com"
          className="h-11 w-full border border-line-strong bg-paper px-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
          >
            Password
          </label>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
            any value
          </span>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(null);
          }}
          placeholder="••••••••"
          className="h-11 w-full border border-line-strong bg-paper px-3 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink"
        />
      </div>

      {error ? (
        <p role="alert" className="font-mono text-[11px] text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="group flex h-11 w-full items-center justify-between bg-ink px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? "signing in…" : "Continue to the demo"}
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={() => {
          setEmail(DEMO_USER);
          setPassword("demo1234");
          setError(null);
        }}
        className="h-11 w-full border border-line-strong font-mono text-[10px] uppercase tracking-[0.14em] text-soft transition-colors hover:border-ink hover:text-ink"
      >
        Fill the demo account
      </button>

      <p className="pt-1 text-[11.5px] leading-relaxed text-muted">
        Dummy auth for the starter: any email and a 4+ character password works.
        It sets a local cookie — no account, database or email is created.
      </p>

      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
        <Link href="/" className="transition-colors hover:text-ink">
          ← Back to the landing page
        </Link>
      </p>
    </form>
  );
}
