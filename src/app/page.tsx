"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  Radar,
  Route,
} from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import WaitlistModal from "@/components/waitlist/waitlist-modal";

const APP_ICON_SRC = "/brand/karpilo-loadiq-icon.png";

const COUNTDOWN_START_AT_MST = "2026-05-09T08:00:00-07:00";
const COUNTDOWN_DAYS = 45;

type CountdownStatus = "pending" | "active";

type CountdownState = {
  status: CountdownStatus;
  total: number;
};

type FounderPromoCardProps = {
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
      staggerChildren: 0.12,
    },
  },
};

const metrics = [
  { label: "Deadhead", value: "DH" },
  { label: "Margin", value: "NET" },
  { label: "Fuel Exposure", value: "FUEL" },
  { label: "Rate Analysis", value: "RPM" },
];

const founderBenefits = [
  "Locked-in founder pricing",
  "Early access before public release",
  "Priority feature voting",
  "Lifetime discounted rate",
  "Founding operator badge",
  "Direct development feedback access",
];

const featureCards = [
  {
    icon: Route,
    title: "Deadhead Intelligence",
    text: "Expose unpaid miles before they wreck the week.",
  },
  {
    icon: Fuel,
    title: "Fuel Exposure",
    text: "See fuel pressure before accepting the rate.",
  },
  {
    icon: BarChart3,
    title: "Margin Control",
    text: "Turn gross revenue into real profit visibility.",
  },
  {
    icon: Gauge,
    title: "Dispatch Discipline",
    text: "Make fast go/no-go decisions with clean math.",
  },
];

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

      <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(209,213,219,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(209,213,219,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <motion.div
        className="absolute left-[-10%] top-[30%] h-px w-[120%] bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        animate={{ x: ["-20%", "20%"], opacity: [0.1, 0.8, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
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

      <span className="ml-2 text-xs uppercase tracking-[0.18em] text-slate-400">
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
      className="relative overflow-hidden rounded-3xl border border-red-500/35 bg-[#0B1120]/85 p-5 shadow-[0_0_44px_rgba(239,68,68,0.16)] sm:p-6"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_34%)]" />

      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-200">
          <Clock className="h-4 w-4" />
          Launching Soon
        </div>

        <h3 className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
          {countdown.status === "active"
            ? "45-Day Launch Countdown"
            : "Countdown Begins Tomorrow"}
        </h3>

        <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-sky-300">
          {countdown.status === "active"
            ? "Launch clock active"
            : "Begins at 8:00 AM MST"}
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          Built from the road for operators who need dispatch intelligence
          before the load is accepted.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="flex h-[78px] min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-black/30 px-1 text-center sm:h-[86px] sm:rounded-2xl"
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              App Store
            </p>

            <p className="mt-1 font-bold text-slate-200">Coming Soon</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Google Play
            </p>

            <p className="mt-1 font-bold text-slate-200">Coming Soon</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FounderPromoCard({ onReserve }: FounderPromoCardProps) {
  return (
    <motion.section
      id="cta"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-[#0B1120]/90 p-8 shadow-[0_0_70px_rgba(239,68,68,0.18)] sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(239,68,68,0.18),transparent_32%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              <BadgeCheck className="h-4 w-4" />
              First 25 Subscribers
            </div>

            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Founding Operator Access
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Limited launch incentive for the first 25 subscribers.
            </p>

            <button
              type="button"
              onClick={onReserve}
              className="group mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.02] hover:shadow-[0_0_52px_rgba(239,68,68,0.62)]"
            >
              Reserve Your Spot
              <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {founderBenefits.map((benefit) => (
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

function HeroSection() {
  return (
    <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative"
      >
        <motion.div
          variants={fadeUp}
          className="relative mx-auto flex aspect-square max-w-[420px] items-center justify-center rounded-[3rem] border border-red-500/35 bg-black/40 p-8 shadow-[0_0_80px_rgba(56,189,248,0.22)]"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-[linear-gradient(120deg,transparent,rgba(209,213,219,0.16),transparent)]" />

          <motion.div
            className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10 h-full w-full overflow-hidden rounded-[2.2rem] shadow-[0_0_50px_rgba(239,68,68,0.24)]">
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
          {metrics.map((metric) => (
            <AnimatedMetricPill key={metric.label} {...metric} />
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div
          variants={fadeUp}
          className="mb-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-sky-200/80"
        >
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
          Tactical load profitability system
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl font-black tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl"
        >
          Karpilo LoadIQ{" "}
          <span className="whitespace-nowrap text-sky-300">(K-LIQ)</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-2xl font-bold tracking-[-0.03em] text-slate-100 sm:text-3xl"
        >
          Know if the load is worth it before the wheels turn.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
        >
          Karpilo LoadIQ helps owner-operators and carriers expose deadhead,
          fuel cost, overhead, RPM, operating cost, margin, fuel exposure,
          dispatch intelligence, rate analysis, and true load profitability
          before accepting freight.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <ComingSoonCard />

          <div className="rounded-3xl border border-sky-300/20 bg-[#0B1120]/85 p-6 shadow-[0_0_40px_rgba(56,189,248,0.14)]">
            <Radar className="mb-5 h-8 w-8 text-sky-300" />

            <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
              Operational Cockpit
            </h3>

            <div className="mt-5 space-y-3">
              {[
                ["Deadhead Exposure", "Live"],
                ["Fuel Cost", "Calculated"],
                ["Operating Cost", "Tracked"],
                ["Rate Analysis", "Measured"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <span className="text-sm text-slate-400">{label}</span>

                  <span className="font-mono text-sm font-black text-sky-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function Page() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <TelemetryBackground />

      <HeroSection />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#0B1120]/80 p-6 shadow-[0_0_34px_rgba(56,189,248,0.08)]"
              >
                <Icon className="mb-5 h-7 w-7 text-sky-300" />

                <h3 className="text-xl font-black tracking-[-0.03em] text-white">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-sky-300/20 bg-[#0B1120]/85 p-8 shadow-[0_0_60px_rgba(56,189,248,0.12)] sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-red-300">
                Built from the road
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Not another clean little SaaS toy.
              </h2>
            </div>

            <p className="text-lg leading-8 text-slate-300">
              LoadIQ is built for the real pressure of trucking: broker calls,
              thin margins, fuel swings, deadhead traps, maintenance reserves,
              overhead, and dispatch decisions that have to be made before the
              truck moves.
            </p>
          </div>
        </div>
      </section>

      <FounderPromoCard onReserve={() => setWaitlistOpen(true)} />

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <SiteFooter />
    </div>
  );
}
