import { getCampaign } from "./campaign";
import { getMissionPartners } from "./mission-partners";
import { getVerifiedDonationCount } from "./donations";
import { getMilesFundedMetric } from "../miles-funded";

/**
 * Compact "is this campaign actually working" snapshot — $ raised,
 * supporters, partners, miles funded — for /journal's fundraising impact
 * strip. Every field is a real count already backing some other page on
 * the site (campaign.amount_raised on /live and /campaign-home, verified
 * donations on /admin/donations, mission_partners on /sponsors) — nothing
 * computed just for this strip.
 *
 * milesFunded/milesTotal are derived from the fundraising total via
 * getMilesFundedMetric(), not the `miles` table — that table only fed the
 * now-retired /fund-a-mile flow and stays permanently near 0 regardless of
 * real donations. The `miles` table itself is still used by the admin
 * donation-tagging UI, just not as the public "miles funded" source.
 */
export interface FundraisingImpactStats {
  amountRaised: number;
  fundraisingGoal: number;
  supporterCount: number;
  partnerCount: number;
  milesFunded: number;
  milesTotal: number;
}

export async function getFundraisingImpactStats(): Promise<FundraisingImpactStats> {
  const [campaign, partners, supporterCount] = await Promise.all([
    getCampaign(),
    getMissionPartners(),
    getVerifiedDonationCount(),
  ]);

  const miles = getMilesFundedMetric(campaign.amount_raised, campaign.fundraising_goal);

  return {
    amountRaised: campaign.amount_raised,
    fundraisingGoal: campaign.fundraising_goal,
    supporterCount,
    partnerCount: partners.length,
    milesFunded: miles.milesFunded,
    milesTotal: miles.totalDistance,
  };
}
