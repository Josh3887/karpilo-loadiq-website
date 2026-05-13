"use client";

import Image from "next/image";
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
            <div className="relative flex items-start gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src={store.icon}
                    alt="Karpilo LoadIQ app icon"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <Icon className="h-3.5 w-3.5 text-sky-300" />
                    Coming Soon
                  </p>
                  <p className="mt-1 truncate text-base font-black text-white">
                    {store.label}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-red-100">
                    {store.note}
                  </p>
                  <p className="text-xs leading-5 text-slate-500">
                    {store.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
