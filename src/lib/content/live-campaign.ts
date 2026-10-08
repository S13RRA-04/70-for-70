import { LIVE_REGISTRATION_URL } from "@/lib/constants";

/**
 * Evergreen "For The 22: Live" series copy — the stuff that's true whether
 * or not a specific concert is currently scheduled. Per-show details
 * (performers, dates, tickets) are real DB rows, see src/lib/data/live-events.ts.
 */

export const LIVE_CAMPAIGN_TAGLINE = "Music Moves the Mission.";

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
  registrationUrl?: string;
}

export const UPCOMING_LIVE_PERFORMERS: UpcomingLivePerformer[] = [
  {
    name: "Scooter Brown Band",
    details:
      "Featured in the first For The 22: LIVE virtual benefit concert. The event date and streaming details will be announced as they are confirmed.",
    registrationUrl: LIVE_REGISTRATION_URL,
  },
];

export interface LiveContributionMethod {
  label: string;
  description: string;
}

export const LIVE_CONTRIBUTION_METHODS: LiveContributionMethod[] = [
  {
    label: "Ticket Proceeds",
    description:
      "For The 22 receives ticket proceeds first, then distributes them evenly across the mission's beneficiary organizations after the event.",
  },
  { label: "Direct Donations", description: "Attendees can give directly at the show or online." },
  { label: "Event Sponsors", description: "Businesses and organizations sponsor the show itself." },
  { label: "Silent Auction", description: "Donated items and experiences offered through the online auction." },
  { label: "Artist-Donated Memorabilia", description: "Signed gear and memorabilia contributed by performers." },
  { label: "Merchandise", description: "Event and campaign merch sold on-site and online." },
];
