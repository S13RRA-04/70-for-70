-- For The 22 / Tri For The 22 — production seed data
--
-- Run after schema.sql. Initializes the campaign at $0 raised with all 70
-- fundraising miles available, per the campaign brief. Donation URLs are
-- left null until approved partner URLs are supplied — do not invent them.
-- Partner `what_they_do` is left null (hidden on the frontend, not shown as
-- a placeholder) until each organization supplies its own approved
-- description; `description` is an organizational summary of why each
-- partner fits the campaign — kept impersonal/third-person on purpose,
-- since personal/biographical content about Cody lives only on the About
-- page (see src/lib/content/about.ts), not on partner records. `logo_url`
-- values are relative
-- paths served from this app's own public/partners/ directory (the real
-- organization logos supplied for the campaign) — they resolve against
-- whatever origin the site is deployed to. For a richer dataset to preview
-- the UI locally, see seed-demo.sql instead (clearly-labeled demo data, not
-- for production).

insert into public.campaign (name, fundraising_goal, amount_raised, race_distance, race_date, race_location)
select 'Tri For The 22', 70000, 0, 70.3, null, null
where not exists (select 1 from public.campaign);

insert into public.miles (mile_number, goal_amount, amount_funded, status)
select n, 1000, 0, 'available'
from generate_series(1, 70) as n
on conflict (mile_number) do nothing;

insert into public.partners (name, description, what_they_do, logo_url, website_url, donation_url, active)
values
  (
    'Mighty Oaks Foundation',
    'The Mighty Oaks Warrior Program works with veterans through a lens centered on faith, responsibility, and purpose — helping veterans and their families move forward after difficult experiences. That''s why Mighty Oaks is part of Tri For The 22.',
    null,
    '/partners/mighty-oaks-logo.png',
    'https://www.mightyoaksprograms.org/',
    null,
    true
  ),
  (
    'Project Echelon',
    'Project Echelon uses endurance sport, mentorship, structure, and community to help veterans keep moving forward after military service — putting veterans back into an environment with a mission, a team, and a reason to keep showing up.',
    null,
    '/partners/project-echelon-logo.png',
    'https://www.projectechelon.org/',
    null,
    true
  )
on conflict (name) do nothing;

-- Phase 2 "Performance Benchmarks" ladder — Competency -> Economy ->
-- Speed -> Durability -> Podium-specific race execution per discipline,
-- recalibrated against real M35-39 Chattanooga results. Not a claim
-- about actual training progress beyond what's marked 'done' here.
-- Meant to be edited via /admin/training-objectives from here on.
insert into public.training_objectives (category, label, display_order, status, tag, metric_historical, metric_current, metric_next, metric_goal)
select * from (values
  ('swim', '50 yd comfortable/repeatable', 0, 'done', null, null, null, null, null),
  ('swim', '200 yd continuous', 1, 'done', null, null, null, null, null),
  ('swim', '400 yd continuous', 2, 'done', null, null, null, null, null),
  ('swim', '750 yd continuous', 3, 'done', null, null, null, null, null),
  ('swim', '1,800 yd total session', 4, 'done', 'Current volume', null, null, null, null),
  ('swim', 'Establish repeatable 100 yd pace', 5, 'not_started', null, null, null, null, null),
  ('swim', 'Complete CSS test: 400 yd + 200 yd', 6, 'not_started', null, null, null, null, null),
  ('swim', '8 × 100 yd within ±5 sec', 7, 'not_started', null, null, null, null, null),
  ('swim', '1,000 yd continuous at aerobic effort', 8, 'not_started', null, null, null, null, null),
  ('swim', '1,500 yd continuous with stable form', 9, 'not_started', null, null, null, null, null),
  ('swim', '2,112 yd continuous', 10, 'not_started', null, null, null, null, null),
  ('swim', 'Open-water 1,000 yd with sighting', 11, 'not_started', null, null, null, null, null),
  ('swim', 'Full-distance open-water swim', 12, 'not_started', null, null, null, null, null),
  ('swim', '1.2 mi race swim ≤32:00', 13, 'not_started', null, '28:19 (2023 M35–39 winner)', null, null, null),
  ('swim', 'Podium-track swim ≤29:00', 14, 'not_started', 'Podium-track', null, null, null, null),

  ('bike', 'Outdoor baseline: 9.06 mi / 12.1 mph / 412 ft', 0, 'done', null, null, null, null, null),
  ('bike', 'Confident braking, shifting, cornering, descending', 1, 'not_started', null, null, null, null, null),
  ('bike', '60 min continuous mostly Z2', 2, 'not_started', null, null, null, null, null),
  ('bike', 'Establish repeatable benchmark route', 3, 'not_started', null, null, null, null, null),
  ('bike', '14 mph benchmark at controlled HR', 4, 'not_started', null, null, null, null, null),
  ('bike', '16 mph benchmark at controlled HR', 5, 'not_started', null, null, null, null, null),
  ('bike', 'Install power meter', 6, 'not_started', null, null, null, null, null),
  ('bike', 'Establish FTP', 7, 'not_started', null, null, null, null, null),
  ('bike', 'FTP ≥2.5 W/kg', 8, 'not_started', null, null, null, null, null),
  ('bike', 'FTP ≥3.0 W/kg', 9, 'not_started', null, null, null, null, null),
  ('bike', 'FTP ≥3.5 W/kg podium-track', 10, 'not_started', 'Podium-track', null, null, null, null),
  ('bike', 'Hold aero position 20 min continuously', 11, 'not_started', null, null, null, null, null),
  ('bike', 'Hold aero position 60 min without meaningful power loss', 12, 'not_started', null, null, null, null, null),
  ('bike', '40 mi controlled with fueling executed', 13, 'not_started', null, null, null, null, null),
  ('bike', '56 mi at planned race effort', 14, 'not_started', null, null, null, null, null),
  ('bike', '56 mi + successful transition run', 15, 'not_started', null, null, null, null, null),
  ('bike', '70.3 bike split ≤2:25 competitive', 16, 'not_started', 'Competitive', '2:10:23–2:14:36 (2023 & 2025 M35–39 winners)', null, null, null),
  ('bike', 'Podium-track bike split ≤2:15', 17, 'not_started', 'Podium-track', null, null, null, null),

  ('run', 'Establish aerobic HR/pace baseline', 0, 'not_started', null, null, null, null, null),
  ('run', 'Establish current 5K benchmark', 1, 'not_started', null, null, null, null, null),
  ('run', 'Establish threshold pace', 2, 'not_started', null, null, null, null, null),
  ('run', '60 min Z2 with <5% HR/pace drift', 3, 'not_started', null, null, null, null, null),
  ('run', 'Sub-25:00 5K', 4, 'not_started', null, null, null, null, null),
  ('run', 'Sub-23:00 5K', 5, 'not_started', null, null, null, null, null),
  ('run', 'Sub-21:00 5K', 6, 'not_started', null, null, null, null, null),
  ('run', 'Sub-20:00 5K podium-track', 7, 'not_started', 'Podium-track', null, null, null, null),
  ('run', 'Controlled 10K at target training pace', 8, 'not_started', null, null, null, null, null),
  ('run', '10 mi aerobic without pace decay', 9, 'not_started', null, null, null, null, null),
  ('run', 'Open half marathon <1:40', 10, 'not_started', null, null, null, null, null),
  ('run', 'Open half marathon <1:30 podium-track', 11, 'not_started', 'Podium-track', null, null, null, null),
  ('run', '30 min off bike within 10% of fresh aerobic pace', 12, 'not_started', null, null, null, null, null),
  ('run', '60 min off bike with stable HR and pace', 13, 'not_started', null, null, null, null, null),
  ('run', '70.3 run ≤1:30 competitive', 14, 'not_started', 'Competitive', '1:17:09–1:26:41 (2023 & 2025 M35–39 winners)', null, null, null),
  ('run', 'Podium-track 70.3 run ≤1:20–1:25', 15, 'not_started', 'Podium-track', null, null, null, null),

  ('brick', 'First bike → run transition', 0, 'not_started', null, null, null, null, null),
  ('brick', '60 min bike + 15 min run with smooth transition', 1, 'not_started', null, null, null, null, null),
  ('brick', '90 min bike + 30 min run with run pace within 10% of fresh aerobic pace', 2, 'not_started', null, null, null, null, null),
  ('brick', '2 hr bike + 30 min run with fueling executed correctly', 3, 'not_started', null, null, null, null, null),
  ('brick', '3 hr bike + 45 min run with no major pace decay', 4, 'not_started', null, null, null, null, null),
  ('brick', 'Race-specific brick at projected bike and run effort', 5, 'not_started', null, null, null, null, null),
  ('brick', 'Race-simulation brick with full fueling, transitions, and aero execution', 6, 'not_started', null, null, null, null, null),
  ('brick', 'Race simulation completed with <5–7% late-session fade', 7, 'not_started', null, null, null, null, null),

  ('vo2max', '37', 0, 'done', 'One month ago', null, null, null, null),
  ('vo2max', '38', 1, 'done', 'Two weeks ago', null, null, null, null),
  ('vo2max', '40', 2, 'done', 'Current', null, null, null, null),
  ('vo2max', '42', 3, 'not_started', null, null, null, null, null),
  ('vo2max', '45', 4, 'not_started', null, null, null, null, null),
  ('vo2max', '50', 5, 'not_started', null, null, null, null, null),

  ('strength', 'Establish Phase 2 strength baselines', 0, 'in_progress', null, null, null, null, null),
  ('strength', 'Track bench/push, pull-up or pulldown, row, overhead press, hinge/RDL, and split squat/leg press', 1, 'not_started', null, null, null, null, null),
  ('strength', 'Maintain ≥90% of baseline strength as endurance volume rises', 2, 'not_started', null, null, null, null, null),
  ('strength', 'Complete 2 strength/cross-training sessions per week for 8 consecutive weeks', 3, 'not_started', null, null, null, null, null),
  ('strength', 'Maintain muscular body composition', 4, 'not_started', null, null, null, null, null),
  ('strength', 'No endurance-session degradation caused by strength programming', 5, 'not_started', null, null, null, null, null),

  ('race_readiness', 'Full-distance pool swim complete', 0, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Full-distance open-water swim complete', 1, 'not_started', null, null, null, null, null),
  ('race_readiness', '56 mi bike complete at controlled race effort', 2, 'not_started', null, null, null, null, null),
  ('race_readiness', '13.1 mi run complete aerobically', 3, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Race fueling plan validated for 3+ hr', 4, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Aero position sustainable for race-duration blocks', 5, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Transitions rehearsed', 6, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Wetsuit/open-water competency established', 7, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Full race-simulation brick completed', 8, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Full-distance swim at target race pace', 9, 'not_started', null, null, null, null, null),
  ('race_readiness', '56 mi bike at target race effort', 10, 'not_started', null, null, null, null, null),
  ('race_readiness', '60 min post-bike run at target race effort', 11, 'not_started', null, null, null, null, null),
  ('race_readiness', 'Podium-track overall capability: ~4:05–4:15', 12, 'not_started', 'Podium-track', '4:04:51–4:27:25 (2023 top-9, M35–39); 2025 not directly comparable — no swim leg held', null, null, null),
  ('race_readiness', 'IRONMAN 70.3 Chattanooga completed', 13, 'goal', null, null, null, null, null)
) as v (category, label, display_order, status, tag, metric_historical, metric_current, metric_next, metric_goal)
where not exists (select 1 from public.training_objectives);
