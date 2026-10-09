/**
 * Types for the campaign-wide Journal (src/app/campaigns/journal/page.tsx,
 * teased on src/app/campaigns/page.tsx). Content lives in
 * src/lib/content/campaign-journal.ts as plain structured data — unlike
 * Tri's Supabase-backed /journal (training logs, race-day posts, a single
 * effort's story), this is for announcements that span the whole For The 22
 * mission: a new campaign launching, a milestone, a cross-campaign update.
 *
 * Keep entries short — this is an announcement feed, not a place for a
 * full narrative (that belongs in a dedicated page, the way Bike Build
 * gets its own route under /journal).
 */
export interface CampaignJournalEntry {
  /** Stable slug used as the entry's anchor id (/campaigns/journal#<id>). Never change after publishing. */
  id: string;
  /** ISO date (YYYY-MM-DD) — used for the <time> element and to compute "last updated." */
  date: string;
  title: string;
  summary: string;
  /** Narrative body, one short paragraph per array entry. */
  body: string[];
  /** A logo/photo to show alongside the entry — e.g. a new supporter's logo. */
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
}
