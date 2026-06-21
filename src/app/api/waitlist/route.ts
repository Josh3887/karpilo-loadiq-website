import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { LOADIQ_CONTACT, LOADIQ_LAUNCH_KEYS } from "@/config/loadiq";
import { sendAuditedEmail } from "@/lib/email-audit";

const notifyEmail =
  process.env.NEWSLETTER_EMAIL ||
  process.env.EMAIL_NEWSLETTER ||
  LOADIQ_CONTACT.newsletterEmail;

const allowedCohorts = [
  LOADIQ_LAUNCH_KEYS.pilotAccess,
  LOADIQ_LAUNCH_KEYS.launchPhase1,
  LOADIQ_LAUNCH_KEYS.launchPhase2,
  LOADIQ_LAUNCH_KEYS.standardFuture,
] as const;
const allowedBillingProviders = [
  "stripe_web",
  "apple_app_store",
  "google_play",
  "undecided",
] as const;

type Cohort = (typeof allowedCohorts)[number];
type BillingProvider = (typeof allowedBillingProviders)[number];

const pricingByCohort: Record<
  Cohort,
  {
    pricingLockTier: string;
  }
> = {
  pilot_access: {
    pricingLockTier: "pilot_enrollment",
  },
  launch_phase_1: {
    pricingLockTier: "launch_phase_1",
  },
  launch_phase_2: {
    pricingLockTier: "launch_phase_2",
  },
  standard_future: {
    pricingLockTier: "standard",
  },
};

const rolloutPhaseByCohort: Record<Cohort, string> = {
  pilot_access: "PRELAUNCH_WAITLIST",
  launch_phase_1: "LAUNCH_PHASE_1",
  launch_phase_2: "LAUNCH_PHASE_2",
  standard_future: "GENERAL_AVAILABILITY",
};

function normalizeCohort(value: unknown): Cohort {
  return allowedCohorts.includes(value as Cohort)
    ? (value as Cohort)
    : LOADIQ_LAUNCH_KEYS.pilotAccess;
}

function normalizeBillingProvider(value: unknown): BillingProvider {
  return allowedBillingProviders.includes(value as BillingProvider)
    ? (value as BillingProvider)
    : "undecided";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const company = String(body.company || "").trim();
    const fleetSize = String(body.fleet_size || "").trim();
    const cohort = normalizeCohort(body.cohort);
    const intendedBillingProvider = normalizeBillingProvider(
      body.intended_billing_provider,
    );
    const pricing = pricingByCohort[cohort];

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    let reservationSaved = false;
    let reservationAlreadyExists = false;
    let reservationId: string | null = null;
    let reservationErrorMessage: string | null = null;
    let reservationHandledByRpc = false;

    const { data: rpcReservation, error: rpcReservationError } =
      await supabaseServer.rpc("submit_website_reservation", {
        p_name: name,
        p_email: email,
        p_company: company || null,
        p_fleet_size: fleetSize || null,
        p_requested_cohort: cohort,
        p_intended_billing_provider: intendedBillingProvider,
        p_source: "website-waitlist-modal",
      });

    if (!rpcReservationError && Array.isArray(rpcReservation) && rpcReservation[0]) {
      reservationSaved = true;
      reservationAlreadyExists = Boolean(rpcReservation[0].already_exists);
      reservationId = String(rpcReservation[0].reservation_id);
      reservationHandledByRpc = true;
    } else if (
      rpcReservationError &&
      !["42883", "PGRST202"].includes(rpcReservationError.code || "")
    ) {
      reservationErrorMessage = rpcReservationError.message;
      console.error("WEBSITE_RESERVATION_RPC_ERROR:", rpcReservationError);
    }

    if (reservationErrorMessage) {
      return NextResponse.json(
        { error: "Failed to save reservation." },
        { status: 409 },
      );
    }

    const { data: existingReservation, error: existingReservationError } =
      reservationSaved
        ? { data: null, error: null }
        : await supabaseServer
            .from("website_reservations")
            .select("id")
            .eq("email", email)
            .eq("assigned_cohort", cohort)
            .maybeSingle();

    if (!existingReservationError && existingReservation?.id) {
      reservationSaved = true;
      reservationAlreadyExists = true;
      reservationId = existingReservation.id;
    }

    if (!reservationSaved) {
      const { data: reservation, error: reservationError } = await supabaseServer
        .from("website_reservations")
        .insert({
          name,
          email,
          company,
          fleet_size: fleetSize,
          requested_cohort: cohort,
          assigned_cohort: cohort,
          intended_billing_provider: intendedBillingProvider,
          pricing_lock_tier: pricing.pricingLockTier,
          status: "submitted",
          source: "website-waitlist-modal",
          metadata: {
            tiered_enrollment: cohort !== LOADIQ_LAUNCH_KEYS.standardFuture,
            pricing_authority: "server_required_before_checkout",
          },
        })
        .select("id")
        .maybeSingle();

      if (reservationError) {
        reservationErrorMessage = reservationError.message;
        if (reservationError.code === "23505") {
          reservationAlreadyExists = true;
          reservationSaved = true;
        } else {
          console.error("WEBSITE_RESERVATION_INSERT_ERROR:", reservationError);
        }
      } else {
        reservationSaved = true;
        reservationId = reservation?.id ?? null;
      }
    }

    if (reservationId && !reservationHandledByRpc) {
      const { error: eventError } = await supabaseServer
        .from("reservation_events")
        .insert({
          reservation_id: reservationId,
          event_type: reservationAlreadyExists
            ? "duplicate_submission"
            : "reservation_submitted",
          actor_type: "public_visitor",
          metadata: {
            cohort,
            intended_billing_provider: intendedBillingProvider,
            source: "website-waitlist-modal",
          },
        });

      if (eventError) {
        console.error("RESERVATION_EVENT_INSERT_ERROR:", eventError);
      }

      // Tiered enrollment pricing depends on the selected commercial tier.
      // This fallback path records eligibility intent only; final entitlements
      // must be created by server-authoritative approval and provider mapping.
    }

    let rolloutWaitlistId: string | null = null;
    let rolloutHandledByRpc = false;
    const shouldCreateRolloutRecord =
      cohort !== LOADIQ_LAUNCH_KEYS.standardFuture;

    if (shouldCreateRolloutRecord && !reservationHandledByRpc) {
      const { data: rolloutRpcRows, error: rolloutRpcError } =
        await supabaseServer.rpc("submit_rollout_waitlist", {
          p_phase_key: rolloutPhaseByCohort[cohort],
          p_name: name,
          p_email: email,
          p_company: company || null,
          p_fleet_size: fleetSize || null,
          p_intended_billing_provider: intendedBillingProvider,
          p_source: "website-waitlist-modal",
        });

      if (!rolloutRpcError && Array.isArray(rolloutRpcRows) && rolloutRpcRows[0]) {
        rolloutWaitlistId = String(rolloutRpcRows[0].rollout_waitlist_id);
        rolloutHandledByRpc = true;
      } else if (
        rolloutRpcError &&
        !["42883", "PGRST202"].includes(rolloutRpcError.code || "")
      ) {
        console.error("ROLLOUT_WAITLIST_RPC_ERROR:", rolloutRpcError);
      }
    }

    if (shouldCreateRolloutRecord && !rolloutWaitlistId) {
      const { data: rolloutWaitlistRow, error: rolloutWaitlistError } =
        await supabaseServer
          .from("rollout_waitlist")
          .insert({
            phase_key: rolloutPhaseByCohort[cohort],
            name,
            email,
            company,
            fleet_size: fleetSize,
            intended_billing_provider: intendedBillingProvider,
            source: "website-waitlist-modal",
            status: "submitted",
            metadata: {
              counted_by_website_reservation_rpc: reservationHandledByRpc,
              website_reservation_id: reservationId,
              requested_cohort: cohort,
            },
          })
          .select("id")
          .maybeSingle();

      if (rolloutWaitlistError && rolloutWaitlistError.code !== "23505") {
        console.error("ROLLOUT_WAITLIST_INSERT_ERROR:", rolloutWaitlistError);
      }

      rolloutWaitlistId = rolloutWaitlistRow?.id || null;
    }

    if (rolloutWaitlistId && !rolloutHandledByRpc) {
      const { error: rolloutEventError } = await supabaseServer
        .from("rollout_access_events")
        .insert({
          rollout_waitlist_id: rolloutWaitlistId,
          phase_key: rolloutPhaseByCohort[cohort],
          event_type: reservationHandledByRpc
            ? "reservation_synced_to_rollout_waitlist"
            : "waitlist_submitted",
          actor_type: "server",
          metadata: {
            counted_by_website_reservation_rpc: reservationHandledByRpc,
            intended_billing_provider: intendedBillingProvider,
            website_reservation_id: reservationId,
          },
        });

      if (rolloutEventError) {
        console.error("ROLLOUT_ACCESS_EVENT_INSERT_ERROR:", rolloutEventError);
      }
    }

    const { data: existing } = await supabaseServer
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyReserved: true,
        cohort,
      });
    }

    const { error: dbError } = await supabaseServer.from("waitlist").insert({
      name,
      email,
      company,
      fleet_size: fleetSize,
      founder_access: cohort === LOADIQ_LAUNCH_KEYS.pilotAccess,
      program_interest: cohort,
      metadata: {
        intended_billing_provider: intendedBillingProvider,
        website_reservation_id: reservationId,
      },
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);

      if (!reservationSaved) {
        return NextResponse.json(
          {
            error: "Failed to save reservation.",
          },
          { status: 500 }
        );
      }
    }

    try {
      await sendAuditedEmail({
        channelKey: "updates",
        messageType: "reservation_notification",
        to: notifyEmail,
        replyTo: email,
        subject: "New Karpilo LoadIQ Enrollment Reservation",
        text: `
New enrollment reservation:

Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Fleet Size / Role: ${fleetSize || "Not provided"}
Reservation Cohort: ${cohort}
Intended Billing Provider: ${intendedBillingProvider}
Source: Website
        `.trim(),
        relatedTable: "website_reservations",
        relatedId: reservationId,
        metadata: {
          cohort,
          intended_billing_provider: intendedBillingProvider,
          already_reserved: reservationAlreadyExists,
        },
      });
    } catch (emailError) {
      console.error("Email notification failed, but reservation was saved:", emailError);
    }

    return NextResponse.json({
      success: true,
      alreadyReserved: reservationAlreadyExists,
      cohort,
    });
  } catch (error) {
    console.error("Waitlist route error:", error);

    return NextResponse.json(
      { error: "Failed to process reservation." },
      { status: 500 }
    );
  }
}
