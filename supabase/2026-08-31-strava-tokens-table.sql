-- One-time migration: creates public.strava_tokens on the live Supabase
-- project. schema.sql only runs against a fresh, empty project, so this
-- table needs to be created manually here, once, via the SQL Editor.
--
-- After running this, connect the account at /admin/strava (requires
-- STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET to be set — see README's
-- "Strava Training Snapshot" section for the full setup steps).

create table if not exists public.strava_tokens (
  id uuid primary key default gen_random_uuid(),
  strava_athlete_id text not null,
  access_token text not null,
  refresh_token text not null,
  scope text not null,
  expires_at timestamptz not null,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.strava_tokens is
  'Single row expected. Refresh tokens rotate on every use — always persist '
  'the new refresh_token returned alongside a refreshed access_token.';

alter table public.strava_tokens enable row level security;
-- No policies: default-deny for anon/authenticated, same as whoop_tokens —
-- only server-side code using the service-role key ever reads/writes this.
