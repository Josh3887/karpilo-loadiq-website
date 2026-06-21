"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Clock3, Lock, Radar, ShieldCheck } from "lucide-react";

import {
  buildFallbackRolloutSnapshot,
  DEVELOPMENT_READINESS_NOTICE,
  type RolloutPhaseSnapshot,
  type RolloutSnapshot,
} from "@/config/rollout";

type RolloutCommandCenterProps = {
  onReserve?: () => void;
  compact?: boolean;
  showPublicLaunchCountdown?: boolean;
};

function useRolloutSnapshot() {
  const [snapshot, setSnapshot] = useState<RolloutSnapshot | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/rollout-state", {
          headers: {
            Accept: "application/json",
          },
        });
        const payload = response.ok
          ? ((await response.json()) as RolloutSnapshot)
          : buildFallbackRolloutSnapshot();

        if (active) {
          setSnapshot(payload);
        }
      } catch {
        if (active) {
          setSnapshot(buildFallbackRolloutSnapshot());
        }
      }
    };

    load();

    const refresh = window.setInterval(load, 30000);

    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);

  return { snapshot };
}

function ReadinessTimingPanel() {
  return (
    <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-200">
        {DEVELOPMENT_READINESS_NOTICE.eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-black tracking-[-0.03em] text-white">
        Timing under readiness review
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {DEVELOPMENT_READINESS_NOTICE.message}
      </p>
    </div>
  );
}

function SlotText({ phase }: { phase: RolloutPhaseSnapshot }) {
  if (phase.status === "full") return <span>FULL</span>;
  if (phase.status === "paused") return <span>Paused</span>;
  if (phase.status === "closed" || phase.status === "complete") return <span>Closed</span>;
  if (phase.remainingSlots === null) return <span>Open timing controlled by rollout readiness</span>;
  if (phase.status === "upcoming") return <span>Opening Soon</span>;
  return (
    <span>
      {phase.remainingSlots} / {phase.capacity} Remaining
    </span>
  );
}

function AvailabilityCard({ phase }: { phase: RolloutPhaseSnapshot }) {
  const Icon =
    phase.status === "active"
      ? ShieldCheck
      : phase.status === "paused"
        ? AlertTriangle
        : phase.status === "full"
          ? Lock
          : Clock3;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            {phase.shortLabel}
          </p>
          <p className="mt-2 text-lg font-black tracking-[-0.03em] text-white">
            {phase.title}
          </p>
        </div>
        <Icon className="h-5 w-5 shrink-0 text-sky-300" />
      </div>
      <p className="mt-3 font-mono text-sm font-black uppercase tracking-[0.08em] text-sky-200">
        <SlotText phase={phase} />
      </p>
    </div>
  );
}

export function RolloutCommandCenter({
  onReserve,
  compact = false,
  showPublicLaunchCountdown = false,
}: RolloutCommandCenterProps) {
  const { snapshot } = useRolloutSnapshot();
  const fallback = useMemo(() => buildFallbackRolloutSnapshot(), []);
  const current = snapshot ?? fallback;
  const activePhase = current.activePhase;
  const visiblePhases = compact ? current.phases.slice(0, 3) : current.phases;
  const publicLaunchPhase = current.phases.find(
    (phase) => phase.key === "GENERAL_AVAILABILITY",
  );

  const cta = onReserve ? (
    <button
      type="button"
      onClick={onReserve}
      className="w-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_32px_rgba(239,68,68,0.34)] transition hover:scale-[1.01] sm:w-auto"
    >
      Request Access
    </button>
  ) : (
    <Link
      href={activePhase.targetRoute}
      className="w-full rounded-full border border-sky-300/25 bg-sky-400/10 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/15 sm:w-auto"
    >
      View Rollout Path
    </Link>
  );

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-sky-300/20 bg-[#0B1120]/85 p-5 shadow-[0_0_52px_rgba(56,189,248,0.14)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_88%_15%,rgba(239,68,68,0.14),transparent_28%)]" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200">
          <Radar className="h-4 w-4" />
          {activePhase.status === "paused" ? "Onboarding Paused" : activePhase.shortLabel}
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              {activePhase.title}
            </h2>
            <p className="mt-3 leading-7 text-slate-300">{activePhase.description}</p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-400">
              {activePhase.expectation}
            </p>
            {current.statusEvents.length ? (
              <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-200">
                  Operational Update
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {current.statusEvents[0].title}: {current.statusEvents[0].message}
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <ReadinessTimingPanel />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm font-black uppercase tracking-[0.1em] text-sky-200">
                <SlotText phase={activePhase} />
              </p>
              {cta}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {visiblePhases.map((phase) => (
            <AvailabilityCard key={phase.key} phase={phase} />
          ))}
        </div>

        {showPublicLaunchCountdown && publicLaunchPhase?.startsAt ? (
          <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
            <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
                  Final Public Launch Readiness
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-0.035em] text-white">
                  Public access opens after final launch gates clear.
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {DEVELOPMENT_READINESS_NOTICE.paymentNote}
                </p>
              </div>
              <ReadinessTimingPanel />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
