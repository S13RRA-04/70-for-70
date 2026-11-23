-- Who actually collected a donation's money, for bookkeeping
-- (GET /api/finance/transactions, docs/finance-api.md).
--
-- organization_benefited says who a gift is *for*; it doesn't say who took
-- the money. Booth cash is collected by For The 22 and passed on later, while
-- OneCause/PayPal gifts go straight to the beneficiary. Without this column
-- the finance API had to guess, and it guessed "pass-through" for everything.
--
--   for_the_22   For The 22 collected it (booth cash, Venmo) and owes it onward
--   beneficiary  Donor gave directly on the beneficiary's own platform
--   null         Not recorded. The API reports received_by/pass_through as unknown.
--
-- Existing rows stay null on purpose: set each one in /admin/donations
-- rather than backfilling a guess. Idempotent.

alter table public.donations add column if not exists collected_by text;
alter table public.donations drop constraint if exists donations_collected_by_check;
alter table public.donations add constraint donations_collected_by_check
  check (collected_by is null or collected_by in ('for_the_22', 'beneficiary'));

comment on column public.donations.collected_by is
  'Who collected the money: for_the_22 (booth cash, Venmo; passed on later), beneficiary (given directly on their platform), or null (not recorded). Drives the finance API''s received_by/pass_through.';
