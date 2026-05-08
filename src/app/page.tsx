"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Fuel,
  Gauge,
  MapPinned,
  Radar,
  Route,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const features = [
  {
    icon: Calculator,
    title: "True Load Profitability",
    description:
      "Calculate fuel, deadhead, overhead, accessorials, operating cost, RPM, and margin before accepting the load.",
  },
  {
    icon: Fuel,
    title: "Fuel & Cost Awareness",
    description:
      "See how fuel burn, route conditions, distance, and empty miles affect your real take-home number.",
  },
  {
    icon: Route,
    title: "Deadhead Intelligence",
    description:
      "Expose unpaid miles before they destroy the week. Make empty miles pay through smarter load decisions.",
  },
  {
    icon: BarChart3,
    title: "Margin Clarity",
    description:
      "Stop guessing. View gross, net, RPM, cost-per-mile, and profit spread in one operational cockpit.",
  },
  {
    icon: Gauge,
    title: "Dispatch Decision Support",
    description:
      "Built for fast go/no-go decisions when brokers are calling, clocks are running, and margins are thin.",
  },
  {
    icon: ShieldCheck,
    title: "Carrier Discipline",
    description:
      "Turn every load into a measured decision instead of a gamble dressed up as revenue.",
  },
];

const stats = [
  { value: "CPM", label: "Operating cost visibility" },
  { value: "RPM", label: "Rate-per-mile clarity" },
  { value: "Net", label: "Real load profit" },
  { value: "DH", label: "Deadhead exposure" },
];

const painPoints = [
  "Gross revenue makes bad loads look good.",
  "Deadhead gets ignored until the settlement is already damaged.",
  "Fuel, insurance, maintenance, ELD, taxes, and overhead rarely hit the same screen.",
  "Dispatch decisions are often made under pressure with incomplete math.",
];

function SectionShell({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-sky-400/15 bg-slate-950/70 shadow-2xl shadow-sky-950/30 backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.10),transparent_32%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function TelemetryLine() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-sky-200/70">
      <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
      <span>Live profitability command layer</span>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.3),#030712_78%),radial-gradient(circle_at_20%_5%,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(239,68,68,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[72px_72px] opacity-20" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-300/20 bg-slate-900 shadow-[0_0_28px_rgba(14,165,233,0.25)]">
            <Truck className="h-5 w-5 text-sky-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.28em] text-sky-100">KARPILO</p>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">LoadIQ</p>
          </div>
        </div>

        <a
          href="#cta"
          className="hidden rounded-full border border-sky-300/20 bg-sky-400/10 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-400/20 sm:inline-flex"
        >
          Start Calculating
        </a>
      </header>

      <SectionShell className="relative z-10 pb-20 pt-10 sm:pb-28 lg:pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]"
        >
          <motion.div variants={fadeUp}>
            <TelemetryLine />

            <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Know the load is profitable before the wheels turn.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Karpilo LoadIQ helps owner-operators and carriers determine true load profitability
              by exposing deadhead, overhead, fuel, margins, RPM, and operating cost before the
              dispatch decision is made.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#cta"
                className="group inline-flex items-center justify-center rounded-full bg-sky-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.35)] transition hover:bg-white"
              >
                Run the numbers
                <ArrowRight className="ml-3 h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/3 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:border-sky-300/40 hover:bg-sky-300/10"
              >
                View platform
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlowCard className="p-5 sm:p-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Load Scan</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight">Profitability Cockpit</h2>
                  </div>
                  <Radar className="h-7 w-7 text-sky-300" />
                </div>

                <div className="space-y-4">
                  {[
                    ["Linehaul", "$2,850"],
                    ["Deadhead Exposure", "184 mi"],
                    ["Fuel Cost", "$641"],
                    ["Operating Cost", "$1.82/mi"],
                    ["Projected Net", "$1,043"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                    >
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className="font-mono text-sm font-bold text-sky-100">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-sky-300" />
                    <p className="text-sm font-bold text-sky-100">Decision: Accept with margin discipline</p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </motion.div>
      </SectionShell>

      <SectionShell className="relative z-10 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
          className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <motion.div variants={fadeUp}>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-red-300">Industry Pain</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Revenue does not mean profit.
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2">
            {painPoints.map((point) => (
              <motion.div
                key={point}
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-red-300" />
                <p className="leading-7 text-slate-300">{point}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </SectionShell>

      <SectionShell id="features" className="relative z-10 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-sky-300">Core System</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Built for the operator making the call.
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.title} variants={fadeUp}>
                <GlowCard className="h-full p-6">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10">
                    <Icon className="h-6 w-6 text-sky-300" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{feature.description}</p>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionShell>

      <SectionShell className="relative z-10 py-20">
        <GlowCard className="p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-sky-300">
                Built from the road
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Not built in a boardroom.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-slate-300">
              <p>
                Karpilo LoadIQ is shaped around the real pressure of trucking: broker calls,
                fuel swings, deadhead traps, tight clocks, thin margins, and the discipline it
                takes to keep a truck profitable.
              </p>
              <p>
                This is dispatch intelligence for people who understand that a load is not good
                because it pays. A load is good when the math survives the road.
              </p>
            </div>
          </div>
        </GlowCard>
      </SectionShell>

      <SectionShell className="relative z-10 py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-sky-300">
              Profitability Intelligence
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              See the load beneath the load.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              LoadIQ turns scattered cost inputs into one clean operating picture, helping carriers
              defend margin before fuel, deadhead, maintenance, and overhead quietly eat the week.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Compare loaded miles against total operational miles.",
              "Expose deadhead before accepting weak freight.",
              "Convert overhead into real cost-per-mile pressure.",
              "Protect margin with dispatch-grade profitability visibility.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5"
              >
                <ChevronRight className="h-5 w-5 text-sky-300" />
                <p className="font-medium text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="relative z-10 py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <GlowCard key={stat.label} className="p-7 text-center">
              <p className="font-mono text-4xl font-black text-sky-200">{stat.value}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
            </GlowCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="relative z-10 py-20">
        <div id="cta" className="overflow-hidden rounded-4xl border border-sky-300/20 bg-sky-300/10 p-8 shadow-[0_0_70px_rgba(14,165,233,0.20)] sm:p-12 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <MapPinned className="mx-auto mb-6 h-10 w-10 text-sky-300" />
            <h2 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Stop accepting loads blind.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Run the freight through the numbers first. Protect the truck, the week, the margin,
              and the business behind the wheel.
            </p>
            <a
              href="#"
              className="mt-9 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-sky-200"
            >
              Launch LoadIQ
              <CircleDollarSign className="ml-3 h-5 w-5" />
            </a>
          </div>
        </div>
      </SectionShell>

      <footer className="relative z-10 border-t border-white/10 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Karpilo LoadIQ. Built by the mile from the road.</p>
          <p className="uppercase tracking-[0.26em]">Profitability • Dispatch • Intelligence</p>
        </div>
      </footer>
    </main>
  );
}
