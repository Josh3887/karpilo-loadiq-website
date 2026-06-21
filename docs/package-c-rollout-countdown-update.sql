-- Package C: rollout countdown + tiered enrollment reservation routing update
-- Apply in Supabase SQL Editor after Package A/B tables and functions exist.
-- Anchor: May 13, 2026 08:00 MST = 2026-05-13 15:00:00 UTC.

begin;

update public.rollout_phases
set
  sort_order = 0,
  title = 'Pilot enrollment readiness window.',
  short_label = 'Pilot 100',
  capacity = 100,
  starts_at = '2026-05-13T15:00:00Z'::timestamptz,
  ends_at = '2026-06-12T15:00:00Z'::timestamptz,
  duration_days = 30,
  status = 'active',
  accepting_reservations = true,
  description = 'Pilot enrollment reservations are open while launch systems are finalized.',
  expectation = 'No billing is active. The first 100 approved users may qualify for discounted tier enrollment after server-side review.',
  cta_label = 'Reserve Eligibility',
  target_route = '/pilot-program',
  metadata = metadata || jsonb_build_object(
    'anchor_timezone', 'MST UTC-07',
    'notification_recipient', 'j.karpilo@karpiloloadiq.com',
    'reservation_scope', 'first_100'
  )
where phase_key = 'PRELAUNCH_WAITLIST';

update public.rollout_phases
set
  sort_order = 1,
  title = 'Second enrollment planned for the next 500 users.',
  short_label = 'Next 500',
  capacity = 500,
  starts_at = '2026-06-27T15:00:00Z'::timestamptz,
  ends_at = '2026-08-26T15:00:00Z'::timestamptz,
  duration_days = 60,
  status = 'upcoming',
  accepting_reservations = false,
  description = 'The second discounted enrollment cohort is planned after pilot enrollment readiness is validated.',
  expectation = 'Second enrollment expands discounted tier eligibility to the next 500 approved users.',
  cta_label = 'Join Second Enrollment',
  target_route = '/launch-promo',
  metadata = metadata || jsonb_build_object(
    'anchor_timezone', 'MST UTC-07',
    'offset_from_pilot_anchor_days', 45,
    'cohort_size', 500
  )
where phase_key = 'FOUNDER_PILOT';

update public.rollout_phases
set
  sort_order = 2,
  title = 'Public launch readiness review.',
  short_label = 'Readiness',
  capacity = null,
  starts_at = '2026-08-26T15:00:00Z'::timestamptz,
  ends_at = '2026-11-24T15:00:00Z'::timestamptz,
  duration_days = 90,
  status = 'upcoming',
  accepting_reservations = false,
  description = 'Public launch readiness is reviewed after the two discounted enrollment phases.',
  expectation = 'Open public access remains gated by infrastructure, support load, billing readiness, and publication requirements.',
  cta_label = 'Get Launch Updates',
  target_route = '/launch-promo',
  metadata = metadata || jsonb_build_object(
    'anchor_timezone', 'MST UTC-07',
    'offset_from_phase_2_days', 60,
    'cohort_size', null
  )
where phase_key = 'CONTROLLED_PUBLIC_LAUNCH';

update public.rollout_phases
set
  sort_order = 3,
  title = 'Public launch readiness window.',
  short_label = 'Readiness',
  capacity = null,
  starts_at = '2026-11-24T15:00:00Z'::timestamptz,
  ends_at = '2026-11-24T15:00:00Z'::timestamptz,
  duration_days = null,
  status = 'upcoming',
  accepting_reservations = false,
  description = 'The controlled cohorts have completed and the app enters final public-readiness monitoring.',
  expectation = 'Open public access is held until the final public launch timer reaches zero.',
  cta_label = 'Get Launch Updates',
  target_route = '/contact',
  metadata = metadata || jsonb_build_object('anchor_timezone', 'MST UTC-07')
where phase_key = 'EXPANSION_ACCESS';

update public.rollout_phases
set
  sort_order = 4,
  title = 'App live to public.',
  short_label = 'Public Live',
  capacity = null,
  starts_at = '2026-11-24T15:00:00Z'::timestamptz,
  ends_at = null,
  duration_days = null,
  status = 'upcoming',
  accepting_reservations = false,
  description = 'Karpilo LoadIQ opens to public access 90 days from Phase 3 launch.',
  expectation = 'This final public-live countdown is shown on the home page.',
  cta_label = 'Get Launch Updates',
  target_route = '/contact',
  metadata = metadata || jsonb_build_object(
    'anchor_timezone', 'MST UTC-07',
    'offset_from_phase_3_days', 90
  )
where phase_key = 'GENERAL_AVAILABILITY';

-- Keep the website reservation authority open for tiered enrollment only.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'launch_program_state'
      and column_name = 'reservation_enabled'
  ) then
    update public.launch_program_state
    set
      display_name = 'Phase 1 Pilot Launch - First 50 Users',
      current_phase = 'pre_pilot',
      slot_limit = 50,
      reservation_enabled = true,
      billing_enabled = false,
      pricing_lock_enabled = true,
      waitlist_only_mode = true
    where program_key = 'founder_50';

    update public.launch_program_state
    set reservation_enabled = false
    where program_key in ('launch_500', 'standard_future');
  end if;
end $$;

-- Keep the original payment-gating state aligned where that table shape exists.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'launch_program_state'
      and column_name = 'opens_at'
  ) then
    update public.launch_program_state
    set
      display_name = 'Phase 1 Pilot Launch - First 50 Users',
      opens_at = '2026-05-13T15:00:00Z'::timestamptz,
      closes_at = '2026-06-12T15:00:00Z'::timestamptz,
      slot_limit = 50,
      waitlist_only_mode = true,
      pilot_payments_enabled = false,
      pilot_subscription_locked = true
    where program_key in ('founding_50_pilot', 'prelaunch_pilot_50');
  end if;
end $$;

commit;

-- Verification
select
  phase_key,
  title,
  short_label,
  capacity,
  starts_at,
  ends_at,
  duration_days,
  status,
  accepting_reservations
from public.rollout_phases
order by sort_order;
