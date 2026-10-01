import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requirePublicConfig } from "./config";

/**
 * Cookie-free anon-key client for public, unauthenticated reads (campaign,
 * miles, partners, posts, sponsors, verified donations — everything RLS
 * grants to the `anon` role identically regardless of session). Unlike
 * `supabase/server.ts`'s client, this never touches `next/headers` cookies,
 * so it's safe to call from anywhere, including `generateStaticParams` and
 * other build-time-only contexts where no request/cookie store exists.
 */
export function createPublicClient() {
  const { url, anonKey } = requirePublicConfig();

  return createSupabaseClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
