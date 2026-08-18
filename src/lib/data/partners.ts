import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_PARTNERS } from "./seed-data";
import type { PartnerRow } from "@/types/database";

export async function getPartners(): Promise<PartnerRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_PARTNERS.filter((p) => p.active);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("Failed to load partners, falling back to seed data:", error);
    return SEED_PARTNERS.filter((p) => p.active);
  }

  return data;
}
