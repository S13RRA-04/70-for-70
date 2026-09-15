import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_MISSION_PARTNERS } from "./seed-data";
import type { MissionPartnerRow } from "@/types/database";

/**
 * DH Solutions' proposed print support was never finalized — excluded here
 * (the single shared fetch every consumer of mission partners goes through)
 * rather than per-page, so it never surfaces anywhere on the site even if a
 * stale row still exists in production. Remove this once the row itself is
 * deleted/deactivated at the source.
 */
const EXCLUDED_PARTNER_NAMES = new Set(["dh solutions"]);

function isPubliclyEligible(partner: MissionPartnerRow): boolean {
  return partner.active && !EXCLUDED_PARTNER_NAMES.has(partner.name.trim().toLowerCase());
}

export async function getMissionPartners(): Promise<MissionPartnerRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_MISSION_PARTNERS]
      .filter(isPubliclyEligible)
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
      .filter(isPubliclyEligible)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return data.filter(isPubliclyEligible);
}
