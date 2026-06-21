export type RolloutPhaseKey =
  | "PRELAUNCH_WAITLIST"
  | "FOUNDER_PILOT"
  | "CONTROLLED_PUBLIC_LAUNCH"
  | "EXPANSION_ACCESS"
  | "GENERAL_AVAILABILITY";

export type RolloutPhaseStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "full"
  | "closed"
  | "complete";

export type RolloutPhaseConfig = {
  key: RolloutPhaseKey;
  title: string;
  shortLabel: string;
  capacity: number | null;
  durationDays: number | null;
  startsAt: string | null;
  endsAt: string | null;
  description: string;
  expectation: string;
  ctaLabel: string;
  targetRoute: string;
};

export type RolloutPhaseSnapshot = RolloutPhaseConfig & {
  status: RolloutPhaseStatus;
  reservedSlots: number;
  remainingSlots: number | null;
  targetAt: string | null;
  isAcceptingReservations: boolean;
};

export type RolloutStatusEvent = {
  id: string;
  title: string;
  message: string;
  severity: "info" | "degraded" | "maintenance" | "incident";
  status: "active" | "scheduled" | "resolved";
};

export type RolloutSnapshot = {
  generatedAt: string;
  activePhase: RolloutPhaseSnapshot;
  phases: RolloutPhaseSnapshot[];
  statusEvents: RolloutStatusEvent[];
  source: "supabase" | "fallback";
};

export const DEVELOPMENT_READINESS_NOTICE = {
  eyebrow: "Launch Readiness",
  title: "Launch timing is intentionally flexible while final systems are refined.",
  message:
    "Karpilo LoadIQ is moving through accelerated development, final policy review, payment-gate readiness, and app publishing preparation. Public milestones may shift while the site and application are refined for launch.",
  paymentNote:
    "Payment processes remain restricted until launch readiness, legal, procedural, and technical gates are explicitly complete.",
} as const;

export const ROLLOUT_PHASES: RolloutPhaseConfig[] = [
  {
    key: "PRELAUNCH_WAITLIST",
    title: "Pilot enrollment readiness window.",
    shortLabel: "Pilot 100",
    capacity: 100,
    durationDays: 30,
    startsAt: "2026-05-13T15:00:00Z",
    endsAt: "2026-06-12T15:00:00Z",
    description: "Pilot enrollment reservations are open while launch systems are finalized.",
    expectation: "No billing is active. The first 100 approved users may qualify for discounted tier enrollment after server-side review.",
    ctaLabel: "Reserve Eligibility",
    targetRoute: "/pilot-program",
  },
  {
    key: "FOUNDER_PILOT",
    title: "Second enrollment planned for the next 500 users.",
    shortLabel: "Next 500",
    capacity: 500,
    durationDays: 60,
    startsAt: "2026-06-27T15:00:00Z",
    endsAt: "2026-08-26T15:00:00Z",
    description: "The second discounted enrollment cohort is planned after pilot enrollment readiness is validated.",
    expectation: "Second enrollment timing may move while launch systems, support, and payment gates are finalized.",
    ctaLabel: "Join Second Enrollment",
    targetRoute: "/launch-promo",
  },
  {
    key: "CONTROLLED_PUBLIC_LAUNCH",
    title: "Public launch readiness review.",
    shortLabel: "Readiness",
    capacity: null,
    durationDays: 90,
    startsAt: "2026-08-26T15:00:00Z",
    endsAt: "2026-11-24T15:00:00Z",
    description: "Public launch readiness is reviewed after the two discounted enrollment phases.",
    expectation: "Open public access remains gated by infrastructure, support load, billing readiness, and publication requirements.",
    ctaLabel: "Get Launch Updates",
    targetRoute: "/launch-promo",
  },
  {
    key: "EXPANSION_ACCESS",
    title: "Public launch readiness window.",
    shortLabel: "Readiness",
    capacity: null,
    durationDays: null,
    startsAt: "2026-11-24T15:00:00Z",
    endsAt: "2026-11-24T15:00:00Z",
    description: "The controlled cohorts have completed and the app enters final public-readiness monitoring.",
    expectation: "Open public access is held until final public launch readiness is confirmed.",
    ctaLabel: "Get Launch Updates",
    targetRoute: "/contact",
  },
  {
    key: "GENERAL_AVAILABILITY",
    title: "App live to public.",
    shortLabel: "Public Live",
    capacity: null,
    durationDays: null,
    startsAt: "2026-11-24T15:00:00Z",
    endsAt: null,
    description: "Karpilo LoadIQ opens to public access 90 days from Phase 3 launch.",
    expectation: "General availability opens only after payment, policy, support, and app publishing readiness are confirmed.",
    ctaLabel: "Get Launch Updates",
    targetRoute: "/contact",
  },
] as const;

function parseTime(value: string | null) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

export function buildFallbackRolloutSnapshot(now = Date.now()): RolloutSnapshot {
  const phases = ROLLOUT_PHASES.map<RolloutPhaseSnapshot>((phase) => {
    const starts = parseTime(phase.startsAt);
    const ends = parseTime(phase.endsAt);
    const status: RolloutPhaseStatus =
      starts && now < starts
        ? "upcoming"
        : ends && now >= ends
          ? "complete"
          : "active";

    return {
      ...phase,
      status,
      reservedSlots: 0,
      remainingSlots: phase.capacity,
      targetAt: status === "upcoming" ? phase.startsAt : phase.endsAt,
      isAcceptingReservations:
        phase.key === "PRELAUNCH_WAITLIST" &&
        status !== "complete" &&
        phase.capacity !== 0,
    };
  });

  const activePhase =
    phases.find((phase) => phase.status === "active") ||
    phases.find((phase) => phase.status === "upcoming") ||
    phases[phases.length - 1];

  return {
    generatedAt: new Date(now).toISOString(),
    activePhase,
    phases,
    statusEvents: [],
    source: "fallback",
  };
}
