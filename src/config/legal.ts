import { LOADIQ_CONTACT, LOADIQ_BRAND } from "@/config/loadiq";

export const COMPANY_NAME = LOADIQ_BRAND.companyName;
export const SUPPORT_EMAIL = LOADIQ_CONTACT.supportEmail;
export const HELP_EMAIL = LOADIQ_CONTACT.helpEmail;
export const BILLING_EMAIL = LOADIQ_CONTACT.billingEmail;
export const UPDATES_EMAIL = LOADIQ_CONTACT.updatesEmail;
export const NEWSLETTER_EMAIL = LOADIQ_CONTACT.newsletterEmail;
export const NOREPLY_EMAIL = LOADIQ_CONTACT.noreplyEmail;
export const FEEDBACK_EMAIL = LOADIQ_CONTACT.feedbackEmail;
export const LEGAL_LAST_UPDATED = "May 17, 2026";
export const COLORADO_BASELINE =
  "Karpilo Endeavor Technologies LLC is organized for U.S.-based SaaS operations, with a Colorado/U.S.-focused legal baseline for launch-stage policy architecture.";

export type LegalLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type LegalSection = {
  id: string;
  title: string;
  eyebrow?: string;
  paragraphs: string[];
  bullets?: string[];
  links?: LegalLink[];
};

export type LegalPage = {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  sections: LegalSection[];
};

const supportLink = `mailto:${SUPPORT_EMAIL}`;
const helpLink = `mailto:${HELP_EMAIL}`;
const billingLink = `mailto:${BILLING_EMAIL}`;
const updatesLink = `mailto:${UPDATES_EMAIL}`;
const newsletterLink = `mailto:${NEWSLETTER_EMAIL}`;
const feedbackLink = `mailto:${FEEDBACK_EMAIL}`;

export const legalNavigation = [
  { label: "Legal Center", href: "/legal" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Refunds", href: "/legal/refund-policy" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Subscriptions", href: "/legal/subscription-terms" },
  { label: "Data Usage", href: "/legal/data-usage" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
  { label: "Safety Disclosure", href: "/legal/safety-disclosure" },
  { label: "Billing Policy", href: "/legal/billing-policy" },
  { label: "Pricing Lock", href: "/legal/pricing-lock-policy" },
  { label: "IP Notice", href: "/legal/trademark-ip" },
  { label: "Pilot Terms", href: "/legal/pilot-program" },
  { label: "Support", href: "/legal/support" },
  { label: "Feature Requests", href: "/legal/feature-request" },
];

export const legalPages: Record<string, LegalPage> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    navLabel: "Privacy",
    description:
      "How Karpilo Endeavor Technologies LLC handles account, operational, product, billing, support, analytics, and third-party service data.",
    sections: [
      {
        id: "overview",
        title: "Privacy Operating Standard",
        paragraphs: [
          `${COMPANY_NAME} builds transportation profitability estimation software, analytics platforms, educational operational awareness tools, and subscription SaaS products including Karpilo LoadIQ, Karpilo FleetOS, and future product lines.`,
          "This Privacy Policy explains how we collect, use, retain, protect, and disclose information when users visit our websites, join a waitlist, contact support, use our software, interact with billing flows, or connect with future app ecosystem features.",
          COLORADO_BASELINE,
        ],
      },
      {
        id: "data-collected",
        title: "Information We Collect",
        paragraphs: [
          "We may collect account details, contact details, company or fleet information, waitlist submissions, support messages, product feedback, subscription status, plan selection, and billing metadata.",
          "For Karpilo LoadIQ and future operational products, we may process user-entered operational records such as pickup and delivery information, mileage, fuel assumptions, pay structure templates, overhead settings, post-trip actuals, facility notes, ratings, saved calculations, and profitability assumptions.",
        ],
      },
      {
        id: "data-usage-retention",
        title: "Data Usage & Retention",
        paragraphs: [
          "We use information to operate products, provide estimates, maintain account access, enforce plan limits, respond to support requests, process subscription status, improve reliability, protect against abuse, and communicate important product or policy updates.",
          "Operational records may be retained while an account is active and for a reasonable period afterward where needed for security, audit, support, legal, tax, billing, fraud prevention, backup integrity, or legitimate business purposes.",
          "Users may request access, correction, deletion, or account closure by contacting support. Some records may be retained where required or permitted by law, payment rules, fraud prevention, dispute handling, accounting, or security obligations.",
        ],
        links: [{ label: "Request account help", href: supportLink }],
      },
      {
        id: "payments",
        title: "Stripe and Payment Processor Disclosure",
        paragraphs: [
          "Paid subscriptions or future checkout flows may be processed by Stripe or other authorized payment providers. Card information is entered into the payment processor experience and is not directly stored by Karpilo Endeavor Technologies LLC on our own website servers.",
          "Payment processors may collect card details, billing information, fraud signals, device data, transaction metadata, and tax or compliance information according to their own policies. We may receive limited billing metadata such as customer identifiers, subscription status, invoices, plan information, renewal dates, failed payment notices, and cancellation status.",
        ],
        links: [
          {
            label: "Stripe Privacy Policy",
            href: "https://stripe.com/privacy",
            external: true,
          },
        ],
      },
      {
        id: "third-parties",
        title: "Third-Party Services",
        paragraphs: [
          "We may use service providers for hosting, analytics, email delivery, database infrastructure, authentication, customer support, payment processing, fraud prevention, logging, product monitoring, and future mobile app distribution.",
          "External operational datasets may support fuel references, routing, weather, mapping, tolling, safety context, compliance context, telematics, or market analytics. These sources are informational and may be delayed, unavailable, revised, or inaccurate.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies, Sessions, Analytics, and Fraud Prevention",
        paragraphs: [
          "We may use cookies, local storage, session storage, and similar technologies to keep sessions working, remember consent choices, support security, prevent abuse, measure site performance, understand product interest, and protect checkout or account flows.",
          "Some cookies or storage may be necessary for authentication, fraud prevention, load balancing, payment security, or basic site functionality. Analytics cookies or similar tools may be optional where applicable settings are provided.",
        ],
      },
      {
        id: "security",
        title: "Security Statement",
        paragraphs: [
          "We design our products around user-owned records, authenticated access, least-privilege patterns, row-level data isolation where applicable, and production infrastructure controls appropriate for a launch-stage SaaS platform.",
          "No online system can be guaranteed completely secure. Users should protect account credentials and avoid sending sensitive regulated information through general contact forms unless requested through an appropriate support channel.",
        ],
      },
      {
        id: "contact",
        title: "Privacy and Account Requests",
        paragraphs: [
          "For privacy questions, account deletion requests, data access requests, billing privacy questions, or security concerns, contact our support channel. We may need to verify identity or account ownership before acting on a request.",
        ],
        links: [{ label: SUPPORT_EMAIL, href: supportLink }],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    navLabel: "Terms",
    description:
      "Platform use terms for Karpilo LoadIQ as a transportation profitability calculator, operational estimation platform, analytics and insight tool, and educational operational awareness platform.",
    sections: [
      {
        id: "use",
        title: "Use of Karpilo Products",
        paragraphs: [
          "Karpilo LoadIQ is a transportation profitability calculator, operational estimation platform, analytics and insight tool, and educational operational awareness platform. It provides estimates, workflows, dashboards, product content, analytics, and user-assisted calculation interfaces for transportation and business operations.",
          "The platform is intended for informational, educational, analytical, and estimation purposes only and does not replace independent business judgment, professional accounting, legal advice, regulatory guidance, safety review, or operational decision-making.",
          "Users are responsible for ensuring their use of the products complies with applicable laws, contracts, carrier policies, brokerage requirements, safety rules, employment or contractor obligations, and business requirements.",
        ],
      },
      {
        id: "classification",
        title: "No Transportation Authority or Control",
        paragraphs: [
          "Karpilo LoadIQ is not dispatch software, freight brokerage software, routing authority software, compliance management software, fleet command software, motor carrier supervision software, or a regulated transportation authority system.",
          "Karpilo LoadIQ does not dispatch freight, direct drivers, supervise carriers, control equipment, certify route legality, enforce compliance, approve brokerage terms, or assume responsibility for transportation operations.",
        ],
      },
      {
        id: "no-guarantees",
        title: "No Operational or Profit Guarantees",
        paragraphs: [
          "Karpilo LoadIQ and related tools may estimate profitability, costs, fuel exposure, RPM, margin, deadhead, overhead, or operational risk. These outputs are informational estimates based on assumptions, available data, and user inputs.",
          "Users acknowledge that all calculations are dependent on user-supplied inputs, assumptions, market conditions, and operational variables that may materially alter real-world outcomes.",
          "Actual operational conditions including rates, weather, fuel pricing, traffic, detention, maintenance events, compliance events, driver behavior, market volatility, and third-party conditions materially affect real-world outcomes.",
          "We do not guarantee profit, freight availability, revenue, route accuracy, fuel pricing, dispatch results, compliance outcomes, customer behavior, broker conduct, app store approval, marketplace availability, or business performance.",
        ],
      },
      {
        id: "acceptable-use",
        title: "Acceptable Use Protections",
        paragraphs: [
          "Users may not misuse, disrupt, scrape, reverse engineer, overload, resell, clone, bypass access controls, interfere with security, upload malicious code, use the service for unlawful conduct, or attempt to extract proprietary systems or non-public product logic.",
          "We may restrict or suspend access for suspected abuse, fraud, payment misuse, security risk, intellectual property misuse, illegal activity, or conduct that threatens the service or other users.",
        ],
      },
      {
        id: "ip",
        title: "Copyright, Intellectual Property, and Product Concepts",
        paragraphs: [
          "The website, product names, interface systems, workflows, copy, visual systems, operational concepts, product architecture, software, graphics, animations, layouts, and related materials are owned by or licensed to Karpilo Endeavor Technologies LLC unless otherwise stated.",
          "No portion of the website or products may be copied, reproduced, commercially exploited, reverse engineered, redistributed, sublicensed, scraped, cloned, or used to create confusingly similar products without prior written permission.",
        ],
      },
      {
        id: "trademarks",
        title: "Trademark Notice",
        paragraphs: [
          "Karpilo Endeavor Technologies, Karpilo LoadIQ, Karpilo FleetOS, and related names, marks, logos, product concepts, and visual identifiers may be trademarks, service marks, trade dress, or proprietary brand assets of Karpilo Endeavor Technologies LLC.",
          "Third-party names such as Stripe, Apple, Google, EIA, and other provider names belong to their respective owners. References are for identification, interoperability, attribution, billing, data-source, or policy disclosure purposes only and do not imply endorsement.",
        ],
      },
      {
        id: "liability",
        title: "Limitation of Liability",
        paragraphs: [
          "To the fullest extent permitted by law, Karpilo Endeavor Technologies LLC is not liable for indirect, incidental, consequential, special, exemplary, punitive, operational, business, lost-profit, lost-revenue, downtime, dispatch, freight, compliance, payment, marketplace, or data-source damages.",
          "Users remain responsible for reviewing outputs, verifying data, maintaining business records, and making independent operational, safety, route, compliance, tax, accounting, and business decisions.",
        ],
      },
      {
        id: "force-majeure",
        title: "Force Majeure",
        paragraphs: [
          "Karpilo Endeavor Technologies LLC is not responsible for delay, interruption, or failure caused by events outside reasonable control, including internet outages, hosting failures, payment processor outages, app-store disruptions, cyber incidents, labor disruptions, natural disasters, severe weather, government action, transportation market disruption, third-party API failure, or other force majeure events.",
        ],
      },
      {
        id: "dispute-resolution",
        title: "Dispute Resolution, Arbitration, and Class Action Waiver",
        paragraphs: [
          "To the fullest extent permitted by applicable law, disputes or claims arising from or relating to Karpilo LoadIQ, these terms, subscriptions, billing, access, or user accounts will be resolved by individual binding arbitration under the Federal Arbitration Act and applicable Colorado law, unless an exception below applies.",
          "Either party may bring an individual claim in small claims court where available. Either party may seek injunctive or equitable relief in a court of competent jurisdiction for unauthorized access, misuse, intellectual property infringement, or trade secret misuse.",
          "Users and Karpilo Endeavor Technologies LLC waive the right to participate in class actions, class arbitrations, collective actions, representative actions, or consolidated proceedings to the fullest extent permitted by law.",
          "Users and Karpilo Endeavor Technologies LLC waive the right to a jury trial for disputes covered by these terms to the fullest extent permitted by law.",
        ],
      },
      {
        id: "governing-law",
        title: "Governing Law, Venue, and Electronic Consent",
        paragraphs: [
          "These terms are governed by Colorado law, without regard to conflict-of-law rules, and by applicable federal law including the Federal Arbitration Act where applicable.",
          "For claims that are not subject to arbitration, the parties consent to the state or federal courts located in Colorado, unless a different venue is required by applicable law.",
          "By using the website, creating an account, clicking acceptance controls, continuing to use Karpilo products, or purchasing a subscription, users consent to electronic records, electronic signatures, electronic policy acknowledgements, and electronic delivery of notices where permitted by law.",
        ],
      },
      {
        id: "changes",
        title: "Changes to Products or Terms",
        paragraphs: [
          "We may update products, pricing, policies, subscriptions, features, waitlists, launch programs, data sources, app ecosystem integrations, or these terms as the company and product suite evolve.",
          "Continued use after updates means the user accepts the updated terms where permitted by law.",
        ],
      },
      {
        id: "contact",
        title: "Legal Contact",
        paragraphs: [
          "Questions about these terms, acceptable use, intellectual property, compliance, or account access may be sent to support.",
        ],
        links: [{ label: SUPPORT_EMAIL, href: supportLink }],
      },
    ],
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    navLabel: "Refunds",
    description:
      "Refund handling for digital subscriptions, pilot programs, promotional access, Stripe billing, Apple App Store, and Google Play.",
    sections: [
      {
        id: "overview",
        title: "Digital Subscription Refund Standard",
        paragraphs: [
          "Karpilo products are digital software services. Once access is delivered, refunds are generally limited and reviewed case by case unless a payment platform, applicable law, or written checkout term requires otherwise.",
          "Refund review may consider payment status, account activity, technical access history, usage, support records, duplicate billing, fraud indicators, and whether the purchase was controlled by a third-party marketplace.",
        ],
      },
      {
        id: "eligible",
        title: "Refunds That May Be Reviewed",
        paragraphs: [
          "We may review refund requests for duplicate billing, verified processing errors, accidental purchases reported promptly with limited usage, or technical access issues that materially prevent use and cannot be reasonably resolved.",
        ],
        bullets: [
          "Refund approval is not automatic.",
          "Support may request receipt, account email, billing platform, purchase date, and issue details.",
          "Card network, Stripe, Apple, Google, or other payment-provider rules may control the final outcome.",
        ],
      },
      {
        id: "not-available",
        title: "Refunds Generally Not Available",
        paragraphs: [
          "Refunds are generally not available for partial billing-period use, failure to cancel before renewal, dissatisfaction after meaningful use, promotional pricing after access delivery, trial cycling, abuse, policy violations, or chargeback misuse.",
          "Founder, pilot, promotional, or discounted access may have special eligibility rules and may be forfeited if canceled, disputed, transferred, or allowed to lapse.",
        ],
      },
      {
        id: "platforms",
        title: "Apple, Google, and Stripe Handling",
        paragraphs: [
          "Purchases made through Apple App Store or Google Play may need to be managed directly through those platforms. Apple or Google may be the merchant of record and may control cancellation, refund review, billing history, receipts, and payment disputes.",
          "Direct website subscriptions may be processed by Stripe or another authorized provider. Stripe or the applicable processor may enforce payment, fraud, dispute, card network, and identity verification rules.",
        ],
        links: [
          {
            label: "Stripe Privacy Policy",
            href: "https://stripe.com/privacy",
            external: true,
          },
        ],
      },
      {
        id: "request",
        title: "How to Request Refund Review",
        paragraphs: [
          "Contact support with the account email, receipt or invoice details, billing platform, charge date, and a clear explanation. For Apple or Google purchases, users may also need to use those platform refund systems.",
        ],
        links: [{ label: BILLING_EMAIL, href: billingLink }],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    navLabel: "Cookies",
    description:
      "How the website and future app ecosystem may use cookies, local storage, session storage, analytics, and fraud-prevention tools.",
    sections: [
      {
        id: "what",
        title: "What We Use",
        paragraphs: [
          "We may use cookies, local storage, session storage, device identifiers, and similar technologies. These tools help the website and future apps remember preferences, maintain sessions, protect accounts, support checkout, measure performance, and understand product interest.",
        ],
      },
      {
        id: "essential",
        title: "Essential, Security, and Fraud Cookies",
        paragraphs: [
          "Some storage is necessary for security, fraud prevention, session continuity, load balancing, consent preferences, abuse prevention, and payment-flow protection. These tools may be required for the service to function properly.",
          "Payment processors such as Stripe may use their own cookies or fraud-prevention signals during checkout or subscription management. Those tools are governed by the payment provider's policies.",
        ],
      },
      {
        id: "analytics",
        title: "Analytics and Product Improvement",
        paragraphs: [
          "We may use privacy-conscious analytics or performance tools to understand traffic, conversion paths, feature interest, errors, and device/browser behavior. Analytics are used to improve reliability, content, launch readiness, and product experience.",
          "Where required, analytics or non-essential cookies may be controlled through a consent banner or browser settings.",
        ],
      },
      {
        id: "choices",
        title: "Your Choices",
        paragraphs: [
          "Users can control many cookies through browser settings. Blocking some cookies or storage may affect authentication, checkout, account access, saved preferences, fraud prevention, or support workflows.",
          "The website cookie banner stores the user's consent choice locally in the browser.",
        ],
      },
    ],
  },
  "subscription-terms": {
    slug: "subscription-terms",
    title: "Subscription Terms",
    navLabel: "Subscriptions",
    description:
      "Auto-renewal, cancellation, plan access, billing disclosures, failed payments, and app-store subscription handling.",
    sections: [
      {
        id: "auto-renew",
        title: "Auto-Renewal Disclosure",
        paragraphs: [
          "Paid subscriptions may renew automatically at the selected billing interval unless canceled before the renewal date through the applicable billing platform. Billing intervals may include monthly, annual, trial, pilot, founder, promotional, or future plan structures.",
          "Checkout or platform screens should disclose the plan, price, interval, renewal behavior, trial conversion date if applicable, and cancellation method before purchase.",
        ],
      },
      {
        id: "cancellation",
        title: "Cancellation Policy",
        paragraphs: [
          "Canceling a subscription stops future renewals through the applicable billing platform. It does not automatically refund the current billing period unless required by law, platform policy, or written checkout terms.",
          "Access to paid features may continue through the paid period after cancellation unless the account is terminated for fraud, abuse, chargeback misuse, policy violation, or security risk.",
        ],
      },
      {
        id: "billing",
        title: "Stripe, Apple, and Google Billing",
        paragraphs: [
          "Direct website billing may be processed by Stripe or another authorized payment provider. Karpilo Endeavor Technologies LLC does not directly store full card numbers on its own website servers.",
          "Apple App Store and Google Play purchases may be governed by those platforms' subscription, cancellation, tax, receipt, refund, and dispute systems.",
        ],
        links: [
          {
            label: "Stripe Privacy Policy",
            href: "https://stripe.com/privacy",
            external: true,
          },
        ],
      },
      {
        id: "failed-payments",
        title: "Failed Payments and Access",
        paragraphs: [
          "If a recurring payment fails, the billing provider may retry the charge, send notices, request a new payment method, or report status updates to us. We may restrict, suspend, downgrade, or cancel paid access after unresolved payment failure.",
        ],
      },
      {
        id: "future-products",
        title: "Future Products and Plan Evolution",
        paragraphs: [
          "Subscription terms are designed to support Karpilo LoadIQ, Karpilo FleetOS, future SaaS products, team accounts, mobile apps, enterprise plans, API access, annual agreements, and product bundles.",
          "Features, plan names, usage limits, availability, prices, discounts, pilot programs, founder access, future enterprise licensing, future operational modules, and future feature segmentation may change for future billing periods where permitted.",
          "Pilot and Launch lifetime or grandfathered access is limited to the qualifying account, purchased entitlement scope, applicable subscription class, and current Karpilo LoadIQ product family. It does not automatically include all future enterprise products, Karpilo FleetOS systems, Pro/FleetOS capabilities, API products, team accounts, or separately licensed future offerings.",
        ],
      },
      {
        id: "support",
        title: "Billing Support",
        paragraphs: [
          "For direct billing questions, cancellation questions, duplicate billing, access issues, or subscription support, contact us with your account email and receipt or invoice details.",
        ],
        links: [{ label: BILLING_EMAIL, href: billingLink }],
      },
    ],
  },
  "data-usage": {
    slug: "data-usage",
    title: "Data Usage Policy",
    navLabel: "Data Usage",
    description:
      "How operational records, demo inputs, support details, analytics, and billing metadata may be used and retained.",
    sections: [
      {
        id: "usage",
        title: "Operational Data Use",
        paragraphs: [
          "Karpilo products may use user-provided operational data to calculate estimates, preserve saved records, improve product reliability, support users, enforce access limits, and maintain account continuity.",
          "Operational data may include load inputs, fuel assumptions, mileage, deadhead, overhead, deductions, profile settings, saved results, post-trip actuals, and support context.",
        ],
      },
      {
        id: "retention",
        title: "Retention and Deletion",
        paragraphs: [
          "Records may be retained while an account remains active and for a reasonable period after cancellation or inactivity for security, audit, support, legal, tax, billing, backup, and dispute handling needs.",
          "Account deletion requests may remove or de-identify user-controlled records where legally and technically feasible, while preserving records required for fraud prevention, billing, security, legal compliance, or dispute resolution.",
        ],
        links: [{ label: "Request deletion review", href: supportLink }],
      },
    ],
  },
  "acceptable-use": {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    navLabel: "Acceptable Use",
    description:
      "Rules protecting the platform, users, billing systems, product integrity, and proprietary operational intelligence.",
    sections: [
      {
        id: "prohibited",
        title: "Prohibited Conduct",
        paragraphs: [
          "Users may not use Karpilo products to violate laws, compromise systems, bypass access controls, scrape data, reverse engineer proprietary workflows, resell unauthorized access, misrepresent identity, upload malicious code, or interfere with other users.",
          "Fraud, abuse, chargeback misuse, payment manipulation, credential sharing beyond authorized terms, or attempts to obtain hidden pricing improperly may result in restricted access or account termination.",
        ],
      },
      {
        id: "enforcement",
        title: "Enforcement",
        paragraphs: [
          "We may investigate suspected misuse and take action where needed to protect the service, users, payment systems, product integrity, and legal obligations.",
        ],
      },
    ],
  },
  "trademark-ip": {
    slug: "trademark-ip",
    title: "Trademark & IP Notice",
    navLabel: "IP Notice",
    description:
      "Copyright, product concept, trade dress, trademark, and proprietary system notices for Karpilo products.",
    sections: [
      {
        id: "ownership",
        title: "Ownership",
        paragraphs: [
          "Karpilo Endeavor Technologies, Karpilo LoadIQ, Karpilo FleetOS, Karpilo Atlas AI, Atlas Insights, Atlas Guidance, Atlas Educational Support, Atlas Operational Context, product names, interface systems, operational workflows, copy, layouts, animations, graphics, and product concepts may be protected intellectual property.",
          "No public page, demo, screenshot, copy, workflow, pricing system, or visual design grants permission to clone, scrape, reproduce, redistribute, resell, or create derivative products from Karpilo materials.",
        ],
      },
      {
        id: "third-party",
        title: "Third-Party Marks",
        paragraphs: [
          "Stripe, Apple, Google, EIA, and other third-party names belong to their respective owners. References are for attribution, interoperability, policy disclosure, or billing context only.",
        ],
      },
    ],
  },
  "pilot-program": {
    slug: "pilot-program",
    title: "Pilot Program Terms",
    navLabel: "Pilot Terms",
    description:
      "Founding 50 Pilot Program rules, lifetime lock expectations, qualification, and transition to public launch pricing.",
    sections: [
      {
        id: "founding-50",
        title: "Founding 50 Pilot Program",
        paragraphs: [
          "The Founding 50 Pilot Program is limited to the first 50 approved users. Pilot pricing is currently structured at $14.99/month or $129.99/year while the account remains active and in good standing.",
          "Pilot access is qualification-based. Submitting interest does not guarantee approval, access, billing availability, app store availability, or a pricing lock.",
          "Pilot access is limited to the purchased entitlement scope, applicable subscription class, and current Karpilo LoadIQ product family.",
        ],
      },
      {
        id: "lock",
        title: "Lifetime Pricing Lock",
        paragraphs: [
          "A lifetime pricing lock means the qualifying pilot rate remains available for the qualifying account while it stays active and in good standing, subject to payment platform rules and applicable law.",
          "A lifetime pricing lock is not ownership of Karpilo LoadIQ and does not grant automatic access to all future Karpilo FleetOS, Pro, enterprise, API, team, or separately licensed products.",
          "The lock may be lost after account deletion, fraud, abuse, chargeback misuse, payment failure, policy violations, transfer attempts, or terms violations.",
        ],
      },
      {
        id: "launch500",
        title: "Launch 500 Transition",
        paragraphs: [
          "After pilot capacity or pilot timing ends, users may transition into Official Launch Founders Pricing for the first 500 launch operators at $19.99/month or $149.99/year where available.",
        ],
      },
    ],
  },
  "safety-disclosure": {
    slug: "safety-disclosure",
    title: "Hands-Free & Driver Safety Disclosure",
    navLabel: "Safety Disclosure",
    description:
      "Required website safety disclosure for using Karpilo LoadIQ responsibly around vehicles, equipment, and active transportation work.",
    sections: [
      {
        id: "hands-free",
        title: "Hands-Free Use Required",
        paragraphs: [
          "Karpilo LoadIQ is an operational estimation and educational awareness tool. It must not be used in a way that distracts a driver, violates hands-free laws, interferes with safe vehicle operation, or conflicts with carrier, shipper, receiver, or roadway safety rules.",
          "Drivers should review Karpilo LoadIQ information only when safely parked or when another authorized person can operate the device without distracting the driver.",
        ],
      },
      {
        id: "driver-responsibility",
        title: "Driver Responsibility",
        paragraphs: [
          "Users remain responsible for obeying all traffic laws, hours-of-service rules, company policies, device-use restrictions, and safety requirements.",
          "Karpilo LoadIQ estimates do not replace professional judgment, dispatch instructions, route verification, weather awareness, road condition review, cargo securement, vehicle legality, or regulatory compliance.",
        ],
      },
      {
        id: "website-acknowledgment",
        title: "Website Acknowledgment",
        paragraphs: [
          "The public website may ask visitors to acknowledge this safety disclosure before continuing. That acknowledgment is stored locally in the visitor's browser and may reappear if browser storage is cleared.",
          "Other legal policies remain publicly available for review and are not presented as mandatory website acceptance gates unless a separate checkout, account, or product flow requires it.",
        ],
      },
    ],
  },
  "billing-policy": {
    slug: "billing-policy",
    title: "Billing Policy",
    navLabel: "Billing Policy",
    description:
      "Billing-channel policy for Stripe/Web, Apple App Store, Google Play, and future subscription handling.",
    sections: [
      {
        id: "billing-channels",
        title: "Billing Channels",
        paragraphs: [
          "Stripe/Web, Apple App Store, and Google Play are billing channels only. They do not independently determine founder pilot eligibility, launch cohort eligibility, or pricing-lock authority.",
          "Supabase-controlled reservation and entitlement records are the internal authority for cohort status and pricing-lock eligibility. Billing providers may still control receipts, payment retries, taxes, cancellation tools, disputes, and refund paths for purchases processed through their systems.",
        ],
      },
      {
        id: "trial-availability",
        title: "Trial Availability",
        paragraphs: [
          "Founder pilot access, launch cohort access, Gold access, and planned Platinum access are intended to support a 7-day free trial where the applicable billing provider and checkout flow allow it.",
          "A checkout or platform screen should disclose the trial duration, conversion date, recurring price, billing interval, and cancellation method before the user is charged.",
          "Karpilo LoadIQ does not offer a permanent free tier initially.",
        ],
      },
      {
        id: "provider-selection",
        title: "Intended Provider Selection",
        paragraphs: [
          "Website reservations may ask users to select an intended billing provider: Stripe/Web, Apple App Store, Google Play, or Undecided. That selection helps plan launch operations and does not itself create a subscription or charge.",
          "Actual billing begins only when an authorized billing flow is available and the user completes checkout through the applicable provider.",
        ],
      },
    ],
  },
  "pricing-lock-policy": {
    slug: "pricing-lock-policy",
    title: "Pricing Lock Policy",
    navLabel: "Pricing Lock",
    description:
      "How founder pilot and launch cohort pricing-lock eligibility is controlled, preserved, and lost.",
    sections: [
      {
        id: "authority",
        title: "Supabase Is Pricing-Lock Authority",
        paragraphs: [
          "Pricing-lock eligibility is controlled by Karpilo LoadIQ's Supabase reservation and entitlement records. Stripe coupons, app-store products, frontend text, emails, or screenshots do not override the server-side authority.",
          "Founder pilot pricing is limited to the first 50 approved users at $14.99/month or $129.99/year. Launch cohort pricing is limited to the next 500 launch users at $19.99/month or $149.99/year. Gold users are currently priced at $29.99/month or $299.99/year, and planned Platinum pricing is currently presented at $34.99/month or $349.99/year before release.",
          "Pricing-lock eligibility applies only to the qualifying account, purchased entitlement scope, applicable subscription class, and current Karpilo LoadIQ product family. Future enterprise licensing, Pro/FleetOS capabilities, team accounts, APIs, or separately licensed modules may require separate pricing and terms.",
        ],
      },
      {
        id: "conditions",
        title: "Eligibility Conditions",
        paragraphs: [
          "A pricing lock remains available only while the qualifying account remains active, in good standing, and compliant with applicable terms, billing requirements, and platform rules.",
          "Pricing-lock eligibility may be lost after cancellation, account deletion, transfer attempts, unresolved payment failure, chargeback misuse, fraud, abuse, or policy violations.",
        ],
      },
      {
        id: "billing-provider-limits",
        title: "Billing Provider Limits",
        paragraphs: [
          "Different billing platforms may have different technical pricing, tax, renewal, cancellation, and refund behavior. Karpilo LoadIQ preserves the internal entitlement classification separately from the provider's billing mechanics where possible.",
        ],
      },
    ],
  },
  support: {
    slug: "support",
    title: "Support Contact",
    navLabel: "Support",
    description:
      "Support paths for accounts, billing, privacy, deletion, refunds, legal questions, and product access.",
    sections: [
      {
        id: "contact",
        title: "Contact Support",
        paragraphs: [
          "For account help, privacy requests, account deletion, refund review, subscription questions, legal questions, billing concerns, or technical access issues, contact support with the account email and relevant details.",
        ],
        links: [
          { label: `Support: ${SUPPORT_EMAIL}`, href: supportLink },
          { label: `Help: ${HELP_EMAIL}`, href: helpLink },
          { label: `Billing: ${BILLING_EMAIL}`, href: billingLink },
          { label: `Launch updates: ${UPDATES_EMAIL}`, href: updatesLink },
          { label: `Newsletter: ${NEWSLETTER_EMAIL}`, href: newsletterLink },
        ],
      },
    ],
  },
  "feature-request": {
    slug: "feature-request",
    title: "Feature Request Portal",
    navLabel: "Feature Requests",
    description:
      "How pilot users and early operators can submit operational feedback without transferring ownership of proprietary Karpilo systems.",
    sections: [
      {
        id: "feedback",
        title: "Operational Feedback",
        paragraphs: [
          "Pilot users and early operators are encouraged to share ideas, pain points, workflow friction, and operational scenarios that can improve Karpilo LoadIQ.",
          "Feedback may be used to improve Karpilo products without creating compensation, ownership, confidentiality, or implementation obligations unless separately agreed in writing.",
        ],
        links: [{ label: "Send feature feedback", href: feedbackLink }],
      },
    ],
  },
};

export const legalCenterSections: LegalSection[] = [
  {
    id: "compliance-posture",
    title: "Launch-Ready Compliance Infrastructure",
    paragraphs: [
      `${COMPANY_NAME} maintains legal and compliance pages for privacy, terms, refunds, cookies, subscriptions, data usage, third-party services, account requests, intellectual property, and payment disclosures.`,
      "These pages are designed for MVP launch readiness, Stripe subscription readiness, Apple/Google policy awareness, and future SaaS product expansion.",
    ],
  },
  {
    id: "contact",
    title: "Compliance Contact",
    paragraphs: [
      "Use the support channel for policy questions, account deletion requests, privacy requests, billing support, security concerns, intellectual property questions, and subscription help.",
    ],
    links: [
      { label: `Support: ${SUPPORT_EMAIL}`, href: supportLink },
      { label: `Help: ${HELP_EMAIL}`, href: helpLink },
      { label: `Billing: ${BILLING_EMAIL}`, href: billingLink },
      { label: `Launch updates: ${UPDATES_EMAIL}`, href: updatesLink },
      { label: `Newsletter: ${NEWSLETTER_EMAIL}`, href: newsletterLink },
      { label: `Recommendations / Feedback: ${FEEDBACK_EMAIL}`, href: feedbackLink },
    ],
  },
];
