import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isRateLimited } from "@/lib/rate-limit";
import { eventRegistrationSchema } from "@/lib/validation/event-registration";
import { notifyEventRegistrationSubmitted } from "@/lib/notifications";
import { CURRENT_EVENT_SLUG } from "@/lib/content/22-for-the-22";

const MIN_FILL_TIME_MS = 1_500;

/** Postgres unique_violation — the event_registrations_event_email_idx unique index tripped. */
const POSTGRES_UNIQUE_VIOLATION = "23505";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(`22-for-the-22-register:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
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

  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const isBot = Boolean(data.companyWebsite) || Date.now() - data.renderedAt < MIN_FILL_TIME_MS;
  if (isBot) {
    // Respond as if successful so bots don't learn which check tripped.
    return NextResponse.json({ ok: true });
  }

  const row = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    city: data.city,
    state: data.state,
    phone: data.phone || null,

    participation_type: data.participationType,
    team_name: data.participationType === "team" ? data.teamName || null : null,
    team_captain: data.participationType === "team" ? data.teamCaptain : false,

    disciplines: data.disciplines,
    discipline_other_note: data.disciplines.includes("other") ? data.disciplineOtherNote || null : null,
    participation_reason: data.participationReason || null,

    waiver_accepted: data.waiverAccepted,
    email_consent: data.emailConsent,

    status: "confirmed",
  };

  if (!isSupabaseConfigured()) {
    console.warn("22 For the 22 registration received but Supabase is not configured; not persisted:", row);
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = createAdminClient();

    const { data: event, error: eventError } = await supabase
      .from("event_config")
      .select("id")
      .eq("event_slug", CURRENT_EVENT_SLUG)
      .maybeSingle();

    if (eventError || !event) {
      console.error("Failed to look up event_config for registration:", eventError);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    const { data: inserted, error } = await supabase
      .from("event_registrations")
      .insert({ ...row, event_id: event.id })
      .select("id")
      .single();

    if (error || !inserted) {
      if (error?.code === POSTGRES_UNIQUE_VIOLATION) {
        return NextResponse.json(
          { ok: false, error: "This email is already registered for 22 For the 22." },
          { status: 409 },
        );
      }

      console.error("Failed to insert 22 For the 22 registration:", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    await notifyEventRegistrationSubmitted({
      registrationId: inserted.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("22 For the 22 registration submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
