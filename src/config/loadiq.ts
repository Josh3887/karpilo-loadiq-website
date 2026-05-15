import { BRAND } from "@/config/brand";

export const LOADIQ_BRAND = {
  companyName: BRAND.legalCompanyName,
  productName: BRAND.productName,
  shortName: BRAND.shortName,
  productMark: BRAND.productMark,
  appIcon: BRAND.appIcon,
  cardImage: BRAND.cardImage,
  logo: BRAND.logo,
  companyImage: BRAND.cardImage,
} as const;

export const LOADIQ_URLS = {
  website: "https://www.karpiloloadiq.com",
  app: process.env.NEXT_PUBLIC_LOADIQ_APP_URL ?? "https://app.karpiloloadiq.com",
  companyWebsite: "https://www.karpiloendeavortechnologies.com",
  facebook: "https://www.facebook.com/",
} as const;

export const LOADIQ_CONTACT = {
  supportEmail: "support@karpiloloadiq.com",
  helpEmail: "help@karpiloloadiq.com",
  billingEmail: "billing@karpiloloadiq.com",
  updatesEmail: "updates@karpiloloadiq.com",
  newsletterEmail: "newsletter@karpiloloadiq.com",
  noreplyEmail: "noreply@karpiloloadiq.com",
  feedbackEmail: "Josh.karpilo@karpiloendeavortechnologies.com",
  featureRequestEmail: "Josh.karpilo@karpiloendeavortechnologies.com",
} as const;

export const LOADIQ_CONTACT_CHANNELS = [
  {
    id: "support",
    label: "Support",
    email: LOADIQ_CONTACT.supportEmail,
    description: "Support, privacy requests, deletion requests, app issues, and account access.",
    monitored: true,
  },
  {
    id: "help",
    label: "Help Desk",
    email: LOADIQ_CONTACT.helpEmail,
    description: "General help, onboarding questions, and how-to guidance.",
    monitored: true,
  },
  {
    id: "billing",
    label: "Billing",
    email: LOADIQ_CONTACT.billingEmail,
    description: "Billing questions, refund review, invoices, subscriptions, and receipts.",
    monitored: true,
  },
  {
    id: "updates",
    label: "Launch Updates",
    email: LOADIQ_CONTACT.updatesEmail,
    description: "Founder pilot updates, launch cohort notices, maintenance, and status updates.",
    monitored: true,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    email: LOADIQ_CONTACT.newsletterEmail,
    description: "Newsletter signup, product updates, and subscriber communications.",
    monitored: true,
  },
  {
    id: "feature-requests",
    label: "Feature Requests",
    email: LOADIQ_CONTACT.featureRequestEmail,
    description: "Product recommendations, workflow ideas, and operational feedback.",
    monitored: true,
  },
  {
    id: "noreply",
    label: "Automated Notices",
    email: LOADIQ_CONTACT.noreplyEmail,
    description: "System-generated confirmations and receipts. This inbox is not monitored.",
    monitored: false,
  },
] as const;

export const LOADIQ_ROUTES = {
  home: "/",
  pricing: "/pricing",
  pilotProgram: "/pilot-program",
  launchPromo: "/launch-promo",
  demo: "/demo",
  founder: "/founder",
  contact: "/contact",
  status: "/status",
  legal: "/legal",
  privacy: "/privacy",
  terms: "/terms",
  refundPolicy: "/refund-policy",
} as const;

export const LOADIQ_APP_STORE_PLACEHOLDERS = [
  {
    id: "apple_app_store",
    label: "Apple App Store",
    note: "Apple App Store availability coming soon",
    detail: "Pilot access opening first",
    icon: BRAND.appIcon,
  },
  {
    id: "google_play",
    label: "Google Play",
    note: "Google Play availability coming soon",
    detail: "Mobile app launch preparation in progress",
    icon: BRAND.appIcon,
  },
] as const;

export const LOADIQ_NAVIGATION_LINKS = [
  { label: "Pricing", href: LOADIQ_ROUTES.pricing },
  { label: "Demo", href: LOADIQ_ROUTES.demo },
  { label: "Pilot", href: LOADIQ_ROUTES.pilotProgram },
  { label: "Launch", href: LOADIQ_ROUTES.launchPromo },
  { label: "Founder", href: LOADIQ_ROUTES.founder },
] as const;

export const LOADIQ_APP_ACCESS_LINKS = [
  {
    label: "Open Karpilo LoadIQ Dashboard",
    href: `${LOADIQ_URLS.app}/dashboard`,
    description: "Return to the protected APP dashboard.",
  },
  {
    label: "Account Settings",
    href: `${LOADIQ_URLS.app}/dashboard/settings/account`,
    description: "Manage operator identity in the APP.",
  },
  {
    label: "Manage Billing",
    href: `${LOADIQ_URLS.app}/dashboard/settings/billing`,
    description: "Open Billing Command in the APP.",
  },
  {
    label: "Login",
    href: `${LOADIQ_URLS.app}/auth/login`,
    description: "Sign in to the APP.",
  },
  {
    label: "Signup",
    href: `${LOADIQ_URLS.app}/auth/register`,
    description: "Create Karpilo LoadIQ access.",
  },
  {
    label: "Subscription Help",
    href: `mailto:${LOADIQ_CONTACT.billingEmail}`,
    description: "Reach the Karpilo LoadIQ billing channel.",
  },
] as const;

export const LOADIQ_FOOTER_LINKS = {
  platform: [
    { label: "Home", href: LOADIQ_ROUTES.home },
    { label: "Pricing", href: LOADIQ_ROUTES.pricing },
    { label: "Demo", href: LOADIQ_ROUTES.demo },
    { label: "Pilot Program", href: LOADIQ_ROUTES.pilotProgram },
    { label: "Launch Promotion", href: LOADIQ_ROUTES.launchPromo },
  ],
  company: [
    { label: "Founder", href: LOADIQ_ROUTES.founder },
    { label: "About", href: "/about" },
    { label: "Contact", href: LOADIQ_ROUTES.contact },
    { label: "Status", href: LOADIQ_ROUTES.status },
  ],
  legal: [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Refunds", href: "/legal/refund-policy" },
    { label: "Subscriptions", href: "/legal/subscription-terms" },
    { label: "Safety", href: "/legal/safety-disclosure" },
    { label: "Billing", href: "/legal/billing-policy" },
    { label: "Pricing Lock", href: "/legal/pricing-lock-policy" },
    { label: "Legal Center", href: LOADIQ_ROUTES.legal },
  ],
} as const;

export const LOADIQ_LAUNCH_KEYS = {
  founder50: "founder_50",
  launch500: "launch_500",
  standardFuture: "standard_future",
  safetyAcknowledgmentStorageKey: "karpilo_loadiq_hands_free_acknowledged",
} as const;
