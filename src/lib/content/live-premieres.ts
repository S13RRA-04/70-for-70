/**
 * For The 22: LIVE artist premieres — a LIVE episode built around an
 * artist's own release (a music video, a single), rather than a concert.
 * Kept as content data, not live_events rows: a premiere has no venue or
 * tickets, and its centerpiece lives on the artist's own channel.
 *
 * Each premiere renders at live.forthe22.org/<slug> through the same
 * one-level route as DB shows (src/app/campaigns/live/[slug]/page.tsx),
 * and a premiere slug takes precedence over a live_events row with the
 * same slug — keep them distinct.
 */

export interface LivePremiere {
  slug: string;
  artist: string;
  /** The song or release being premiered, without quotes. */
  title: string;
  /** e.g. "Official Music Video Premiere". */
  kind: string;
  /** When the LIVE episode starts, ISO 8601 in UTC. */
  startsAt: string;
  summary: string;
  /** The night's running order, as agreed with the artist. */
  program: { title: string; description: string }[];
  /** The artist's channel, where the official release lives. */
  artistChannelUrl: string;
  /** Direct link to the scheduled YouTube Premiere, once the artist has created it. */
  watchUrl: string | null;
  /** Where to stream the song itself, once there's a link to share. */
  listenUrl: string | null;
}

export const LIVE_PREMIERES: LivePremiere[] = [
  {
    slug: "austin",
    artist: "Western Medicine",
    title: "Austin",
    kind: "Official Music Video Premiere",
    // 7:00 PM Pacific on November 20, 2026 (PST, UTC−8).
    startsAt: "2026-11-21T03:00:00Z",
    summary:
      "For The 22: LIVE presents the official music video premiere of “Austin” by Western Medicine — a live interview with the band, then the video's debut on Western Medicine's own YouTube channel.",
    program: [
      {
        title: "Live interview",
        description: "Western Medicine joins For The 22: LIVE to talk about “Austin” and the story behind it.",
      },
      {
        title: "The premiere",
        description: "The official “Austin” music video premieres on Western Medicine's YouTube channel.",
      },
    ],
    artistChannelUrl: "https://www.youtube.com/@WesternMedicineMusic",
    watchUrl: null,
    listenUrl: null,
  },
];

export function getLivePremiere(slug: string): LivePremiere | null {
  return LIVE_PREMIERES.find((premiere) => premiere.slug === slug) ?? null;
}

/** Premieres that haven't started yet, soonest first. */
export function getUpcomingLivePremieres(now: number): LivePremiere[] {
  return LIVE_PREMIERES.filter((premiere) => new Date(premiere.startsAt).getTime() > now).sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
}

/** Where "Watch" should point: the scheduled Premiere once it exists, else the artist's channel. */
export function premiereWatchUrl(premiere: LivePremiere): string {
  return premiere.watchUrl ?? premiere.artistChannelUrl;
}

const PREMIERE_TIME_ZONES = [
  { zone: "America/Los_Angeles", label: "PT" },
  { zone: "America/Chicago", label: "CT" },
  { zone: "America/New_York", label: "ET" },
] as const;

/**
 * Formatted in the artist's time zone (Pacific), never the server's —
 * Workers run in UTC, where a 7 PM PT start already falls on the next day.
 */
export function formatPremiereDate(premiere: LivePremiere, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "America/Los_Angeles" }).format(
    new Date(premiere.startsAt),
  );
}

/** "7:00 PM PT / 9:00 PM CT / 10:00 PM ET". */
export function formatPremiereTimes(premiere: LivePremiere): string {
  const start = new Date(premiere.startsAt);
  return PREMIERE_TIME_ZONES.map(
    ({ zone, label }) =>
      `${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: zone }).format(start)} ${label}`,
  ).join(" / ");
}
