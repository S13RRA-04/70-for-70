-- One-time migration: adds mission_partners.partner_type (backfilled from
-- existing relationship_label values), creates public.raffle_items, and
-- seeds the raffle's first confirmed supporter/item (Bombs & Blades Hot
-- Sauce). Run this manually, once, against the live Supabase project. See
-- both tables' comments in schema.sql for the full rationale.

begin;

alter table public.mission_partners add column if not exists partner_type text
  check (
    partner_type is null or partner_type in (
      'campaign-sponsor', 'gear-partner', 'service-partner', 'print-partner',
      'accommodations-partner', 'training-partner', 'raffle-supporter'
    )
  );

update public.mission_partners set partner_type = 'gear-partner' where relationship_label = 'Gear Partner';
update public.mission_partners set partner_type = 'campaign-sponsor' where relationship_label = 'Campaign Sponsor';
update public.mission_partners set partner_type = 'accommodations-partner' where relationship_label = 'Accommodations Partner';
update public.mission_partners set partner_type = 'print-partner' where relationship_label = 'Print Partner';
update public.mission_partners set partner_type = 'service-partner' where relationship_label = 'Service Partner';
update public.mission_partners set partner_type = 'training-partner' where relationship_label = 'Training Partner';

create table if not exists public.raffle_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  display_order integer not null default 0,
  partner_id uuid references public.mission_partners (id) on delete set null,
  brand text not null,
  item_name text not null,
  quantity integer not null default 1,
  retail_value_min numeric,
  retail_value_max numeric,
  image_url text,
  status text not null default 'confirmed' check (status in ('confirmed', 'received')),
  website_url text,
  donor_note text,
  featured boolean not null default false
);

create index if not exists raffle_items_display_order_idx on public.raffle_items (display_order);

alter table public.raffle_items enable row level security;

drop policy if exists "raffle items are publicly readable" on public.raffle_items;
create policy "raffle items are publicly readable"
  on public.raffle_items for select
  to anon, authenticated
  using (true);

-- Seed: Bombs & Blades Hot Sauce — the raffle's first confirmed supporter
-- and item, inserted together so the item can link back to its brand's
-- profile card via partner_id.
with new_partner as (
  insert into public.mission_partners
    (name, relationship_label, description, website_url, partner_type, display_order, logo_url, logo_permission, relationship_start)
  values (
    'Bombs & Blades Hot Sauce',
    'Raffle Supporter',
    'Alabama veteran-owned brand supporting the Tri For the 22 fundraising raffle with a donated Trinity Pack.',
    'https://bombsandblades.com',
    'raffle-supporter',
    0,
    '/partners/bombs-and-blades-logo.png',
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
select id, 'Bombs & Blades Hot Sauce', 'Trinity Pack — three-pack of Bombs & Blades hot sauces', 1, 35, 40, 'confirmed', 'https://bombsandblades.com', 0
from new_partner
where not exists (
  select 1 from public.raffle_items where brand = 'Bombs & Blades Hot Sauce' and item_name = 'Trinity Pack — three-pack of Bombs & Blades hot sauces'
);

commit;
