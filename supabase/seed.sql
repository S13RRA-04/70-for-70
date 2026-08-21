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
