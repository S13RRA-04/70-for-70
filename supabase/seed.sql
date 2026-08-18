-- 70 for 70 — production seed data
--
-- Run after schema.sql. Initializes the campaign at $0 raised with all 70
-- fundraising miles available, per the campaign brief. Donation URLs are
-- left null (TODO) until approved partner URLs are supplied — do not invent
-- them. For a richer dataset to preview the UI locally, see seed-demo.sql
-- instead (clearly-labeled placeholder data, not for production).

insert into public.campaign (name, fundraising_goal, amount_raised, race_distance, race_date, race_location)
select '70 for 70', 70000, 0, 70.3, null, null
where not exists (select 1 from public.campaign);

insert into public.miles (mile_number, goal_amount, amount_funded, status)
select n, 1000, 0, 'available'
from generate_series(1, 70) as n
on conflict (mile_number) do nothing;

insert into public.partners (name, description, logo_url, website_url, donation_url, active)
values
  (
    'Mighty Oaks Foundation',
    'TODO — replace with approved description of Mighty Oaks Foundation''s mission and programs.',
    null,
    null,
    null,
    true
  ),
  (
    'Project Echelon',
    'TODO — replace with approved description of Project Echelon''s mission and programs.',
    null,
    null,
    null,
    true
  )
on conflict (name) do nothing;
