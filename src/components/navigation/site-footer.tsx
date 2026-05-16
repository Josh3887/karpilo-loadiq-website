"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ACTIVE_DATA_PROVIDERS,
  DATA_PROVIDER_DISCLOSURE,
} from "@/config/data-providers";
import {
  LOADIQ_BRAND,
  LOADIQ_CONTACT_CHANNELS,
  LOADIQ_FOOTER_LINKS,
  LOADIQ_URLS,
} from "@/config/loadiq";
import { PRODUCT_DISCLAIMER_SNIPPET } from "@/config/product-features";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

const footerLinks = {
  ...LOADIQ_FOOTER_LINKS,
  external: [
    ...LOADIQ_CONTACT_CHANNELS.map((channel) => ({
      label: channel.label,
      href: channel.monitored ? `mailto:${channel.email}` : "#",
      detail: channel.email,
      description: channel.description,
      disabled: !channel.monitored,
    })),
    {
      label: "Website",
      href: LOADIQ_URLS.companyWebsite,
      external: true,
    },
    { label: "Facebook", href: LOADIQ_URLS.facebook, external: true },
  ],
};

const legalPrimaryLinks = footerLinks.legal.slice(0, 4);
const legalPolicyLinks = footerLinks.legal.slice(4);
const supportContactLinks = footerLinks.external.slice(0, 4);
const updateContactLinks = footerLinks.external.slice(4);

export default function SiteFooter() {
  return (
    <footer className="relative z-40 border-t border-white/10 bg-[#020617]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.08),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(239,68,68,0.08),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.15fr)]">
        <div>
          <Link href="/" className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-red-500/30 bg-[#0B1120] shadow-[0_0_24px_rgba(239,68,68,0.18)]">
              <Image
                src={LOADIQ_BRAND.appIcon}
                alt={LOADIQ_BRAND.productName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-black tracking-[-0.03em] text-white">
                {LOADIQ_BRAND.shortName}
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                {LOADIQ_BRAND.companyName}
              </p>
            </div>
          </Link>

          <p className="mt-4 leading-7 text-slate-400">
            Freight profitability intelligence for owner-operators, independent carriers, and small fleets.
          </p>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            {PRODUCT_DISCLAIMER_SNIPPET}
          </p>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-300">
            LoadIQ • FleetOS • Intelligence Systems
          </p>

          <div className="mt-6">
            <NewsletterSignup />
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Platform
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.platform.map((link) => (
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

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.company.map((link) => (
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
              {legalPrimaryLinks.map((link) => (
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
              Policies
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {legalPolicyLinks.map((link) => (
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

          <div className="sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Support
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {supportContactLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={"external" in link && link.external ? "_blank" : undefined}
                  rel={"external" in link && link.external ? "noreferrer" : undefined}
                  aria-disabled={"disabled" in link ? link.disabled : undefined}
                  className="text-slate-400 transition hover:text-red-300"
                >
                  <span className="block font-semibold text-slate-300">{link.label}</span>
                  {"detail" in link ? (
                    <span className="block break-all text-sm text-slate-500">{link.detail}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 xl:col-span-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
              Updates / Channels
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {updateContactLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={"external" in link && link.external ? "_blank" : undefined}
                  rel={"external" in link && link.external ? "noreferrer" : undefined}
                  aria-disabled={"disabled" in link ? link.disabled : undefined}
                  className="text-slate-400 transition hover:text-red-300"
                >
                  <span className="block font-semibold text-slate-300">{link.label}</span>
                  {"detail" in link ? (
                    <span className="block break-all text-sm text-slate-500">{link.detail}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
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
            © {new Date().getFullYear()} {LOADIQ_BRAND.companyName}. All rights reserved.
          </p>

          <p className="uppercase tracking-[0.18em]">
            Built from the road
          </p>
        </div>
      </div>
    </footer>
  );
}
