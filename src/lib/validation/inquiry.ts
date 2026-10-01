import { z } from "zod";
import { botCheckFields } from "./bot-check";

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

/**
 * /contact's and /get-involved's categories are accepted.
 *
 * Deliberately absent, so a submission using one of them is rejected: the
 * former /join "Join the Movement" athlete categories (Veteran Athlete,
 * First Responder Athlete, Civilian Supporter, Local Chapter/Event Interest)
 * and the former /partners/inquire "Beneficiary Organization" / "Community
 * Collaboration" categories. Both pages redirect to /sponsors — public
 * athlete intake and beneficiary vetting are closed pending written federal
 * ethics approval, and beneficiary intake is a more sensitive vetting
 * workflow than the 2026-09-14 sponsorship approval covers. Existing
 * `inquiries` rows under any retired category are preserved in the database,
 * as are `sponsorship_requests` rows and their admin review queue
 * (/admin/sponsorships).
 */
export const INQUIRY_INTERESTS = [...SPONSOR_INQUIRY_INTERESTS, ...GET_INVOLVED_INTEREST_TYPES] as const;

export const inquirySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    organization: z.string().trim().max(200).optional().or(z.literal("")),
    email: z.string().trim().email("Enter a valid email address").max(320),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    website: z.string().trim().max(300).optional().or(z.literal("")),
    interest: z.enum(INQUIRY_INTERESTS),
    message: z.string().trim().min(1, "Message is required").max(5000),
  })
  .extend(botCheckFields);

export type InquiryInput = z.infer<typeof inquirySchema>;
