"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Truck } from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import {
  LOADIQ_BRAND,
  LOADIQ_CONTACT_CHANNELS,
  LOADIQ_URLS,
} from "@/config/loadiq";

type FormStatus = "idle" | "loading" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const intakeTypeOptions = [
  { value: "support", label: "Support" },
  { value: "feedback", label: "Feedback" },
  { value: "pilot_inquiry", label: "Pilot inquiry" },
  { value: "launch_inquiry", label: "Launch inquiry" },
  { value: "bug_report", label: "Bug report" },
] as const;

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      role: String(formData.get("role") || "").trim(),
      intake_type: String(formData.get("intake_type") || "launch_inquiry").trim(),
      message: String(formData.get("message") || "").trim(),
      source: "contact-page",
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setError("Name, email, and message are required.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok || result.success !== true) {
        setStatus("error");
        setError(result.error || "Unable to submit inquiry. Try again.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Unable to submit inquiry. Try again.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <SiteHeader />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <UniversalBackButton />
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
                  {LOADIQ_BRAND.companyName}
                </p>
                <a
                  href={LOADIQ_URLS.companyWebsite}
                  className="text-slate-300 transition hover:text-sky-300"
                >
                  {new URL(LOADIQ_URLS.companyWebsite).hostname}
                </a>
              </div>
            </div>

            {LOADIQ_CONTACT_CHANNELS.map((channel) => {
              const Icon = channel.id === "feature-requests" ? MessageSquare : Mail;

              return (
                <div
                  key={channel.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0B1120]/80 p-5"
                >
                  <Icon className="h-6 w-6 text-red-300" />
                  <div>
                    <p className="font-semibold text-white">{channel.label}</p>
                    {channel.monitored ? (
                      <a
                        href={`mailto:${channel.email}`}
                        className="break-all text-slate-300 transition hover:text-red-300"
                      >
                        {channel.email}
                      </a>
                    ) : (
                      <p className="break-all text-slate-300">{channel.email}</p>
                    )}
                    <p className="mt-1 text-sm text-slate-500">
                      {channel.description}
                    </p>
                  </div>
                </div>
              );
            })}
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
            Send a launch question, fleet feedback, partnership inquiry, or
            early access request.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="font-bold text-sky-200">
                Inquiry received. Karpilo LoadIQ has your message.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Name
                </label>
                <input
                  name="name"
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
                  name="email"
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
                  name="role"
                  type="text"
                  placeholder="Owner-operator, dispatcher, 1 truck, 5 trucks..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Inquiry Type
                </label>
                <select
                  name="intake_type"
                  defaultValue="launch_inquiry"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-sky-300/50"
                >
                  {intakeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#0B1120]">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us what you want Karpilo LoadIQ to help you calculate."
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Submit Inquiry"}
                <Send className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
