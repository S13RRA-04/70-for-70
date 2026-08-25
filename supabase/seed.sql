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

-- Starter training-objectives checklist — generic 70.3-progression
-- milestones, not a claim about actual training progress (nothing is
-- pre-checked). Meant to be edited via /admin/training-objectives.
insert into public.training_objectives (category, label, display_order, status, tag)
select * from (values
  ('swim', 'Complete first pool session', 0, 'done', null),
  ('swim', '25m continuous', 1, 'done', null),
  ('swim', '50m comfortable & repeatable', 2, 'done', 'Current baseline'),
  ('swim', '100m continuous', 3, 'done', null),
  ('swim', '125m continuous', 4, 'not_started', null),
  ('swim', '200m continuous', 5, 'not_started', null),
  ('swim', '400m continuous', 6, 'not_started', null),
  ('swim', '750m continuous', 7, 'not_started', null),
  ('swim', '1,000m continuous', 8, 'not_started', null),
  ('swim', '1,500m continuous', 9, 'not_started', null),
  ('swim', '1,900m / 1.2 mi continuous', 10, 'not_started', 'Race distance'),
  ('swim', '2,500m controlled', 11, 'not_started', 'Stretch'),
  ('bike', 'Begin riding a real road bike', 0, 'in_progress', 'Now'),
  ('bike', 'Confident braking/shifting/handling', 1, 'not_started', null),
  ('bike', '60 min continuous', 2, 'not_started', null),
  ('bike', '20 miles', 3, 'not_started', null),
  ('bike', '90 min continuous', 4, 'not_started', null),
  ('bike', '2 hours', 5, 'not_started', null),
  ('bike', '40 miles', 6, 'not_started', null),
  ('bike', '56 miles', 7, 'not_started', 'Race distance'),
  ('bike', '60–70 mi controlled', 8, 'not_started', 'Stretch'),
  ('bike', 'Establish FTP', 9, 'not_started', null),
  ('bike', '2.5 W/kg FTP', 10, 'not_started', null),
  ('bike', '3.0 W/kg', 11, 'not_started', null),
  ('bike', '~3.2–3.7 W/kg', 12, 'not_started', 'Podium-track'),
  ('run', 'Establish current 5K', 0, 'not_started', null),
  ('run', '30 min comfortable', 1, 'not_started', null),
  ('run', '60 min comfortable', 2, 'not_started', null),
  ('run', 'Controlled 10K', 3, 'not_started', null),
  ('run', '10-mile long run', 4, 'not_started', null),
  ('run', '13.1 miles', 5, 'not_started', 'Race distance'),
  ('run', 'Sub-25 5K', 6, 'not_started', null),
  ('run', '~20–22 min 5K', 7, 'not_started', 'Podium-track'),
  ('brick', 'First bike → run', 0, 'not_started', null),
  ('brick', '60m bike + 15m run', 1, 'not_started', null),
  ('brick', '90m bike + 20–30m run', 2, 'not_started', null),
  ('brick', '2h bike + 30m run', 3, 'not_started', null),
  ('brick', '2.5–3h bike + 45m run', 4, 'not_started', null),
  ('brick', 'Race-simulation brick', 5, 'not_started', null),
  ('vo2max', '37', 0, 'done', 'One month ago'),
  ('vo2max', '38', 1, 'done', 'Two weeks ago'),
  ('vo2max', '40', 2, 'done', 'Current'),
  ('vo2max', '42', 3, 'not_started', null),
  ('vo2max', '45', 4, 'not_started', null),
  ('vo2max', '50', 5, 'not_started', null),
  ('vo2max', '55', 6, 'not_started', 'Stretch'),
  ('strength', 'Establish Push/Pull baselines', 0, 'in_progress', null),
  ('strength', 'Maintain strength as endurance volume rises', 1, 'not_started', null),
  ('strength', 'Maintain muscular bodyweight/composition', 2, 'not_started', null),
  ('strength', 'Strength PR during 70.3 build', 3, 'not_started', 'Stretch'),
  ('race_readiness', 'Complete all three disciplines individually', 0, 'not_started', null),
  ('race_readiness', 'Full-distance swim + long bike/brick competency', 1, 'not_started', null),
  ('race_readiness', 'Fueling strategy validated', 2, 'not_started', null),
  ('race_readiness', 'Open-water competency', 3, 'not_started', null),
  ('race_readiness', 'Race simulation completed', 4, 'not_started', null),
  ('race_readiness', 'IRONMAN 70.3 Chattanooga — 70.3 miles', 5, 'goal', null)
) as v (category, label, display_order, status, tag)
where not exists (select 1 from public.training_objectives);
