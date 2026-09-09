-- One-time migration: creates public.triathlon_team_applications (if not
-- already present) and its RLS policy. Run this manually, once, against
-- the live Supabase project. See the table's own comment in schema.sql for
-- the full rationale.

begin;

create table if not exists public.triathlon_team_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'declined', 'waitlisted')),

  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  state text not null,

  experience_level text not null check (
    experience_level in ('First-time triathlete', 'Sprint', 'Olympic', '70.3', 'Full IRONMAN', 'Multiple distances')
  ),
  years_in_triathlon text not null,
  preferred_distance text not null,

  registered_for_race boolean not null default false,
  race_name text,
  race_date date,
  race_distance text,
  race_location text,
  needs_race_help boolean,

  mission_reason text not null,

  fundraising_experience boolean not null default false,
  fundraising_goal text not null,

  instagram text,
  facebook text,
  strava text,
  other_social text,

  apparel_size text not null,

  ack_costs boolean not null,
  ack_safety boolean not null,
  ack_conduct boolean not null,

  admin_notes text
);

create index if not exists triathlon_team_applications_status_idx
  on public.triathlon_team_applications (status);
create index if not exists triathlon_team_applications_created_at_idx
  on public.triathlon_team_applications (created_at desc);

alter table public.triathlon_team_applications enable row level security;

commit;
