import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Provider-abstracted signup capture. No email-sending infrastructure is
 * built here — this only durably records the signup (so nothing is lost)
 * and marks it for sync once a real provider (Mailchimp, ConvertKit,
 * Buttondown, etc.) is chosen. Swap the "TODO" block for that provider's
 * API call; nothing else needs to change.
 */
export async function subscribeToUpdates(firstName: string, email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn("Email signup received but Supabase is not configured; not persisted:", email);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("email_subscribers")
    .upsert({ first_name: firstName, email, synced_to_provider: false }, { onConflict: "email" });

  if (error) {
    throw new Error(`Failed to record email signup: ${error.message}`);
  }

  // TODO: no email provider configured yet. Once one is chosen, sync this
  // subscriber to it here (or via a scheduled job over unsynced rows) and
  // set synced_to_provider = true.
}
