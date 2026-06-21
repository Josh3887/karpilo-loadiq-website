export type PublicPlanId = "silver" | "gold" | "platinum" | "pro";
export type InternalPlanTier = "founder" | "launch" | "standard" | "platinum";
export type BillingInterval = "month" | "year";
export type LoadIqCommercialTierId = PublicPlanId;
export type LoadIqCommercialTier = {
  id: LoadIqCommercialTierId;
  name: string;
  decisionSupportDepth: string;
  coreQuestion: string;
  homepageStory: string;
  monthlyPrice: number;
  annualPrice: number;
  legacyLaunchMonthlyPrice: number;
  upgradePath: string;
  capabilities: readonly string[];
  displayOnly: true;
};

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
    "Pilot pricing remains locked while the subscription stays active and applies only within the purchased entitlement scope and current Karpilo LoadIQ product family. It is lost if canceled, deleted, or transferred.",
} as const;

export const LAUNCH_ACCESS = {
  name: "Launch 500 Access",
  maxSeats: 500,
  monthlyPrice: 19.99,
  annualPrice: 149.99,
} as const;

export const STANDARD_ACCESS = {
  name: "Gold",
  monthlyPrice: 39.99,
  annualPrice: 399,
} as const;

export const PLATINUM_ACCESS = {
  name: "Platinum",
  status: "Display Only",
  monthlyPrice: 69.99,
  annualPrice: 699,
  priceLabel: "$69.99/mo or $699/year",
  annualPositioning: "Variance Intelligence for profitability pattern context.",
} as const;

export const LOADIQ_PRO_MODELED_TRUCK_SURCHARGE = {
  label: "Additional truck",
  monthlyPrice: 10,
  priceLabel: "$10.00/mo per additional truck",
  displayOnly: true,
} as const;

export const LOADIQ_COMMERCIAL_TIERS = {
  silver: {
    id: "silver",
    name: "Silver",
    decisionSupportDepth: "Load Viability",
    coreQuestion: "Is this load worth hauling?",
    homepageStory: "Know if the load is worth hauling.",
    monthlyPrice: 19.99,
    annualPrice: 199,
    legacyLaunchMonthlyPrice: 14.99,
    upgradePath:
      "Upgrade to Gold when one-off load checks become repeat freight decisions.",
    capabilities: [
      "Load viability decision support",
      "Freight profitability estimate positioning",
      "Break-even and margin pressure framing",
      "Load-level operating-cost awareness",
    ],
    displayOnly: true,
  },
  gold: {
    id: "gold",
    name: "Gold",
    decisionSupportDepth: "Operational Visibility",
    coreQuestion: "What freight should I repeat, avoid, or adjust?",
    homepageStory: "Know which freight to repeat.",
    monthlyPrice: 39.99,
    annualPrice: 399,
    legacyLaunchMonthlyPrice: 24.99,
    upgradePath:
      "Upgrade to Platinum when saved patterns and actuals need deeper variance explanation.",
    capabilities: [
      "Operational freight pattern visibility",
      "Repeat, avoid, or adjust decision support",
      "Saved-load and workflow context positioning",
      "Lane, pay, fuel, overhead, and margin awareness",
    ],
    displayOnly: true,
  },
  platinum: {
    id: "platinum",
    name: "Platinum",
    decisionSupportDepth: "Variance Intelligence",
    coreQuestion:
      "Why are my estimates wrong and what patterns are affecting profitability?",
    homepageStory: "Know why profitability changes.",
    monthlyPrice: 69.99,
    annualPrice: 699,
    legacyLaunchMonthlyPrice: 49.99,
    upgradePath:
      "Upgrade to Pro when variance intelligence needs to support scale, capital, and growth planning.",
    capabilities: [
      "Estimate-to-actual variance positioning",
      "Profitability pattern interpretation",
      "Margin compression and operating drift awareness",
      "Maintenance, fuel, route, and expense pattern context",
    ],
    displayOnly: true,
  },
  pro: {
    id: "pro",
    name: "Pro",
    decisionSupportDepth: "Growth Intelligence",
    coreQuestion: "Can this operation scale safely and profitably?",
    homepageStory: "Know when your operation is ready to grow.",
    monthlyPrice: 149.99,
    annualPrice: 1499,
    legacyLaunchMonthlyPrice: 99.99,
    upgradePath:
      "Use Pro when repeatable per-truck modeling, capital planning, reserve goals, and growth thresholds become necessary.",
    capabilities: [
      "Scale projection positioning",
      "Threshold, reserve, and capital planning context",
      "Hiring and expansion modeling positioning",
      "Risk forecasting and repeatable per-truck modeling context",
    ],
    displayOnly: true,
  },
} as const satisfies Record<LoadIqCommercialTierId, LoadIqCommercialTier>;

export const LOADIQ_COMMERCIAL_TIER_LIST = [
  LOADIQ_COMMERCIAL_TIERS.silver,
  LOADIQ_COMMERCIAL_TIERS.gold,
  LOADIQ_COMMERCIAL_TIERS.platinum,
  LOADIQ_COMMERCIAL_TIERS.pro,
] as const;

export const PUBLIC_PRICING_PLANS = LOADIQ_COMMERCIAL_TIER_LIST;

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

export function formatCommercialPriceLabel(price: number, interval: BillingInterval) {
  const displayPrice = Number.isInteger(price) ? String(price) : price.toFixed(2);
  return `$${displayPrice}/${interval === "month" ? "mo" : "yr"}`;
}
