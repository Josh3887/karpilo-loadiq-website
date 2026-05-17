import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, RadioTower, ShieldCheck } from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { LOADIQ_BRAND, LOADIQ_ROUTES } from "@/config/loadiq";

export const metadata: Metadata = {
  title: "iAtion Intelligence Systems | Karpilo LoadIQ",
  description:
    "Learn how iAtion and iAtion Core support educational guidance and freight intelligence inside the authenticated Karpilo LoadIQ app.",
};

const websiteDisclaimer =
  "iAtion and iAtion Core are described for informational and marketing purposes on this website. Functional iAtion and iAtion Core experiences are available only inside the authenticated Karpilo LoadIQ application when enabled. Website content does not provide financial, legal, tax, compliance, dispatch, or operational advice.";

const proprietaryStatement =
  "iAtion and iAtion Core are proprietary intelligence concepts and branded systems of Karpilo Endeavor Technologies for use within Karpilo LoadIQ and related future platforms. System behavior, educational guidance, freight intelligence methods, interface design, terminology, workflows, and operating concepts are proprietary and subject to ongoing development.";

const iationPoints = [
  "Explains app pages, feature tiles, buttons, dialogs, settings, and workflows.",
  "Supports onboarding and day-to-day feature understanding inside Karpilo LoadIQ.",
  "Teaches how to use app tools without making operational decisions for the user.",
];

const corePoints = [
  "Interprets calculated freight outputs, margin pressure, deadhead impact, and fuel exposure.",
  "Frames broker traffic, road signals, and negotiation context around entered load data.",
  "Explains significance without overriding the deterministic Karpilo LoadIQ calculator.",
];

export default function IationPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(239,68,68,0.16),transparent_30%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8">
        <UniversalBackButton />

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 py-2 pl-2 pr-5 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-sky-300/25 bg-[#020617]">
                <Image
                  src="/brand/iation-core-mark.png"
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              <span>
                Proprietary Intelligence Systems
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              iAtion teaches the app. iAtion Core interprets the freight.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Karpilo LoadIQ separates educational app guidance from freight
              intelligence so operators can understand both the software
              workflow and the operational meaning of calculated load outputs.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={LOADIQ_ROUTES.demo}
                className="inline-flex items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/20"
              >
                View Karpilo LoadIQ
              </Link>
              <Link
                href={LOADIQ_ROUTES.pricing}
                className="inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20"
              >
                See Access Options
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-sky-400/25 bg-[#0B1120]/82 p-4 shadow-[0_0_70px_rgba(56,189,248,0.12)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.14),transparent_34%)]" />
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <Image
                src="/brand/iation-core-hero.jpg"
                alt="iAtion Core freight intelligence visual"
                width={1200}
                height={900}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 pb-20 sm:px-8 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[2rem] border border-sky-400/20 bg-[#0B1120]/82 shadow-[0_0_44px_rgba(56,189,248,0.08)]">
          <div className="relative h-72">
            <Image
              src="/brand/iation-philosophy-hero.jpg"
              alt="iAtion educational guidance visual"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/35 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-sky-300/25 bg-sky-400/10">
                <Image
                  src="/brand/iation-signal-active-icon.webp"
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                  iAtion
                </p>
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  Educational Guidance
                </h2>
              </div>
            </div>

            <p className="mt-5 leading-7 text-slate-300">
              iAtion is the educational guidance layer for Karpilo LoadIQ. It
              explains how to navigate features, interpret app surfaces, and
              understand what each workflow is designed to do.
            </p>

            <ul className="mt-6 grid gap-3">
              {iationPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300"
                >
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-red-400/20 bg-[#0B1120]/82 shadow-[0_0_44px_rgba(239,68,68,0.08)]">
          <div className="relative h-72">
            <Image
              src="/brand/iation-core-hero.jpg"
              alt="iAtion Core operational freight intelligence visual"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/35 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-red-300/25 bg-red-500/10">
                <Image
                  src="/brand/iation-core-freight-intelligence-icon.webp"
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
                  iAtion Core
                </p>
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  Freight Intelligence
                </h2>
              </div>
            </div>

            <p className="mt-5 leading-7 text-slate-300">
              iAtion Core is the freight intelligence layer for calculated load
              outputs. It helps explain the significance of margin pressure,
              fuel exposure, deadhead impact, broker traffic, road signals, and
              user operational metrics.
            </p>

            <ul className="mt-6 grid gap-3">
              {corePoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300"
                >
                  <RadioTower className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6 sm:p-8">
            <ShieldCheck className="h-8 w-8 text-sky-300" />
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white">
              Website disclosure only.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Functional iAtion and iAtion Core behavior belongs inside the
              authenticated {LOADIQ_BRAND.productName} application. This page
              explains the system roles and proprietary concept without adding
              AI calls, API keys, or app-only behavior to the website.
            </p>
          </div>

          <div className="grid gap-5">
            <DisclosureCard title="Website Disclaimer" body={websiteDisclaimer} />
            <DisclosureCard
              title="Proprietary Statement"
              body={proprietaryStatement}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function DisclosureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
        {title}
      </p>
      <p className="mt-4 text-sm leading-7 text-slate-400">{body}</p>
    </div>
  );
}
