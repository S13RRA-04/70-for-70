import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cookie-free anon-key client for public, unauthenticated reads (campaign,
 * miles, partners, posts, sponsors, verified donations — everything RLS
 * grants to the `anon` role identically regardless of session). Unlike
 * `supabase/server.ts`'s client, this never touches `next/headers` cookies,
 * so it's safe to call from anywhere, including `generateStaticParams` and
 * other build-time-only contexts where no request/cookie store exists.
 */
export function createPublicClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
