import { NextResponse } from "next/server";
import { Resend } from "resend";

import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const notifyEmail =
  process.env.LOADIQ_NOTIFY_EMAIL ||
  "karpiloloadiq@karpiloendeavortechnologies.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const company = String(body.company || "").trim();
    const fleetSize = String(body.fleet_size || "").trim();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyReserved: true,
      });
    }

    const { error: dbError } = await supabase.from("waitlist").insert({
      name,
      email,
      company,
      fleet_size: fleetSize,
      founder_access: true,
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);

      return NextResponse.json(
        { error: "Failed to save reservation." },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: "Karpilo LoadIQ <onboarding@karpiloendeavortechnologies.com>",
        to: notifyEmail,
        subject: "New Karpilo LoadIQ Founding Operator Reservation",
        text: `
New founding operator reservation:

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Fleet Size / Role: ${fleetSize || "Not provided"}
Source: Website
        `.trim(),
      });
    } catch (emailError) {
      console.error("Email notification failed, but reservation was saved:", emailError);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Waitlist route error:", error);

    return NextResponse.json(
      { error: "Failed to process reservation." },
      { status: 500 }
    );
  }
}