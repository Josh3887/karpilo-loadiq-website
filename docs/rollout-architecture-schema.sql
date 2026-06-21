-- Karpilo LoadIQ website rollout architecture
-- Additive schema draft. Review against the live Supabase project before applying.
-- Purpose: admin-controlled rollout timing, live slots, onboarding pauses, and telemetry.

create extension if not exists pgcrypto;

create table if not exists public.rollout_configuration (
  id uuid primary key default gen_random_uuid(),
  config_key text not null unique,
  config_value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rollout_phases (
  id uuid primary key default gen_random_uuid(),
  phase_key text not null unique
    check (phase_key in (
      'PRELAUNCH_WAITLIST',
      'FOUNDER_PILOT',
      'CONTROLLED_PUBLIC_LAUNCH',
      'EXPANSION_ACCESS',
      'GENERAL_AVAILABILITY'
    )),
  sort_order integer not null,
  title text not null,
  short_label text not null,
  capacity integer check (capacity is null or capacity >= 0),
  reserved_slots integer not null default 0 check (reserved_slots >= 0),
  accepted_slots integer not null default 0 check (accepted_slots >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  duration_days integer check (duration_days is null or duration_days > 0),
  status text not null default 'upcoming'
    check (status in ('upcoming', 'active', 'paused', 'full', 'closed', 'complete')),
  accepting_reservations boolean not null default false,
  description text not null,
  expectation text not null,
  cta_label text not null,
  target_route text not null default '/contact',
  admin_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  check (capacity is null or reserved_slots <= capacity),
  check (capacity is null or accepted_slots <= capacity)
);

create table if not exists public.rollout_phase_events (
  id uuid primary key default gen_random_uuid(),
  phase_key text not null references public.rollout_phases(phase_key),
  event_type text not null,
  previous_status text,
  next_status text,
  actor_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rollout_waitlist (
  id uuid primary key default gen_random_uuid(),
  phase_key text not null references public.rollout_phases(phase_key),
  name text not null,
  email text not null,
  company text,
  fleet_size text,
  intended_billing_provider text not null default 'undecided'
    check (intended_billing_provider in ('stripe_web', 'apple_app_store', 'google_play', 'undecided')),
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'invited', 'accepted', 'waitlisted', 'rejected', 'canceled')),
  source text not null default 'website',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists rollout_waitlist_email_phase_uidx
  on public.rollout_waitlist (lower(email), phase_key);

create table if not exists public.rollout_access_events (
  id uuid primary key default gen_random_uuid(),
  rollout_waitlist_id uuid references public.rollout_waitlist(id) on delete set null,
  phase_key text not null references public.rollout_phases(phase_key),
  event_type text not null,
  actor_type text not null default 'system',
  actor_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.system_health_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null default 'info'
    check (severity in ('info', 'degraded', 'maintenance', 'incident')),
  status text not null default 'active'
    check (status in ('active', 'scheduled', 'resolved')),
  affects_onboarding boolean not null default false,
  public_visible boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  resolved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
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

drop trigger if exists rollout_configuration_touch_updated_at on public.rollout_configuration;
create trigger rollout_configuration_touch_updated_at
before update on public.rollout_configuration
for each row execute function public.touch_updated_at();

drop trigger if exists rollout_phases_touch_updated_at on public.rollout_phases;
create trigger rollout_phases_touch_updated_at
before update on public.rollout_phases
for each row execute function public.touch_updated_at();

drop trigger if exists rollout_waitlist_touch_updated_at on public.rollout_waitlist;
create trigger rollout_waitlist_touch_updated_at
before update on public.rollout_waitlist
for each row execute function public.touch_updated_at();

drop trigger if exists system_health_events_touch_updated_at on public.system_health_events;
create trigger system_health_events_touch_updated_at
before update on public.system_health_events
for each row execute function public.touch_updated_at();

insert into public.rollout_phases (
  phase_key,
  sort_order,
  title,
  short_label,
  capacity,
  starts_at,
  ends_at,
  duration_days,
  status,
  accepting_reservations,
  description,
  expectation,
  cta_label,
  target_route
)
values
  (
    'PRELAUNCH_WAITLIST',
    0,
    'Prelaunch Waitlist',
    'Waitlist',
    null,
    '2026-05-13T13:00:00Z',
    '2026-06-27T13:00:00Z',
    45,
    'active',
    true,
    'Interest capture, infrastructure readiness, and operator expectation setting before pilot enrollment opens.',
    'No billing is active. Visitors may reserve eligibility and follow deployment updates.',
    'Reserve Eligibility',
    '/pilot-program'
  ),
  (
    'FOUNDER_PILOT',
    1,
    'Pilot Enrollment',
    'Pilot 100',
    100,
    '2026-06-27T13:00:00Z',
    '2026-08-11T13:00:00Z',
    45,
    'upcoming',
    true,
    'The first 100 approved users shape the operational pilot while deployment pressure remains controlled.',
    'Access is limited, reviewed, and may pause if infrastructure or support load requires it.',
    'Join Pilot Enrollment',
    '/pilot-program'
  ),
  (
    'CONTROLLED_PUBLIC_LAUNCH',
    2,
    'Controlled Public Launch',
    'Launch 250',
    250,
    '2026-08-11T13:00:00Z',
    '2026-10-10T13:00:00Z',
    60,
    'upcoming',
    true,
    'A measured public launch cohort expands access after discounted enrollment learning is incorporated.',
    'Launch access remains capacity-limited and may be throttled during operational events.',
    'Join Launch Queue',
    '/launch-promo'
  ),
  (
    'EXPANSION_ACCESS',
    3,
    'Expansion Access',
    'Expansion 250',
    250,
    '2026-10-10T13:00:00Z',
    '2027-01-08T14:00:00Z',
    90,
    'upcoming',
    true,
    'A second controlled expansion cohort validates readiness before open availability.',
    'Expansion timing can shift based on support load, system health, and rollout telemetry.',
    'Request Expansion Access',
    '/contact'
  ),
  (
    'GENERAL_AVAILABILITY',
    4,
    'General Availability',
    'Open Access',
    null,
    null,
    null,
    null,
    'upcoming',
    false,
    'Open access begins only when the product and support system are ready.',
    'No hardcoded public launch date is published until operational readiness is confirmed.',
    'Get Launch Updates',
    '/contact'
  )
on conflict (phase_key) do nothing;

create or replace function public.submit_rollout_waitlist(
  p_phase_key text,
  p_name text,
  p_email text,
  p_company text default null,
  p_fleet_size text default null,
  p_intended_billing_provider text default 'undecided',
  p_source text default 'website'
)
returns table (
  rollout_waitlist_id uuid,
  already_exists boolean,
  phase_key text,
  remaining_slots integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  phase_row public.rollout_phases%rowtype;
  waitlist_row public.rollout_waitlist%rowtype;
  normalized_email text;
begin
  normalized_email := lower(trim(p_email));

  if trim(coalesce(p_name, '')) = '' or normalized_email = '' then
    raise exception 'Name and email are required';
  end if;

  if p_intended_billing_provider not in ('stripe_web', 'apple_app_store', 'google_play', 'undecided') then
    p_intended_billing_provider := 'undecided';
  end if;

  select *
    into phase_row
    from public.rollout_phases
    where phase_key = p_phase_key
    for update;

  if not found then
    raise exception 'Rollout phase is unavailable';
  end if;

  if phase_row.status in ('paused', 'full', 'closed', 'complete') or not phase_row.accepting_reservations then
    raise exception 'Rollout phase is not accepting reservations';
  end if;

  select *
    into waitlist_row
    from public.rollout_waitlist
    where lower(email) = normalized_email
      and phase_key = p_phase_key;

  if found then
    insert into public.rollout_access_events (rollout_waitlist_id, phase_key, event_type, actor_type, metadata)
    values (
      waitlist_row.id,
      p_phase_key,
      'duplicate_submission',
      'public_visitor',
      jsonb_build_object('source', p_source)
    );

    rollout_waitlist_id := waitlist_row.id;
    already_exists := true;
    phase_key := p_phase_key;
    remaining_slots := case
      when phase_row.capacity is null then null
      else greatest(phase_row.capacity - phase_row.reserved_slots, 0)
    end;
    return next;
    return;
  end if;

  if phase_row.capacity is not null and phase_row.reserved_slots >= phase_row.capacity then
    update public.rollout_phases
      set status = 'full',
          accepting_reservations = false
      where phase_key = p_phase_key;
    raise exception 'Rollout phase is full';
  end if;

  insert into public.rollout_waitlist (
    phase_key,
    name,
    email,
    company,
    fleet_size,
    intended_billing_provider,
    status,
    source
  )
  values (
    p_phase_key,
    trim(p_name),
    normalized_email,
    nullif(trim(coalesce(p_company, '')), ''),
    nullif(trim(coalesce(p_fleet_size, '')), ''),
    p_intended_billing_provider,
    'submitted',
    p_source
  )
  returning * into waitlist_row;

  update public.rollout_phases
    set reserved_slots = reserved_slots + 1,
        status = case
          when capacity is not null and reserved_slots + 1 >= capacity then 'full'
          else status
        end,
        accepting_reservations = case
          when capacity is not null and reserved_slots + 1 >= capacity then false
          else accepting_reservations
        end
    where phase_key = p_phase_key
    returning * into phase_row;

  insert into public.rollout_access_events (rollout_waitlist_id, phase_key, event_type, actor_type, metadata)
  values (
    waitlist_row.id,
    p_phase_key,
    'waitlist_submitted',
    'public_visitor',
    jsonb_build_object('source', p_source, 'intended_billing_provider', p_intended_billing_provider)
  );

  rollout_waitlist_id := waitlist_row.id;
  already_exists := false;
  phase_key := p_phase_key;
  remaining_slots := case
    when phase_row.capacity is null then null
    else greatest(phase_row.capacity - phase_row.reserved_slots, 0)
  end;
  return next;
end;
$$;

alter table public.rollout_configuration enable row level security;
alter table public.rollout_phases enable row level security;
alter table public.rollout_phase_events enable row level security;
alter table public.rollout_waitlist enable row level security;
alter table public.rollout_access_events enable row level security;
alter table public.system_health_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'rollout_phases'
      and policyname = 'Public can read rollout phases'
  ) then
    create policy "Public can read rollout phases"
      on public.rollout_phases
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'system_health_events'
      and policyname = 'Public can read visible system health events'
  ) then
    create policy "Public can read visible system health events"
      on public.system_health_events
      for select
      to anon, authenticated
      using (public_visible = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'rollout_waitlist'
      and policyname = 'Public can submit rollout waitlist'
  ) then
    create policy "Public can submit rollout waitlist"
      on public.rollout_waitlist
      for insert
      to anon, authenticated
      with check (
        status = 'submitted'
        and intended_billing_provider in ('stripe_web', 'apple_app_store', 'google_play', 'undecided')
      );
  end if;
end $$;

grant execute on function public.submit_rollout_waitlist(
  text, text, text, text, text, text, text
) to anon, authenticated;

-- Founder/admin controls should use Supabase Auth plus an explicit allowlist or
-- custom claim before granting update/select on private event and waitlist data.
