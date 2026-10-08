-- Tracks whether a beneficiary's share of mission funds has actually been
-- sent — distinct from getAllocationBreakdown()'s computed "amount verified
-- as raised for this org" (src/lib/data/allocation.ts, derived from verified
-- donations, never stored). The two can legitimately differ by timing: money
-- verified as raised for an org doesn't mean it's been wired yet. Nullable
-- and unset until an admin records a real distribution by hand (no admin UI
-- for public.partners exists — same as every other relationship field on
-- this table, e.g. agreement_status, relationship_start); never fabricated,
-- see src/components/partners/partner-card.tsx's "omit, don't fake" render.
alter table public.partners
  add column if not exists distribution_status text;

alter table public.partners
  drop constraint if exists partners_distribution_status_check;

alter table public.partners
  add constraint partners_distribution_status_check
  check (distribution_status is null or distribution_status in ('not_started', 'in_progress', 'distributed'));

-- Actual dollars disbursed so far — may be less than the live verified-
-- donations total above while a distribution is still in progress.
alter table public.partners
  add column if not exists distributed_amount numeric(10, 2);

alter table public.partners
  add column if not exists last_distributed_at date;
