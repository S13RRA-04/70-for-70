-- One-time migration: removes event_config's independent fundraising_goal/
-- amount_raised columns. 22 For the 22 previously tracked its own hand-
-- maintained $ goal separate from the canonical public.campaign row that
-- every other money display on the site reads from — a real inconsistency
-- (see the fundraising-architecture unification). 22 For the 22 now shows
-- non-financial stats (participants/teams, from the new
-- event_registration_stats view below) plus the shared mission total
-- instead. Run this manually, once, against the live Supabase project.

begin;

alter table public.event_config drop column if exists fundraising_goal;
alter table public.event_config drop column if exists amount_raised;

-- Real non-financial replacement stats — aggregated from actual
-- event_registrations rows, not hand-entered. Runs as the view owner
-- (service role), so it can read event_registrations (default-deny RLS,
-- service-role-only otherwise) while only ever exposing an aggregate count,
-- never a registrant's own row.
create or replace view public.event_registration_stats as
  select
    event_id,
    count(*) filter (where status = 'confirmed') as total_participants,
    count(distinct team_name) filter (where status = 'confirmed' and participation_type = 'team') as team_count
  from public.event_registrations
  group by event_id;

grant select on public.event_registration_stats to anon, authenticated;

commit;
