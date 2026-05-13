"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

type HealthNotice = {
  id: string;
  title: string;
  message: string;
  severity: "info" | "degraded" | "maintenance" | "incident";
  status: "active" | "scheduled" | "resolved";
};

type HealthResponse = {
  notices?: HealthNotice[];
};

export function SystemHealthBanner() {
  const [notice, setNotice] = useState<HealthNotice | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/system-health", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: HealthResponse | null) => {
        if (!active || !payload?.notices?.length) return;
        const activeNotice =
          payload.notices.find((item) => item.status === "active") ||
          payload.notices.find((item) => item.status === "scheduled") ||
          null;
        setNotice(activeNotice);
      })
      .catch(() => {
        if (active) setNotice(null);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!notice) return null;

  const Icon =
    notice.severity === "maintenance"
      ? Wrench
      : notice.severity === "info"
        ? CheckCircle2
        : AlertTriangle;

  return (
    <div className="fixed inset-x-0 top-0 z-[90] border-b border-sky-300/20 bg-[#08111F]/95 px-4 py-3 text-slate-100 shadow-[0_0_42px_rgba(56,189,248,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">
              {notice.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{notice.message}</p>
          </div>
        </div>
        <Link
          href="/status"
          className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-red-200 transition hover:text-red-100"
        >
          View Status
        </Link>
      </div>
    </div>
  );
}
