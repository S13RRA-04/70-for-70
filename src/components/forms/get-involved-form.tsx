"use client";

import { useEffect, useRef, useState } from "react";
import { GET_INVOLVED_INTEREST_TYPES } from "@/lib/validation/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * /get-involved's volunteer sign-up — reuses the same /api/inquiries
 * pipeline as sponsor/contact inquiries (rate limiting, honeypot,
 * admin-visible queue) rather than standing up a second one. See
 * GET_INVOLVED_INTEREST_TYPES.
 */
export function GetInvolvedForm() {
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
      organization: "",
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? ""),
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/inquiries", {
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
          You&apos;re In
        </p>
        <p className="mt-1 text-sm text-charcoal-light">
          Thanks for signing up. We&apos;ll follow up with details as race weekend gets closer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      {/* Honeypot field — hidden from sighted users, left blank by real people. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="involved-companyWebsite">Leave this field blank</label>
        <input
          type="text"
          id="involved-companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="involved-name" className="text-sm font-medium text-ink">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="involved-name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        <div>
          <label htmlFor="involved-email" className="text-sm font-medium text-ink">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="involved-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        <div>
          <label htmlFor="involved-phone" className="text-sm font-medium text-ink">
            Phone <span className="text-charcoal-light">(optional)</span>
          </label>
          <input
            id="involved-phone"
            name="phone"
            type="tel"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        <div>
          <label htmlFor="involved-interest" className="text-sm font-medium text-ink">
            I&apos;d Like To Help With <span aria-hidden="true">*</span>
          </label>
          <select
            id="involved-interest"
            name="interest"
            required
            defaultValue=""
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
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
        </div>
      </div>

      <div>
        <label htmlFor="involved-message" className="text-sm font-medium text-ink">
          Tell Us a Little About Yourself <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="involved-message"
          name="message"
          required
          rows={4}
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
        data-analytics-event="get_involved_signup"
        className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Count Me In"}
      </button>
    </form>
  );
}
