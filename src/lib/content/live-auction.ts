/**
 * Bid/goal numbers for the tracker on an item's card. Hand-updated: 32auctions
 * has no public feed and its robots.txt disallows automated access to listing
 * pages, so don't scrape it. To post a new bid, set `currentBid` and
 * `bidAsOfLabel` together, then push to master.
 */
export interface LiveAuctionTracker {
  goal: number;
  startingBid: number;
  /** Latest high bid from the 32auctions listing. `null` until one is recorded — the tracker shows `startingBid` instead. */
  currentBid: number | null;
  /** When `currentBid` was read, e.g. "Nov. 3 at 9 AM CT". */
  bidAsOfLabel: string | null;
}

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
   * convention as RACE_INFO.raceDate (constants.ts). Times are Central
   * (America/Chicago; the campaign operates out of Alabama, functionally
   * Central), so check the offset against the date: -05:00 through 2 AM on
   * Nov. 1, 2026 when DST ends, -06:00 after. `closesAtIso` is the instant
   * bidding ends: the listing's closing time when it has one, otherwise the
   * start of the day after the last bidding day — see
   * src/lib/live-auction-status.ts for how these two drive status.
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
  /**
   * Real item photo. Omit (or leave undefined) until one exists — the card renders a branded placeholder instead of a stock/generic image.
   * `contain` shows the whole photo instead of cropping to fill, for tall subjects like a full guitar.
   */
  image?: { src: string; alt: string; contain?: boolean };
  featured?: boolean;
  /** Shows the bid/goal/time-remaining tracker on the card when set. */
  tracker?: LiveAuctionTracker;
}

export const LIVE_AUCTION_ITEMS: LiveAuctionItem[] = [
  {
    slug: "whiskey-myers-guitar-tickets",
    title: "Whiskey Myers Signed Guitar + Two 2027 Concert Tickets",
    description:
      "A band-signed Epiphone Les Paul Special with Whomp Whack Thunder artwork, plus two tickets to a 2027 Whiskey Myers show. Whiskey Myers generously donated this package to the For The 22 online silent auction, and a certificate of authenticity is included.",
    provenanceLine: "Donated and signed by Whiskey Myers · Certificate of authenticity included",
    biddingUrl: "https://www.32auctions.com/organizations/144205/auctions/208906/auction_items/7230673",
    opensAtIso: "2026-11-01T00:00:00-05:00",
    closesAtIso: "2026-11-22T14:00:00-06:00",
    opensOnLabel: "November 1, 2026",
    closesOnLabel: "November 22, 2026 at 2 PM CT",
    opensShortLabel: "Nov. 1",
    closesShortLabel: "Nov. 22 at 2 PM CT",
    winnerAnnouncementLabel: "November 22, 2026",
    featured: true,
    image: {
      src: "/live/whiskey-myers-guitar.jpg",
      alt: "Epiphone Les Paul Special with Whomp Whack Thunder album artwork, signed by Whiskey Myers",
      contain: true,
    },
    tracker: {
      goal: 2000,
      startingBid: 300,
      currentBid: null,
      bidAsOfLabel: null,
    },
  },
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
];
