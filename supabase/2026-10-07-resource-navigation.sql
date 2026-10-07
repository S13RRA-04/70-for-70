-- Structured source of truth for progressive resource enrichment.
create table if not exists public.resource_records (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  name text not null,
  url text not null,
  description text not null,
  organization_type text check (organization_type in ('nonprofit','government','commercial','peer-community','education','other')),
  verification_status text not null default 'pending-review' check (verification_status in ('verified','reviewed','community-recommended','pending-review','information-incomplete')),
  why_included text,
  need_category_ids text[] not null default '{}',
  audience_tags text[] not null default '{}',
  situational_tags text[] not null default '{}',
  cost text not null,
  geographic_scope text not null,
  state text,
  veteran_led boolean,
  first_responder_led boolean,
  faith_based boolean,
  peer_led boolean,
  virtual_available boolean,
  in_person_available boolean,
  self_referral boolean,
  employer_involvement_required boolean,
  anonymous_initial_contact boolean,
  outside_agency_provider boolean,
  insurance_required boolean,
  referral_required boolean,
  application_required boolean,
  documentation_required boolean,
  confidentiality_policy_url text,
  eligibility text,
  availability text,
  is_active boolean not null default false,
  last_verified_at date,
  verification_source text,
  verification_notes text,
  last_contact_attempt_at date,
  reviewer_id uuid references auth.users(id) on delete set null,
  needs_re_review boolean not null default false,
  broken_link boolean not null default false,
  community_complaint boolean not null default false,
  organization_response text,
  organization_confirmed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resource_records_active_idx on public.resource_records (is_active) where is_active;
create index if not exists resource_records_state_idx on public.resource_records (state) where is_active;
create index if not exists resource_records_need_categories_idx on public.resource_records using gin (need_category_ids);
create index if not exists resource_records_audience_tags_idx on public.resource_records using gin (audience_tags);

alter table public.resource_records enable row level security;
drop policy if exists "active resource records are publicly readable" on public.resource_records;
create policy "active resource records are publicly readable" on public.resource_records for select to anon, authenticated using (is_active);
revoke all on table public.resource_records from anon, authenticated;
grant select on table public.resource_records to anon, authenticated;
