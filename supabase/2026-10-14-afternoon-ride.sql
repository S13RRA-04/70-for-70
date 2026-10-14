-- October 14, 2026 Afternoon Ride (Strava, Madison County, AL — second
-- training ride on the Stradalli). Two parts, one transaction:
--
-- 1. A new dated 'ride' snapshot in performance_snapshots — insert only,
--    following supabase/2026-09-08-performance-snapshots.sql (never edit
--    earlier rows in place). Mirrored in SEED_PERFORMANCE_SNAPSHOTS
--    (src/lib/data/seed-data.ts, seed-perf-ride-21..29). Strava's power
--    and energy figures are estimates (no power meter), so those two rows
--    are is_measured = false, same as the September 16 ride.
--
-- 2. A Training journal entry for the ride. training_bike_power_watts is
--    deliberately left null: TrainingMetricsPanel renders it as a bare
--    "Avg Power", with no way to mark it as Strava's estimate — the body
--    says so instead.
--
-- Safe to re-run.

begin;

insert into public.performance_snapshots
  (recorded_on, category, metric_key, label, value_display, value_numeric, unit, is_measured, display_order)
values
  ('2026-10-14', 'ride', 'ride_distance_mi', 'Distance', '12.37 mi', 12.37, 'mi', true, 0),
  ('2026-10-14', 'ride', 'ride_moving_time', 'Moving Time', '54:24', null, null, true, 1),
  ('2026-10-14', 'ride', 'ride_avg_speed_mph', 'Average Speed', '13.6 mph', 13.6, 'mph', true, 2),
  ('2026-10-14', 'ride', 'ride_max_speed_mph', 'Max Speed', '32.7 mph', 32.7, 'mph', true, 3),
  ('2026-10-14', 'ride', 'ride_elevation_ft', 'Elevation Gain', '275 ft', 275, 'ft', true, 4),
  ('2026-10-14', 'ride', 'ride_relative_effort', 'Relative Effort', '99', 99, null, true, 7),
  ('2026-10-14', 'ride', 'ride_avg_power_watts', 'Estimated Avg Power', '93 W', 93, 'W', false, 11),
  ('2026-10-14', 'ride', 'ride_energy_kj', 'Energy Output', '304 kJ', 304, 'kJ', false, 12),
  ('2026-10-14', 'ride', 'ride_conditions', 'Conditions', '87°F / Feels 91°F / 52% humidity', null, null, true, 13)
on conflict (recorded_on, metric_key) do update set
  label = excluded.label,
  value_display = excluded.value_display,
  value_numeric = excluded.value_numeric,
  unit = excluded.unit,
  is_measured = excluded.is_measured,
  display_order = excluded.display_order;

insert into public.journal_entries
  (post_type, primary_category, tags, title, slug, summary, body, status, published_at, featured,
   training_discipline, training_distance, training_duration_minutes, training_pace, training_elevation_ft, training_phase)
values (
  'article',
  'Training',
  array['Bike', 'Stradalli', 'Training Log', 'Strava'],
  'Second Ride on the Stradalli: 12 Miles, 3 PRs, and an 87° Afternoon',
  'second-ride-on-the-stradalli-12-miles-3-prs',
  'One day after the Stradalli''s first training ride: more than four extra miles, a faster average, three segment PRs, and the highest Relative Effort of any ride I''ve posted here.',
  $body$One day after the Stradalli's first real training ride, I took it back out — longer, hotter, and faster.

## The numbers

- **12.37 miles** in **54:24** of moving time
- **13.6 mph** average, **32.7 mph** max
- **275 ft** of climbing
- **Relative Effort: 99**
- Strava's estimated average power: **93 W** (304 kJ) — an estimate, not a power-meter reading
- **87°F**, feeling like 91°F, 52% humidity

## How it stacks up

Against yesterday's ride, that's more than four extra miles (8.24 → 12.37) and a bump in average speed (13.0 → 13.6 mph) at the same estimated power.

Against my September 10 ride — almost exactly the same distance at 12.28 miles — I covered it about three minutes faster (57:31 → 54:24), up from a 12.8 mph average.

And the 32.7 mph top speed is the fastest I've recorded since I started posting ride numbers here.

## Three PRs

This one also came with three segment PRs on my regular trail loop, plus a second-fastest time on a fourth. Strava also has me trending faster than my previous ride on this route.

PRs on a training ride aren't the goal — consistency is. But they're a good sign that the work is starting to show up on the road.

## Still dialing it in

The punch list from yesterday's ride — shifting, brakes, and saddle fit — is still being worked through. You can follow that on the [Building the Bike](/journal/building-the-bike#component-status) page.

## What's next

More miles, more heat, and a lot more consistency between now and Chattanooga on May 16, 2027.

Movement Creates Momentum.$body$,
  'published',
  '2026-10-14T17:00:00-05:00',
  false,
  'bike',
  12.37,
  54,
  '13.6 mph avg',
  275,
  'Phase 2: Building the Engine'
)
on conflict (slug) do update set
  post_type = excluded.post_type,
  primary_category = excluded.primary_category,
  tags = excluded.tags,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  status = excluded.status,
  training_discipline = excluded.training_discipline,
  training_distance = excluded.training_distance,
  training_duration_minutes = excluded.training_duration_minutes,
  training_pace = excluded.training_pace,
  training_elevation_ft = excluded.training_elevation_ft,
  training_phase = excluded.training_phase,
  updated_at = now();

commit;
