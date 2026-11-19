-- ===========================================================================
-- Voices For The 22 — talent participation portal
--
-- Apply by hand (SQL Editor or `supabase db query`), like every other dated
-- file in this folder. Idempotent: safe to re-run. Mirrored into schema.sql.
--
-- Trust model (same as inquiries/triathlon_team_applications):
--   * RLS is enabled with NO anon/authenticated policies on every table
--     except voices_publications, which anon may read only when a row is
--     published and its go-live time has passed — and even then only the
--     public columns granted below. Everything else is service-role only,
--     reached through /api/voices/* (public submissions) and /admin/voices
--     (requireAdminUser()).
--   * Four separate status columns (talent.outreach_status,
--     submission.review_status, permission.status, publication.status) so
--     an email reply can never stand in for a publication approval.
--   * Enum-like CHECK lists mirror src/lib/voices/model.ts — change both.
-- ===========================================================================

create extension if not exists pgcrypto;

-- Shared updated_at trigger function (created here if schema.sql's isn't present).
create or replace function public.voices_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Talent: participant identity, category, public attribution, outreach state.
-- ---------------------------------------------------------------------------
create table if not exists public.voices_talent (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null check (char_length(name) between 1 and 200),
  category text not null default 'other' check (category in (
    'entertainment', 'music', 'athletics', 'military', 'first_responder',
    'public_figure', 'organizational_partner', 'other'
  )),
  professional_title text,
  -- Only used publicly once a permission agreement approves it.
  public_attribution text,

  outreach_status text not null default 'identified' check (outreach_status in (
    'identified', 'researching_contact', 'ready_for_outreach', 'contacted',
    'delivery_failed', 'awaiting_response', 'referred', 'interested',
    'participation_offered', 'declined', 'follow_up_later',
    'recording_received', 'permissions_pending', 'approved', 'published', 'withdrawn'
  )),
  contact_source text,
  source_verified_on date,
  outreach_on date,
  last_contact_on date,
  follow_up_on date,
  response_summary text,
  internal_notes text
);

create index if not exists voices_talent_outreach_status_idx on public.voices_talent (outreach_status);
create index if not exists voices_talent_follow_up_on_idx on public.voices_talent (follow_up_on) where follow_up_on is not null;
create index if not exists voices_talent_category_idx on public.voices_talent (category);

-- ---------------------------------------------------------------------------
-- Talent contacts: representatives / organizations / verified contact methods.
-- Professional contact details only — never personal phone numbers.
-- ---------------------------------------------------------------------------
create table if not exists public.voices_talent_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  talent_id uuid not null references public.voices_talent (id) on delete cascade,

  contact_name text not null check (char_length(contact_name) between 1 and 200),
  role text not null default 'representative' check (role in (
    'self', 'representative', 'manager', 'publicist', 'agent', 'organization', 'other'
  )),
  organization text,
  email text,
  other_method text,
  source text,
  verified_on date,
  is_primary boolean not null default false
);

create index if not exists voices_talent_contacts_talent_idx on public.voices_talent_contacts (talent_id);

-- ---------------------------------------------------------------------------
-- Outreach activity: one row per touchpoint. Logged by an admin; the portal
-- never sends outreach on its own.
-- ---------------------------------------------------------------------------
create table if not exists public.voices_outreach_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  talent_id uuid not null references public.voices_talent (id) on delete cascade,
  contact_id uuid references public.voices_talent_contacts (id) on delete set null,

  occurred_on date not null default current_date,
  channel text not null default 'email' check (channel in ('email', 'phone', 'social', 'in_person', 'referral', 'other')),
  direction text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  delivery_status text not null default 'not_applicable' check (delivery_status in (
    'not_applicable', 'sent', 'delivered', 'bounced', 'failed', 'no_response'
  )),
  summary text not null check (char_length(summary) between 1 and 4000),
  response text,
  follow_up_on date,
  created_by text
);

create index if not exists voices_outreach_activities_talent_idx on public.voices_outreach_activities (talent_id, occurred_on desc);
create index if not exists voices_outreach_activities_delivery_idx on public.voices_outreach_activities (delivery_status);

-- ---------------------------------------------------------------------------
-- Video submissions: metadata + PRIVATE storage paths (bucket voices-submissions).
-- ---------------------------------------------------------------------------
create table if not exists public.voices_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reference_code text not null unique,
  source text not null default 'portal' check (source in ('portal', 'admin')),
  talent_id uuid references public.voices_talent (id) on delete set null,

  review_status text not null default 'awaiting_upload' check (review_status in (
    'awaiting_upload', 'received', 'under_review', 'needs_changes', 'approved', 'rejected', 'withdrawn'
  )),

  participant_name text not null check (char_length(participant_name) between 1 and 200),
  submitter_name text not null check (char_length(submitter_name) between 1 and 200),
  submitter_email text not null check (char_length(submitter_email) between 3 and 320),
  relationship text not null,
  professional_title text,
  representative_agency text,
  preferred_attribution text,
  social_handles text,
  website text,
  suggested_publication_date date,
  embargo_until date,
  usage_restrictions text,
  additional_instructions text,

  -- Untrusted; stored and displayed as text, never fetched server-side.
  video_link text,
  video_path text,
  video_original_name text,
  video_size_bytes bigint,
  headshot_path text,
  release_path text,
  -- Results of the post-upload magic-byte check, per file.
  file_check jsonb not null default '{}'::jsonb,

  authorized_confirmed boolean not null,
  terms_acknowledged boolean not null,

  -- SHA-256 of the one-time token the browser uses to finalize its upload.
  finalize_token_hash text,
  finalize_expires_at timestamptz,
  submitted_at timestamptz,

  reviewer_notes text,
  reviewed_at timestamptz,
  reviewed_by text,
  -- Set when an admin purges the stored files (retention/withdrawal); the
  -- metadata row stays as a minimal record. "Has a video" is enforced by the
  -- API's validation rather than a CHECK, since purging/rejecting clears it.
  files_deleted_at timestamptz
);

create index if not exists voices_submissions_status_idx on public.voices_submissions (review_status, created_at desc);
create index if not exists voices_submissions_talent_idx on public.voices_submissions (talent_id);

-- ---------------------------------------------------------------------------
-- Permission agreements: the release, as recorded. A signed document (if any)
-- lives in the private bucket. Revocation is a status, never a delete.
-- ---------------------------------------------------------------------------
create table if not exists public.voices_permission_agreements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  talent_id uuid not null references public.voices_talent (id) on delete cascade,
  submission_id uuid references public.voices_submissions (id) on delete set null,

  release_version text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'signed', 'revoked', 'expired')),
  signatory_name text,
  signatory_capacity text check (signatory_capacity is null or signatory_capacity in ('participant', 'authorized_representative')),
  representative_authority text,

  permitted_channels text[] not null default array['website']::text[] check (
    permitted_channels <@ array['website', 'organic_social', 'approved_mission_channel']::text[]
  ),
  approved_mission_channels text,
  permitted_edits text[] not null default array['length', 'captions', 'accessibility', 'audio_normalization', 'aspect_ratio']::text[] check (
    permitted_edits <@ array['length', 'captions', 'accessibility', 'audio_normalization', 'aspect_ratio', 'campaign_branding']::text[]
  ),
  approved_attribution text,
  restrictions text,
  requires_participant_approval boolean not null default false,
  usage_starts_on date,
  usage_ends_on date,
  signed_on date,
  signed_document_path text,
  revoked_at timestamptz,
  revocation_reason text,

  constraint voices_permission_usage_window check (usage_ends_on is null or usage_starts_on is null or usage_ends_on >= usage_starts_on)
);

create index if not exists voices_permission_agreements_talent_idx on public.voices_permission_agreements (talent_id);
create index if not exists voices_permission_agreements_status_idx on public.voices_permission_agreements (status);

-- ---------------------------------------------------------------------------
-- Publications: the approved, public-facing record of a video.
-- ---------------------------------------------------------------------------
create table if not exists public.voices_publications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  talent_id uuid not null references public.voices_talent (id) on delete restrict,
  submission_id uuid references public.voices_submissions (id) on delete restrict,
  permission_id uuid references public.voices_permission_agreements (id) on delete restrict,

  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug <> 'talent'),
  display_name text not null,
  attribution text,
  category text not null default 'other',
  summary text,
  transcript text,
  video_url text,
  video_type text not null default 'video/mp4',
  poster_url text,
  captions_url text,
  external_url text,
  channels text[] not null default array['website']::text[] check (
    channels <@ array['website', 'organic_social', 'approved_mission_channel']::text[]
  ),

  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  publish_at timestamptz,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  participant_approved_at timestamptz,
  published_by text,
  unpublished_at timestamptz,
  unpublish_reason text,

  constraint voices_publications_published_has_video check (status <> 'published' or (video_url is not null and publish_at is not null))
);

create index if not exists voices_publications_public_idx on public.voices_publications (status, publish_at desc);
create index if not exists voices_publications_talent_idx on public.voices_publications (talent_id);

-- ---------------------------------------------------------------------------
-- Audit trail: permission changes, publication decisions, withdrawals, etc.
-- Append-only by convention (the app never updates or deletes these rows).
-- ---------------------------------------------------------------------------
create table if not exists public.voices_audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_email text,
  entity_type text not null check (entity_type in ('talent', 'contact', 'outreach', 'submission', 'permission', 'publication')),
  entity_id uuid,
  talent_id uuid references public.voices_talent (id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb
);

create index if not exists voices_audit_events_created_idx on public.voices_audit_events (created_at desc);
create index if not exists voices_audit_events_talent_idx on public.voices_audit_events (talent_id, created_at desc);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'voices_talent', 'voices_talent_contacts', 'voices_outreach_activities',
    'voices_submissions', 'voices_permission_agreements', 'voices_publications'
  ] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.voices_set_updated_at()',
      t || '_updated_at', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- RLS: default-deny everywhere; anon may read published publications only,
-- and only the public columns.
-- ---------------------------------------------------------------------------
alter table public.voices_talent enable row level security;
alter table public.voices_talent_contacts enable row level security;
alter table public.voices_outreach_activities enable row level security;
alter table public.voices_submissions enable row level security;
alter table public.voices_permission_agreements enable row level security;
alter table public.voices_publications enable row level security;
alter table public.voices_audit_events enable row level security;

revoke all on public.voices_talent, public.voices_talent_contacts, public.voices_outreach_activities,
  public.voices_submissions, public.voices_permission_agreements, public.voices_audit_events
  from anon, authenticated;

revoke all on public.voices_publications from anon, authenticated;
grant select (
  id, slug, display_name, attribution, category, summary, transcript,
  video_url, video_type, poster_url, captions_url, external_url,
  publish_at, is_featured, display_order
) on public.voices_publications to anon, authenticated;

drop policy if exists "Published voices are public" on public.voices_publications;
create policy "Published voices are public"
  on public.voices_publications
  for select
  to anon, authenticated
  using (status = 'published' and publish_at is not null and publish_at <= now());

-- ---------------------------------------------------------------------------
-- Storage buckets.
--   voices-submissions: PRIVATE. Raw uploads, headshots, signed releases.
--     No storage.objects policies → only the service role (server code) can
--     read/write; browsers upload with short-lived signed upload URLs and
--     admins download with short-lived signed URLs.
--   voices-public: PUBLIC read. Only admin-prepared, permission-cleared
--     publication assets (final video, poster, captions) go here.
-- file_size_limit must not exceed the project's global upload limit
-- (Dashboard → Storage → Settings). 500 MB requires a paid plan; on the Free
-- plan lower both this and VOICES_UPLOAD_MAX_MB to 50.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voices-submissions', 'voices-submissions', false, 524288000,
  array['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voices-public', 'voices-public', true, 524288000,
  array['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp', 'text/vtt']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
