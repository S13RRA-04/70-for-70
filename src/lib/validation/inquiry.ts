import { z } from "zod";

export const INQUIRY_INTERESTS = [
  "Corporate Sponsor",
  "Mile Sponsor",
  "In-Kind Sponsor",
  "Community Partner",
  "Media",
  "Other",
] as const;

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
