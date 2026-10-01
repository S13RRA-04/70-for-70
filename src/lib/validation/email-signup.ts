import { z } from "zod";
import { botCheckFields } from "./bot-check";

export const emailSignupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    email: z.string().trim().email("Enter a valid email address").max(320),
  })
  .extend(botCheckFields);

export type EmailSignupInput = z.infer<typeof emailSignupSchema>;
