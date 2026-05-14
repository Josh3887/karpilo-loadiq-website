import { NextResponse } from "next/server";

import {
  ROLLOUT_PHASES,
  buildFallbackRolloutSnapshot,
  type RolloutPhaseConfig,
  type RolloutPhaseKey,
  type RolloutPhaseSnapshot,
  type RolloutPhaseStatus,
  type RolloutSnapshot,
  type RolloutStatusEvent,
} from "@/config/rollout";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type RolloutPhaseRow = {
  phase_key: RolloutPhaseKey;
  title: string | null;
  short_label: string | null;
  capacity: number | null;
  reserved_slots: number | null;
  starts_at: string | null;
  ends_at: string | null;
  duration_days: number | null;
  status: RolloutPhaseStatus | null;
  accepting_reservations: boolean | null;
  description: string | null;
  expectation: string | null;
  cta_label: string | null;
  target_route: string | null;
};

type AppHealthNoticeRow = {
  id: string;
  title: string | null;
  public_message: string | null;
  is_active?: boolean | null;
};

function parseTime(value: string | null) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function phaseStatus(row: RolloutPhaseRow, now: number): RolloutPhaseStatus {
  if (row.status && ["paused", "full", "closed"].includes(row.status)) {
    return row.status;
  }

  const starts = parseTime(row.starts_at);
  const ends = parseTime(row.ends_at);

  if (starts && now < starts) return "upcoming";
  if (ends && now >= ends) return "complete";
  if (row.status === "upcoming") return "active";

  return row.status || "active";
}

function mergePhase(row: RolloutPhaseRow, fallback: RolloutPhaseConfig, now: number) {
  const capacity = row.capacity ?? fallback.capacity;
  const reservedSlots = row.reserved_slots ?? 0;
  const status = phaseStatus(row, now);
  const remainingSlots =
    capacity === null ? null : Math.max(capacity - reservedSlots, 0);

  const snapshot: RolloutPhaseSnapshot = {
    key: row.phase_key,
    title: row.title || fallback.title,
    shortLabel: row.short_label || fallback.shortLabel,
    capacity,
    durationDays: row.duration_days ?? fallback.durationDays,
    startsAt: row.starts_at || fallback.startsAt,
    endsAt: row.ends_at || fallback.endsAt,
    description: row.description || fallback.description,
    expectation: row.expectation || fallback.expectation,
    ctaLabel: row.cta_label || fallback.ctaLabel,
    targetRoute: row.target_route || fallback.targetRoute,
    status: remainingSlots === 0 && capacity !== null ? "full" : status,
    reservedSlots,
    remainingSlots,
    targetAt: status === "upcoming" ? row.starts_at || fallback.startsAt : row.ends_at || fallback.endsAt,
    isAcceptingReservations:
      Boolean(row.accepting_reservations) &&
      !["paused", "full", "closed", "complete"].includes(status) &&
      remainingSlots !== 0,
  };

  return snapshot;
}

async function getStatusEvents(): Promise<RolloutStatusEvent[]> {
  const { data, error } = await supabaseServer
    .from("system_health_events")
    .select("id,title,message,severity,status")
    .eq("public_visible", true)
    .in("status", ["active", "scheduled"])
    .order("starts_at", { ascending: false })
    .limit(5);

  if (!error && data) return data as RolloutStatusEvent[];

  const activeNoticeFallback = await supabaseServer
    .from("active_system_health_notices")
    .select("id,title,public_message")
    .limit(5);

  if (!activeNoticeFallback.error) {
    return ((activeNoticeFallback.data ?? []) as AppHealthNoticeRow[]).map(
      (notice) => ({
        id: notice.id,
        title: notice.title || "System notice",
        message: notice.public_message || "",
        severity: "info",
        status: "active",
      }),
    );
  }

  const fallback = await supabaseServer
    .from("system_health_notices")
    .select("id,title,public_message,is_active")
    .eq("is_active", true)
    .limit(5);

  if (fallback.error) return [];
  return ((fallback.data ?? []) as AppHealthNoticeRow[]).map((notice) => ({
    id: notice.id,
    title: notice.title || "System notice",
    message: notice.public_message || "",
    severity: "info",
    status: notice.is_active === false ? "resolved" : "active",
  }));
}

export async function GET() {
  const now = Date.now();

  try {
    const { data, error } = await supabaseServer
      .from("rollout_phases")
      .select(
        "phase_key,title,short_label,capacity,reserved_slots,starts_at,ends_at,duration_days,status,accepting_reservations,description,expectation,cta_label,target_route",
      )
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      const fallback = buildFallbackRolloutSnapshot(now);
      return NextResponse.json(fallback, {
        headers: {
          "Cache-Control": "public, max-age=20, stale-while-revalidate=60",
        },
      });
    }

    const rows = data as RolloutPhaseRow[];
    const phases = ROLLOUT_PHASES.map((fallback) => {
      const row = rows.find((candidate) => candidate.phase_key === fallback.key);
      return row
        ? mergePhase(row, fallback, now)
        : buildFallbackRolloutSnapshot(now).phases.find(
            (phase) => phase.key === fallback.key,
          )!;
    });

    const statusEvents = await getStatusEvents();
    const onboardingPaused = statusEvents.some((event) =>
      event.title.toLowerCase().includes("onboarding pause"),
    );

    const activePhase =
      phases.find((phase) => phase.status === "active" && phase.isAcceptingReservations) ||
      phases.find((phase) => phase.status === "active") ||
      phases.find((phase) => phase.status === "upcoming") ||
      phases[phases.length - 1];

    const snapshot: RolloutSnapshot = {
      generatedAt: new Date(now).toISOString(),
      activePhase: onboardingPaused
        ? {
            ...activePhase,
            status: "paused",
            isAcceptingReservations: false,
          }
        : activePhase,
      phases,
      statusEvents,
      source: "supabase",
    };

    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, max-age=20, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("ROLLOUT_STATE_ROUTE_ERROR:", error);
    return NextResponse.json(buildFallbackRolloutSnapshot(now));
  }
}
