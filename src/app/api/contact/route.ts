import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { LOADIQ_CONTACT } from "@/config/loadiq";
import { sendAuditedEmail } from "@/lib/email-audit";

const allowedIntakeTypes = [
  "support",
  "feedback",
  "pilot_inquiry",
  "launch_inquiry",
  "bug_report",
] as const;

type IntakeType = (typeof allowedIntakeTypes)[number];

function normalizeIntakeType(value: unknown): IntakeType {
  return allowedIntakeTypes.includes(value as IntakeType)
    ? (value as IntakeType)
    : "launch_inquiry";
}

function contactInquiryTypeFor(intakeType: IntakeType) {
  if (intakeType === "feedback") return "feedback";
  if (intakeType === "bug_report") return "app_issue";
  return "support";
}

function destinationEmailFor(intakeType: IntakeType) {
  if (intakeType === "feedback") return LOADIQ_CONTACT.featureRequestEmail;
  if (intakeType === "pilot_inquiry" || intakeType === "launch_inquiry") {
    return LOADIQ_CONTACT.updatesEmail;
  }
  return LOADIQ_CONTACT.supportEmail;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const role = String(body.role || "").trim();
    const message = String(body.message || "").trim();
    const source = String(body.source || "contact-page").trim();
    const intakeType = normalizeIntakeType(body.intake_type);
    const destinationEmail = destinationEmailFor(intakeType);
    const contactRequestType = contactInquiryTypeFor(intakeType);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { error: intakeError } = await supabaseServer.from("support_intake").insert({
      intake_type: intakeType,
      name,
      email,
      role,
      message,
      source,
      status: "new",
      metadata: {
        legacy_contact_source: source,
      },
    });

    if (intakeError) {
      console.error("SUPPORT_INTAKE_INSERT_ERROR:", intakeError);
    }

    const { data: contactInquiry, error } = await supabaseServer
      .from("contact_inquiries")
      .insert({
        name,
        email,
        role,
        message,
        source,
        request_type: contactRequestType,
        destination_email: destinationEmail,
        priority: intakeType === "bug_report" ? "high" : "normal",
        metadata: {
          intake_type: intakeType,
        },
      })
      .select("id")
      .single();

    if (error && intakeError) {
      console.error("CONTACT_INSERT_ERROR:", error);

      return NextResponse.json(
        { success: false, error: "Failed to save inquiry." },
        { status: 500 }
      );
    }

    try {
      await sendAuditedEmail({
        channelKey:
          intakeType === "feedback"
            ? "feature_requests"
            : intakeType === "pilot_inquiry" || intakeType === "launch_inquiry"
              ? "updates"
              : "support",
        messageType: "contact_inquiry_notification",
        to: process.env.LOADIQ_NOTIFY_EMAIL || destinationEmail,
        replyTo: email,
        subject: "New Karpilo LoadIQ Contact Inquiry",
        text: `
New Karpilo LoadIQ contact inquiry:

Name: ${name}
Email: ${email}
Role / Fleet Size: ${role || "Not provided"}
Intake Type: ${intakeType}
Source: ${source}

Message:
${message}
        `.trim(),
        relatedTable: "contact_inquiries",
        relatedId: contactInquiry?.id,
        metadata: {
          intake_type: intakeType,
          source,
          destination_email: destinationEmail,
        },
      });
    } catch (emailError) {
      console.error("CONTACT_EMAIL_ERROR:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_ROUTE_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
