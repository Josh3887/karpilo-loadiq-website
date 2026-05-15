import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react";

import SiteFooter from "@/components/navigation/site-footer";
import SiteHeader from "@/components/navigation/site-header";
import { UniversalBackButton } from "@/components/navigation/universal-back-button";
import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Status | Karpilo LoadIQ",
  description:
    "Public Karpilo LoadIQ website health, maintenance notices, and resolved incident history.",
};

type HealthNotice = {
  id: string;
  title: string;
  message: string;
  severity: "info" | "degraded" | "maintenance" | "incident";
  status: "active" | "scheduled" | "resolved";
  starts_at: string | null;
  ends_at: string | null;
  resolved_at: string | null;
  created_at: string;
};

type AppHealthNoticeRow = {
  id: string;
  title: string | null;
  public_message: string | null;
  is_active?: boolean | null;
  created_at: string | null;
};

function mapAppHealthNotice(row: AppHealthNoticeRow): HealthNotice {
  const createdAt = row.created_at || new Date(0).toISOString();

  return {
    id: row.id,
    title: row.title || "System notice",
    message: row.public_message || "",
    severity: "info",
    status: row.is_active === false ? "resolved" : "active",
    starts_at: row.created_at,
    ends_at: null,
    resolved_at: null,
    created_at: createdAt,
  };
}

async function getHealthNotices() {
  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from("system_health_events")
    .select("id,title,message,severity,status,starts_at,ends_at,resolved_at,created_at")
    .eq("public_visible", true)
    .in("status", ["active", "scheduled", "resolved"])
    .order("starts_at", { ascending: false })
    .limit(50);

  if (!error) return (data ?? []) as HealthNotice[];

  const activeNoticeFallback = await supabaseServer
    .from("active_system_health_notices")
    .select("id,title,public_message,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!activeNoticeFallback.error) {
    return ((activeNoticeFallback.data ?? []) as AppHealthNoticeRow[]).map(
      mapAppHealthNotice,
    );
  }

  const fallback = await supabaseServer
    .from("system_health_notices")
    .select("id,title,public_message,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (fallback.error) {
    console.error("STATUS_PAGE_HEALTH_READ_ERROR:", fallback.error);
    return [];
  }

  return ((fallback.data ?? []) as AppHealthNoticeRow[]).map(mapAppHealthNotice);
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function NoticeCard({ notice }: { notice: HealthNotice }) {
  const Icon =
    notice.status === "resolved"
      ? CheckCircle2
      : notice.severity === "maintenance"
        ? Wrench
        : notice.status === "scheduled"
          ? Clock
          : AlertTriangle;

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-[#0B1120]/85 p-5 shadow-[0_0_34px_rgba(56,189,248,0.06)]">
      <div className="flex gap-4">
        <Icon className="mt-1 h-6 w-6 shrink-0 text-sky-300" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">
            {notice.status} / {notice.severity}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-white">
            {notice.title}
          </h2>
          <p className="mt-3 leading-7 text-slate-300">{notice.message}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Starts: {formatDate(notice.starts_at)}
          </p>
          {notice.status === "resolved" ? (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Resolved: {formatDate(notice.resolved_at)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function StatusPage() {
  const notices = await getHealthNotices();
  const active = notices.filter((notice) => notice.status === "active");
  const scheduled = notices.filter((notice) => notice.status === "scheduled");
  const resolved = notices.filter((notice) => notice.status === "resolved");

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <UniversalBackButton />
        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
          Operational Status
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
          Karpilo LoadIQ system health.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Public notices for website availability, planned maintenance, active
          incidents, and resolved operational events.
        </p>

        {notices.length === 0 ? (
          <div className="mt-10 rounded-[1.5rem] border border-sky-300/20 bg-sky-400/10 p-6">
            <CheckCircle2 className="h-7 w-7 text-sky-300" />
            <h2 className="mt-4 text-2xl font-black tracking-[-0.035em]">
              No public incidents are currently posted.
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              If Supabase status records are unavailable, this page fails closed
              without exposing private operational data.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8">
            {[
              ["Active", active],
              ["Scheduled", scheduled],
              ["Resolved", resolved],
            ].map(([label, items]) => (
              <section key={label as string}>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
                  {label as string}
                </h2>
                <div className="mt-4 grid gap-4">
                  {(items as HealthNotice[]).length ? (
                    (items as HealthNotice[]).map((notice) => (
                      <NoticeCard key={notice.id} notice={notice} />
                    ))
                  ) : (
                    <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">
                      No {String(label).toLowerCase()} notices.
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
