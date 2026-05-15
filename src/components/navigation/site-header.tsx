"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import {
  LOADIQ_BRAND,
  LOADIQ_NAVIGATION_LINKS,
  LOADIQ_ROUTES,
  LOADIQ_URLS,
} from "@/config/loadiq";

const mobileNavigationLinks = [
  { label: "Home", href: LOADIQ_ROUTES.home },
  { label: "Open App", href: `${LOADIQ_URLS.app}/dashboard` },
  ...LOADIQ_NAVIGATION_LINKS,
  { label: "Contact", href: LOADIQ_ROUTES.contact },
  { label: "Legal", href: LOADIQ_ROUTES.legal },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        <Link href={LOADIQ_ROUTES.home} className="flex items-center gap-4" onClick={() => setOpen(false)}>
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0B1120] shadow-[0_0_28px_rgba(239,68,68,0.18)]">
            <Image
              src={LOADIQ_BRAND.appIcon}
              alt={LOADIQ_BRAND.productName}
              fill
              priority
              sizes="48px"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-100">
              Karpilo
            </p>

            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              {LOADIQ_BRAND.shortName} ({LOADIQ_BRAND.productMark})
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LOADIQ_NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-sky-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href={`${LOADIQ_URLS.app}/dashboard`}
            className="rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/20"
          >
            Open App
          </Link>
          <Link
            href={LOADIQ_ROUTES.pilotProgram}
            className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20"
          >
            Pilot Access
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav
        aria-label="Primary mobile feature navigation"
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-t border-white/10 px-6 pb-4 sm:px-8 lg:hidden"
      >
        {LOADIQ_NAVIGATION_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-slate-200 transition hover:border-sky-300/35 hover:text-sky-200"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={`${LOADIQ_URLS.app}/dashboard`}
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-full border border-sky-400/35 bg-sky-400/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-sky-100 transition hover:bg-sky-400/20"
        >
          Open App
        </Link>
        <Link
          href={LOADIQ_ROUTES.pilotProgram}
          onClick={() => setOpen(false)}
          className="shrink-0 rounded-full border border-red-400/35 bg-red-500/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-red-100 transition hover:bg-red-500/20"
        >
          Pilot Access
        </Link>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#020617]/98 px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {mobileNavigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
