import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const fallback = await supabaseServer
      .from("system_health_notices")
      .select(
        "id,title,message,severity,status,starts_at,ends_at,resolved_at,created_at",
      )
      .eq("public_visible", true)
      .in("status", ["active", "scheduled", "resolved"])
      .order("starts_at", { ascending: false })
      .limit(20);

    return NextResponse.json(
      { notices: fallback.data ?? [] },
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
