/**
 * Evergreen "For The 22: Live" series copy — the stuff that's true whether
 * or not a specific concert is currently scheduled. Per-show details
 * (performers, dates, tickets) are real DB rows, see src/lib/data/live-events.ts.
 */

export const LIVE_CAMPAIGN_TAGLINE = "Music Moves the Mission.";

export const LIVE_CAMPAIGN_DESCRIPTION =
  "For The 22: Live is a benefit concert series bringing together artists, veterans, first responders, families, and supporters to raise awareness and direct support for The $70K Mission.";

export interface LiveContributionMethod {
  label: string;
  description: string;
}

export const LIVE_CONTRIBUTION_METHODS: LiveContributionMethod[] = [
  { label: "Ticket Proceeds", description: "A portion of every ticket sold goes toward the mission." },
  { label: "Direct Donations", description: "Attendees can give directly at the show or online." },
  { label: "Event Sponsors", description: "Businesses and organizations sponsor the show itself." },
  { label: "Silent Auction", description: "Donated items and experiences offered through the online auction." },
  { label: "Artist-Donated Memorabilia", description: "Signed gear and memorabilia contributed by performers." },
  { label: "Merchandise", description: "Event and campaign merch sold on-site and online." },
];
