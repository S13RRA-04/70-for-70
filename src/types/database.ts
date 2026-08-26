/**
 * Hand-authored row types mirroring supabase/schema.sql.
 * Regenerate with `npx supabase gen types typescript` once a live project exists
 * and swap this file for the generated one if preferred.
 */

export type MileStatus =
  | "available"
  | "requested"
  | "reserved"
  | "partially_funded"
  | "funded";

export type SponsorTier =
  | "presenting"
  | "mission"
  | "supporting"
  | "mile"
  | "community";

export type PostCategory =
  | "Training"
  | "Fundraising"
  | "Mighty Oaks"
  | "Sponsors"
  | "Race Prep"
  | "Milestones";

export type InquiryInterest =
  | "Corporate Sponsor"
  | "Mile Sponsor"
  | "In-Kind Sponsor"
  | "Community Partner"
  | "Media"
  | "Other"
  | "Veteran Athlete"
  | "First Responder Athlete"
  | "Civilian Supporter"
  | "Local Chapter/Event Interest"
  | "Beneficiary Organization"
  | "Mission Partnership"
  | "Sponsorship"
  | "In-Kind Support"
  | "Community Collaboration";

export type InquiryStatus = "new" | "contacted" | "closed";

/** How donations are credited across beneficiary orgs. Null = undecided. */
export type AllocationPolicy =
  | "even_split"
  | "donor_choice"
  | "campaign_defined"
  | "separate_totals";

export type SponsorshipSupportType =
  | "cash"
  | "goods"
  | "services"
  | "travel"
  | "equipment"
  | "race_entry"
  | "other";

export type ProposedSponsorTier = "mile" | "supporting" | "mission" | "presenting" | "unsure";

export type SponsorshipStatus =
  | "submitted"
  | "under_review"
  | "additional_information_requested"
  | "ethics_review"
  | "approved"
  | "declined"
  | "withdrawn"
  | "completed";

export interface CampaignRow {
  id: string;
  name: string;
  fundraising_goal: number;
  amount_raised: number;
  race_distance: number;
  race_date: string | null;
  race_location: string | null;
  allocation_policy: AllocationPolicy | null;
  updated_at: string;
}

export interface MileRow {
  id: string;
  mile_number: number;
  goal_amount: number;
  amount_funded: number;
  status: MileStatus;
  dedication: string | null;
  updated_at: string;
}

export type DedicationType = "in_honor_of" | "in_memory_of";

export interface DonationRow {
  id: string;
  mile_id: string | null;
  donor_name: string;
  /** Optional — sums a donor's cumulative verified giving for tier recognition. See src/lib/donor-tiers.ts. */
  donor_email: string | null;
  amount: number;
  organization_benefited: string | null;
  anonymous: boolean;
  dedication_type: DedicationType | null;
  dedication_name: string | null;
  dedication_message: string | null;
  /** Optional branch of service for the honoree, e.g. "U.S. Army". */
  dedication_branch: string | null;
  dedication_public: boolean;
  date: string;
  external_reference: string | null;
  verified: boolean;
  created_at: string;
}

/**
 * DonationRow minus donor_email — the shape actually returned by every
 * public/anon-key donation query (src/lib/data/donations.ts,
 * src/lib/data/miles.ts), which explicitly excludes donor_email so it's
 * never fetched into a public page's data, let alone rendered. See
 * src/lib/data/donation-columns.ts.
 */
export type PublicDonationRow = Omit<DonationRow, "donor_email">;

/** Joined shape returned by getRecentDonations() — see src/lib/data/donations.ts. */
export interface DonationWithMile extends PublicDonationRow {
  mile_number: number | null;
}

export interface SponsorRow {
  id: string;
  name: string;
  tier: SponsorTier;
  contribution_value: number | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  active: boolean;
  display_order: number;
  sponsorship_request_id: string | null;
  /**
   * Internal relationship record-keeping — never rendered on the public
   * site. Free text, not a union, since real-world status ("verbal", "MOU
   * signed", "expired") varies too informally for a fixed set of values.
   * Filled in by hand via the Supabase table editor as relationships are
   * confirmed — never fabricate a value here.
   */
  agreement_status: string | null;
  logo_permission: boolean;
  relationship_start: string | null;
  relationship_end: string | null;
  associated_campaigns: string[] | null;
  /**
   * Only a sponsor with `ethics_cleared: true` may be publicly displayed —
   * see getSponsors() in src/lib/data/sponsors.ts. Distinct from `active`,
   * which is just a visibility toggle; this is the compliance gate.
   */
  ethics_cleared: boolean;
  ethics_cleared_date: string | null;
  /** Required, exact disclosure text shown beside/below the logo once cleared. */
  disclosure_text: string | null;
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  image_url: string | null;
  category: PostCategory;
  published_at: string | null;
  featured: boolean;
  published: boolean;
  training_metrics: Record<string, string | number> | null;
}

/**
 * The campaign Journal — supersedes PostRow/public.posts above (left in
 * place but unused; see supabase/schema.sql). Mirrors public.journal_entries.
 */
export type JournalPostType = "article" | "vlog" | "photo" | "milestone";

export type JournalPrimaryCategory = PostCategory;

export type JournalStatus = "draft" | "scheduled" | "published";

export type JournalTrainingDiscipline =
  | "swim"
  | "bike"
  | "run"
  | "brick"
  | "strength"
  | "rest";

export type VideoProvider = "youtube" | "vimeo";

export type MilestoneKind = "fundraising" | "training";

export interface JournalGalleryImage {
  url: string;
  alt: string;
}

export interface JournalEntryRow {
  id: string;
  post_type: JournalPostType;
  primary_category: JournalPrimaryCategory;
  tags: string[];
  title: string;
  slug: string;
  summary: string;
  /** Markdown source — see components/journal/journal-markdown.tsx. */
  body: string;
  status: JournalStatus;
  /** Set once, the first time status becomes "published". Never overwritten by later edits. */
  published_at: string | null;
  scheduled_for: string | null;
  featured: boolean;
  image_url: string | null;
  /** Null/omitted when there are no gallery images — never an empty array. */
  gallery: JournalGalleryImage[] | null;
  video_url: string | null;
  video_provider: VideoProvider | null;
  training_discipline: JournalTrainingDiscipline | null;
  training_distance: number | null;
  training_duration_minutes: number | null;
  training_pace: string | null;
  training_elevation_ft: number | null;
  training_swim_pace: string | null;
  training_bike_power_watts: number | null;
  training_avg_hr: number | null;
  training_rpe: number | null;
  training_phase: string | null;
  milestone_kind: MilestoneKind | null;
  milestone_value: string | null;
  /** Configurable per-post disclosure. Null = no disclosure shown. */
  sponsor_disclosure: string | null;
  created_at: string;
  updated_at: string;
}

/** Joined shape returned by getJournalEntryBySlug() — mentions resolved to full PartnerRows, not raw join rows. */
export interface JournalEntryWithMentions extends JournalEntryRow {
  partnerMentions: PartnerRow[];
  beneficiaryMentions: PartnerRow[];
}

/** Which container a logo renders in — see PartnerLogo. 'dark' pairs with logo_light_url. */
export type LogoBackground = "light" | "dark";

export interface PartnerRow {
  id: string;
  name: string;
  /** "Why It Matters to Me" — always real, never a placeholder. */
  description: string;
  /** "What They Do" — the org's own approved description. Hidden until set. */
  what_they_do: string | null;
  logo_url: string | null;
  /** Variant for a light-background card — falls back to logo_url. */
  logo_light_url: string | null;
  /** Variant for a dark-background card — falls back to logo_url. */
  logo_dark_url: string | null;
  logo_background: LogoBackground | null;
  website_url: string | null;
  donation_url: string | null;
  /**
   * True when this partner's donation platform has no way to attribute a
   * gift to this campaign on its own (e.g. a generic PayPal button) — the
   * donor must add the campaign code by hand. See DonationTrackingNote.
   */
  requires_donation_note: boolean;
  /** Trust signals — only set once independently verified; hidden until then. */
  ein: string | null;
  nonprofit_status_verified: boolean;
  active: boolean;
  /** Internal relationship record-keeping — see the matching fields on SponsorRow for the rationale. */
  agreement_status: string | null;
  logo_permission: boolean;
  relationship_start: string | null;
  relationship_end: string | null;
  associated_campaigns: string[] | null;
}

/**
 * A Mission Partner — an organization that formally collaborates with For
 * The 22 through programming, referrals, resources, outreach, athlete
 * support, or mission amplification. Distinct from a PartnerRow
 * (beneficiary): no donation/EIN/nonprofit-verification fields, since a
 * mission partner isn't necessarily a charitable fundraising recipient.
 */
export type TrainingDiscipline = "swim" | "bike" | "run";

/**
 * The full benchmark-ladder categories on /the-race — broader than
 * TrainingDiscipline (swim/bike/run), which is reserved for classifying an
 * individual workout (see classifyTrainingDiscipline, MediaPlaceholder).
 */
export type TrainingObjectiveCategory =
  | "swim"
  | "bike"
  | "run"
  | "brick"
  | "vo2max"
  | "strength"
  | "race_readiness";

/**
 * 'in_progress' is a real third state — a rung can be actively being
 * worked, not just done/not-done. 'goal' marks the single terminal
 * race-day entry (under race_readiness), rendered distinctly from an
 * ordinary checklist item.
 */
export type TrainingObjectiveStatus = "not_started" | "in_progress" | "done" | "goal";

export interface TrainingObjectiveRow {
  id: string;
  category: TrainingObjectiveCategory;
  label: string;
  display_order: number;
  status: TrainingObjectiveStatus;
  /** Optional badge — "Race distance", "Stretch", "Current baseline", "Podium-track", etc. */
  tag: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface MissionPartnerRow {
  id: string;
  name: string;
  /** e.g. "Adaptive Sports Partner", "Veteran Resource Partner". */
  relationship_label: string;
  description: string;
  logo_url: string | null;
  /** Variant for a light-background card — falls back to logo_url. */
  logo_light_url: string | null;
  /** Variant for a dark-background card — falls back to logo_url. */
  logo_dark_url: string | null;
  logo_background: LogoBackground | null;
  website_url: string | null;
  /** e.g. "Adaptive Athletics", "Athlete Referrals". */
  support_type: string | null;
  geographic_scope: string | null;
  active: boolean;
  display_order: number;
  /** Internal relationship record-keeping — see the matching fields on SponsorRow for the rationale. */
  agreement_status: string | null;
  logo_permission: boolean;
  relationship_start: string | null;
  relationship_end: string | null;
  associated_campaigns: string[] | null;
}

export interface EmailSubscriberRow {
  id: string;
  first_name: string;
  email: string;
  synced_to_provider: boolean;
  created_at: string;
}

export interface InquiryRow {
  id: string;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  interest: InquiryInterest;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface InquiryInsert {
  name: string;
  organization?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  interest: InquiryInterest;
  message: string;
}

export interface SponsorshipRequestRow {
  id: string;

  contact_name: string;
  organization_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  industry: string | null;

  proposed_tier: ProposedSponsorTier | null;
  cash_value: number | null;
  in_kind_value: number | null;
  support_type: SponsorshipSupportType[];
  description: string;
  requested_benefits: string | null;
  requested_mile_number: number | null;
  referral_source: string | null;
  message: string | null;

  acknowledged_pending_review: boolean;
  status: SponsorshipStatus;

  internal_notes: string | null;
  organization_researched: boolean;
  website_reviewed: boolean;
  ownership_reviewed: boolean;
  relationship_to_campaign_owner: string | null;
  known_government_relationship: boolean;
  known_doj_fbi_relationship: boolean;
  government_contractor_status: boolean;
  prohibited_source_concern: boolean;
  official_position_concern: boolean;
  ethics_consultation_required: boolean;
  ethics_approval_received: boolean;
  ethics_reference: string | null;
  final_disposition: string | null;

  submitted_at: string;
  reviewed_at: string | null;
  approved_at: string | null;
  declined_at: string | null;
}

export interface SponsorshipStatusHistoryRow {
  id: string;
  request_id: string;
  previous_status: SponsorshipStatus | null;
  new_status: SponsorshipStatus;
  administrator: string | null;
  note: string | null;
  created_at: string;
}
