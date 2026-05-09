"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Truck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
            <MessageSquare className="h-4 w-4" />
            Contact Karpilo LoadIQ
          </div>

          <h1 className="mt-7 text-5xl font-black tracking-[-0.06em] sm:text-6xl">
            Built for operators who want better freight math.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Reach out for founding operator access, early release updates,
            partnership interest, fleet feedback, or launch questions.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5">
              <Truck className="h-6 w-6 text-sky-300" />

              <div>
                <p className="font-semibold text-white">
                  Karpilo Endeavor Technologies LLC
                </p>

                <a
                  href="https://www.karpiloendeavortechnologies.com"
                  className="text-slate-300 transition hover:text-sky-300"
                >
                  www.karpiloendeavortechnologies.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5">
              <Mail className="h-6 w-6 text-red-300" />

              <div>
                <p className="font-semibold text-white">
                  Launch & Operator Contact
                </p>

                <a
                  href="mailto:karpiloloadiq@karpiloendeavortechnologies.com"
                  className="break-all text-slate-300 transition hover:text-red-300"
                >
                  karpiloloadiq@karpiloendeavortechnologies.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-[2rem] border border-red-500/30 bg-[#0B1120]/90 p-6 shadow-[0_0_60px_rgba(239,68,68,0.14)] sm:p-8"
        >
          <h2 className="text-3xl font-black tracking-[-0.04em]">
            Launch Inquiry
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            This form is ready for wiring to email, Supabase, or a waitlist
            table.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Role / Fleet Size
              </label>
              <input
                type="text"
                placeholder="Owner-operator, dispatcher, 1 truck, 5 trucks..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Message
              </label>
              <textarea
                placeholder="Tell us what you want LoadIQ to help you calculate."
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />
            </div>

            <button
              type="button"
              className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.01]"
            >
              Submit Inquiry
              <Send className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}