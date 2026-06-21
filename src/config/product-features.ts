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
  title: "Freight profitability estimates built by the mile.",
  description:
    "A mobile-first estimation workspace for owner operators and independent contractors who want operational awareness before making independent freight decisions.",
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
          "Atlas-style explanation support may help interpret estimates while leaving final decisions with the operator.",
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
