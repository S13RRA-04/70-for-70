"use client";

import { useEffect, useRef, useState } from "react";
import { JOIN_INTEREST_TYPES } from "@/lib/validation/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * "Join the Movement" interest form — reuses the same /api/inquiries
 * pipeline as sponsor inquiries (rate limiting, honeypot, admin-visible
 * queue) rather than standing up a second one just to collect interest
 * before onboarding actually opens. See JOIN_INTEREST_TYPES.
 */
export function JoinInterestForm() {
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
      phone: "",
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
          Thanks for your interest. Onboarding isn&apos;t open yet — we&apos;ll reach out as the
          movement grows.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={status === "submitting"}>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="join-companyWebsite">Leave this field blank</label>
        <input
          type="text"
          id="join-companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="join-name" className="text-sm font-medium text-ink">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="join-name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          />
        </div>

        <div>
          <label htmlFor="join-email" className="text-sm font-medium text-ink">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="join-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
          />
        </div>
      </div>

      <div>
        <label htmlFor="join-interest" className="text-sm font-medium text-ink">
          I&apos;m Interested As <span aria-hidden="true">*</span>
        </label>
        <select
          id="join-interest"
          name="interest"
          required
          defaultValue=""
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
        >
          <option value="" disabled>
            Select an option
          </option>
          {JOIN_INTEREST_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="join-message" className="text-sm font-medium text-ink">
          Tell Us a Little About Yourself <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="join-message"
          name="message"
          required
          rows={4}
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
        />
        <p className="mt-1.5 text-xs text-charcoal-light">
          Please don&apos;t include medical records, Social Security numbers, detailed diagnoses,
          or other sensitive personal information.
        </p>
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        data-analytics-event="join_interest"
        className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Count Me In"}
      </button>
    </form>
  );
}
