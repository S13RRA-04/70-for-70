-- One-time migration: adds public.journal_comments — visitor comments on
-- individual journal entries, moderated before becoming public (same
-- approve-before-it's-public pattern as public.messages). See
-- supabase/schema.sql's own copy of this table/policy for the canonical,
-- idempotent definition this mirrors. Run this manually, once, against the
-- live Supabase project.

begin;

create table if not exists public.journal_comments (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  name text not null,
  email text,
  body text not null,
  approved boolean not null default false,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists journal_comments_entry_idx on public.journal_comments (journal_entry_id, submitted_at);
create index if not exists journal_comments_approved_idx on public.journal_comments (approved);

alter table public.journal_comments enable row level security;

drop policy if exists "approved journal comments are publicly readable" on public.journal_comments;
create policy "approved journal comments are publicly readable"
  on public.journal_comments for select
  to anon, authenticated
  using (approved = true);

commit;
