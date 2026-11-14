/**
 * Tri For The 22 artist premieres — an artist's own release (a music video,
 * a single) launched with Tri For The 22, to talk about the triathlon
 * fundraising effort and the veteran, first responder, and family
 * communities it supports. Kept as content data: a premiere has no venue
 * or tickets, and its centerpiece lives on the artist's own channel.
 *
 * Each premiere renders at /campaigns/tri/premiere/<slug>
 * (src/app/campaigns/tri/premiere/[slug]/page.tsx). Its old Live URL
 * redirects there — see applyLegacyPathRedirect in src/middleware.ts.
 */

export interface Premiere {
  slug: string;
  artist: string;
  /** The song or release being premiered, without quotes. */
  title: string;
  /** e.g. "Official Music Video Premiere". */
  kind: string;
  /** When the premiere broadcast starts, ISO 8601 in UTC. */
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
  /** Where the pre-release interview streams, when it isn't on the artist's channel (e.g. their Instagram for an Instagram Live). */
  interviewUrl: string | null;
  /** Direct link to the scheduled YouTube Premiere, once the artist has created it. */
  watchUrl: string | null;
  /** Where to stream the song itself, once there's a link to share. */
  listenUrl: string | null;
  /** The artist's own teaser clips (YouTube Shorts/videos), embedded click-to-play, in order. */
  teasers: string[];
}

export const PREMIERES: Premiere[] = [
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
      "Tri For The 22 and Western Medicine launch the official music video for “Austin” — a pre-release interview on Instagram Live about the triathlon fundraising effort and the veteran, first responder, and family communities it supports, then the video's debut on Western Medicine's own YouTube channel.",
    program: [
      {
        title: "Instagram Live interview",
        time: "6:40 PM PT",
        description:
          "Join Tri For The 22 and Western Medicine on Instagram Live (@westernmedicineband) to talk about “Austin,” the road to IRONMAN 70.3 Chattanooga, and the communities the race supports.",
      },
      {
        title: "The premiere",
        time: "7:00 PM PT",
        mainEvent: true,
        description: "The official “Austin” music video premieres on Western Medicine's YouTube channel.",
      },
    ],
    artistChannelUrl: "https://www.youtube.com/@WesternMedicineMusic",
    interviewUrl: "https://www.instagram.com/westernmedicineband/",
    watchUrl: null,
    listenUrl: null,
    teasers: ["https://youtube.com/shorts/8Fw3d1Nx67U"],
  },
];

export function getPremiere(slug: string): Premiere | null {
  return PREMIERES.find((premiere) => premiere.slug === slug) ?? null;
}

/** Premieres that haven't started yet, soonest first. */
export function getUpcomingPremieres(now: number): Premiere[] {
  return PREMIERES.filter((premiere) => new Date(premiere.startsAt).getTime() > now).sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
}

/** Where "Watch" should point: the scheduled Premiere once it exists, else the artist's channel. */
export function premiereWatchUrl(premiere: Premiere): string {
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
export function formatPremiereDate(premiere: Premiere, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "America/Los_Angeles" }).format(
    new Date(premiere.startsAt),
  );
}

/** "7:00 PM PT / 9:00 PM CT / 10:00 PM ET". */
export function formatPremiereTimes(premiere: Premiere): string {
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
export function premiereCalendarUrl(premiere: Premiere, pageUrl: string): string {
  const start = new Date(premiere.startsAt);
  const end = new Date(start.getTime() + premiere.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${premiere.artist} — “${premiere.title}” premiere · Tri For The 22`,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: [
      premiere.program.map((step) => (step.time ? `${step.time}: ${step.title}` : step.title)).join(", then "),
      premiere.interviewUrl && `Interview: ${premiere.interviewUrl}`,
      `Premiere: ${premiereWatchUrl(premiere)}`,
      pageUrl,
    ]
      .filter(Boolean)
      .join("\n"),
    location: premiereWatchUrl(premiere),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
