/**
 * Bid/goal numbers for the tracker on an item's card. Hand-updated: don't
 * scrape the auction platforms (32auctions' robots.txt disallows automated
 * access to listing pages, and neither has a public bid feed). To post a new bid, set `currentBid` and
 * `bidAsOfLabel` together, then push to master.
 */
export interface LiveAuctionTracker {
  goal: number;
  /** `null` when the listing doesn't publish one — the tracker then shows only the goal until a bid is recorded. */
  startingBid: number | null;
  /** Latest high bid from the item's listing. `null` until one is recorded — the tracker shows `startingBid` instead. */
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
  /** Where the item is listed and bids are taken — the system of record named on the card and auction page. */
  platform: "Givebutter" | "32auctions";
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
  /** Optional separate winner-announcement date, when it differs from closesOnLabel. */
  winnerAnnouncementLabel?: string;
  /** Org this specific item's winning bid benefits, when an item designates one directly (distinct from LIVE_FUNDS_DISCLOSURE's general pooled split — see the auction page's doc comment). */
  beneficiary?: string;
  /**
   * Real item photo. Omit (or leave undefined) until one exists — the card renders a branded placeholder instead of a stock/generic image.
   * `contain` shows the whole photo instead of cropping to fill, for tall subjects like a full guitar.
   */
  image?: { src: string; alt: string; contain?: boolean };
  featured?: boolean;
  /**
   * Pulls the item off the site without losing its details — set while an
   * item's logistics are being worked out, delete the flag to relist it.
   * Hiding it here doesn't touch the 32auctions listing itself.
   */
  hidden?: boolean;
  /** Shows the bid/goal/time-remaining tracker on the card when set. */
  tracker?: LiveAuctionTracker;
}

export const LIVE_AUCTION_ITEMS: LiveAuctionItem[] = [
  {
    slug: "whiskey-myers-guitar-tickets",
    title: "Whiskey Myers Autographed Guitar",
    description:
      "A band-signed Epiphone Les Paul-style electric guitar with custom Whomp Whack Thunder album artwork. Whiskey Myers generously donated it to support Tri For The 22, and a certificate of authenticity is included. Bidding closes May 17, 2027 at noon CT — the day after IRONMAN 70.3 Chattanooga.",
    provenanceLine:
      "Donated and signed by Whiskey Myers · Certificate of authenticity included · Benefiting Mighty Oaks Foundation and Veterans and Athletes United",
    biddingUrl: "https://givebutter.com/c/forthe22",
    platform: "Givebutter",
    // Relisted on Givebutter Nov. 18, 2026 (guitar only). Every Givebutter
    // item closes together: May 17, 2027 at 12 PM CT (CDT, -05:00).
    opensAtIso: "2026-11-18T00:00:00-06:00",
    closesAtIso: "2027-05-17T12:00:00-05:00",
    opensOnLabel: "November 18, 2026",
    closesOnLabel: "May 17, 2027 at 12 PM CT",
    opensShortLabel: "Nov. 18",
    closesShortLabel: "May 17 at noon CT",
    beneficiary: "Mighty Oaks Foundation and Veterans and Athletes United",
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
    title: "Muscadine Bloodline Autographed Acoustic Guitar",
    description:
      "An Epiphone J-45 Studio acoustic guitar in gloss black with ivory binding and a red tortoiseshell pickguard bearing the autographs of Gary Stanton and Charlie Muncaster. Muscadine Bloodline stepped up to support Tri For The 22 with this one-of-a-kind piece. Bidding closes May 17, 2027 at noon CT — the day after IRONMAN 70.3 Chattanooga.",
    provenanceLine:
      "Donated through Gibson Gives · Signed by Muscadine Bloodline · Benefiting Mighty Oaks Warrior Programs and Veterans and Athletes United",
    biddingUrl: "https://givebutter.com/c/for-the-22-muscadine-bloodline-5v1dhv/auction",
    platform: "Givebutter",
    // Relisted on Givebutter Nov. 18, 2026 — closes with every other Givebutter item.
    opensAtIso: "2026-11-18T00:00:00-06:00",
    closesAtIso: "2027-05-17T12:00:00-05:00",
    opensOnLabel: "November 18, 2026",
    closesOnLabel: "May 17, 2027 at 12 PM CT",
    opensShortLabel: "Nov. 18",
    closesShortLabel: "May 17 at noon CT",
    beneficiary: "Mighty Oaks Warrior Programs and Veterans and Athletes United",
    featured: true,
    image: {
      // Cropped from the Givebutter listing graphic.
      src: "/live/muscadine-bloodline-guitar.jpg",
      alt: "Black Epiphone J-45 Studio acoustic guitar with a red tortoiseshell pickguard signed by Muscadine Bloodline",
      contain: true,
    },
    tracker: {
      goal: 1500,
      startingBid: null,
      currentBid: null,
      bidAsOfLabel: null,
    },
  },
];

/** The items shown on the site — everything in LIVE_AUCTION_ITEMS that isn't hidden. */
export const LISTED_LIVE_AUCTION_ITEMS = LIVE_AUCTION_ITEMS.filter((item) => !item.hidden);

/**
 * Whether the auction has anything to show. While false, /auction shows a
 * "coming soon" state and the links that send people there (LIVE nav, the
 * LIVE home's auction card, the sitemap, press references) stand down.
 */
export const HAS_LISTED_AUCTION_ITEMS = LISTED_LIVE_AUCTION_ITEMS.length > 0;

/** The platform(s) the listed items are on, for page copy — e.g. "Givebutter" or "Givebutter and 32auctions". */
export const LISTED_AUCTION_PLATFORMS = [...new Set(LISTED_LIVE_AUCTION_ITEMS.map((item) => item.platform))].join(" and ");
