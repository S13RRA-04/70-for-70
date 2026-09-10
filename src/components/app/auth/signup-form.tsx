"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

type Status = "idle" | "submitting" | "error" | "check-email";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const str = (key: string) => String(data.get(key) ?? "").trim();

    const payload = {
      firstName: str("firstName"),
      lastName: str("lastName"),
      email: str("email"),
      password: String(data.get("password") ?? ""),
      city: str("city"),
      state: str("state"),
      phone: str("phone"),
      termsAccepted: data.get("termsAccepted") === "on",
      marketingConsent: data.get("marketingConsent") === "on",
    };

    try {
      const res = await fetch("/api/app/auth/signup", {
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

      if (json.needsEmailConfirmation) {
        setStatus("check-email");
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "check-email") {
    return (
      <div role="status" className="rounded-sm border border-olive/30 bg-olive/10 p-6 text-center">
        <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Check Your Email</p>
        <p className="mt-2 text-sm text-charcoal-light">
          We sent a confirmation link to finish setting up your account. Tap it, then come back and log in.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-display text-2xl font-semibold uppercase tracking-wide text-ink">
        Create Your Account
      </h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4" aria-busy={status === "submitting"}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="su-firstName" className="text-sm font-medium text-ink">
              First Name
            </label>
            <input id="su-firstName" name="firstName" type="text" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="su-lastName" className="text-sm font-medium text-ink">
              Last Name
            </label>
            <input id="su-lastName" name="lastName" type="text" required className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="su-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="su-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="su-password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="su-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-charcoal-light">At least 8 characters.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="su-city" className="text-sm font-medium text-ink">
              City
            </label>
            <input id="su-city" name="city" type="text" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="su-state" className="text-sm font-medium text-ink">
              State
            </label>
            <input id="su-state" name="state" type="text" required className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="su-phone" className="text-sm font-medium text-ink">
            Phone <span className="text-charcoal-light">(optional)</span>
          </label>
          <input id="su-phone" name="phone" type="tel" className={inputClass} />
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 text-sm text-ink">
            <input type="checkbox" name="termsAccepted" required className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
            <span>
              I agree to the{" "}
              <a href={`${SITE_URL}/terms`} target="_blank" rel="noopener noreferrer" className="text-bronze hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href={`${SITE_URL}/privacy`} target="_blank" rel="noopener noreferrer" className="text-bronze hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink">
            <input type="checkbox" name="marketingConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-bronze" />
            <span>Send me email updates about For the 22 (optional).</span>
          </label>
        </div>

        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {status === "submitting" ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-charcoal-light">
        Already have an account?{" "}
        <Link href="/app/login" className="font-semibold text-bronze hover:text-bronze-light">
          Log in
        </Link>
      </p>
    </div>
  );
}
