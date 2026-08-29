import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  anonymous: z.boolean().optional().default(false),
  message: z.string().trim().min(1, "Message is required").max(500),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
  // Client-render timestamp (ms epoch); submissions faster than a human
  // can plausibly fill the form are treated as bots.
  renderedAt: z.number(),
});

export type MessageInput = z.infer<typeof messageSchema>;
