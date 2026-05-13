"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock3, Lock, Radar, ShieldCheck } from "lucide-react";

import {
  buildFallbackRolloutSnapshot,
  type RolloutPhaseSnapshot,
  type RolloutSnapshot,
} from "@/config/rollout";

type RolloutCommandCenterProps = {
  onReserve?: () => void;
  compact?: boolean;
  showPublicLaunchCountdown?: boolean;
};

function splitTime(total: number) {
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function useRolloutSnapshot() {
  const [snapshot, setSnapshot] = useState<RolloutSnapshot | null>(null);
  const [now, setNow] = useState<number | null>(null);

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
          setNow(Date.now());
        }
      } catch {
        if (active) {
          setSnapshot(buildFallbackRolloutSnapshot());
          setNow(Date.now());
        }
      }
    };

    load();

    const clock = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    const refresh = window.setInterval(load, 30000);

    return () => {
      active = false;
      window.clearInterval(clock);
      window.clearInterval(refresh);
    };
  }, []);

  return { snapshot, now };
}

function CountdownDigits({
  targetAt,
  now,
}: {
  targetAt: string | null;
  now: number | null;
}) {
  const remaining = useMemo(() => {
    if (!targetAt || !now) return null;
    const target = Date.parse(targetAt);
    if (!Number.isFinite(target)) return null;
    return splitTime(Math.max(target - now, 0));
  }, [now, targetAt]);

  const items = remaining
    ? [
        ["Days", remaining.days],
        ["Hours", remaining.hours],
        ["Minutes", remaining.minutes],
        ["Seconds", remaining.seconds],
      ]
    : [
        ["Days", "--"],
        ["Hours", "--"],
        ["Minutes", "--"],
        ["Seconds", "--"],
      ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex h-[74px] flex-col items-center justify-center rounded-xl border border-white/10 bg-black/30 text-center"
        >
          <motion.p
            key={`${label}-${value}`}
            initial={{ opacity: 0.65, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xl font-black text-sky-200 sm:text-3xl"
          >
            {typeof value === "number" ? String(value).padStart(2, "0") : value}
          </motion.p>
          <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-500">
            {label}
          </p>
        </div>
      ))}
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
  const { snapshot, now } = useRolloutSnapshot();
  const fallback = useMemo(() => buildFallbackRolloutSnapshot(), []);
  const current = snapshot ?? fallback;
  const activePhase = current.activePhase;
  const visiblePhases = compact ? current.phases.slice(0, 3) : current.phases;
  const publicLaunchPhase = current.phases.find(
    (phase) => phase.key === "GENERAL_AVAILABILITY",
  );

  const cta = activePhase.isAcceptingReservations ? (
    <button
      type="button"
      onClick={onReserve}
      className="w-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_32px_rgba(239,68,68,0.34)] transition hover:scale-[1.01] sm:w-auto"
    >
      {activePhase.ctaLabel}
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
            <CountdownDigits targetAt={activePhase.targetAt} now={now} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm font-black uppercase tracking-[0.1em] text-sky-200">
                <SlotText phase={activePhase} />
              </p>
              {cta}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {visiblePhases.map((phase) => (
            <AvailabilityCard key={phase.key} phase={phase} />
          ))}
        </div>

        {showPublicLaunchCountdown && publicLaunchPhase?.startsAt ? (
          <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
            <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
                  Final Public Launch
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-0.035em] text-white">
                  App live to public at 90 days from Phase 3 launch.
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Target: November 24, 2026 at 08:00 MST.
                </p>
              </div>
              <CountdownDigits targetAt={publicLaunchPhase.startsAt} now={now} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
