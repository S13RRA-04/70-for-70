import type { CampaignJournalEntry } from "@/types/campaign-journal";

/**
 * The campaign-wide Journal on /campaigns — announcements that span the
 * whole For The 22 mission (a new campaign launching, a milestone, a
 * cross-campaign update), distinct from Tri's own Supabase-backed /journal,
 * which is one effort's training/race-day story. Kept as plain structured
 * data, the same pattern as src/lib/content/building-the-bike.ts: this is a
 * short stream of independent announcements, not something that needs
 * admin CRUD or comments.
 *
 * To publish a new announcement, append one object to the end of
 * CAMPAIGN_JOURNAL_ENTRIES (oldest first; the newest entry goes last).
 * Nothing else needs to change — the page derives "last updated" and the
 * entry list from this array automatically. Once published, don't change
 * an existing entry's id (it's used as the /campaigns#<id> anchor).
 */
export const CAMPAIGN_JOURNAL_ENTRIES: CampaignJournalEntry[] = [];

/** Null when there are no entries yet — callers should hide the "last updated" line rather than show a fake date. */
export function getCampaignJournalLastUpdated(): string | null {
  const latest = CAMPAIGN_JOURNAL_ENTRIES[CAMPAIGN_JOURNAL_ENTRIES.length - 1];
  return latest ? latest.date : null;
}

/** Newest first — the display order for the Journal section. */
export function getCampaignJournalEntries(): CampaignJournalEntry[] {
  return [...CAMPAIGN_JOURNAL_ENTRIES].reverse();
}
