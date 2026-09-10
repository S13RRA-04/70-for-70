"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

export function ResetPasswordForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();

    try {
      await fetch("/api/app/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      // Always show the same confirmation — never reveal whether an account exists.
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-center">
        <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Check Your Email</p>
        <p className="mt-2 text-sm text-charcoal-light">
          If an account exists for that email, a password reset link is on its way.
        </p>
        <Link href="/app/login" className="mt-4 inline-block text-sm font-semibold text-bronze hover:text-bronze-light">
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-display text-2xl font-semibold uppercase tracking-wide text-ink">
        Reset Password
      </h1>
      <p className="mt-2 text-center text-sm text-charcoal-light">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4" aria-busy={status === "submitting"}>
        <div>
          <label htmlFor="rp-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="rp-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/app/login" className="text-bronze hover:text-bronze-light">
          Back to Log In
        </Link>
      </p>
    </div>
  );
}
