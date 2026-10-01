import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicConfig } from "./config";

/**
 * Server client for Server Components, Server Actions, and Route Handlers.
 * Reads/writes cookies for session-based auth (used by the admin area);
 * public data reads work the same without a session, subject to RLS.
 */
export async function createClient() {
  const { url, anonKey } = requirePublicConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that can't set cookies; safe to
          // ignore because middleware/proxy refreshes the session instead.
        }
      },
    },
  });
}
