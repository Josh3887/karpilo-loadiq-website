export type LaunchPhaseId =
  | "waitlist_only"
  | "pre_pilot"
  | "pilot_active"
  | "pilot_closed"
  | "launch500_active"
  | "standard_active";

export const launchTimeline = {
  pilotOpensAtUtc: "2026-06-01T15:00:00.000Z",
  pilotDurationDays: 60,
  officialLaunchAtUtc: "2026-07-31T15:00:00.000Z",
} as const;

export const pilotProgram = {
  name: "Founding 50 Pilot Program",
  maxSlots: 50,
  claimedSlots: 0,
  monthlyPrice: 14.99,
  annualPrice: 129.99,
  lockLabel: "Lifetime pricing lock",
  badge: "Founding Operator",
  lockRules: [
    "Pricing remains locked while the account stays active and in good standing.",
    "Lock may be lost after account deletion, fraud, abuse, or terms violations.",
    "Pilot access is approval-based and limited to the first 50 qualified users.",
  ],
} as const;

export const pilotPaymentGate = {
  requiredFlags: [
    "pilot_payments_enabled",
    "pilot_slots_remaining",
    "pilot_subscription_locked",
    "founding_operator_assigned",
    "waitlist_only_mode",
  ],
  failSafeMode: "waitlist_only",
  preLaunchPolicy:
    "Before the pilot countdown reaches zero, visitors may join the waitlist, request pilot consideration, and subscribe to updates. Payment collection must remain disabled.",
  activePolicy:
    "Pilot checkout may activate only after server-authoritative validation confirms the pilot window is open and a Founding 50 slot is available.",
  fullPolicy:
    "Once all 50 Founding Operator slots are allocated, pilot checkout must close automatically and the public flow must return to waitlist and launch-notification registration.",
} as const;

export const launch500Program = {
  name: "First 500 Launch Operators",
  maxSlots: 500,
  claimedSlots: 0,
  monthlyPrice: 19.99,
  annualPrice: 159.99,
  lockLabel: "Legacy pricing lock",
  badge: "Launch Operator",
} as const;

export const standardPricing = {
  monthlyPrice: 24.99,
  annualPrice: 189.99,
  lockLabel: "No lifetime lock",
} as const;

export const founderStory = {
  eyebrow: "Built On The Road",
  title: "This platform was not built by software people studying trucking.",
  quote:
    "It was built by someone actively living it.",
  paragraphs: [
    "Joshua Karpilo, Founder & CEO of Karpilo Endeavor Technologies, is an active driver and owner-operator with more than 13 years in trucking.",
    "LoadIQ comes from the daily pressure of real freight decisions: long hours, volatile fuel costs, breakdown exposure, broker pressure, deadhead, and thin margins that do not care how good a gross number looks.",
    "The goal is not to dress trucking up in generic software language. The goal is to give drivers operational intelligence before the load is accepted.",
  ],
} as const;

export const founderWelcomeCopy = [
  "Welcome to Karpilo LoadIQ.",
  "My name is Joshua Karpilo, Founder and CEO of Karpilo Endeavor Technologies and creator of Karpilo LoadIQ.",
  "Like many of you, I am still living the reality of the road. I am an active driver and owner-operator with more than 13 years in trucking, and I know how unforgiving this industry can be.",
  "The long hours, uncertainty, fuel costs, breakdowns, missed time, and sacrifices behind the windshield are hard to explain to people who have never lived them.",
  "Karpilo LoadIQ was built because I got tired of watching drivers make high-stakes decisions without real operational intelligence.",
  "This app is my contribution back to the people who keep this country moving. My goal is simple: help drivers think clearer, operate smarter, and stay profitable longer.",
  "LoadIQ is only the beginning. It is the foundation for a larger operational ecosystem still being built carefully behind the scenes.",
  "As an early supporter, your feedback matters. Some of the best ideas in trucking do not come from boardrooms. They come from truck stops, loading docks, breakdowns, and honest conversations between people who live this work.",
  "Thank you for believing in the vision early. Your loyalty during this pilot phase earns you a lifetime pricing lock as one of our founding operators, as long as your account remains active and in good standing.",
  "Welcome to the beginning of a new journey.",
  "Joshua Karpilo",
] as const;

export const educationCards = [
  {
    title: "Gross revenue can lie to you",
    text: "A strong gross number can still collapse after fuel, deadhead, deductions, overhead, and time exposure.",
  },
  {
    title: "True RPM matters",
    text: "Loaded miles and deadhead need to be judged together. Unpaid miles still burn fuel, time, and equipment life.",
  },
  {
    title: "Profit per hour exposes pressure",
    text: "A load can look fine per mile but fail when detention, routing, or multi-day time cost is included.",
  },
  {
    title: "Operational awareness compounds",
    text: "The goal is not one perfect load. It is building a habit of clearer decisions across the week.",
  },
] as const;

export const ecosystemTeasers = [
  "Karpilo FleetOS",
  "iAtion",
  "iAtion Core",
] as const;
