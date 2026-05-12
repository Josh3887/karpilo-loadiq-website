import type { Metadata } from "next";
import Link from "next/link";

import { LegalContent } from "@/components/legal/legal-content";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { legalCenterSections, legalNavigation, legalPages } from "@/config/legal";

export const metadata: Metadata = {
  title: "Legal Center | Karpilo Endeavor Technologies",
  description:
    "Legal, privacy, subscription, refund, cookie, payment, and compliance policies for Karpilo Endeavor Technologies LLC products.",
};

export default function LegalCenterPage() {
  return (
    <LegalPageShell
      title="Legal Center"
      description="A production-grade policy hub for Karpilo LoadIQ, future Karpilo FleetOS releases, payment flows, data practices, subscriptions, and support requests."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {legalNavigation
          .filter((item) => item.href !== "/legal")
          .map((item) => {
            const page = Object.values(legalPages).find(
              (candidate) => `/legal/${candidate.slug}` === item.href,
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-[#0B1120]/85 p-6 shadow-[0_0_34px_rgba(56,189,248,0.06)] transition hover:-translate-y-1 hover:border-sky-300/35 hover:bg-sky-400/10"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
                  Policy
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] text-white">
                  {page?.title ?? item.label}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {page?.description ?? "Legal and compliance reference."}
                </p>
              </Link>
            );
          })}
      </div>

      <div className="mt-8">
        <LegalContent sections={legalCenterSections} />
      </div>
    </LegalPageShell>
  );
}
