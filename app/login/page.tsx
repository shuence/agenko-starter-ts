import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";
import { DEMO_COOKIE } from "@/lib/auth";
import { Wordmark } from "@/components/site/chrome";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Agenko starter chat demo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const jar = await cookies();
  if (jar.get(DEMO_COOKIE)?.value) redirect("/chat");

  const { next } = await searchParams;
  const target = next?.startsWith("/") ? next : "/chat";

  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1fr_0.9fr]">
      {/* Form */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 lg:px-10">
          <Wordmark />
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
          >
            Home
          </Link>
        </div>

        <main className="flex flex-1 items-center px-5 pb-16 lg:px-10">
          <div className="mx-auto w-full max-w-[380px]">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              <span aria-hidden className="size-1.5 bg-accent" />
              Demo access
            </p>
            <h1 className="mt-4 font-display text-[2.05rem] font-medium leading-[1.08] tracking-[-0.025em] text-ink">
              Sign in to the chat.
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-soft">
              Ten seconds in, you can ask for a refund and watch the agent stop
              at an approval gate.
            </p>

            <div className="mt-8">
              <LoginForm next={target} />
            </div>
          </div>
        </main>
      </div>

      {/* Panel */}
      <aside className="hidden border-l border-panel-line bg-panel p-10 text-panel-ink lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center justify-between border-b border-panel-line pb-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-panel-muted">
            sample receipt
          </span>
          <span className="border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-400">
            grounded
          </span>
        </div>

        <div className="my-10 space-y-4">
          <p className="font-mono text-[11px] text-panel-muted">
            issue_refund
          </p>
          <dl className="space-y-2 border-y border-panel-line py-4 font-mono text-[10px]">
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 uppercase tracking-[0.1em] text-panel-muted">
                claimed
              </dt>
              <dd className="text-panel-ink">issue_refund</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 uppercase tracking-[0.1em] text-panel-muted">
                actual
              </dt>
              <dd className="break-all text-panel-muted">
                {`{"status":"refunded","amount_usd":40}`}
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-16 shrink-0 uppercase tracking-[0.1em] text-panel-muted">
                hash
              </dt>
              <dd className="truncate text-panel-muted">
                7c2e19ab… ← prev genesis
              </dd>
            </div>
          </dl>
          <p className="max-w-sm font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-panel-ink">
            “The model can plan anything. It still can&apos;t spend money
            without you.”
          </p>
        </div>

        <div className="border-t border-panel-line pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-panel-muted">
          deterministic · no llm judge · hash-chained
        </div>
      </aside>
    </div>
  );
}
