"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";
  const linkExpired = searchParams.get("error") === "link_expired";

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/app/auth/login", {
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

      router.push(next);
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1 className="text-center font-display text-2xl font-semibold uppercase tracking-wide text-ink">Log In</h1>

      {linkExpired && (
        <p className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          That link has expired. Please log in, or request a new password reset.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4" aria-busy={status === "submitting"}>
        <div>
          <label htmlFor="login-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input id="login-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="login-password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
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
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {status === "submitting" ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <Link href="/app/reset-password" className="text-bronze hover:text-bronze-light">
          Forgot your password?
        </Link>
        <p className="text-charcoal-light">
          New here?{" "}
          <Link href="/app/signup" className="font-semibold text-bronze hover:text-bronze-light">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
