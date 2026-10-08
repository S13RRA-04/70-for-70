"use client";

import { useState } from "react";
import { EVENT_DISCIPLINES, eventRegistrationSchema } from "@/lib/validation/event-registration";
import { EVENT_DISCIPLINE_LABELS, GIVEAWAY_ODDS_DISCLOSURE } from "@/lib/content/22-for-the-22";
import { RegistrationSuccess } from "@/components/22-for-the-22/registration-success";
import {
  controlClassName,
  fieldA11yProps,
  Field,
  FormError,
  FormSubmitButton,
  HoneypotField,
  FORM_CONTROL_CLASS,
} from "@/components/forms/form-parts";
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

  const { status, errorMessage, fieldErrors, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } =
    useFormSubmit({
      endpoint: "/api/22-for-the-22/register",
      schema: eventRegistrationSchema,
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
        <Field id="er-firstName" label="First Name" error={fieldErrors.firstName}>
          <input
            id="er-firstName"
            name="firstName"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.firstName)}
            {...fieldA11yProps("er-firstName", fieldErrors.firstName)}
          />
        </Field>
        <Field id="er-lastName" label="Last Name" error={fieldErrors.lastName}>
          <input
            id="er-lastName"
            name="lastName"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.lastName)}
            {...fieldA11yProps("er-lastName", fieldErrors.lastName)}
          />
        </Field>
        <Field id="er-email" label="Email" error={fieldErrors.email}>
          <input
            id="er-email"
            name="email"
            type="email"
            required
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.email)}
            {...fieldA11yProps("er-email", fieldErrors.email)}
          />
        </Field>
        <Field id="er-phone" label="Phone" optional error={fieldErrors.phone}>
          <input
            id="er-phone"
            name="phone"
            type="tel"
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.phone)}
            {...fieldA11yProps("er-phone", fieldErrors.phone)}
          />
        </Field>
        <Field id="er-city" label="City" error={fieldErrors.city}>
          <input
            id="er-city"
            name="city"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.city)}
            {...fieldA11yProps("er-city", fieldErrors.city)}
          />
        </Field>
        <Field id="er-state" label="State" error={fieldErrors.state}>
          <input
            id="er-state"
            name="state"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.state)}
            {...fieldA11yProps("er-state", fieldErrors.state)}
          />
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
            <Field id="er-teamName" label="Team Name" error={fieldErrors.teamName}>
              <input
                id="er-teamName"
                name="teamName"
                type="text"
                required
                className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.teamName)}
                {...fieldA11yProps("er-teamName", fieldErrors.teamName)}
              />
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
        {fieldErrors.disciplines && (
          <p role="alert" className="mt-2 text-xs font-medium text-red-700">
            {fieldErrors.disciplines}
          </p>
        )}

        {disciplines.includes("other") && (
          <div className="mt-4 border-l-2 border-bronze/30 pl-4">
            <Field id="er-disciplineOtherNote" label="What's your &quot;other&quot;?" error={fieldErrors.disciplineOtherNote}>
              <input
                id="er-disciplineOtherNote"
                name="disciplineOtherNote"
                type="text"
                required
                className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.disciplineOtherNote)}
                {...fieldA11yProps("er-disciplineOtherNote", fieldErrors.disciplineOtherNote)}
              />
            </Field>
          </div>
        )}
      </div>

      <Field id="er-participationReason" label="Why are you participating?" optional error={fieldErrors.participationReason}>
        <textarea
          id="er-participationReason"
          name="participationReason"
          rows={4}
          className={controlClassName(FORM_CONTROL_CLASS, fieldErrors.participationReason)}
          {...fieldA11yProps("er-participationReason", fieldErrors.participationReason)}
        />
      </Field>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="waiverAccepted" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>
            I agree to the event waiver and terms, and understand that completing this free registration enters
            me in the 22 For the 22 Giveaway. {GIVEAWAY_ODDS_DISCLOSURE}
          </span>
        </label>
        {fieldErrors.waiverAccepted && (
          <p role="alert" className="text-xs font-medium text-red-700">
            {fieldErrors.waiverAccepted}
          </p>
        )}
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="emailConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>Send me email updates about 22 For the 22 (optional).</span>
        </label>
      </div>

      <TurnstileWidget ref={turnstileRef} action="event_registration" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <FormSubmitButton
        disabled={submitDisabled}
        submitting={status === "submitting"}
        idleLabel="Register Free"
        submittingLabel="Registering…"
        data-analytics-event="22_register_click"
      />
    </form>
  );
}
