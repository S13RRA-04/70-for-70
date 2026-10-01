import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { triathlonTeamApplicationSchema } from "@/lib/validation/triathlon-team";
import { notifyTriathlonTeamApplicationSubmitted } from "@/lib/notifications";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { logServerError, logServerWarn } from "@/lib/log";

const MIN_FILL_TIME_MS = 1_500;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (await isRateLimited(`triathlon-team:${ip}`, { limit: 5, windowMs: 10 * 60_000, binding: "RATE_LIMITER_FORMS" })) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = triathlonTeamApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const isBot =
    Boolean(data.companyWebsite) ||
    Date.now() - data.renderedAt < MIN_FILL_TIME_MS ||
    !(await verifyTurnstileToken(data.turnstileToken, "triathlon_team", ip));
  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

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

  if (!isSupabaseConfigured()) {
    logServerWarn("triathlon-team: not persisted (Supabase not configured)", row);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();
    const { data: inserted, error } = await supabase
      .from("triathlon_team_applications")
      .insert(row)
      .select("id")
      .single();

    if (error || !inserted) {
      logServerError("triathlon-team: insert failed", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    await notifyTriathlonTeamApplicationSubmitted({
      applicationId: inserted.id,
      fullName: data.fullName,
      email: data.email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logServerError("triathlon-team: submission failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
