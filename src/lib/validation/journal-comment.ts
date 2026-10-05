import { z } from "zod";
import { botCheckFields } from "./bot-check";

export const journalCommentSchema = z
  .object({
    journalEntryId: z.string().uuid(),
    name: z.string().trim().min(1, "Name is required").max(100),
    // Collected for moderation/spam-tracing only — never shown publicly.
    email: z.string().trim().email("Enter a valid email address").max(320).optional().or(z.literal("")),
    body: z.string().trim().min(1, "Comment is required").max(1000),
  })
  .extend(botCheckFields);

export type JournalCommentInput = z.infer<typeof journalCommentSchema>;
