import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logServerWarn } from "@/lib/log";
import { addContactToAudience } from "@/lib/email/resend";

/**
 * Durably records the signup first (so nothing is lost even if the provider
 * call below fails), then syncs it to the Resend Audience configured via
 * RESEND_AUDIENCE_ID. `synced_to_provider` reflects whether that sync
 * actually succeeded, not just whether a provider is configured — rows that
 * land here before RESEND_AUDIENCE_ID exists stay `false` and can be
 * backfilled later via a one-off script over unsynced rows.
 */
export async function subscribeToUpdates(firstName: string, email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    logServerWarn("email-list: not persisted (Supabase not configured)", { email });
    return;
  }

  const synced = await addContactToAudience({ email, firstName });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("email_subscribers")
    .upsert({ first_name: firstName, email, synced_to_provider: synced }, { onConflict: "email" });

  if (error) {
    throw new Error(`Failed to record email signup: ${error.message}`);
  }
}
