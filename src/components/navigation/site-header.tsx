"use client";

import Image from "next/image";
import Link from "next/link";

const APP_ICON = "/brand/karpilo-loadiq-icon.png";

export default function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0B1120] shadow-[0_0_28px_rgba(239,68,68,0.18)]">
            <Image
              src={APP_ICON}
              alt="Karpilo LoadIQ"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-sky-100">
              Karpilo
            </p>

            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
              LoadIQ (K-LIQ)
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-sky-300"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-sky-300"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-sky-300"
          >
            Contact
          </Link>

          <Link
            href="/legal"
            className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300 transition hover:text-sky-300"
          >
            Legal
          </Link>
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20 sm:inline-flex"
        >
          Reserve Access
        </Link>
      </div>
    </header>
  );
}
