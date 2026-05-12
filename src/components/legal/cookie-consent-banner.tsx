"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "karpilo_cookie_consent_v1";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6">
      <section
        aria-label="Cookie consent"
        className="mx-auto max-w-5xl rounded-2xl border border-sky-300/25 bg-[#08111F]/95 p-4 text-slate-200 shadow-[0_0_48px_rgba(56,189,248,0.18)] backdrop-blur-xl sm:p-5"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              Cookie Notice
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We use essential cookies and local storage for sessions, security,
              fraud prevention, consent preferences, and site performance. Future
              analytics or payment flows may use provider cookies.{" "}
              <Link
                href="/legal/cookies"
                className="font-bold text-sky-200 underline decoration-sky-400/40 underline-offset-4"
              >
                Review the Cookie Policy
              </Link>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_28px_rgba(239,68,68,0.32)] transition hover:scale-[1.02]"
          >
            Accept
          </button>
        </div>
      </section>
    </div>
  );
}
