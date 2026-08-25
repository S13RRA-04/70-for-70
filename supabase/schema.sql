-- For The 22 / Tri For The 22 — database schema
--
-- Run this against a Supabase project (SQL Editor, `supabase db query`, or a
-- migration generated from this file) before running seed.sql. Idempotent:
-- safe to re-run against an already-provisioned database.
--
-- Manual step (not expressible as SQL DDL): create a public Storage bucket
-- named "journal-media" (Studio > Storage, or `supabase storage create
-- journal-media --public`), then run the storage policy below so uploaded
-- Journal images are publicly readable:
--
--   create policy "journal media is publicly readable"
--     on storage.objects for select
--     to anon, authenticated
--     using (bucket_id = 'journal-media');
--
-- No insert/update/delete storage policy — uploads go through the
-- service-role key via uploadJournalImageAction, same trust model as every
-- table write in this file.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- campaign
-- ---------------------------------------------------------------------------
create table if not exists public.campaign (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fundraising_goal numeric(12, 2) not null check (fundraising_goal > 0),
  amount_raised numeric(12, 2) not null default 0 check (amount_raised >= 0),
  race_distance numeric(5, 2) not null check (race_distance > 0),
  race_date timestamptz,
  race_location text,
  -- How donations are credited across beneficiary organizations. Null until
  -- the campaign owner finalizes a policy — the frontend must not display
  -- or imply an allocation breakdown while this is null. See
  -- CampaignAllocation and README's Priority 10 notes.
  allocation_policy text check (
    allocation_policy is null or allocation_policy in (
      'even_split', 'donor_choice', 'campaign_defined', 'separate_totals'
    )
  ),
  updated_at timestamptz not null default now()
);

comment on table public.campaign is
  'Single-row table holding campaign-wide totals and race metadata.';

-- ---------------------------------------------------------------------------
-- miles
-- ---------------------------------------------------------------------------
create table if not exists public.miles (
  id uuid primary key default gen_random_uuid(),
  mile_number integer not null unique check (mile_number between 1 and 70),
  goal_amount numeric(10, 2) not null default 1000 check (goal_amount > 0),
  amount_funded numeric(10, 2) not null default 0 check (amount_funded >= 0),
  status text not null default 'available'
    check (status in ('available', 'requested', 'reserved', 'partially_funded', 'funded')),
  dedication text,
  updated_at timestamptz not null default now()
);

create index if not exists miles_status_idx on public.miles (status);
create index if not exists miles_mile_number_idx on public.miles (mile_number);

comment on column public.miles.status is
  'available: open. requested/reserved: a business sponsorship proposal exists '
  'for this mile but is not yet approved/verified — does not itself affect '
  'campaign.amount_raised. partially_funded/funded: driven by verified donations.';

-- ---------------------------------------------------------------------------
-- donations
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  mile_id uuid references public.miles (id) on delete set null,
  donor_name text not null,
  amount numeric(10, 2) not null check (amount > 0),
  organization_benefited text,
  anonymous boolean not null default false,
  -- Optional "in honor of" / "in memory of" dedication. Only ever rendered
  -- publicly once both `verified` and `dedication_public` are true.
  dedication_type text check (dedication_type is null or dedication_type in ('in_honor_of', 'in_memory_of')),
  dedication_name text,
  dedication_message text,
  -- Optional branch of service for the honoree, e.g. "U.S. Army". Free text
  -- rather than an enum since it may name a specific unit/component, not
  -- just the branch.
  dedication_branch text,
  dedication_public boolean not null default true,
  date timestamptz not null default now(),
  external_reference text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists donations_mile_id_idx on public.donations (mile_id);
create index if not exists donations_verified_idx on public.donations (verified);

-- ---------------------------------------------------------------------------
-- sponsorship_requests
--
-- A proposed sponsorship (cash, goods, services, travel, equipment, race
-- entry, or other) submitted for review. No sponsorship is accepted, no
-- payment is collected, and no sponsor is published on this table's
-- existence alone — see the status workflow below and the "Activate Sponsor"
-- admin action, which is the only code path that inserts into public.sponsors.
-- ---------------------------------------------------------------------------
create table if not exists public.sponsorship_requests (
  id uuid primary key default gen_random_uuid(),

  -- Requester
  contact_name text not null,
  organization_name text not null,
  email text not null,
  phone text,
  website text,
  industry text,

  -- Proposal
  proposed_tier text check (
    proposed_tier in ('mile', 'supporting', 'mission', 'presenting', 'unsure')
  ),
  cash_value numeric(12, 2) check (cash_value >= 0),
  in_kind_value numeric(12, 2) check (in_kind_value >= 0),
  support_type text[] not null check (
    support_type <@ array['cash', 'goods', 'services', 'travel', 'equipment', 'race_entry', 'other']::text[]
    and array_length(support_type, 1) > 0
  ),
  description text not null,
  requested_benefits text,
  requested_mile_number integer references public.miles (mile_number),
  referral_source text,
  message text,

  -- Required acknowledgment that this is a request, not an acceptance.
  acknowledged_pending_review boolean not null check (acknowledged_pending_review = true),

  -- Status workflow — see README for the full state machine and admin flow.
  status text not null default 'submitted' check (
    status in (
      'submitted', 'under_review', 'additional_information_requested',
      'ethics_review', 'approved', 'declined', 'withdrawn', 'completed'
    )
  ),

  -- Internal vetting (never exposed to the public frontend — see RLS below).
  internal_notes text,
  organization_researched boolean not null default false,
  website_reviewed boolean not null default false,
  ownership_reviewed boolean not null default false,
  relationship_to_campaign_owner text,
  known_government_relationship boolean not null default false,
  known_doj_fbi_relationship boolean not null default false,
  government_contractor_status boolean not null default false,
  prohibited_source_concern boolean not null default false,
  official_position_concern boolean not null default false,
  ethics_consultation_required boolean not null default false,
  ethics_approval_received boolean not null default false,
  ethics_reference text,
  final_disposition text,

  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  approved_at timestamptz,
  declined_at timestamptz
);

comment on table public.sponsorship_requests is
  'Sponsorship proposals pending human review. Submitting this form is only '
  'an inquiry — see the acknowledged_pending_review constraint. Approval and '
  'sponsor activation are separate, administrator-only actions.';

create index if not exists sponsorship_requests_status_idx on public.sponsorship_requests (status);
create index if not exists sponsorship_requests_submitted_at_idx on public.sponsorship_requests (submitted_at desc);
create index if not exists sponsorship_requests_requested_mile_idx on public.sponsorship_requests (requested_mile_number);

-- ---------------------------------------------------------------------------
-- sponsorship_status_history — append-only audit trail. Never delete rows,
-- including for declined/withdrawn requests.
-- ---------------------------------------------------------------------------
create table if not exists public.sponsorship_status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.sponsorship_requests (id) on delete cascade,
  previous_status text,
  new_status text not null,
  administrator text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists sponsorship_status_history_request_id_idx
  on public.sponsorship_status_history (request_id, created_at);

-- ---------------------------------------------------------------------------
-- sponsors
-- ---------------------------------------------------------------------------
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('presenting', 'mission', 'supporting', 'mile', 'community')),
  contribution_value numeric(10, 2) check (contribution_value >= 0),
  logo_url text,
  website_url text,
  description text,
  active boolean not null default true,
  display_order integer not null default 0,
  -- Traceability back to the approved request that authorized this sponsor.
  -- Nullable because early/manually-entered sponsors may predate the
  -- sponsorship request workflow.
  sponsorship_request_id uuid references public.sponsorship_requests (id) on delete set null,
  -- Internal relationship record-keeping — never rendered on the public
  -- site. Free text, not an enum, since real-world agreement status
  -- ("verbal", "MOU signed", "expired") varies too informally for a fixed
  -- set of values. Filled in by hand via the Supabase table editor as
  -- relationships are confirmed, not by application code.
  agreement_status text,
  logo_permission boolean not null default false,
  relationship_start date,
  relationship_end date,
  associated_campaigns text[],
  -- Compliance gate, distinct from `active` (visibility toggle): a
  -- sponsor is only ever rendered publicly once this is true. See
  -- getSponsors() in src/lib/data/sponsors.ts.
  ethics_cleared boolean not null default false,
  ethics_cleared_date date,
  disclosure_text text
);

create index if not exists sponsors_active_idx on public.sponsors (active);
create index if not exists sponsors_tier_display_order_idx on public.sponsors (tier, display_order);

-- Re-run-safe for databases where public.sponsors already existed before
-- these columns were added to the create table statement above.
alter table public.sponsors add column if not exists agreement_status text;
alter table public.sponsors add column if not exists logo_permission boolean not null default false;
alter table public.sponsors add column if not exists relationship_start date;
alter table public.sponsors add column if not exists relationship_end date;
alter table public.sponsors add column if not exists associated_campaigns text[];
alter table public.sponsors add column if not exists ethics_cleared boolean not null default false;
alter table public.sponsors add column if not exists ethics_cleared_date date;
alter table public.sponsors add column if not exists disclosure_text text;
create index if not exists sponsors_sponsorship_request_id_idx on public.sponsors (sponsorship_request_id);

-- ---------------------------------------------------------------------------
-- posts
--
-- Superseded by public.journal_entries below (the "Journal" feature). Left
-- in place, untouched, rather than dropped — SEED_POSTS has always been
-- empty so there is no real data at risk, but destructive drops aren't this
-- file's convention. Safe to manually drop once confirmed no environment has
-- real rows here.
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  body text not null,
  image_url text,
  category text not null check (
    category in (
      'Training', 'Fundraising', 'Mighty Oaks', 'Project Echelon',
      'Sponsors', 'Race Prep', 'Milestones'
    )
  ),
  published_at timestamptz,
  featured boolean not null default false,
  published boolean not null default false,
  training_metrics jsonb
);

create index if not exists posts_published_idx on public.posts (published, published_at desc);
create index if not exists posts_slug_idx on public.posts (slug);

-- ---------------------------------------------------------------------------
-- journal_entries
--
-- The campaign Journal: articles, training logs, vlogs, photo posts, and
-- milestones. Supports a draft/scheduled/published workflow (see the RLS
-- policy below, which self-publishes a scheduled entry once scheduled_for
-- has passed — no cron/background job required). Written entirely through
-- /admin/journal via the service-role key, same trust model as every other
-- table in this file.
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),

  post_type text not null check (post_type in ('article', 'vlog', 'photo', 'milestone')),
  primary_category text not null check (
    primary_category in (
      'Training', 'Fundraising', 'Mighty Oaks', 'Project Echelon',
      'Sponsors', 'Race Prep', 'Milestones'
    )
  ),
  tags text[] not null default '{}',

  title text not null,
  slug text not null unique,
  summary text not null,
  -- Markdown source, rendered via react-markdown on the public post page and
  -- in the admin editor's preview pane.
  body text not null,

  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  -- Set once, the first time status becomes 'published'. Never overwritten
  -- by later edits — see saveJournalEntryAction in src/app/admin/journal/actions.ts.
  published_at timestamptz,
  scheduled_for timestamptz,
  featured boolean not null default false,

  image_url text,
  -- [{ url, alt }, ...]. Null/omitted when there are no gallery images —
  -- never an empty array. See the "hide, don't fake" convention used
  -- throughout this file for optional media.
  gallery jsonb,

  video_url text,
  video_provider text check (video_provider is null or video_provider in ('youtube', 'vimeo')),

  -- Training log structured metrics (dedicated typed columns, not a jsonb
  -- bag, since this is a fixed known field set). Only populated fields are
  -- ever rendered — see training-metrics-panel.tsx.
  training_discipline text check (
    training_discipline is null or training_discipline in ('swim', 'bike', 'run', 'brick', 'strength', 'rest')
  ),
  training_distance numeric(6, 2),
  training_duration_minutes integer,
  training_pace text,
  training_elevation_ft integer,
  training_swim_pace text,
  training_bike_power_watts integer,
  training_avg_hr integer,
  training_rpe integer check (training_rpe is null or training_rpe between 1 and 10),
  training_phase text,

  -- Big-number layout for post_type = 'milestone'.
  milestone_kind text check (milestone_kind is null or milestone_kind in ('fundraising', 'training')),
  milestone_value text,

  -- Configurable per-post material-connection disclosure. Null = no
  -- disclosure shown. Rendered prominently near the top of the post, never
  -- buried in legal boilerplate.
  sponsor_disclosure text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists journal_entries_status_idx on public.journal_entries (status, published_at desc);
create unique index if not exists journal_entries_slug_idx on public.journal_entries (slug);
create index if not exists journal_entries_category_idx on public.journal_entries (primary_category);

-- ---------------------------------------------------------------------------
-- journal_entry_partner_mentions / journal_entry_beneficiary_mentions
--
-- Opt-in mentions of public.partners rows from a journal entry (spec:
-- "Supported by [Partner]" / "This campaign supports: [Beneficiary]").
-- Two small join tables rather than one with a type column, or a uuid[]
-- column on journal_entries: real referential integrity (a removed partner
-- cleanly cascades off any mention instead of leaving a dangling id), and
-- the two footer treatments are queried independently.
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entry_partner_mentions (
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  primary key (journal_entry_id, partner_id)
);

create table if not exists public.journal_entry_beneficiary_mentions (
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  primary key (journal_entry_id, partner_id)
);

-- ---------------------------------------------------------------------------
-- training_objectives
--
-- Concrete swim/bike/run milestones the athlete checks off while training
-- toward the race, shown alongside the WHOOP snapshot on /updates. Managed
-- entirely via /admin/training-objectives (add/toggle/delete) — see
-- getTrainingObjectives() and the admin actions for the only write paths.
-- ---------------------------------------------------------------------------
create table if not exists public.training_objectives (
  id uuid primary key default gen_random_uuid(),
  discipline text not null check (discipline in ('swim', 'bike', 'run')),
  label text not null,
  display_order integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists training_objectives_discipline_idx
  on public.training_objectives (discipline, display_order);

-- ---------------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  -- "Why It Matters to Me": Cody's own words on the personal connection.
  -- Always real content — never a placeholder — so it's safe to show publicly.
  description text not null,
  -- "What They Do": the organization's own approved description. Nullable
  -- and hidden on the frontend until supplied — never populated with a
  -- placeholder. See PartnerCard.
  what_they_do text,
  logo_url text,
  -- Light/dark logo variants + a background hint, so a logo doesn't
  -- disappear against whatever section background it lands on. See
  -- PartnerLogo. logo_background: null (default light card) or 'dark'.
  logo_light_url text,
  logo_dark_url text,
  logo_background text check (logo_background is null or logo_background in ('light', 'dark')),
  website_url text,
  donation_url text,
  -- Trust signals — only ever populated once independently verified, and
  -- hidden on the frontend while null/false. Never fabricate these.
  ein text,
  nonprofit_status_verified boolean not null default false,
  active boolean not null default true,
  -- Internal relationship record-keeping — never rendered on the public
  -- site. See the matching columns on public.sponsors for the rationale
  -- (free text, not an enum; filled in by hand as relationships firm up).
  agreement_status text,
  logo_permission boolean not null default false,
  relationship_start date,
  relationship_end date,
  associated_campaigns text[]
);

create index if not exists partners_active_idx on public.partners (active);

-- Re-run-safe for databases where public.partners already existed before
-- these columns were added to the create table statement above.
alter table public.partners add column if not exists agreement_status text;
alter table public.partners add column if not exists logo_permission boolean not null default false;
alter table public.partners add column if not exists relationship_start date;
alter table public.partners add column if not exists relationship_end date;
alter table public.partners add column if not exists associated_campaigns text[];
alter table public.partners add column if not exists logo_light_url text;
alter table public.partners add column if not exists logo_dark_url text;
alter table public.partners add column if not exists logo_background text
  check (logo_background is null or logo_background in ('light', 'dark'));

-- ---------------------------------------------------------------------------
-- mission_partners
--
-- Organizations that formally collaborate with For The 22 through
-- programming, referrals, resources, outreach, athlete support, or mission
-- amplification — distinct from public.partners (charitable beneficiaries):
-- no donation/EIN/nonprofit-verification fields, since a mission partner
-- isn't necessarily a fundraising recipient. See PartnersPage's Mission
-- Partners section.
-- ---------------------------------------------------------------------------
create table if not exists public.mission_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  relationship_label text not null,
  description text not null,
  logo_url text,
  logo_light_url text,
  logo_dark_url text,
  logo_background text check (logo_background is null or logo_background in ('light', 'dark')),
  website_url text,
  support_type text,
  geographic_scope text,
  active boolean not null default true,
  display_order integer not null default 0,
  -- Internal relationship record-keeping — never rendered on the public
  -- site. See the matching columns on public.sponsors for the rationale
  -- (free text, not an enum; filled in by hand as relationships firm up).
  agreement_status text,
  logo_permission boolean not null default false,
  relationship_start date,
  relationship_end date,
  associated_campaigns text[]
);

create index if not exists mission_partners_active_idx on public.mission_partners (active);

-- Re-run-safe for databases where public.mission_partners already existed
-- before these columns were added to the create table statement above.
alter table public.mission_partners add column if not exists agreement_status text;
alter table public.mission_partners add column if not exists logo_permission boolean not null default false;
alter table public.mission_partners add column if not exists relationship_start date;
alter table public.mission_partners add column if not exists relationship_end date;
alter table public.mission_partners add column if not exists associated_campaigns text[];
alter table public.mission_partners add column if not exists logo_light_url text;
alter table public.mission_partners add column if not exists logo_dark_url text;
alter table public.mission_partners add column if not exists logo_background text
  check (logo_background is null or logo_background in ('light', 'dark'));

-- ---------------------------------------------------------------------------
-- inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  email text not null,
  phone text,
  website text,
  -- Sponsor inquiries, "Join the Movement" interest (/join), and partner
  -- inquiries (/partners/inquire) all share this table for now — see
  -- JOIN_INTEREST_TYPES / PARTNER_INQUIRY_INTERESTS in
  -- src/lib/validation/inquiry.ts.
  interest text not null check (
    interest in (
      'Corporate Sponsor', 'Mile Sponsor', 'In-Kind Sponsor',
      'Community Partner', 'Media', 'Other',
      'Veteran Athlete', 'First Responder Athlete', 'Civilian Supporter',
      'Local Chapter/Event Interest',
      'Beneficiary Organization', 'Mission Partnership', 'Sponsorship',
      'In-Kind Support', 'Community Collaboration'
    )
  ),
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);

-- ---------------------------------------------------------------------------
-- email_subscribers
--
-- "Follow the Road to 70.3" signups. This table is just a durable capture
-- point — not bulk-email infrastructure. `synced_to_provider` tracks
-- whether a real email provider (not yet chosen) has picked it up; see
-- src/lib/email-list.ts.
-- ---------------------------------------------------------------------------
create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null unique,
  synced_to_provider boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_synced_idx on public.email_subscribers (synced_to_provider);

-- ---------------------------------------------------------------------------
-- whoop_tokens
--
-- Singleton row holding the athlete's own WHOOP OAuth tokens, used to
-- display a public "latest training" snapshot. This is the athlete
-- connecting their own account (via /admin/whoop) — not visitor data.
-- Tokens are never sent to the browser; only the derived, public-safe
-- snapshot (recovery/sleep/strain numbers, recent workouts) is rendered.
-- ---------------------------------------------------------------------------
create table if not exists public.whoop_tokens (
  id uuid primary key default gen_random_uuid(),
  whoop_user_id text not null,
  access_token text not null,
  refresh_token text not null,
  scope text not null,
  expires_at timestamptz not null,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.whoop_tokens is
  'Single row expected. Refresh tokens rotate on every use — always persist '
  'the new refresh_token returned alongside a refreshed access_token.';

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- MVP model: campaign content is public-read; writes go through the
-- service-role key (admin tooling / Supabase Studio / SQL) rather than
-- client-issued RLS policies. The inquiries table has NO public policies at
-- all — it's written only by the /api/inquiries route using the service-role
-- key server-side, and read only by admin server code after an auth check.
-- See README for the plan to add role-scoped authenticated-write policies
-- once real admin accounts exist.

alter table public.campaign enable row level security;
alter table public.miles enable row level security;
alter table public.donations enable row level security;
alter table public.sponsors enable row level security;
alter table public.posts enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_entry_partner_mentions enable row level security;
alter table public.journal_entry_beneficiary_mentions enable row level security;
alter table public.partners enable row level security;
alter table public.mission_partners enable row level security;
alter table public.training_objectives enable row level security;
alter table public.inquiries enable row level security;
alter table public.sponsorship_requests enable row level security;
alter table public.sponsorship_status_history enable row level security;
alter table public.whoop_tokens enable row level security;
alter table public.email_subscribers enable row level security;

create policy "campaign is publicly readable"
  on public.campaign for select
  to anon, authenticated
  using (true);

create policy "miles are publicly readable"
  on public.miles for select
  to anon, authenticated
  using (true);

create policy "verified donations are publicly readable"
  on public.donations for select
  to anon, authenticated
  using (verified = true);

create policy "active sponsors are publicly readable"
  on public.sponsors for select
  to anon, authenticated
  using (active = true);

create policy "published posts are publicly readable"
  on public.posts for select
  to anon, authenticated
  using (published = true);

-- A scheduled entry self-publishes the moment anyone reads past its
-- scheduled_for time — no cron/background job needed to flip the status.
create policy "published journal entries are publicly readable"
  on public.journal_entries for select
  to anon, authenticated
  using (status = 'published' or (status = 'scheduled' and scheduled_for <= now()));

create policy "journal entry partner mentions are publicly readable"
  on public.journal_entry_partner_mentions for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.journal_entries je
      where je.id = journal_entry_id and je.status = 'published'
    )
  );

create policy "journal entry beneficiary mentions are publicly readable"
  on public.journal_entry_beneficiary_mentions for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.journal_entries je
      where je.id = journal_entry_id and je.status = 'published'
    )
  );

create policy "active partners are publicly readable"
  on public.partners for select
  to anon, authenticated
  using (active = true);

create policy "active mission partners are publicly readable"
  on public.mission_partners for select
  to anon, authenticated
  using (active = true);

create policy "training objectives are publicly readable"
  on public.training_objectives for select
  to anon, authenticated
  using (true);
-- No insert/update/delete policy on public.training_objectives: only
-- requireAdminUser() + createAdminClient() (via /admin/training-objectives)
-- mutates this table.

-- No policies on public.inquiries: default-deny for anon/authenticated.
-- Only the service-role key (which bypasses RLS) can read or write it.

-- No policies on public.sponsorship_requests or public.sponsorship_status_history:
-- default-deny for anon/authenticated, including internal_notes and every
-- vetting field. Submissions are written by /api/sponsorship-requests and
-- reviewed/updated by /admin/sponsorships, both using the service-role key
-- server-side after an authenticated-session check — never via client-issued
-- RLS grants. This is also what makes "no automatic acceptance" structural
-- rather than just a UI convention: there is no public write path to
-- public.sponsors other than the admin "Activate Sponsor" action.

-- No policies on public.whoop_tokens: default-deny for anon/authenticated.
-- OAuth tokens never reach the browser or a public query — only
-- server-side code using the service-role key reads/writes this table
-- (the OAuth callback route, the admin connect/disconnect actions, and the
-- training-snapshot fetcher that derives the public-safe display data).

-- No policies on public.email_subscribers: default-deny for anon/authenticated.
-- Signups are written by /api/subscribe using the service-role key
-- server-side, same pattern as inquiries/sponsorship_requests — never a
-- client-issued insert policy.
