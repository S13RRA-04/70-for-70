"use client";

import { FormError, HoneypotField } from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

/**
 * `tone` describes the surface this form is embedded in, not the button. The
 * submit fill has to differ per surface: on light backgrounds the fill is
 * darkened so off-white label text clears 4.5:1, while on dark backgrounds the
 * fill keeps its lighter bronze and the label switches to ink, because a
 * darkened fill would fall below the 3:1 boundary against the dark band.
 */
export function EmailSignupForm({ tone = "light" }: { tone?: "dark" | "light" }) {
  const { status, errorMessage, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } = useFormSubmit({
    endpoint: "/api/subscribe",
    buildPayload: (data) => ({
      firstName: String(data.get("firstName") ?? ""),
      email: String(data.get("email") ?? ""),
    }),
  });

  if (status === "success") {
    return (
      <p role="status" className="text-sm font-medium text-olive">
        You&apos;re in. Thanks for following along.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-start gap-3">
      <HoneypotField id="signup-companyWebsite" />

      <label className="sr-only" htmlFor="signup-firstName">
        First Name
      </label>
      <input
        id="signup-firstName"
        name="firstName"
        type="text"
        placeholder="First name"
        required
        className="w-36 rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
      />

      <label className="sr-only" htmlFor="signup-email">
        Email
      </label>
      <input
        id="signup-email"
        name="email"
        type="email"
        placeholder="Email address"
        required
        className="w-52 rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
      />

      <TurnstileWidget
        ref={turnstileRef}
        action="email_signup"
        onToken={setTurnstileToken}
        className="min-w-0"
      />

      <button
        type="submit"
        disabled={submitDisabled}
        data-analytics-event="mailing_list_signup"
        className={
          tone === "dark"
            ? "rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-bronze-light disabled:opacity-60"
            : "rounded-sm bg-bronze-text px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark disabled:opacity-60"
        }
      >
        {status === "submitting" ? "Submitting..." : "Follow Campaign Updates"}
      </button>

      <FormError message={status === "error" ? errorMessage : null} />
    </form>
  );
}
