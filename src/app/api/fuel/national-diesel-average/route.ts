import { NextResponse } from "next/server";

import { LOADIQ_URLS } from "@/config/loadiq";

type DieselAverageResponse = {
  price: number | null;
  unit: "USD/gal";
  reportedAt: string | null;
  source: "EIA.gov";
  status: "ok" | "unavailable";
};

const unavailableResponse: DieselAverageResponse = {
  price: null,
  unit: "USD/gal",
  reportedAt: null,
  source: "EIA.gov",
  status: "unavailable",
};

function normalizeDieselAverage(value: unknown): DieselAverageResponse {
  if (!value || typeof value !== "object") {
    return unavailableResponse;
  }

  const payload = value as Partial<DieselAverageResponse>;
  const price = Number(payload.price);

  if (
    payload.status !== "ok" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    return unavailableResponse;
  }

  return {
    price: Number(price.toFixed(3)),
    unit: "USD/gal",
    reportedAt:
      typeof payload.reportedAt === "string" ? payload.reportedAt : null,
    source: "EIA.gov",
    status: "ok",
  };
}

export async function GET() {
  try {
    const endpoint = new URL(
      "/api/fuel/national-diesel-average",
      LOADIQ_URLS.app
    );
    const response = await fetch(endpoint, {
      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      return NextResponse.json(unavailableResponse, {
        headers: {
          "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
        },
      });
    }

    const payload = await response.json();

    return NextResponse.json(normalizeDieselAverage(payload), {
      headers: {
        "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(unavailableResponse, {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
      },
    });
  }
}
