-- One-time migration: adds journal_entries.image_alt — descriptive alt text
-- for image_url, distinct from the entry title. Every hero/thumbnail image
-- previously rendered with alt={entry.title}, which duplicates on-page copy
-- instead of describing what the photo actually shows (see journal-card.tsx,
-- journal/[slug]/page.tsx). Nullable and non-destructive; existing rows keep
-- falling back to the title at render time until backfilled by hand through
-- the admin journal editor. Run this manually, once, against the live
-- Supabase project.

begin;

alter table public.journal_entries add column if not exists image_alt text;

comment on column public.journal_entries.image_alt is
  'Descriptive alt text for image_url — not a restatement of the title. Null falls back to the entry title at render time.';

commit;
