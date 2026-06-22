"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Gauge, ShieldCheck } from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import {
  BIGGEST_PROBLEM_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  FITCHECK_PREVIEW_DISCLAIMER,
  calculateFitCheckPreview,
  defaultFitCheckPreviewInput,
  formatCurrency,
  type FitCheckPreviewInput,
} from "@/lib/fitcheck";
import { LOADIQ_ROUTES, LOADIQ_URLS } from "@/config/loadiq";

export function FitCheckPreviewPage() {
  const [input, setInput] = useState<FitCheckPreviewInput>(
    defaultFitCheckPreviewInput
  );
  const result = useMemo(() => calculateFitCheckPreview(input), [input]);
  const targetPressure =
    input.targetOperatorIncome - result.monthlyAvailableBeforeOperator;

  function update<K extends keyof FitCheckPreviewInput>(
    key: K,
    value: FitCheckPreviewInput[K]
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateNumber<K extends keyof FitCheckPreviewInput>(
    key: K,
    value: string
  ) {
    const numeric = value === "" ? 0 : Number(value);
    update(
      key,
      (Number.isFinite(numeric) ? numeric : 0) as FitCheckPreviewInput[K]
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
              FitCheck Preview
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">
              A quick operator-income reality check.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              This public preview is intentionally simple. It gives a rough
              signal before the full app FitCheck is refined with saved profile
              values, detailed overhead, miles, rates, and tier guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={LOADIQ_URLS.appFitCheck}
                className="inline-flex items-center rounded-full border border-red-400/35 bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
              >
                Get Full FitCheck in App
                <ArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href={LOADIQ_ROUTES.demo}
                className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-sky-100"
              >
                Try Demo
              </Link>
            </div>
          </div>

          <section className="rounded-[1.75rem] border border-white/10 bg-[#0B1120]/90 p-5 shadow-[0_0_46px_rgba(56,189,248,0.12)]">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-3 text-sky-200">
                <Gauge className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  Quick FitCheck
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter rough numbers. Leave unknowns blank.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <SelectField
                label="Business type"
                value={input.businessType}
                options={BUSINESS_TYPE_OPTIONS.map(
                  (item) => [item.value, item.label] as [string, string]
                )}
                onChange={(value) => update("businessType", value)}
              />
              <NumberField
                label="Estimated monthly gross revenue"
                value={input.monthlyGrossRevenue}
                onChange={(value) => updateNumber("monthlyGrossRevenue", value)}
              />
              <NumberField
                label="Estimated monthly business overhead"
                value={input.monthlyBusinessOverhead}
                onChange={(value) =>
                  updateNumber("monthlyBusinessOverhead", value)
                }
              />
              <NumberField
                label="Target monthly operator income"
                value={input.targetOperatorIncome}
                onChange={(value) => updateNumber("targetOperatorIncome", value)}
              />
              <SelectField
                label="Biggest current problem"
                value={input.biggestCurrentProblem}
                options={[
                  ["", "Select a problem"],
                  ...BIGGEST_PROBLEM_OPTIONS.map(
                    (item) => [item, item] as [string, string]
                  ),
                ]}
                onChange={(value) => update("biggestCurrentProblem", value)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-400/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                Preview signal
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {result.fitPreviewStatus}
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                <PreviewRow
                  label="Estimated available before operator income"
                  value={formatCurrency(result.monthlyAvailableBeforeOperator)}
                />
                <PreviewRow
                  label="Target operator income pressure"
                  value={
                    targetPressure > 0
                      ? `${formatCurrency(targetPressure)} potential gap`
                      : `${formatCurrency(Math.abs(targetPressure))} potential cushion`
                  }
                />
                <PreviewRow
                  label="Primary stated problem"
                  value={input.biggestCurrentProblem || "Not selected"}
                />
              </div>
            </div>
          </section>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "Full app FitCheck",
                "Uses saved profile defaults, detailed overhead, miles, rates, lane behavior, and operator-income goals.",
              ],
              [
                "Tier guidance later",
                "The app version can recommend the lowest responsible tier after enough operational detail exists.",
              ],
              [
                "No guarantees",
                "This preview is scenario-based decision support, not a promise of income, profit, freight, or rate improvement.",
              ],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-white/10 bg-[#0B1120]/80 p-5"
              >
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-red-400/20 bg-red-500/10 p-5 text-sm leading-7 text-red-100">
            <ShieldCheck className="mb-3 h-5 w-5" aria-hidden="true" />
            {FITCHECK_PREVIEW_DISCLAIMER}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-300/50"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue} className="bg-[#0B1120]">
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
      <input
        type="number"
        min={0}
        step="0.01"
        value={value || ""}
        placeholder="Estimate"
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-300/50"
      />
    </label>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
      <span className="text-slate-400">{label}</span>
      <strong className="text-right text-white">{value}</strong>
    </div>
  );
}
