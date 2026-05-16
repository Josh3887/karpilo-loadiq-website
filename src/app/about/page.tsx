"use client";

import Link from "next/link";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Fuel,
  Gauge,
  Route,
  ShieldCheck,
} from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { LOADIQ_BRAND } from "@/config/loadiq";

const BRAND_IMAGE = LOADIQ_BRAND.companyImage;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Route,
    title: "Deadhead Visibility",
    description: "Expose unpaid miles before they quietly destroy profitability.",
  },
  {
    icon: Fuel,
    title: "Fuel Exposure Intelligence",
    description: "Understand real operating pressure before accepting freight.",
  },
  {
    icon: Gauge,
    title: "Dispatch Decision Support",
    description: "Built for fast operational decisions under real trucking conditions.",
  },
  {
    icon: BarChart3,
    title: "Margin Clarity",
    description: "Turn gross revenue into true operational profitability visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Operational Discipline",
    description: "Built for carriers who run trucking like a business, not a gamble.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8">
        <UniversalBackButton />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="mt-8 grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-[#0B1120]/80 p-6 shadow-[0_0_60px_rgba(239,68,68,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_32%)]" />

              <div className="relative z-10 overflow-hidden rounded-[1.5rem]">
                <Image
                  src={BRAND_IMAGE}
                  alt={LOADIQ_BRAND.companyName}
                  width={1200}
                  height={900}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Built by {LOADIQ_BRAND.companyName}
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
              Operational software built from the road.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              Karpilo LoadIQ was built around the real operational pressure of
              trucking: deadhead, fuel volatility, maintenance exposure,
              overhead, dispatch timing, rate pressure, and thin margins.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This is not software built from a boardroom theory. It is designed
              around the actual economics and decision-making pressure
              owner-operators and carriers face every day on the road.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Karpilo LoadIQ helps operators determine whether a load is truly
              profitable before the truck moves by exposing operating cost,
              deadhead exposure, fuel pressure, margin compression, and real
              profitability visibility.
            </p>

            <Link
              href="/"
              className="group mt-10 inline-flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20"
            >
              Back to Karpilo LoadIQ

              <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-red-300">
            Core Principles
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Freight profitability with operational clarity.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-[#0B1120]/80 p-6 shadow-[0_0_34px_rgba(56,189,248,0.08)]"
              >
                <Icon className="mb-5 h-7 w-7 text-sky-300" />

                <h3 className="text-xl font-black tracking-[-0.03em] text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
