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

export const ROLLOUT_PHASES: RolloutPhaseConfig[] = [
  {
    key: "PRELAUNCH_WAITLIST",
    title: "Phase 1 Pilot launch countdown.",
    shortLabel: "Pilot 50",
    capacity: 50,
    durationDays: 30,
    startsAt: "2026-05-13T15:00:00Z",
    endsAt: "2026-06-12T15:00:00Z",
    description: "Founder 50 reservations are open while the 30-day pilot launch countdown runs.",
    expectation: "No billing is active. The first 50 reservations are routed for direct founder review.",
    ctaLabel: "Reserve Founder 50",
    targetRoute: "/pilot-program",
  },
  {
    key: "FOUNDER_PILOT",
    title: "Phase 2 launches for the first 250 users.",
    shortLabel: "Phase 2",
    capacity: 250,
    durationDays: 60,
    startsAt: "2026-06-27T15:00:00Z",
    endsAt: "2026-08-26T15:00:00Z",
    description: "The first controlled launch cohort opens 45 days from the pilot launch anchor.",
    expectation: "Phase 2 expands access to the first 250 launch users after the Founder 50 countdown.",
    ctaLabel: "Join Phase 2 Queue",
    targetRoute: "/launch-promo",
  },
  {
    key: "CONTROLLED_PUBLIC_LAUNCH",
    title: "Phase 3 launches for the last 250 users.",
    shortLabel: "Phase 3",
    capacity: 250,
    durationDays: 90,
    startsAt: "2026-08-26T15:00:00Z",
    endsAt: "2026-11-24T15:00:00Z",
    description: "The second controlled launch cohort opens 60 days after Phase 2 begins.",
    expectation: "Phase 3 covers the last 250 launch users before open public availability.",
    ctaLabel: "Join Phase 3 Queue",
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
    expectation: "Open public access is held until the final public launch timer reaches zero.",
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
    expectation: "This final public-live countdown is shown on the home page.",
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
