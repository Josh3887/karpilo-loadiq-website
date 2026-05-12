import Link from "next/link";

import {
  COMPANY_NAME,
  LEGAL_LAST_UPDATED,
  SUPPORT_EMAIL,
  legalNavigation,
} from "@/config/legal";

type LegalPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  lastUpdated?: string;
};

export function LegalPageShell({
  title,
  description,
  children,
  lastUpdated = LEGAL_LAST_UPDATED,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_82%_16%,rgba(239,68,68,0.12),transparent_28%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.11] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 md:py-20">
          <Link
            href="/"
            className="text-xs font-black uppercase tracking-[0.24em] text-sky-300 transition hover:text-sky-200"
          >
            {COMPANY_NAME}
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {description}
              </p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Last updated: {lastUpdated}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5 shadow-[0_0_32px_rgba(56,189,248,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                Compliance Contact
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 block break-all text-sm font-bold leading-6 text-slate-100 transition hover:text-sky-200"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          <nav
            aria-label="Legal sections"
            className="mt-10 flex gap-2 overflow-x-auto pb-2"
          >
            {legalNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 transition hover:border-sky-300/35 hover:bg-sky-400/10 hover:text-sky-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:px-8 md:py-16">
        {children}
      </section>
    </main>
  );
}
