/**
 * Row types for the "For the 22" participant-app tables — see
 * supabase/schema.sql's "For the 22 app" section. Kept separate from
 * src/types/database.ts (the marketing-site schema) since these are a
 * genuinely different product surface with a different trust model (real
 * per-user RLS, not public-read/service-role-write).
 */

export type ProfileVisibility = "private" | "participants_only" | "public";

export interface ProfileRow {
  id: string;
  first_name: string;
  last_name: string;
  city: string | null;
  state: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  visibility: ProfileVisibility;
  created_at: string;
  updated_at: string;
}

export type AppEventStatus = "draft" | "open" | "active" | "complete" | "archived";

/**
 * 'session_count' is the only type implemented in MVP (22 For the 22) — the
 * rest are reserved for future challenge types. Never assume this union
 * only ever has one meaningful value.
 */
export type AppEventType =
  | "session_count"
  | "distance"
  | "duration"
  | "fundraising"
  | "multi_day"
  | "team"
  | "race"
  | "recurring";

export interface AppEventRow {
  id: string;
  slug: string;
  series_slug: string | null;
  event_year: number | null;
  name: string;
  short_name: string | null;
  description: string | null;
  hero_image: string | null;
  start_at: string;
  end_at: string;
  registration_open_at: string | null;
  registration_close_at: string | null;
  status: AppEventStatus;
  event_type: AppEventType;
  required_sessions: number | null;
  minimum_session_minutes: number | null;
  minimum_total_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export type RegistrationType = "solo" | "team";

export interface AppRegistrationRow {
  id: string;
  event_id: string;
  user_id: string;
  registration_type: RegistrationType;
  team_name: string | null;
  waiver_version: string | null;
  waiver_accepted_at: string | null;
  linked_event_registration_id: string | null;
  created_at: string;
}

export type ActivityType =
  | "run"
  | "ruck"
  | "ride"
  | "walk"
  | "row"
  | "swim"
  | "hike"
  | "strength"
  | "mobility"
  | "adaptive"
  | "other";

export type DistanceUnit = "miles" | "kilometers" | "yards" | "meters";

export interface ActivityRow {
  id: string;
  registration_id: string;
  user_id: string;
  event_id: string;
  activity_type: ActivityType;
  duration_minutes: number;
  distance: number | null;
  distance_unit: DistanceUnit | null;
  activity_date: string;
  started_at: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneRow {
  id: string;
  event_id: string;
  threshold: number;
  title: string;
  message: string;
  share_template: string | null;
  display_order: number;
}

export interface MilestoneCompletionRow {
  id: string;
  milestone_id: string;
  user_id: string;
  registration_id: string;
  completed_at: string;
}

export interface AppNotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}
