import { BRAND } from "@/config/brand";
import { EMAIL_ADDRESSES } from "@/config/email";

const LOADIQ_APP_BASE_URL =
  process.env.NEXT_PUBLIC_LOADIQ_APP_URL ?? "https://app.karpilo-liq.com";

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
  app: LOADIQ_APP_BASE_URL,
  appLogin: `${LOADIQ_APP_BASE_URL}/login`,
  appRequestAccess: `${LOADIQ_APP_BASE_URL}/request-access`,
  appPortal: `${LOADIQ_APP_BASE_URL}/portal`,
  appBilling: `${LOADIQ_APP_BASE_URL}/portal/billing`,
  appSettings: `${LOADIQ_APP_BASE_URL}/portal/settings`,
  appFitCheck: `${LOADIQ_APP_BASE_URL}/portal/fit-check`,
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
    description: "Pilot access, launch phase updates, maintenance, and status notices.",
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
  features: "/features",
  pricing: "/pricing",
  launch: "/launch",
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
  { label: "Home", href: LOADIQ_ROUTES.home },
  { label: "Features", href: LOADIQ_ROUTES.features },
  { label: "Pricing", href: LOADIQ_ROUTES.pricing },
  { label: "Launch", href: LOADIQ_ROUTES.launch },
  { label: "Demo", href: LOADIQ_ROUTES.demo },
] as const;

export const LOADIQ_APP_ACCESS_LINKS = [
  {
    label: "Request Access",
    href: LOADIQ_URLS.appRequestAccess,
    description: "Join controlled launch intake. Access may be limited by phase availability.",
  },
  {
    label: "Open Portal",
    href: LOADIQ_URLS.appPortal,
    description: "Open the app portal. Launch access may be restricted.",
  },
] as const;

export const LOADIQ_FOOTER_LINKS = {
  platform: [
    { label: "Home", href: LOADIQ_ROUTES.home },
    { label: "Features", href: LOADIQ_ROUTES.features },
    { label: "Pricing", href: LOADIQ_ROUTES.pricing },
    { label: "Launch", href: LOADIQ_ROUTES.launch },
    { label: "Demo", href: LOADIQ_ROUTES.demo },
  ],
  access: [
    { label: "Request Access", href: LOADIQ_URLS.appRequestAccess, external: true },
    { label: "Open Portal", href: LOADIQ_URLS.appPortal, external: true },
  ],
  billingSupport: [
    { label: "Billing", href: LOADIQ_ROUTES.billing },
    { label: "Contact", href: LOADIQ_ROUTES.contact },
    { label: "Status", href: LOADIQ_ROUTES.status },
    { label: "Billing Email", href: `mailto:${LOADIQ_CONTACT.billingEmail}`, external: true },
  ],
  legal: [
    { label: "Legal Center", href: LOADIQ_ROUTES.legal },
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Refund Policy", href: "/legal/refund-policy" },
    { label: "Billing Policy", href: "/legal/billing-policy" },
    { label: "Subscription Terms", href: "/legal/subscription-terms" },
  ],
  company: [
    { label: "Founder", href: LOADIQ_ROUTES.founder },
    { label: "About", href: "/about" },
    { label: "Company", href: LOADIQ_URLS.companyWebsite, external: true },
  ],
} as const;

export const LOADIQ_LAUNCH_KEYS = {
  pilotAccess: "pilot_access",
  launchPhase1: "launch_phase_1",
  launchPhase2: "launch_phase_2",
  standardFuture: "standard_future",
  safetyAcknowledgmentStorageKey: "karpilo_loadiq_hands_free_acknowledged",
} as const;
