-- One-time migration + data refresh: adds the Historical | Current | Next
-- | Goal metric columns to public.training_objectives and rewrites its
-- rows to the new "Performance Benchmarks" ladder (performance qualities
-- — pace, power, economy, race specificity — instead of raw distance
-- progression), including podium-track race-pace targets recalibrated
-- from actual M35-39 Chattanooga results (2023 + 2025).
--
-- This is NOT part of the schema/seed lifecycle (schema.sql / seed.sql only
-- ever run once against an empty table). Run this manually, once, against
-- the live Supabase project via the SQL Editor to bring production schema
-- + data in line with the new content in schema.sql / seed.sql /
-- seed-data.ts. The ALTER TABLE step is idempotent (IF NOT EXISTS); the
-- data step is a full delete + reinsert, so re-running just reapplies the
-- same state (any status/tag/metric edits made via
-- /admin/training-objectives after running this will be lost if you run
-- it again).
--
-- Note: race-goal.ts and race-benchmarks.ts (the /the-race page's goal
-- panel and "times to beat" tables) were also recalibrated in this same
-- change, but those are plain code constants, not database rows — they
-- ship with the next deploy and need no SQL of their own.
--
-- After running, verify the ladder at /journal and re-toggle any
-- "First bike → run" (brick) status if that's already been completed —
-- it was left as not_started here since actual completion wasn't known
-- at authoring time.

begin;

alter table public.training_objectives
  add column if not exists metric_historical text,
  add column if not exists metric_current text,
  add column if not exists metric_next text,
  add column if not exists metric_goal text;

delete from public.training_objectives;

insert into public.training_objectives (category, label, display_order, status, tag, metric_historical, metric_current, metric_next, metric_goal)
values
  ('swim', '750 yd continuous, controlled', 0, 'done', null, null, null, null, null),
  ('swim', '1,800+ yd total session', 1, 'done', 'Current volume', null, null, null, null),
  ('swim', 'Establish repeatable 100-yd pace', 2, 'not_started', null, null, null, null, null),
  ('swim', 'Complete CSS test: 400 + 200 yd', 3, 'not_started', null, null, null, null, null),
  ('swim', '8 × 100 within ±5 sec', 4, 'not_started', null, null, null, null, null),
  ('swim', '1,000 yd continuous at aerobic effort', 5, 'not_started', null, null, null, null, null),
  ('swim', '1,500 yd continuous with stable form', 6, 'not_started', null, null, null, null, null),
  ('swim', '2,112 yd continuous', 7, 'not_started', 'Race distance', null, '750 yd', '1,000 yd', '2,112 yd'),
  ('swim', '2,112 yd at target race pace', 8, 'not_started', null, '28:19 (2023 M35–39 winner)', 'TBD', '30:00–32:00 (competitive)', '≤29:00 / ~1:22–1:25 per 100 yd (podium)'),
  ('swim', 'Open-water 1,000 yd with sighting', 9, 'not_started', null, null, null, null, null),
  ('swim', 'Full-distance open-water swim', 10, 'not_started', null, null, null, null, null),

  ('bike', 'Outdoor baseline: 9.06 mi / 12.1 mph / 412 ft', 0, 'done', null, null, null, null, null),
  ('bike', 'Confident braking, shifting, descending and cornering', 1, 'not_started', null, null, null, null, null),
  ('bike', '60 min continuous mostly Z2', 2, 'not_started', null, null, null, null, null),
  ('bike', 'Establish benchmark route and repeat monthly', 3, 'not_started', null, null, null, null, null),
  ('bike', 'Average 14 mph on benchmark route at similar HR', 4, 'not_started', null, null, null, null, null),
  ('bike', 'Average 16 mph at similar HR', 5, 'not_started', null, null, null, null, null),
  ('bike', 'Install power meter and establish FTP', 6, 'not_started', null, null, null, null, null),
  ('bike', 'FTP (W/kg)', 7, 'not_started', null, null, 'TBD', '2.5 W/kg', '3.0+ W/kg'),
  ('bike', 'Hold aero position continuously for 20 min', 8, 'not_started', null, null, null, null, null),
  ('bike', 'Hold aero for 60 min without meaningful power loss', 9, 'not_started', null, null, null, null, null),
  ('bike', '40 miles controlled with fueling executed', 10, 'not_started', null, null, null, null, null),
  ('bike', '56 miles at planned race effort', 11, 'not_started', 'Race distance', '2:10:23–2:14:36 (2023 & 2025 M35–39 winners)', '12.1 mph outdoor training baseline (not race effort)', '2:20:00–2:25:00 / 23.1–24.0 mph (competitive)', '≤2:15:00 / ~24.9+ mph (podium)'),
  ('bike', '56 miles + successful transition run', 12, 'not_started', null, null, null, null, null),
  ('bike', 'Race power target maintained with <5–7% late-session fade', 13, 'not_started', null, null, null, null, null),

  ('run', 'Establish current aerobic HR/pace baseline', 0, 'not_started', null, null, null, null, null),
  ('run', 'Establish current 5K benchmark', 1, 'not_started', null, null, null, null, null),
  ('run', 'Establish threshold pace', 2, 'not_started', null, null, null, null, null),
  ('run', 'Run 60 min Z2 with <5% HR/pace drift', 3, 'not_started', null, null, null, null, null),
  ('run', 'Sub-25 5K', 4, 'not_started', null, null, null, null, null),
  ('run', 'Sub-23 5K', 5, 'not_started', null, null, null, null, null),
  ('run', 'Controlled 10K at target training pace', 6, 'not_started', null, null, null, null, null),
  ('run', '10 miles aerobic without pace decay', 7, 'not_started', null, null, null, null, null),
  ('run', '13.1 miles controlled', 8, 'not_started', 'Race distance', '1:17:09–1:26:41 (2023 & 2025 M35–39 winners)', 'TBD', '1:25:00–1:30:00 / 6:29–6:52 per mi (competitive)', '≤1:20:00 / ~6:06 per mi (podium)'),
  ('run', 'Run 30 min off bike within ~10% of fresh aerobic pace', 9, 'not_started', null, null, null, null, null),
  ('run', 'Run 60 min off bike with stable HR and pace', 10, 'not_started', null, null, null, null, null),
  ('run', 'Target 70.3 half-marathon pace demonstrated in race-simulation brick', 11, 'not_started', null, null, 'TBD', '1:25:00–1:30:00 off bike (competitive)', '1:20:00–1:25:00 off bike (podium) — requires an open half well under 1:20'),

  ('brick', 'First bike → run', 0, 'not_started', null, null, null, null, null),
  ('brick', '60m bike + 15m run — smooth transition, no HR spike', 1, 'not_started', null, null, null, null, null),
  ('brick', '90m bike + 30m run — run pace within 10% of fresh aerobic pace', 2, 'not_started', null, null, null, null, null),
  ('brick', '2h bike + 30m run — fueling executed correctly', 3, 'not_started', null, null, null, null, null),
  ('brick', '3h bike + 45m run — no major pace decay', 4, 'not_started', null, null, null, null, null),
  ('brick', 'Race-specific brick — target bike effort + target run effort + full fueling plan', 5, 'not_started', null, null, null, null, null),

  ('vo2max', '37', 0, 'done', 'One month ago', null, null, null, null),
  ('vo2max', '38', 1, 'done', 'Two weeks ago', null, null, null, null),
  ('vo2max', '40', 2, 'done', 'Current', null, null, null, null),
  ('vo2max', '42', 3, 'not_started', null, null, null, null, null),
  ('vo2max', '45', 4, 'not_started', null, null, null, null, null),
  ('vo2max', '50', 5, 'not_started', null, null, null, null, null),

  ('strength', 'Establish Phase 2 strength baselines', 0, 'in_progress', null, null, null, null, null),
  ('strength', 'Maintain ≥90% of baseline strength as endurance volume rises', 1, 'not_started', null, null, null, null, null),
  ('strength', 'Maintain lean/muscular body composition', 2, 'not_started', null, null, null, null, null),
  ('strength', 'Complete two strength sessions/week for 8 consecutive weeks', 3, 'not_started', null, null, null, null, null),
  ('strength', 'No endurance-session degradation caused by strength programming', 4, 'not_started', null, null, null, null, null),

  ('race_readiness', 'Pool race distance complete', 0, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Open-water race distance complete', 1, 'not_started', null, null, null, null, null),
  ('race_readiness', '56-mile bike complete at controlled race effort', 2, 'not_started', null, null, null, null, null),
  ('race_readiness', '13.1-mile run complete aerobically', 3, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Fueling plan validated at ≥3 hours', 4, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Transitions rehearsed', 5, 'not_started', null, null, 'TBD', '6:00 or less combined (competitive)', '5:00 or less combined (podium)'),
  ('race_readiness', 'Wetsuit/open-water competency established', 6, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Aero position sustainable for race-duration blocks', 7, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Race-simulation brick completed', 8, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Four-week pre-race benchmark block completed without injury', 9, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Overall finish time', 10, 'not_started', null, '4:04:51–4:27:25 (2023 top-9, M35–39); 2025 not directly comparable — no swim leg held', 'TBD', '4:15:00–4:25:00 (competitive)', '~4:05:00–4:15:00 (podium)'),
  ('race_readiness', 'IRONMAN 70.3 Chattanooga — 70.3 miles', 11, 'goal', null, null, null, null, null);

commit;
