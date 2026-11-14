import { LIVE_CAMPAIGN_PATH, RUCK_CAMPAIGN_URL, TRI_PAGE_PATH } from "@/lib/constants";
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
  {
    id: "western-medicine-austin-world-premiere",
    date: "2026-11-13",
    title: "World Premiere: Western Medicine's “Austin”",
    summary:
      "For The 22 is partnering with Western Medicine for the world premiere of their music video “Austin” on Friday, November 20, at 7:00 PM PT.",
    body: [
      "For The 22 is partnering with Western Medicine for the world premiere of their music video “Austin” on Friday, November 20, at 7:00 PM PT.",
      "Join For The 22 on Western Medicine's YouTube channel at 6:40 PM PT for a pre-release interview with the band, ahead of the video's debut.",
    ],
    link: { label: "Premiere Details", href: `${LIVE_CAMPAIGN_PATH}/austin` },
  },
  {
    id: "muscadine-bloodline-whiskey-myers-signed-guitars",
    date: "2026-11-13",
    title: "Signed Guitars from Muscadine Bloodline and Whiskey Myers",
    summary:
      "Muscadine Bloodline and Whiskey Myers have partnered with For The 22, donating autographed guitars that will be auctioned off to support Tri For The 22.",
    body: [
      "Muscadine Bloodline and Whiskey Myers have partnered with For The 22 by donating autographed guitars that will be auctioned off to support Tri For The 22.",
      "Additional details will be released soon.",
    ],
    gallery: [
      {
        src: "/campaigns/tri/muscadine-bloodline-signed-guitar.webp",
        alt: "Black Epiphone acoustic guitar signed by Muscadine Bloodline, with a close-up of the signatures on its red pickguard",
        width: 1122,
        height: 1402,
      },
      {
        src: "/campaigns/tri/whiskey-myers-signed-guitar.webp",
        alt: "Epiphone Les Paul electric guitar with Whomp Whack Thunder artwork, signed by Whiskey Myers; includes a certificate of authenticity",
        width: 1122,
        height: 1402,
      },
    ],
  },
  {
    id: "birmingham-bulls-military-night-partnership",
    date: "2026-11-13",
    title: "Tri For The 22 Partners with the Birmingham Bulls",
    summary:
      "The Birmingham Bulls are joining Tri For The 22 for Military Night on November 20, with $4 from every ticket purchased through the fundraiser link supporting Mighty Oaks Foundation.",
    body: [
      "Tri For The 22 has partnered with the Birmingham Bulls Hockey Team for Military Night at the Pelham Civic Complex on Friday, November 20, 2026, at 7:00 p.m. CT.",
      "Four dollars from every ticket purchased through the event fundraiser link will be donated to Mighty Oaks Foundation. The Birmingham Bulls are also joining the For The 22 network as a Mission Partner.",
    ],
    image: { src: "/partners/birmingham-bulls-logo.avif", alt: "Birmingham Bulls Hockey logo" },
    gallery: [
      {
        src: "/campaigns/tri/birmingham-bulls-military-night.webp",
        alt: "Military Night with the Birmingham Bulls: Friday, November 20, 2026, 7:00 PM CT at Pelham Civic Complex. $4 from each ticket bought through the fundraiser link supports the mission.",
        width: 1254,
        height: 1254,
      },
    ],
    link: { label: "See Military Night Details", href: `${TRI_PAGE_PATH}#military-night` },
  },
  {
    id: "providence-market-booth-november-21",
    date: "2026-11-13",
    title: "Find Us at the Providence Market — November 21",
    summary:
      "For The 22 will have a booth at the Providence Market on Saturday, November 21, from 9 AM to 2 PM — with new Tri For The 22 merch, the triathlon bike, and the signed guitars up for auction.",
    body: [
      "For The 22 will have a booth at the Providence Market on Saturday, November 21, from 9:00 AM to 2:00 PM. Come out to support the mission and pick up some of the new Tri For The 22 merch — T-shirts, hoodies, hats, and more.",
      "While you're there, take a look at the triathlon bike, the signed guitars up for auction, and more.",
    ],
    link: { label: "Shop the Merch", href: "/store" },
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
