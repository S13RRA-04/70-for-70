import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_CAMPAIGN } from "./seed-data";
import type { CampaignRow } from "@/types/database";

export async function getCampaign(): Promise<CampaignRow> {
  if (!isSupabaseConfigured()) {
    return SEED_CAMPAIGN;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Failed to load campaign, falling back to seed data:", error);
    return SEED_CAMPAIGN;
  }

  return data;
}
