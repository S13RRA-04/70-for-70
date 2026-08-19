import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_SPONSORS } from "./seed-data";
import type { SponsorRow } from "@/types/database";

export async function getSponsors(): Promise<SponsorRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_SPONSORS]
      .filter((s) => s.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load sponsors, falling back to seed data:", error);
    return [...SEED_SPONSORS]
      .filter((s) => s.active)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return data;
}
