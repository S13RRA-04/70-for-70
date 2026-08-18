"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROPOSED_TIER_LABELS,
  PROPOSED_TIERS,
  SUPPORT_TYPE_LABELS,
  SUPPORT_TYPES,
} from "@/lib/validation/sponsorship-request";

type Status = "idle" | "submitting" | "success" | "error";

export function SponsorshipRequestForm({ defaultMileNumber }: { defaultMileNumber?: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSupportTypes, setSelectedSupportTypes] = useState<string[]>([]);
  const renderedAtRef = useRef<number | null>(null);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  function toggleSupportType(type: string) {
    setSelectedSupportTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    if (selectedSupportTypes.length === 0) {
      setStatus("error");
      setErrorMessage("Select at least one type of support.");
      return;
    }

    const payload = {
      contactName: String(data.get("contactName") ?? ""),
      organizationName: String(data.get("organizationName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      website: String(data.get("website") ?? ""),
      industry: String(data.get("industry") ?? ""),
      proposedTier: String(data.get("proposedTier") ?? "") || undefined,
      cashValue: data.get("cashValue") ? Number(data.get("cashValue")) : undefined,
      inKindValue: data.get("inKindValue") ? Number(data.get("inKindValue")) : undefined,
      supportType: selectedSupportTypes,
      description: String(data.get("description") ?? ""),
      requestedBenefits: String(data.get("requestedBenefits") ?? ""),
      requestedMileNumber: data.get("requestedMileNumber")
        ? Number(data.get("requestedMileNumber"))
        : undefined,
      referralSource: String(data.get("referralSource") ?? ""),
      message: String(data.get("message") ?? ""),
      acknowledgedPendingReview: data.get("acknowledgedPendingReview") === "on",
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/sponsorship-requests", {
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
      form.reset();
      setSelectedSupportTypes([]);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-ink">
        <p className="font-display text-lg font-semibold uppercase tracking-wide">
          Request received
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          Thank you for your interest in sponsoring 70 for 70. Every proposal is individually
          reviewed before acceptance — we&apos;ll follow up by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-busy={status === "submitting"}>
      {/* Honeypot field — hidden from sighted users, left blank by real people. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="companyWebsite">Leave this field blank</label>
        <input type="text" id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-5">
        <legend className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Contact
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="contactName" name="contactName" label="Contact Name" required />
          <Field id="organizationName" name="organizationName" label="Company / Organization" required />
          <Field id="email" name="email" label="Email" type="email" required />
          <Field id="phone" name="phone" label="Phone" type="tel" />
          <Field id="website" name="website" label="Website" type="url" />
          <Field id="industry" name="industry" label="Business Type / Industry" />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Proposed Support
        </legend>

        <div>
          <label htmlFor="proposedTier" className="text-sm font-medium text-ink">
            Requested Sponsorship Level
          </label>
          <select
            id="proposedTier"
            name="proposedTier"
            defaultValue=""
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          >
            <option value="">Select a level</option>
            {PROPOSED_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {PROPOSED_TIER_LABELS[tier]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="cashValue" name="cashValue" label="Proposed Cash Value ($)" type="number" min={0} />
          <Field id="inKindValue" name="inKindValue" label="Proposed In-Kind Value ($)" type="number" min={0} />
        </div>

        <div>
          <span className="text-sm font-medium text-ink">
            Type of Support <span aria-hidden="true">*</span>
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Type of support">
            {SUPPORT_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 rounded-sm border border-ink/15 px-3 py-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedSupportTypes.includes(type)}
                  onChange={() => toggleSupportType(type)}
                  className="h-4 w-4 accent-bronze"
                />
                {SUPPORT_TYPE_LABELS[type]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Description of Proposed Support <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          />
        </div>

        <Field
          id="requestedMileNumber"
          name="requestedMileNumber"
          label="Requested Mile Number (optional)"
          type="number"
          min={1}
          max={70}
          defaultValue={defaultMileNumber}
          hint="If you'd like to sponsor a specific mile, it will be marked pending review — not reserved — until approved."
        />

        <div>
          <label htmlFor="requestedBenefits" className="text-sm font-medium text-ink">
            Desired Recognition / Benefits
          </label>
          <textarea
            id="requestedBenefits"
            name="requestedBenefits"
            rows={3}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Additional Information
        </legend>
        <Field id="referralSource" name="referralSource" label="How did you hear about 70 for 70?" />
        <div>
          <label htmlFor="message" className="text-sm font-medium text-ink">
            Message <span className="text-charcoal-light">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          />
        </div>
      </fieldset>

      <div className="rounded-sm border border-ink/15 bg-sand-light p-4">
        <label htmlFor="acknowledgedPendingReview" className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            id="acknowledgedPendingReview"
            name="acknowledgedPendingReview"
            required
            className="mt-0.5 h-4 w-4 accent-bronze"
          />
          <span>
            Submitting this form is only a sponsorship inquiry and does not constitute acceptance
            of any gift, sponsorship, contribution, product, service, or other benefit. All
            proposed sponsorships are subject to review and written approval before acceptance.
            <span aria-hidden="true"> *</span>
          </span>
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
        data-analytics-event="sponsor_inquiry"
        className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Submit Sponsorship Request"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  min,
  max,
  defaultValue,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number | string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
      />
      {hint && <p className="mt-1 text-xs text-charcoal-light">{hint}</p>}
    </div>
  );
}
