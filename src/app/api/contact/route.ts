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
    const role = String(body.role || "").trim();
    const message = String(body.message || "").trim();
    const source = String(body.source || "contact-page").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contact_inquiries").insert({
      name,
      email,
      role,
      message,
      source,
    });

    if (error) {
      console.error("CONTACT_INSERT_ERROR:", error);

      return NextResponse.json(
        { success: false, error: "Failed to save inquiry." },
        { status: 500 }
      );
    }

    resend.emails
      .send({
        from: "Karpilo LoadIQ <onboarding@karpiloendeavortechnologies.com>",
        to: notifyEmail,
        replyTo: email,
        subject: "New Karpilo LoadIQ Contact Inquiry",
        text: `
New Karpilo LoadIQ contact inquiry:

Name: ${name}
Email: ${email}
Role / Fleet Size: ${role || "Not provided"}
Source: ${source}

Message:
${message}
        `.trim(),
      })
      .catch((emailError) => {
        console.error("CONTACT_EMAIL_ERROR:", emailError);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_ROUTE_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process inquiry." },
      { status: 500 }
    );
  }
}