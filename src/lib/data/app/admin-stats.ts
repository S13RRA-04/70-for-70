import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AppEventAdminStats {
  totalRegistered: number;
  activeParticipants: number;
  sessionsCompleted: number;
  totalMovementMinutes: number;
  finishers: number;
  teams: number;
  activityBreakdown: Record<string, number>;
}

/**
 * All service-role, admin-only aggregates — never exposed via a
 * client-facing RLS-scoped query (that's exactly the "sensitive
 * participant data in aggregate public views" the spec's privacy section
 * warns against). See src/app/app/(tabs) for the RLS-scoped per-user
 * equivalents participants see for themselves.
 */
export async function getAppEventAdminStats(eventId: string): Promise<AppEventAdminStats> {
  const admin = createAdminClient();

  const [{ count: totalRegistered }, { data: registrations }, { data: activities }, { data: milestoneCompletions }] =
    await Promise.all([
      admin.from("registrations").select("*", { count: "exact", head: true }).eq("event_id", eventId),
      admin.from("registrations").select("user_id, team_name").eq("event_id", eventId),
      admin.from("activities").select("user_id, duration_minutes, activity_type").eq("event_id", eventId),
      admin
        .from("milestone_completions")
        .select("user_id, milestones!inner(event_id, threshold)")
        .eq("milestones.event_id", eventId),
    ]);

  const activeParticipantIds = new Set((activities ?? []).map((a) => a.user_id));
  const teamNames = new Set((registrations ?? []).map((r) => r.team_name).filter((t): t is string => Boolean(t)));

  const activityBreakdown: Record<string, number> = {};
  let totalMovementMinutes = 0;
  for (const activity of activities ?? []) {
    totalMovementMinutes += activity.duration_minutes;
    activityBreakdown[activity.activity_type] = (activityBreakdown[activity.activity_type] ?? 0) + 1;
  }

  const { data: event } = await admin.from("events").select("required_sessions").eq("id", eventId).maybeSingle();
  const finisherIds = new Set(
    (milestoneCompletions ?? [])
      .filter((c) => (c.milestones as unknown as { threshold: number }).threshold === event?.required_sessions)
      .map((c) => c.user_id),
  );

  return {
    totalRegistered: totalRegistered ?? 0,
    activeParticipants: activeParticipantIds.size,
    sessionsCompleted: activities?.length ?? 0,
    totalMovementMinutes,
    finishers: finisherIds.size,
    teams: teamNames.size,
    activityBreakdown,
  };
}

export interface AdminRegistrationRow {
  registrationId: string;
  userId: string;
  email: string | null;
  firstName: string;
  lastName: string;
  city: string | null;
  state: string | null;
  registrationType: string;
  teamName: string | null;
  createdAt: string;
  sessionCount: number;
  totalMinutes: number;
}

export async function getAppEventRegistrationsForAdmin(eventId: string): Promise<AdminRegistrationRow[]> {
  const admin = createAdminClient();

  const { data: registrations, error } = await admin
    .from("registrations")
    .select("id, user_id, registration_type, team_name, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error || !registrations) {
    console.error("Failed to load registrations for admin:", error);
    return [];
  }

  const userIds = registrations.map((r) => r.user_id);
  const [{ data: profiles }, { data: activities }] = await Promise.all([
    admin.from("profiles").select("id, first_name, last_name, city, state").in("id", userIds),
    admin.from("activities").select("user_id, duration_minutes").eq("event_id", eventId).in("user_id", userIds),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const sessionCountByUser = new Map<string, number>();
  const minutesByUser = new Map<string, number>();
  for (const activity of activities ?? []) {
    sessionCountByUser.set(activity.user_id, (sessionCountByUser.get(activity.user_id) ?? 0) + 1);
    minutesByUser.set(activity.user_id, (minutesByUser.get(activity.user_id) ?? 0) + activity.duration_minutes);
  }

  const emailByUserId = new Map<string, string | null>();
  await Promise.all(
    userIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      emailByUserId.set(id, data.user?.email ?? null);
    }),
  );

  return registrations.map((r) => {
    const profile = profileById.get(r.user_id);
    return {
      registrationId: r.id,
      userId: r.user_id,
      email: emailByUserId.get(r.user_id) ?? null,
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      city: profile?.city ?? null,
      state: profile?.state ?? null,
      registrationType: r.registration_type,
      teamName: r.team_name,
      createdAt: r.created_at,
      sessionCount: sessionCountByUser.get(r.user_id) ?? 0,
      totalMinutes: minutesByUser.get(r.user_id) ?? 0,
    };
  });
}
