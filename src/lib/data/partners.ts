import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_PARTNERS } from "./seed-data";
import type { PartnerRow } from "@/types/database";

export async function getPartners(): Promise<PartnerRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_PARTNERS.filter((p) => p.active);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error || !data) {
    logServerError("data.partners: load failed, using seed", error);
    return SEED_PARTNERS.filter((p) => p.active);
  }

  return data;
}
