"use client";

import { useSyncExternalStore } from "react";
import { X } from "lucide-react";

import { DEVELOPMENT_READINESS_NOTICE } from "@/config/rollout";

const STORAGE_KEY = "karpilo_loadiq_development_notice_dismissed";
const STORAGE_EVENT = "karpilo-loadiq-development-notice";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
      ? "dismissed"
      : "visible";
  } catch {
    return "dismissed";
  }
}

function getServerSnapshot() {
  return "dismissed";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

export function DevelopmentNoticePopup() {
  const noticeState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Non-blocking notice; navigation should continue even if storage is unavailable.
    }
  };

  if (noticeState !== "visible") return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[70] px-4 sm:bottom-6">
      <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-sky-300/25 bg-[#07101E]/95 p-5 text-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">
              Development Notice
            </p>
            <h2 className="mt-2 text-xl font-black tracking-[-0.035em] text-white">
              Karpilo LoadIQ is being refined for publication.
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-300/35 hover:text-sky-100"
            aria-label="Dismiss development notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Due to accelerated development, added features, technical limitations,
          procedural requirements, and publishing readiness work, the site may
          rapidly change between now and launch as Karpilo LoadIQ refines the
          application for publication. Some milestones may shift while final
          systems, legal policies, payment flows, and app publishing requirements
          are completed.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {DEVELOPMENT_READINESS_NOTICE.paymentNote}
        </p>
      </div>
    </div>
  );
}
