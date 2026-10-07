-- Human navigation requests and private resource outcome feedback.
create table if not exists public.resource_navigation_requests (
  id uuid primary key default gen_random_uuid(),
  seeking_for text not null, population text not null, state text, need text not null,
  priorities text, privacy_concerns text, avoid text, email text not null,
  status text not null default 'new' check (status in ('new','in-progress','resolved','closed')),
  admin_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.resource_feedback (
  id uuid primary key default gen_random_uuid(), resource_name text not null, helpful boolean not null,
  contacted text not null check (contacted in ('yes','not-yet','prefer-not-to-say')),
  connection text not null check (connection in ('yes','no','waiting','prefer-not-to-say','not-applicable')),
  note text, reviewed boolean not null default false, created_at timestamptz not null default now()
);
create index if not exists resource_navigation_requests_status_idx on public.resource_navigation_requests (status, created_at desc);
create index if not exists resource_feedback_reviewed_idx on public.resource_feedback (reviewed, created_at desc);
alter table public.resource_navigation_requests enable row level security;
alter table public.resource_feedback enable row level security;
revoke all on table public.resource_navigation_requests from anon, authenticated;
revoke all on table public.resource_feedback from anon, authenticated;
