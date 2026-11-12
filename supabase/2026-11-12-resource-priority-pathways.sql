-- Richer, need-first resource metadata for the six priority discovery paths.
alter table public.resource_records
  add column if not exists service_tags text[] not null default '{}',
  add column if not exists service_type text,
  add column if not exists delivery_methods text[] not null default '{}',
  add column if not exists application_status text not null default 'unknown',
  add column if not exists review_due date,
  add column if not exists verification_url text;

alter table public.resource_records
  drop constraint if exists resource_records_application_status_check,
  add constraint resource_records_application_status_check
    check (application_status in ('open','closed','scheduled','ongoing','unknown')),
  drop constraint if exists resource_records_verification_url_check,
  add constraint resource_records_verification_url_check
    check (verification_url is null or verification_url ~ '^https://');

create index if not exists resource_records_situational_tags_idx
  on public.resource_records using gin (situational_tags);
create index if not exists resource_records_service_tags_idx
  on public.resource_records using gin (service_tags);

