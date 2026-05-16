"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  Fuel,
  Gauge,
  Radar,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

import { AppStorePlaceholders } from "@/components/app-store/app-store-placeholders";
import { DemoVideoPlayer } from "@/components/demo/DemoVideoPlayer";
import { CurrentNationalDieselAverageCard } from "@/components/fuel/current-national-diesel-average-card";
import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { RolloutCommandCenter } from "@/components/rollout/rollout-command-center";
import WaitlistModal from "@/components/waitlist/waitlist-modal";
import { LOADIQ_BRAND } from "@/config/loadiq";
import {
  PRODUCT_DISCLAIMER_SNIPPET,
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
  PUBLIC_PRICING_PLANS,
  formatPriceLabel,
} from "@/config/pricing";
import {
  educationCards,
  founderStory,
  founderWelcomeCopy,
  launch500Program,
  pilotPaymentGate,
  pilotProgram,
  standardPricing,
} from "@/config/launch";

const APP_ICON_SRC = LOADIQ_BRAND.appIcon;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const featureIcons = [
  Route,
  Gauge,
  Fuel,
  SlidersHorizontal,
  Radar,
  BarChart3,
  TrendingUp,
  ShieldCheck,
];

const subscriptionValuePoints = [
  {
    title: "Deadhead awareness",
    description:
      "Unpaid miles still consume fuel, time, and equipment life. Karpilo LoadIQ keeps that pressure visible before an offer looks better than it is.",
  },
  {
    title: "Fuel and overhead visibility",
    description:
      "Fuel variance, recurring overhead, reserves, and trip-specific costs can quietly compress margin when they are not modeled together.",
  },
  {
    title: "Margin discipline",
    description:
      "The goal is not a guaranteed outcome. The goal is clearer numbers so operators can evaluate freight with less guesswork and more operating context.",
  },
] as const;

function publicPlanPriceLabel(plan: (typeof PUBLIC_PRICING_PLANS)[number]) {
  return "priceLabel" in plan
    ? plan.priceLabel
    : formatPriceLabel(plan.price, plan.interval);
}

type CtaMode = "waitlist" | "link";

type PrimaryCtaProps = {
  children: string;
  mode?: CtaMode;
  href?: string;
  onWaitlist?: () => void;
};

function formatCurrency(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] pb-24 text-white sm:pb-0">
      <TelemetryBackground />
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

function TelemetryBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.2),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(239,68,68,0.13),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.12),#020617_78%)]" />
      <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(209,213,219,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(209,213,219,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10 pt-10 sm:px-8 lg:pt-14">
      <UniversalBackButton />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-8"
      >
        <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      </motion.div>
    </section>
  );
}

export function PrimaryCta({
  children,
  mode = "waitlist",
  href = "/contact",
  onWaitlist,
}: PrimaryCtaProps) {
  const className =
    "group inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_0_32px_rgba(239,68,68,0.36)] transition hover:scale-[1.02]";

  if (mode === "link") {
    return (
      <Link href={href} className={className}>
        {children}
        <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <button type="button" onClick={onWaitlist} className={className}>
      {children}
      <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
    </button>
  );
}

export function PromotionBanner({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
}) {
  const className =
    "block rounded-[1.5rem] border border-sky-300/20 bg-[#0B1120]/85 p-5 shadow-[0_0_34px_rgba(56,189,248,0.1)] transition hover:-translate-y-1 hover:border-sky-300/35 sm:p-6";
  const content = (
    <>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
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
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-300">{description}</p>
    </div>
  );
}

function SubscriptionValuePanel() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-8">
      <div className="grid gap-6 border-y border-white/10 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
            Operational value
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
            Built as operating visibility, not another blind cost.
          </h2>
          <p className="mt-5 leading-8 text-slate-300">
            One overlooked deadhead leg, fuel variance, detention assumption, or
            overhead gap can often exceed the monthly Gold subscription cost.
            Karpilo LoadIQ does not guarantee savings; it helps expose pressure
            earlier so decisions can be made with clearer numbers.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {subscriptionValuePoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-sky-200">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyMobileCta({
  label,
  onWaitlist,
  href,
}: {
  label: string;
  onWaitlist: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:hidden">
        <Link
          href={href}
          className="flex w-full items-center justify-center rounded-full border border-red-400/35 bg-red-600 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_34px_rgba(239,68,68,0.42)]"
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:hidden">
      <button
        type="button"
        onClick={onWaitlist}
        className="flex w-full items-center justify-center rounded-full border border-red-400/35 bg-red-600 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_34px_rgba(239,68,68,0.42)]"
      >
        {label}
      </button>
    </div>
  );
}

function useWaitlistModal() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  return {
    waitlistOpen,
    openWaitlist: () => setWaitlistOpen(true),
    closeWaitlist: () => setWaitlistOpen(false),
  };
}

export function HomeMarketingPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();
  const featureSnapshot = PRODUCT_FEATURES.slice(0, 4);

  return (
    <AppFrame>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p
            variants={fadeUp}
            className="text-xs font-black uppercase tracking-[0.28em] text-sky-200"
          >
            {PRODUCT_HERO.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl"
          >
            {PRODUCT_HERO.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            {PRODUCT_HERO.description}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <PrimaryCta mode="link" href="/demo">
              Explore Karpilo LoadIQ
            </PrimaryCta>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 max-w-xl">
            <AppStorePlaceholders />
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-xs leading-6 text-slate-500">
            Pre-launch payment systems are disabled. Early interest flows through waitlist and pilot consideration only.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-[2rem] border border-sky-300/20 bg-[#0B1120]/85 p-5 shadow-[0_0_80px_rgba(56,189,248,0.2)] sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.22),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.14),transparent_30%)]" />
          <div className="relative mx-auto mb-6 flex aspect-square max-w-[420px] items-center justify-center rounded-[1.7rem] border border-red-500/30 bg-black/35 p-5 shadow-[0_0_60px_rgba(239,68,68,0.2)] sm:p-6">
            <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
              <Image
                src={APP_ICON_SRC}
                alt="Karpilo LoadIQ app icon"
                fill
                priority
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 420px, 420px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["True RPM", "$2.99"],
              ["Deadhead", "64 mi"],
              ["Fuel", "$377"],
              ["Projected Net", "$1,097"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 font-mono text-2xl font-black text-sky-100">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            A compact freight decision screen for fuel, deadhead, overhead, reserves, and net profitability before the load is accepted.
          </p>
        </motion.div>
      </section>

      <CurrentNationalDieselAverageCard />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <RolloutCommandCenter
          onReserve={openWaitlist}
          compact
          showPublicLaunchCountdown
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <SectionIntro
          eyebrow="Core value"
          title="See the operating pressure before dispatch."
          description="Karpilo LoadIQ turns a freight offer into a clearer operating decision without burying drivers in generic software noise."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureSnapshot.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <Link
                key={feature.title}
                href="/demo"
                className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5 transition hover:-translate-y-1 hover:border-sky-300/30 hover:shadow-[0_0_36px_rgba(56,189,248,0.14)]"
              >
                <Icon className="mb-4 h-6 w-6 text-sky-300" />
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {PUBLIC_PRICING_PLANS.map((plan) => (
            <Link
              key={plan.id}
              href="/pricing"
              className="rounded-[1.5rem] border border-white/10 bg-[#0B1120]/80 p-5 transition hover:border-sky-300/30"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                {plan.name}
              </p>
              <p className="mt-4 text-3xl font-black text-white">
                {publicPlanPriceLabel(plan)}
              </p>
              {"statusLabel" in plan ? (
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
                  {plan.statusLabel}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {plan.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <PromotionBanner
            eyebrow="Pilot"
            title="First 50 operators"
            description="Pilot details, slot logic, and early operator appreciation live on one focused page."
            href="/pilot-program"
          />
          <PromotionBanner
            eyebrow="Demo"
            title="Try Karpilo LoadIQ"
            description="Use a public demo to move freight numbers and watch profitability change."
            href="/demo"
          />
          <PromotionBanner
            eyebrow="Founder"
            title="Built on the road"
            description="Read the story behind Karpilo LoadIQ and why it was designed for working operators."
            href="/founder"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <PrimaryCta mode="link" href="/demo">
            Explore Karpilo LoadIQ
          </PrimaryCta>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 sm:px-8">
        <div className="grid gap-5 rounded-[1.75rem] border border-white/10 bg-[#0B1120]/80 p-6 shadow-[0_0_40px_rgba(56,189,248,0.08)] md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">
              Founder-led
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
              Built by someone actively living trucking.
            </h2>
          </div>
          <div>
            <p className="leading-7 text-slate-300">
              Joshua Karpilo is an active driver and owner-operator with more than 13 years in trucking. Karpilo LoadIQ is shaped by real freight pressure, not boardroom theory.
            </p>
            <Link
              href="/founder"
              className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.14em] text-sky-300 transition hover:text-sky-200"
            >
              Read the founder story
            </Link>
          </div>
        </div>
      </section>

      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta label="Explore Karpilo LoadIQ" href="/demo" onWaitlist={openWaitlist} />
    </AppFrame>
  );
}

export function PricingMarketingPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Pricing"
        title="Operational pricing for clearer freight decisions."
        description="Gold is the complete operational access tier. Platinum is a planned intelligence expansion. Pilot and Launch access preserve early-user pricing locks while checkout remains controlled server-side."
      />
      <SubscriptionValuePanel />
      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {PUBLIC_PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-[1.75rem] border p-6 ${
                "featured" in plan && plan.featured
                  ? "border-red-400/35 bg-[#111827]/90 shadow-[0_0_44px_rgba(239,68,68,0.12)]"
                  : "border-white/10 bg-[#0B1120]/80"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                {plan.name}
              </p>
              <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
                {publicPlanPriceLabel(plan)}
              </p>
              {"statusLabel" in plan ? (
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
                  {plan.statusLabel}
                </p>
              ) : null}
              <p className="mt-4 leading-7 text-slate-300">{plan.description}</p>
              <div className="mt-6 space-y-3">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                    <p className="text-sm leading-6 text-slate-300">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 text-sm leading-7 text-slate-400">
          Public checkout remains disabled until payment systems are explicitly
          enabled server-side. Locked promotional pricing is handled on
          dedicated pilot and launch pages. Karpilo LoadIQ is decision-support
          software; it does not guarantee savings, profit, freight availability,
          or business outcomes.
        </div>
        <div className="mt-8 flex justify-center">
          <PrimaryCta onWaitlist={openWaitlist}>Reserve Access</PrimaryCta>
        </div>
        <div className="mx-auto mt-6 max-w-2xl">
          <AppStorePlaceholders />
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta label="Reserve Access" onWaitlist={openWaitlist} />
    </AppFrame>
  );
}

export function PilotProgramPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Founding 50 Pilot"
        title="Controlled pilot access for the first 50 approved operators."
        description="This page is the only place for pilot-specific pricing lock details, founder appreciation, and early operator messaging."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RolloutCommandCenter onReserve={openWaitlist} compact />
        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6">
          <BadgeCheck className="mb-5 h-8 w-8 text-sky-300" />
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
            {pilotProgram.name}
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            The pilot is for operational refinement, not fake urgency. Approved early operators help shape the system and may qualify for the Founding Operator lifetime pricing lock.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Pilot monthly", `$${pilotProgram.monthlyPrice}`],
              ["Pilot annual", `$${pilotProgram.annualPrice}`],
              ["Slots", `First ${pilotProgram.maxSlots}`],
              ["Badge", pilotProgram.badge],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 font-mono text-lg font-black text-sky-100">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {pilotProgram.lockRules.map((rule) => (
              <div key={rule} className="flex gap-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                <p>{rule}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm leading-6 text-slate-300">
            {pilotPaymentGate.preLaunchPolicy}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-20 sm:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1120]/80 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
            Founder note
          </p>
          <p className="mt-4 text-xl font-black tracking-[-0.035em] text-white">
            Your loyalty helped build this platform.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            Karpilo LoadIQ is being shaped by operators who understand the road, the pressure, and the cost of unclear freight decisions. Pilot feedback matters because the product is being built for people actually living the work.
          </p>
          <div className="mt-6">
            <PrimaryCta onWaitlist={openWaitlist}>Claim Pilot Access</PrimaryCta>
          </div>
          <div className="mt-6">
            <AppStorePlaceholders />
          </div>
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta label="Claim Pilot Access" onWaitlist={openWaitlist} />
    </AppFrame>
  );
}

export function LaunchPromoPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Launch Promotion"
        title="First 500 Launch Operators."
        description="The launch promotion is separate from the pilot. Pilot users are not launch users, and launch users do not occupy Founding 50 slots."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RolloutCommandCenter onReserve={openWaitlist} compact />
        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
            {launch500Program.name}
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            Official launch pricing is designed for the first broader wave of operators after pilot operations close. It is a separate launch tier with its own slot logic and legacy pricing lock.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Launch monthly", `$${launch500Program.monthlyPrice}`],
              ["Launch annual", `$${launch500Program.annualPrice}`],
              ["Launch slots", `First ${launch500Program.maxSlots}`],
              ["Standard monthly", `$${standardPricing.monthlyPrice}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 font-mono text-lg font-black text-sky-100">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryCta onWaitlist={openWaitlist}>Join Launch List</PrimaryCta>
          </div>
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta label="Join Launch List" onWaitlist={openWaitlist} />
    </AppFrame>
  );
}

function DemoMetric({
  label,
  value,
  tone = "sky",
}: {
  label: string;
  value: string;
  tone?: "sky" | "green" | "red";
}) {
  const color =
    tone === "green"
      ? "text-emerald-300"
      : tone === "red"
        ? "text-red-300"
        : "text-sky-200";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 font-mono text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function buildOperationalNote({
  trueRpm,
  projectedNet,
  fuelCost,
  loadSpecificCosts,
  overhead,
  totalMiles,
  deadheadMiles,
}: {
  trueRpm: number;
  projectedNet: number;
  fuelCost: number;
  loadSpecificCosts: number;
  overhead: number;
  totalMiles: number;
  deadheadMiles: number;
}) {
  const pressureCosts = fuelCost + loadSpecificCosts + overhead;
  const deadheadShare = totalMiles > 0 ? deadheadMiles / totalMiles : 0;

  if (projectedNet <= 0) {
    return "This load is underwater with the current inputs. Revenue does not clear fuel, fixed trip costs, and modeled overhead, so the offer needs a better rate or lower operating exposure before booking.";
  }

  if (trueRpm < demoSettings.minimumTrueRpm) {
    return `The load is still positive, but true RPM is below the ${formatCurrency(demoSettings.minimumTrueRpm, 2)} target after deadhead. Fuel, trip costs, and overhead consume ${formatCurrency(pressureCosts)} before take-home profit.`;
  }

  if (deadheadShare >= 0.18) {
    return `Profit remains positive, but deadhead is carrying ${Math.round(deadheadShare * 100)}% of total miles. The rate clears the target true RPM, yet unpaid miles are adding fuel and time pressure.`;
  }

  if (projectedNet < demoSettings.weeklyTarget / 2) {
    return `The load clears target true RPM, but projected net is modest against the weekly target. It may still work if the lane, reload options, and schedule fit the broader week.`;
  }

  return "The load clears the target true RPM after deadhead and remains above break-even after fuel, fixed trip costs, reserves, and modeled overhead.";
}

export function DemoMarketingPage() {
  const [loadedMiles, setLoadedMiles] = useState(demoLoad.loadedMiles);
  const [deadheadMiles, setDeadheadMiles] = useState(demoLoad.deadheadMiles);
  const [revenue, setRevenue] = useState(demoLoad.flatRateRevenue);
  const [fuelPrice, setFuelPrice] = useState(demoLoad.fuel.userOverrideFuelPrice);
  const [overhead, setOverhead] = useState(demoResults.modeledOverheadAndReserves);

  const totalMiles = loadedMiles + deadheadMiles;
  const fuelCost = totalMiles > 0 ? (totalMiles / demoSettings.defaultMpg) * fuelPrice : 0;
  const trueRpm = totalMiles > 0 ? revenue / totalMiles : 0;
  const loadSpecificCosts = demoResults.loadSpecificCostTotal;
  const projectedNet = revenue - fuelCost - loadSpecificCosts - overhead;
  const operationalNote = buildOperationalNote({
    trueRpm,
    projectedNet,
    fuelCost,
    loadSpecificCosts,
    overhead,
    totalMiles,
    deadheadMiles,
  });
  const controls = useMemo<
    Array<[
      string,
      number,
      number,
      number,
      number,
      Dispatch<SetStateAction<number>>,
      "miles" | "money",
    ]>
  >(
    () => [
      ["Loaded miles", loadedMiles, 100, 1200, 1, setLoadedMiles, "miles"],
      ["Deadhead miles", deadheadMiles, 0, 350, 1, setDeadheadMiles, "miles"],
      ["Gross revenue", revenue, 500, 4500, 1, setRevenue, "money"],
      ["Fuel price", fuelPrice, 2.5, 6.5, 0.01, setFuelPrice, "money"],
      ["Overhead", overhead, 0, 900, 1, setOverhead, "money"],
    ],
    [deadheadMiles, fuelPrice, loadedMiles, overhead, revenue],
  );

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Interactive demo"
        title="Try Karpilo LoadIQ."
        description="Move the core freight numbers and watch profitability, true RPM, fuel pressure, and operating cost change."
      />
      <DemoVideoPlayer />
      <section
        id="interactive-demo"
        className="mx-auto grid scroll-mt-24 max-w-7xl gap-5 px-6 pb-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1120]/85 p-6">
          {controls.map(([label, value, min, max, step, setter, unit]) => (
            <label key={label} className="mb-5 block last:mb-0">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-200">{label}</span>
                <span className="font-mono text-sm font-black text-sky-200">
                  {unit === "money"
                    ? formatCurrency(value, label === "Fuel price" ? 2 : 0)
                    : `${value} mi`}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => setter(Number(event.target.value))}
                className="mt-3 w-full accent-sky-400"
              />
            </label>
          ))}
        </div>
        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6 shadow-[0_0_60px_rgba(56,189,248,0.12)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <DemoMetric label="True RPM" value={`$${trueRpm.toFixed(2)}`} tone="green" />
            <DemoMetric label="Fuel estimate" value={formatCurrency(fuelCost)} tone="red" />
            <DemoMetric
              label="Projected net"
              value={formatCurrency(projectedNet)}
              tone={projectedNet > 0 ? "green" : "red"}
            />
            <DemoMetric label="Estimate vs actual" value={formatCurrency(demoComparison.variance.netDifference)} tone="red" />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
              Operational note
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              {operationalNote}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {demoSteps.slice(0, 3).map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5">
              <h3 className="text-lg font-black tracking-[-0.03em] text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-6 text-slate-500">{demoDisclaimer}</p>
        <div className="mt-6 max-w-2xl">
          <AppStorePlaceholders />
        </div>
      </section>
    </AppFrame>
  );
}

export function FounderMarketingPage() {
  return (
    <AppFrame>
      <PageHeader
        eyebrow={founderStory.eyebrow}
        title="Joshua Karpilo built Karpilo LoadIQ from inside the work."
        description="The founder story belongs here, where it can build trust without competing against pricing, demo, or pilot conversion paths."
      />
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/85 p-6 shadow-[0_0_70px_rgba(56,189,248,0.12)] sm:p-10">
          <p className="text-2xl font-black tracking-[-0.04em] text-sky-200">
            {founderStory.quote}
          </p>
          <div className="mt-8 space-y-5">
            {founderStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-10 rounded-[1.75rem] border border-sky-300/20 bg-sky-400/10 p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              Founder welcome
            </p>
            <div className="mt-5 space-y-4">
              {founderWelcomeCopy.map((line) => (
                <p key={line} className="leading-7 text-slate-200">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {educationCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <h2 className="text-lg font-black tracking-[-0.03em] text-white">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{card.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <PrimaryCta mode="link" href="/pilot-program">
              Learn the Vision
            </PrimaryCta>
          </div>
        </div>
        <p className="mt-6 text-xs leading-6 text-slate-500">
          {PRODUCT_DISCLAIMER_SNIPPET}
        </p>
      </section>
    </AppFrame>
  );
}
