-- Karpilo LoadIQ pilot payment gating contract
-- Copy into Supabase SQL Editor only after reviewing against the live app schema.
-- This is intentionally non-destructive and fails closed by default.

create extension if not exists pgcrypto;

create schema if not exists private;

create table if not exists public.launch_program_state (
  program_key text primary key,
  display_name text not null,
  opens_at timestamptz not null,
  closes_at timestamptz,
  slot_limit integer not null check (slot_limit >= 0),
  slots_claimed integer not null default 0 check (slots_claimed >= 0),
  pilot_payments_enabled boolean not null default false,
  pilot_slots_remaining integer generated always as (greatest(slot_limit - slots_claimed, 0)) stored,
  pilot_subscription_locked boolean not null default true,
  waitlist_only_mode boolean not null default true,
  provider_price_map jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  check (slots_claimed <= slot_limit)
);

create table if not exists public.founding_operator_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_key text not null references public.launch_program_state(program_key),
  slot_number integer not null check (slot_number > 0),
  founding_operator_assigned boolean not null default true,
  lifetime_price_locked boolean not null default true,
  pricing_tier text not null default 'founding_50_pilot',
  billing_provider text not null default 'stripe',
  provider_customer_id text,
  provider_subscription_id text,
  checkout_session_id text,
  status text not null default 'allocated'
    check (status in ('allocated', 'checkout_started', 'active', 'payment_failed', 'canceled', 'revoked')),
  assigned_at timestamptz not null default now(),
  activated_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_key),
  unique (program_key, slot_number)
);

create table if not exists public.billing_event_audit (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.founding_operator_enrollments(id),
  user_id uuid references auth.users(id),
  provider text not null,
  event_type text not null,
  provider_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists launch_program_state_payment_idx
  on public.launch_program_state (program_key, pilot_payments_enabled, waitlist_only_mode);

create index if not exists founding_operator_enrollments_user_idx
  on public.founding_operator_enrollments (user_id);

create index if not exists founding_operator_enrollments_status_idx
  on public.founding_operator_enrollments (program_key, status);

create index if not exists billing_event_audit_user_idx
  on public.billing_event_audit (user_id, created_at desc);

alter table public.launch_program_state enable row level security;
alter table public.founding_operator_enrollments enable row level security;
alter table public.billing_event_audit enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'launch_program_state'
      and policyname = 'Authenticated users can read launch program state'
  ) then
    create policy "Authenticated users can read launch program state"
      on public.launch_program_state
      for select
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'founding_operator_enrollments'
      and policyname = 'Users can read their own founding enrollment'
  ) then
    create policy "Users can read their own founding enrollment"
      on public.founding_operator_enrollments
      for select
      to authenticated
      using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'billing_event_audit'
      and policyname = 'Users can read their own billing audit events'
  ) then
    create policy "Users can read their own billing audit events"
      on public.billing_event_audit
      for select
      to authenticated
      using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
  end if;
end $$;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists launch_program_state_touch_updated_at on public.launch_program_state;
create trigger launch_program_state_touch_updated_at
before update on public.launch_program_state
for each row execute function private.touch_updated_at();

drop trigger if exists founding_operator_enrollments_touch_updated_at on public.founding_operator_enrollments;
create trigger founding_operator_enrollments_touch_updated_at
before update on public.founding_operator_enrollments
for each row execute function private.touch_updated_at();

insert into public.launch_program_state (
  program_key,
  display_name,
  opens_at,
  closes_at,
  slot_limit,
  slots_claimed,
  pilot_payments_enabled,
  pilot_subscription_locked,
  waitlist_only_mode,
  provider_price_map
)
values (
  'founding_50_pilot',
  'Pilot Enrollment Program',
  '2026-06-01T15:00:00Z',
  '2026-07-31T15:00:00Z',
  100,
  0,
  false,
  true,
  true,
  '{"stripe":{"monthly":"price_replace_me","annual":"price_replace_me"},"apple":{"monthly":"karpilo_loadiq_pilot_monthly","annual":"karpilo_loadiq_pilot_annual"},"google":{"monthly":"karpilo_loadiq_pilot_monthly","annual":"karpilo_loadiq_pilot_annual"}}'::jsonb
)
on conflict (program_key) do nothing;

create or replace function private.claim_founding_50_slot(requested_provider text default 'stripe')
returns table (
  enrollment_id uuid,
  slot_number integer,
  pricing_tier text,
  billing_provider text,
  provider_price_map jsonb
)
language plpgsql
security definer
set search_path = private, public, auth
as $$
declare
  acting_user uuid;
  program_row public.launch_program_state%rowtype;
  next_slot integer;
begin
  acting_user := auth.uid();

  if acting_user is null then
    raise exception 'Authentication is required to claim a pilot slot';
  end if;

  select *
    into program_row
    from public.launch_program_state
    where program_key = 'founding_50_pilot'
    for update;

  if not found then
    raise exception 'Pilot program state is unavailable';
  end if;

  if program_row.waitlist_only_mode
    or not program_row.pilot_payments_enabled
    or now() < program_row.opens_at
    or (program_row.closes_at is not null and now() >= program_row.closes_at)
  then
    raise exception 'Pilot payments are not enabled';
  end if;

  if program_row.slots_claimed >= program_row.slot_limit then
    update public.launch_program_state
      set pilot_payments_enabled = false,
          waitlist_only_mode = true
      where program_key = 'founding_50_pilot';

    raise exception 'Pilot enrollment is fully allocated';
  end if;

  select e.id, e.slot_number, e.pricing_tier, e.billing_provider, program_row.provider_price_map
    into enrollment_id, slot_number, pricing_tier, billing_provider, provider_price_map
    from public.founding_operator_enrollments e
    where e.user_id = acting_user
      and e.program_key = 'founding_50_pilot';

  if found then
    return next;
  end if;

  next_slot := program_row.slots_claimed + 1;

  insert into public.founding_operator_enrollments (
    user_id,
    program_key,
    slot_number,
    billing_provider
  )
  values (
    acting_user,
    'founding_50_pilot',
    next_slot,
    coalesce(nullif(requested_provider, ''), 'stripe')
  )
  returning id, slot_number, pricing_tier, billing_provider
    into enrollment_id, slot_number, pricing_tier, billing_provider;

  update public.launch_program_state
    set slots_claimed = next_slot,
        pilot_payments_enabled = next_slot < slot_limit,
        waitlist_only_mode = next_slot >= slot_limit
    where program_key = 'founding_50_pilot';

  return query
    select enrollment_id, slot_number, pricing_tier, billing_provider, program_row.provider_price_map;
end;
$$;

revoke all on function private.claim_founding_50_slot(text) from public;

-- Server-side checkout creation should call private.claim_founding_50_slot from trusted code,
-- then create Stripe/App Store/Google Play enrollment using the returned entitlement.
-- Do not expose service-role keys or provider secrets to the browser.
