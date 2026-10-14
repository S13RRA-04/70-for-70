import { LIVE_REGISTRATION_URL } from "@/lib/constants";

/**
 * Evergreen "For The 22: Live" series copy — the stuff that's true whether
 * or not a specific concert is currently scheduled. Per-show details
 * (performers, dates, tickets) are real DB rows, see src/lib/data/live-events.ts.
 */

export const LIVE_CAMPAIGN_TAGLINE = "Music With a Mission";

/** The four-word pillar line under the hero wordmark. */
export const LIVE_PILLARS = ["Music", "Community", "Fundraising", "Veteran support"] as const;

/** Phrases for the red marquee band. Rendered twice back-to-back so the loop is seamless. */
export const LIVE_MARQUEE_PHRASES = [
  "Music with a mission",
  "Turn up for those who served",
  "Because 22 ≠ 0",
  "Veterans · First responders · Families",
] as const;

export const LIVE_CAMPAIGN_DESCRIPTION =
  "For The 22: Live is a benefit concert series bringing together artists, veterans, first responders, families, and supporters to raise awareness and direct support for The $70K Mission.";

/**
 * Funds disclosure for For The 22: Live — covers ticket proceeds, the
 * online silent auction, and any in-person/event giving alike, since all
 * of it follows the same path. Shared between the campaign page and the
 * auction page (see live-auction.ts) rather than restated separately, so
 * the two can't drift into different claims about the same mechanism.
 */
export const LIVE_FUNDS_DISCLOSURE =
  "For The 22 is the initial recipient of proceeds from For The 22: Live — ticket sales, the online silent auction, and event-day giving alike. After the event, those proceeds are distributed evenly across the mission's beneficiary organizations.";

export interface UpcomingLivePerformer {
  name: string;
  details: string;
  /** Short format line for the home page ticket stub, e.g. "Virtual benefit concert". */
  format: string;
  registrationUrl?: string;
}

export const UPCOMING_LIVE_PERFORMERS: UpcomingLivePerformer[] = [
  {
    name: "Scooter Brown Band",
    details:
      "Featured in the first For The 22: LIVE virtual benefit concert. The event date and streaming details will be announced as they are confirmed.",
    format: "Virtual benefit concert · Streaming online",
    registrationUrl: LIVE_REGISTRATION_URL,
  },
];

export interface LiveContributionMethod {
  label: string;
  description: string;
}

/** The home page's "Where it goes" cards, in order. LIVE_FUNDS_DISCLOSURE is the fine print under them. */
export const LIVE_CONTRIBUTION_METHODS: LiveContributionMethod[] = [
  { label: "Tickets", description: "Ticket proceeds from every show." },
  { label: "Sponsorships", description: "Brands that put their name behind a show." },
  { label: "Silent auction", description: "Signed gear and one-of-a-kind experiences." },
  { label: "Merch", description: "Wear black. Because 22 ≠ 0." },
];

export interface LiveJoinPath {
  title: string;
  description: string;
  cta: string;
}

/** "Turn up" cards — the three ways in. Hrefs are wired in the page (mailto/cross-domain/route). */
export const LIVE_JOIN_PATHS = {
  artists: {
    title: "Artists & bands",
    description: "Play for a crowd of veterans, first responders, and families who will remember the night.",
    cta: "Bring your band",
  },
  sponsors: {
    title: "Sponsors & brands",
    description: "Your name on the stream, the stage, and the merch — next to the people you showed up for.",
    cta: "Sponsor a show",
  },
  auction: {
    title: "Auction items",
    description: "Signed guitars, meet-and-greets, experiences. Donate one, or bid while the auction is open.",
    cta: "See the auction",
  },
} satisfies Record<string, LiveJoinPath>;
