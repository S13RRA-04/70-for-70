-- One-time migration: adds fair-market-value sponsorship tier recognition
-- to public.mission_partners, alongside the existing partner_type (internal
-- machine key) and relationship_label (free-text display string) columns.
--
-- tier: the formal recognition level ($ threshold, cumulative cash + in-kind
-- fair-market value) — see MISSION_PARTNER_TIERS in src/lib/constants.ts for
-- the public benefits copy per level. Null = not yet classified.
--
-- designation: an independent functional label (e.g. "Official Bicycle
-- Support Partner", future "Official Print Partner") — deliberately NOT
-- derived from tier; a partner can have a designation with no tier assigned
-- yet (monetary classification pending), a tier with no designation, both,
-- or neither. See src/app/sponsors/page.tsx.
--
-- Non-destructive, re-run-safe. Run manually, once, against the live
-- Supabase project:
--   supabase db query --linked --project-ref wjwgzphvpulkofvuksko -f supabase/2026-09-14-mission-partner-tiers.sql

begin;

alter table public.mission_partners add column if not exists tier text;
alter table public.mission_partners add column if not exists designation text;

alter table public.mission_partners drop constraint if exists mission_partners_tier_check;
alter table public.mission_partners add constraint mission_partners_tier_check check (
  tier is null or tier in (
    'presenting-partner', 'mission-sponsor', 'mission-partner',
    'advocate', 'ally', 'campaign-supporter'
  )
);

commit;
