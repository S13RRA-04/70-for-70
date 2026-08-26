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
  relatedLinks?: { label: string; href: string }[];
  /** Marks the newest/pinned entry — used for the hero teaser and the journal index card. */
  featured?: boolean;
}

export interface BikeBuildContributor {
  name: string;
  role: string;
  note: string;
}
