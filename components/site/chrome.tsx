import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-6 place-items-center bg-ink font-mono text-[11px] font-medium text-paper"
      >
        A
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] font-medium tracking-[0.16em]">
          AGENKO
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          starter
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-5 lg:px-8">
        <Wordmark />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 font-mono text-[10px] uppercase tracking-[0.12em] text-muted md:flex"
        >
          <a href="#features" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#inside" className="transition-colors hover:text-ink">
            Inside
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://docs.agenko.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-soft transition-colors hover:border-ink hover:text-ink sm:inline"
          >
            Docs ↗
          </a>
          <Link
            href="/login"
            className="bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:bg-accent"
          >
            Launch demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="space-y-2">
          <Wordmark />
          <p className="max-w-sm text-[12.5px] leading-relaxed text-muted">
            The deterministic trust boundary for AI agents. Receipts after every
            action, a human gate before irreversible ones.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <Link href="/login" className="transition-colors hover:text-ink">
            Demo
          </Link>
          <a
            href="https://docs.agenko.dev"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            Docs ↗
          </a>
          <a
            href="https://github.com/agenko-ai/agenko"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub ↗
          </a>
          <span className="text-faint">Apache 2.0</span>
        </div>
      </div>
    </footer>
  );
}
