-- One-time data load: adds GORUCK as a campaign partner specific to Ruck
-- For The 22 (event-day gear for RuckUp22 Huntsville). See
-- supabase/2026-09-09-raffle-fire-dept-coffee.sql for the pattern this
-- follows. Run manually, once, against the live Supabase project.

begin;

insert into public.mission_partners
  (name, relationship_label, description, website_url, partner_type, associated_campaigns, display_order, logo_url, logo_permission, relationship_start)
values (
  'GORUCK',
  'Gear Partner',
  'Veteran-owned maker of Special Forces-standard rucksacks and training gear, supporting RuckUp22 Huntsville with event-day gear for Ruck For The 22.',
  'https://www.goruck.com',
  'gear-partner',
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
  associated_campaigns = excluded.associated_campaigns,
  logo_url = excluded.logo_url,
  logo_permission = excluded.logo_permission;

commit;
