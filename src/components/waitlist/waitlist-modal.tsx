"use client";

import { useState } from "react";
import { X } from "lucide-react";

type WaitlistModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormStatus = "idle" | "loading" | "success" | "error";

type WaitlistResponse = {
  success?: boolean;
  error?: string;
  alreadyReserved?: boolean;
};

export default function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setStatus("loading");
    setError("");

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      company: String(formData.get("company") || "").trim(),
      fleet_size: String(formData.get("fleet_size") || "").trim(),
    };

    if (!payload.name || !payload.email) {
      setStatus("error");
      setError("Name and email are required.");
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let result: WaitlistResponse = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText) as WaitlistResponse;
        } catch {
          result = {};
        }
      }

      if (!response.ok) {
        setStatus("error");
        setError(result.error || "Unable to reserve your spot. Try again.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Unable to reserve your spot. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-red-500/30 bg-[#0B1120] p-6 shadow-[0_0_80px_rgba(239,68,68,0.22)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_34%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 text-slate-400 transition hover:text-white"
          aria-label="Close waitlist modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">
            Founding Operator Access
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
            Reserve Your Spot
          </h2>

          <p className="mt-3 leading-7 text-slate-300">
            First 25 qualified signups are marked for founding operator review.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="font-bold text-sky-200">
                Reservation received. You’re on the Karpilo LoadIQ founding
                access list.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-full border border-sky-300/30 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-sky-100 transition hover:bg-sky-400/10"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                name="name"
                placeholder="Name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />

              <input
                name="company"
                placeholder="Company / Carrier"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />

              <input
                name="fleet_size"
                placeholder="Fleet size / Role"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
              />

              {error && (
                <p className="text-sm font-bold text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_0_38px_rgba(239,68,68,0.42)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Reserving..."
                  : "Reserve Founding Access"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}