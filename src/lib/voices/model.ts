/**
 * Voices For The 22 — talent portal domain vocabulary.
 *
 * Plain data only (no imports) so the same lists back the zod schemas, the
 * admin UI, the Postgres CHECK constraints in supabase/2026-11-19-voices-talent-portal.sql,
 * and the node:test suite in tests/. Change a list here and in that SQL file together.
 *
 * Four statuses are kept deliberately separate — outreach (talent), review
 * (submission), agreement (permission), and visibility (publication) — so an
 * email reply can never be mistaken for a publication approval.
 */

export const TALENT_CATEGORIES = [
  "entertainment",
  "music",
  "athletics",
  "military",
  "first_responder",
  "public_figure",
  "organizational_partner",
  "other",
] as const;
export type TalentCategory = (typeof TALENT_CATEGORIES)[number];

export const TALENT_CATEGORY_LABELS: Record<TalentCategory, string> = {
  entertainment: "Entertainment",
  music: "Music",
  athletics: "Athletics",
  military: "Military",
  first_responder: "First responder",
  public_figure: "Public figure",
  organizational_partner: "Organizational partner",
  other: "Other",
};

export const OUTREACH_STATUSES = [
  "identified",
  "researching_contact",
  "ready_for_outreach",
  "contacted",
  "delivery_failed",
  "awaiting_response",
  "referred",
  "interested",
  "participation_offered",
  "declined",
  "follow_up_later",
  "recording_received",
  "permissions_pending",
  "approved",
  "published",
  "withdrawn",
] as const;
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export const OUTREACH_STATUS_LABELS: Record<OutreachStatus, string> = {
  identified: "Identified",
  researching_contact: "Researching contact",
  ready_for_outreach: "Ready for outreach",
  contacted: "Contacted",
  delivery_failed: "Delivery failed",
  awaiting_response: "Awaiting response",
  referred: "Referred",
  interested: "Interested",
  participation_offered: "Participation offered",
  declined: "Declined",
  follow_up_later: "Follow up later",
  recording_received: "Recording received",
  permissions_pending: "Permissions pending",
  approved: "Approved",
  published: "Published",
  withdrawn: "Withdrawn",
};

/** Columns of the pipeline board, left to right. Every outreach status lands in exactly one. */
export const PIPELINE_STAGES: readonly { label: string; statuses: readonly OutreachStatus[] }[] = [
  { label: "Prospects", statuses: ["identified", "researching_contact", "ready_for_outreach"] },
  { label: "In outreach", statuses: ["contacted", "awaiting_response", "referred", "delivery_failed", "follow_up_later"] },
  { label: "Engaged", statuses: ["interested", "participation_offered"] },
  { label: "Recording & permissions", statuses: ["recording_received", "permissions_pending", "approved"] },
  { label: "Published", statuses: ["published"] },
  { label: "Closed", statuses: ["declined", "withdrawn"] },
];

export const CONTACT_ROLES = ["self", "representative", "manager", "publicist", "agent", "organization", "other"] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export const OUTREACH_CHANNELS = ["email", "phone", "social", "in_person", "referral", "other"] as const;
export type OutreachChannel = (typeof OUTREACH_CHANNELS)[number];

export const OUTREACH_DIRECTIONS = ["outbound", "inbound"] as const;

export const DELIVERY_STATUSES = ["not_applicable", "sent", "delivered", "bounced", "failed", "no_response"] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];
export const FAILED_DELIVERY_STATUSES: readonly DeliveryStatus[] = ["bounced", "failed"];

export const SUBMISSION_STATUSES = [
  "awaiting_upload",
  "received",
  "under_review",
  "needs_changes",
  "approved",
  "rejected",
  "withdrawn",
] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  awaiting_upload: "Upload incomplete",
  received: "Received",
  under_review: "Under review",
  needs_changes: "Needs changes",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const PERMISSION_STATUSES = ["draft", "sent", "signed", "revoked", "expired"] as const;
export type PermissionStatus = (typeof PERMISSION_STATUSES)[number];

/** Where a contribution may appear. "website" is forthe22.org itself. */
export const DISTRIBUTION_CHANNELS = ["website", "organic_social", "approved_mission_channel"] as const;
export type DistributionChannel = (typeof DISTRIBUTION_CHANNELS)[number];

export const DISTRIBUTION_CHANNEL_LABELS: Record<DistributionChannel, string> = {
  website: "Official For The 22 website",
  organic_social: "Organic social media channels operated by For The 22",
  approved_mission_channel: "Other specifically approved mission-related channels",
};

export const PERMITTED_EDITS = ["length", "captions", "accessibility", "audio_normalization", "aspect_ratio", "campaign_branding"] as const;
export type PermittedEdit = (typeof PERMITTED_EDITS)[number];

export const PERMITTED_EDIT_LABELS: Record<PermittedEdit, string> = {
  length: "Length",
  captions: "Captions",
  accessibility: "Accessibility",
  audio_normalization: "Audio normalization",
  aspect_ratio: "Aspect ratio",
  campaign_branding: "Approved campaign branding",
};

export const PUBLICATION_STATUSES = ["draft", "published", "unpublished"] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

/** Submitter's relationship to the person in the video. */
export const SUBMITTER_RELATIONSHIPS = [
  "I am the participant",
  "Talent manager",
  "Publicist",
  "Agent",
  "Assistant or staff",
  "Organization representative",
  "Other authorized representative",
] as const;

/** Turns a snake_case value from the lists above into a display label ("first_responder" → "First responder"). */
export function humanize(value: string): string {
  const spaced = value.replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
