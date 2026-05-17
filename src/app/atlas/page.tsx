import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Layers3, Network, RadioTower, Route, ShieldCheck } from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { LOADIQ_BRAND, LOADIQ_ROUTES } from "@/config/loadiq";

export const metadata: Metadata = {
  title: "Karpilo Atlas Intelligence | Karpilo LoadIQ",
  description:
    "Explore Karpilo Atlas, the embedded operational intelligence architecture behind Karpilo LoadIQ's freight, route, educational, and runtime awareness layers.",
};

const atlasLayers = [
  {
    name: "Karpilo Atlas Core",
    runtime: "K-ATLS-CORE",
    role: "Runtime orchestration, intelligence coordination, and system cognition backbone.",
    description:
      "Atlas Core coordinates the intelligence layers into a unified runtime so operational context can move through Karpilo LoadIQ as infrastructure, not as a detached assistant layer.",
    image: "/branding/atlas/core/karpilo-atlas-core-dashboard-v1.png",
    emblem: "/branding/atlas/core/karpilo-atlas-core-emblem.png",
    icon: Layers3,
    accent: "text-purple-200",
    border: "border-purple-300/25",
    glow: "shadow-[0_0_46px_rgba(168,85,247,0.12)]",
  },
  {
    name: "Atlas Freight Intelligence",
    runtime: "K-ATLS-FI",
    role: "Freight economics, margin pressure, deadhead exposure, and cost awareness.",
    description:
      "Atlas Freight Intelligence interprets calculated load outputs so operators can understand profitability pressure, fuel exposure, and the operational meaning behind a rate.",
    image: "/branding/atlas/freight/karpilo-atlas-freight-dashboard-v1.png",
    emblem: "/branding/atlas/freight/karpilo-atlas-freight-emblem.png",
    icon: RadioTower,
    accent: "text-emerald-200",
    border: "border-emerald-300/25",
    glow: "shadow-[0_0_46px_rgba(16,185,129,0.12)]",
  },
  {
    name: "Atlas Route Intelligence",
    runtime: "K-ATLS-RTE",
    role: "Movement intelligence, corridor flow, route pressure, and timing context.",
    description:
      "Atlas Route Intelligence frames movement, distance pressure, stop complexity, and cyber-highway telemetry without turning the website into a routing tool.",
    image: "/branding/atlas/route/karpilo-atlas-route-dashboard-v1.png",
    emblem: "/branding/atlas/route/karpilo-atlas-route-emblem.png",
    icon: Route,
    accent: "text-red-200",
    border: "border-red-300/25",
    glow: "shadow-[0_0_46px_rgba(239,68,68,0.12)]",
  },
  {
    name: "Atlas Educational Intelligence",
    runtime: "K-ATLS-EDU",
    role: "Contextual operational explanation, workflow meaning, and metric interpretation.",
    description:
      "Atlas Educational Intelligence explains why Karpilo LoadIQ metrics matter and how workflows fit together, while leaving final operational decisions with the user.",
    image: "/branding/atlas/educational/karpilo-atlas-educational-dashboard-v1.png",
    emblem: "/branding/atlas/educational/karpilo-atlas-educational-emblem.png",
    icon: GraduationCap,
    accent: "text-sky-200",
    border: "border-sky-300/25",
    glow: "shadow-[0_0_46px_rgba(56,189,248,0.12)]",
  },
] as const;

const disclosure =
  "Atlas intelligence features are designed to support operational understanding, not replace professional judgment, regulatory compliance responsibility, dispatch authority, or financial decision-making.";

const vendorDisclosure =
  "Certain intelligence processing may be powered by third-party AI infrastructure where applicable.";

const proprietaryStatement =
  "Karpilo Atlas, Atlas Core, Atlas Freight Intelligence, Atlas Route Intelligence, and Atlas Educational Intelligence are proprietary intelligence concepts and branded systems of Karpilo Endeavor Technologies for use within Karpilo LoadIQ and related future platforms.";

export default function AtlasPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <Image
          src="/branding/atlas/backdrops/karpilo-atlas-core-backdrop-vertical-v1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(168,85,247,0.22),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_80%_78%,rgba(239,68,68,0.13),transparent_32%),linear-gradient(to_bottom,rgba(2,6,23,0.88),#020617_70%)]" />
        <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-18 pt-16 sm:px-8">
        <UniversalBackButton />

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-purple-300/20 bg-purple-400/10 py-2 pl-2 pr-5 text-xs font-black uppercase tracking-[0.22em] text-purple-100">
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-purple-300/25 bg-[#020617]">
                <Image
                  src="/branding/atlas/core/karpilo-atlas-core-emblem.png"
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              <span>Embedded Operational Intelligence</span>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              Karpilo Atlas is the intelligence architecture behind Karpilo LoadIQ operational awareness.
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Atlas organizes freight, route, educational, and runtime context into
              a native Karpilo LoadIQ intelligence system. It does not replace
              driver judgment. It makes operational meaning easier to see.
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
                className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/20"
              >
                See Access Options
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/25 bg-[#0B1120]/82 p-4 shadow-[0_0_70px_rgba(168,85,247,0.13)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.12),transparent_34%)]" />
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <Image
                src="/branding/atlas/core/karpilo-atlas-core-dashboard-alt.png"
                alt="Karpilo Atlas Core runtime intelligence visual"
                width={1200}
                height={900}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-4">
          {atlasLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <article
                key={layer.runtime}
                className={`overflow-hidden rounded-[1.75rem] border ${layer.border} bg-[#0B1120]/86 ${layer.glow}`}
              >
                <div className="relative h-44">
                  <Image
                    src={layer.image}
                    alt={`${layer.name} visual system`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/25 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
                    <Icon className={`h-4 w-4 ${layer.accent}`} />
                    <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-100">
                      {layer.runtime}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border ${layer.border} bg-white/[0.04]`}>
                      <Image
                        src={layer.emblem}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-[-0.03em] text-white">
                        {layer.name}
                      </h2>
                      <p className={`mt-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${layer.accent}`}>
                        {layer.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    {layer.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 pb-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[#0B1120]/82 shadow-[0_0_54px_rgba(16,185,129,0.1)]">
          <div className="relative h-72">
            <Image
              src="/branding/atlas/freight/karpilo-atlas-freight-dashboard-alt.png"
              alt="Atlas Freight Intelligence freight economics visual"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/25 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
              Freight Economics
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white">
              Atlas Freight Intelligence interprets the pressure behind the rate.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              Freight intelligence is designed to frame margin pressure,
              deadhead exposure, fuel-cost drag, accessorial context, and load
              profitability interpretation after Karpilo LoadIQ calculates the
              deterministic numbers.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <OperationalCard
            title="Route Intelligence"
            eyebrow="Movement Telemetry"
            body="Atlas Route Intelligence focuses on movement, corridor flow, stop complexity, distance pressure, and timing context. It is route cognition, not a public load board and not fleet dispatch automation."
            icon={<Route className="h-6 w-6 text-red-200" />}
            border="border-red-300/20"
          />
          <OperationalCard
            title="Educational Intelligence"
            eyebrow="Operational Understanding"
            body="Atlas Educational Intelligence explains the operational meaning behind Karpilo LoadIQ metrics and workflows so the system can teach context without becoming an onboarding screen or decision-maker."
            icon={<GraduationCap className="h-6 w-6 text-sky-200" />}
            border="border-sky-300/20"
          />
          <OperationalCard
            title="Core Runtime"
            eyebrow="Unified Infrastructure"
            body="Atlas Core keeps the layers coordinated as embedded intelligence infrastructure. Users experience Atlas as native Karpilo LoadIQ awareness, not as a website widget or detached assistant."
            icon={<Network className="h-6 w-6 text-purple-200" />}
            border="border-purple-300/20"
          />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6 sm:p-8">
            <ShieldCheck className="h-8 w-8 text-sky-300" />
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white">
              Website preview only.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Functional Atlas behavior belongs inside the authenticated {LOADIQ_BRAND.productName}
              application. This website introduces the intelligence architecture
              and proprietary operating concepts without adding provider calls, API
              keys, live chat, or app-only behavior.
            </p>
          </div>

          <div className="grid gap-5">
            <DisclosureCard title="Operational Disclosure" body={disclosure} />
            <DisclosureCard title="Infrastructure Disclosure" body={vendorDisclosure} />
            <DisclosureCard title="Proprietary Statement" body={proprietaryStatement} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function OperationalCard({
  title,
  eyebrow,
  body,
  icon,
  border,
}: {
  title: string;
  eyebrow: string;
  body: string;
  icon: ReactNode;
  border: string;
}) {
  return (
    <article className={`rounded-[2rem] border ${border} bg-[#0B1120]/82 p-6 sm:p-8`}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          {icon}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">
            {title}
          </h3>
        </div>
      </div>
      <p className="mt-5 leading-7 text-slate-300">{body}</p>
    </article>
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
