export type PublicPlanId = "silver" | "gold" | "platinum" | "pro";
export type InternalPlanTier =
  | "pilot_enrollment"
  | "second_enrollment"
  | "standard"
  | PublicPlanId;
export type BillingInterval = "month" | "year";
export type LoadIqCommercialTierId = PublicPlanId;
export type LoadIqCommercialTier = {
  id: LoadIqCommercialTierId;
  name: string;
  decisionSupportDepth: string;
  intendedUser: string;
  operationalMaturity: string;
  coreQuestion: string;
  homepageStory: string;
  launchAvailability: string;
  monthlyPrice: number;
  annualPrice: number;
  enrollmentDiscountMonthlyPrice: number;
  upgradePath: string;
  capabilities: readonly string[];
  displayOnly: true;
};

export type TieredEnrollmentPhaseId =
  | "pilot_access"
  | "launch_phase_1"
  | "launch_phase_2"
  | "open_market";

export type TieredEnrollmentPhase = {
  id: TieredEnrollmentPhaseId;
  name: string;
  shortName: string;
  cap: number | null;
  capacityLabel: string;
  purpose: string;
  discountLabel: string;
  lifetimePricing: boolean;
  selectablePlans: readonly LoadIqCommercialTierId[];
};

export const LOADIQ_PRO_MODELED_TRUCK_SURCHARGE = {
  label: "Additional truck",
  monthlyPrice: 10,
  priceLabel: "$10.00/mo per additional truck",
  displayOnly: true,
} as const;

export const AVAILABLE_ENROLLMENT_TIER_IDS = [
  "silver",
  "gold",
  "platinum",
  "pro",
] as const satisfies readonly LoadIqCommercialTierId[];

export const LOADIQ_COMMERCIAL_TIERS = {
  silver: {
    id: "silver",
    name: "Silver",
    decisionSupportDepth: "Load Viability",
    intendedUser:
      "Owner-operators or leased operators who need quick load-level viability checks.",
    operationalMaturity: "Single-load decision support",
    coreQuestion: "Is this load worth hauling?",
    homepageStory: "Know if the load is worth hauling.",
    launchAvailability:
      "Available by controlled launch phase. Public subscription signup is not currently available.",
    monthlyPrice: 19.99,
    annualPrice: 199,
    enrollmentDiscountMonthlyPrice: 14.99,
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
    intendedUser:
      "Operators who compare repeat freight, lane pressure, and operating assumptions across a working week.",
    operationalMaturity: "Repeat freight visibility",
    coreQuestion: "What freight should I repeat, avoid, or adjust?",
    homepageStory: "Know which freight to repeat.",
    launchAvailability:
      "Available by controlled launch phase. Public subscription signup is not currently available.",
    monthlyPrice: 39.99,
    annualPrice: 399,
    enrollmentDiscountMonthlyPrice: 24.99,
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
    intendedUser:
      "Operators reviewing why estimates and actual results differ across fuel, route, maintenance, and expense patterns.",
    operationalMaturity: "Estimate-to-actual interpretation",
    coreQuestion:
      "Why are my estimates wrong and what patterns are affecting profitability?",
    homepageStory: "Know why profitability changes.",
    launchAvailability:
      "Available by controlled launch phase. Public subscription signup is not currently available.",
    monthlyPrice: 69.99,
    annualPrice: 699,
    enrollmentDiscountMonthlyPrice: 49.99,
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
    intendedUser:
      "Small operations that need scale, capital, reserve, and per-truck planning context.",
    operationalMaturity: "Advanced operating intelligence",
    coreQuestion: "Can this operation scale safely and profitably?",
    homepageStory: "Know when your operation is ready to grow.",
    launchAvailability:
      "Available by controlled launch phase. Public subscription signup is not currently available.",
    monthlyPrice: 149.99,
    annualPrice: 1499,
    enrollmentDiscountMonthlyPrice: 99.99,
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

export const LOADIQ_TIERED_ENROLLMENT_PHASES = [
  {
    id: "pilot_access",
    name: "Pilot Access",
    shortName: "Pilot 100",
    cap: 100,
    capacityLabel: "Slots 1-100",
    purpose:
      "Controlled testing and feedback access for the first 100 approved users.",
    discountLabel: "Enrollment discount monthly pricing",
    lifetimePricing: true,
    selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
  },
  {
    id: "launch_phase_1",
    name: "Launch Phase 1",
    shortName: "Launch 250",
    cap: 250,
    capacityLabel: "Slots 101-350",
    purpose:
      "Controlled launch expansion for the next 250 approved users after pilot access.",
    discountLabel: "Enrollment discount monthly pricing",
    lifetimePricing: true,
    selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
  },
  {
    id: "launch_phase_2",
    name: "Launch Phase 2",
    shortName: "Launch 250",
    cap: 250,
    capacityLabel: "Slots 351-600",
    purpose:
      "Final controlled launch expansion for the next 250 approved users before open market.",
    discountLabel: "Enrollment discount monthly pricing",
    lifetimePricing: true,
    selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
  },
  {
    id: "open_market",
    name: "Open Market",
    shortName: "Public",
    cap: null,
    capacityLabel: "No published slot cap",
    purpose:
      "Public commercial access after launch readiness, billing, and support gates are complete.",
    discountLabel: "No enrollment discount",
    lifetimePricing: false,
    selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
  },
] as const satisfies readonly TieredEnrollmentPhase[];

export const DISCOUNTED_ENROLLMENT_PHASES =
  LOADIQ_TIERED_ENROLLMENT_PHASES.filter((phase) => phase.lifetimePricing);

export const FOUNDER_ACCESS = {
  name: "Pilot Access",
  maxSeats: 100,
  publicTeaser:
    "The first 100 approved users may qualify for discounted enrollment across Silver, Gold, Platinum, and Pro.",
  hiddenPricingEnabled: false,
  inviteCodeRequired: false,
  selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
} as const;

export const PILOT_ACCESS = {
  name: "Pilot Access",
  publicTeaser:
    "Pilot enrollment may be available for the first 100 approved early-access users across all available commercial tiers.",
  maxSeats: 100,
  durationDays: 30,
  selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
  lifetimeLockRule:
    "Enrollment discount pricing remains locked only after server-authoritative approval, active subscription status, and purchased entitlement scope are confirmed. It is lost if canceled, deleted, transferred, or revoked under applicable terms.",
} as const;

export const LAUNCH_PHASE_1_ACCESS = {
  name: "Launch Phase 1 Access",
  maxSeats: 250,
  selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
} as const;

export const LAUNCH_PHASE_2_ACCESS = {
  name: "Launch Phase 2 Access",
  maxSeats: 250,
  selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
} as const;

export const STANDARD_ACCESS = {
  name: "Open Market Access",
  selectablePlans: AVAILABLE_ENROLLMENT_TIER_IDS,
} as const;

export const PLATINUM_ACCESS = {
  name: "Platinum",
  status: "Display Only",
  monthlyPrice: 69.99,
  annualPrice: 699,
  priceLabel: "$69.99/mo or $699/year",
  annualPositioning: "Variance Intelligence for profitability pattern context.",
} as const;

export const PUBLIC_PRICING_PLANS = LOADIQ_COMMERCIAL_TIER_LIST;

export const INTERNAL_FOUNDER_PLANS = LOADIQ_COMMERCIAL_TIER_LIST.map((tier) => ({
  tier: tier.id,
  name: `Pilot Enrollment ${tier.name}`,
  price: tier.enrollmentDiscountMonthlyPrice,
  interval: "month" as BillingInterval,
}));

export function formatPriceLabel(price: number, interval: BillingInterval) {
  if (price === 0) return "$0";
  return `$${price.toFixed(2)}/${interval === "month" ? "mo" : "yr"}`;
}

export function formatCommercialPriceLabel(price: number, interval: BillingInterval) {
  const displayPrice = Number.isInteger(price) ? String(price) : price.toFixed(2);
  return `$${displayPrice}/${interval === "month" ? "mo" : "yr"}`;
}
