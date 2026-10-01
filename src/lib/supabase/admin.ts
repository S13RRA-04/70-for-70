import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireAdminConfig } from "./config";

/**
 * Service-role client. Bypasses RLS — never import this from a Client
 * Component or expose SUPABASE_SERVICE_ROLE_KEY via a NEXT_PUBLIC_ var.
 * Used only by trusted server code, e.g. the inquiries API route.
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = requireAdminConfig();

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
