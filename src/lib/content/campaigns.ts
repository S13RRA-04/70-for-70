/**
 * Content for /campaigns — the giving channels that live beyond the
 * campaign cards themselves. The four current campaigns are data in
 * MOVEMENT_CAMPAIGNS (src/lib/constants.ts), so only their complementary
 * channels (auctions, merchandise, sponsorships, direct giving) are kept
 * here to avoid repeating the same campaigns twice on one page. Formerly
 * the /70k page's CONTRIBUTION_MECHANISMS, folded into /campaigns.
 */

import { CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";

export interface ContributionMechanism {
  name: string;
  description: string;
  href?: string;
  external?: boolean;
}

/**
 * Qualitative list of what contributes to the shared goal — deliberately no
 * per-item dollar figures. There's no per-campaign donation-attribution
 * column in the data model (see public.campaign — a single aggregate row),
 * so breaking this down into real per-campaign dollar totals would be
 * fabricated, not reported. See README's "Eliminating Placeholder Content."
 */
export const CONTRIBUTION_MECHANISMS: ContributionMechanism[] = [
  {
    name: "Silent Auctions",
    description: "Donated items and experiences auctioned at campaign events, proceeds going directly to the mission.",
  },
  {
    name: "Merchandise",
    description: "Apparel and gear sold through the campaign's fundraising store.",
    href: `${CAMPAIGN_URL}/shop`,
    external: true,
  },
  {
    name: "Corporate Sponsorships",
    description: "Businesses and organizations contributing cash or in-kind support as campaign partners.",
    href: `${CAMPAIGN_URL}/sponsors`,
    external: true,
  },
  {
    name: "Direct Giving",
    description: "Gifts made straight to the beneficiary organizations, outside any single campaign or event.",
    href: `${CAMPAIGN_URL}${DONATE_LINK.href}`,
    external: true,
  },
];
