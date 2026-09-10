-- One-time migration: seeds the "22 For the 22" event row into the new
-- app-platform public.events table (distinct from public.event_config,
-- which drives the marketing page) and its five milestone rows. Physical
-- event window matches event_config.starts_at/ends_at exactly (the same
-- Nov 21-22 block) — deliberately NOT the sweepstakes registration-close
-- time (Nov 21, 9:59 AM CT), which stays governed only by the Official
-- Rules. Run this manually, once, against the live Supabase project.

begin;

insert into public.events (
  slug, series_slug, event_year, name, short_name, description,
  start_at, end_at, registration_open_at, registration_close_at,
  status, event_type, required_sessions, minimum_session_minutes, minimum_total_minutes
)
values (
  '22forthe22',
  '22-for-the-22',
  2026,
  '22 For the 22',
  '22 For the 22',
  '22 minutes of intentional activity, 22 times — 484 minutes of movement for veterans, first responders, and the communities that stand behind them.',
  '2026-11-21T16:00:00Z',
  '2026-11-22T14:00:00Z',
  now(),
  '2026-11-22T14:00:00Z',
  'open',
  'session_count',
  22,
  22,
  484
)
on conflict (slug) do nothing;

insert into public.milestones (event_id, threshold, title, message, share_template, display_order)
select e.id, m.threshold, m.title, m.message, m.share_template, m.display_order
from public.events e
cross join (
  values
    (1, 'THE FIRST 22 IS DONE.', 'You completed your first session. 21 to go.', '{{first_name}}''s 22 For the 22 update:\n\n{{completed}} of {{total}} sessions complete.\n\n22 FOR THE 22 — Because 22 ≠ 0.', 0),
    (5, '5 DOWN. 17 TO GO.', '5 sessions complete. Keep the mission moving.', '{{first_name}}''s 22 For the 22 update:\n\n{{completed}} of {{total}} sessions complete.\n\n22 FOR THE 22 — Because 22 ≠ 0.', 1),
    (11, 'HALFWAY THERE.', 'You''re halfway to 22. Keep going.', '{{first_name}}''s 22 For the 22 update:\n\n{{completed}} of {{total}} sessions complete.\n\n22 FOR THE 22 — Because 22 ≠ 0.', 2),
    (17, 'THE FINISH IS IN SIGHT.', '17 down. Five sessions left.', '{{first_name}}''s 22 For the 22 update:\n\n{{completed}} of {{total}} sessions complete.\n\n22 FOR THE 22 — Because 22 ≠ 0.', 3),
    (22, 'MISSION COMPLETE.', 'All 22 sessions complete. Because 22 ≠ 0.', '{{first_name}} completed 22 For the 22.\n\n22 of 22 sessions. 484+ minutes of movement.\n\nBECAUSE 22 ≠ 0.', 4)
) as m(threshold, title, message, share_template, display_order)
where e.slug = '22forthe22'
on conflict (event_id, threshold) do nothing;

commit;
