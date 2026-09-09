-- One-time migration: creates the four tables backing the "22 For the 22"
-- free 22-hour endurance challenge & giveaway (event_config,
-- event_registrations, event_activity_log, giveaway_prizes), their RLS
-- policies, and widens journal_entries.primary_category /
-- mission_partners.partner_type to accept the event's new values. Run this
-- manually, once, against the live Supabase project. See each table's own
-- comment in schema.sql for full rationale.

begin;

-- ---------------------------------------------------------------------------
-- event_config
-- ---------------------------------------------------------------------------
create table if not exists public.event_config (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null unique,
  series_slug text not null default '22-for-the-22',
  event_year integer not null,
  event_name text not null default '22 For the 22',
  tagline text not null default '22 Hours. One Mission. Keep Moving.',

  starts_at timestamptz not null,
  ends_at timestamptz not null,

  status_override text check (status_override is null or status_override in ('pre', 'live', 'complete')),

  registration_open boolean not null default true,

  fundraising_goal numeric(12, 2) not null default 0 check (fundraising_goal >= 0),
  amount_raised numeric(12, 2) not null default 0 check (amount_raised >= 0),

  merch_url text,
  donate_url text,

  official_rules_body text,

  winner_announcement text,

  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists event_config_series_year_idx on public.event_config (series_slug, event_year);

comment on table public.event_config is
  'Single active row per annual instance of a recurring endurance-challenge event. See getCurrentEventConfig() in src/lib/data/event-config.ts.';

-- ---------------------------------------------------------------------------
-- event_registrations
-- ---------------------------------------------------------------------------
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_id uuid not null references public.event_config (id) on delete cascade,

  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),

  first_name text not null,
  last_name text not null,
  email text not null,
  city text not null,
  state text not null,
  phone text,

  participation_type text not null check (participation_type in ('solo', 'team')),
  team_name text,
  team_captain boolean not null default false,

  disciplines text[] not null check (
    disciplines <@ array['run', 'ruck', 'ride', 'walk', 'row', 'swim', 'hike', 'other']::text[]
    and array_length(disciplines, 1) > 0
  ),
  discipline_other_note text,
  participation_reason text,

  waiver_accepted boolean not null check (waiver_accepted = true),
  email_consent boolean not null default false,

  giveaway_eligible boolean not null default true,

  admin_notes text,

  constraint event_registrations_team_name_required check (
    participation_type = 'solo' or (team_name is not null and length(trim(team_name)) > 0)
  )
);

create index if not exists event_registrations_event_id_idx on public.event_registrations (event_id);
create index if not exists event_registrations_status_idx on public.event_registrations (status);
create index if not exists event_registrations_created_at_idx on public.event_registrations (created_at desc);
create unique index if not exists event_registrations_event_email_idx
  on public.event_registrations (event_id, lower(email));

-- ---------------------------------------------------------------------------
-- event_activity_log
-- ---------------------------------------------------------------------------
create table if not exists public.event_activity_log (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.event_config (id) on delete cascade,
  created_at timestamptz not null default now(),
  logged_at timestamptz not null default now(),
  hour_label text not null,
  activity_label text not null,
  note text,
  display_order integer not null default 0
);

create index if not exists event_activity_log_event_id_idx on public.event_activity_log (event_id, display_order);

-- ---------------------------------------------------------------------------
-- giveaway_prizes
-- ---------------------------------------------------------------------------
create table if not exists public.giveaway_prizes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.event_config (id) on delete cascade,
  created_at timestamptz not null default now(),
  display_order integer not null default 0,
  partner_id uuid references public.mission_partners (id) on delete set null,
  brand text not null,
  prize_name text not null,
  quantity integer not null default 1,
  winner_count integer not null default 1 check (winner_count > 0),
  retail_value_min numeric,
  retail_value_max numeric,
  image_url text,
  status text not null default 'confirmed' check (status in ('confirmed', 'received')),
  website_url text,
  donor_note text,
  featured boolean not null default false
);

create index if not exists giveaway_prizes_event_id_idx on public.giveaway_prizes (event_id, display_order);

-- ---------------------------------------------------------------------------
-- Widen journal_entries.primary_category and mission_partners.partner_type
-- for databases where these tables already existed before the new values
-- were added to their create table statements. Safe to re-run.
-- ---------------------------------------------------------------------------
alter table public.journal_entries drop constraint if exists journal_entries_primary_category_check;
alter table public.journal_entries add constraint journal_entries_primary_category_check check (
  primary_category in (
    'Training', 'Campaign', 'Mighty Oaks', 'Project Echelon',
    'Support', 'Race Prep', 'Milestones', '22 For the 22'
  )
);

alter table public.mission_partners drop constraint if exists mission_partners_partner_type_check;
alter table public.mission_partners add constraint mission_partners_partner_type_check check (
  partner_type is null or partner_type in (
    'campaign-sponsor', 'gear-partner', 'service-partner', 'print-partner',
    'accommodations-partner', 'training-partner', 'raffle-supporter', 'giveaway-supporter'
  )
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.event_config enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_activity_log enable row level security;
alter table public.giveaway_prizes enable row level security;

drop policy if exists "event config is publicly readable" on public.event_config;
create policy "event config is publicly readable"
  on public.event_config for select
  to anon, authenticated
  using (true);

drop policy if exists "event activity log is publicly readable" on public.event_activity_log;
create policy "event activity log is publicly readable"
  on public.event_activity_log for select
  to anon, authenticated
  using (true);

drop policy if exists "giveaway prizes are publicly readable" on public.giveaway_prizes;
create policy "giveaway prizes are publicly readable"
  on public.giveaway_prizes for select
  to anon, authenticated
  using (true);

-- No policies on public.event_registrations: default-deny for
-- anon/authenticated, identical trust model to public.triathlon_team_applications.

-- ---------------------------------------------------------------------------
-- Seed the 2026 event row so the site has a live event to point at.
-- ---------------------------------------------------------------------------
insert into public.event_config (
  event_slug, series_slug, event_year, event_name, tagline,
  starts_at, ends_at, registration_open, fundraising_goal, amount_raised,
  merch_url
)
values (
  '22-for-the-22-2026', '22-for-the-22', 2026, '22 For the 22', '22 Hours. One Mission. Keep Moving.',
  '2026-11-21T16:00:00Z', '2026-11-22T14:00:00Z', true, 22000, 0,
  'https://www.bonfire.com/22-for-the-22/'
)
on conflict (event_slug) do nothing;

commit;
