import { RUCK_EVENT_BENEFICIARIES, RUCK_EVENT_INFO, RUCK_EVENT_ORGANIZER } from "@/lib/constants";
import { RUCKUP22_JOURNAL, type RuckJournalEntry } from "@/lib/content/ruckup22-journal";

/**
 * Every Ruck For The 22 mission — the single source for the Completed /
 * Next Missions tabs on ruck.forthe22.org and each completed mission's own
 * page at /missions/<slug> (src/app/ruck-missions/[slug], reached through a
 * Ruck-host rewrite in src/middleware.ts).
 *
 * Adding a mission is a data edit here, never a component edit. Slugs become
 * URLs and must never change after publishing. When a mission is done, flip
 * `status` to "completed" — that's what moves it to the Completed tab and
 * puts the Mission Accomplished stamp on it.
 */

export interface RuckMediaCoverage {
  outlet: string;
  title: string;
  youtubeId: string;
  /** The video's own upload date and ISO 8601 duration from its YouTube page — never estimated. */
  uploadDate: string;
  duration: string;
}

export interface RuckMission {
  slug: string;
  name: string;
  status: "completed" | "upcoming";
  /** ISO start, for sorting and Event schema. */
  date: string;
  dateDisplay: string;
  location: string;
  distanceMiles: number;
  organizer?: { name: string; ein?: string };
  /** Plain-language notes shown on the mission page's details block. */
  details?: string[];
  /** Organizations the event's own proceeds support, when chosen by the organizer rather than For The 22. */
  eventBeneficiaries?: { name: string; description: string; websiteUrl: string; donationUrl?: string; ein: string }[];
  summary: string;
  /** Card image on the Missions tabs — one of the mission's own photos. */
  cover?: { src: string; alt: string };
  mediaCoverage: RuckMediaCoverage[];
  /**
   * What For The 22 itself raised through this mission, in dollars. Donations
   * aren't attributed per campaign in the database, so this is entered by
   * hand once reconciled — null hides the section rather than showing a guess.
   */
  amountRaised: number | null;
  journal: RuckJournalEntry[];
}

export const RUCK_MISSIONS: RuckMission[] = [
  {
    slug: "ruckup22-huntsville-2026",
    name: RUCK_EVENT_INFO.name,
    status: "completed",
    date: RUCK_EVENT_INFO.eventDate ?? "2026-10-24T08:00:00-05:00",
    dateDisplay: RUCK_EVENT_INFO.eventDateDisplay.split(" · ")[0],
    location: RUCK_EVENT_INFO.location,
    distanceMiles: 22,
    organizer: RUCK_EVENT_ORGANIZER,
    details: [RUCK_EVENT_INFO.locationDetail, RUCK_EVENT_INFO.formatNote],
    eventBeneficiaries: [...RUCK_EVENT_BENEFICIARIES],
    summary:
      "Cody Hitson rucked the 11th Annual RuckUp22 on the Aldridge Creek Greenway in Huntsville, Alabama, carrying the For The 22 mission for 22 miles in support of veteran suicide awareness.",
    cover: {
      src: "/ruck/ruckup22-2026/img-1524.webp",
      alt: "Cody Hitson giving a thumbs up and holding the 22-mile coin under the RuckUp22 event tent",
    },
    mediaCoverage: [
      {
        outlet: "48 News",
        title: "RuckUp22 brings 22-mile walk for veteran suicide awareness to Huntsville",
        youtubeId: "RjwK9V9iTwI",
        uploadDate: "2026-10-24T17:05:32-07:00",
        duration: "PT0M55S",
      },
    ],
    amountRaised: null,
    journal: RUCKUP22_JOURNAL,
  },
];

export const COMPLETED_RUCK_MISSIONS = RUCK_MISSIONS.filter((m) => m.status === "completed").sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const UPCOMING_RUCK_MISSIONS = RUCK_MISSIONS.filter((m) => m.status === "upcoming").sort((a, b) =>
  a.date.localeCompare(b.date),
);

export function getRuckMission(slug: string): RuckMission | undefined {
  return RUCK_MISSIONS.find((m) => m.slug === slug);
}
