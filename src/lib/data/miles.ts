import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_MILES } from "./seed-data";
import type { MileRow } from "@/types/database";

export async function getMiles(): Promise<MileRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_MILES;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("miles")
    .select("*")
    .order("mile_number", { ascending: true });

  if (error || !data) {
    console.error("Failed to load miles, falling back to seed data:", error);
    return SEED_MILES;
  }

  return data;
}
