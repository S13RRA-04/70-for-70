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

/**
 * The reverse lookup — every bike-build component row whose notes credit a
 * given partner by name, for that partner's own profile page
 * (/network/partners/[slug]) to show what it actually backed. Same
 * best-effort substring match as findProvidingPartner, just read in the
 * other direction; a partner with zero matches (true for almost everyone
 * outside the Tri bike build) simply renders nothing.
 */
export function findBackedComponents(partnerName: string, rows: BikeBuildComponentRow[]): BikeBuildComponentRow[] {
  if (partnerName.length <= 2) return [];
  const needle = partnerName.toLowerCase();
  return rows.filter(
    (row) => (row.status === "confirmed" || row.status === "complete") && (row.notes?.toLowerCase().includes(needle) ?? false),
  );
}
