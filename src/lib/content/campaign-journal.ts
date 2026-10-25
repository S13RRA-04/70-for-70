import { RUCK_CAMPAIGN_URL } from "@/lib/constants";
import type { CampaignJournalEntry } from "@/types/campaign-journal";

/**
 * The campaign-wide Journal (full archive at /campaigns/journal, teased on
 * /campaigns) — announcements that span the whole For The 22 mission (a new
 * campaign launching, a milestone, a cross-campaign update), distinct from
 * Tri's own Supabase-backed /journal, which is one effort's training/
 * race-day story. Kept as plain structured data, the same pattern as
 * src/lib/content/building-the-bike.ts: this is a short stream of
 * independent announcements, not something that needs admin CRUD or
 * comments.
 *
 * To publish a new announcement, append one object to the end of
 * CAMPAIGN_JOURNAL_ENTRIES (oldest first; the newest entry goes last).
 * Nothing else needs to change — both pages derive "last updated" and the
 * entry list from this array automatically. Once published, don't change
 * an existing entry's id (it's used as the /campaigns/journal#<id> anchor).
 * Keep body short — a few sentences, not a full story; link to a dedicated
 * page for anything longer.
 */
export const CAMPAIGN_JOURNAL_ENTRIES: CampaignJournalEntry[] = [
  {
    id: "shoutout-to-tyler-at-inertmugs",
    date: "2026-10-09",
    title: "Shoutout to Tyler at INERTmugs",
    summary:
      "A collaboration pitch turned into a genuine veteran-to-veteran connection with the Marine Corps EOD vet and Purple Heart recipient behind INERTmugs.",
    body: [
      "Shoutout to Tyler over at INERTmugs — a Marine Corps veteran, Purple Heart recipient, and former Explosive Ordnance Disposal technician who now serves as a TSA Explosive Specialist and runs INERTmugs on the side.",
      "What started as a collaboration pitch turned into a phone call — and that call turned into a genuine veteran-to-veteran connection. Tyler's already working on introducing me to other veteran-owned businesses and people doing great work for vets and first responders.",
      "Huge thanks to Tyler — looking forward to working together throughout this campaign and beyond. BOOM!",
    ],
    image: { src: "/partners/inertmugs-logo.png", alt: "INERTmugs logo" },
    link: { label: "Visit INERTmugs", href: "https://www.inertmugs.com/" },
  },
  {
    id: "ruckup22-huntsville-complete",
    date: "2026-10-24",
    title: "Mission Accomplished: RuckUp22 Huntsville",
    summary:
      "On October 24, 2026, I completed the 22-mile 11th Annual RuckUp22 on the Aldridge Creek Greenway in Huntsville, Alabama — the first completed Ruck For The 22 mission.",
    body: [
      "On October 24, 2026, I rucked the full 22 miles of the 11th Annual RuckUp22 on the Aldridge Creek Greenway in Huntsville, Alabama, and finished with the 2026 RuckUp22 22-mile coin in hand.",
      "It's the first completed Ruck For The 22 mission, and 48 News covered the event. The mission page has the coverage plus my photos and trail check-in videos from the day.",
    ],
    image: {
      src: "/ruck/ruckup22-2026/img-6237.webp",
      alt: "The 2026 RuckUp22 22-mile challenge coin",
    },
    link: { label: "See the Mission", href: `${RUCK_CAMPAIGN_URL}/missions/ruckup22-huntsville-2026` },
  },
];

/** Null when there are no entries yet — callers should hide the "last updated" line rather than show a fake date. */
export function getCampaignJournalLastUpdated(): string | null {
  const latest = CAMPAIGN_JOURNAL_ENTRIES[CAMPAIGN_JOURNAL_ENTRIES.length - 1];
  return latest ? latest.date : null;
}

/** Newest first — the display order for the /campaigns/journal archive. */
export function getCampaignJournalEntries(): CampaignJournalEntry[] {
  return [...CAMPAIGN_JOURNAL_ENTRIES].reverse();
}

/** The newest `count` entries, newest first — the teaser shown on /campaigns. */
export function getLatestCampaignJournalEntries(count: number): CampaignJournalEntry[] {
  return getCampaignJournalEntries().slice(0, count);
}
