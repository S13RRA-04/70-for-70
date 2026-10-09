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
export const CAMPAIGN_JOURNAL_ENTRIES: CampaignJournalEntry[] = [
  {
    id: "shoutout-to-tyler-at-inertmugs",
    date: "2026-10-09",
    title: "Shoutout to Tyler at INERTmugs",
    summary:
      "A collaboration pitch turned into a phone call, and the phone call turned into a genuine veteran-to-veteran connection with the Marine Corps EOD vet and Purple Heart recipient behind INERTmugs.",
    body: [
      "Shoutout to Tyler over at INERTmugs — a Marine Corps veteran, former Explosive Ordnance Disposal technician, and Purple Heart recipient who now serves as a TSA Explosive Specialist and runs INERTmugs on the side.",
      "I reached out to INERTmugs a short while ago about a potential collaboration and had the opportunity to speak with him over the phone yesterday. What started as an initial pitch turned into something unexpected — a genuine veteran-to-veteran connection.",
      "Tyler is working on introducing me to other folks in the veteran-owned business space, pointing me to some other helpful resources, and getting me connected to some of the other amazing people doing work to support vets and first responders.",
      "A huge thank you to Tyler, and I'm looking forward to working together throughout this campaign and beyond. BOOM!",
      "Meet the Dude Behind INERTmugs",
      "Tyler is an Explosive Specialist with the Transportation Security Administration, but his path to get there was anything but ordinary.",
      "Raised in Worthington, Ohio, Tyler's childhood was filled with Lego builds, backyard bike rides, wooded adventures, potato cannon launches, and a creative mix of firecracker fishing. He also thrived in sports — playing summer baseball and wrestling through middle school.",
      "In high school, he found a passion for music and theater, performing in numerous drama productions while mastering the saxophone and drums.",
      "After graduating in 2004, Tyler enlisted in the United States Marine Corps. He was assigned to Communications Company, Headquarters and Service Battalion, 3rd Marine Logistics Group in Okinawa, Japan. His service took him across the Pacific — including deployments to Korea, Hawaii, Guam, Australia, and Japan — as well as a humanitarian rescue mission in Indonesia.",
      "While deployed in Korea, Tyler observed a live demonstration by Marine Corps Explosive Ordnance Disposal (EOD) Technicians from the 9th Engineering Support Battalion. It reignited his childhood fascination with pyrotechnics — and sparked a new mission. He completed EOD training at the Naval School Explosive Ordnance Disposal in Destin, Florida in 2008.",
      "For the next several years, Tyler served as both team member and team leader in elite EOD units. In 2011, he deployed to Sangin, Afghanistan, where he survived four separate enemy IED explosions and was awarded the Purple Heart. After 11 years of service, Tyler left the Marine Corps in 2015 and transitioned to civilian life as an Unexploded Ordnance (UXO) Technician — traveling across the country to clear active and decommissioned military ranges for public and personnel safety.",
      "But the boom never left him.",
      "Between UXO contracts, Tyler earned Pyrotechnician licenses in North Carolina and California, using his skills to support infantry training for combat deployments. He developed and implemented realistic (but safe) explosive scenarios to better prepare service members for what lay ahead.",
      "In September 2020, Tyler joined the TSA as an Explosive Specialist at Los Angeles International Airport — where he currently serves. Outside of work, he's the founder of INERTmugs, a small business combining tactical grit, military humor, and beverage containers tough enough for any FOB or backyard BBQ.",
      "He spends his downtime with his wife and two children, building forts, gaming on family night, and tackling home improvement projects. Despite the hardships and scars of combat, Tyler credits his strength and happiness to the unwavering support of his wife, Megan. He believes that anyone can confront and manage their demons — and continues to support organizations like the EOD Warrior Foundation and other veteran-centered programs focused on healing through community and connection.",
    ],
    link: { label: "Visit INERTmugs", href: "https://www.inertmugs.com/" },
  },
];

/** Null when there are no entries yet — callers should hide the "last updated" line rather than show a fake date. */
export function getCampaignJournalLastUpdated(): string | null {
  const latest = CAMPAIGN_JOURNAL_ENTRIES[CAMPAIGN_JOURNAL_ENTRIES.length - 1];
  return latest ? latest.date : null;
}

/** Newest first — the display order for the Journal section. */
export function getCampaignJournalEntries(): CampaignJournalEntry[] {
  return [...CAMPAIGN_JOURNAL_ENTRIES].reverse();
}
