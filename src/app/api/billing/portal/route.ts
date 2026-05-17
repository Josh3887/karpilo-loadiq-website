import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";

const PORTAL_UNAVAILABLE_MESSAGE =
  "Subscription management is temporarily unavailable. Please contact support.";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("provider_customer_id")
    .eq("user_id", user.id)
    .eq("provider", "stripe")
    .not("provider_customer_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError || !subscription?.provider_customer_id) {
    return NextResponse.json(
      { error: PORTAL_UNAVAILABLE_MESSAGE },
      { status: 404 },
    );
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: PORTAL_UNAVAILABLE_MESSAGE },
      { status: 503 },
    );
  }

  const origin = new URL(request.url).origin;
  const body = new URLSearchParams({
    customer: String(subscription.provider_customer_id),
    return_url: `${origin}/billing`,
  });

  try {
    const response = await fetch(
      "https://api.stripe.com/v1/billing_portal/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    const data = (await response.json().catch(() => ({}))) as {
      url?: string;
    };

    if (!response.ok || !data.url) {
      return NextResponse.json(
        { error: PORTAL_UNAVAILABLE_MESSAGE },
        { status: 503 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch {
    return NextResponse.json(
      { error: PORTAL_UNAVAILABLE_MESSAGE },
      { status: 503 },
    );
  }
}
