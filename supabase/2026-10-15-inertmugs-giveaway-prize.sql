-- One-time data load: INERTmugs donated a tumbler + keychain to the
-- 22 For the 22 giveaway ($22 retail for the pair). One prize row, one
-- winner — the two items go out together.
--
-- partner_id points at INERTmugs' existing mission_partners row (see
-- supabase/2026-10-09-inertmugs-overall-supporter.sql) so the prize card
-- shows their logo. That row's associated_campaigns is deliberately left
-- null (overall initiative supporter, rendered under "Initiative
-- Supporters" on /network), so this does NOT tag them '22-for-the-22'.
--
-- The photo was uploaded to the journal-media bucket beside the other
-- prize photos (giveaway-prizes/inertmugs-tumbler-keychain.jpeg).
-- Idempotent: re-running skips the insert if the prize already exists.
-- Run manually, once, against the live Supabase project.

begin;

insert into public.giveaway_prizes
  (event_id, display_order, partner_id, brand, prize_name, quantity, winner_count,
   retail_value_min, retail_value_max, image_url, status, website_url)
select
  '60a984f3-dcdc-4348-a0b7-29f8cab892e3',  -- the 22 For the 22 event_config row
  coalesce((select max(display_order) + 1 from public.giveaway_prizes
            where event_id = '60a984f3-dcdc-4348-a0b7-29f8cab892e3'), 0),
  (select id from public.mission_partners where name = 'INERTmugs'),
  'INERTmugs',
  'Tumbler + Keychain',
  1,
  1,
  22,
  22,
  'https://wjwgzphvpulkofvuksko.supabase.co/storage/v1/object/public/journal-media/giveaway-prizes/inertmugs-tumbler-keychain.jpeg',
  'received',
  'https://www.inertmugs.com/'
where not exists (
  select 1 from public.giveaway_prizes
  where brand = 'INERTmugs' and prize_name = 'Tumbler + Keychain'
);

commit;
