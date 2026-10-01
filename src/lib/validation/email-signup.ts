import { z } from "zod";

export const emailSignupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(320),
  // Honeypot + timing bot mitigation, same pattern as the other forms.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  renderedAt: z.number(),
  // Optional Turnstile token — only enforced once TURNSTILE_SECRET_KEY is set
  // (see src/lib/turnstile.ts).
  turnstileToken: z.string().max(4096).optional(),
});
