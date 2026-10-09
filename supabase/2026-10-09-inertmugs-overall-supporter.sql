-- One-time data load: adds INERTmugs as an overall mission supporter
-- (associated_campaigns left null, not scoped to any single campaign) — a
-- cross-promotion brand ally, not a product/cash donor. See
-- supabase/2026-10-08-goruck-ruck-partner.sql for the pattern this follows.
-- Run manually, once, against the live Supabase project.

begin;

insert into public.mission_partners
  (name, relationship_label, description, website_url, partner_type, tier, associated_campaigns, display_order, logo_url, logo_permission, relationship_start)
values (
  'INERTmugs',
  'Ally',
  'INERTmugs designs tactical tumblers, mugs, and gear built for veterans, patriots, and those who support them — a brand ally of the overall For The 22 mission, not any single campaign.',
  'https://www.inertmugs.com/',
  null,
  'ally',
  null,
  0,
  '/partners/inertmugs-logo.png',
  true,
  current_date
)
on conflict (name) do update set
  relationship_label = excluded.relationship_label,
  description = excluded.description,
  website_url = excluded.website_url,
  partner_type = excluded.partner_type,
  tier = excluded.tier,
  associated_campaigns = excluded.associated_campaigns,
  logo_url = excluded.logo_url,
  logo_permission = excluded.logo_permission;

commit;
