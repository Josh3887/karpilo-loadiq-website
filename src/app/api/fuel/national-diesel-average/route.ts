import { NextResponse } from "next/server";

type DieselAverageResponse = {
  price: number | null;
  unit: "USD/gal";
  reportedAt: string | null;
  source: "EIA.gov";
  status: "ok" | "unavailable";
};

type EiaDieselRow = {
  period?: string;
  value?: number | string;
};

type EiaDieselResponse = {
  response?: {
    data?: EiaDieselRow[];
  };
};

const EIA_ULSD_PATH =
  "/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&facets[product][]=EPD2DXL0&facets[duoarea][]=NUS&facets[series][]=EMD_EPD2DXL0_PTE_NUS_DPG&facets[process][]=PTE&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000";

const unavailableResponse: DieselAverageResponse = {
  price: null,
  unit: "USD/gal",
  reportedAt: null,
  source: "EIA.gov",
  status: "unavailable",
};

function logEiaFailure(message: string) {
  console.error("WEBSITE_EIA_DIESEL_FETCH_ERROR:", message);
}

function latestDieselRow(data: EiaDieselRow[] | undefined) {
  return [...(data ?? [])]
    .filter((row) => row.period)
    .sort((a, b) => String(b.period).localeCompare(String(a.period)))[0];
}

function normalizeDieselAverage(row: EiaDieselRow | undefined): DieselAverageResponse {
  if (!row) {
    return unavailableResponse;
  }

  const price = Number(row.value);

  if (!Number.isFinite(price) || price <= 0 || !row.period) {
    return unavailableResponse;
  }

  return {
    price: Number(price.toFixed(3)),
    unit: "USD/gal",
    reportedAt: row.period,
    source: "EIA.gov",
    status: "ok",
  };
}

export async function GET() {
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    logEiaFailure("EIA_API_KEY is not configured.");

    return NextResponse.json(unavailableResponse, {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
      },
    });
  }

  try {
    const baseUrl = process.env.EIA_BASE_URL ?? "https://api.eia.gov/v2";
    const endpoint = new URL(`${baseUrl}${EIA_ULSD_PATH}`);
    endpoint.searchParams.set("api_key", apiKey);

    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    if (!response.ok) {
      logEiaFailure(`EIA returned HTTP ${response.status}.`);

      return NextResponse.json(unavailableResponse, {
        headers: {
          "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
        },
      });
    }

    const payload = (await response.json()) as EiaDieselResponse;
    const latest = latestDieselRow(payload.response?.data);
    const normalized = normalizeDieselAverage(latest);

    if (normalized.status === "unavailable") {
      logEiaFailure("EIA response did not include a usable latest diesel row.");
    }

    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    logEiaFailure(
      error instanceof Error ? error.message : "Unknown EIA request failure."
    );

    return NextResponse.json(unavailableResponse, {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
      },
    });
  }
}
