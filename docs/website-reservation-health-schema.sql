-- Karpilo LoadIQ website reservation, support, newsletter, legal health schema
-- Additive migration draft. Review against the live Supabase project before applying.
-- Existing waitlist/contact_inquiries tables are intentionally preserved.

create extension if not exists pgcrypto;

create table if not exists public.launch_program_state (
  program_key text primary key
    check (program_key in ('founder_50', 'launch_500', 'standard_future')),
  display_name text not null,
  current_phase text not null default 'waitlist_only',
  opens_at timestamptz,
  closes_at timestamptz,
  slot_limit integer not null check (slot_limit >= 0),
  slots_reserved integer not null default 0 check (slots_reserved >= 0),
  slots_claimed integer not null default 0 check (slots_claimed >= 0),
  slots_remaining integer generated always as (greatest(slot_limit - slots_reserved, 0)) stored,
  reservation_enabled boolean not null default true,
  billing_enabled boolean not null default false,
  pricing_lock_enabled boolean not null default false,
  waitlist_only_mode boolean not null default true,
  monthly_price numeric(10, 2) not null,
  annual_price numeric(10, 2) not null,
  provider_price_map jsonb not null default '{}'::jsonb,
  public_visible boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  check (slots_reserved <= slot_limit),
  check (slots_claimed <= slot_limit)
);

create table if not exists public.website_reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  fleet_size text,
  requested_cohort text not null
    check (requested_cohort in ('founder_50', 'launch_500', 'standard_future')),
  assigned_cohort text not null
    check (assigned_cohort in ('founder_50', 'launch_500', 'standard_future')),
  intended_billing_provider text not null default 'undecided'
    check (intended_billing_provider in ('stripe_web', 'apple_app_store', 'google_play', 'undecided')),
  pricing_lock_tier text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'approved', 'waitlisted', 'rejected', 'converted', 'canceled')),
  source text not null default 'website',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists website_reservations_email_cohort_uidx
  on public.website_reservations (lower(email), assigned_cohort);

create table if not exists public.reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.website_reservations(id) on delete cascade,
  event_type text not null,
  actor_type text not null default 'system',
  actor_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pricing_entitlements (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.website_reservations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  cohort text not null
    check (cohort in ('founder_50', 'launch_500', 'standard_future')),
  pricing_lock_tier text not null,
  monthly_price numeric(10, 2) not null,
  annual_price numeric(10, 2) not null,
  intended_billing_provider text not null default 'undecided'
    check (intended_billing_provider in ('stripe_web', 'apple_app_store', 'google_play', 'undecided')),
  status text not null default 'pending_review',
  active boolean not null default false,
  source text not null default 'website_reservation',
  activated_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists pricing_entitlements_reservation_uidx
  on public.pricing_entitlements (reservation_id)
  where reservation_id is not null;

create table if not exists public.support_intake (
  id uuid primary key default gen_random_uuid(),
  intake_type text not null
    check (intake_type in ('support', 'feedback', 'pilot_inquiry', 'launch_inquiry', 'bug_report')),
  name text not null,
  email text not null,
  role text,
  message text not null,
  source text not null default 'website',
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  company text,
  source text not null default 'website',
  status text not null default 'subscribed',
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.system_health_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null default 'info'
    check (severity in ('info', 'degraded', 'maintenance', 'incident')),
  status text not null default 'active'
    check (status in ('active', 'scheduled', 'resolved')),
  public_visible boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  resolved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  subject_table text,
  subject_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
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
for each row execute function public.touch_updated_at();

drop trigger if exists website_reservations_touch_updated_at on public.website_reservations;
create trigger website_reservations_touch_updated_at
before update on public.website_reservations
for each row execute function public.touch_updated_at();

drop trigger if exists pricing_entitlements_touch_updated_at on public.pricing_entitlements;
create trigger pricing_entitlements_touch_updated_at
before update on public.pricing_entitlements
for each row execute function public.touch_updated_at();

drop trigger if exists support_intake_touch_updated_at on public.support_intake;
create trigger support_intake_touch_updated_at
before update on public.support_intake
for each row execute function public.touch_updated_at();

drop trigger if exists newsletter_subscribers_touch_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_touch_updated_at
before update on public.newsletter_subscribers
for each row execute function public.touch_updated_at();

drop trigger if exists system_health_notices_touch_updated_at on public.system_health_notices;
create trigger system_health_notices_touch_updated_at
before update on public.system_health_notices
for each row execute function public.touch_updated_at();

insert into public.launch_program_state (
  program_key,
  display_name,
  current_phase,
  slot_limit,
  monthly_price,
  annual_price,
  reservation_enabled,
  billing_enabled,
  pricing_lock_enabled,
  waitlist_only_mode
)
values
  ('founder_50', 'Pilot Enrollment Program', 'pre_pilot', 100, 0.00, 0.00, true, false, true, true),
  ('launch_500', 'Second Enrollment Program', 'queued', 500, 0.00, 0.00, true, false, true, true),
  ('standard_future', 'Standard Future Users', 'future_standard', 2147483647, 0.00, 0.00, true, false, false, true)
on conflict (program_key) do nothing;

create or replace function public.submit_website_reservation(
  p_name text,
  p_email text,
  p_company text default null,
  p_fleet_size text default null,
  p_requested_cohort text default 'founder_50',
  p_intended_billing_provider text default 'undecided',
  p_source text default 'website'
)
returns table (
  reservation_id uuid,
  already_exists boolean,
  assigned_cohort text,
  pricing_lock_tier text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  program_row public.launch_program_state%rowtype;
  existing_row public.website_reservations%rowtype;
  normalized_email text;
  entitlement_active boolean;
begin
  normalized_email := lower(trim(p_email));

  if trim(coalesce(p_name, '')) = '' or normalized_email = '' then
    raise exception 'Name and email are required';
  end if;

  if p_requested_cohort not in ('founder_50', 'launch_500', 'standard_future') then
    p_requested_cohort := 'founder_50';
  end if;

  if p_intended_billing_provider not in ('stripe_web', 'apple_app_store', 'google_play', 'undecided') then
    p_intended_billing_provider := 'undecided';
  end if;

  select *
    into program_row
    from public.launch_program_state
    where program_key = p_requested_cohort
    for update;

  if not found or not program_row.reservation_enabled then
    raise exception 'Reservations are not available for this cohort';
  end if;

  select *
    into existing_row
    from public.website_reservations wr
    where lower(wr.email) = normalized_email
      and wr.assigned_cohort = p_requested_cohort;

  if found then
    insert into public.reservation_events (reservation_id, event_type, actor_type, metadata)
    values (
      existing_row.id,
      'duplicate_submission',
      'public_visitor',
      jsonb_build_object('source', p_source, 'intended_billing_provider', p_intended_billing_provider)
    );

    reservation_id := existing_row.id;
    already_exists := true;
    assigned_cohort := existing_row.assigned_cohort;
    pricing_lock_tier := existing_row.pricing_lock_tier;
    return next;
    return;
  end if;

  if program_row.slots_reserved >= program_row.slot_limit then
    raise exception 'No reservation slots remain for this cohort';
  end if;

  -- Tiered enrollment reservations are eligibility intent only. Final pricing
  -- entitlements require selected commercial tier and provider price mapping.
  entitlement_active := false;

  insert into public.website_reservations (
    name,
    email,
    company,
    fleet_size,
    requested_cohort,
    assigned_cohort,
    intended_billing_provider,
    pricing_lock_tier,
    status,
    source
  )
  values (
    trim(p_name),
    normalized_email,
    nullif(trim(coalesce(p_company, '')), ''),
    nullif(trim(coalesce(p_fleet_size, '')), ''),
    p_requested_cohort,
    p_requested_cohort,
    p_intended_billing_provider,
    case
      when p_requested_cohort = 'founder_50' then 'pilot_enrollment'
      when p_requested_cohort = 'launch_500' then 'second_enrollment'
      else 'standard'
    end,
    'submitted',
    p_source
  )
  returning * into existing_row;

  update public.launch_program_state
    set slots_reserved = slots_reserved + 1
    where program_key = p_requested_cohort;

  insert into public.reservation_events (reservation_id, event_type, actor_type, metadata)
  values (
    existing_row.id,
    'reservation_submitted',
    'public_visitor',
    jsonb_build_object('source', p_source, 'intended_billing_provider', p_intended_billing_provider)
  );

  if entitlement_active then
    insert into public.pricing_entitlements (
      reservation_id,
      email,
      cohort,
      pricing_lock_tier,
      monthly_price,
      annual_price,
      intended_billing_provider,
      status,
      active,
      source
    )
    values (
      existing_row.id,
      normalized_email,
      p_requested_cohort,
      existing_row.pricing_lock_tier,
      program_row.monthly_price,
      program_row.annual_price,
      p_intended_billing_provider,
      'pending_review',
      false,
      'website_reservation'
    );
  end if;

  reservation_id := existing_row.id;
  already_exists := false;
  assigned_cohort := existing_row.assigned_cohort;
  pricing_lock_tier := existing_row.pricing_lock_tier;
  return next;
end;
$$;

alter table public.launch_program_state enable row level security;
alter table public.website_reservations enable row level security;
alter table public.reservation_events enable row level security;
alter table public.pricing_entitlements enable row level security;
alter table public.support_intake enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.system_health_notices enable row level security;
alter table public.admin_audit_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'system_health_notices'
      and policyname = 'Public can read visible health notices'
  ) then
    create policy "Public can read visible health notices"
      on public.system_health_notices
      for select
      to anon, authenticated
      using (public_visible = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'website_reservations'
      and policyname = 'Public can submit website reservations'
  ) then
    create policy "Public can submit website reservations"
      on public.website_reservations
      for insert
      to anon, authenticated
      with check (
        status = 'submitted'
        and requested_cohort in ('founder_50', 'launch_500', 'standard_future')
        and assigned_cohort in ('founder_50', 'launch_500', 'standard_future')
        and intended_billing_provider in ('stripe_web', 'apple_app_store', 'google_play', 'undecided')
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'support_intake'
      and policyname = 'Public can submit support intake'
  ) then
    create policy "Public can submit support intake"
      on public.support_intake
      for insert
      to anon, authenticated
      with check (
        status = 'new'
        and intake_type in ('support', 'feedback', 'pilot_inquiry', 'launch_inquiry', 'bug_report')
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'newsletter_subscribers'
      and policyname = 'Public can subscribe to newsletter'
  ) then
    create policy "Public can subscribe to newsletter"
      on public.newsletter_subscribers
      for insert
      to anon, authenticated
      with check (status = 'subscribed');
  end if;
end $$;

grant execute on function public.submit_website_reservation(
  text, text, text, text, text, text, text
) to anon, authenticated;

-- Admin/founder review should be implemented with Supabase Auth plus an explicit
-- allowlist or custom claim before granting select/update on private tables.
-- Service-role server routes bypass RLS for operational writes and review tools.
