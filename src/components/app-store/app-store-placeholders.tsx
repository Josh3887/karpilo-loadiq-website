"use client";

import { Play, Smartphone } from "lucide-react";

import { LOADIQ_APP_STORE_PLACEHOLDERS } from "@/config/loadiq";

export function AppStorePlaceholders() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LOADIQ_APP_STORE_PLACEHOLDERS.map((store) => {
        const Icon = store.id === "apple_app_store" ? Smartphone : Play;

        return (
          <div
            key={store.id}
            className="group relative min-h-20 overflow-hidden rounded-2xl border border-sky-300/20 bg-[#0B1120]/85 px-4 py-4 shadow-[0_0_28px_rgba(56,189,248,0.08)]"
            aria-label={`${store.label} ${store.note}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_92%_20%,rgba(239,68,68,0.12),transparent_30%)] opacity-80 transition group-hover:opacity-100" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Download
                  </p>
                  <p className="mt-1 truncate text-base font-black text-white">
                    {store.label}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-red-300/25 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-100">
                {store.note}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
