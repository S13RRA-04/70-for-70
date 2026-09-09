-- One-time status update: the Fire Department Coffee gift cards have
-- physically arrived. Marks that raffle_items row 'received' instead of
-- 'confirmed' — see raffle_items' comment in schema.sql for why the two
-- statuses are tracked separately. Run manually, once, against the live
-- Supabase project.

begin;

update public.raffle_items
set status = 'received'
where brand = 'Fire Department Coffee' and item_name = '$5 Gift Card';

commit;
