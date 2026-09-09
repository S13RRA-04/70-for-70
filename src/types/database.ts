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
  | "Campaign"
  | "Mighty Oaks"
  | "Support"
  | "Race Prep"
  | "Milestones"
  | "22 For the 22";

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
  /**
   * Optional Historical | Current | Next | Goal display for a rung that
   * tracks a single number over time (FTP, race split) rather than a
   * one-time completion. All four are free text ("TBD" is a valid value)
   * so units/qualifiers stay with the number; metric_historical is the
   * only one of the four that's a real recorded result rather than a
   * target, so it's the one most often null (most rungs have no relevant
   * outside benchmark). When every field is null the row renders as a
   * plain checklist item, unchanged from before these columns existed.
   */
  metric_historical: string | null;
  metric_current: string | null;
  metric_next: string | null;
  metric_goal: string | null;
  completed_at: string | null;
  created_at: string;
}

/**
 * "swim"/"bike"/"run"/"ride"/"aerobic" are directly measured (a test, a
 * device reading); "trainingpeaks" is platform-calculated from accumulated
 * training load (Fitness/Fatigue/Form/ramp), not a raw measurement — kept
 * as its own category so the UI can visually separate the two rather than
 * implying a TSS-model score carries the same certainty as a stopwatch. A
 * row *within* a measured category can still be a platform estimate (e.g.
 * a Strava-predicted 5K, not an actual timed test) — that's what
 * PerformanceSnapshotRow.is_measured is for at the row level; category is
 * the coarser, section-level split.
 */
export type PerformanceMetricCategory = "swim" | "bike" | "run" | "ride" | "aerobic" | "trainingpeaks";

/**
 * One metric, on one date — e.g. ("2026-09-08", "bike_ftp_watts", "143 W").
 * Normalized this way (one row per metric per date) rather than one wide
 * row per date so a future update only inserts new rows for the metrics
 * that actually changed, existing history for every metric_key is
 * preserved automatically, and a trend chart for a single metric (swim
 * pace, FTP, VO2 max, TrainingPeaks Fitness) is just "every row with this
 * metric_key, ordered by recorded_on" — no schema change needed to add one.
 */
export interface PerformanceSnapshotRow {
  id: string;
  recorded_on: string;
  category: PerformanceMetricCategory;
  /** Stable machine key for grouping one metric's history over time, e.g. "bike_ftp_watts" — never change once a metric_key has history, or the trend breaks at that point. */
  metric_key: string;
  label: string;
  /** Free-text display value ("1:58/100 yd", "143 W") — units live in the string, same convention as TrainingObjectiveRow's metric_* fields. */
  value_display: string;
  /** Parsed numeric form for future charting, in `unit`. Null when value_display isn't a single chartable number (e.g. a HH:MM range). */
  value_numeric: number | null;
  unit: string | null;
  /** False for trainingpeaks category rows, and for any other row that's a platform estimate rather than a direct measurement (e.g. a Strava-predicted 5K) — see PerformanceMetricCategory. */
  is_measured: boolean;
  display_order: number;
  created_at: string;
}

/**
 * Stable machine key for section/badge logic — relationship_label stays
 * the free-text display string. See mission_partners.partner_type's
 * comment in schema.sql for why the two are kept separate.
 */
export type PartnerType =
  | "campaign-sponsor"
  | "gear-partner"
  | "service-partner"
  | "print-partner"
  | "accommodations-partner"
  | "training-partner"
  | "giveaway-supporter";

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
  /** Null on older rows predating this column — treat as "uncategorized," never guess a type from relationship_label. */
  partner_type: PartnerType | null;
}

/** Computed pre/live/complete status — see computeEventStatus() in src/lib/22-for-the-22/event-status.ts. Distinct from EventConfigRow.status_override, the nullable admin escape hatch that feeds it. */
export type EventLiveStatus = "pre" | "live" | "complete";

/**
 * One annual instance of a recurring endurance-challenge event (see
 * public.event_config in schema.sql). A future year is a new row, not an
 * edit to this one — see getCurrentEventConfig() in
 * src/lib/data/event-config.ts.
 */
export interface EventConfigRow {
  id: string;
  event_slug: string;
  series_slug: string;
  event_year: number;
  event_name: string;
  tagline: string;
  starts_at: string;
  ends_at: string;
  status_override: EventLiveStatus | null;
  registration_open: boolean;
  fundraising_goal: number;
  /** Hand-updated by an admin — no per-event donation tagging exists yet. See EventConfigRow's comment in schema.sql. */
  amount_raised: number;
  merch_url: string | null;
  donate_url: string | null;
  /** Markdown. When set, overrides the hardcoded placeholder scaffold on /22forthe22/rules. */
  official_rules_body: string | null;
  winner_announcement: string | null;
  updated_at: string;
  created_at: string;
}

export type EventRegistrationStatus = "confirmed" | "cancelled";
export type EventParticipationType = "solo" | "team";
export type EventDiscipline = "run" | "ruck" | "ride" | "walk" | "row" | "swim" | "hike" | "other";

/**
 * A free registration for an EventConfigRow instance — submitting this IS
 * the free giveaway/sweepstakes entry (see waiver_accepted). Never publicly
 * readable — service-role only, same trust model as
 * TriathlonTeamApplicationRow.
 */
export interface EventRegistrationRow {
  id: string;
  created_at: string;
  event_id: string;
  status: EventRegistrationStatus;

  first_name: string;
  last_name: string;
  email: string;
  city: string;
  state: string;
  phone: string | null;

  participation_type: EventParticipationType;
  team_name: string | null;
  team_captain: boolean;

  disciplines: EventDiscipline[];
  discipline_other_note: string | null;
  participation_reason: string | null;

  waiver_accepted: boolean;
  email_consent: boolean;
  /** Admin-only exclusion flag for a flagged (bot/duplicate/fraud) entry. Never surfaced to the public or the registrant. */
  giveaway_eligible: boolean;

  admin_notes: string | null;
}

/** The admin-editable "Current Movement" log entry ("Hour 1: Run") — see public.event_activity_log in schema.sql. */
export interface EventActivityLogRow {
  id: string;
  event_id: string;
  created_at: string;
  logged_at: string;
  hour_label: string;
  activity_label: string;
  note: string | null;
  display_order: number;
}

export type GiveawayPrizeStatus = "confirmed" | "received";

/**
 * One prize-package item for the 22 For the 22 giveaway/sweepstakes (see
 * public.giveaway_prizes in schema.sql) — this campaign cannot legally run
 * a raffle, so every donated prize lives here and is entered by free
 * 22-for-the-22 event registration, never by a separate paid/ticketed
 * mechanic. `partner_id` links back to the donor's MissionPartnerRow
 * (partner_type "giveaway-supporter") when a full profile exists.
 */
export interface GiveawayPrizeRow {
  id: string;
  event_id: string;
  created_at: string;
  display_order: number;
  partner_id: string | null;
  brand: string;
  prize_name: string;
  quantity: number;
  winner_count: number;
  retail_value_min: number | null;
  retail_value_max: number | null;
  image_url: string | null;
  status: GiveawayPrizeStatus;
  website_url: string | null;
  donor_note: string | null;
  featured: boolean;
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

/** A public "cheer board" message — see supabase/schema.sql's public.messages. */
export interface MessageRow {
  id: string;
  name: string;
  /** Hides `name` on the public board while keeping it recorded for moderation. */
  anonymous: boolean;
  message: string;
  approved: boolean;
  submitted_at: string;
  approved_at: string | null;
}

export interface MessageInsert {
  name: string;
  anonymous?: boolean;
  message: string;
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

export type TriathlonExperienceLevel =
  | "First-time triathlete"
  | "Sprint"
  | "Olympic"
  | "70.3"
  | "Full IRONMAN"
  | "Multiple distances";

export type TriathlonApplicationStatus = "new" | "reviewing" | "approved" | "declined" | "waitlisted";

/**
 * A public application to join the Triathlon Team (see supabase/schema.sql's
 * public.triathlon_team_applications and /get-involved/triathlon-team).
 * Never publicly readable — service-role only, same trust model as
 * sponsorship_requests and inquiries. `status`/`admin_notes` are internal
 * review fields, never rendered on any public page.
 */
export interface TriathlonTeamApplicationRow {
  id: string;
  created_at: string;
  status: TriathlonApplicationStatus;

  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;

  experience_level: TriathlonExperienceLevel;
  years_in_triathlon: string;
  preferred_distance: string;

  registered_for_race: boolean;
  race_name: string | null;
  race_date: string | null;
  race_distance: string | null;
  race_location: string | null;
  needs_race_help: boolean | null;

  mission_reason: string;

  fundraising_experience: boolean;
  fundraising_goal: string;

  instagram: string | null;
  facebook: string | null;
  strava: string | null;
  other_social: string | null;

  apparel_size: string;

  ack_costs: boolean;
  ack_safety: boolean;
  ack_conduct: boolean;

  admin_notes: string | null;
}
