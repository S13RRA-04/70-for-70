-- One-time data fix: every mission_partners row other than GORUCK (already
-- tagged ['ruck'], see 2026-10-08-goruck-ruck-partner.sql) and the two
-- 22 For the 22 giveaway supporters (already tagged ['22-for-the-22']) is
-- actually a Tri For The 22 supporter, but had associated_campaigns left
-- null. That null let partner walls meant to be campaign-specific (Tri's
-- /sponsors, /become-a-partner, the campaign-home partner wall) render
-- every mission partner regardless of which effort they actually support —
-- the root cause of "GORUCK showing up as a Tri sponsor." Scoping every
-- untagged row to ['tri'] here, rather than listing names, so any future
-- untagged row doesn't silently reintroduce the same bug.
--
-- Safe/idempotent: only touches rows where associated_campaigns is still
-- null, so re-running it is a no-op. Run manually, once, against the live
-- Supabase project.

begin;

update public.mission_partners
set associated_campaigns = array['tri']
where associated_campaigns is null;

commit;
