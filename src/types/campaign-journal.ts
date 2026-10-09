/**
 * Types for the campaign-wide Journal section on /campaigns
 * (src/app/campaigns/page.tsx). Content lives in
 * src/lib/content/campaign-journal.ts as plain structured data — unlike
 * Tri's Supabase-backed /journal (training logs, race-day posts, a single
 * effort's story), this is for announcements that span the whole For The 22
 * mission: a new campaign launching, a milestone, a cross-campaign update.
 */
export interface CampaignJournalEntry {
  /** Stable slug used as the entry's anchor id (/campaigns#<id>). Never change after publishing. */
  id: string;
  /** ISO date (YYYY-MM-DD) — used for the <time> element and to compute "last updated." */
  date: string;
  title: string;
  summary: string;
  /** Narrative body, one paragraph per array entry. */
  body: string[];
  link?: { label: string; href: string };
}
