import { z } from "zod";

export const ACTIVITY_TYPES = [
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

export const DISTANCE_UNITS = ["miles", "kilometers", "yards", "meters"] as const;

/**
 * `durationMinutes`'s minimum is NOT hardcoded to 22 here — it's checked
 * against the specific event's minimum_session_minutes in the API route,
 * since that's event-configurable (see events table). This schema only
 * enforces the universal floor (a positive number).
 */
export const createActivitySchema = z.object({
  eventId: z.string().uuid(),
  activityType: z.enum(ACTIVITY_TYPES),
  durationMinutes: z.number().int().positive().max(1440, "That's more than a full day — double-check the minutes."),
  distance: z.number().positive().optional(),
  distanceUnit: z.enum(DISTANCE_UNITS).optional(),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  startedAt: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
