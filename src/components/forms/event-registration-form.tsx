"use client";

import { useState } from "react";
import { EVENT_DISCIPLINES } from "@/lib/validation/event-registration";
import { EVENT_DISCIPLINE_LABELS, GIVEAWAY_ODDS_DISCLOSURE } from "@/lib/content/22-for-the-22";
import { RegistrationSuccess } from "@/components/22-for-the-22/registration-success";
import { Field, FormError, HoneypotField, FORM_CONTROL_CLASS } from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

/**
 * Free "22 For the 22" registration — submitting this form IS the free
 * giveaway/sweepstakes entry (see the single waiver checkbox below, whose
 * copy states that explicitly). Same submission pattern as
 * TriathlonTeamApplicationForm: honeypot + render-timestamp anti-spam,
 * idle/submitting/success/error states, POST to an API route rather than a
 * server action.
 */
export function EventRegistrationForm() {
  const [participationType, setParticipationType] = useState<"solo" | "team">("solo");
  const [disciplines, setDisciplines] = useState<string[]>([]);

  const { status, errorMessage, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } = useFormSubmit({
    endpoint: "/api/22-for-the-22/register",
    buildPayload: (data) => {
      const str = (key: string) => String(data.get(key) ?? "").trim();

      return {
        firstName: str("firstName"),
        lastName: str("lastName"),
        email: str("email"),
        city: str("city"),
        state: str("state"),
        phone: str("phone"),

        participationType,
        teamName: str("teamName"),
        teamCaptain: data.get("teamCaptain") === "on",

        disciplines,
        disciplineOtherNote: str("disciplineOtherNote"),
        participationReason: str("participationReason"),

        waiverAccepted: data.get("waiverAccepted") === "on",
        emailConsent: data.get("emailConsent") === "on",
      };
    },
  });

  function toggleDiscipline(value: string) {
    setDisciplines((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  }

  if (status === "success") {
    return <RegistrationSuccess />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-busy={status === "submitting"}>
      <HoneypotField id="er-companyWebsite" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="er-firstName" label="First Name">
          <input id="er-firstName" name="firstName" type="text" required className={FORM_CONTROL_CLASS} />
        </Field>
        <Field id="er-lastName" label="Last Name">
          <input id="er-lastName" name="lastName" type="text" required className={FORM_CONTROL_CLASS} />
        </Field>
        <Field id="er-email" label="Email">
          <input id="er-email" name="email" type="email" required className={FORM_CONTROL_CLASS} />
        </Field>
        <Field id="er-phone" label="Phone" optional>
          <input id="er-phone" name="phone" type="tel" className={FORM_CONTROL_CLASS} />
        </Field>
        <Field id="er-city" label="City">
          <input id="er-city" name="city" type="text" required className={FORM_CONTROL_CLASS} />
        </Field>
        <Field id="er-state" label="State">
          <input id="er-state" name="state" type="text" required className={FORM_CONTROL_CLASS} />
        </Field>
      </div>

      <div>
        <fieldset>
          <legend className="text-sm font-medium text-ink">
            Solo or Team <span aria-hidden="true">*</span>
          </legend>
          <div className="mt-2 flex gap-4">
            {(["solo", "team"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name="participationType"
                  value={opt}
                  checked={participationType === opt}
                  onChange={() => setParticipationType(opt)}
                  required
                  className="h-4 w-4 accent-bronze"
                />
                {opt === "solo" ? "Solo" : "Team"}
              </label>
            ))}
          </div>
        </fieldset>

        {participationType === "team" && (
          <div className="mt-4 grid gap-5 border-l-2 border-bronze/30 pl-4 sm:grid-cols-2">
            <Field id="er-teamName" label="Team Name">
              <input id="er-teamName" name="teamName" type="text" required className={FORM_CONTROL_CLASS} />
            </Field>
            <label className="mt-7 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="teamCaptain" className="h-4 w-4 accent-bronze" />
              I&apos;m the team captain
            </label>
          </div>
        )}
      </div>

      <div>
        <fieldset>
          <legend className="text-sm font-medium text-ink">
            Activities You May Use <span aria-hidden="true">*</span>
          </legend>
          <p className="mt-1 text-sm text-charcoal-light">
            Choose as many as you&apos;d like. You can change activities throughout the challenge.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {EVENT_DISCIPLINES.map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 rounded-sm border border-ink/20 px-3 py-2 text-sm text-ink has-[:checked]:border-bronze has-[:checked]:bg-bronze/10"
              >
                <input
                  type="checkbox"
                  name="disciplines"
                  value={d}
                  checked={disciplines.includes(d)}
                  onChange={() => toggleDiscipline(d)}
                  className="h-4 w-4 accent-bronze"
                />
                {EVENT_DISCIPLINE_LABELS[d]}
              </label>
            ))}
          </div>
        </fieldset>

        {disciplines.includes("other") && (
          <div className="mt-4 border-l-2 border-bronze/30 pl-4">
            <Field id="er-disciplineOtherNote" label="What's your &quot;other&quot;?">
              <input id="er-disciplineOtherNote" name="disciplineOtherNote" type="text" required className={FORM_CONTROL_CLASS} />
            </Field>
          </div>
        )}
      </div>

      <Field id="er-participationReason" label="Why are you participating?" optional>
        <textarea id="er-participationReason" name="participationReason" rows={4} className={FORM_CONTROL_CLASS} />
      </Field>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="waiverAccepted" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>
            I agree to the event waiver and terms, and understand that completing this free registration enters
            me in the 22 For the 22 Giveaway. {GIVEAWAY_ODDS_DISCLOSURE}
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="emailConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>Send me email updates about 22 For the 22 (optional).</span>
        </label>
      </div>

      <TurnstileWidget ref={turnstileRef} action="event_registration" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <button
        type="submit"
        disabled={submitDisabled}
        data-analytics-event="22_register_click"
        className="w-full rounded-sm bg-bronze-text px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Register Free"}
      </button>
    </form>
  );
}
