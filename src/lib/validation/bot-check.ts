import { z } from "zod";

/**
 * The three bot-check fields every public form posts. Kept in one place so a
 * new form can't quietly ship without them — the server side of the check
 * lives in src/lib/public-write.ts, which requires all three.
 *
 * Compose into a form schema with `.extend(botCheckFields)`. Apply it to the
 * `z.object(...)` *before* `.superRefine(...)`, since a refined schema is no
 * longer an object and can't be extended.
 */
export const botCheckFields = {
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  // Client-render timestamp (ms epoch); submissions faster than a human
  // can plausibly fill the form are treated as bots.
  renderedAt: z.number(),
  // Optional Turnstile token — only enforced once TURNSTILE_SECRET_KEY is
  // set (see src/lib/turnstile.ts).
  turnstileToken: z.string().max(4096).optional(),
} satisfies z.ZodRawShape;

export type BotCheckInput = z.infer<z.ZodObject<typeof botCheckFields>>;
