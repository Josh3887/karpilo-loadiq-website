import { NextResponse } from "next/server";

import { LOADIQ_CONTACT } from "@/config/loadiq";
import { sendAuditedEmail } from "@/lib/email-audit";
import { getSupabaseServer } from "@/lib/supabase-server";

const notifyEmail =
  process.env.NEWSLETTER_EMAIL || LOADIQ_CONTACT.newsletterEmail;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const company = String(body.company || "").trim();
    const source = String(body.source || "website").trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 },
      );
    }

    const supabaseServer = getSupabaseServer();
    const { data: subscriber, error } = await supabaseServer
      .from("newsletter_subscribers")
      .insert({
        email,
        name: name || null,
        company: company || null,
        source,
        status: "subscribed",
        consented_at: new Date().toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      console.error("NEWSLETTER_SUBSCRIBER_UPSERT_ERROR:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save subscription." },
        { status: 500 },
      );
    }

    try {
      await sendAuditedEmail({
        channelKey: "newsletter",
        messageType: "newsletter_signup_notification",
        to: notifyEmail,
        replyTo: email,
        subject: "New Karpilo LoadIQ Newsletter Signup",
        text: `
New Karpilo LoadIQ newsletter signup:

Email: ${email}
Name: ${name || "Not provided"}
Company: ${company || "Not provided"}
Source: ${source}
        `.trim(),
        relatedTable: "newsletter_subscribers",
        relatedId: subscriber?.id,
        metadata: {
          subscriber_email: email,
          source,
        },
      });
    } catch (emailError) {
      console.error("NEWSLETTER_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NEWSLETTER_ROUTE_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process subscription." },
      { status: 500 },
    );
  }
}
