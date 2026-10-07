import { z } from "zod";
import { botCheckFields } from "./bot-check";

export const resourceNavigationSchema = z.object({
  seekingFor: z.string().trim().min(1).max(100),
  population: z.string().trim().min(1).max(100),
  state: z.string().trim().max(2).optional().or(z.literal("")),
  need: z.string().trim().min(1).max(2000),
  priorities: z.string().trim().max(1000).optional().or(z.literal("")),
  privacyConcerns: z.string().trim().max(1000).optional().or(z.literal("")),
  avoid: z.string().trim().max(1000).optional().or(z.literal("")),
  email: z.string().trim().email().max(320),
}).extend(botCheckFields);

export const resourceFeedbackSchema = z.object({
  resourceName: z.string().trim().min(1).max(300),
  helpful: z.enum(["yes", "no"]),
  contacted: z.enum(["yes", "not-yet", "prefer-not-to-say"]),
  connection: z.enum(["yes", "no", "waiting", "prefer-not-to-say", "not-applicable"]),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
}).extend(botCheckFields);
