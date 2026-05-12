"use client";

import Link from "next/link";

import {
  ACTIVE_DATA_PROVIDERS,
  DATA_PROVIDER_DISCLOSURE,
} from "@/config/data-providers";
import { COMPANY_NAME, SUPPORT_EMAIL, legalNavigation } from "@/config/legal";
import { PRODUCT_DISCLAIMER_SNIPPET } from "@/config/product-features";

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    ...legalNavigation,
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
            {COMPANY_NAME}
          </p>

          <p className="mt-4 leading-7 text-slate-400">
            Transportation software, operational intelligence, and subscription
            SaaS infrastructure.
          </p>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            {PRODUCT_DISCLAIMER_SNIPPET}
          </p>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-300">
            LoadIQ • FleetOS • Intelligence Systems
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
            <p>{COMPANY_NAME}</p>

            <a
              href="https://www.karpiloendeavortechnologies.com"
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-sky-300"
            >
              www.karpiloendeavortechnologies.com
            </a>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="block break-all transition hover:text-red-300"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Data Sources
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              {DATA_PROVIDER_DISCLOSURE}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {ACTIVE_DATA_PROVIDERS.map((provider) => (
                <Link
                  key={provider.id}
                  href={provider.href ?? "#"}
                  target={provider.href ? "_blank" : undefined}
                  rel={provider.href ? "noreferrer" : undefined}
                  className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-100 transition hover:bg-sky-400/15"
                >
                  {provider.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>

          <p className="uppercase tracking-[0.18em]">
            Built from the road
          </p>
        </div>
      </div>
    </footer>
  );
}
