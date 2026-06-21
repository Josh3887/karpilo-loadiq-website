# Karpilo LoadIQ Tiered Enrollment + Pricing Architecture

## Source Of Truth

This document is the website-facing pricing and enrollment source before page copy or component code is changed.

Repository evidence and current launch direction separate these concepts:

- Commercial tier: Silver, Gold, Platinum, and Pro.
- Rollout phase: Pilot Access, Launch Phase 1, Launch Phase 2, and Open Market.
- Entitlement: the server-confirmed access scope attached to a qualifying account.
- Billing provider: Stripe/Web, Apple App Store, Google Play, or a future provider.

Website copy must not collapse these concepts into one label. A visitor may be in a discounted enrollment phase and still choose one of the available commercial tiers.

## Commercial Tier Pricing

Public commercial pricing:

| Tier | Public monthly | Public annual | Enrollment discount monthly | Commercial meaning |
| --- | ---: | ---: | ---: | --- |
| Silver | $19.99/mo | $199/yr | $14.99/mo | Load viability decision support |
| Gold | $39.99/mo | $399/yr | $24.99/mo | Operational visibility |
| Platinum | $69.99/mo | $699/yr | $49.99/mo | Variance intelligence |
| Pro | $149.99/mo | $1499/yr | $99.99/mo | Growth intelligence |

Pro also has a $10.00/month charge per additional truck when the billing provider configuration supports that pricing model.

Current website evidence defines monthly enrollment discounts. It does not define discounted annual enrollment prices. Do not invent discounted annual pricing in public copy, legal copy, checkout copy, or server records.

## Tiered Enrollment Phases

1. Pilot Access
   - Capacity: first 100 approved users.
   - Slot range: slots 1-100.
   - Available commercial tiers: Silver, Gold, Platinum, and Pro.
   - Pricing behavior: eligible approved users may receive the enrollment discount monthly price for their selected tier.
   - Payment mode: disabled until server-authoritative validation and billing provider configuration are complete.

2. Launch Phase 1
   - Capacity: next 250 approved users after Pilot Access.
   - Slot range: slots 101-350.
   - Available commercial tiers: Silver, Gold, Platinum, and Pro.
   - Pricing behavior: eligible approved users may receive the enrollment discount monthly price for their selected tier.
   - Payment mode: disabled until server-authoritative validation and billing provider configuration are complete.

3. Launch Phase 2
   - Capacity: next 250 approved users after Launch Phase 1.
   - Slot range: slots 351-600.
   - Available commercial tiers: Silver, Gold, Platinum, and Pro.
   - Pricing behavior: eligible approved users may receive the enrollment discount monthly price for their selected tier.
   - Payment mode: disabled until server-authoritative validation and billing provider configuration are complete.

4. Open Market
   - Capacity: no published slot cap.
   - Available commercial tiers: Silver, Gold, Platinum, and Pro.
   - Pricing behavior: public monthly and annual commercial prices.
   - Payment mode: enabled only after billing, policy, support, and app-publishing gates are complete.

## Homepage Architecture

1. Hero: app positioning, operational proof, app icon HUD, and payment-disabled prelaunch status.
2. Rollout command center: phase-aware reservation status without implying checkout is active.
3. Commercial tiers: Silver, Gold, Platinum, and Pro.
4. Tiered enrollment: first 100 approved users, then two 250-user launch phases.
5. Founder story: Joshua Karpilo and active trucking experience.
6. Feature grid: config-driven LoadIQ capabilities.
7. Interactive demo: public freight-estimation preview.
8. Future ecosystem: Karpilo FleetOS, Karpilo Atlas, and Atlas Freight Intelligence teasers only.
9. FAQ, final CTA, footer legal infrastructure.

## Public Rendering Model

The website uses config objects for presentation only:

- `src/config/pricing.ts`: commercial tier pricing, enrollment discount monthly price, available enrollment phases.
- `src/config/launch.ts`: launch display state, phase labels, and user-facing rollout language.
- `src/config/rollout.ts`: fallback public rollout snapshot when Supabase rollout state is unavailable.

Public phases:

1. `pre_pilot`
   - Label: Pilot enrollment readiness.
   - CTA: reserve eligibility.
   - Payment mode: disabled.
   - Allowed actions: waitlist, notification signup, pilot consideration request.
   - Blocked actions: checkout, subscription activation, payment collection.

2. `pilot_active`
   - Label: Pilot enrollment active.
   - Slots: first 100 approved users.
   - Available tiers: Silver, Gold, Platinum, and Pro.
   - Discount display: enrollment discount monthly price by selected tier.
   - Payment mode: enabled only after server-authoritative eligibility validation.

3. `pilot_closed`
   - Label: pilot enrollment fully allocated.
   - Payment mode: pilot checkout disabled.
   - Allowed actions: launch phase waitlist and launch update signup.

4. `launch_phase_1_active`
   - Label: Launch Phase 1 active.
   - Slots: 101-350.
   - Available tiers: Silver, Gold, Platinum, and Pro.
   - Discount display: enrollment discount monthly price by selected tier.

5. `launch_phase_2_active`
   - Label: Launch Phase 2 active.
   - Slots: 351-600.
   - Available tiers: Silver, Gold, Platinum, and Pro.
   - Discount display: enrollment discount monthly price by selected tier.

6. `standard_active`
   - Label: public pricing active.
   - Available tiers: Silver, Gold, Platinum, and Pro.
   - Pricing: public monthly and annual prices.

## Server-Authoritative Requirements

Before checkout depends on launch state, replace static slot counts with a Supabase-backed server authority:

- `launch_phase_status`
- `pilot_enrollment_slots`
- `launch_phase_1_slots`
- `launch_phase_2_slots`
- `pricing_entitlements`
- `subscription_price_locks`
- `billing_events`

Use UTC timestamps and server-side validation. The browser countdown is presentation only.

Required payment-gating flags:

- `payments_enabled boolean`
- `phase_slots_remaining integer`
- `subscription_locked boolean`
- `approved_enrollment_assigned boolean`
- `waitlist_only_mode boolean`

Fail-safe rule:

- If countdown validation fails, payment sync fails, slot counts fail, webhooks fail, or the active phase cannot be proven, the app must enter waitlist-only mode.
- Waitlist-only mode must never create checkout sessions, activate subscriptions, assign discounted pricing, or reserve paid enrollment slots.

Concurrency-safe enrollment flow:

1. User requests enrollment checkout.
2. Server calls a protected Supabase RPC for the active enrollment phase.
3. RPC runs in a transaction, checks server UTC time, verifies payments are enabled, locks the allocation set, confirms slots remain, and inserts one immutable enrollment record.
4. RPC returns an enrollment ID, eligible commercial tier IDs, and approved provider price mapping.
5. Server creates checkout using only the returned entitlement and provider price ID.
6. Webhook reconciles payment status back to the same enrollment record.

Never let frontend state, local countdown time, or query-string parameters select a discounted price.

## Reservation Schema Gap

The current website reservation schema stores cohort-level `monthly_price` and `annual_price` on `pricing_entitlements`.

That is not sufficient for tiered enrollment across Silver, Gold, Platinum, and Pro because price depends on the selected commercial tier. Until the schema captures a selected tier and tier-specific provider price mapping, public reservations should be treated as eligibility intent, not a finalized price lock.

Required schema direction before paid checkout:

- Add a selected commercial tier field such as `selected_commercial_tier`.
- Constrain it to `silver`, `gold`, `platinum`, and `pro`.
- Store enrollment phase separately from commercial tier.
- Store provider price IDs separately from public display prices.
- Preserve cohort phase, commercial tier, entitlement status, billing provider, and provider subscription status as separate fields.

## Supabase Recommendations

Recommended columns/flags:

- `pilot_enrollment_user boolean`
- `launch_phase_1_user boolean`
- `launch_phase_2_user boolean`
- `lifetime_price_locked boolean`
- `enrollment_phase text`
- `commercial_tier text`
- `pricing_lock_started_at timestamptz`
- `pricing_lock_valid_until timestamptz`
- `pricing_lock_revoked_at timestamptz`
- `pricing_lock_revocation_reason text`
- `provider_price_map jsonb`

Race-condition prevention:

- Allocate slots in a transaction or RPC.
- Use unique constraints on `user_id`.
- Use count checks inside a locked transaction.
- Never trust browser slot counts.
- Store Stripe/App Store/Google Play provider IDs separately.

Recommended tables:

- `launch_program_state`: one row per enrollment phase with UTC open/close timestamps, payment-enabled flags, slot limits, waitlist-only mode, and audit metadata.
- `enrollment_reservations`: immutable user allocation records with unique `user_id`, slot number, enrollment phase, commercial tier, provider, status, assigned timestamp, and revoked timestamp.
- `pricing_entitlements`: durable pricing lock records used by app features and billing reconciliation.
- `billing_event_audit`: append-only Stripe/App Store/Google Play webhook and entitlement events.

Recommended RPC behavior:

- Use `security definer` with a constrained search path.
- Reject anonymous checkout unless the product intentionally supports pre-account reservations.
- Check `auth.uid()` against the requested user.
- Lock the enrollment phase row with `for update`.
- Count or increment allocated slots inside the same transaction.
- Validate selected commercial tier against the active enrollment phase.
- Return a deterministic failure when slots are full.
- Do not create or expose payment provider secrets.

## Stripe / App Store / Google Play Strategy

- Checkout should receive server-validated price IDs only.
- Do not compute discount eligibility in the browser.
- Store discounted eligibility before checkout session creation.
- Webhooks should reconcile subscription status and preserve lock metadata.
- Apple/Google subscriptions need platform-specific product IDs mapped to the same internal entitlement tiers.
- If app-store pricing cannot exactly mirror web pricing, disclose platform-specific pricing and preserve internal entitlement classification separately.

## Founder Welcome Modal Copy

Welcome to Karpilo LoadIQ.

My name is Joshua Karpilo, Founder and CEO of Karpilo Endeavor Technologies and creator of Karpilo LoadIQ.

Like many of you, I am still living the reality of the road. I am an active driver and owner-operator with more than 13 years in trucking, and I know how unforgiving this industry can be.

The long hours, uncertainty, fuel costs, breakdowns, missed time, and sacrifices behind the windshield are hard to explain to people who have never lived them.

Karpilo LoadIQ was built because I got tired of watching drivers make high-stakes decisions without real operational intelligence.

This app is my contribution back to the people who keep this country moving. My goal is simple: help drivers think clearer, operate smarter, and stay profitable longer.

LoadIQ is only the beginning. It is the foundation for a larger operational ecosystem still being built carefully behind the scenes.

As an early supporter, your feedback matters. Some of the best ideas in trucking do not come from boardrooms. They come from truck stops, loading docks, breakdowns, and honest conversations between people who live this work.

Thank you for believing in the vision early. Your loyalty during a qualifying enrollment phase may earn a pricing lock for the selected Karpilo LoadIQ commercial tier, as long as your account remains active and in good standing.

Welcome to the beginning of a new journey.

Joshua Karpilo

## UX Recommendations

- Pre-launch CTAs must be interest-only: "Reserve Eligibility," "Get Launch Updates," and "Request Pilot Consideration."
- Enrollment-active CTAs can become eligibility/payment-oriented only after server validation.
- Avoid fake urgency. Use qualification and real slot limits.
- Use system language: "Pilot Access Active," "Launch Phase 1 Active," "Launch Phase 2 Active," and "Public Pricing Active."
- Mobile should keep one sticky CTA, short copy, and large tap targets.
- Keep legal and pricing disclosures visible but not alarmist.

## Animation Recommendations

- Use telemetry sweeps, grid opacity shifts, and card glow changes.
- Avoid cartoon motion.
- Countdown phase transitions should feel like a system state change.
- Respect reduced-motion preferences in future refinement.

## SEO Structure

- Homepage title should lead with LoadIQ and freight profitability intelligence.
- Legal routes should be indexable.
- Use clear route names under `/legal/*`.
- Future app pages should use noindex only for account-specific dashboards.

## Trust Strategy

- Founder-led credibility.
- Transparent enrollment phases.
- Clear no-guarantee language.
- Stripe/App Store/Google Play policy-aware subscription terms.
- Data-source attribution and disclaimers.
- Support email visible in footer and legal pages.

## Vercel Deployment Notes

- Public countdown config is static and Vercel-safe.
- Server-authoritative launch state should be exposed through a cache-controlled API route later.
- Avoid exposing service-role keys.
- Use Supabase RLS and server-side RPC for slot allocation.
- Keep billing eligibility validation on the server.
