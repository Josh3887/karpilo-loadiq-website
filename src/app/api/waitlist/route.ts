import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";
import { LOADIQ_CONTACT, LOADIQ_LAUNCH_KEYS } from "@/config/loadiq";
import { sendAuditedEmail } from "@/lib/email-audit";

const notifyEmail =
  process.env.LOADIQ_NOTIFY_EMAIL ||
  LOADIQ_CONTACT.featureRequestEmail;

const allowedCohorts = [
  LOADIQ_LAUNCH_KEYS.founder50,
  LOADIQ_LAUNCH_KEYS.launch500,
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
    monthlyPrice: number;
    annualPrice: number;
    createsLock: boolean;
  }
> = {
  founder_50: {
    pricingLockTier: "founder_50",
    monthlyPrice: 14.99,
    annualPrice: 129.99,
    createsLock: true,
  },
  launch_500: {
    pricingLockTier: "launch_500",
    monthlyPrice: 19.99,
    annualPrice: 149.99,
    createsLock: true,
  },
  standard_future: {
    pricingLockTier: "standard",
    monthlyPrice: 24.99,
    annualPrice: 189.99,
    createsLock: false,
  },
};

const rolloutPhaseByCohort: Record<Cohort, string> = {
  founder_50: "PRELAUNCH_WAITLIST",
  launch_500: "FOUNDER_PILOT",
  standard_future: "GENERAL_AVAILABILITY",
};

function normalizeCohort(value: unknown): Cohort {
  return allowedCohorts.includes(value as Cohort)
    ? (value as Cohort)
    : LOADIQ_LAUNCH_KEYS.founder50;
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
        { error: reservationErrorMessage },
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
            legacy_founder_access: true,
          },
        })
        .select("id")
        .single();

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
        reservationId = reservation.id;
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

      if (pricing.createsLock && !reservationAlreadyExists) {
        const { error: entitlementError } = await supabaseServer
          .from("pricing_entitlements")
          .insert({
            reservation_id: reservationId,
            email,
            cohort,
            pricing_lock_tier: pricing.pricingLockTier,
            monthly_price: pricing.monthlyPrice,
            annual_price: pricing.annualPrice,
            intended_billing_provider: intendedBillingProvider,
            status: "pending_review",
            active: false,
            source: "website_reservation",
          });

        if (entitlementError) {
          console.error("PRICING_ENTITLEMENT_INSERT_ERROR:", entitlementError);
        }
      }
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
          .single();

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

    const { data: existing } = await supabase
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

    const { error: dbError } = await supabase.from("waitlist").insert({
      name,
      email,
      company,
      fleet_size: fleetSize,
      founder_access: true,
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
            detail: reservationErrorMessage,
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
        subject: "New Karpilo LoadIQ Founding Operator Reservation",
        text: `
New founding operator reservation:

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
