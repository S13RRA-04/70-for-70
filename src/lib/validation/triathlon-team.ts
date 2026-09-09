import { z } from "zod";

export const TRIATHLON_EXPERIENCE_LEVELS = [
  "First-time triathlete",
  "Sprint",
  "Olympic",
  "70.3",
  "Full IRONMAN",
  "Multiple distances",
] as const;

/** Preset options shown on the form — "Other" lets an applicant enter a free-text figure, still stored as text (not parsed to a number) since this is a stated goal, not a payment amount. */
export const FUNDRAISING_GOAL_PRESETS = ["$500", "$1,000", "$2,500", "$5,000+"] as const;

export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

/**
 * Public Triathlon Team application — see /get-involved/triathlon-team and
 * supabase/schema.sql's public.triathlon_team_applications. Conditional
 * requirements (race details when registered, at least one acknowledgment
 * check) are enforced with superRefine below rather than split into
 * separate schemas, so one parse call produces every field error at once.
 */
export const triathlonTeamApplicationSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required").max(200),
    email: z.string().trim().email("Enter a valid email address").max(320),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(40),
    city: z.string().trim().min(1, "City is required").max(200),
    state: z.string().trim().min(1, "State is required").max(200),

    experienceLevel: z.enum(TRIATHLON_EXPERIENCE_LEVELS),
    yearsInTriathlon: z.string().trim().min(1, "This field is required").max(200),
    preferredDistance: z.string().trim().min(1, "This field is required").max(200),

    registeredForRace: z.enum(["yes", "no"]),
    raceName: z.string().trim().max(200).optional().or(z.literal("")),
    raceDate: z.string().trim().max(40).optional().or(z.literal("")),
    raceDistance: z.string().trim().max(200).optional().or(z.literal("")),
    raceLocation: z.string().trim().max(200).optional().or(z.literal("")),
    needsRaceHelp: z.enum(["yes", "no"]).optional().or(z.literal("")),

    missionReason: z.string().trim().min(1, "Tell us why you want to race for the mission").max(5000),

    fundraisingExperience: z.enum(["yes", "no"]),
    fundraisingGoal: z.string().trim().min(1, "Select or enter a fundraising goal").max(100),

    instagram: z.string().trim().max(300).optional().or(z.literal("")),
    facebook: z.string().trim().max(300).optional().or(z.literal("")),
    strava: z.string().trim().max(300).optional().or(z.literal("")),
    otherSocial: z.string().trim().max(300).optional().or(z.literal("")),

    apparelSize: z.enum(APPAREL_SIZES),

    ackCosts: z.literal(true, { message: "This acknowledgment is required" }),
    ackSafety: z.literal(true, { message: "This acknowledgment is required" }),
    ackConduct: z.literal(true, { message: "This acknowledgment is required" }),

    // Honeypot: real users never fill this hidden field.
    companyWebsite: z.string().max(0, "").optional().or(z.literal("")),
    // Client-render timestamp (ms epoch); submissions faster than a human
    // can plausibly fill the form are treated as bots.
    renderedAt: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.registeredForRace === "yes" && !data.raceName?.trim()) {
      ctx.addIssue({ code: "custom", path: ["raceName"], message: "Race name is required" });
    }
    if (data.registeredForRace === "yes" && !data.raceDate?.trim()) {
      ctx.addIssue({ code: "custom", path: ["raceDate"], message: "Race date is required" });
    }
    if (data.registeredForRace === "yes" && !data.raceDistance?.trim()) {
      ctx.addIssue({ code: "custom", path: ["raceDistance"], message: "Race distance is required" });
    }
    if (data.registeredForRace === "yes" && !data.raceLocation?.trim()) {
      ctx.addIssue({ code: "custom", path: ["raceLocation"], message: "Race location is required" });
    }
    if (data.registeredForRace === "no" && !data.needsRaceHelp) {
      ctx.addIssue({ code: "custom", path: ["needsRaceHelp"], message: "Please select an option" });
    }
  });

export type TriathlonTeamApplicationInput = z.infer<typeof triathlonTeamApplicationSchema>;
