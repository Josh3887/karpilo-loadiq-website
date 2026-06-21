export type LaunchPhaseId =
  | "waitlist_only"
  | "pre_pilot"
  | "pilot_active"
  | "pilot_closed"
  | "launch_phase_1_active"
  | "launch_phase_2_active"
  | "standard_active";

export const launchTimeline = {
  pilotOpensAtLocal: "2026-05-13T08:00:00-07:00",
  pilotDurationDays: 30,
  launchPhase1DurationDays: 30,
  launchPhase2DurationDays: 30,
} as const;

export type LaunchDisplayPhase = {
  id:
    | "pre_pilot"
    | "pilot_active"
    | "pilot_full"
    | "launch_phase_1_active"
    | "launch_phase_2_active"
    | "standard";
  activeProgram: "pilot" | "launch_phase_1" | "launch_phase_2" | "standard";
  title: string;
  label: string;
  targetTime: number | null;
  slotsRemaining: number;
  slotsTotal: number;
  paymentsEnabled: boolean;
};

export function getLaunchPhase(now = Date.now()): LaunchDisplayPhase {
  const pilotOpensAt = Date.parse(launchTimeline.pilotOpensAtLocal);
  const pilotEndsAt =
    pilotOpensAt + launchTimeline.pilotDurationDays * 24 * 60 * 60 * 1000;
  const launchPhase1EndsAt =
    pilotEndsAt + launchTimeline.launchPhase1DurationDays * 24 * 60 * 60 * 1000;
  const launchPhase2EndsAt =
    launchPhase1EndsAt +
    launchTimeline.launchPhase2DurationDays * 24 * 60 * 60 * 1000;
  const pilotSlots = Math.max(pilotProgram.maxSlots - pilotProgram.claimedSlots, 0);
  const launchPhase1Slots = Math.max(
    launchPhase1Program.maxSlots - launchPhase1Program.claimedSlots,
    0,
  );
  const launchPhase2Slots = Math.max(
    launchPhase2Program.maxSlots - launchPhase2Program.claimedSlots,
    0,
  );

  if (!Number.isFinite(pilotOpensAt) || now < pilotOpensAt) {
    return {
      id: "pre_pilot",
      activeProgram: "pilot",
      title: "Pilot enrollment opens for the first 100 approved users.",
      label: "Pilot enrollment readiness",
      targetTime: Number.isFinite(pilotOpensAt) ? pilotOpensAt : null,
      slotsRemaining: pilotSlots,
      slotsTotal: pilotProgram.maxSlots,
      paymentsEnabled: false,
    };
  }

  if (now < pilotEndsAt && pilotSlots > 0) {
    return {
      id: "pilot_active",
      activeProgram: "pilot",
      title: "Pilot enrollment active.",
      label: "First 100 enrollment live",
      targetTime: pilotEndsAt,
      slotsRemaining: pilotSlots,
      slotsTotal: pilotProgram.maxSlots,
      paymentsEnabled: false,
    };
  }

  if (now < pilotEndsAt) {
    return {
      id: "pilot_full",
      activeProgram: "pilot",
      title: "Pilot enrollment fully allocated.",
      label: "Pilot allocation full",
      targetTime: pilotEndsAt,
      slotsRemaining: 0,
      slotsTotal: pilotProgram.maxSlots,
      paymentsEnabled: false,
    };
  }

  if (now < launchPhase1EndsAt && launchPhase1Slots > 0) {
    return {
      id: "launch_phase_1_active",
      activeProgram: "launch_phase_1",
      title: "Launch Phase 1 active for the next 250 approved users.",
      label: "Launch Phase 1",
      targetTime: launchPhase1EndsAt,
      slotsRemaining: launchPhase1Slots,
      slotsTotal: launchPhase1Program.maxSlots,
      paymentsEnabled: false,
    };
  }

  if (now < launchPhase2EndsAt && launchPhase2Slots > 0) {
    return {
      id: "launch_phase_2_active",
      activeProgram: "launch_phase_2",
      title: "Launch Phase 2 active for the next 250 approved users.",
      label: "Launch Phase 2",
      targetTime: launchPhase2EndsAt,
      slotsRemaining: launchPhase2Slots,
      slotsTotal: launchPhase2Program.maxSlots,
      paymentsEnabled: false,
    };
  }

  return {
    id: "standard",
    activeProgram: "standard",
    title: "Standard Public Access",
    label: "Public pricing active",
    targetTime: null,
    slotsRemaining: 0,
    slotsTotal: launchPhase1Program.maxSlots + launchPhase2Program.maxSlots,
    paymentsEnabled: false,
  };
}

export const pilotProgram = {
  name: "Pilot Enrollment Program",
  maxSlots: 100,
  claimedSlots: 0,
  discountLabel: "Enrollment discount monthly pricing",
  lockLabel: "Lifetime pricing lock",
  badge: "Pilot Enrollment",
  lockRules: [
    "Pricing remains locked while the account stays active and in good standing.",
    "Lock may be lost after account deletion, fraud, abuse, or terms violations.",
    "Pilot enrollment is approval-based and limited to the first 100 qualified users.",
    "Eligible users may select Silver, Gold, Platinum, or Pro after server-authoritative validation.",
  ],
} as const;

export const pilotPaymentGate = {
  requiredFlags: [
    "payments_enabled",
    "phase_slots_remaining",
    "subscription_locked",
    "approved_enrollment_assigned",
    "waitlist_only_mode",
  ],
  failSafeMode: "waitlist_only",
  preLaunchPolicy:
    "Before the pilot countdown reaches zero, visitors may join the waitlist, request pilot consideration, and subscribe to updates. Payment collection must remain disabled.",
  activePolicy:
    "Pilot checkout may activate only after server-authoritative validation confirms the pilot window is open, a first-100 slot is available, and the selected commercial tier is eligible.",
  fullPolicy:
    "Once all 100 pilot enrollment slots are allocated, pilot checkout must close automatically and the public flow must return to second-enrollment waitlist and launch-notification registration.",
} as const;

export const launchPhase1Program = {
  name: "Launch Phase 1",
  maxSlots: 250,
  claimedSlots: 0,
  discountLabel: "Enrollment discount monthly pricing",
  lockLabel: "Launch Phase 1 pricing lock",
  badge: "Launch Phase 1",
  slotRange: "Slots 101-350",
} as const;

export const launchPhase2Program = {
  name: "Launch Phase 2",
  maxSlots: 250,
  claimedSlots: 0,
  discountLabel: "Enrollment discount monthly pricing",
  lockLabel: "Launch Phase 2 pricing lock",
  badge: "Launch Phase 2",
  slotRange: "Slots 351-600",
} as const;

export const standardPricing = {
  pricingMode: "Silver, Gold, Platinum, and Pro public pricing",
  lockLabel: "No lifetime lock",
} as const;

export const founderStory = {
  eyebrow: "Built On The Road",
  title: "This platform was not built by software people studying trucking.",
  quote:
    "It was built by someone actively living it.",
  paragraphs: [
    "Joshua Karpilo, Founder & CEO of Karpilo Endeavor Technologies, is an active driver and owner-operator with more than 13 years in trucking.",
    "Karpilo LoadIQ comes from the daily pressure of real freight decisions: long hours, volatile fuel costs, breakdown exposure, broker pressure, deadhead, and thin margins that do not care how good a gross number looks.",
    "The goal is not to dress trucking up in generic software language. The goal is to give drivers clearer operational estimates before they make independent load decisions.",
  ],
} as const;

export const founderWelcomeCopy = [
  "Welcome to Karpilo LoadIQ.",
  "My name is Joshua Karpilo, Founder and CEO of Karpilo Endeavor Technologies and creator of Karpilo LoadIQ.",
  "Like many of you, I am still living the reality of the road. I am an active driver and owner-operator with more than 13 years in trucking, and I know how unforgiving this industry can be.",
  "The long hours, uncertainty, fuel costs, breakdowns, missed time, and sacrifices behind the windshield are hard to explain to people who have never lived them.",
  "Karpilo LoadIQ was built because I got tired of watching drivers make high-stakes decisions without clear operating estimates.",
  "This app is my contribution back to the people who keep this country moving. My goal is simple: help drivers understand the numbers with more clarity and operational context.",
  "Karpilo LoadIQ is only the beginning. It is the foundation for a larger operational ecosystem still being built carefully behind the scenes.",
  "As an early supporter, your feedback matters. Some of the best ideas in trucking do not come from boardrooms. They come from truck stops, loading docks, breakdowns, and honest conversations between people who live this work.",
  "Thank you for believing in the vision early. Your loyalty during a qualifying enrollment phase may earn a pricing lock for the selected Karpilo LoadIQ entitlement scope, as long as your account remains active and in good standing.",
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
  "Karpilo Atlas",
  "Karpilo Atlas AI",
] as const;
