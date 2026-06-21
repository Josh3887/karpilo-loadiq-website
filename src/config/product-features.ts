// Portable website marketing config. Safe to copy into the separate Karpilo LoadIQ website repo.

export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductFeatureGroup = {
  eyebrow: string;
  title: string;
  description: string;
  features: readonly ProductFeature[];
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductWebsiteSection = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PRODUCT_HERO = {
  eyebrow: "Karpilo LoadIQ",
  title: "Know the load before the load owns you.",
  description:
    "Karpilo LoadIQ helps trucking operators evaluate fuel exposure, deadhead, RPM, CPM, gross-to-net reality, and profitability signals before making business decisions.",
} satisfies ProductWebsiteSection;

export const PRODUCT_FEATURES = [
  {
    title: "Freight profitability analysis",
    description:
      "Estimate gross revenue, operating cost, net profit, break-even RPM, and margin pressure before making independent freight decisions.",
  },
  {
    title: "True RPM and deadhead exposure",
    description:
      "Model loaded miles and deadhead together so unpaid repositioning miles are visible before independent route and load decisions.",
  },
  {
    title: "EIA diesel estimate auto-fill",
    description:
      "Use a server-side EIA ULSD market reference when configured and available, with manual override always available.",
  },
  {
    title: "Settings-driven profitability targets",
    description:
      "Let driver profile, income goals, overhead, MPG, reserves, and pay templates drive the calculator defaults.",
  },
  {
    title: "Saved load history",
    description:
      "Save estimates, duplicate prior loads, create lane templates, and revisit operating decisions on supported plans.",
  },
  {
    title: "Post-trip actual comparison",
    description:
      "Enter actual fuel and trip expenses after completion to compare estimated vs actual profitability.",
  },
  {
    title: "Simple pay templates",
    description:
      "Support percentage pay, nested percentage splits, CPM, and flat-rate workflows without cluttering the calculator.",
  },
  {
    title: "Mobile-first estimation workspace",
    description:
      "A dark operational interface designed for fast checks from the cab, desk, or dispatch call.",
  },
] satisfies ProductFeature[];

export const PRODUCT_FEATURE_GROUPS = [
  {
    eyebrow: "Built / Active",
    title: "Operational estimates operators can inspect now.",
    description:
      "These surfaces are represented in the current website or app code and are safe to present as active LoadIQ capabilities.",
    features: [
      {
        title: "Profitability calculator",
        description:
          "Estimate gross revenue, fuel exposure, operating costs, projected net, break-even RPM, and margin pressure from user-entered freight details.",
      },
      {
        title: "True RPM and deadhead inputs",
        description:
          "Combine loaded miles and unpaid deadhead so the real revenue-per-mile pressure is visible before an independent freight decision.",
      },
      {
        title: "Fuel exposure controls",
        description:
          "Use manual fuel inputs and supported diesel reference data as estimation context, not guaranteed pump-price authority.",
      },
      {
        title: "Public demo workflow",
        description:
          "Move freight numbers on the website demo to see how projected net, fuel cost, and true RPM react.",
      },
    ],
  },
  {
    eyebrow: "Launch / In Progress",
    title: "Controlled launch systems being prepared.",
    description:
      "These items are launch-readiness workstreams and should not be described as open public purchasing or unrestricted account access.",
    features: [
      {
        title: "Request-access intake",
        description:
          "Operators can request access or join the launch list while approval and phase availability remain controlled.",
      },
      {
        title: "Tier and phase alignment",
        description:
          "Silver, Gold, Platinum, and Pro stay separate from rollout phase eligibility and server-side entitlement records.",
      },
      {
        title: "Subscription readiness",
        description:
          "Billing language, support paths, and provider handoff are being organized before public subscription signup opens.",
      },
      {
        title: "Portal handoff",
        description:
          "The public website routes operators toward the app portal while making clear that launch access may be restricted.",
      },
    ],
  },
  {
    eyebrow: "Planned / Roadmap",
    title: "Future tooling that must stay clearly future-facing.",
    description:
      "These concepts are not presented as live public website features. They describe planned direction where product authority is still being designed.",
    features: [
      {
        title: "Address and mileage intelligence",
        description:
          "Future address verification, zip-to-zip mileage estimation, and location variance tools may improve distance context.",
      },
      {
        title: "AI explanation layer",
        description:
          "Future K-ATLS explanation modules may help interpret estimates while leaving final decisions with the operator.",
      },
      {
        title: "Seasonality and lane memory",
        description:
          "Future intelligence may help operators understand recurring freight patterns, seasonal pressure, and estimate drift.",
      },
      {
        title: "Fleet-scale planning",
        description:
          "Future tools may support larger operating models without turning the website into FleetOS or a dispatch system.",
      },
    ],
  },
] satisfies readonly ProductFeatureGroup[];

export const FEATURE_WORKFLOW_GROUPS = [
  {
    eyebrow: "Load Inputs",
    title: "Start with the numbers that change the load.",
    description:
      "LoadIQ depends on user-supplied freight and operating assumptions. The public website explains the workflow; the app portal holds the operating experience.",
    features: [
      {
        title: "Loaded miles and deadhead",
        description:
          "Model paid and unpaid miles together so true RPM pressure is visible before the load decision.",
      },
      {
        title: "Gross pay and fuel price",
        description:
          "Enter freight pay and fuel assumptions, with manual control over the fuel number used in the estimate.",
      },
      {
        title: "MPG and cost assumptions",
        description:
          "Use realistic fuel economy, fixed costs, variable costs, tolls, accessorials, factoring, dispatch fees, or pay-structure assumptions where supported.",
      },
    ],
  },
  {
    eyebrow: "Profitability Outputs",
    title: "Convert gross numbers into operating pressure.",
    description:
      "Outputs are estimates, not guarantees. They help expose pressure that gross revenue or posted RPM can hide.",
    features: [
      {
        title: "Gross, net, and true RPM",
        description:
          "Compare rate visibility before and after deadhead, fuel, and modeled cost exposure.",
      },
      {
        title: "Fuel pressure and cost exposure",
        description:
          "See how diesel price, distance, MPG, and operating assumptions affect projected margin.",
      },
      {
        title: "Margin and break-even context",
        description:
          "Use break-even awareness to understand whether the load supports the operator's operating goals.",
      },
    ],
  },
  {
    eyebrow: "Decision Support",
    title: "Support the decision without making it for the operator.",
    description:
      "Karpilo LoadIQ provides calculation-based freight profitability intelligence and operational decision support.",
    features: [
      {
        title: "Compare load assumptions",
        description:
          "Pressure-test rate, distance, fuel, and cost assumptions before accepting freight.",
      },
      {
        title: "Avoid gross-rate traps",
        description:
          "Understand when a strong gross rate is weakened by deadhead, fuel, overhead, or time exposure.",
      },
      {
        title: "Preserve operator judgment",
        description:
          "LoadIQ is not a broker, dispatcher, ELD, tax advisor, legal advisor, compliance advisor, accounting platform, insurance advisor, or guaranteed-profit system.",
      },
    ],
  },
  {
    eyebrow: "Account / Launch Access",
    title: "Request access, then use the app portal if issued.",
    description:
      "Public signup is not currently available. Access is limited by launch phase availability, approval, and provider readiness.",
    features: [
      {
        title: "Controlled rollout",
        description:
          "Pilot Access covers slots 1-100, Launch Phase 1 covers 101-350, Launch Phase 2 covers 351-600, and Open Market follows only when enabled.",
      },
      {
        title: "Portal handoff",
        description:
          "Issued users access the operational app experience through app.karpilo-liq.com, not duplicated public website routes.",
      },
      {
        title: "Billing separation",
        description:
          "Website billing applies to Stripe/web subscribers once subscription access is issued. Apple and Google billing stay with their app stores.",
      },
    ],
  },
  {
    eyebrow: "Planned Intelligence",
    title: "Future intelligence stays marked as future.",
    description:
      "These roadmap items are not public checkout promises and should not be treated as live functionality.",
    features: [
      {
        title: "Maps and mileage refinement",
        description:
          "Planned work may include Google Maps address verification, zip-to-zip mileage estimation, and location variance checks.",
      },
      {
        title: "K-ATLS explanation modules",
        description:
          "Future explanation support may help operators understand estimate pressure without replacing independent judgment.",
      },
      {
        title: "Seasonality and scale context",
        description:
          "Future tooling may support seasonality memory and fleet-scale planning while remaining separate from FleetOS or dispatch automation.",
      },
    ],
  },
] satisfies readonly ProductFeatureGroup[];

export const PRODUCT_FAQS = [
  {
    question: "Does Karpilo LoadIQ guarantee profitability?",
    answer:
      "No. Karpilo LoadIQ is an informational forecasting tool. It depends on user inputs, assumptions, market conditions, fuel prices, route variance, and real operating costs.",
  },
  {
    question: "Can I override the EIA fuel estimate?",
    answer:
      "Yes. EIA diesel data, when configured, is treated as a market reference only. Drivers can enter their own expected or actual purchased fuel price.",
  },
  {
    question: "Who is Karpilo LoadIQ built for?",
    answer:
      "Owner operators, lease operators, independent contractors, and small trucking operations that need fast freight profitability checks.",
  },
] satisfies ProductFaq[];

export const PRODUCT_DISCLAIMER_SNIPPET =
  "Karpilo LoadIQ outputs are estimates based on user inputs, assumptions, and available data. They do not guarantee profit, freight availability, fuel pricing, or business outcomes.";
