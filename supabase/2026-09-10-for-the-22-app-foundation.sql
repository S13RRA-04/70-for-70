-- One-time migration: creates the full 'For the 22' participant-app
-- schema (profiles, events, registrations, activities, milestones,
-- milestone_completions, notifications), its triggers, and its RLS
-- policies. See schema.sql's matching section for full rationale.
-- Run this manually, once, against the live Supabase project.

begin;

-- =============================================================================
-- For the 22 (app.forthe22.org) — participant platform
--
-- Everything below is a genuinely different trust model from the rest of
-- this file: real per-user Row Level Security (auth.uid()-scoped policies),
-- not "public-read, service-role-write." This is the schema backing the
-- installable participant app — accounts, event registration inside the
-- app (distinct from the anonymous public.event_registrations form above),
-- session logging, and milestones. "22 For the 22" is represented as one
-- row in public.events, not hardcoded — see events.challenge_type/
-- required_sessions/minimum_session_minutes/minimum_total_minutes, so a
-- future event (a different session count, a distance challenge, etc.)
-- is a new row and new challenge_type value, never a schema change.
--
-- public.mission_partners (already public-read above) doubles as this
-- app's "supporters" list — no separate table. app.forthe22.org queries it
-- the same way the marketing site does.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
--
-- One row per Supabase Auth user, id = auth.users.id directly (Supabase's
-- standard pattern) rather than a separate surrogate id + user_id pair —
-- auto-created by the handle_new_user() trigger below the instant a user
-- signs up, so the app never has to handle "authenticated but no profile
-- yet." Visibility is participant-controlled and defaults to the most
-- private option; email/phone are intentionally NOT columns here (they
-- live on auth.users, which RLS never exposes to other users — see the
-- policies below) so there's no risk of accidentally selecting them into
-- a public/participants-only read.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  city text,
  state text,
  phone text,
  bio text,
  avatar_url text,
  visibility text not null default 'private' check (visibility in ('private', 'participants_only', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per app.forthe22.org participant account, id = auth.users.id. Auto-created by handle_new_user().';

-- ---------------------------------------------------------------------------
-- handle_new_user — auto-provisions a profiles row the instant someone
-- signs up, reading first_name/last_name/city/state/phone out of the
-- signUp() call's options.data (user_metadata). security definer so it can
-- write to public.profiles despite running as part of an auth.users insert
-- the new user's own role has no direct grant on — same idiom as every
-- Supabase project that auto-creates a profile row this way.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, city, state, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- events
--
-- The app's own challenge-engine event catalog — distinct from
-- public.event_config above, which drives the public marketing page's
-- copy/fundraising-goal/rules override. This table is what the app
-- registers/tracks progress against. challenge_type is deliberately
-- open-ended (see the future-types comment on its check constraint) so
-- adding a new kind of challenge later is a new row, not a migration.
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  series_slug text,
  event_year integer,
  name text not null,
  short_name text,
  description text,
  hero_image text,

  -- The physical event window (participants may complete sessions any time
  -- in here) — kept independently configurable from the sweepstakes
  -- registration-close time on public.event_config, which is a *different*
  -- date. Never assume these two are the same instant.
  start_at timestamptz not null,
  end_at timestamptz not null,
  registration_open_at timestamptz,
  registration_close_at timestamptz,

  status text not null default 'draft' check (status in ('draft', 'open', 'active', 'complete', 'archived')),

  -- 'session_count' is the only type actually implemented in MVP (22 For
  -- the 22) — 'distance', 'duration', 'fundraising', 'multi_day', 'team',
  -- 'race', 'recurring' are reserved for later challenge types per the
  -- future-proofing requirement; the app must not hardcode logic assuming
  -- 'session_count' is the only value that will ever exist.
  event_type text not null default 'session_count' check (
    event_type in ('session_count', 'distance', 'duration', 'fundraising', 'multi_day', 'team', 'race', 'recurring')
  ),

  required_sessions integer,
  minimum_session_minutes integer,
  minimum_total_minutes integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_slug_idx on public.events (slug);
create index if not exists events_series_year_idx on public.events (series_slug, event_year);

comment on table public.events is
  'The app''s challenge-engine event catalog. "22 For the 22" is a row here (challenge_type=session_count), not hardcoded logic.';

-- ---------------------------------------------------------------------------
-- registrations
--
-- A participant's registration for an app event. Distinct from the public,
-- anonymous public.event_registrations table (the sweepstakes-entry form on
-- the marketing site) — linked_event_registration_id optionally connects
-- the two once a participant's verified account email is matched against a
-- pre-existing anonymous registration (see the "link my registration"
-- flow), but an app registration never itself grants or affects giveaway
-- eligibility — that stays entirely governed by public.event_registrations
-- and the Official Rules.
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  registration_type text not null default 'solo' check (registration_type in ('solo', 'team')),
  team_name text,

  waiver_version text,
  waiver_accepted_at timestamptz,

  -- Set once, the first time a matching public.event_registrations row is
  -- found for this user's verified email — see 22ForTheApp's link flow.
  -- Never set from an unverified name match.
  linked_event_registration_id uuid references public.event_registrations (id) on delete set null,

  created_at timestamptz not null default now(),

  constraint registrations_team_name_required check (
    registration_type = 'solo' or (team_name is not null and length(trim(team_name)) > 0)
  )
);

create unique index if not exists registrations_event_user_idx on public.registrations (event_id, user_id);
create index if not exists registrations_user_id_idx on public.registrations (user_id);

-- ---------------------------------------------------------------------------
-- activities
--
-- One row per logged movement session. Every stored row already satisfies
-- its event's minimum-session-minutes requirement — enforced by the
-- inserting API route's Zod validation (event-configurable, so it can't
-- live as a fixed table-level check), not just this table's basic sanity
-- floor. "Only one completion credit per recorded session, never split a
-- longer session into multiple credits" (per the session-logging spec) is
-- structural here: session count toward a challenge is simply
-- count(activities), regardless of how long any individual row is.
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,

  activity_type text not null check (
    activity_type in ('run', 'ruck', 'ride', 'walk', 'row', 'swim', 'hike', 'strength', 'mobility', 'adaptive', 'other')
  ),
  duration_minutes integer not null check (duration_minutes > 0),
  distance numeric,
  distance_unit text check (distance_unit is null or distance_unit in ('miles', 'kilometers', 'yards', 'meters')),
  activity_date date not null,
  started_at time,
  notes text,
  photo_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_user_event_idx on public.activities (user_id, event_id);
create index if not exists activities_registration_id_idx on public.activities (registration_id);

-- ---------------------------------------------------------------------------
-- milestones
--
-- Global reference data — the thresholds/copy/share-template for one
-- event's milestone states (1, 5, 11, 17, 22 sessions for 22 For the 22).
-- Public-read, admin-managed, same trust model as giveaway_prizes.
-- ---------------------------------------------------------------------------
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  threshold integer not null,
  title text not null,
  message text not null,
  share_template text,
  display_order integer not null default 0
);

create index if not exists milestones_event_id_idx on public.milestones (event_id, display_order);
create unique index if not exists milestones_event_threshold_idx on public.milestones (event_id, threshold);

-- ---------------------------------------------------------------------------
-- milestone_completions
--
-- Written exclusively by the handle_activity_milestone_check() trigger
-- below (security definer), never by a client-facing insert policy — a
-- participant reporting they "hit" a milestone must be backed by an actual
-- qualifying-session count, not a value the client could fabricate.
-- ---------------------------------------------------------------------------
create table if not exists public.milestone_completions (
  id uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  registration_id uuid not null references public.registrations (id) on delete cascade,
  completed_at timestamptz not null default now()
);

create unique index if not exists milestone_completions_unique_idx on public.milestone_completions (milestone_id, user_id);
create index if not exists milestone_completions_user_id_idx on public.milestone_completions (user_id);

-- ---------------------------------------------------------------------------
-- handle_activity_milestone_check — after each activity insert, counts the
-- user's qualifying sessions for that event and inserts a
-- milestone_completions row for any threshold newly reached that doesn't
-- already have one. security definer for the same reason as
-- handle_new_user() — a participant has no direct insert grant on
-- milestone_completions.
-- ---------------------------------------------------------------------------
create or replace function public.handle_activity_milestone_check()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  session_count integer;
  reg_id uuid;
begin
  select count(*) into session_count
  from public.activities
  where user_id = new.user_id and event_id = new.event_id;

  select id into reg_id
  from public.registrations
  where user_id = new.user_id and event_id = new.event_id
  limit 1;

  if reg_id is null then
    return new;
  end if;

  insert into public.milestone_completions (milestone_id, user_id, registration_id)
  select m.id, new.user_id, reg_id
  from public.milestones m
  where m.event_id = new.event_id and m.threshold <= session_count
  on conflict (milestone_id, user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_activity_milestone_check on public.activities;
create trigger on_activity_milestone_check
  after insert on public.activities
  for each row execute function public.handle_activity_milestone_check();

-- ---------------------------------------------------------------------------
-- notifications
--
-- In-app notification records — no push/email delivery mechanism yet (see
-- src/lib/notifications.ts's "TODO: not yet delivered" pattern for how
-- this codebase handles that gap elsewhere). Written server-side only; a
-- participant may read and mark their own as read, never insert.
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- For the 22 app — Row Level Security
--
-- Real per-user policies (auth.uid()-scoped), not the public-read/
-- service-role-write model used throughout the rest of this file.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.activities enable row level security;
alter table public.milestones enable row level security;
alter table public.milestone_completions enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "users can read their own profile" on public.profiles;
create policy "users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "participants-only profiles are readable by any authenticated user" on public.profiles;
create policy "participants-only profiles are readable by any authenticated user"
  on public.profiles for select
  to authenticated
  using (visibility = 'participants_only');

drop policy if exists "public profiles are readable by anyone" on public.profiles;
create policy "public profiles are readable by anyone"
  on public.profiles for select
  to anon, authenticated
  using (visibility = 'public');

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- No insert policy on public.profiles: rows are created only by the
-- handle_new_user() trigger (security definer), never client-inserted.
-- No delete policy: profile rows are removed via the auth.users cascade
-- when an account is deleted, not directly.

drop policy if exists "events are publicly readable" on public.events;
create policy "events are publicly readable"
  on public.events for select
  to anon, authenticated
  using (true);
-- No insert/update/delete policy on public.events: managed only via the
-- admin app using the service-role client.

drop policy if exists "users can read their own registrations" on public.registrations;
create policy "users can read their own registrations"
  on public.registrations for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can create their own registrations" on public.registrations;
create policy "users can create their own registrations"
  on public.registrations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users can update their own registrations" on public.registrations;
create policy "users can update their own registrations"
  on public.registrations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users can read their own activities" on public.activities;
create policy "users can read their own activities"
  on public.activities for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can create their own activities" on public.activities;
create policy "users can create their own activities"
  on public.activities for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users can update their own activities" on public.activities;
create policy "users can update their own activities"
  on public.activities for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users can delete their own activities" on public.activities;
create policy "users can delete their own activities"
  on public.activities for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "milestones are publicly readable" on public.milestones;
create policy "milestones are publicly readable"
  on public.milestones for select
  to anon, authenticated
  using (true);

drop policy if exists "users can read their own milestone completions" on public.milestone_completions;
create policy "users can read their own milestone completions"
  on public.milestone_completions for select
  to authenticated
  using (auth.uid() = user_id);
-- No insert/update/delete policy on public.milestone_completions: written
-- exclusively by the handle_activity_milestone_check() trigger.

drop policy if exists "users can read their own notifications" on public.notifications;
create policy "users can read their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can mark their own notifications read" on public.notifications;
create policy "users can mark their own notifications read"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
-- No insert policy on public.notifications: written server-side only, once
-- a real delivery mechanism exists (see this table's own comment above).

commit;
