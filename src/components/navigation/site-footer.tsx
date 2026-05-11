"use client";

import Link from "next/link";

import { PRODUCT_DISCLAIMER_SNIPPET } from "@/config/product-features";

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Copyright", href: "/copyright" },
    { label: "Notice", href: "/notice" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="relative z-40 border-t border-white/10 bg-[#020617]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.08),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(239,68,68,0.08),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-black tracking-[-0.03em] text-white">
            Karpilo LoadIQ
          </p>

          <p className="mt-4 leading-7 text-slate-400">
            Built by the mile from the road.
          </p>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            {PRODUCT_DISCLAIMER_SNIPPET}
          </p>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-300">
            Deadhead • Margin • Profitability
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
            Navigation
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 transition hover:text-sky-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
            Legal
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 transition hover:text-sky-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
            Company
          </p>

          <div className="mt-5 space-y-3 text-slate-400">
            <p>Karpilo Endeavor Technologies LLC</p>

            <a
              href="https://www.karpiloendeavortechnologies.com"
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-sky-300"
            >
              www.karpiloendeavortechnologies.com
            </a>

            <a
              href="mailto:karpiloloadiq@karpiloendeavortechnologies.com"
              className="block break-all transition hover:text-red-300"
            >
              karpiloloadiq@karpiloendeavortechnologies.com
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} Karpilo LoadIQ. All rights reserved.
          </p>

          <p className="uppercase tracking-[0.18em]">
            Built from the road
          </p>
        </div>
      </div>
    </footer>
  );
}
