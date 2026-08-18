"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailSignupForm() {
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
      firstName: String(data.get("firstName") ?? ""),
      email: String(data.get("email") ?? ""),
      companyWebsite: String(data.get("companyWebsite") ?? ""),
      renderedAt: renderedAtRef.current ?? Date.now(),
    };

    try {
      const res = await fetch("/api/subscribe", {
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
      <p role="status" className="text-sm font-medium text-olive">
        You&apos;re in. Thanks for following along.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-start gap-3">
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="signup-companyWebsite">Leave this field blank</label>
        <input
          type="text"
          id="signup-companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="sr-only" htmlFor="signup-firstName">
        First Name
      </label>
      <input
        id="signup-firstName"
        name="firstName"
        type="text"
        placeholder="First name"
        required
        className="w-36 rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
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
        className="w-52 rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze"
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        data-analytics-event="mailing_list_signup"
        className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light disabled:opacity-60"
      >
        {status === "submitting" ? "Joining..." : "Join the Mission"}
      </button>

      {status === "error" && errorMessage && (
        <p role="alert" className="w-full text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
