-- 70 for 70 — OPTIONAL local/demo data
--
-- Run this only against a local or throwaway Supabase project, after
-- schema.sql and seed.sql, to preview the site with a partially-funded
-- campaign instead of an all-zero one. Every name below is a clearly-labeled
-- placeholder ("[Sponsor Name TBD]", "[...— sample]") or one of the
-- illustrative examples already used in the campaign brief itself (e.g. the
-- "John Smith / Anonymous Veteran / Acme Corp" example for a mile detail
-- view). Do NOT run this against a production database.

update public.campaign set amount_raised = 11350;

update public.miles set status = 'funded', amount_funded = 1000
where mile_number in (1, 2, 4, 5, 6, 7, 8, 9, 10, 11);

update public.miles set status = 'partially_funded', amount_funded = 625
where mile_number = 3;

update public.miles set status = 'partially_funded', amount_funded = 725
where mile_number = 23;

insert into public.donations (mile_id, donor_name, amount, anonymous, verified)
select id, '[Sponsor Name TBD]', 1000, false, true from public.miles where mile_number = 2;

insert into public.donations (mile_id, donor_name, amount, anonymous, verified)
select id, 'Community Supporter', 625, false, true from public.miles where mile_number = 3;

insert into public.donations (mile_id, donor_name, amount, anonymous, verified)
select id, 'John Smith', 250, false, true from public.miles where mile_number = 23;

insert into public.donations (mile_id, donor_name, amount, anonymous, verified)
select id, 'Anonymous Veteran', 100, true, true from public.miles where mile_number = 23;

insert into public.donations (mile_id, donor_name, amount, anonymous, verified)
select id, 'Acme Corp', 375, false, true from public.miles where mile_number = 23;

insert into public.sponsors (name, tier, contribution_value, description, active, display_order)
values
  ('[Presenting Sponsor — sample]', 'presenting', 10000, 'Sample sponsor shown for layout preview only.', true, 1),
  ('[Mission Sponsor — sample]', 'mission', 5000, 'Sample sponsor shown for layout preview only.', true, 2),
  ('[Supporting Sponsor — sample]', 'supporting', 2500, 'Sample sponsor shown for layout preview only.', true, 3),
  ('[Mile Sponsor — sample]', 'mile', 1000, 'Sample sponsor shown for layout preview only.', true, 4);

insert into public.posts (title, slug, summary, body, category, published_at, featured, published)
values
  (
    'TODO — Campaign kickoff post title',
    'campaign-kickoff',
    'TODO — one to two sentence summary of the kickoff update.',
    'TODO — full body copy for the campaign kickoff update.',
    'Fundraising',
    now(),
    true,
    true
  ),
  (
    'TODO — First training block recap',
    'first-training-block-recap',
    'TODO — summary of early swim/bike/run training progress.',
    'TODO — full training recap body copy.',
    'Training',
    now(),
    false,
    true
  ),
  (
    'TODO — Why Mighty Oaks and Project Echelon',
    'why-these-partners',
    'TODO — summary explaining the choice of beneficiary organizations.',
    'TODO — full body copy on the partner organizations.',
    'Mighty Oaks',
    now(),
    false,
    true
  );

-- Illustrative sponsorship request, to preview the admin review queue
-- (/admin/sponsorships). Fictional company name for demo purposes only.
with new_request as (
  insert into public.sponsorship_requests (
    contact_name, organization_name, email, phone, website, industry,
    proposed_tier, cash_value, in_kind_value, support_type, description,
    requested_benefits, requested_mile_number, referral_source,
    acknowledged_pending_review, status
  )
  values (
    '[Demo Contact Name]',
    '[Demo Sponsor Co. — sample]',
    'demo@example.com',
    null,
    'https://example.com',
    'Outdoor Retail',
    'mile',
    1000,
    null,
    array['cash']::text[],
    'Demo submission: proposing to sponsor Mile 40 in cash.',
    'Logo on website, mention in one campaign update.',
    40,
    'Instagram',
    true,
    'submitted'
  )
  returning id
)
insert into public.sponsorship_status_history (request_id, previous_status, new_status, administrator, note)
select id, null, 'submitted', null, 'Submitted via public sponsorship request form.'
from new_request;
