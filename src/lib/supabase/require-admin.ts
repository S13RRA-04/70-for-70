import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

/**
 * Comma-separated allowlist — the actual authorization boundary for
 * /admin. A valid Supabase session alone isn't enough: if the project's
 * Auth "allow signups" setting is ever on, anyone could self-register with
 * the anon key already shipped to the browser and pass a bare
 * `auth.getUser()` check. This allowlist is what stops that account from
 * reaching anything.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** Redirects to /admin/login unless a Supabase session user is present AND allowlisted in ADMIN_EMAILS. */
export async function requireAdminUser() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAllowedAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

  if (!isAllowedAdmin) {
    // A logged-in-but-not-allowlisted session (e.g. self-signup) is
    // actively signed out rather than just bounced, so it can't keep
    // retrying /admin with a session that will never pass this check.
    if (user) await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return user!;
}
