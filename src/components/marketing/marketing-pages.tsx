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
import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { RolloutCommandCenter } from "@/components/rollout/rollout-command-center";
import WaitlistModal from "@/components/waitlist/waitlist-modal";
import { LOADIQ_BRAND, LOADIQ_ROUTES, LOADIQ_URLS } from "@/config/loadiq";
import {
  FEATURE_WORKFLOW_GROUPS,
  PRODUCT_DISCLAIMER_SNIPPET,
  PRODUCT_FEATURE_GROUPS,
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
  DISCOUNTED_ENROLLMENT_PHASES,
  LOADIQ_COMMERCIAL_TIER_LIST,
  LOADIQ_COMMERCIAL_TIERS,
  LOADIQ_PRO_MODELED_TRUCK_SURCHARGE,
  formatCommercialPriceLabel,
} from "@/config/pricing";
import {
  educationCards,
  founderStory,
  founderWelcomeCopy,
  launchPhase1Program,
  launchPhase2Program,
  pilotPaymentGate,
  pilotProgram,
} from "@/config/launch";
import { ROLLOUT_PHASES } from "@/config/rollout";

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

const operatorProblemPoints = [
  "Gross revenue is not profit.",
  "RPM can lie when deadhead is ignored.",
  "Fuel price changes the load before the wheels turn.",
  "Fixed and variable costs decide whether the rate really works.",
  "Accessorials, tolls, factoring, dispatch fees, and pay structure can distort the real number.",
] as const;

const loadIqDoesPoints = [
  "Estimates load profitability from user-entered freight assumptions.",
  "Calculates gross RPM, projected net, and true RPM after deadhead.",
  "Evaluates fuel exposure and operating cost pressure.",
  "Supports break-even awareness before an independent load decision.",
  "Helps operators compare freight assumptions without acting as a broker or dispatcher.",
] as const;

const productBoundaryPoints = [
  "Not a dispatch platform, broker, or load board.",
  "Not an ELD, routing authority, or compliance advisor.",
  "Not a tax, legal, accounting, or insurance advisor.",
  "Not a guaranteed-profit system.",
] as const;

const requestAccessPoints = [
  "Request Access places the operator into controlled launch consideration.",
  "Access is limited by phase availability, approval status, and provider readiness.",
  "Slot assignment and billing eligibility must be confirmed server-side.",
  "Public signup and public checkout are not currently available.",
] as const;

const issuedUserPoints = [
  "Issued users access the app portal at app.karpilo-liq.com.",
  "Saved calculations, operating profiles, app settings, and the app dashboard belong in the app portal.",
  "The public website explains the product, pricing, launch order, support, and legal boundaries.",
] as const;

const billingChannelPoints = [
  {
    title: "Website / Stripe Billing",
    description:
      "Website subscriptions are processed through Stripe. Stripe subscribers may manage payment method, invoices, cancellation, and plan billing through the Stripe billing portal when available.",
  },
  {
    title: "Apple App Store Billing",
    description:
      "Apple App Store subscriptions are managed by Apple. Karpilo LoadIQ cannot directly modify Apple App Store billing from the website.",
  },
  {
    title: "Google Play Billing",
    description:
      "Google Play subscriptions are managed by Google. Karpilo LoadIQ cannot directly modify Google Play billing from the website.",
  },
] as const;

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
            overhead gap can exceed the cost of better decision support.
            Karpilo LoadIQ does not guarantee savings; it helps expose pressure
            earlier so decisions can be made with clearer numbers at the right
            commercial depth.
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

function CommercialTierCard({
  tier,
  compact = false,
}: {
  tier: (typeof LOADIQ_COMMERCIAL_TIER_LIST)[number];
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        tier.id === "gold"
          ? "border-red-400/35 bg-[#111827]/90 shadow-[0_0_44px_rgba(239,68,68,0.12)]"
          : "border-white/10 bg-[#0B1120]/80"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
        Karpilo LoadIQ {tier.name}
      </p>
      <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
        {tier.decisionSupportDepth}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{tier.coreQuestion}</p>
      <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-xs leading-5 text-slate-300">
        <div>
          <span className="font-black uppercase tracking-[0.14em] text-slate-500">
            Intended user
          </span>
          <p className="mt-1 text-slate-200">{tier.intendedUser}</p>
        </div>
        <div>
          <span className="font-black uppercase tracking-[0.14em] text-slate-500">
            Maturity
          </span>
          <p className="mt-1 text-slate-200">{tier.operationalMaturity}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
        <div className="flex justify-between gap-4">
          <span>Monthly</span>
          <strong className="text-white">
            {formatCommercialPriceLabel(tier.monthlyPrice, "month")}
          </strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Annual</span>
          <strong className="text-white">
            {formatCommercialPriceLabel(tier.annualPrice, "year")}
          </strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Enrollment discount</span>
          <strong className="text-white">
            {formatCommercialPriceLabel(
              tier.enrollmentDiscountMonthlyPrice,
              "month",
            )}
          </strong>
        </div>
        {tier.id === "pro" ? (
          <div className="flex justify-between gap-4 border-t border-white/10 pt-2">
            <span>{LOADIQ_PRO_MODELED_TRUCK_SURCHARGE.label}</span>
            <strong className="text-right text-white">
              {LOADIQ_PRO_MODELED_TRUCK_SURCHARGE.priceLabel}
            </strong>
          </div>
        ) : null}
      </div>
      {!compact ? (
        <>
          <div className="mt-5 space-y-3">
            {tier.capabilities.map((capability) => (
              <div key={capability} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                <p className="text-sm leading-6 text-slate-300">{capability}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-400/5 p-4 text-sm leading-6 text-sky-100">
            {tier.upgradePath}
          </p>
        </>
      ) : null}
      <p className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-xs font-bold leading-6 text-red-100">
        {tier.launchAvailability}
      </p>
    </div>
  );
}

function EnrollmentPhaseCard({
  phase,
}: {
  phase: (typeof DISCOUNTED_ENROLLMENT_PHASES)[number];
}) {
  const tierNames = phase.selectablePlans
    .map((tierId) => LOADIQ_COMMERCIAL_TIERS[tierId].name)
    .join(", ");

  return (
    <div className="rounded-[1.5rem] border border-sky-300/20 bg-sky-400/5 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
        {phase.shortName}
      </p>
      <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
        {phase.name}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{phase.purpose}</p>
      <div className="mt-5 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
        <div className="flex justify-between gap-4">
          <span>Capacity</span>
          <strong className="text-right text-white">{phase.capacityLabel}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Available tiers</span>
          <strong className="text-right text-white">{tierNames}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Discount</span>
          <strong className="text-right text-white">{phase.discountLabel}</strong>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        Eligibility, slot assignment, and provider price mapping must be
        confirmed server-side before checkout can activate.
      </p>
    </div>
  );
}

function FeatureGroupSection({
  groups = PRODUCT_FEATURE_GROUPS,
}: {
  groups?: readonly {
    eyebrow: string;
    title: string;
    description: string;
    features: readonly { title: string; description: string }[];
  }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="grid gap-6">
        {groups.map((group, groupIndex) => (
          <div
            key={group.eyebrow}
            className="grid gap-5 border-t border-white/10 pt-8 lg:grid-cols-[0.82fr_1.18fr]"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
                {group.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
                {group.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-300">{group.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.features.map((feature, featureIndex) => {
                const Icon =
                  featureIcons[(groupIndex * 4 + featureIndex) % featureIcons.length];

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5"
                  >
                    <Icon className="mb-4 h-6 w-6 text-sky-300" />
                    <h3 className="text-lg font-black tracking-[-0.03em] text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TextPointSection({
  eyebrow,
  title,
  description,
  points,
  columns = "lg:grid-cols-5",
}: {
  eyebrow: string;
  title: string;
  description: string;
  points: readonly string[];
  columns?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="grid gap-7 border-t border-white/10 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 leading-7 text-slate-300">{description}</p>
        </div>
        <div className={`grid gap-3 sm:grid-cols-2 ${columns}`}>
          {points.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-4"
            >
              <p className="text-sm font-bold leading-6 text-slate-200">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8">
      <div className="grid gap-6 rounded-[1.5rem] border border-sky-300/20 bg-[#0B1120]/85 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
            Controlled Access
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
            Request access for controlled launch consideration.
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            Public signup is not currently available. Issued users can access
            the app portal, and website billing applies only to Stripe/web
            subscribers once subscription access is issued.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
          <PrimaryCta mode="link" href={LOADIQ_ROUTES.demo}>
            View Demo
          </PrimaryCta>
          <Link
            href={LOADIQ_URLS.appPortal}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/20"
          >
            Open Portal
          </Link>
        </div>
      </div>
    </section>
  );
}

function BillingChannelSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
      <div className="grid gap-5 border-t border-white/10 pt-8 lg:grid-cols-3">
        {billingChannelPoints.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5"
          >
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-sky-300">
              {point.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {point.description}
            </p>
          </div>
        ))}
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
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
            <Link
              href={LOADIQ_ROUTES.demo}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-100 transition hover:border-sky-300/35 hover:text-sky-200"
            >
              View Demo
            </Link>
            <Link
              href={LOADIQ_URLS.appPortal}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/20"
            >
              Open Portal
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 max-w-xl">
            <AppStorePlaceholders />
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-xs leading-6 text-slate-500">
            Public signup is not currently available. Early access is limited
            by controlled launch phase, approval status, and provider readiness.
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
            A compact freight estimation screen for fuel, deadhead, overhead, reserves, and projected net before the user makes an independent load decision.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <RolloutCommandCenter
          onReserve={openWaitlist}
          compact
          showPublicLaunchCountdown
        />
      </section>

      <TextPointSection
        eyebrow="The Problem"
        title="The rate is only useful after the real costs show up."
        description="A load can look strong until deadhead, fuel, overhead, fees, and pay structure expose the actual operating pressure."
        points={operatorProblemPoints}
      />

      <TextPointSection
        eyebrow="What LoadIQ Does"
        title="Calculation-based freight profitability intelligence."
        description="Karpilo LoadIQ helps operators inspect freight assumptions before making their own load decisions."
        points={loadIqDoesPoints}
      />

      <FeatureGroupSection />

      <TextPointSection
        eyebrow="Product Boundaries"
        title="Decision support, not operational authority."
        description="Karpilo LoadIQ provides calculation-based freight profitability intelligence and operational decision support."
        points={productBoundaryPoints}
        columns="lg:grid-cols-4"
      />

      <FinalCtaSection />

      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
    </AppFrame>
  );
}

export function PricingMarketingPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Pricing"
        title="Pricing by decision-support depth."
        description="Silver, Gold, Platinum, and Pro define how deeply Karpilo LoadIQ supports freight profitability decisions. Pilot Access, Launch Phase 1, and Launch Phase 2 control rollout eligibility while checkout remains controlled server-side."
      />
      <SubscriptionValuePanel />
      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-4">
          {LOADIQ_COMMERCIAL_TIER_LIST.map((tier) => (
            <CommercialTierCard key={tier.id} tier={tier} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {DISCOUNTED_ENROLLMENT_PHASES.map((phase) => (
            <EnrollmentPhaseCard key={phase.id} phase={phase} />
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 md:grid-cols-4">
          {LOADIQ_COMMERCIAL_TIER_LIST.map((tier) => (
            <div key={tier.id} className="text-sm leading-6 text-slate-300">
              <p className="font-black uppercase tracking-[0.16em] text-sky-300">
                {tier.name}
              </p>
              <p className="mt-2 text-white">{tier.homepageStory}</p>
              <p className="mt-2 text-slate-400">{tier.upgradePath}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 text-sm leading-7 text-slate-400">
          Public checkout remains disabled until payment systems are explicitly
          enabled server-side. Enrollment discounts are rollout eligibility
          programs, not separate subscription tiers. Pro includes a
          $10.00/month charge per additional truck. Karpilo LoadIQ is
          decision-support software; it does not guarantee savings, profit,
          freight availability, or business outcomes. Final public pricing may
          change before Open Market launch if the launch-readiness review
          requires it.
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
          <PrimaryCta mode="link" href={LOADIQ_ROUTES.launch}>
            View Launch Phases
          </PrimaryCta>
          <PrimaryCta mode="link" href={LOADIQ_ROUTES.demo}>
            View Demo
          </PrimaryCta>
          <Link
            href={LOADIQ_URLS.appPortal}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/20"
          >
            Open Portal
          </Link>
        </div>
        <div className="mx-auto mt-6 max-w-2xl">
          <AppStorePlaceholders />
        </div>
      </section>
      <BillingChannelSection />
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
    </AppFrame>
  );
}

export function FeaturesMarketingPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Features"
        title="Freight profitability workflow, explained cleanly."
        description="The public website explains LoadIQ's decision-support workflow. App functionality, saved calculations, operating profiles, and account settings belong in the app portal."
      />
      <FeatureGroupSection groups={FEATURE_WORKFLOW_GROUPS} />
      <TextPointSection
        eyebrow="Product Boundaries"
        title="LoadIQ supports decisions. It does not become the operator."
        description="Every estimate depends on user inputs, assumptions, and operating conditions. Operators remain responsible for freight, routing, compliance, safety, tax, legal, accounting, and insurance decisions."
        points={productBoundaryPoints}
        columns="lg:grid-cols-4"
      />
      <FinalCtaSection />
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
    </AppFrame>
  );
}

function RolloutPhasePresetCard({
  phase,
  index,
}: {
  phase: (typeof ROLLOUT_PHASES)[number];
  index: number;
}) {
  const capacity =
    phase.capacity === null ? "Controlled by readiness" : `${phase.capacity} slots`;
  const duration =
    phase.durationDays === null ? "No fixed public duration" : `${phase.durationDays} days`;

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-[#0B1120]/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            {phase.shortLabel}
          </p>
          <h3 className="mt-3 text-xl font-black tracking-[-0.035em] text-white">
            {phase.title}
          </h3>
        </div>
        <span className="rounded-full border border-red-300/25 bg-red-500/10 px-3 py-1 font-mono text-xs font-black text-red-100">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{phase.description}</p>
      <div className="mt-5 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
        <div className="flex justify-between gap-4">
          <span>Capacity</span>
          <strong className="text-right text-white">{capacity}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Slot range</span>
          <strong className="text-right text-white">{phase.slotRange}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Duration</span>
          <strong className="text-right text-white">{duration}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span>Public action</span>
          <strong className="text-right text-white">Request Access</strong>
        </div>
      </div>
      <p className="mt-4 rounded-2xl border border-sky-300/15 bg-sky-400/5 p-4 text-sm leading-6 text-slate-400">
        {phase.expectation}
      </p>
    </article>
  );
}

export function LaunchMarketingPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Controlled Launch"
        title="Controlled launch access."
        description="Pilot 100 comes first. Launch Phase 1 adds 250 approved users, Launch Phase 2 adds 250 approved users, and Open Market follows only when public signup is intentionally enabled."
      />
      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <RolloutCommandCenter
          onReserve={openWaitlist}
          showPublicLaunchCountdown
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {ROLLOUT_PHASES.map((phase, index) => (
            <RolloutPhasePresetCard key={phase.key} phase={phase} index={index} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-[1.5rem] border border-red-300/20 bg-red-500/10 p-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
              Signup State
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
              Public signup is not currently available.
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-slate-300">
              Users may request access for controlled launch consideration.
              Access is limited by launch phase availability, approval status,
              and provider readiness. The portal is available for issued or
              restricted-access accounts, but it should not be treated as open
              public signup.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
              <PrimaryCta mode="link" href={LOADIQ_ROUTES.demo}>
                View Demo
              </PrimaryCta>
              <Link
                href={LOADIQ_URLS.appPortal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/20"
              >
                Open Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
      <TextPointSection
        eyebrow="Request Access"
        title="A request is not an instant account or checkout."
        description="Karpilo LoadIQ must confirm launch phase availability, approval status, provider readiness, and billing eligibility before subscription access is issued."
        points={requestAccessPoints}
        columns="lg:grid-cols-4"
      />
      <TextPointSection
        eyebrow="Issued Users"
        title="The app portal holds the app experience."
        description="Public website routes explain the product and launch order. App functionality belongs to the issued-user app portal."
        points={issuedUserPoints}
        columns="lg:grid-cols-3"
      />
      <TextPointSection
        eyebrow="Pricing Relationship"
        title="Launch phases are rollout eligibility, not subscription tiers."
        description="Silver, Gold, Platinum, and Pro remain commercial tiers. Pilot Access, Launch Phase 1, Launch Phase 2, and Open Market describe adoption order and access pacing."
        points={[
          "Pilot Access covers the first 100 approved users.",
          "Launch Phase 1 covers the next 250 approved users.",
          "Launch Phase 2 covers the next 250 approved users.",
          "Open Market begins only when public availability is intentionally enabled.",
        ]}
        columns="lg:grid-cols-4"
      />
      <BillingChannelSection />
      <TextPointSection
        eyebrow="Boundary"
        title="LoadIQ is decision support, not a replacement for operator judgment."
        description="The website must stay honest about what LoadIQ does and does not do."
        points={productBoundaryPoints}
        columns="lg:grid-cols-4"
      />
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
    </AppFrame>
  );
}

export function PilotProgramPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Pilot Enrollment"
        title="Discounted pilot enrollment for the first 100 approved operators."
        description="Pilot enrollment is a rollout phase. Silver, Gold, Platinum, and Pro remain the commercial tiers."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RolloutCommandCenter onReserve={openWaitlist} compact />
        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6">
          <BadgeCheck className="mb-5 h-8 w-8 text-sky-300" />
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
            {pilotProgram.name}
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            The pilot is for operational refinement, not fake urgency. Approved
            early operators help shape the system and may qualify for
            discounted enrollment on their selected commercial tier.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Capacity", `First ${pilotProgram.maxSlots}`],
              ["Tiers", "Silver, Gold, Platinum, Pro"],
              ["Discount", pilotProgram.discountLabel],
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
            <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
          </div>
          <div className="mt-6">
            <AppStorePlaceholders />
          </div>
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
    </AppFrame>
  );
}

export function LaunchPromoPage() {
  const { waitlistOpen, openWaitlist, closeWaitlist } = useWaitlistModal();

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Controlled Launch"
        title="Launch Phase 1 and Launch Phase 2 now live under the launch page."
        description="The former second-enrollment concept is now split into two 250-user controlled launch phases after Pilot Access."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RolloutCommandCenter onReserve={openWaitlist} compact />
        <div className="rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-6">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white">
            Pilot 100 {"->"} Launch 250 {"->"} Launch 250 {"->"} Open Market
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            Launch access is approval-based and separated from commercial
            subscription tiers. The public source of truth is now the launch
            page.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Phase 1", `${launchPhase1Program.maxSlots} approved users`],
              ["Phase 2", `${launchPhase2Program.maxSlots} approved users`],
              ["Tiers", "Silver, Gold, Platinum, Pro"],
              ["Action", "Request Access"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 font-mono text-lg font-black text-sky-100">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryCta mode="link" href={LOADIQ_URLS.appRequestAccess}>Request Access</PrimaryCta>
          </div>
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
      <StickyMobileCta
        label="Request Access"
        onWaitlist={openWaitlist}
        href={LOADIQ_URLS.appRequestAccess}
      />
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
