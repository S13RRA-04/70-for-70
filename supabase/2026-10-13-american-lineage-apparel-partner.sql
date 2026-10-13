-- One-time data load: adds American Lineage as a campaign supporter —
-- donated a USA-made athletic training shirt supporting Cody's training for
-- both Ruck For The 22 and Tri For The 22. See
-- supabase/2026-10-08-goruck-ruck-partner.sql for the pattern this follows.
-- Run manually, once, against the live Supabase project.

begin;

insert into public.mission_partners
  (name, relationship_label, description, website_url, partner_type, support_type, associated_campaigns, display_order, logo_url, logo_light_url, logo_background, logo_permission, tier, relationship_start)
values (
  'American Lineage',
  'Apparel Partner',
  'American Lineage is a USA-made athletic apparel company — donated a training shirt to support Cody''s athletic training for Ruck For The 22 and Tri For The 22.',
  'https://americanlineage.com',
  'gear-partner',
  'Athletic training shirt',
  array['tri', 'ruck'],
  10,
  '/partners/american-lineage-logo.png',
  '/partners/american-lineage-logo.png',
  'dark',
  true,
  'campaign-supporter',
  current_date
)
on conflict (name) do update set
  relationship_label = excluded.relationship_label,
  description = excluded.description,
  website_url = excluded.website_url,
  partner_type = excluded.partner_type,
  support_type = excluded.support_type,
  associated_campaigns = excluded.associated_campaigns,
  logo_url = excluded.logo_url,
  logo_light_url = excluded.logo_light_url,
  logo_background = excluded.logo_background,
  logo_permission = excluded.logo_permission,
  tier = excluded.tier;

commit;
