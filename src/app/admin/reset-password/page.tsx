"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Container } from "@/components/shared/container";

/**
 * Landing page for a Supabase password-recovery email link. Deliberately
 * ungated (no requireAdminUser()) — the recovery session only exists in
 * the browser (Supabase sets it from the URL fragment on page load, same
 * pattern as /admin/login not being gated), so a server-side auth check
 * here would just bounce the visitor before that session is established.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <Container className="max-w-md py-20">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Admin</h1>
        <p className="mt-3 text-sm text-charcoal-light">
          Supabase is not configured for this environment.
        </p>
      </Container>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(
        error.message === "Auth session missing"
          ? "This reset link is invalid or has expired. Request a new one from the sign-in page."
          : error.message,
      );
      setPending(false);
      return;
    }

    setDone(true);
    setPending(false);
  }

  if (done) {
    return (
      <Container className="max-w-md py-20">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">
          Password Updated
        </h1>
        <p className="mt-3 text-sm text-charcoal-light">
          Your admin password has been changed.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="mt-6 w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
        >
          Go to Admin
        </button>
      </Container>
    );
  }

  return (
    <Container className="max-w-md py-20">
      <h1 className="font-display text-2xl font-semibold uppercase text-ink">Set New Password</h1>
      <p className="mt-2 text-sm text-charcoal-light">
        Choose a new password for your admin account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light disabled:opacity-60"
        >
          {pending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </Container>
  );
}
