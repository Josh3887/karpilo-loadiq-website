"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

type NewsletterResponse = {
  success?: boolean;
  error?: string;
};

export function NewsletterSignup() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || "").trim().toLowerCase(),
      source: "site-footer",
    };

    if (!payload.email) {
      setStatus("error");
      setError("Email is required.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      const result = text ? (JSON.parse(text) as NewsletterResponse) : {};

      if (!response.ok || result.success !== true) {
        setStatus("error");
        setError(result.error || "Unable to subscribe.");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Unable to subscribe.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <label className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
        Launch Updates
      </label>
      <div className="mt-3 flex gap-2">
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Subscribe to launch updates"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {status === "success" ? (
        <p className="mt-3 text-xs font-bold text-sky-200">
          You are subscribed to Karpilo LoadIQ launch updates.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-xs font-bold text-red-300">{error}</p> : null}
    </form>
  );
}
