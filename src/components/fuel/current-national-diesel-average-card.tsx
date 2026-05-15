"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Fuel, RadioTower } from "lucide-react";

type DieselAverageResponse = {
  price: number | null;
  unit: "USD/gal";
  reportedAt: string | null;
  source: "EIA.gov";
  status: "ok" | "unavailable";
};

const unavailableAverage: DieselAverageResponse = {
  price: null,
  unit: "USD/gal",
  reportedAt: null,
  source: "EIA.gov",
  status: "unavailable",
};

function formatPrice(price: number | null) {
  if (price === null) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(price);
}

function formatReportedAt(value: string | null) {
  if (!value) return null;

  const parsed = Date.parse(value);

  if (Number.isFinite(parsed)) {
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(parsed));
  }

  return value;
}

export function CurrentNationalDieselAverageCard() {
  const [average, setAverage] =
    useState<DieselAverageResponse>(unavailableAverage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadAverage() {
      try {
        const response = await fetch("/api/fuel/national-diesel-average", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Diesel average unavailable.");
        }

        const payload = (await response.json()) as DieselAverageResponse;

        if (active) {
          setAverage(payload);
        }
      } catch {
        if (active) {
          setAverage(unavailableAverage);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAverage();

    return () => {
      active = false;
    };
  }, []);

  const price = useMemo(() => formatPrice(average.price), [average.price]);
  const reportedAt = useMemo(
    () => formatReportedAt(average.reportedAt),
    [average.reportedAt]
  );
  const available = average.status === "ok" && Boolean(price);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-4 sm:px-8">
      <div className="grid gap-4 rounded-[1.5rem] border border-sky-300/20 bg-[#08111F]/92 p-5 shadow-[0_0_46px_rgba(56,189,248,0.12)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
              available
                ? "border-sky-300/25 bg-sky-400/10 text-sky-200"
                : "border-red-400/30 bg-red-500/10 text-red-200"
            }`}
          >
            {available ? (
              <Fuel className="h-6 w-6" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              Current National Diesel Average
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-white">
              {loading
                ? "Checking EIA telemetry..."
                : available
                  ? `${price} / gal`
                  : "Diesel average temporarily unavailable"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Latest EIA-reported weekly average
              {reportedAt ? ` · Reported: ${reportedAt}` : ""}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
            available
              ? "border-sky-300/25 bg-sky-400/10 text-sky-200"
              : "border-red-400/30 bg-red-500/10 text-red-200"
          }`}
        >
          <RadioTower className="h-4 w-4" aria-hidden="true" />
          Source: {average.source}
        </div>
      </div>
    </section>
  );
}
