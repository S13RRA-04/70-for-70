import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
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

/**
 * A "Campaign Partner" for public display/counting purposes — every public
 * "N Campaign Partners" stat and every general partner grid/wall should
 * filter through this, not re-derive the exclusion inline. Giveaway
 * supporters (22 For the 22 prize sponsors, partner_type:
 * "giveaway-supporter") are a distinct category shown only on the giveaway
 * page and prizes admin, not counted or displayed as a general campaign
 * partner — this was previously reimplemented ad hoc in three different
 * page files (and missed in a fourth), which is how the public "Campaign
 * Partners" count ended up disagreeing with itself across pages.
 */
export function isCampaignPartner(partner: MissionPartnerRow): boolean {
  return partner.partner_type !== "giveaway-supporter";
}

/**
 * Wrapped in React's cache() so a single request only hits Supabase once —
 * several pages (campaign-home, network) call this directly AND indirectly
 * via getFundraisingImpactStats(), which previously meant two independent
 * round trips to the same table within one render and, worse, a real risk
 * of the two calls landing on different underlying rows if the table
 * changed between them. See getJournalEntries() for the same pattern.
 */
export const getMissionPartners = cache(async (): Promise<MissionPartnerRow[]> => {
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
    logServerError("data.mission-partners: load failed, using seed", error);
    return [...SEED_MISSION_PARTNERS]
      .filter(isPubliclyEligible)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return data.filter(isPubliclyEligible);
});
