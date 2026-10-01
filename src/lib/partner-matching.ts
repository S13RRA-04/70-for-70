import type { MissionPartnerRow } from "@/types/database";
import type { BikeBuildComponentRow } from "@/types/bike-build";

/**
 * Best-effort match of a confirmed/complete component row to the partner
 * who provided it, by scanning the row's free-text notes for a known
 * partner name — there's no structured link between component-status rows
 * (gear needs, bike-build) and mission_partners. Returns null for anything
 * not yet secured or with no matching partner. Shared by /sponsors' current
 * gear needs tracker and /journal/building-the-bike's component board so
 * the matching logic has one definition.
 */
export function findProvidingPartner(row: BikeBuildComponentRow, partners: MissionPartnerRow[]): MissionPartnerRow | null {
  if (row.status !== "confirmed" && row.status !== "complete") return null;
  const notes = row.notes?.toLowerCase() ?? "";
  return partners.find((p) => p.name.length > 2 && notes.includes(p.name.toLowerCase())) ?? null;
}
