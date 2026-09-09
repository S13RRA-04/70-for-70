-- One-time migration: retires the "Fundraiser Raffle" concept entirely.
-- Raffles are not legally viable for this campaign — the two existing
-- raffle-item donors must instead be free giveaway prizes, entered by free
-- 22-for-the-22 event registration, same as every other giveaway prize.
--
-- This migration:
--   1. Copies every public.raffle_items row into public.giveaway_prizes,
--      tied to the current 22-for-the-22-2026 event.
--   2. Reclassifies the two donor mission_partners rows from
--      'raffle-supporter' to 'giveaway-supporter', updates their
--      relationship_label, and tags them into the event's
--      associated_campaigns so they appear on the event's Supporters wall.
--   3. Empties public.raffle_items (no code references it anymore after
--      this deploy) — the table itself is left in place rather than
--      dropped, so this migration has no irreversible DDL.
--
-- Run this manually, once, against the live Supabase project.

begin;

insert into public.giveaway_prizes (
  event_id, display_order, partner_id, brand, prize_name, quantity,
  winner_count, retail_value_min, retail_value_max, image_url, status,
  website_url, donor_note, featured
)
select
  (select id from public.event_config where event_slug = '22-for-the-22-2026'),
  ri.display_order,
  ri.partner_id,
  ri.brand,
  ri.item_name,
  ri.quantity,
  1,
  ri.retail_value_min,
  ri.retail_value_max,
  ri.image_url,
  ri.status,
  ri.website_url,
  ri.donor_note,
  ri.featured
from public.raffle_items ri;

update public.mission_partners
set
  partner_type = 'giveaway-supporter',
  relationship_label = 'Giveaway Supporter',
  associated_campaigns = array(
    select distinct unnest(coalesce(associated_campaigns, '{}') || array['22-for-the-22'])
  )
where partner_type = 'raffle-supporter';

update public.mission_partners
set description = replace(description, 'the Tri For the 22 fundraising raffle', 'the 22 For the 22 giveaway')
where description like '%the Tri For the 22 fundraising raffle%';

delete from public.raffle_items;

commit;
