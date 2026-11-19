-- Preserve all public resource fields before resource_records becomes the
-- production source of truth for the directory.
alter table public.resource_records
  add column if not exists crisis_resource boolean not null default false,
  add column if not exists crisis_audience text,
  add column if not exists phone text,
  add column if not exists text_contact text,
  add column if not exists hours text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'resource_records_crisis_audience_check'
      and conrelid = 'public.resource_records'::regclass
  ) then
    alter table public.resource_records
      add constraint resource_records_crisis_audience_check
      check (crisis_audience is null or crisis_audience in ('veterans', 'first-responders', 'general'));
  end if;
end $$;

