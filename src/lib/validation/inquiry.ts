import { z } from "zod";

export const SPONSOR_INQUIRY_INTERESTS = [
  "Corporate Sponsor",
  "Mile Sponsor",
  "In-Kind Sponsor",
  "Community Partner",
  "Media",
  "Other",
] as const;

/** "Join the Movement" interest categories — see /join. */
export const JOIN_INTEREST_TYPES = [
  "Veteran Athlete",
  "First Responder Athlete",
  "Civilian Supporter",
  "Local Chapter/Event Interest",
] as const;

/**
 * Both sponsorship inquiries (/contact, /sponsors/request) and "Join the
 * Movement" interest (/join) submit through the same `inquiries` table for
 * now — there's no dedicated review workflow for Join submissions yet, and
 * this reuses the existing rate limiting/honeypot/admin-visible pipeline
 * instead of standing up a second one for "just collect interest."
 */
export const INQUIRY_INTERESTS = [...SPONSOR_INQUIRY_INTERESTS, ...JOIN_INTEREST_TYPES] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.enum(INQUIRY_INTERESTS),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  // Client-render timestamp (ms epoch); submissions faster than a human
  // can plausibly fill the form are treated as bots.
  renderedAt: z.number(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
