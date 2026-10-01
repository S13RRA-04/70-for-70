import { NextResponse } from "next/server";
import { notifyTriathlonTeamApplicationSubmitted } from "@/lib/notifications";
import { handlePublicForm, serverError, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { triathlonTeamApplicationSchema } from "@/lib/validation/triathlon-team";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "triathlon-team",
      binding: "RATE_LIMITER_FORMS",
      schema: triathlonTeamApplicationSchema,
      turnstileAction: "triathlon_team",
    },
    "triathlon-team",
    async (data) => {
      const row = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,

        experience_level: data.experienceLevel,
        years_in_triathlon: data.yearsInTriathlon,
        preferred_distance: data.preferredDistance,

        registered_for_race: data.registeredForRace === "yes",
        race_name: data.registeredForRace === "yes" ? data.raceName || null : null,
        race_date: data.registeredForRace === "yes" ? data.raceDate || null : null,
        race_distance: data.registeredForRace === "yes" ? data.raceDistance || null : null,
        race_location: data.registeredForRace === "yes" ? data.raceLocation || null : null,
        needs_race_help: data.registeredForRace === "no" ? data.needsRaceHelp === "yes" : null,

        mission_reason: data.missionReason,

        fundraising_experience: data.fundraisingExperience === "yes",
        fundraising_goal: data.fundraisingGoal,

        instagram: data.instagram || null,
        facebook: data.facebook || null,
        strava: data.strava || null,
        other_social: data.otherSocial || null,

        apparel_size: data.apparelSize,

        ack_costs: data.ackCosts,
        ack_safety: data.ackSafety,
        ack_conduct: data.ackConduct,

        status: "new",
      };

      const unconfigured = skipWhenSupabaseUnconfigured("triathlon-team", row);
      if (unconfigured) return unconfigured;

      const { data: inserted, error } = await createAdminClient()
        .from("triathlon_team_applications")
        .insert(row)
        .select("id")
        .single();

      if (error || !inserted) {
        return serverError("triathlon-team: insert failed", error ?? "insert returned no row");
      }

      await notifyTriathlonTeamApplicationSubmitted({
        applicationId: inserted.id,
        fullName: data.fullName,
        email: data.email,
      });

      return NextResponse.json({ ok: true });
    },
  );
}
