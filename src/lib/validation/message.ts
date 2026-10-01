import { z } from "zod";
import { botCheckFields } from "./bot-check";

export const messageSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    anonymous: z.boolean().optional().default(false),
    message: z.string().trim().min(1, "Message is required").max(500),
  })
  .extend(botCheckFields);

export type MessageInput = z.infer<typeof messageSchema>;
