"use client";

import { useEffect, useRef, useState } from "react";
import {
  APPAREL_SIZES,
  FUNDRAISING_GOAL_PRESETS,
  TRIATHLON_EXPERIENCE_LEVELS,
} from "@/lib/validation/triathlon-team";

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

function YesNoGroup({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">
        {legend} <span aria-hidden="true">*</span>
      </legend>
      <div className="mt-2 flex gap-4">
        {(["yes", "no"] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              required
              className="h-4 w-4 accent-bronze"
            />
            {opt === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Triathlon Team application — /get-involved/triathlon-team's only content.
 * Same submission pattern as GetInvolvedForm (fetch → /api/[route], not a
 * server action or mailto link): honeypot + render-timestamp anti-spam,
 * idle/submitting/success/error states, structured persistence via the API
 * route rather than email-only delivery.
 */
export function TriathlonTeamApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderedAtRef = useRef<number | null>(null);

  const [registeredForRace, setRegisteredForRace] = useState<"yes" | "no" | "">("");
  const [needsRaceHelp, setNeedsRaceHelp] = useState<"yes" | "no" | "">("");
  const [fundraisingExperience, setFundraisingExperience] = useState<"yes" | "no" | "">("");
  const [goalPreset, setGoalPreset] = useState<string>("");
  const [customGoal, setCustomGoal] = useState("");

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const str = (key: string) => String(data.get(key) ?? "").trim();

    const fundraisingGoal = goalPreset === "Other" ? customGoal.trim() : goalPreset;

    const payload = {
      fullName: str("fullName"),
      email: str("email"),
      phone: str("phone"),
      city: str("city"),
      state: str("state"),

      experienceLevel: str("experienceLevel"),
      yearsInTriathlon: str("yearsInTriathlon"),
      preferredDistance: str("preferredDistance"),

      registeredForRace,
      raceName: str("raceName"),
      raceDate: str("raceDate"),
      raceDistance: str("raceDistance"),
      raceLocation: str("raceLocation"),
      needsRaceHelp,

      missionReason: str("missionReason"),

      fundraisingExperience,
      fundraisingGoal,

      instagram: str("instagram"),
      facebook: str("facebook"),
      strava: str("strava"),
      otherSocial: str("otherSocial"),

      apparelSize: str("apparelSize"),

      ackCosts: data.get("ackCosts") === "on",
      ackSafety: data.get("ackSafety") === "on",
      ackConduct: data.get("ackConduct") === "on",

      companyWebsite: str("companyWebsite"),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/triathlon-team", {
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
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-8">
        <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
          Application Received
        </p>
        <p className="mt-3 text-base text-charcoal-light">
          Thank you for your interest in joining the Tri For The 22 Triathlon Team.
        </p>
        <p className="mt-3 text-base text-charcoal-light">
          We&apos;ll review your application and follow up with next steps.
        </p>
        <p className="mt-3 text-base text-charcoal-light">
          In the meantime, keep training — and keep the mission in sight.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10" aria-busy={status === "submitting"}>
      {/* Honeypot field — hidden from sighted users, left blank by real people. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="tta-companyWebsite">Leave this field blank</label>
        <input type="text" id="tta-companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Personal Information */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Personal Information
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="tta-fullName" label="Full Name">
            <input id="tta-fullName" name="fullName" type="text" required className={inputClass} />
          </Field>
          <Field id="tta-email" label="Email">
            <input id="tta-email" name="email" type="email" required className={inputClass} />
          </Field>
          <Field id="tta-phone" label="Phone">
            <input id="tta-phone" name="phone" type="tel" required className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field id="tta-city" label="City">
              <input id="tta-city" name="city" type="text" required className={inputClass} />
            </Field>
            <Field id="tta-state" label="State">
              <input id="tta-state" name="state" type="text" required className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

      {/* Triathlon Background */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Triathlon Background
        </h2>
        <div className="mt-4 space-y-5">
          <fieldset>
            <legend className="text-sm font-medium text-ink">
              Triathlon Experience <span aria-hidden="true">*</span>
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TRIATHLON_EXPERIENCE_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    required
                    className="h-4 w-4 accent-bronze"
                  />
                  {level}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="tta-years" label="How long have you participated in triathlon?">
              <input
                id="tta-years"
                name="yearsInTriathlon"
                type="text"
                placeholder="e.g. 2 years"
                required
                className={inputClass}
              />
            </Field>
            <Field id="tta-preferredDistance" label="Preferred Race Distance">
              <input
                id="tta-preferredDistance"
                name="preferredDistance"
                type="text"
                placeholder="e.g. 70.3"
                required
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Upcoming Racing */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Upcoming Racing
        </h2>
        <div className="mt-4 space-y-5">
          <YesNoGroup
            legend="Are you currently registered for a triathlon?"
            name="registeredForRace"
            value={registeredForRace}
            onChange={setRegisteredForRace}
          />

          {registeredForRace === "yes" && (
            <div className="grid gap-5 border-l-2 border-bronze/30 pl-4 sm:grid-cols-2">
              <Field id="tta-raceName" label="Race Name">
                <input id="tta-raceName" name="raceName" type="text" required className={inputClass} />
              </Field>
              <Field id="tta-raceDate" label="Race Date">
                <input id="tta-raceDate" name="raceDate" type="date" required className={inputClass} />
              </Field>
              <Field id="tta-raceDistance" label="Race Distance">
                <input
                  id="tta-raceDistance"
                  name="raceDistance"
                  type="text"
                  placeholder="e.g. Sprint, Olympic, 70.3, IRONMAN"
                  required
                  className={inputClass}
                />
              </Field>
              <Field id="tta-raceLocation" label="Race Location">
                <input id="tta-raceLocation" name="raceLocation" type="text" required className={inputClass} />
              </Field>
            </div>
          )}

          {registeredForRace === "no" && (
            <div className="border-l-2 border-bronze/30 pl-4">
              <YesNoGroup
                legend="Would you like help identifying a race?"
                name="needsRaceHelp"
                value={needsRaceHelp}
                onChange={setNeedsRaceHelp}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mission */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Mission</h2>
        <div className="mt-4">
          <Field id="tta-missionReason" label="Why do you want to race for Tri For The 22?">
            <textarea
              id="tta-missionReason"
              name="missionReason"
              required
              rows={5}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {/* Fundraising */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Fundraising</h2>
        <div className="mt-4 space-y-5">
          <YesNoGroup
            legend="Have you fundraised for a cause before?"
            name="fundraisingExperience"
            value={fundraisingExperience}
            onChange={setFundraisingExperience}
          />

          <fieldset>
            <legend className="text-sm font-medium text-ink">
              Personal Fundraising Goal <span aria-hidden="true">*</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...FUNDRAISING_GOAL_PRESETS, "Other"].map((preset) => (
                <label
                  key={preset}
                  className="flex items-center gap-2 rounded-sm border border-ink/20 px-3 py-2 text-sm text-ink has-[:checked]:border-bronze has-[:checked]:bg-bronze/10"
                >
                  <input
                    type="radio"
                    name="fundraisingGoalPreset"
                    value={preset}
                    checked={goalPreset === preset}
                    onChange={() => setGoalPreset(preset)}
                    required
                    className="h-4 w-4 accent-bronze"
                  />
                  {preset}
                </label>
              ))}
            </div>
            {goalPreset === "Other" && (
              <input
                type="text"
                aria-label="Custom fundraising goal"
                placeholder="Enter a dollar amount"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                required
                className={`${inputClass} max-w-xs`}
              />
            )}
          </fieldset>
        </div>
      </div>

      {/* Social / Outreach */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Social / Outreach
        </h2>
        <p className="mt-1 text-sm text-charcoal-light">All optional.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="tta-instagram" label="Instagram" optional>
            <input id="tta-instagram" name="instagram" type="text" placeholder="@handle" className={inputClass} />
          </Field>
          <Field id="tta-facebook" label="Facebook" optional>
            <input id="tta-facebook" name="facebook" type="text" className={inputClass} />
          </Field>
          <Field id="tta-strava" label="Strava" optional>
            <input id="tta-strava" name="strava" type="text" className={inputClass} />
          </Field>
          <Field id="tta-otherSocial" label="Other Link" optional>
            <input id="tta-otherSocial" name="otherSocial" type="text" className={inputClass} />
          </Field>
        </div>
      </div>

      {/* Apparel */}
      <div>
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Apparel</h2>
        <div className="mt-4 max-w-xs">
          <Field id="tta-apparelSize" label="Shirt / Tri Apparel Size">
            <select id="tta-apparelSize" name="apparelSize" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select a size
              </option>
              {APPAREL_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Participation expectations */}
      <div className="rounded-sm border border-ink/10 bg-sand-light/60 p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          What It Means to Join the Team
        </h2>
        <p className="mt-3 text-sm text-charcoal-light">Tri For The 22 athletes are expected to:</p>
        <ul className="mt-3 space-y-2 text-sm text-charcoal-light">
          <li>&bull; Participate in a recognized triathlon event</li>
          <li>&bull; Represent the campaign professionally</li>
          <li>&bull; Make a good-faith effort to raise funds and awareness</li>
          <li>&bull; Share the mission with their community</li>
          <li>&bull; Provide occasional race/training updates when appropriate</li>
          <li>&bull; Follow race organizer rules and safety requirements</li>
        </ul>
      </div>

      {/* Acknowledgment */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="ackCosts" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>
            I understand that participation as a Tri For The 22 triathlete does not guarantee payment or
            reimbursement for race registration, travel, lodging, training, equipment, medical expenses, or
            other costs unless specifically approved in writing.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="ackSafety" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>
            I understand that I am responsible for my own training, health, race registration, safety, and
            compliance with the rules of any event in which I participate.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="ackConduct" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
          <span>I agree to represent Tri For The 22 and its mission respectfully and professionally.</span>
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
        data-analytics-event="triathlon_team_application_submit"
        className="w-full rounded-sm bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
