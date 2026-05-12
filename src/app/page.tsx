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
  Fuel,
  Gauge,
  Lock,
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
import {
  FOUNDER_ACCESS,
  PUBLIC_PRICING_PLANS,
  formatPriceLabel,
} from "@/config/pricing";
import {
  ecosystemTeasers,
  educationCards,
  founderStory,
  launch500Program,
  launchTimeline,
  pilotPaymentGate,
  pilotProgram,
  standardPricing,
  type LaunchPhaseId,
} from "@/config/launch";

const APP_ICON_SRC = "/brand/karpilo-loadiq-icon.png";

type SectionProps = {
  onReserve: () => void;
};

type LaunchState = {
  id: LaunchPhaseId;
  eyebrow: string;
  title: string;
  statusLabel: string;
  slotLabel: string;
  targetTime: number | null;
  monthlyPrice: number;
  annualPrice: number;
  lockLabel: string;
  paymentsEnabled: boolean;
  waitlistOnlyMode: boolean;
  paymentModeLabel: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
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

function splitTime(total: number) {
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function getLaunchState(now = Date.now()): LaunchState {
  const pilotOpensAt = Date.parse(launchTimeline.pilotOpensAtUtc);
  const officialLaunchAt = Date.parse(launchTimeline.officialLaunchAtUtc);
  const pilotRemaining = Math.max(pilotProgram.maxSlots - pilotProgram.claimedSlots, 0);
  const launchRemaining = Math.max(
    launch500Program.maxSlots - launch500Program.claimedSlots,
    0,
  );

  if (!Number.isFinite(pilotOpensAt) || !Number.isFinite(officialLaunchAt)) {
    return {
      id: "waitlist_only",
      eyebrow: "Waitlist Mode Active",
      title: "Launch timing verification required",
      statusLabel: "Payment systems disabled",
      slotLabel: "Pilot enrollment is holding for server verification",
      targetTime: null,
      monthlyPrice: pilotProgram.monthlyPrice,
      annualPrice: pilotProgram.annualPrice,
      lockLabel: "Checkout locked",
      paymentsEnabled: false,
      waitlistOnlyMode: true,
      paymentModeLabel: "Fail-safe waitlist mode",
      description:
        "Launch timing could not be verified, so LoadIQ is holding the public flow in waitlist-only mode. No checkout or subscription activation should be available until server authority confirms eligibility.",
      primaryCtaLabel: "Join Waitlist",
      secondaryCtaLabel: "Notify Me At Pilot Launch",
    };
  }

  if (now < pilotOpensAt) {
    return {
      id: "pre_pilot",
      eyebrow: "Founding Operator Pilot Opens In:",
      title: "Pre-launch systems armed",
      statusLabel: "Payment systems disabled",
      slotLabel: `${pilotProgram.maxSlots} Founding 50 slots preparing`,
      targetTime: pilotOpensAt,
      monthlyPrice: pilotProgram.monthlyPrice,
      annualPrice: pilotProgram.annualPrice,
      lockLabel: pilotProgram.lockLabel,
      paymentsEnabled: false,
      waitlistOnlyMode: true,
      paymentModeLabel: "Waitlist and pilot consideration only",
      description:
        "Pre-launch access is intentionally waitlist-only. Visitors can request pilot consideration and receive launch notifications, but checkout, subscription activation, and payment collection remain disabled until the countdown completes.",
      primaryCtaLabel: "Join Waitlist",
      secondaryCtaLabel: "Notify Me At Pilot Launch",
    };
  }

  if (now < officialLaunchAt && pilotRemaining > 0) {
    return {
      id: "pilot_active",
      eyebrow: "Pilot Operations Active",
      title: "System Initialization Complete",
      statusLabel: "Founding 50 enrollment live",
      slotLabel: `${pilotRemaining} / ${pilotProgram.maxSlots} Founding Slots Remaining`,
      targetTime: officialLaunchAt,
      monthlyPrice: pilotProgram.monthlyPrice,
      annualPrice: pilotProgram.annualPrice,
      lockLabel: pilotProgram.lockLabel,
      paymentsEnabled: true,
      waitlistOnlyMode: false,
      paymentModeLabel: "Pilot payment eligibility open",
      description:
        "Founding 50 enrollment is active. Checkout must still be issued only after server-side slot validation confirms an available pilot allocation for the requesting account.",
      primaryCtaLabel: "Join Founding 50 Pilot",
      secondaryCtaLabel: "Start Pilot Access",
    };
  }

  if (now < officialLaunchAt) {
    return {
      id: "pilot_closed",
      eyebrow: "Founding 50 Pilot Fully Allocated",
      title: "Pilot capacity reached",
      statusLabel: "Pilot checkout disabled",
      slotLabel: "0 / 50 Founding Slots Remaining",
      targetTime: officialLaunchAt,
      monthlyPrice: launch500Program.monthlyPrice,
      annualPrice: launch500Program.annualPrice,
      lockLabel: launch500Program.lockLabel,
      paymentsEnabled: false,
      waitlistOnlyMode: true,
      paymentModeLabel: "Official launch waitlist only",
      description:
        "The controlled pilot allocation is full. Pilot checkout must be closed automatically, and additional visitors should only join the official launch waitlist or request launch notifications.",
      primaryCtaLabel: "Join Official Launch Waitlist",
      secondaryCtaLabel: "Notify Me At Public Launch",
    };
  }

  if (launchRemaining > 0) {
    return {
      id: "launch500_active",
      eyebrow: "Official Launch Active",
      title: "First 500 Launch Operators",
      statusLabel: "Legacy pricing active",
      slotLabel: `${launchRemaining} / ${launch500Program.maxSlots} Legacy Pricing Slots Remaining`,
      targetTime: null,
      monthlyPrice: launch500Program.monthlyPrice,
      annualPrice: launch500Program.annualPrice,
      lockLabel: launch500Program.lockLabel,
      paymentsEnabled: true,
      waitlistOnlyMode: false,
      paymentModeLabel: "Launch pricing eligibility open",
      description:
        "Official launch pricing is active for eligible Launch Operators while legacy slots remain. Checkout should still be validated server-side before any payment flow opens.",
      primaryCtaLabel: "Join Launch Operators",
      secondaryCtaLabel: "Start Public Access",
    };
  }

  return {
    id: "standard_active",
    eyebrow: "Standard Public Access Now Active",
    title: "Public pricing online",
    statusLabel: "Standard access",
    slotLabel: "Lifetime lock programs closed",
    targetTime: null,
    monthlyPrice: standardPricing.monthlyPrice,
    annualPrice: standardPricing.annualPrice,
    lockLabel: standardPricing.lockLabel,
    paymentsEnabled: true,
    waitlistOnlyMode: false,
    paymentModeLabel: "Standard public checkout",
    description:
      "Standard public access is active. Lifetime pricing lock programs are closed, and checkout should use normal public plan validation.",
    primaryCtaLabel: "Start Standard Access",
    secondaryCtaLabel: "Test Live Demo",
  };
}

function useLaunchState() {
  const [state, setState] = useState<LaunchState>(() => getLaunchState());
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max((getLaunchState().targetTime ?? Date.now()) - Date.now(), 0),
  );

  useEffect(() => {
    const updateState = () => {
      const next = getLaunchState();
      setState(next);
      setRemainingMs(Math.max((next.targetTime ?? Date.now()) - Date.now(), 0));
    };

    updateState();
    const timer = window.setInterval(updateState, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return { state, remainingMs };
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

function LaunchStatusPanel({ onReserve }: SectionProps) {
  const { state, remainingMs } = useLaunchState();
  const remaining = splitTime(remainingMs);
  const countdownItems = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];
  const ctaLabels =
    state.id === "pre_pilot" || state.id === "waitlist_only"
      ? ["Join Waitlist", "Notify Me At Pilot Launch", "Become A Founding Operator"]
      : state.id === "pilot_active"
        ? ["Join Founding 50 Pilot", "Lock Lifetime Pricing", "Start Pilot Access"]
        : state.id === "pilot_closed"
          ? ["Join Official Launch Waitlist", "Notify Me At Public Launch"]
          : [state.primaryCtaLabel, state.secondaryCtaLabel];

  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-[1.75rem] border border-red-500/35 bg-[#0B1120]/85 p-5 shadow-[0_0_44px_rgba(239,68,68,0.16)] sm:p-6"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_34%)]" />
      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
          <Radar className="h-4 w-4" />
          {state.statusLabel}
        </div>

        <h3 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
          {state.eyebrow}
        </h3>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-sky-300">
          {state.slotLabel}
        </p>
        <p className="mt-3 leading-7 text-slate-300">
          {state.description}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border px-4 py-3 ${
              state.paymentsEnabled
                ? "border-emerald-300/25 bg-emerald-400/10"
                : "border-red-300/25 bg-red-500/10"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Payment Mode
            </p>
            <p
              className={`mt-1 text-sm font-black ${
                state.paymentsEnabled ? "text-emerald-200" : "text-red-100"
              }`}
            >
              {state.paymentModeLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Safety Rule
            </p>
            <p className="mt-1 text-sm font-black text-sky-100">
              {state.waitlistOnlyMode ? "Checkout unavailable" : "Server validation required"}
            </p>
          </div>
        </div>

        {state.targetTime ? (
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
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Monthly
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              ${state.monthlyPrice.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Annual
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-white">
              ${state.annualPrice.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4">
            <Lock className="mb-2 h-5 w-5 text-sky-300" />
            <p className="text-sm font-black text-sky-100">{state.lockLabel}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {ctaLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={onReserve}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.14em] transition hover:scale-[1.02] ${
                index === 0
                  ? "bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white shadow-[0_0_28px_rgba(239,68,68,0.35)]"
                  : "border border-sky-300/30 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href="#interactive-demo"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-200 transition hover:bg-white/[0.07]"
          >
            Test Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection({ onReserve }: SectionProps) {
  const { state } = useLaunchState();
  const secondaryIsDemo = state.secondaryCtaLabel.toLowerCase().includes("demo");

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

        <motion.div variants={fadeUp} className="mt-6">
          <LaunchStatusPanel onReserve={onReserve} />
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
            {state.primaryCtaLabel}
            <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
          </button>

          {secondaryIsDemo ? (
            <a
              href="#interactive-demo"
              className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/15"
            >
              {state.secondaryCtaLabel}
            </a>
          ) : (
            <button
              type="button"
              onClick={onReserve}
              className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/15"
            >
              {state.secondaryCtaLabel}
            </button>
          )}
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-2xl text-xs leading-6 text-slate-500"
        >
          {state.paymentsEnabled
            ? "Payment access must be confirmed server-side before checkout. LoadIQ provides estimates, not guaranteed financial outcomes."
            : "Pre-launch access is waitlist-only. No checkout, subscription activation, or payment collection is available before pilot opening."}
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

function LaunchSection({ onReserve }: SectionProps) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <LaunchStatusPanel onReserve={onReserve} />

        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6 shadow-[0_0_40px_rgba(56,189,248,0.12)] sm:p-8">
          <BadgeCheck className="mb-5 h-8 w-8 text-sky-300" />
          <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
            {pilotProgram.name}
          </h3>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            First 50 approved operators qualify for pilot pricing at
            ${pilotProgram.monthlyPrice.toFixed(2)}/month or
            ${pilotProgram.annualPrice.toFixed(2)}/year with a lifetime lock
            while the account remains active and in good standing.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Pilot monthly", `$${pilotProgram.monthlyPrice}`],
              ["Pilot annual", `$${pilotProgram.annualPrice}`],
              ["Founding slots", `First ${pilotProgram.maxSlots}`],
              ["Badge", pilotProgram.badge],
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
          <div className="mt-5 grid gap-3">
            {pilotProgram.lockRules.map((rule) => (
              <div key={rule} className="flex gap-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                <p>{rule}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-200">
              Payment Gate Rule
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {pilotPaymentGate.preLaunchPolicy}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              If launch timing, slot counts, payment sync, or webhook validation
              cannot be confirmed, LoadIQ must fail closed into waitlist mode.
            </p>
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

function InteractiveDemoSection() {
  const [loadedMiles, setLoadedMiles] = useState(555);
  const [deadheadMiles, setDeadheadMiles] = useState(64);
  const [revenue, setRevenue] = useState(1850);
  const [fuelPrice, setFuelPrice] = useState(4.08);
  const [overhead, setOverhead] = useState(255);

  const totalMiles = loadedMiles + deadheadMiles;
  const fuelCost = totalMiles > 0 ? (totalMiles / 6.7) * fuelPrice : 0;
  const trueRpm = totalMiles > 0 ? revenue / totalMiles : 0;
  const projectedNet = revenue - fuelCost - overhead;
  const leakage = deadheadMiles * trueRpm + fuelCost + overhead;
  const demoControls: Array<{
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    setter: (next: number) => void;
    help: string;
    unit: "money" | "miles";
  }> = [
    {
      label: "Loaded miles",
      value: loadedMiles,
      min: 100,
      max: 1200,
      setter: setLoadedMiles,
      help: "Paid miles are only one part of the operating picture.",
      unit: "miles",
    },
    {
      label: "Deadhead miles",
      value: deadheadMiles,
      min: 0,
      max: 350,
      setter: setDeadheadMiles,
      help: "Deadhead impact shows unpaid repositioning pressure.",
      unit: "miles",
    },
    {
      label: "Gross revenue",
      value: revenue,
      min: 500,
      max: 4500,
      setter: setRevenue,
      help: "Gross is useful, but it is not the same as profit.",
      unit: "money",
    },
    {
      label: "Fuel price",
      value: fuelPrice,
      min: 2.5,
      max: 6.5,
      step: 0.01,
      setter: setFuelPrice,
      help: "Fuel cost changes fast and can erase a good-looking rate.",
      unit: "money",
    },
    {
      label: "Overhead applied",
      value: overhead,
      min: 0,
      max: 900,
      setter: setOverhead,
      help: "Operational overhead keeps business cost in the load decision.",
      unit: "money",
    },
  ];

  return (
    <section id="interactive-demo" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="Interactive Demo Access"
        title="Move the numbers and watch the load change shape."
        description="A lightweight public demo for RPM, miles, fuel, overhead, deadhead, cost leakage, and profitability awareness."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1120]/85 p-6 shadow-[0_0_40px_rgba(56,189,248,0.1)]">
          {demoControls.map((control) => (
            <label key={control.label} className="mb-5 block last:mb-0">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-200">{control.label}</span>
                <span className="font-mono text-sm font-black text-sky-200">
                  {control.unit === "money"
                    ? formatCurrency(control.value, control.label === "Fuel price" ? 2 : 0)
                    : `${control.value} mi`}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step ?? 1}
                value={control.value}
                onChange={(event) => {
                  control.setter(Number(event.target.value));
                }}
                className="mt-3 w-full accent-sky-400"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">{control.help}</p>
            </label>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6 shadow-[0_0_60px_rgba(56,189,248,0.12)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <DemoMetric label="True RPM" value={`$${trueRpm.toFixed(2)}`} tone="green" />
            <DemoMetric label="Fuel cost" value={formatCurrency(fuelCost)} tone="red" />
            <DemoMetric label="Projected net" value={formatCurrency(projectedNet)} tone={projectedNet > 0 ? "green" : "red"} />
            <DemoMetric label="Cost leakage" value={formatCurrency(leakage)} tone="red" />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
              Operational Insight
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              {projectedNet > 700
                ? "This demo load still has room after modeled fuel and overhead. A driver would still verify detention, route, weather, and actual fuel."
                : projectedNet > 0
                  ? "This load is positive, but the cushion is thin. Deadhead, delays, and real pump price could decide whether it was worth running."
                  : "This load is underwater in the demo model. Gross revenue is not protecting the operation after cost exposure."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderStorySection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120]/85 p-8 shadow-[0_0_70px_rgba(56,189,248,0.12)] sm:p-10 lg:p-12">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_16%_12%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.12),transparent_30%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
              {founderStory.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              {founderStory.title}
            </h2>
            <p className="mt-5 text-2xl font-black tracking-[-0.035em] text-sky-200">
              {founderStory.quote}
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                Joshua Karpilo
              </p>
              <p className="mt-2 font-bold text-white">
                Founder & CEO, Karpilo Endeavor Technologies
              </p>
            </div>
            {founderStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-8 text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <SectionIntro
        eyebrow="Operational Intelligence For Drivers"
        title="A better load decision starts with seeing what the gross number hides."
        description="LoadIQ teaches the financial pressure points without talking down to the people doing the work."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {educationCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-6">
            <h3 className="text-xl font-black tracking-[-0.03em] text-white">
              {card.title}
            </h3>
            <p className="mt-3 leading-7 text-slate-400">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EcosystemTeaserSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-black/30 p-8 sm:p-10">
        <SectionIntro
          eyebrow="Future systems"
          title="LoadIQ is the foundation, not the ceiling."
          description="Additional Karpilo operational intelligence systems are currently under development behind the scenes."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ecosystemTeasers.map((name) => (
            <div key={name} className="relative overflow-hidden rounded-2xl border border-sky-300/15 bg-[#0B1120]/70 p-6 blur-[0.1px]">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(56,189,248,0.12),transparent)]" />
              <p className="relative text-xs font-black uppercase tracking-[0.18em] text-red-300">
                Under development
              </p>
              <h3 className="relative mt-3 text-2xl font-black tracking-[-0.04em] text-white">
                {name}
              </h3>
              <p className="relative mt-3 text-sm leading-6 text-slate-500">
                Proprietary operational intelligence system. Details withheld until ready.
              </p>
            </div>
          ))}
        </div>
      </div>
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
  const { state } = useLaunchState();

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
        {PUBLIC_PRICING_PLANS.map((plan) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-[0_0_44px_rgba(56,189,248,0.1)] ${
              "featured" in plan && plan.featured
                ? "border-red-400/35 bg-[#111827]/90"
                : "border-white/10 bg-[#0B1120]/80"
            }`}
          >
            {"featured" in plan && plan.featured && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
            )}
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              {plan.name}
            </p>
            <div className="mt-5 flex items-end gap-2">
              <p className="text-4xl font-black tracking-[-0.05em] text-white">
                {formatPriceLabel(plan.price, plan.interval)}
              </p>
              <p className="pb-1 text-sm text-slate-400">
                {plan.interval === "month" ? "monthly" : "annual"}
              </p>
            </div>
            <p className="mt-4 leading-7 text-slate-300">{plan.description}</p>
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-red-100">
              {"savingsLabel" in plan ? plan.savingsLabel : plan.cta}
            </p>
            <div className="mt-6 space-y-3">
              {plan.bullets.map((bullet) => (
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
              {FOUNDER_ACCESS.publicTeaser}
            </h3>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              {state.waitlistOnlyMode
                ? "Founder access is currently waitlist-only. Payment collection, subscription activation, and checkout access remain disabled until server-authoritative launch and slot checks pass."
                : "Founder access remains eligibility-based. Any checkout flow must validate the active launch phase, slot availability, and pricing lock assignment on the server before payment collection."}
            </p>
          </div>
          <button
            type="button"
            onClick={onReserve}
            className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.02]"
          >
            {state.waitlistOnlyMode ? "Reserve Notification Access" : "Request Eligible Access"}
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

function StickyPilotCta({ onReserve }: SectionProps) {
  const { state } = useLaunchState();

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:hidden">
      <button
        type="button"
        onClick={onReserve}
        className="flex w-full items-center justify-center rounded-full border border-red-400/35 bg-red-600 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_34px_rgba(239,68,68,0.42)]"
      >
        {state.waitlistOnlyMode ? "Join Waitlist" : state.primaryCtaLabel}
      </button>
    </div>
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
      <LaunchSection onReserve={openWaitlist} />
      <FounderStorySection />
      <FeatureGrid />
      <InteractiveDemoSection />
      <ProductDemoSection />
      <EducationSection />
      <HowItWorksSection />
      <PricingSection onReserve={openWaitlist} />
      <EcosystemTeaserSection />
      <FaqSection />
      <FinalCtaSection onReserve={openWaitlist} />
      <StickyPilotCta onReserve={openWaitlist} />

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
      <SiteFooter />
    </div>
  );
}
