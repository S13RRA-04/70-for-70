import { createBrowserClient } from "@supabase/ssr";
import { requirePublicConfig } from "./config";

/** Browser client for Client Components. Only ever uses the public anon key. */
export function createClient() {
  const { url, anonKey } = requirePublicConfig();

  return createBrowserClient(url, anonKey);
}
