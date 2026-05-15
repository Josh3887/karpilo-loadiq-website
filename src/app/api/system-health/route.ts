import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type AppHealthNoticeRow = {
  id: string;
  title: string | null;
  public_message: string | null;
  is_active?: boolean | null;
  created_at: string | null;
};

function mapAppHealthNotice(row: AppHealthNoticeRow) {
  return {
    id: row.id,
    title: row.title || "System notice",
    message: row.public_message || "",
    severity: "info",
    status: row.is_active === false ? "resolved" : "active",
    starts_at: row.created_at,
    ends_at: null,
    resolved_at: null,
    created_at: row.created_at,
  };
}

export async function GET() {
  try {
    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("system_health_events")
      .select(
        "id,title,message,severity,status,starts_at,ends_at,resolved_at,created_at",
      )
      .eq("public_visible", true)
      .in("status", ["active", "scheduled", "resolved"])
      .order("starts_at", { ascending: false })
      .limit(20);

    if (!error) {
      return NextResponse.json(
        { notices: data ?? [] },
        {
          headers: {
            "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
          },
        },
      );
    }

    const activeNoticeFallback = await supabaseServer
      .from("active_system_health_notices")
      .select("id,title,public_message,created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!activeNoticeFallback.error) {
      return NextResponse.json(
        {
          notices: ((activeNoticeFallback.data ?? []) as AppHealthNoticeRow[]).map(
            mapAppHealthNotice,
          ),
        },
        {
          headers: {
            "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
          },
        },
      );
    }

    const fallback = await supabaseServer
      .from("system_health_notices")
      .select("id,title,public_message,is_active,created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json(
      {
        notices: ((fallback.data ?? []) as AppHealthNoticeRow[]).map(
          mapAppHealthNotice,
        ),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("SYSTEM_HEALTH_ROUTE_ERROR:", error);
    return NextResponse.json({ notices: [] });
  }
}
