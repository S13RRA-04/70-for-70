-- One-time migration: adds the For The 22: Live concert series tables
-- (live_events, live_performers, live_auction_items) and their public-read
-- RLS policies. Safe to re-run — every statement is idempotent. See
-- schema.sql's "live_events / live_performers / live_auction_items" section
-- for the canonical, documented version of this shape. Run this manually,
-- once, against the live Supabase project (SQL Editor or `supabase db
-- query`), same workflow as every other dated migration in this directory.

begin;

create table if not exists public.live_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  venue_name text,
  venue_city text,
  venue_state text,
  starts_at timestamptz,
  ends_at timestamptz,
  description text,
  hero_image_url text,
  ticket_url text,
  published boolean not null default false,
  display_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists live_events_slug_idx on public.live_events (slug);
create index if not exists live_events_published_idx on public.live_events (published, starts_at);

create table if not exists public.live_performers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.live_events (id) on delete cascade,
  name text not null,
  billing text,
  bio text,
  image_url text,
  display_order integer not null default 0
);

create index if not exists live_performers_event_id_idx on public.live_performers (event_id, display_order);

create table if not exists public.live_auction_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.live_events (id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  starting_bid numeric(10, 2),
  bidding_url text,
  status text not null default 'open' check (status in ('open', 'closed')),
  display_order integer not null default 0
);

create index if not exists live_auction_items_event_id_idx on public.live_auction_items (event_id, display_order);

alter table public.live_events enable row level security;
alter table public.live_performers enable row level security;
alter table public.live_auction_items enable row level security;

drop policy if exists "published live events are publicly readable" on public.live_events;
create policy "published live events are publicly readable"
  on public.live_events for select
  to anon, authenticated
  using (published = true);

drop policy if exists "performers for published live events are publicly readable" on public.live_performers;
create policy "performers for published live events are publicly readable"
  on public.live_performers for select
  to anon, authenticated
  using (exists (select 1 from public.live_events e where e.id = event_id and e.published = true));

drop policy if exists "auction items for published live events are publicly readable" on public.live_auction_items;
create policy "auction items for published live events are publicly readable"
  on public.live_auction_items for select
  to anon, authenticated
  using (exists (select 1 from public.live_events e where e.id = event_id and e.published = true));

commit;
