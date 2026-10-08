"use client";

import { GET_INVOLVED_INTEREST_TYPES, inquirySchema } from "@/lib/validation/inquiry";
import {
  controlClassName,
  fieldA11yProps,
  FormError,
  FormSubmitButton,
  HoneypotField,
  FORM_CONTROL_CLASS_COMPACT,
} from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

interface GetInvolvedFormProps {
  /**
   * Preselects and locks the "I'd like to help with" field — used when the
   * form is rendered inside a specific role's detail dialog (see
   * RoleDetailDialog) rather than the page's general sign-up section, so the
   * role picked on /get-involved carries through without asking again.
   */
  defaultInterest?: (typeof GET_INVOLVED_INTEREST_TYPES)[number];
  /**
   * Disambiguates field ids when more than one instance of this form
   * renders on the same page (the general form plus one per role dialog).
   */
  idPrefix?: string;
}

/**
 * /get-involved's volunteer sign-up — reuses the same /api/inquiries
 * pipeline as sponsor/contact inquiries (rate limiting, honeypot,
 * admin-visible queue) rather than standing up a second one. See
 * GET_INVOLVED_INTEREST_TYPES.
 */
export function GetInvolvedForm({ defaultInterest, idPrefix = "" }: GetInvolvedFormProps = {}) {
  const { status, errorMessage, fieldErrors, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } =
    useFormSubmit({
      endpoint: "/api/inquiries",
      schema: inquirySchema,
      buildPayload: (data) => ({
        name: String(data.get("name") ?? ""),
        organization: "",
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        // Falls back to the prop only when the select isn't rendered at all.
        interest: String(data.get("interest") ?? defaultInterest ?? ""),
        message: String(data.get("message") ?? ""),
      }),
    });

  if (status === "success") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-ink">
        <p className="font-display text-lg font-semibold uppercase tracking-wide">
          You&apos;re In
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          {defaultInterest
            ? `Thanks for signing up for ${defaultInterest}. We'll follow up with details as race weekend gets closer.`
            : "Thanks for signing up. We'll follow up with details as race weekend gets closer."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      <HoneypotField id={`${idPrefix}involved-companyWebsite`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}involved-name`} className="text-sm font-medium text-ink">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${idPrefix}involved-name`}
            name="name"
            type="text"
            required
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.name)}
            {...fieldA11yProps(`${idPrefix}involved-name`, fieldErrors.name)}
          />
          {fieldErrors.name && (
            <p id={`${idPrefix}involved-name-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${idPrefix}involved-email`} className="text-sm font-medium text-ink">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${idPrefix}involved-email`}
            name="email"
            type="email"
            required
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.email)}
            {...fieldA11yProps(`${idPrefix}involved-email`, fieldErrors.email)}
          />
          {fieldErrors.email && (
            <p id={`${idPrefix}involved-email-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${idPrefix}involved-phone`} className="text-sm font-medium text-ink">
            Phone <span className="text-charcoal-light">(optional)</span>
          </label>
          <input
            id={`${idPrefix}involved-phone`}
            name="phone"
            type="tel"
            className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.phone)}
            {...fieldA11yProps(`${idPrefix}involved-phone`, fieldErrors.phone)}
          />
          {fieldErrors.phone && (
            <p id={`${idPrefix}involved-phone-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.phone}
            </p>
          )}
        </div>

        {defaultInterest ? (
          <input type="hidden" name="interest" value={defaultInterest} />
        ) : (
          <div>
            <label htmlFor={`${idPrefix}involved-interest`} className="text-sm font-medium text-ink">
              I&apos;d Like To Help With <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${idPrefix}involved-interest`}
              name="interest"
              required
              defaultValue=""
              className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.interest)}
              {...fieldA11yProps(`${idPrefix}involved-interest`, fieldErrors.interest)}
            >
              <option value="" disabled>
                Select an option
              </option>
              {GET_INVOLVED_INTEREST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {fieldErrors.interest && (
              <p
                id={`${idPrefix}involved-interest-error`}
                role="alert"
                className="mt-1 text-xs font-medium text-red-700"
              >
                {fieldErrors.interest}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${idPrefix}involved-message`} className="text-sm font-medium text-ink">
          Tell Us a Little About Yourself <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${idPrefix}involved-message`}
          name="message"
          required
          rows={4}
          className={controlClassName(FORM_CONTROL_CLASS_COMPACT, fieldErrors.message)}
          {...fieldA11yProps(`${idPrefix}involved-message`, fieldErrors.message)}
        />
        {fieldErrors.message && (
          <p id={`${idPrefix}involved-message-error`} role="alert" className="mt-1 text-xs font-medium text-red-700">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <TurnstileWidget ref={turnstileRef} action="inquiry" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <FormSubmitButton
        disabled={submitDisabled}
        submitting={status === "submitting"}
        idleLabel="Count Me In"
        data-analytics-event="get_involved_signup"
      />
    </form>
  );
}
