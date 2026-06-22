import { notFound } from "next/navigation";

import { SentryTestButton } from "@/components/observability/sentry-test-button";

export const metadata = {
  title: "Sentry Development Test | Karpilo LoadIQ Website",
};

export default function SentryTestPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#060B14] px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-3xl rounded-2xl border border-amber-400/20 bg-[#0B1220] p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">
          Development Only
        </p>
        <h1 className="mt-3 text-3xl font-black">Sentry test capture</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This route exists only in local development. It sends a synthetic
          exception without visitor, address, financial, billing, or signup
          payload data.
        </p>
        <div className="mt-6">
          <SentryTestButton feature="website" />
        </div>
      </section>
    </main>
  );
}
