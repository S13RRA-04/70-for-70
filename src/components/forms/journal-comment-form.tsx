"use client";

import { FormError, HoneypotField } from "@/components/forms/form-parts";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { useFormSubmit } from "@/components/forms/use-form-submit";

const COMMENT_MAX_LENGTH = 1000;

/**
 * A journal entry's comment submission form. Posts to /api/journal-comments,
 * which inserts with approved: false — a comment only appears on the post
 * once reviewed at /admin/journal-comments. Same anti-spam stack (honeypot,
 * minimum fill time, per-IP rate limit, Turnstile) as every other public
 * form — see MessageForm for the sibling pattern this follows.
 */
export function JournalCommentForm({ journalEntryId }: { journalEntryId: string }) {
  const { status, errorMessage, setTurnstileToken, turnstileRef, handleSubmit, submitDisabled } = useFormSubmit({
    endpoint: "/api/journal-comments",
    buildPayload: (data) => ({
      journalEntryId,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      body: String(data.get("body") ?? ""),
    }),
  });

  if (status === "success") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-ink">
        <p className="font-display text-lg font-semibold uppercase tracking-wide">Comment Received</p>
        <p className="mt-1 text-sm text-charcoal-light">
          Thanks for reading — it&apos;ll appear here once it&apos;s reviewed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      <HoneypotField id="journal-comment-companyWebsite" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="journal-comment-name" className="text-sm font-medium text-ink">
            Your Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="journal-comment-name"
            name="name"
            type="text"
            required
            maxLength={100}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        <div>
          <label htmlFor="journal-comment-email" className="text-sm font-medium text-ink">
            Email <span className="text-charcoal-light">(optional, never shown publicly)</span>
          </label>
          <input
            id="journal-comment-email"
            name="email"
            type="email"
            maxLength={320}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="journal-comment-body" className="text-sm font-medium text-ink">
          Your Comment <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="journal-comment-body"
          name="body"
          required
          rows={4}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder="Share your thoughts on this update..."
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
        />
      </div>

      <TurnstileWidget ref={turnstileRef} action="journal_comment" onToken={setTurnstileToken} />

      <FormError message={status === "error" ? errorMessage : null} />

      <button
        type="submit"
        disabled={submitDisabled}
        data-analytics-event="journal_comment_submit"
        className="w-full rounded-sm bg-bronze-text px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
