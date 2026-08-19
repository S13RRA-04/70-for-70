-- For The 22 / Tri — production seed data
--
-- Run after schema.sql. Initializes the campaign at $0 raised with all 70
-- fundraising miles available, per the campaign brief. Donation URLs are
-- left null until approved partner URLs are supplied — do not invent them.
-- Partner `what_they_do` is left null (hidden on the frontend, not shown as
-- a placeholder) until each organization supplies its own approved
-- description; `description` holds Cody's own, real "why it matters to me"
-- words, so it's safe to display as-is. `logo_url` values are relative
-- paths served from this app's own public/partners/ directory (the real
-- organization logos supplied for the campaign) — they resolve against
-- whatever origin the site is deployed to. For a richer dataset to preview
-- the UI locally, see seed-demo.sql instead (clearly-labeled demo data, not
-- for production).

insert into public.campaign (name, fundraising_goal, amount_raised, race_distance, race_date, race_location)
select 'Tri', 70000, 0, 70.3, null, null
where not exists (select 1 from public.campaign);

insert into public.miles (mile_number, goal_amount, amount_funded, status)
select n, 1000, 0, 'available'
from generate_series(1, 70) as n
on conflict (mile_number) do nothing;

insert into public.partners (name, description, what_they_do, logo_url, website_url, donation_url, active)
values
  (
    'Mighty Oaks Foundation',
    'In 2023, I attended a Mighty Oaks Warrior Program retreat. It became an important turning point in my life — helping me look at difficult experiences through a lens centered on faith, responsibility, and purpose, and changing how I showed up for my marriage and my family. I know firsthand what their work can mean to a veteran and a family.',
    null,
    '/partners/mighty-oaks-logo.png',
    'https://www.mightyoaksprograms.org/',
    null,
    true
  ),
  (
    'Project Echelon',
    'Project Echelon uses endurance sport, mentorship, structure, and community to help veterans keep moving forward after military service. As I began pursuing triathlon myself, that mission made immediate sense to me — there''s something powerful about putting veterans back into an environment with a mission, a team, and a reason to keep showing up.',
    null,
    '/partners/project-echelon-logo.png',
    'https://www.projectechelon.org/',
    null,
    true
  )
on conflict (name) do nothing;
