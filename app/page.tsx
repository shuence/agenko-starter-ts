import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";

function HeroPanel() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -left-3 -top-3 size-20 bg-accent/10"
      />
      <div className="relative border border-panel-line bg-panel text-panel-ink shadow-[0_30px_80px_rgba(10,10,11,0.22)]">
        <div className="flex items-center justify-between border-b border-panel-line px-4 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-panel-muted">
            agent run · live
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-400">
            <span aria-hidden className="size-1.5 bg-emerald-400" />
            chain intact
          </span>
        </div>

        <div className="space-y-3 p-4 text-[12.5px] leading-relaxed">
          <p className="ml-auto w-fit max-w-[88%] border border-panel-line bg-panel-2 px-3 py-2 text-panel-ink">
            Refund Ada $40 for the duplicate charge.
          </p>

          <div className="border border-panel-line">
            <div className="flex items-center justify-between border-b border-panel-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em]">
              <span className="text-panel-ink">issue_refund</span>
              <span className="text-red-400">irreversible</span>
            </div>
            <pre className="px-3 py-2 font-mono text-[10px] leading-relaxed text-panel-muted">
{`{
  "customer_email": "ada@example.com",
  "amount": 40
}`}
            </pre>
            <div className="flex items-center justify-between gap-2 border-t border-accent/40 bg-accent/10 px-3 py-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent-soft">
                approval required
              </span>
              <span className="flex gap-1.5">
                <span className="bg-panel-ink px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-panel">
                  approve
                </span>
                <span className="border border-panel-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-panel-muted">
                  deny
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border border-panel-line bg-panel-2 px-3 py-2 font-mono text-[9px] text-panel-muted">
            <span className="text-emerald-400">grounded · 100%</span>
            <span className="truncate">sha 7c2e19ab ← prev genesis</span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-panel-muted/70">
            no side effect ran before approval
          </p>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    n: "01",
    title: "A receipt for every action",
    body: "Claimed vs. actual, what tool ran, a grounding score and a deterministic verdict. No LLM judge, no inference sold as measurement.",
  },
  {
    n: "02",
    title: "A gate before anything irreversible",
    body: "Refunds and deletions pause mid-stream. Nothing executes until a human approves — and a denial is recorded, not retried.",
  },
  {
    n: "03",
    title: "A hash chain you can verify",
    body: "Every receipt carries a SHA-256 hash linked to the previous one. Edit history in the middle and the chain breaks in the UI.",
  },
  {
    n: "04",
    title: "Any model, one loop",
    body: "Built on AI SDK 7 and Vercel AI Gateway. Swap a model slug, keep the tools, the approval policy and the receipts.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "The agent acts",
    body: "A multi-step tool loop reads the question, picks a tool and streams its reasoning and output.",
  },
  {
    n: "02",
    title: "Agenko checks",
    body: "Each execution is wrapped in agenko.check(). The receipt is computed in-process and streamed as a UI part.",
  },
  {
    n: "03",
    title: "You decide",
    body: "Irreversible calls stop at an approval card. The ledger links the decision to the receipt chain.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-line">
          <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                <span className="text-accent">Next.js 16</span>
                <span aria-hidden className="text-faint">
                  /
                </span>
                <span>AI SDK 7</span>
                <span aria-hidden className="text-faint">
                  /
                </span>
                <span>@agenko/sdk</span>
              </p>

              <h1 className="mt-5 max-w-[16ch] font-display text-[2.6rem] font-medium leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.1rem] lg:text-[3.55rem]">
                Chat with an agent you can{" "}
                <span className="text-accent">audit</span>.
              </h1>

              <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-soft">
                A production-shaped AI chat starter: streaming tool loop, human
                approval gates and a tamper-evident receipt for every action.
                Clone it, point it at any model, ship it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
                >
                  Launch the demo
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <a
                  href="https://github.com/agenko-ai/agenko"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-soft transition-colors hover:border-ink hover:text-ink"
                >
                  Read the source
                </a>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-line border-y border-line">
                {[
                  ["Receipts", "every call"],
                  ["Approvals", "irreversible only"],
                  ["Models", "gateway slugs"],
                ].map(([label, detail]) => (
                  <div key={label} className="px-3 py-3 first:pl-0">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                      {detail}
                    </dt>
                    <dd className="mt-1 font-mono text-[11px] text-ink">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <HeroPanel />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-line">
          <div className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  What makes it different
                </p>
                <h2 className="mt-3 max-w-xl font-display text-[1.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.2rem]">
                  Trust is a primitive here, not a dashboard you bolt on.
                </h2>
              </div>
              <p className="max-w-xs text-[13px] leading-relaxed text-muted">
                The receipts are computed from what actually executed. No
                sampling, no judge model, no green checkmarks you have to trust.
              </p>
            </div>

            <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <article
                  key={feature.n}
                  className="group bg-paper p-6 transition-colors hover:bg-surface lg:p-8"
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] text-faint">
                    {feature.n}
                  </span>
                  <h3 className="mt-8 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[13.5px] leading-relaxed text-soft">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-line bg-surface/60">
          <div className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              The loop
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-[1.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.2rem]">
              Model, tools, receipt, human. In that order.
            </h2>

            <ol className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="bg-paper p-6 lg:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[2.1rem] font-medium leading-none tracking-[-0.02em] text-accent">
                      {step.n}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                      {step.n === "03" ? "human" : "automatic"}
                    </span>
                  </div>
                  <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-soft">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Inside */}
        <section id="inside" className="border-b border-line bg-panel text-panel-ink">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-panel-muted">
                Inside the starter
              </p>
              <h2 className="mt-3 max-w-md font-display text-[1.85rem] font-medium leading-[1.12] tracking-[-0.025em] text-panel-ink sm:text-[2.2rem]">
                The transcript and the proof, side by side.
              </h2>
              <ul className="mt-8 space-y-3 font-mono text-[11px] text-panel-muted">
                {[
                  "Tool calls render as compact, expandable cards",
                  "Receipts stream in as the agent works",
                  "Verdicts: grounded · silent failure · error · ungrounded",
                  "Chain status recomputes on every link",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1 shrink-0 bg-emerald-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="border border-panel-line bg-panel-2 p-2">
              <Image
                src="/preview.png"
                alt="The starter chat with tool cards, receipt chips, an approval gate and the trust ledger"
                width={1440}
                height={900}
                className="h-auto w-full"
                priority
              />
              <figcaption className="px-2 pb-1 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-panel-muted">
                Chat · receipts · approval gate · ledger
              </figcaption>
            </figure>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 py-16 sm:flex-row sm:items-center lg:px-8 lg:py-20">
            <div>
              <h2 className="max-w-xl font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.45rem]">
                Run the starter. Try the gate.
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-soft">
                The demo signs you in locally — no account, no database, no
                card. Ask for a refund and watch it stop.
              </p>
            </div>
            <Link
              href="/login"
              className="group inline-flex shrink-0 items-center gap-2 bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-accent"
            >
              Open the demo
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
