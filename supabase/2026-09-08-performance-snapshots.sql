-- One-time migration + data load: creates public.performance_snapshots (if
-- not already present) and inserts the first dated snapshot of measured
-- and platform-calculated performance numbers — swim pace, FTP and its
-- test conditions, the latest outdoor ride, VO2 max, and TrainingPeaks'
-- Fitness/Fatigue/Form. See performance_snapshots' comment in schema.sql
-- for the full rationale (normalized one-row-per-metric-per-date so a
-- later update just inserts new rows instead of overwriting history).
--
-- This is NOT part of the schema/seed lifecycle (schema.sql / seed.sql
-- only ever run once against an empty table). Run this manually, once,
-- against the live Supabase project. A future update should be a NEW file
-- in this same style (new recorded_on date, insert only) — never edit the
-- values below in place, or the history this table exists to preserve is
-- lost.

begin;

create table if not exists public.performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  recorded_on date not null,
  category text not null check (category in ('swim', 'bike', 'ride', 'aerobic', 'trainingpeaks')),
  metric_key text not null,
  label text not null,
  value_display text not null,
  value_numeric numeric,
  unit text,
  is_measured boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (recorded_on, metric_key)
);

create index if not exists performance_snapshots_recorded_on_idx
  on public.performance_snapshots (recorded_on desc);
create index if not exists performance_snapshots_metric_key_idx
  on public.performance_snapshots (metric_key, recorded_on);

alter table public.performance_snapshots enable row level security;

drop policy if exists "performance snapshots are publicly readable" on public.performance_snapshots;
create policy "performance snapshots are publicly readable"
  on public.performance_snapshots for select
  to anon, authenticated
  using (true);

insert into public.performance_snapshots
  (recorded_on, category, metric_key, label, value_display, value_numeric, unit, is_measured, display_order)
values
  ('2026-09-08', 'swim', 'swim_pace_100yd', 'Repeatable 100 yd Pace', '1:58/100 yd', 118, 'sec/100yd', true, 0),
  ('2026-09-08', 'swim', 'swim_pace_100yd_avg', 'Latest 10×100 Average', '1:58.3/100 yd', 118.3, 'sec/100yd', true, 1),
  ('2026-09-08', 'swim', 'swim_pace_fastest', 'Fastest 100', '1:55/100 yd', 115, 'sec/100yd', true, 2),
  ('2026-09-08', 'swim', 'swim_pace_range', 'Latest Range', '1:55–2:02', null, null, true, 3),
  ('2026-09-08', 'swim', 'swim_pace_previous', 'Previous Benchmark', '~2:04/100 yd', 124, 'sec/100yd', true, 4),

  ('2026-09-08', 'bike', 'bike_ftp_watts', 'FTP', '143 W', 143, 'W', true, 0),
  ('2026-09-08', 'bike', 'bike_20min_power_watts', '20-Minute Average Power', '151 W', 151, 'W', true, 1),
  ('2026-09-08', 'bike', 'bike_ftp_test_hr', 'FTP Test Average HR', '167 bpm', 167, 'bpm', true, 2),
  ('2026-09-08', 'bike', 'bike_ftp_test_cadence', 'FTP Test Average Cadence', '76 rpm', 76, 'rpm', true, 3),

  ('2026-09-08', 'ride', 'ride_distance_mi', 'Distance', '11.23 mi', 11.23, 'mi', true, 0),
  ('2026-09-08', 'ride', 'ride_moving_time', 'Moving Time', '53:47', null, null, true, 1),
  ('2026-09-08', 'ride', 'ride_avg_speed_mph', 'Average Speed', '12.5 mph', 12.5, 'mph', true, 2),
  ('2026-09-08', 'ride', 'ride_max_speed_mph', 'Max Speed', '27.5 mph', 27.5, 'mph', true, 3),
  ('2026-09-08', 'ride', 'ride_elevation_ft', 'Elevation Gain', '407 ft', 407, 'ft', true, 4),
  ('2026-09-08', 'ride', 'ride_avg_hr', 'Average HR', '143 bpm', 143, 'bpm', true, 5),
  ('2026-09-08', 'ride', 'ride_max_hr', 'Max HR', '158 bpm', 158, 'bpm', true, 6),
  ('2026-09-08', 'ride', 'ride_relative_effort', 'Relative Effort', '74', 74, null, true, 7),
  ('2026-09-08', 'ride', 'ride_zone2_pct', 'Zone 2', '32.1%', 32.1, '%', true, 8),
  ('2026-09-08', 'ride', 'ride_zone3_pct', 'Zone 3', '65.7%', 65.7, '%', true, 9),
  ('2026-09-08', 'ride', 'ride_zone23_combined_pct', 'Combined Z2/Z3', '97.8%', 97.8, '%', true, 10),

  ('2026-09-08', 'aerobic', 'vo2max', 'Estimated VO2 Max', '41', 41, 'ml/kg/min', true, 0),

  ('2026-09-08', 'trainingpeaks', 'tp_fitness', 'Fitness (CTL)', '15', 15, null, false, 0),
  ('2026-09-08', 'trainingpeaks', 'tp_fatigue', 'Fatigue (ATL)', '38', 38, null, false, 1),
  ('2026-09-08', 'trainingpeaks', 'tp_form', 'Form (TSB)', '-23', -23, null, false, 2),
  ('2026-09-08', 'trainingpeaks', 'tp_ramp_rate', '7-Day Fitness Ramp Rate', '+3', 3, null, false, 3)
on conflict (recorded_on, metric_key) do update set
  label = excluded.label,
  value_display = excluded.value_display,
  value_numeric = excluded.value_numeric,
  unit = excluded.unit,
  is_measured = excluded.is_measured,
  display_order = excluded.display_order;

commit;
