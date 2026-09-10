-- One-time migration: widens event_registrations.disciplines to include the
-- three new activity types added when 22 For the 22 moved from a
-- continuous-endurance format to 22 sessions of >=22 minutes each
-- (Strength Training, Yoga / Mobility, Adaptive Exercise — see
-- "Activities You May Use" on the registration form). Also updates the
-- event's stored tagline to match the new hero copy. Run this manually,
-- once, against the live Supabase project.

begin;

alter table public.event_registrations drop constraint if exists event_registrations_disciplines_check;
alter table public.event_registrations add constraint event_registrations_disciplines_check check (
  disciplines <@ array['run', 'ruck', 'ride', 'walk', 'row', 'swim', 'hike', 'strength', 'mobility', 'adaptive', 'other']::text[]
  and array_length(disciplines, 1) > 0
);

update public.event_config
set tagline = '22 Minutes. 22 Times. One Mission.'
where event_slug = '22-for-the-22-2026';

commit;
