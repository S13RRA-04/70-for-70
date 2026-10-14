-- One-time migration: adds 'athlete-affiliation' to public.mission_partners'
-- partner_type values.
--
-- Distinct from every existing partner_type: those (gear-partner,
-- campaign-sponsor, team-benefit-partner, etc.) are organizations materially
-- supporting Tri For The 22 — cash, product, or services. An
-- athlete-affiliation row is the reverse relationship: a team/organization
-- Cody personally represents or belongs to (e.g. Blue70 Racing), which
-- carries no dollar/in-kind tier and must never be counted toward the public
-- "N Campaign Partners" stat or rendered in the general sponsor wall — see
-- isCampaignPartner() in src/lib/data/mission-partners.ts, updated alongside
-- this migration to exclude this type the same way it already excludes
-- giveaway-supporter. Rendered in its own "Athletic Affiliations" section —
-- see src/app/sponsors/page.tsx and src/components/campaign/
-- athlete-affiliation-feature.tsx.
--
-- Non-destructive, re-run-safe. Run manually, once, against the live
-- Supabase project:
--   supabase db query --linked --project-ref wjwgzphvpulkofvuksko -f supabase/2026-10-14-athlete-affiliation-partner-type.sql

begin;

alter table public.mission_partners drop constraint if exists mission_partners_partner_type_check;
alter table public.mission_partners add constraint mission_partners_partner_type_check check (
  partner_type is null or partner_type in (
    'campaign-sponsor', 'gear-partner', 'service-partner', 'print-partner',
    'accommodations-partner', 'training-partner', 'giveaway-supporter',
    'team-benefit-partner', 'athlete-affiliation'
  )
);

commit;
