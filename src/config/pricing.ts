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
  name: "Gold Access",
  monthlyPrice: 29.99,
  annualPrice: 299.99,
} as const;

export const PLATINUM_ACCESS = {
  name: "Platinum Access",
  status: "Coming Soon",
  monthlyPrice: 34.99,
  annualPrice: 349.99,
  priceLabel: "$34.99/mo or $349.99/year",
  annualPositioning:
    "Planned premium intelligence layer that expands Gold with advanced trend and forecasting concepts.",
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
      "7-day free trial where provider rules allow",
      "Lifetime pricing lock while the account remains active and in good standing",
      "Future released Karpilo LoadIQ platform features made generally available inside the platform ecosystem",
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
      "7-day free trial where provider rules allow",
      "First 500 launch users across two phases of 250",
      "Lifetime pricing lock with future released Karpilo LoadIQ platform features made generally available inside the platform ecosystem",
    ],
  },
  {
    id: "standard-monthly",
    tier: "standard",
    name: "Gold Monthly",
    price: STANDARD_ACCESS.monthlyPrice,
    interval: "month",
    description:
      "Full operational feature tier for disciplined freight decisions before the truck moves.",
    cta: "Gold reservation",
    bullets: [
      "7-day free trial where provider rules allow",
      "Load, route, fuel, overhead, and trip margin visibility",
      "Decision support for deadhead exposure, fuel variance, and operational leakage",
      "Prices are subject to change for future billing periods or future subscribers",
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
      "7-day free trial where provider rules allow",
      "Lifetime pricing lock with future released Karpilo LoadIQ platform features made generally available inside the platform ecosystem",
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
      "Two controlled phases of 250 users",
      "7-day free trial and lifetime pricing lock where provider rules allow",
    ],
  },
  {
    id: "standard-annual",
    tier: "standard",
    name: "Gold Annual",
    price: STANDARD_ACCESS.annualPrice,
    interval: "year",
    description:
      "Annual Gold access for year-round visibility, overhead awareness, and operating discipline.",
    cta: "Gold annual",
    savingsLabel: "Gold annual rate",
    bullets: [
      "7-day free trial where provider rules allow",
      "Full operational feature tier with lower effective monthly overhead",
      "Trip margin awareness, recurring overhead visibility, and saved decision history",
      "Prices are subject to change for future billing periods or future subscribers",
    ],
  },
  {
    id: "platinum-planned",
    tier: "platinum",
    name: "Platinum Planned",
    price: 0,
    priceLabel: PLATINUM_ACCESS.priceLabel,
    interval: "year",
    description:
      "Planned premium operational intelligence that enhances Gold with deeper trend visibility and future reporting.",
    cta: "Platinum updates",
    statusLabel: PLATINUM_ACCESS.status,
    savingsLabel: "Planned premium layer",
    bullets: [
      "7-day free trial planned where provider rules allow",
      "Prices are subject to change before release",
      "Gold remains the complete operational access tier; Platinum adds advanced intelligence",
      "IFTA estimation intelligence with verification-required disclaimers",
      "Maintenance and out-of-route intelligence for operational refinement",
      "Year-over-year and month-to-month profitability pattern visibility",
      "Driver habit insights, efficiency drift signals, and margin compression trends",
      "Premium reporting experience planned for a later release",
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
