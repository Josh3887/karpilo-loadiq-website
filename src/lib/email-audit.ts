import { Resend } from "resend";

import { LOADIQ_CONTACT } from "@/config/loadiq";
import { getSupabaseServer } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

type AuditedEmailInput = {
  channelKey: string;
  messageType: string;
  to: string | string[];
  subject: string;
  text: string;
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

function senderEmailFor(channelKey: string, fromEmail?: string) {
  if (fromEmail) return fromEmail;
  if (channelKey === "updates") {
    return process.env.EMAIL_UPDATES || LOADIQ_CONTACT.updatesEmail;
  }
  if (channelKey === "newsletter") {
    return process.env.EMAIL_NEWSLETTER || LOADIQ_CONTACT.newsletterEmail;
  }
  return process.env.EMAIL_FROM || LOADIQ_CONTACT.noreplyEmail;
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
  fromEmail,
  fromName = "Karpilo LoadIQ",
  replyTo,
  relatedTable,
  relatedId,
  metadata = {},
}: AuditedEmailInput) {
  const recipientEmail = normalizeRecipient(to);
  const senderEmail = senderEmailFor(channelKey, fromEmail);
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
      reply_to_email: replyTo || null,
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
      replyTo,
      subject,
      text,
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
