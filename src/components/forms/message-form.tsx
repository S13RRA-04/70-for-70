"use client";

import { FORM_CONTROL_CLASS_COMPACT, FormError, HoneypotField } from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

const MESSAGE_MAX_LENGTH = 500;

/**
 * The /messages cheer-board submission form. Posts to /api/messages, which
 * inserts with approved: false — a message only appears on the public board
 * once reviewed at /admin/messages. Same anti-spam stack (honeypot, minimum
 * fill time, per-IP rate limit, Turnstile) as every other public form.
 */
export function MessageForm() {
  const { status, errorMessage, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } = useFormSubmit({
    endpoint: "/api/messages",
    buildPayload: (data) => ({
      name: String(data.get("name") ?? ""),
      anonymous: data.get("anonymous") === "on",
      message: String(data.get("message") ?? ""),
    }),
  });

  if (status === "success") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-ink">
        <p className="font-display text-lg font-semibold uppercase tracking-wide">
          Message Received
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          Thanks for the support — it&apos;ll appear on the board once it&apos;s reviewed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      <HoneypotField id="message-companyWebsite" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="message-name" className="text-sm font-medium text-ink">
            Your Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="message-name"
            name="name"
            type="text"
            required
            maxLength={100}
            className={FORM_CONTROL_CLASS_COMPACT}
          />
        </div>

        <div className="flex items-end pb-2.5">
          <label htmlFor="message-anonymous" className="flex items-center gap-2 text-sm text-charcoal-light">
            <input id="message-anonymous" name="anonymous" type="checkbox" className="h-4 w-4" />
            Post as Anonymous
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="message-message" className="text-sm font-medium text-ink">
          Your Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message-message"
          name="message"
          required
          rows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Cheer him on, share a quote, or leave a word of support..."
          className={FORM_CONTROL_CLASS_COMPACT}
        />
      </div>

      <TurnstileWidget ref={turnstileRef} action="message" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <button
        type="submit"
        disabled={submitDisabled}
        data-analytics-event="message_board_submit"
        className="w-full rounded-sm bg-bronze-text px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Post Message"}
      </button>
    </form>
  );
}
