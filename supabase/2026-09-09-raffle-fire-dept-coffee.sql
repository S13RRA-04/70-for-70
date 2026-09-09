-- One-time data load: adds Fire Department Coffee as a second confirmed
-- raffle supporter (3x $5 gift cards). See supabase/2026-09-09-raffle.sql
-- for the pattern this follows. Run manually, once, against the live
-- Supabase project.

begin;

with new_partner as (
  insert into public.mission_partners
    (name, relationship_label, description, website_url, partner_type, display_order, logo_url, logo_permission, relationship_start)
  values (
    'Fire Department Coffee',
    'Raffle Supporter',
    'Veteran-owned coffee brand supporting the Tri For the 22 fundraising raffle with donated gift cards.',
    'https://www.firedeptcoffee.com/',
    'raffle-supporter',
    1,
    '/partners/fire-department-coffee-logo.png',
    true,
    current_date
  )
  on conflict (name) do update set
    relationship_label = excluded.relationship_label,
    description = excluded.description,
    website_url = excluded.website_url,
    partner_type = excluded.partner_type,
    logo_url = excluded.logo_url,
    logo_permission = excluded.logo_permission
  returning id
)
insert into public.raffle_items
  (partner_id, brand, item_name, quantity, retail_value_min, retail_value_max, status, website_url, display_order)
select id, 'Fire Department Coffee', '$5 Gift Card', 3, 5, 5, 'confirmed', 'https://www.firedeptcoffee.com/', 1
from new_partner
where not exists (
  select 1 from public.raffle_items where brand = 'Fire Department Coffee' and item_name = '$5 Gift Card'
);

commit;
