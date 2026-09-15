import { z } from "zod";

/**
 * /contact's general-inquiry categories, rendered directly in
 * SponsorInquiryForm's "Topic" dropdown. "Mission Partnership",
 * "Sponsorship", and "In-Kind Support" have written federal ethics
 * approval for public campaign-sponsorship/partnership intake (confirmed
 * 2026-09-14 — see the "Become a Tri For the 22 Partner" section on
 * src/app/sponsors/page.tsx), matching 3 of the 5 values also listed in
 * PARTNER_INQUIRY_INTERESTS below.
 */
export const SPONSOR_INQUIRY_INTERESTS = [
  "Media",
  "General Question",
  "Mission Partnership",
  "Sponsorship",
  "In-Kind Support",
  "Other",
] as const;

/**
 * "Join the Movement" athlete interest (/join) categories — kept exported
 * only so its now-orphaned form component (unreachable: the page redirects
 * before rendering) still typechecks. Deliberately excluded from
 * INQUIRY_INTERESTS below, so a submission using one of these categories is
 * rejected by validation — /join is retired, public athlete intake is
 * closed pending written federal ethics approval. Existing `inquiries` rows
 * under these categories are preserved in the database.
 */
export const JOIN_INTEREST_TYPES = [
  "Veteran Athlete",
  "First Responder Athlete",
  "Civilian Supporter",
  "Local Chapter/Event Interest",
] as const;

/**
 * The former /partners/inquire form's full category list — kept exported
 * only so that now-orphaned form component (unreachable: the page
 * redirects before rendering) still typechecks. "Beneficiary Organization"
 * and "Community Collaboration" remain excluded from INQUIRY_INTERESTS
 * below — beneficiary intake is a separate, more sensitive vetting
 * workflow not covered by the 2026-09-14 sponsorship-approval, so
 * /partners/inquire stays retired. The other 3 values are superseded by
 * SPONSOR_INQUIRY_INTERESTS above, which is what /contact's live form
 * actually renders. Existing `inquiries` rows under any of these
 * categories are preserved in the database.
 */
export const PARTNER_INQUIRY_INTERESTS = [
  "Beneficiary Organization",
  "Mission Partnership",
  "Sponsorship",
  "In-Kind Support",
  "Community Collaboration",
] as const;

/**
 * /get-involved's volunteer categories — this recruitment has written
 * federal ethics approval, so it's included in INQUIRY_INTERESTS below and
 * the page is live, not redirected.
 */
export const GET_INVOLVED_INTEREST_TYPES = [
  "Race Crew",
  "Campaign Tent",
  "Cheer Squad",
  "Social Media Team",
  "Invite For The 22",
] as const;

/** /contact's and /get-involved's categories are accepted — see the comments above. */
export const INQUIRY_INTERESTS = [...SPONSOR_INQUIRY_INTERESTS, ...GET_INVOLVED_INTEREST_TYPES] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  interest: z.enum(INQUIRY_INTERESTS),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  // Client-render timestamp (ms epoch); submissions faster than a human
  // can plausibly fill the form are treated as bots.
  renderedAt: z.number(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
