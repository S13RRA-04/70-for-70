"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGE_MAX_LENGTH = 500;

/**
 * The /messages cheer-board submission form. Posts to /api/messages, which
 * inserts with approved: false — a message only appears on the public board
 * once reviewed at /admin/messages. Same anti-spam stack (honeypot, minimum
 * fill time, per-IP rate limit) as every other public form on this site.
 */
export function MessageForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderedAtRef = useRef<number | null>(null);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      anonymous: data.get("anonymous") === "on",
      message: String(data.get("message") ?? ""),
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/messages", {
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
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

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
      {/* Honeypot field — hidden from sighted users, left blank by real people. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="message-companyWebsite">Leave this field blank</label>
        <input
          type="text"
          id="message-companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

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
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
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
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
        />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        data-analytics-event="message_board_submit"
        className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Post Message"}
      </button>
    </form>
  );
}
