import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import type { User } from "@supabase/supabase-js";

/**
 * Redirects to /app/login unless a Supabase session user is present. Unlike
 * requireAdminUser(), any authenticated user passes — there's no allowlist,
 * since the whole point of the app is open self-signup. Used by every page
 * under src/app/app/(tabs) (see that layout).
 */
export async function requireParticipant(): Promise<User> {
  if (!isSupabaseConfigured()) {
    redirect("/app/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/app/login");
  }

  return user;
}

/** Non-redirecting variant for pages/layouts that render differently when signed out rather than bouncing (e.g. the Home tab). */
export async function getOptionalParticipant(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
