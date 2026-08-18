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
  | "Project Echelon"
  | "Sponsors"
  | "Race Prep"
  | "Milestones";

export type InquiryInterest =
  | "Corporate Sponsor"
  | "Mile Sponsor"
  | "In-Kind Sponsor"
  | "Community Partner"
  | "Media"
  | "Other";

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
  amount: number;
  organization_benefited: string | null;
  anonymous: boolean;
  dedication_type: DedicationType | null;
  dedication_name: string | null;
  dedication_message: string | null;
  dedication_public: boolean;
  date: string;
  external_reference: string | null;
  verified: boolean;
  created_at: string;
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

export interface PartnerRow {
  id: string;
  name: string;
  /** "Why It Matters to Me" — always real, never a placeholder. */
  description: string;
  /** "What They Do" — the org's own approved description. Hidden until set. */
  what_they_do: string | null;
  logo_url: string | null;
  website_url: string | null;
  donation_url: string | null;
  /** Trust signals — only set once independently verified; hidden until then. */
  ein: string | null;
  nonprofit_status_verified: boolean;
  active: boolean;
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
