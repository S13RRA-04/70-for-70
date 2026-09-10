"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-base text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") ?? "");

    try {
      const res = await fetch("/api/app/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/app");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1 className="text-center font-display text-2xl font-semibold uppercase tracking-wide text-ink">
        Set a New Password
      </h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4" aria-busy={status === "submitting"}>
        <div>
          <label htmlFor="up-password" className="text-sm font-medium text-ink">
            New Password
          </label>
          <input
            id="up-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-charcoal-light">At least 8 characters.</p>
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
          {status === "submitting" ? "Saving..." : "Save Password"}
        </button>
      </form>
    </div>
  );
}
