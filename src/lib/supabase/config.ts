export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The site renders from bundled seed data whenever Supabase isn't configured,
 * so local development and design review work before a project is wired up.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

const MISSING_PUBLIC_CONFIG =
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

/**
 * The anon-key config every public, session-less client needs, or a thrown
 * error. Single source of truth for that message — `public.ts`, `client.ts`
 * and `server.ts` each used to carry their own copy.
 */
export function requirePublicConfig(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(MISSING_PUBLIC_CONFIG);
  }

  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

/** Service-role config, for the RLS-bypassing admin client. Server-only by nature. */
export function requireAdminConfig(): { url: string; serviceRoleKey: string } {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { url: SUPABASE_URL, serviceRoleKey };
}
