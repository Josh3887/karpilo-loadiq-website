"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { LOADIQ_LAUNCH_KEYS } from "@/config/loadiq";

const STORAGE_KEY = LOADIQ_LAUNCH_KEYS.safetyAcknowledgmentStorageKey;

export function DriverSafetyAcknowledgment() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function acknowledge() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/78 px-4 py-6 backdrop-blur-md">
      <section
        aria-label="Hands-Free and Driver Safety Disclosure"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-red-500/35 bg-[#08111F]/98 p-5 text-slate-100 shadow-[0_0_90px_rgba(239,68,68,0.24)] sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(239,68,68,0.18),transparent_30%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/25 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
            <ShieldCheck className="h-4 w-4" />
            Driver Safety Required
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            Use Karpilo LoadIQ only when it is safe and hands-free.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
            <p>
              Karpilo LoadIQ is operational decision-support software. Do not
              use this website or app in a way that distracts you from driving,
              violates hands-free laws, or interferes with safe vehicle
              operation.
            </p>
            <p>
              Review freight numbers only when safely parked, or have another
              authorized person operate the device. You remain responsible for
              roadway safety, compliance, carrier policies, and independent
              operational judgment.
            </p>
          </div>
          <Link
            href="/legal/safety-disclosure"
            className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.14em] text-sky-300 transition hover:text-sky-200"
          >
            Review Safety Disclosure
          </Link>
          <button
            type="button"
            onClick={acknowledge}
            className="mt-7 w-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_0_38px_rgba(239,68,68,0.36)] transition hover:scale-[1.01]"
          >
            I Agree — I Will Use Karpilo LoadIQ Safely
          </button>
        </div>
      </section>
    </div>
  );
}
