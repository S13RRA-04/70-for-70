import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_MISSION_PARTNERS } from "./seed-data";
import type { MissionPartnerRow } from "@/types/database";

export async function getMissionPartners(): Promise<MissionPartnerRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_MISSION_PARTNERS]
      .filter((p) => p.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("mission_partners")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load mission partners, falling back to seed data:", error);
    return [...SEED_MISSION_PARTNERS]
      .filter((p) => p.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return data;
}
