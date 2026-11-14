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
  /** Expected running time, for the "Add to calendar" event's end time. */
  durationMinutes: number;
  summary: string;
  /**
   * The night's running order, as agreed with the artist. `time` labels a
   * segment with a fixed start; `mainEvent` marks the centerpiece.
   */
  program: { title: string; description: string; time?: string; mainEvent?: boolean }[];
  /** The artist's channel, where the official release lives. */
  artistChannelUrl: string;
  /** Direct link to the scheduled YouTube Premiere, once the artist has created it. */
  watchUrl: string | null;
  /** Where to stream the song itself, once there's a link to share. */
  listenUrl: string | null;
  /** The artist's own teaser clips (YouTube Shorts/videos), embedded click-to-play, in order. */
  teasers: string[];
}

export const LIVE_PREMIERES: LivePremiere[] = [
  {
    slug: "austin",
    artist: "Western Medicine",
    title: "Austin",
    kind: "Official Music Video Premiere",
    // 6:40 PM Pacific on November 20, 2026 (PST, UTC−8) — the pre-release
    // interview; the video itself premieres at 7:00 PM PT.
    startsAt: "2026-11-21T02:40:00Z",
    durationMinutes: 90,
    summary:
      "For The 22: LIVE presents the official music video premiere of “Austin” by Western Medicine — a live interview with the band, then the video's debut on Western Medicine's own YouTube channel.",
    program: [
      {
        title: "Pre-release interview",
        time: "6:40 PM PT",
        description:
          "Join For The 22 on Western Medicine's YouTube channel as the band talks about “Austin” and the story behind it.",
      },
      {
        title: "The premiere",
        time: "7:00 PM PT",
        mainEvent: true,
        description: "The official “Austin” music video premieres on Western Medicine's YouTube channel.",
      },
    ],
    artistChannelUrl: "https://www.youtube.com/@WesternMedicineMusic",
    watchUrl: null,
    listenUrl: null,
    teasers: ["https://youtube.com/shorts/8Fw3d1Nx67U"],
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

function toCalendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** A Google Calendar "add event" link for the premiere — no account data, just the event's own details. */
export function premiereCalendarUrl(premiere: LivePremiere, pageUrl: string): string {
  const start = new Date(premiere.startsAt);
  const end = new Date(start.getTime() + premiere.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${premiere.artist} — “${premiere.title}” premiere · For The 22: Live`,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: `${premiere.program.map((step) => step.title).join(", then ")}. ${pageUrl}`,
    location: premiereWatchUrl(premiere),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
