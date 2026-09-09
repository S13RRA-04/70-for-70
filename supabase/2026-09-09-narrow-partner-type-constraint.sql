-- One-time migration: removes 'raffle-supporter' from
-- mission_partners.partner_type's check constraint. Run after
-- 2026-09-09-retire-raffle-into-giveaway.sql, which already reclassified
-- every 'raffle-supporter' row to 'giveaway-supporter' — this migration
-- just closes the loop at the database level so the value can't be
-- reintroduced. Non-destructive (a check constraint swap, not a table or
-- column drop) and trivially reversible by widening the constraint again.
-- Run this manually, once, against the live Supabase project.

begin;

alter table public.mission_partners drop constraint if exists mission_partners_partner_type_check;
alter table public.mission_partners add constraint mission_partners_partner_type_check check (
  partner_type is null or partner_type in (
    'campaign-sponsor', 'gear-partner', 'service-partner', 'print-partner',
    'accommodations-partner', 'training-partner', 'giveaway-supporter'
  )
);

commit;
