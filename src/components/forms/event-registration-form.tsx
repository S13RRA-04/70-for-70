"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT_DISCIPLINES } from "@/lib/validation/event-registration";
import { EVENT_DISCIPLINE_LABELS, GIVEAWAY_ODDS_DISCLOSURE, REGISTRATION_SUCCESS_MESSAGE } from "@/lib/content/22-for-the-22";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40 sm:text-sm";

function Field({
  id,
  label,
  optional,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}{" "}
        {optional ? (
          <span className="text-charcoal-light">(optional)</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      {children}
    </div>
  );
}

/**
 * Free "22 For the 22" registration — submitting this form IS the free
 * giveaway/sweepstakes entry (see the single waiver checkbox below, whose
 * copy states that explicitly). Same submission pattern as
 * TriathlonTeamApplicationForm: honeypot + render-timestamp anti-spam,
 * idle/submitting/success/error states, POST to an API route rather than a
 * server action.
 */
export function EventRegistrationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderedAtRef = useRef<number | null>(null);

  const [participationType, setParticipationType] = useState<"solo" | "team">("solo");
  const [disciplines, setDisciplines] = useState<string[]>([]);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  function toggleDiscipline(value: string) {
    setDisciplines((prev) => (prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const str = (key: string) => String(data.get(key) ?? "").trim();

    const payload = {
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

      companyWebsite: str("companyWebsite"),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/22-for-the-22/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        data-analytics-event="22_registration_complete"
        className="rounded-sm border border-olive/30 bg-olive/10 p-8"
      >
        <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">You&apos;re In</p>
        <p className="mt-3 text-base text-charcoal-light">{REGISTRATION_SUCCESS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-busy={status === "submitting"}>
      {/* Honeypot field — hidden from sighted users, left blank by real people. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="er-companyWebsite">Leave this field blank</label>
        <input type="text" id="er-companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="er-firstName" label="First Name">
          <input id="er-firstName" name="firstName" type="text" required className={inputClass} />
        </Field>
        <Field id="er-lastName" label="Last Name">
          <input id="er-lastName" name="lastName" type="text" required className={inputClass} />
        </Field>
        <Field id="er-email" label="Email">
          <input id="er-email" name="email" type="email" required className={inputClass} />
        </Field>
        <Field id="er-phone" label="Phone" optional>
          <input id="er-phone" name="phone" type="tel" className={inputClass} />
        </Field>
        <Field id="er-city" label="City">
          <input id="er-city" name="city" type="text" required className={inputClass} />
        </Field>
        <Field id="er-state" label="State">
          <input id="er-state" name="state" type="text" required className={inputClass} />
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
              <input id="er-teamName" name="teamName" type="text" required className={inputClass} />
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
            Planned Disciplines <span aria-hidden="true">*</span>
          </legend>
          <p className="mt-1 text-sm text-charcoal-light">Choose one or mix several — however you move, keep moving.</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              <input id="er-disciplineOtherNote" name="disciplineOtherNote" type="text" required className={inputClass} />
            </Field>
          </div>
        )}
      </div>

      <Field id="er-participationReason" label="Why are you participating?" optional>
        <textarea id="er-participationReason" name="participationReason" rows={4} className={inputClass} />
      </Field>

      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="waiverAccepted" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>
            I agree to the event waiver and terms, and understand that completing this free registration enters
            me in the 22-Hour Giveaway. {GIVEAWAY_ODDS_DISCLOSURE}
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="emailConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>Send me email updates about 22 For the 22 (optional).</span>
        </label>
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        data-analytics-event="22_register_click"
        className="w-full rounded-sm bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Register Free"}
      </button>
    </form>
  );
}
