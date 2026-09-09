import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CURRENT_EVENT_SLUG } from "@/lib/content/22-for-the-22";
import { SEED_EVENT_CONFIG } from "./seed-data";
import type { EventConfigRow } from "@/types/database";

export async function getEventConfig(eventSlug: string): Promise<EventConfigRow | null> {
  if (!isSupabaseConfigured()) {
    return eventSlug === SEED_EVENT_CONFIG.event_slug ? SEED_EVENT_CONFIG : null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("event_config")
    .select("*")
    .eq("event_slug", eventSlug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load event config, falling back to seed data:", error);
    return eventSlug === SEED_EVENT_CONFIG.event_slug ? SEED_EVENT_CONFIG : null;
  }

  return data ?? null;
}

/** The current live/upcoming "22 For the 22" instance — see CURRENT_EVENT_SLUG. */
export async function getCurrentEventConfig(): Promise<EventConfigRow | null> {
  return getEventConfig(CURRENT_EVENT_SLUG);
}
