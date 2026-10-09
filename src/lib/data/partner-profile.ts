import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { SITE_URL } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { MissionPartnerRow, PartnerRow } from "@/types/database";

export type PartnerProfile =
  | { kind: "beneficiary"; partner: PartnerRow }
  | { kind: "mission"; partner: MissionPartnerRow };

/**
 * The profile URL for a partner, derived from its name (see
 * getPartnerProfileBySlug for why there's no stored slug column). Always
 * absolute, built from SITE_URL — /network only exists on the org host, but
 * the components that link here (MissionPartnerCard, PartnerLogoDisclosure,
 * PresentingPartnerFeature) also render on campaign hosts like
 * tri.forthe22.org (e.g. /sponsors), where a relative /network/... link
 * would force an extra middleware redirect hop across hosts — see AGENTS.md
 * on cross-domain links.
 */
export function partnerProfileHref(name: string): string {
  return `${SITE_URL}/network/partners/${slugify(name)}`;
}

/**
 * Looks a partner up by its derived slug across both partner tables — a
 * beneficiary (public.partners) and a mission partner (public.mission_partners)
 * are different relationships with no shared id space — for
 * /network/partners/[slug]. Neither table has a slug column; matching on
 * slugify(name) keeps this route working with zero schema change, the same
 * best-effort name-based approach partner-matching.ts already uses to link
 * a bike-build component to the partner who provided it.
 */
export async function getPartnerProfileBySlug(slug: string): Promise<PartnerProfile | null> {
  const [beneficiaries, missionPartners] = await Promise.all([getPartners(), getMissionPartners()]);

  const beneficiary = beneficiaries.find((p) => slugify(p.name) === slug);
  if (beneficiary) return { kind: "beneficiary", partner: beneficiary };

  const missionPartner = missionPartners.find((p) => slugify(p.name) === slug);
  if (missionPartner) return { kind: "mission", partner: missionPartner };

  return null;
}
