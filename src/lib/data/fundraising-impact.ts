import { getCampaign } from "./campaign";
import { getMiles } from "./miles";
import { getMissionPartners } from "./mission-partners";
import { getVerifiedDonationCount } from "./donations";

/**
 * Compact "is this campaign actually working" snapshot — $ raised,
 * supporters, partners, miles funded — for /journal's fundraising impact
 * strip. Every field is a real count already backing some other page on
 * the site (campaign.amount_raised on /live and /campaign-home, verified
 * donations on /admin/donations, mission_partners on /sponsors, funded
 * miles on the mile grid) — nothing computed just for this strip.
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
  const [campaign, miles, partners, supporterCount] = await Promise.all([
    getCampaign(),
    getMiles(),
    getMissionPartners(),
    getVerifiedDonationCount(),
  ]);

  return {
    amountRaised: campaign.amount_raised,
    fundraisingGoal: campaign.fundraising_goal,
    supporterCount,
    partnerCount: partners.length,
    milesFunded: miles.filter((mile) => mile.status === "funded").length,
    milesTotal: miles.length,
  };
}
