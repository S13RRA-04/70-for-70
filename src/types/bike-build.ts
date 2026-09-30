/**
 * Types for the "Building the Bike" living journal feature
 * (src/app/journal/building-the-bike/page.tsx). Content lives in
 * src/lib/content/building-the-bike.ts as plain structured data — see that
 * file's doc comment and the project README's "Bike Build Journal Content"
 * section for how to add a new update.
 */

/**
 * Canonical status used for color/icon coding across the status panel and
 * component board. Every row also carries its own free-text `statusLabel`
 * so the precise wording (e.g. "Support Offered" vs "Available Through
 * MBC") is never lost to a coarser bucket — color is never the only signal.
 */
export type BikeBuildStatus =
  | "confirmed"
  | "available"
  | "offered"
  | "under_review"
  | "needed"
  | "wanted"
  | "pending"
  | "complete";

export interface BikeBuildStatusSummaryItem {
  label: string;
  status: BikeBuildStatus;
  statusLabel: string;
  detail?: string;
}

export interface BikeBuildComponentRow {
  component: string;
  status: BikeBuildStatus;
  statusLabel: string;
  notes: string;
}

export interface BikeBuildPhoto {
  src: string;
  alt: string;
  caption: string;
  /** Width/height of the source file — kept alongside the asset so <Image> can size without layout shift. */
  width: number;
  height: number;
  /** True when the caption states an approximate/unverified measurement rather than a confirmed fact. */
  isEstimate?: boolean;
}

export interface BikeBuildTechnicalDetail {
  label: string;
  value: string;
}

/** A rough remaining-parts budget — distinct from technicalDetails' label/value grid because it's genuinely tabular (part + estimated cost) and ends in a total, not a fact sheet. Costs are estimates, never a claim of what was actually spent. */
export interface BikeBuildCostTable {
  heading: string;
  /** Shown beneath the heading — e.g. a caveat about an estimate that hasn't been re-priced. */
  note?: string;
  rows: { part: string; cost: string }[];
  totalLabel: string;
  totalValue: string;
}

export interface BikeBuildTimelineEntry {
  /** Stable slug used as the section's anchor id (#<id>) for sharing a specific update. */
  id: string;
  /** ISO date (YYYY-MM-DD) — used for the <time> element and to compute "last updated." */
  date: string;
  /** Human-facing date text, which may be a range or an approximate month (e.g. "August 20–23, 2026"). */
  displayDate: string;
  title: string;
  summary: string;
  /** Narrative body, one paragraph per array entry. */
  body: string[];
  status: string;
  photos?: BikeBuildPhoto[];
  technicalDetails?: {
    heading: string;
    /** Shown beneath the heading — e.g. "Approximate — not a verified manufacturer geometry chart." */
    note?: string;
    items: BikeBuildTechnicalDetail[];
  };
  /** Names only — cross-reference CONFIRMED_CONTRIBUTORS / CONVERSATIONS_IN_PROGRESS for the full acknowledgment. */
  contributors?: string[];
  costTable?: BikeBuildCostTable;
  relatedLinks?: { label: string; href: string }[];
  /**
   * Marks the newest entry — used for the hero teaser, the journal index
   * card, and which node the interactive timeline opens by default. Should
   * be true on exactly one entry at a time: the actual latest one. When
   * appending a new entry, add `featured: true` to it and remove the flag
   * from whichever entry had it before — don't just add without removing.
   */
  featured?: boolean;
}

export interface BikeBuildContributor {
  name: string;
  role: string;
  note: string;
}
