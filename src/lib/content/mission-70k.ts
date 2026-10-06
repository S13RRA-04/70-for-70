/**
 * Content for /70k, the authoritative page for The $70K Mission (see
 * MISSION_NAME in src/lib/constants.ts). Kept as data rather than hard-coded
 * JSX per AGENTS.md's content-file convention.
 */

import { CAMPAIGN_URL, EVENT22_CAMPAIGN_URL, RUCK_CAMPAIGN_URL, SITE_NAME } from "@/lib/constants";

export const MISSION_70K_INTRO = [
  `What began as a 70.3-mile triathlon challenge grew into something bigger. ${SITE_NAME} is working toward a shared $70,000 fundraising goal in support of organizations serving veterans and their families.`,
  "Tri For The 22 inspired the number. But reaching it will take more than one athlete and one race. That's why every For The 22 campaign — endurance events, rucks, concerts, community challenges, auctions, partnerships, merchandise, and future initiatives — contributes toward the same mission.",
] as const;

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
    name: "Tri For The 22",
    description: "Endurance fundraising centered on IRONMAN 70.3 Chattanooga — the campaign that inspired the goal.",
    href: CAMPAIGN_URL,
    external: true,
  },
  {
    name: "Ruck For The 22",
    description: "A community rucking event and parallel fundraising effort in Huntsville, Alabama.",
    href: RUCK_CAMPAIGN_URL,
    external: true,
  },
  {
    name: "For The 22: Live",
    description: "A benefit concert series — ticket proceeds, sponsorships, silent auctions, and merchandise.",
    href: "/campaigns/live",
  },
  {
    name: "22 For the 22",
    description: "A 22-hour community movement challenge raising awareness and optional donations.",
    href: EVENT22_CAMPAIGN_URL,
    external: true,
  },
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
    href: `${CAMPAIGN_URL}/donate`,
    external: true,
  },
];
