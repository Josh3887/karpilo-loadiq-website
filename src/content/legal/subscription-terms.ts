import {
  PLATFORM_BILLING_DISCLOSURES,
  STRIPE_BILLING_DISCLOSURES,
  type LegalSection,
} from "@/content/legal/billing-disclosures";

export const SUBSCRIPTION_TERMS_LAST_UPDATED = "May 17, 2026";

export const SUBSCRIPTION_TERMS_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Subscription Terms Overview",
    paragraphs: [
      "These Subscription Terms describe recurring billing, plan access, cancellation, promotional pricing, payment failure, and platform-specific purchase handling for Karpilo LoadIQ.",
      "Different billing platforms may control different parts of the purchase relationship. Apple, Google, Stripe, card networks, and other providers may apply their own rules, receipts, refund paths, tax handling, payment retries, and cancellation tools.",
    ],
  },
  ...STRIPE_BILLING_DISCLOSURES,
  ...PLATFORM_BILLING_DISCLOSURES,
  {
    id: "plan-access",
    title: "Plan Access and Feature Gates",
    paragraphs: [
      "Karpilo LoadIQ commercial tiers are Silver, Gold, Platinum, and Pro. They describe decision-support depth and published pricing. Pilot enrollment and second enrollment are protected rollout or promotional eligibility phases within the purchased entitlement scope. Checkout availability, billing provider configuration, and entitlement enforcement may roll out separately.",
      "Pilot enrollment covers the first 100 approved users. Second enrollment covers the next 500 approved users. Both enrollment phases may support monthly enrollment discount pricing across the available commercial tiers when confirmed by server-side reservation, entitlement, and billing-provider records.",
      "The displayed Pro additional-truck surcharge is $10.00/month per additional truck and remains commercial pricing communication only until supported by an approved billing provider configuration.",
      "Subscription access is tied to the account and billing platform used at purchase. Promotional access may not be transferable between accounts, platforms, businesses, or app stores.",
      "Feature availability may evolve for future billing periods, future subscribers, future product modules, enterprise licensing, or separately licensed offerings where permitted by law and platform rules.",
    ],
  },
  {
    id: "pilot-launch-scope",
    title: "Enrollment Entitlement Scope",
    paragraphs: [
      "Pilot enrollment or second enrollment lifetime or grandfathered access applies to the qualifying account, selected commercial tier, purchased entitlement scope, applicable subscription class, and current Karpilo LoadIQ product family features made generally available for that entitlement class.",
      "Pilot enrollment and second enrollment access do not grant ownership of Karpilo LoadIQ, unlimited future platform access, automatic access to all future enterprise products, Karpilo FleetOS systems, fleet-management modules, Pro/FleetOS capabilities, API products, team accounts, or separately licensed future offerings.",
      "Karpilo Endeavor Technologies LLC reserves the right to create future pricing, future enterprise licensing, future feature segmentation, future operational modules, and separately licensed products without converting every legacy entitlement into those future offerings.",
    ],
  },
  {
    id: "failed-payments",
    title: "Failed Payments and Suspension",
    paragraphs: [
      "If a recurring payment fails, the payment provider may retry collection and send notices. Karpilo LoadIQ may temporarily restrict paid features, downgrade access, suspend service, or cancel the subscription after unresolved payment failure.",
      "Users are responsible for keeping payment methods, account email, and platform billing details current.",
    ],
  },
  {
    id: "account-cancellation",
    title: "Account Cancellation Guidance",
    paragraphs: [
      "Canceling a subscription stops future billing through the applicable billing platform. It does not necessarily delete the account, saved load records, support history, or profile data. Account deletion and subscription cancellation may be separate actions.",
      "Users should preserve any business records they need before deleting an account. Data retention and deletion are handled according to the Privacy Policy, Terms of Service, and operational requirements.",
    ],
  },
  {
    id: "future-products",
    title: "Future Products and Enterprise Plans",
    paragraphs: [
      "These terms are designed to support future Karpilo products, Karpilo FleetOS subscriptions, team accounts, enterprise licensing, API subscriptions, usage-based plans, annual contracts, and B2B agreements. Enterprise, Pro, FleetOS, API, team, or separately signed agreements may include different billing, refund, cancellation, data, access, and service terms.",
    ],
  },
];
