import { redirect } from "next/navigation";

/**
 * Retired — publicly listing commercial/in-kind supporters (this page
 * rendered ISM Saddles via the mission_partners table, which has no
 * ethics-clearance gate) requires the same SecD/OAE approval as any other
 * commercial-supporter recognition. Only sponsors.ethics_cleared === true
 * may ever be publicly rendered — see src/lib/data/sponsors.ts. Content
 * preserved in git history; the mission_partners row this page read from
 * has been deactivated, not deleted.
 */
export default function CampaignSupportersPage() {
  redirect("/beneficiaries");
}
