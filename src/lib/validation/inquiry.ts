import { z } from "zod";

/** /contact's general-inquiry categories — the only route still accepting public inquiry submissions. */
export const SPONSOR_INQUIRY_INTERESTS = ["Media", "General Question", "Other"] as const;

/**
 * "Join the Movement" athlete interest (/join) and partner inquiries
 * (/partners/inquire) categories — kept exported only so their now-orphaned
 * form components (unreachable: both pages redirect before rendering)
 * still typecheck. Deliberately excluded from INQUIRY_INTERESTS below, so
 * a submission using one of these categories is rejected by validation —
 * both routes are retired, public athlete/sponsor/partner intake is closed
 * pending written federal ethics approval. Existing `inquiries` rows under
 * these categories are preserved in the database.
 */
export const JOIN_INTEREST_TYPES = [
  "Veteran Athlete",
  "First Responder Athlete",
  "Civilian Supporter",
  "Local Chapter/Event Interest",
] as const;

export const PARTNER_INQUIRY_INTERESTS = [
  "Beneficiary Organization",
  "Mission Partnership",
  "Sponsorship",
  "In-Kind Support",
  "Community Collaboration",
] as const;

/** Only /contact's categories are accepted — see the comment above. */
export const INQUIRY_INTERESTS = [...SPONSOR_INQUIRY_INTERESTS] as const;

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
