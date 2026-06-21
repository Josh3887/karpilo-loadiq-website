export type RolloutPhaseKey =
  | "PRELAUNCH_WAITLIST"
  | "LAUNCH_PHASE_1"
  | "LAUNCH_PHASE_2"
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
  slotRange: string;
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
    slotRange: "Slots 1-100",
    durationDays: 30,
    startsAt: "2026-05-13T15:00:00Z",
    endsAt: "2026-06-12T15:00:00Z",
    description:
      "Pilot access is the first controlled phase for 100 approved users focused on testing, feedback, and launch-readiness validation.",
    expectation:
      "Public signup is not currently available. Users request access, and slot assignment plus billing eligibility must be confirmed server-side.",
    ctaLabel: "Request Access",
    targetRoute: "/launch",
  },
  {
    key: "LAUNCH_PHASE_1",
    title: "Launch Phase 1 controlled expansion.",
    shortLabel: "Launch 250",
    capacity: 250,
    slotRange: "Slots 101-350",
    durationDays: 30,
    startsAt: "2026-06-27T15:00:00Z",
    endsAt: "2026-07-27T15:00:00Z",
    description:
      "Launch Phase 1 follows the pilot with the next 250 approved users while support, billing, and infrastructure gates remain controlled.",
    expectation:
      "Access remains approval-based. Public checkout is not open unless server-authoritative rollout and billing gates explicitly allow it.",
    ctaLabel: "Request Access",
    targetRoute: "/launch",
  },
  {
    key: "LAUNCH_PHASE_2",
    title: "Launch Phase 2 final controlled expansion.",
    shortLabel: "Launch 250",
    capacity: 250,
    slotRange: "Slots 351-600",
    durationDays: 30,
    startsAt: "2026-07-27T15:00:00Z",
    endsAt: "2026-08-26T15:00:00Z",
    description:
      "Launch Phase 2 adds the next 250 approved users before Karpilo LoadIQ is considered for open-market availability.",
    expectation:
      "This is still controlled launch access. Payment, checkout, and subscription access remain gated by server-side approval.",
    ctaLabel: "Request Access",
    targetRoute: "/launch",
  },
  {
    key: "GENERAL_AVAILABILITY",
    title: "Open Market readiness.",
    shortLabel: "Open Market",
    capacity: null,
    slotRange: "After slots 1-600",
    durationDays: null,
    startsAt: "2026-08-26T15:00:00Z",
    endsAt: null,
    description:
      "Open Market begins only after controlled rollout capacity is complete and public signup is intentionally activated.",
    expectation:
      "Standard public availability and public signup are not active until payment, policy, support, and app publishing readiness are confirmed.",
    ctaLabel: "Request Access",
    targetRoute: "/launch",
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
