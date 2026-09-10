import { z } from "zod";

export const EVENT_DISCIPLINES = [
  "run",
  "ruck",
  "ride",
  "walk",
  "row",
  "swim",
  "hike",
  "strength",
  "mobility",
  "adaptive",
  "other",
] as const;

/**
 * Free "22 For the 22" registration — submitting this form IS the free
 * giveaway/sweepstakes entry (see waiverAccepted below). Team registration
 * is "light": participationType/teamName/teamCaptain live directly on this
 * one row, no separate team roster. See supabase/schema.sql's
 * public.event_registrations.
 */
export const eventRegistrationSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(100),
    lastName: z.string().trim().min(1, "Last name is required").max(100),
    email: z.string().trim().email("Enter a valid email address").max(320),
    city: z.string().trim().min(1, "City is required").max(200),
    state: z.string().trim().min(1, "State is required").max(200),
    phone: z.string().trim().max(40).optional().or(z.literal("")),

    participationType: z.enum(["solo", "team"]),
    teamName: z.string().trim().max(200).optional().or(z.literal("")),
    teamCaptain: z.boolean().default(false),

    disciplines: z
      .array(z.enum(EVENT_DISCIPLINES))
      .min(1, "Choose at least one discipline"),
    disciplineOtherNote: z.string().trim().max(200).optional().or(z.literal("")),
    participationReason: z.string().trim().max(3000).optional().or(z.literal("")),

    // Single checkbox covers the waiver/terms agreement AND the free
    // giveaway-entry consent — registering for the free event IS the entry.
    waiverAccepted: z.literal(true, { message: "This agreement is required" }),
    emailConsent: z.boolean().default(false),

    // Honeypot: real users never fill this hidden field.
    companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
    // Client-render timestamp (ms epoch); submissions faster than a human
    // can plausibly fill the form are treated as bots.
    renderedAt: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.participationType === "team" && !data.teamName?.trim()) {
      ctx.addIssue({ code: "custom", path: ["teamName"], message: "Team name is required" });
    }
    if (data.disciplines.includes("other") && !data.disciplineOtherNote?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["disciplineOtherNote"],
        message: "Tell us what \"other\" means for you",
      });
    }
  });

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
