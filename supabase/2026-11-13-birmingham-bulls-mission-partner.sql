-- Adds the Birmingham Bulls as a Tri For The 22 Mission Partner for the
-- November 20, 2026 Military Night ticket fundraiser benefiting Mighty Oaks
-- Foundation. Apply manually to the linked production project.

begin;

insert into public.mission_partners
  (name, relationship_label, description, website_url, partner_type, support_type,
   associated_campaigns, display_order, logo_url, logo_permission,
   relationship_start, active)
values (
  'Birmingham Bulls Hockey',
  'Mission Partner',
  'The Birmingham Bulls partnered with Tri For The 22 for Military Night on November 20, 2026. Four dollars from every ticket purchased through the event fundraiser link supports Mighty Oaks Foundation.',
  'https://www.bullshockey.net/',
  'campaign-sponsor',
  'Military Night ticket fundraiser benefiting Mighty Oaks Foundation',
  array['tri'],
  18,
  '/partners/birmingham-bulls-logo.avif',
  true,
  date '2026-11-13',
  true
)
on conflict (name) do update set
  relationship_label = excluded.relationship_label,
  description = excluded.description,
  website_url = excluded.website_url,
  partner_type = excluded.partner_type,
  support_type = excluded.support_type,
  associated_campaigns = excluded.associated_campaigns,
  display_order = excluded.display_order,
  logo_url = excluded.logo_url,
  logo_permission = excluded.logo_permission,
  relationship_start = excluded.relationship_start,
  active = excluded.active;

commit;
