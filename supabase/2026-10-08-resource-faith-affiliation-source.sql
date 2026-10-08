alter table public.resource_records
  add column if not exists faith_affiliation_source text;

alter table public.resource_records
  drop constraint if exists resource_records_faith_affiliation_source_https;

alter table public.resource_records
  add constraint resource_records_faith_affiliation_source_https
  check (faith_affiliation_source is null or faith_affiliation_source ~ '^https://');
