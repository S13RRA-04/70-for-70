-- One-time migration: adds the moderated public messages board defined in
-- supabase/schema.sql. Public clients may read approved rows only; creation
-- and moderation continue through server-side service-role code.

begin;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  anonymous boolean not null default false,
  message text not null,
  approved boolean not null default false,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists messages_approved_idx
  on public.messages (approved);

create index if not exists messages_submitted_at_idx
  on public.messages (submitted_at desc);

alter table public.messages enable row level security;

drop policy if exists "approved messages are publicly readable" on public.messages;
create policy "approved messages are publicly readable"
  on public.messages for select
  to anon, authenticated
  using (approved = true);

commit;
