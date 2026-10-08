import { getCampaign } from "./campaign";
import { getMissionPartners, isCampaignPartner } from "./mission-partners";
import { getPartners } from "./partners";
import { getVerifiedDonationCount } from "./donations";
import { getAllocationBreakdown } from "./allocation";
import { getMilesFundedMetric } from "../miles-funded";
import { getDaysToRace } from "../campaign-phase";

/**
 * The single shared campaign-data source — the "triCampaign" object the
 * credibility plan calls for. Every public-facing campaign number
 * (homepage status bar, journal strip, /campaigns, /donate,
 * /the-race, ruck-home, and the future Network/Impact/Press pages) must
 * read from this getter rather than re-deriving or hardcoding the same
 * figures in components, so one page can never show a different raised
 * total, goal, partner count, or countdown than another.
 *
 * Provenance of each field — nothing here is hand-entered:
 * - amountRaised: public.campaign.amount_raised, which the admin donation
 *   flow recomputes from verified donations (admin/donations/actions.ts);
 *   reconciles with the sum of beneficiaryTotals.
 * - fundraisingGoal: public.campaign.fundraising_goal (shared $70K Mission).
 * - partnerCount: active mission_partners rows, excluding giveaway-only
 *   supporters (see isCampaignPartner) — the sponsor/partner wall count.
 * - beneficiaryCount/beneficiaryTotals: active partners rows (who the
 *   campaigns support) and verified donations grouped by
 *   organization_benefited — null-policy-safe, empty when unavailable.
 * - daysToRace: derived from RACE_INFO.raceDate; null before the date is
 *   confirmed or after race day — never a guessed 0.
 * - supporterCount: count of verified donations.
 * - milesFunded/milesTotal: derived from the fundraising total via
 *   getMilesFundedMetric(), not the legacy `miles` table — see that
 *   module's comment for why.
 */
export interface FundraisingImpactStats {
  /** Shared $70K Mission total raised to date. */
  amountRaised: number;
  /** Shared $70K Mission goal. */
  fundraisingGoal: number;
  /** Verified donations made. */
  supporterCount: number;
  /** Active campaign/partner organizations (partner wall). */
  partnerCount: number;
  /** Active beneficiary organizations currently supported. */
  beneficiaryCount: number;
  /** Per-organization split of amountRaised from verified donations. */
  beneficiaryTotals: { organization: string; amount: number }[];
  /** Countdown source for every page — derived once from RACE_INFO.raceDate. */
  daysToRace: number | null;
  milesFunded: number;
  milesTotal: number;
  /** Timestamp of the canonical campaign totals used by organization-wide freshness labels. */
  updatedAt: string;
}

export async function getFundraisingImpactStats(): Promise<FundraisingImpactStats> {
  const [campaign, missionPartners, supporterCount, beneficiaries] = await Promise.all([
    getCampaign(),
    getMissionPartners(),
    getVerifiedDonationCount(),
    getPartners(),
  ]);
  const allocation = await getAllocationBreakdown(campaign);

  const miles = getMilesFundedMetric(campaign.amount_raised, campaign.fundraising_goal);

  return {
    amountRaised: campaign.amount_raised,
    fundraisingGoal: campaign.fundraising_goal,
    supporterCount,
    partnerCount: missionPartners.filter(isCampaignPartner).length,
    beneficiaryCount: beneficiaries.length,
    beneficiaryTotals: allocation?.byOrganization ?? [],
    daysToRace: getDaysToRace(),
    milesFunded: miles.milesFunded,
    milesTotal: miles.totalDistance,
    updatedAt: campaign.updated_at,
  };
}
