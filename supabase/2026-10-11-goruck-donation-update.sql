-- One-time data update: GORUCK's existing mission_partners row (see
-- supabase/2026-10-08-goruck-ruck-partner.sql) gets a more specific
-- description now that the actual donated items are known — a Rucker, a
-- 20lb ruck plate, and a pair of Mackall 45 rucking shoes. Run manually,
-- once, against the live Supabase project.

begin;

insert into public.mission_partners
  (name, relationship_label, description, website_url, partner_type, support_type, associated_campaigns, display_order, logo_url, logo_permission, relationship_start)
values (
  'GORUCK',
  'Gear Partner',
  'Veteran-owned maker of Special Forces-standard rucksacks and training gear — donated a Rucker, a 20lb ruck plate, and a pair of Mackall 45 rucking shoes to support Ruck For The 22.',
  'https://www.goruck.com',
  'gear-partner',
  'Rucker, 20lb Ruck Plate, Mackall 45 Shoes',
  array['ruck'],
  0,
  '/partners/goruck-logo.png',
  true,
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
  logo_permission = excluded.logo_permission;

commit;
