# Karpilo LoadIQ Pilot Launch + Pricing Architecture

## Homepage Architecture

1. Hero: phase-aware launch status, lifetime pricing CTA, app icon HUD, operational proof bullets.
2. Launch Program: Founding 50 Pilot rules, slot language, pricing, lifetime lock conditions.
3. Founder Story: “Built On The Road” section centered on Joshua Karpilo and active trucking experience.
4. Feature Grid: config-driven LoadIQ capabilities.
5. Interactive Demo: public sliders for miles, deadhead, revenue, fuel, overhead, true RPM, leakage, and projected net.
6. Product Demo: richer fictional Nashville to Kansas City demo from `product-demo.ts`.
7. Education: operational intelligence concepts for drivers.
8. How It Works: step-by-step LoadIQ workflow.
9. Pricing: public plans plus early access framing.
10. Future Ecosystem: subtle FleetOS, iAtion, and iAtion Core teasers.
11. FAQ, final CTA, footer legal infrastructure.

## Countdown Architecture

The website uses `src/config/launch.ts` as the public rendering model:

- `pilotOpensAtUtc`
- `officialLaunchAtUtc`
- `pilotProgram`
- `launch500Program`
- `standardPricing`

Public phases:

1. `pre_pilot`
   - Label: “Founding Operator Pilot Opens In:”
   - CTA: Join Waitlist / Notify Me At Pilot Launch / Become A Founding Operator
   - Target: `pilotOpensAtUtc`
   - Payment mode: disabled
   - Allowed actions: waitlist, notification signup, pilot consideration request
   - Blocked actions: checkout, subscription activation, payment collection

2. `pilot_active`
   - Label: “Pilot Operations Active”
   - Slots: `XX / 50 Founding Slots Remaining`
   - Target: `officialLaunchAtUtc`
   - Pricing: `$14.99/month`, `$129.99/year`
   - Payment mode: enabled only after server-authoritative slot validation
   - CTA: Join Founding 50 Pilot / Lock Lifetime Pricing / Start Pilot Access

3. `pilot_closed`
   - Label: “Founding 50 Pilot Fully Allocated”
   - Payment mode: pilot checkout disabled
   - Allowed actions: official launch waitlist and public launch notification signup

4. `launch500_active`
   - Label: “Official Launch Active”
   - Slots: `XXX / 500 Legacy Pricing Slots Remaining`
   - Pricing: `$19.99/month`, `$149.99/year`

5. `standard_active`
   - Label: “Standard Public Access Now Active”
   - Pricing: `$24.99/month`, `$189.99/year`
   - No lifetime lock

## Server-Authoritative Requirements

Before checkout depends on launch state, replace static slot counts with a Supabase-backed server authority:

- `launch_phase_status`
- `pilot_slots`
- `launch500_slots`
- `pricing_entitlements`
- `subscription_price_locks`
- `billing_events`

Use UTC timestamps and server-side validation. The browser countdown is presentation only.

Required payment-gating flags:

- `pilot_payments_enabled boolean`
- `pilot_slots_remaining integer`
- `pilot_subscription_locked boolean`
- `founding_operator_assigned boolean`
- `waitlist_only_mode boolean`

Fail-safe rule:

- If countdown validation fails, payment sync fails, slot counts fail, Stripe webhooks fail, or the active phase cannot be proven, the app must enter waitlist-only mode.
- Waitlist-only mode must never create checkout sessions, activate subscriptions, assign grandfathered pricing, or reserve paid pilot slots.

Concurrency-safe enrollment flow:

1. User requests pilot checkout.
2. Server calls a protected Supabase RPC such as `claim_founding_50_slot`.
3. RPC runs in a transaction, checks server UTC time, verifies `pilot_payments_enabled = true`, locks the allocation set, confirms slots remain, and inserts one immutable enrollment record.
4. RPC returns an enrollment ID and eligible Stripe/App Store/Google Play product mapping.
5. Server creates checkout using only the returned entitlement.
6. Webhook reconciles payment status back to the same enrollment record.

Never let frontend state, local countdown time, or query-string parameters select a discounted price.

## Supabase Recommendations

Recommended columns/flags:

- `pilot_user boolean`
- `founding_operator boolean`
- `lifetime_price_locked boolean`
- `launch500_user boolean`
- `legacy_pricing_locked boolean`
- `pricing_lock_tier text`
- `pricing_lock_started_at timestamptz`
- `pricing_lock_valid_until timestamptz`
- `pricing_lock_revoked_at timestamptz`
- `pricing_lock_revocation_reason text`

Race-condition prevention:

- Allocate slots in a transaction or RPC.
- Use unique constraints on `user_id`.
- Use count checks inside a locked transaction.
- Never trust browser slot counts.
- Store Stripe/App Store/Google Play provider IDs separately.

Recommended tables:

- `launch_program_state`: one row per program with UTC open/close timestamps, payment-enabled flags, slot limits, waitlist-only mode, and audit metadata.
- `founding_operator_enrollments`: immutable user allocation records with unique `user_id`, slot number, price tier, provider, status, assigned timestamp, and revoked timestamp.
- `pricing_entitlements`: durable pricing lock records used by app features and billing reconciliation.
- `billing_event_audit`: append-only Stripe/App Store/Google Play webhook and entitlement events.

Recommended RPC behavior for `claim_founding_50_slot`:

- Use `security definer` with a constrained search path.
- Reject anonymous users unless the product intentionally supports pre-account reservations.
- Check `auth.uid()` against the requested user.
- Lock the pilot program row with `for update`.
- Count or increment allocated slots inside the same transaction.
- Insert with unique constraints preventing duplicate pilot allocations.
- Return a deterministic failure when slots are full.
- Do not create or expose payment provider secrets.

## Stripe / App Store / Google Play Strategy

- Stripe Checkout should receive server-validated price IDs only.
- Do not compute eligibility in the browser.
- Store grandfathered eligibility before checkout session creation.
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

Thank you for believing in the vision early. Your loyalty during this pilot phase earns you a lifetime pricing lock as one of our founding operators, as long as your account remains active and in good standing.

Welcome to the beginning of a new journey.

Joshua Karpilo

## UX Recommendations

- Pre-launch CTAs must be interest-only: “Join Waitlist,” “Notify Me At Pilot Launch,” and “Become A Founding Operator.”
- Pilot-active CTAs can become eligibility/payment-oriented only after server validation: “Join Founding 50 Pilot,” “Lock Lifetime Pricing,” and “Start Pilot Access.”
- Avoid fake urgency. Use qualification and real slot limits.
- Use system language: “Pilot Operations Active,” “System Initialization Complete,” “Legacy Pricing Active.”
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
- Transparent pricing phases.
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
