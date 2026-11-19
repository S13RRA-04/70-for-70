import type {
  ContactRole,
  DeliveryStatus,
  OutreachChannel,
  OutreachStatus,
  PermissionStatus,
  PublicationStatus,
  SubmissionStatus,
  TalentCategory,
} from "@/lib/voices/model";

/** Row shapes for supabase/2026-11-19-voices-talent-portal.sql. */

interface Timestamps {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface VoicesTalentRow extends Timestamps {
  name: string;
  category: TalentCategory;
  professional_title: string | null;
  public_attribution: string | null;
  outreach_status: OutreachStatus;
  contact_source: string | null;
  source_verified_on: string | null;
  outreach_on: string | null;
  last_contact_on: string | null;
  follow_up_on: string | null;
  response_summary: string | null;
  internal_notes: string | null;
}

export interface VoicesTalentContactRow extends Timestamps {
  talent_id: string;
  contact_name: string;
  role: ContactRole;
  organization: string | null;
  email: string | null;
  other_method: string | null;
  source: string | null;
  verified_on: string | null;
  is_primary: boolean;
}

export interface VoicesOutreachActivityRow extends Timestamps {
  talent_id: string;
  contact_id: string | null;
  occurred_on: string;
  channel: OutreachChannel;
  direction: "outbound" | "inbound";
  delivery_status: DeliveryStatus;
  summary: string;
  response: string | null;
  follow_up_on: string | null;
  created_by: string | null;
}

export interface VoicesSubmissionRow extends Timestamps {
  reference_code: string;
  source: "portal" | "admin";
  talent_id: string | null;
  review_status: SubmissionStatus;
  participant_name: string;
  submitter_name: string;
  submitter_email: string;
  relationship: string;
  professional_title: string | null;
  representative_agency: string | null;
  preferred_attribution: string | null;
  social_handles: string | null;
  website: string | null;
  suggested_publication_date: string | null;
  embargo_until: string | null;
  usage_restrictions: string | null;
  additional_instructions: string | null;
  video_link: string | null;
  video_path: string | null;
  video_original_name: string | null;
  video_size_bytes: number | null;
  headshot_path: string | null;
  release_path: string | null;
  file_check: Record<string, { ok: boolean; detected?: string | null; checkedAt?: string; error?: string }>;
  authorized_confirmed: boolean;
  terms_acknowledged: boolean;
  finalize_token_hash: string | null;
  finalize_expires_at: string | null;
  submitted_at: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  files_deleted_at: string | null;
}

export interface VoicesPermissionRow extends Timestamps {
  talent_id: string;
  submission_id: string | null;
  release_version: string;
  status: PermissionStatus;
  signatory_name: string | null;
  signatory_capacity: "participant" | "authorized_representative" | null;
  representative_authority: string | null;
  permitted_channels: string[];
  approved_mission_channels: string | null;
  permitted_edits: string[];
  approved_attribution: string | null;
  restrictions: string | null;
  requires_participant_approval: boolean;
  usage_starts_on: string | null;
  usage_ends_on: string | null;
  signed_on: string | null;
  signed_document_path: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
}

export interface VoicesPublicationRow extends Timestamps {
  talent_id: string;
  submission_id: string | null;
  permission_id: string | null;
  slug: string;
  display_name: string;
  attribution: string | null;
  category: string;
  summary: string | null;
  transcript: string | null;
  video_url: string | null;
  video_type: string;
  poster_url: string | null;
  captions_url: string | null;
  external_url: string | null;
  channels: string[];
  status: PublicationStatus;
  publish_at: string | null;
  is_featured: boolean;
  display_order: number;
  participant_approved_at: string | null;
  published_by: string | null;
  unpublished_at: string | null;
  unpublish_reason: string | null;
}

export interface VoicesAuditEventRow {
  id: string;
  created_at: string;
  actor_email: string | null;
  entity_type: "talent" | "contact" | "outreach" | "submission" | "permission" | "publication";
  entity_id: string | null;
  talent_id: string | null;
  action: string;
  details: Record<string, unknown>;
}

/** The anon-readable subset of voices_publications (see the column grant in the migration). */
export const PUBLIC_PUBLICATION_COLUMNS =
  "id, slug, display_name, attribution, category, summary, transcript, video_url, video_type, poster_url, captions_url, external_url, publish_at, is_featured, display_order";

export type PublicVoicesPublication = Pick<
  VoicesPublicationRow,
  | "id"
  | "slug"
  | "display_name"
  | "attribution"
  | "category"
  | "summary"
  | "transcript"
  | "video_url"
  | "video_type"
  | "poster_url"
  | "captions_url"
  | "external_url"
  | "publish_at"
  | "is_featured"
  | "display_order"
>;
