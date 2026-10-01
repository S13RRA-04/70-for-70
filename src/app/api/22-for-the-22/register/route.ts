import { NextResponse } from "next/server";
import { CURRENT_EVENT_SLUG } from "@/lib/content/22-for-the-22";
import { notifyEventRegistrationSubmitted } from "@/lib/notifications";
import {
  handlePublicForm,
  serverError,
  skipWhenSupabaseUnconfigured,
} from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { eventRegistrationSchema } from "@/lib/validation/event-registration";

/** Postgres unique_violation — the event_registrations_event_email_idx unique index tripped. */
const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "22-for-the-22-register",
      binding: "RATE_LIMITER_FORMS",
      schema: eventRegistrationSchema,
      turnstileAction: "event_registration",
    },
    "22-for-the-22",
    async (data) => {
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

      const unconfigured = skipWhenSupabaseUnconfigured("22-for-the-22", row);
      if (unconfigured) return unconfigured;

      const supabase = createAdminClient();

      const { data: event, error: eventError } = await supabase
        .from("event_config")
        .select("id")
        .eq("event_slug", CURRENT_EVENT_SLUG)
        .maybeSingle();

      if (eventError || !event) {
        return serverError(
          "22-for-the-22: event_config lookup failed",
          eventError ?? "no event_config row for the current slug",
        );
      }

      const { data: inserted, error } = await supabase
        .from("event_registrations")
        .insert({ ...row, event_id: event.id })
        .select("id")
        .single();

      if (error || !inserted) {
        // A repeat signup is a real answer for the visitor, not a server fault —
        // it gets its own 409 rather than the generic 500.
        if (error?.code === POSTGRES_UNIQUE_VIOLATION) {
          return NextResponse.json(
            { ok: false, error: "This email is already registered for 22 For the 22." },
            { status: 409 },
          );
        }

        return serverError("22-for-the-22: insert failed", error ?? "insert returned no row");
      }

      await notifyEventRegistrationSubmitted({
        registrationId: inserted.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      return NextResponse.json({ ok: true });
    },
  );
}
