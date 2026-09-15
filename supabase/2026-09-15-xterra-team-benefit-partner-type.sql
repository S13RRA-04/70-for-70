-- One-time migration: adds 'team-benefit-partner' to
-- mission_partners.partner_type's check constraint — a partner whose
-- support is a discount/pricing arrangement for approved team members
-- (e.g. XTERRA WETSUITS' Clubs, Teams & Coaches Program), not a monetary
-- sponsorship tier. Drives the "Team Benefit" badge on /sponsors' public
-- supporter grid and the featured team-benefit section on /sponsors and
-- /get-involved/triathlon-team. Non-destructive (a check constraint
-- widening, not a table or column drop) and trivially reversible by
-- narrowing the constraint again. Run this manually, once, against the
-- live Supabase project — after this, insert the XTERRA WETSUITS row by
-- hand via the table editor (never via this migration): name "XTERRA
-- WETSUITS", relationship_label "Swim & Wetsuit Partner", partner_type
-- 'team-benefit-partner', tier null, designation null. Never store the
-- private discount code anywhere in this database — it is distributed to
-- approved team members outside this application.

begin;

alter table public.mission_partners drop constraint if exists mission_partners_partner_type_check;
alter table public.mission_partners add constraint mission_partners_partner_type_check check (
  partner_type is null or partner_type in (
    'campaign-sponsor', 'gear-partner', 'service-partner', 'print-partner',
    'accommodations-partner', 'training-partner', 'giveaway-supporter',
    'team-benefit-partner'
  )
);

commit;
