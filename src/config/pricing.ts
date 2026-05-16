export type PublicPlanId =
  | "founder-monthly"
  | "founder-annual"
  | "launch-monthly"
  | "launch-annual"
  | "standard-monthly"
  | "standard-annual"
  | "platinum-planned";
export type InternalPlanTier = "founder" | "launch" | "standard" | "platinum";
export type BillingInterval = "month" | "year";

export const FOUNDER_ACCESS = {
  name: "Founding 50 Pilot Access",
  maxSeats: 50,
  publicTeaser: "First 50 approved operators may qualify for Founding 50 Pilot Access.",
  hiddenPricingEnabled: false,
  inviteCodeRequired: false,
  monthlyPrice: 14.99,
  annualPrice: 129.99,
} as const;

export const PILOT_ACCESS = {
  name: "Founding 50 Pilot Access",
  publicTeaser:
    "Pilot Operator Access may be available for the first 50 approved early-access users.",
  maxSeats: 50,
  durationDays: 30,
  monthlyPrice: 14.99,
  annualPrice: 129.99,
  lifetimeLockRule:
    "Pilot pricing remains locked while the subscription stays active and is lost if canceled, deleted, or transferred.",
} as const;

export const LAUNCH_ACCESS = {
  name: "Launch 500 Access",
  maxSeats: 500,
  monthlyPrice: 19.99,
  annualPrice: 149.99,
} as const;

export const STANDARD_ACCESS = {
  name: "Standard Access",
  monthlyPrice: 24.99,
  annualPrice: 189.99,
} as const;

export const PLATINUM_ACCESS = {
  name: "Platinum Annual",
  status: "Coming Soon",
  referencePrice: 34.99,
  priceLabel: "Coming soon",
  annualPositioning:
    "Planned premium intelligence layer with user-selectable annual commitment structure.",
} as const;

export const PUBLIC_PRICING_PLANS = [
  {
    id: "founder-monthly",
    tier: "founder",
    name: "Founder Pilot Monthly",
    price: PILOT_ACCESS.monthlyPrice,
    interval: "month",
    description: "Reserved for the first 50 approved founder pilot users.",
    cta: "Founder reservation",
    bullets: [
      "No free trial during the initial pilot",
      "Pricing lock controlled by Supabase reservation authority",
      "Available while the account remains active and in good standing",
    ],
  },
  {
    id: "launch-monthly",
    tier: "launch",
    name: "Launch Monthly",
    price: LAUNCH_ACCESS.monthlyPrice,
    interval: "month",
    description: "Reserved for the next 500 launch users after founder pilot allocation.",
    cta: "Launch reservation",
    featured: true,
    bullets: [
      "No free trial initially",
      "Launch cohort pricing controlled by Supabase",
      "Stripe, Apple, and Google remain billing channels only",
    ],
  },
  {
    id: "standard-monthly",
    tier: "standard",
    name: "Standard Monthly",
    price: STANDARD_ACCESS.monthlyPrice,
    interval: "month",
    description: "Standard public subscription pricing after launch cohorts.",
    cta: "Standard reservation",
    bullets: [
      "No permanent free tier initially",
      "Public access after launch cohort allocation",
      "Checkout remains disabled until billing is wired",
    ],
  },
  {
    id: "founder-annual",
    tier: "founder",
    name: "Founder Pilot Annual",
    price: PILOT_ACCESS.annualPrice,
    interval: "year",
    description: "Annual founder pilot access for approved Founding 50 users.",
    cta: "Founder annual",
    bullets: [
      "First 50 founder pilot users only",
      "No permanent free tier",
      "Billing provider selected after eligibility review",
    ],
  },
  {
    id: "launch-annual",
    tier: "launch",
    name: "Launch Annual",
    price: LAUNCH_ACCESS.annualPrice,
    interval: "year",
    description: "Annual launch cohort pricing for the first 500 launch users.",
    cta: "Launch annual",
    savingsLabel: "Launch cohort annual rate",
    bullets: [
      "First 500 launch users",
      "No free trial initially",
      "Pricing lock eligibility stored server-side",
    ],
  },
  {
    id: "standard-annual",
    tier: "standard",
    name: "Standard Annual",
    price: STANDARD_ACCESS.annualPrice,
    interval: "year",
    description: "Standard annual pricing for year-round freight decisions.",
    cta: "Standard annual",
    savingsLabel: "Standard annual rate",
    bullets: [
      "No lifetime pricing lock",
      "No permanent free tier initially",
      "Future billing through selected provider channel",
    ],
  },
  {
    id: "platinum-planned",
    tier: "platinum",
    name: "Platinum Annual",
    price: 0,
    priceLabel: PLATINUM_ACCESS.priceLabel,
    interval: "year",
    description:
      "Planned premium operational intelligence for deeper trend visibility and future reporting.",
    cta: "Platinum updates",
    statusLabel: PLATINUM_ACCESS.status,
    savingsLabel: "Planned premium layer",
    bullets: [
      "IFTA estimation intelligence with verification-required disclaimers",
      "Maintenance and out-of-route intelligence for operational refinement",
      "Year-over-year and month-to-month profitability pattern visibility",
      "Driver habit insights, efficiency drift signals, and margin compression trends",
      "Premium reporting/dashboard experience planned for a later release",
    ],
  },
] as const;

export const INTERNAL_FOUNDER_PLANS = [
  {
    tier: "founder",
    name: "Founder Monthly",
    price: PILOT_ACCESS.monthlyPrice,
    interval: "month" as BillingInterval,
  },
  {
    tier: "founder",
    name: "Founder Annual",
    price: PILOT_ACCESS.annualPrice,
    interval: "year" as BillingInterval,
  },
] as const;

export function formatPriceLabel(price: number, interval: BillingInterval) {
  if (price === 0) return "$0";
  return `$${price.toFixed(2)}/${interval === "month" ? "mo" : "yr"}`;
}
