"use client";

import { SPONSOR_INQUIRY_INTERESTS, inquirySchema } from "@/lib/validation/inquiry";
import {
  controlClassName,
  fieldA11yProps,
  FormError,
  HoneypotField,
  FORM_CONTROL_CLASS_COMPACT,
} from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

export function SponsorInquiryForm({ prefillItem }: { prefillItem?: string }) {
  const { status, errorMessage, fieldErrors, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } =
    useFormSubmit({
      endpoint: "/api/inquiries",
      schema: inquirySchema,
      buildPayload: (data) => ({
        name: String(data.get("name") ?? ""),
        organization: String(data.get("organization") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        interest: String(data.get("interest") ?? ""),
        message: String(data.get("message") ?? ""),
      }),
    });

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-ink"
      >
        <p className="font-display text-lg font-semibold uppercase tracking-wide">
          Thank you
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          Your inquiry has been received. We&apos;ll follow up soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      {prefillItem && (
        <p className="rounded-sm border border-bronze/30 bg-bronze/5 px-4 py-3 text-sm text-charcoal-light">
          Reaching out about: <span className="font-semibold text-ink">{prefillItem}</span>
        </p>
      )}
      <HoneypotField id="companyWebsite" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.name)}
            {...fieldA11yProps("name", fieldErrors.name)}
          />
          {fieldErrors.name && (
            <p id="name-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="organization" className="text-sm font-medium text-ink">
            Organization
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.organization)}
            {...fieldA11yProps("organization", fieldErrors.organization)}
          />
          {fieldErrors.organization && (
            <p id="organization-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.organization}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.email)}
            {...fieldA11yProps("email", fieldErrors.email)}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Phone <span className="text-charcoal-light">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.phone)}
            {...fieldA11yProps("phone", fieldErrors.phone)}
          />
          {fieldErrors.phone && (
            <p id="phone-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="text-sm font-medium text-ink">
          Topic <span aria-hidden="true">*</span>
        </label>
        <select
          id="interest"
          name="interest"
          required
          defaultValue={prefillItem ? "Other" : ""}
          className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.interest)}
          {...fieldA11yProps("interest", fieldErrors.interest)}
        >
          <option value="" disabled>
            Select an option
          </option>
          {SPONSOR_INQUIRY_INTERESTS.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
        {fieldErrors.interest && (
          <p id="interest-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
            {fieldErrors.interest}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={prefillItem ? `I'd like to help with: ${prefillItem}\n\n` : undefined}
          className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.message)}
          {...fieldA11yProps("message", fieldErrors.message)}
        />
        {fieldErrors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <TurnstileWidget ref={turnstileRef} action="inquiry" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <button
        type="submit"
        disabled={submitDisabled}
        data-analytics-event="sponsor_inquiry"
        className="w-full rounded-sm bg-bronze-text px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
