-- One-time migration + data load: widens performance_snapshots.category's
-- check constraint to include 'run' (previously swim/bike/ride/aerobic/
-- trainingpeaks only), and inserts the first dated 'run' snapshot from the
-- September 9, 2026 tempo run. Run this manually, once, against the live
-- Supabase project — see supabase/2026-09-08-performance-snapshots.sql for
-- the pattern this follows (a future update should be a new file in this
-- same style, not an edit to values already committed here).
--
-- Also marks the "Establish aerobic HR/pace baseline" run rung in
-- training_objectives done, using this same run's numbers — the ladder's
-- own "30 min comfortable"-style volume rungs were replaced by the Phase 2
-- Performance Benchmarks ladder in 2026-08-31-performance-benchmarks-
-- refresh.sql, so this is the closest real rung to what a 45-minute
-- continuous aerobic-effort run establishes. Deliberately does NOT touch
-- "Establish current 5K benchmark" — Strava's predicted 5K (28:06) is an
-- algorithm's estimate from this run's effort, not an actual timed 5K, so
-- it stays unmarked per this site's "nothing is done until it's actually
-- done" rule (see the run_predicted_5k row below: is_measured = false).

begin;

alter table public.performance_snapshots drop constraint if exists performance_snapshots_category_check;
alter table public.performance_snapshots
  add constraint performance_snapshots_category_check
  check (category in ('swim', 'bike', 'run', 'ride', 'aerobic', 'trainingpeaks'));

insert into public.performance_snapshots
  (recorded_on, category, metric_key, label, value_display, value_numeric, unit, is_measured, display_order)
values
  ('2026-09-09', 'run', 'run_distance_mi', 'Distance', '4.28 mi', 4.28, 'mi', true, 0),
  ('2026-09-09', 'run', 'run_moving_time', 'Moving Time', '45:09', null, null, true, 1),
  ('2026-09-09', 'run', 'run_avg_pace', 'Average Pace', '10:32/mi', 632, 'sec/mi', true, 2),
  ('2026-09-09', 'run', 'run_avg_hr', 'Average HR', '145 bpm', 145, 'bpm', true, 3),
  ('2026-09-09', 'run', 'run_max_hr', 'Max HR', '165 bpm', 165, 'bpm', true, 4),
  ('2026-09-09', 'run', 'run_elevation_ft', 'Elevation Gain', '136 ft', 136, 'ft', true, 5),
  ('2026-09-09', 'run', 'run_fastest_mile', 'Fastest Mile Split', '9:00/mi', 540, 'sec/mi', true, 6),
  ('2026-09-09', 'run', 'run_tempo_pace', 'Tempo Pace (work intervals)', '~8:10/mi', 490, 'sec/mi', true, 7),
  ('2026-09-09', 'run', 'run_predicted_5k', 'Strava Predicted 5K', '28:06 (prediction)', 1686, 'sec', false, 8)
on conflict (recorded_on, metric_key) do update set
  label = excluded.label,
  value_display = excluded.value_display,
  value_numeric = excluded.value_numeric,
  unit = excluded.unit,
  is_measured = excluded.is_measured,
  display_order = excluded.display_order;

update public.training_objectives
set status = 'done',
    metric_current = '10:32/mi avg pace @ 145 bpm avg HR (4.28 mi continuous, Sept 9)'
where category = 'run' and label = 'Establish aerobic HR/pace baseline';

commit;
