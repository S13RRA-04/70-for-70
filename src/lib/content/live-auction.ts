export interface LiveAuctionItem {
  /** Stable key for list rendering and the item's in-page anchor (#<slug>). */
  slug: string;
  title: string;
  /** Primary paragraph — the full-sentence description shown on the card. */
  description: string;
  /**
   * Small, visually secondary provenance/attribution line (donor, signer,
   * beneficiary) — kept separate from `description` so it can render at a
   * quieter weight under the title rather than inline in the main copy.
   */
  provenanceLine: string;
  biddingUrl: string;
  /**
   * Bidding window, as ISO-8601 instants with an explicit UTC offset — same
   * convention as RACE_INFO.raceDate (constants.ts). Central Time
   * (America/Chicago; the campaign operates out of Alabama, functionally
   * Central) is a flat -06:00 across this whole window, well clear of the
   * DST boundary, so no timezone library is needed. `closesAtIso` is the
   * instant bidding ends (start of the day after the last bidding day) —
   * see src/lib/live-auction-status.ts for how these two drive status.
   */
  opensAtIso: string;
  closesAtIso: string;
  /** Full-date display strings for the card body, e.g. "December 1, 2026". */
  opensOnLabel: string;
  closesOnLabel: string;
  /** Abbreviated display strings for the compact status line, e.g. "Dec. 1". */
  opensShortLabel: string;
  closesShortLabel: string;
  /** Optional separate winner-announcement date, when it differs from closesOnLabel (e.g. Whiskey Myers). */
  winnerAnnouncementLabel?: string;
  /** Org this specific item's winning bid benefits, when an item designates one directly (distinct from LIVE_FUNDS_DISCLOSURE's general pooled split — see the auction page's doc comment). */
  beneficiary?: string;
  /** Real item photo. Omit (or leave undefined) until one exists — the card renders a branded placeholder instead of a stock/generic image. */
  image?: { src: string; alt: string };
  featured?: boolean;
}

export const LIVE_AUCTION_ITEMS: LiveAuctionItem[] = [
  {
    slug: "muscadine-bloodline-signed-gibson-guitar",
    title: "Muscadine Bloodline Signed Gibson Guitar",
    description:
      "A Gibson guitar donated through Gibson Gives and signed by Gary Stanton and Charlie Muncaster of Muscadine Bloodline. This one-of-a-kind auction item supports Mighty Oaks Warrior Programs through For the 22.",
    provenanceLine: "Donated through Gibson Gives · Signed by Muscadine Bloodline · Benefiting Mighty Oaks Warrior Programs",
    biddingUrl: "https://www.32auctions.com/muscadinebloodline",
    opensAtIso: "2026-12-01T00:00:00-06:00",
    closesAtIso: "2026-12-23T00:00:00-06:00",
    opensOnLabel: "December 1, 2026",
    closesOnLabel: "December 22, 2026",
    opensShortLabel: "Dec. 1",
    closesShortLabel: "Dec. 22",
    beneficiary: "Mighty Oaks Warrior Programs",
    featured: true,
    // Swap in the real photo once it's available — see AuctionItemCard,
    // which falls back to a branded placeholder whenever `image` is unset.
    // image: { src: "/live/muscadine-bloodline-guitar.jpg", alt: "Gibson guitar signed by Muscadine Bloodline for the For the 22 silent auction" },
  },
  {
    slug: "whiskey-myers-guitar-tickets",
    title: "Whiskey Myers Guitar + Two 2027 Concert Tickets",
    description:
      "Whiskey Myers has generously donated a guitar plus two tickets to one of their 2027 shows for the For The 22 online silent auction — support veterans, first responders, and their families and take home a one-of-a-kind Whiskey Myers experience.",
    provenanceLine: "Donated by Whiskey Myers",
    biddingUrl: "https://www.32auctions.com/organizations/144205/auctions/208906/auction_items/7230673",
    opensAtIso: "2026-11-01T00:00:00-06:00",
    closesAtIso: "2026-11-23T00:00:00-06:00",
    opensOnLabel: "November 1, 2026",
    closesOnLabel: "November 22, 2026",
    opensShortLabel: "Nov. 1",
    closesShortLabel: "Nov. 22",
    winnerAnnouncementLabel: "November 22, 2026",
  },
];
