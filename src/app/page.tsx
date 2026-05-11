"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Fuel,
  Gauge,
  MapPin,
  Radar,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import WaitlistModal from "@/components/waitlist/waitlist-modal";
import {
  PRODUCT_DISCLAIMER_SNIPPET,
  PRODUCT_FAQS,
  PRODUCT_FEATURES,
  PRODUCT_HERO,
} from "@/config/product-features";
import {
  demoComparison,
  demoDisclaimer,
  demoLoad,
  demoResults,
  demoSettings,
  demoSteps,
} from "@/config/product-demo";

const APP_ICON_SRC = "/brand/karpilo-loadiq-icon.png";

const COUNTDOWN_START_AT_MST = "2026-05-09T08:00:00-07:00";
const COUNTDOWN_DAYS = 45;

type CountdownStatus = "pending" | "active";

type CountdownState = {
  status: CountdownStatus;
  total: number;
};

type SectionProps = {
  onReserve: () => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const heroBullets = [
  "Model fuel, overhead, reserves, deadhead, and target income before booking.",
  "Compare estimated vs actual profit after the trip closes.",
  "Built for owner operators, lease operators, and small fleet decision-makers.",
];

const metricPills = [
  { label: "True RPM", value: "$2.99" },
  { label: "Deadhead", value: "64 mi" },
  { label: "Fuel", value: "$376" },
  { label: "Margin", value: "59.3%" },
];

const featureIcons = [
  Route,
  Gauge,
  Fuel,
  SlidersHorizontal,
  Radar,
  BarChart3,
  CircleDollarSign,
  ShieldCheck,
];

const pricingBullets = [
  "Fast load profitability estimates",
  "Fuel, deadhead, and operating cost visibility",
  "Post-trip comparison on supported workflows",
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    cadence: "starter access",
    description: "A clean way to understand the workflow and run basic checks.",
    emphasis: "Start learning the math",
  },
  {
    name: "Pro Monthly",
    price: "$24.99",
    cadence: "per month",
    description: "For operators who want LoadIQ in the weekly dispatch rhythm.",
    emphasis: "Flexible operator access",
    featured: true,
  },
  {
    name: "Pro Annual",
    price: "$189.99",
    cadence: "per year",
    description: "Best value for drivers using profitability checks all year.",
    emphasis: "Save $109.89 annually",
  },
];

const founderAccess =
  "Founding Operator Access may be available for the first 500 qualified early users.";

function formatCurrency(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getCountdownStartDate() {
  return new Date(COUNTDOWN_START_AT_MST);
}

function getLaunchTargetDate() {
  const start = getCountdownStartDate();
  const target = new Date(start);
  target.setDate(target.getDate() + COUNTDOWN_DAYS);
  return target;
}

function getCountdownState(): CountdownState {
  const now = Date.now();
  const start = getCountdownStartDate().getTime();
  const target = getLaunchTargetDate().getTime();

  if (now < start) {
    return {
      status: "pending",
      total: start - now,
    };
  }

  return {
    status: "active",
    total: Math.max(target - now, 0),
  };
}

function splitTime(total: number) {
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function TelemetryBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(239,68,68,0.16),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.2),#020617_82%)]" />
      <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(209,213,219,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(209,213,219,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <motion.div
        className="absolute left-[-10%] top-[30%] h-px w-[120%] bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        animate={{ x: ["-20%", "20%"], opacity: [0.1, 0.8, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      variants={fadeUp}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
        {description}
      </p>
    </motion.div>
  );
}

function AnimatedMetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-full border border-sky-300/20 bg-[#0B1120]/80 px-4 py-2 shadow-[0_0_24px_rgba(56,189,248,0.14)] backdrop-blur"
    >
      <span className="font-mono text-xs font-black text-sky-300">
        {value}
      </span>
      <span className="ml-2 text-xs uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
    </motion.div>
  );
}

function ComingSoonCard() {
  const [countdown, setCountdown] = useState<CountdownState>({
    status: "pending",
    total: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdownState());
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const remaining = splitTime(countdown.total);
  const countdownItems = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-[1.75rem] border border-red-500/35 bg-[#0B1120]/85 p-5 shadow-[0_0_44px_rgba(239,68,68,0.16)] sm:p-6"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_34%)]" />
      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
          <Clock className="h-4 w-4" />
          Launching Soon
        </div>

        <h3 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
          {countdown.status === "active"
            ? "45-Day Launch Countdown"
            : "Countdown Begins Soon"}
        </h3>
        <p className="mt-3 leading-7 text-slate-300">
          Early access is being shaped around operators who know the cost of
          bad freight math.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="flex h-[76px] min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-black/30 px-1 text-center sm:h-[84px]"
            >
              <p className="font-mono text-xl font-black leading-none text-sky-200 sm:text-3xl">
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-[9px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection({ onReserve }: SectionProps) {
  return (
    <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 pb-16 pt-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative order-2 lg:order-1"
      >
        <motion.div
          variants={fadeUp}
          className="relative mx-auto flex aspect-square max-w-[420px] items-center justify-center rounded-[2rem] border border-red-500/35 bg-black/40 p-7 shadow-[0_0_80px_rgba(56,189,248,0.22)]"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(120deg,transparent,rgba(209,213,219,0.16),transparent)]" />
          <motion.div
            className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10 h-full w-full overflow-hidden rounded-[1.45rem] shadow-[0_0_50px_rgba(239,68,68,0.24)]">
            <Image
              src={APP_ICON_SRC}
              alt="Karpilo LoadIQ app icon"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-6 flex flex-wrap justify-center gap-3"
        >
          {metricPills.map((metric) => (
            <AnimatedMetricPill key={metric.label} {...metric} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="order-1 lg:order-2"
      >
        <motion.div
          variants={fadeUp}
          className="mb-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-sky-200/80"
        >
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
          {PRODUCT_HERO.eyebrow}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
        >
          {PRODUCT_HERO.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
        >
          {PRODUCT_HERO.description}
        </motion.p>

        <motion.div variants={stagger} className="mt-7 space-y-3">
          {heroBullets.map((bullet) => (
            <motion.div
              key={bullet}
              variants={fadeUp}
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <p className="text-sm leading-6 text-slate-200 sm:text-base">
                {bullet}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onReserve}
            className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.02] hover:shadow-[0_0_52px_rgba(239,68,68,0.62)]"
          >
            Reserve Early Access
            <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
          </button>

          <a
            href="#demo"
            className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/15"
          >
            View Demo
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-2xl text-xs leading-6 text-slate-500"
        >
          Founding Operator Access is limited and qualification-based. LoadIQ
          provides estimates, not guaranteed financial outcomes.
        </motion.p>
      </motion.div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="Freight command center"
        title="Configured around the decisions that protect a trucking week."
        description="The website now pulls the core product capability language from the portable feature config, then presents it in a darker operational card system."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={stagger}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRODUCT_FEATURES.map((item, index) => {
          const Icon = featureIcons[index % featureIcons.length];

          return (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/80 p-6 shadow-[0_0_34px_rgba(56,189,248,0.08)] transition hover:-translate-y-1 hover:border-sky-300/30 hover:shadow-[0_0_44px_rgba(56,189,248,0.16)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <Icon className="mb-5 h-7 w-7 text-sky-300" />
              <h3 className="text-xl font-black tracking-[-0.03em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-400">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function LaunchSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <ComingSoonCard />

        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6 shadow-[0_0_40px_rgba(56,189,248,0.12)] sm:p-8">
          <Radar className="mb-5 h-8 w-8 text-sky-300" />
          <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
            Founding Operator Access
          </h3>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            {founderAccess} The public site keeps pricing transparent while
            giving qualified early users a clear path to raise their hand.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Public monthly", "$24.99"],
              ["Public annual", "$189.99"],
              ["Annual savings", "$109.89"],
              ["Qualification", "First 500"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
              >
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-right font-mono text-sm font-black text-sky-200">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoMetric({
  label,
  value,
  tone = "sky",
}: {
  label: string;
  value: string;
  tone?: "sky" | "red" | "green";
}) {
  const color =
    tone === "green"
      ? "text-emerald-300"
      : tone === "red"
        ? "text-red-300"
        : "text-sky-200";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-mono text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function ProductDemoSection() {
  const loadCosts = Object.entries(demoLoad.loadSpecificCosts).filter(
    ([, value]) => value > 0,
  );

  return (
    <section id="demo" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="Fictional product demo"
        title="A load board decision, translated into operational math."
        description="This demo uses the portable demo config only. There is no auth, no Supabase dependency, and no live pricing API in the website presentation."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={stagger}
        className="mt-12 overflow-hidden rounded-[2rem] border border-sky-300/20 bg-[#0B1120]/85 shadow-[0_0_70px_rgba(56,189,248,0.12)]"
      >
        <div className="grid gap-0 lg:grid-cols-[1.04fr_0.96fr]">
          <motion.div variants={fadeUp} className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_34%)]" />
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
                    {demoLoad.loadNumber}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                    {demoLoad.scenario}
                  </h3>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                  {demoResults.profitabilityBand}
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <MapPin className="mb-4 h-6 w-6 text-sky-300" />
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Pickup
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {demoLoad.pickup.city}, {demoLoad.pickup.state}
                  </p>
                  <p className="text-sm text-slate-400">{demoLoad.pickup.zip}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <MapPin className="mb-4 h-6 w-6 text-red-300" />
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Delivery
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {demoLoad.delivery.city}, {demoLoad.delivery.state}
                  </p>
                  <p className="text-sm text-slate-400">
                    {demoLoad.delivery.zip}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <DemoMetric
                  label="Loaded miles"
                  value={`${formatNumber(demoLoad.loadedMiles)} mi`}
                />
                <DemoMetric
                  label="Deadhead"
                  value={`${formatNumber(demoLoad.deadheadMiles)} mi`}
                  tone="red"
                />
                <DemoMetric
                  label="Total miles"
                  value={`${formatNumber(demoLoad.totalMiles)} mi`}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DemoMetric
                  label="Revenue"
                  value={formatCurrency(demoResults.grossRevenue)}
                />
                <DemoMetric
                  label="Fuel estimate"
                  value={formatCurrency(demoResults.estimatedFuelCost)}
                  tone="red"
                />
                <DemoMetric
                  label="True RPM"
                  value={`$${demoResults.trueRpm.toFixed(2)}`}
                  tone="green"
                />
                <DemoMetric
                  label="Projected net"
                  value={formatCurrency(demoResults.projectedNet)}
                  tone="green"
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Fuel override example
                    </p>
                    <p className="mt-2 text-slate-300">
                      {demoLoad.fuel.sourceLabel} for {demoLoad.fuel.region};
                      driver override applied.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-right">
                    <div>
                      <p className="text-xs text-slate-500">Market</p>
                      <p className="font-mono font-black text-sky-200">
                        ${demoLoad.fuel.eiaEstimatedDieselPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Override</p>
                      <p className="font-mono font-black text-red-200">
                        ${demoLoad.fuel.userOverrideFuelPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border-t border-white/10 bg-black/25 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              Operation profile
            </p>
            <div className="mt-5 grid gap-3">
              {[
                ["Type", demoSettings.operationType],
                ["Weekly target", formatCurrency(demoSettings.weeklyTarget)],
                ["Minimum true RPM", `$${demoSettings.minimumTrueRpm.toFixed(2)}`],
                ["Default MPG", demoSettings.defaultMpg.toFixed(1)],
                ["Pay template", demoSettings.payTemplate],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-right font-mono text-sm font-black text-slate-100">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-red-300">
              Estimated vs actual
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-200">
                  Estimate
                </p>
                <p className="mt-3 font-mono text-3xl font-black text-white">
                  {formatCurrency(demoComparison.estimated.net)}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {demoComparison.estimated.margin}% margin
                </p>
              </div>
              <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-red-200">
                  Actual
                </p>
                <p className="mt-3 font-mono text-3xl font-black text-white">
                  {formatCurrency(demoComparison.actual.net)}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {demoComparison.actual.margin}% margin
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="font-semibold leading-7 text-slate-200">
                {demoResults.summary}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                {demoComparison.variance.explanation}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {loadCosts.map(([label, value]) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300"
                >
                  {label}: {formatCurrency(value)}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 px-6 py-5 text-xs leading-6 text-slate-500 sm:px-8 lg:px-10">
          {demoDisclaimer}
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="How LoadIQ works"
        title="A disciplined profitability check before dispatch pressure takes over."
        description="The workflow stays close to how operators already think: offer, profile, fuel, deadhead, and post-trip truth."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={stagger}
        className="mt-12 grid gap-4 lg:grid-cols-5"
      >
        {demoSteps.map((step, index) => (
          <motion.div
            key={step.title}
            variants={fadeUp}
            className="relative rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5 shadow-[0_0_30px_rgba(56,189,248,0.08)]"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 font-mono font-black text-sky-200">
              {index + 1}
            </div>
            <h3 className="text-lg font-black tracking-[-0.03em] text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function PricingSection({ onReserve }: SectionProps) {
  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="Pricing"
        title="Public pricing that keeps the math simple."
        description="Choose the level that fits your operating rhythm. Annual access gets the strongest public value for drivers who want LoadIQ in regular use."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={stagger}
        className="mt-12 grid gap-5 lg:grid-cols-3"
      >
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-[0_0_44px_rgba(56,189,248,0.1)] ${
              plan.featured
                ? "border-red-400/35 bg-[#111827]/90"
                : "border-white/10 bg-[#0B1120]/80"
            }`}
          >
            {plan.featured && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
            )}
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              {plan.name}
            </p>
            <div className="mt-5 flex items-end gap-2">
              <p className="text-4xl font-black tracking-[-0.05em] text-white">
                {plan.price}
              </p>
              <p className="pb-1 text-sm text-slate-400">{plan.cadence}</p>
            </div>
            <p className="mt-4 leading-7 text-slate-300">{plan.description}</p>
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-red-100">
              {plan.emphasis}
            </p>
            <div className="mt-6 space-y-3">
              {pricingBullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                  <p className="text-sm leading-6 text-slate-300">{bullet}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        className="mt-8 overflow-hidden rounded-[1.75rem] border border-red-500/30 bg-[#0B1120]/90 p-6 shadow-[0_0_60px_rgba(239,68,68,0.14)] sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
              <BadgeCheck className="h-4 w-4" />
              Founding Operator Access
            </div>
            <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
              {founderAccess}
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Founder access is a launch promotion and does not expose hidden
              pricing on the public page. Qualified early users may receive
              additional onboarding priority.
            </p>
          </div>
          <button
            type="button"
            onClick={onReserve}
            className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.02]"
          >
            Reserve Access
            <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
        <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-slate-500">
          {PRODUCT_DISCLAIMER_SNIPPET}
        </p>
      </motion.div>
    </section>
  );
}

function FaqSection() {
  const [openItem, setOpenItem] = useState(PRODUCT_FAQS[0]?.question ?? "");

  return (
    <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="FAQ"
        title="Clear expectations before anyone trusts the numbers."
        description="LoadIQ is designed to sharpen freight decisions, not pretend trucking is predictable."
      />

      <div className="mt-12 space-y-3">
        {PRODUCT_FAQS.map((item) => {
          const isOpen = openItem === item.question;

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/85"
            >
              <button
                type="button"
                onClick={() => setOpenItem(isOpen ? "" : item.question)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
              >
                <span className="font-black tracking-[-0.02em] text-white">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-sky-300 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-5 py-5">
                  <p className="leading-7 text-slate-300">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCtaSection({ onReserve }: SectionProps) {
  return (
    <motion.section
      id="cta"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-[#0B1120]/90 p-8 shadow-[0_0_70px_rgba(239,68,68,0.18)] sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(239,68,68,0.18),transparent_32%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              <TrendingUp className="h-4 w-4" />
              Early operator list
            </div>
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Put better freight math between the offer and the answer.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Reserve interest for LoadIQ and help shape the profitability
              workflow around real dispatch decisions.
            </p>
            <button
              type="button"
              onClick={onReserve}
              className="group mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.02]"
            >
              Join the Waitlist
              <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Deadhead before dispatch",
              "Fuel pressure visibility",
              "Operating profile defaults",
              "Estimated vs actual review",
              "Mobile-first load checks",
              "Founder access consideration",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-300" />
                <p className="font-semibold text-slate-200">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Page() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const openWaitlist = () => setWaitlistOpen(true);

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <TelemetryBackground />
      <SiteHeader />
      <HeroSection onReserve={openWaitlist} />
      <LaunchSection />
      <FeatureGrid />
      <ProductDemoSection />
      <HowItWorksSection />
      <PricingSection onReserve={openWaitlist} />
      <FaqSection />
      <FinalCtaSection onReserve={openWaitlist} />

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
      <SiteFooter />
    </div>
  );
}
