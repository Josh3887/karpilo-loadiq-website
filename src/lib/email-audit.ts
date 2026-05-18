import { Resend } from "resend";

import { EMAIL_CHANNEL_ALIASES, EMAIL_IDENTITIES } from "@/config/email";
import { buildLoadiqEmailContent } from "@/lib/email-template";
import { getSupabaseServer } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

type AuditedEmailInput = {
  channelKey: string;
  messageType: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  relatedTable?: string;
  relatedId?: string | null;
  metadata?: Record<string, unknown>;
};

function normalizeRecipient(to: string | string[]) {
  return Array.isArray(to) ? to.join(", ") : to;
}

function formatSender(fromName: string, fromEmail: string) {
  return `${fromName} <${fromEmail}>`;
}

function canonicalIdentityKey(channelKey: string) {
  if (channelKey in EMAIL_CHANNEL_ALIASES) {
    return EMAIL_CHANNEL_ALIASES[
      channelKey as keyof typeof EMAIL_CHANNEL_ALIASES
    ];
  }

  if (channelKey === "billing") return "billing";
  if (
    channelKey === "support" ||
    channelKey === "feature_requests" ||
    channelKey === "feedback"
  ) {
    return "support";
  }
  if (channelKey === "newsletter") return "newsletter";
  if (channelKey === "security") return "security";
  if (channelKey === "notifications") return "notifications";

  return "authSystem";
}

function configuredSupportEmail() {
  return process.env.SUPPORT_EMAIL || EMAIL_IDENTITIES.support.address;
}

function configuredBillingEmail() {
  return process.env.BILLING_EMAIL || EMAIL_IDENTITIES.billing.address;
}

function configuredNewsletterEmail() {
  return (
    process.env.NEWSLETTER_EMAIL ||
    process.env.EMAIL_NEWSLETTER ||
    EMAIL_IDENTITIES.newsletter.address
  );
}

function senderEmailFor(channelKey: string, fromEmail?: string) {
  if (fromEmail) return fromEmail;
  const identityKey = canonicalIdentityKey(channelKey);

  if (identityKey === "billing") return configuredBillingEmail();
  if (identityKey === "support") return configuredSupportEmail();
  if (identityKey === "newsletter") return configuredNewsletterEmail();
  if (identityKey === "security") return EMAIL_IDENTITIES.security.address;
  if (identityKey === "notifications") {
    return EMAIL_IDENTITIES.notifications.address;
  }

  return (
    process.env.NO_REPLY_EMAIL ||
    process.env.EMAIL_FROM ||
    EMAIL_IDENTITIES.authSystem.address
  );
}

function replyToFor(channelKey: string, replyTo?: string) {
  if (replyTo) return replyTo;
  const identityKey = canonicalIdentityKey(channelKey);

  if (identityKey === "billing") return configuredBillingEmail();
  return configuredSupportEmail();
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return JSON.stringify(error);
}

async function markOutbox(
  outboxId: string | null,
  values: Record<string, unknown>,
) {
  if (!outboxId) return;

  const supabaseServer = getSupabaseServer();
  const { error } = await supabaseServer
    .from("email_outbox")
    .update(values)
    .eq("id", outboxId);

  if (error) {
    console.error("EMAIL_OUTBOX_UPDATE_ERROR:", error);
  }
}

async function recordDeliveryEvent(
  outboxId: string | null,
  providerMessageId: string | null,
  eventType: string,
  recipientEmail: string,
  payload: Record<string, unknown>,
) {
  const supabaseServer = getSupabaseServer();
  const { error } = await supabaseServer.from("email_delivery_events").insert({
    email_outbox_id: outboxId,
    provider: "resend",
    provider_message_id: providerMessageId,
    event_type: eventType,
    event_status: eventType,
    recipient_email: recipientEmail,
    payload,
  });

  if (error) {
    console.error("EMAIL_DELIVERY_EVENT_INSERT_ERROR:", error);
  }
}

export async function sendAuditedEmail({
  channelKey,
  messageType,
  to,
  subject,
  text,
  html,
  fromEmail,
  fromName = "Karpilo LoadIQ",
  replyTo,
  relatedTable,
  relatedId,
  metadata = {},
}: AuditedEmailInput) {
  const recipientEmail = normalizeRecipient(to);
  const senderEmail = senderEmailFor(channelKey, fromEmail);
  const resolvedReplyTo = replyToFor(channelKey, replyTo);
  const emailContent = buildLoadiqEmailContent({ channelKey, subject, text });
  let outboxId: string | null = null;

  const supabaseServer = getSupabaseServer();
  const { data: outbox, error: outboxError } = await supabaseServer
    .from("email_outbox")
    .insert({
      channel_key: channelKey,
      provider: "resend",
      message_type: messageType,
      to_email: recipientEmail,
      from_email: senderEmail,
      reply_to_email: resolvedReplyTo,
      subject,
      status: "queued",
      related_table: relatedTable || null,
      related_id: relatedId || null,
      metadata,
    })
    .select("id")
    .maybeSingle();

  if (outboxError) {
    console.error("EMAIL_OUTBOX_INSERT_ERROR:", outboxError);
  } else {
    outboxId = outbox?.id ?? null;
  }

  await markOutbox(outboxId, { status: "sending" });

  try {
    const response = await resend.emails.send({
      from: formatSender(fromName, senderEmail),
      to,
      replyTo: resolvedReplyTo,
      subject,
      text: emailContent.text,
      html: html || emailContent.html,
    });

    if (response.error) {
      throw response.error;
    }

    const providerMessageId = response.data?.id ?? null;

    await markOutbox(outboxId, {
      status: "sent",
      provider_message_id: providerMessageId,
      sent_at: new Date().toISOString(),
      metadata: {
        ...metadata,
        resend_response: response.data,
      },
    });

    await recordDeliveryEvent(outboxId, providerMessageId, "sent", recipientEmail, {
      resend_response: response.data,
    });

    return { success: true, outboxId, providerMessageId };
  } catch (error) {
    const message = errorMessage(error);

    await markOutbox(outboxId, {
      status: "failed",
      error_message: message,
      failed_at: new Date().toISOString(),
    });

    await recordDeliveryEvent(outboxId, null, "failed", recipientEmail, {
      error: message,
    });

    throw error;
  }
}
