import "server-only";

import { MOVEMENT_CAMPAIGNS, isCurrentCampaign } from "@/lib/constants";
import { RESOURCES } from "@/lib/content/resources";
import { getFundraisingImpactStats } from "./fundraising-impact";

export interface MissionMetrics {
  resources: number | null;
  resourceCategories: number | null;
  statesRepresented: number | null;
  nationalResources: number | null;
  activeCampaigns: number | null;
  beneficiaries: number | null;
  campaignPartners: number | null;
  totalRaised: number | null;
  fundraisingGoal: number | null;
  supporters: number | null;
  lastUpdated: string;
}

/**
 * Organization-wide metrics used by Home, Network, Impact, Press, and other
 * parent-site surfaces. Unknown values stay null; a real measured zero stays
 * zero, so callers never imply that unavailable data was measured.
 */
export async function getMissionMetrics(): Promise<MissionMetrics> {
  const fundraising = await getFundraisingImpactStats();
  const categories = new Set<string>();
  const states = new Set<string>();
  let nationalResources = 0;

  for (const resource of RESOURCES) {
    resource.needCategoryIds.forEach((category) => categories.add(category));
    if (resource.state) states.add(resource.state);
    else nationalResources += 1;
  }

  return {
    resources: RESOURCES.length,
    resourceCategories: categories.size,
    statesRepresented: states.size,
    nationalResources,
    activeCampaigns: MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign).length,
    beneficiaries: fundraising.beneficiaryCount,
    campaignPartners: fundraising.partnerCount,
    totalRaised: fundraising.amountRaised,
    fundraisingGoal: fundraising.fundraisingGoal,
    supporters: fundraising.supporterCount,
    lastUpdated: fundraising.updatedAt,
  };
}

export function presentMetrics<T extends Record<string, number | null>>(metrics: T) {
  return Object.entries(metrics).filter((entry): entry is [keyof T & string, number] => entry[1] !== null);
}
