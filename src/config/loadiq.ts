import { BRAND } from "@/config/brand";
import { EMAIL_ADDRESSES } from "@/config/email";

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
  website: "https://karpilo-liq.com",
  app: process.env.NEXT_PUBLIC_LOADIQ_APP_URL ?? "https://app.karpilo-liq.com",
  companyWebsite: "https://karpiloendeavor.com",
  facebook: "https://www.facebook.com/",
} as const;

export const LOADIQ_CONTACT = {
  noReplyEmail: EMAIL_ADDRESSES.noReply,
  supportEmail: EMAIL_ADDRESSES.support,
  helpEmail: EMAIL_ADDRESSES.support,
  newsletterEmail: EMAIL_ADDRESSES.newsletter,
  updatesEmail: EMAIL_ADDRESSES.newsletter,
  billingEmail: EMAIL_ADDRESSES.billing,
  noreplyEmail: EMAIL_ADDRESSES.noReply,
  founderFeedbackEmail: EMAIL_ADDRESSES.executive,
  feedbackEmail: EMAIL_ADDRESSES.support,
  featureRequestEmail: EMAIL_ADDRESSES.support,
  executiveEmail: EMAIL_ADDRESSES.executive,
  corporateEmail: EMAIL_ADDRESSES.executive,
  legalEmail: EMAIL_ADDRESSES.executive,
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
    id: "corporate",
    label: "Executive / Business",
    email: LOADIQ_CONTACT.corporateEmail,
    description: "Partnerships, strategic inquiries, press, media, founder-level escalation, and business matters.",
    monitored: true,
  },
  {
    id: "noreply",
    label: "Automated Notices",
    email: LOADIQ_CONTACT.noReplyEmail,
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
  atlas: "/atlas",
  founder: "/founder",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  accountSettings: "/account/settings",
  billing: "/billing",
  subscriptionHelp: "/subscription-help",
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
  { label: "Atlas", href: LOADIQ_ROUTES.atlas },
  { label: "Demo", href: LOADIQ_ROUTES.demo },
  { label: "Pilot", href: LOADIQ_ROUTES.pilotProgram },
  { label: "Launch", href: LOADIQ_ROUTES.launchPromo },
  { label: "Founder", href: LOADIQ_ROUTES.founder },
] as const;

export const LOADIQ_APP_ACCESS_LINKS = [
  {
    label: "Prepare Mobile App Access",
    href: LOADIQ_ROUTES.accountSettings,
    description: "Review account readiness for future mobile app access.",
  },
  {
    label: "Account Settings",
    href: LOADIQ_ROUTES.accountSettings,
    description: "Manage website account identity.",
  },
  {
    label: "Manage Billing",
    href: LOADIQ_ROUTES.billing,
    description: "Review subscription access and billing support.",
  },
  {
    label: "Login",
    href: LOADIQ_ROUTES.login,
    description: "Sign in on the website.",
  },
  {
    label: "Signup",
    href: LOADIQ_ROUTES.signup,
    description: "Create Karpilo LoadIQ access.",
  },
  {
    label: "Subscription Help",
    href: LOADIQ_ROUTES.subscriptionHelp,
    description: "Reach the Karpilo LoadIQ billing channel.",
  },
] as const;

export const LOADIQ_FOOTER_LINKS = {
  platform: [
    { label: "Home", href: LOADIQ_ROUTES.home },
    { label: "Pricing", href: LOADIQ_ROUTES.pricing },
    { label: "Demo", href: LOADIQ_ROUTES.demo },
    { label: "Atlas", href: LOADIQ_ROUTES.atlas },
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
