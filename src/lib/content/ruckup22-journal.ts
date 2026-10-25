/**
 * Cody's own photos and videos from RuckUp22 Huntsville on
 * October 24, 2026 — rendered as the "Participation Journal" section of its
 * mission page (src/app/ruck-missions/[slug], via RUCK_MISSIONS). Plain data, not
 * a Supabase journal: Ruck stays a deliberately minimal single page.
 *
 * Order is the order of the day (camera-roll order). Append new entries at
 * the end; ids become #anchors and must never change after publishing.
 *
 * Photos live in public/ruck/ruckup22-2026/ as metadata-stripped WebP
 * (rotated, max 1600px). Videos must be served through src/app/video/[file]
 * for Safari/iOS Range support — put the files in public/media/, add them to
 * that route's FILMS allowlist, then reference them here as /video/<file>.
 */

export interface RuckJournalVideo {
  /** In preference order — H.264 MP4 first (Safari/iOS), then VP9 WebM. */
  sources: { src: string; type: string }[];
  /** Poster frame shown before playback. */
  poster: string;
}

export interface RuckJournalEntry {
  id: string;
  /** The photo — or, for a video entry, used as its poster when `video.poster` is absent. */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** CSS object-position for the 3:4 grid crop — only needed when the subject isn't centered (e.g. a landscape photo). */
  objectPosition?: string;
  video?: RuckJournalVideo;
}

const DIR = "/ruck/ruckup22-2026";

export const RUCKUP22_JOURNAL: RuckJournalEntry[] = [
  {
    id: "morning-coffee",
    src: `${DIR}/img-6217.webp`,
    width: 1158,
    height: 1544,
    alt: "Cody Hitson in a camo flag cap and sunglasses holding up a green coffee tumbler on a wooded trail in the morning light",
    caption: "Coffee in hand, ruck on, and the morning light coming through the trees.",
  },
  {
    id: "check-in-0814",
    src: "/media/ruckup22-2026-checkin-1-poster.webp",
    width: 720,
    height: 1280,
    alt: "Video: Cody Hitson talking to the camera while rucking the Aldridge Creek Greenway",
    caption: "Trail check-in, 8:14 a.m.",
    video: {
      sources: [{ src: "/video/ruckup22-2026-checkin-1.mp4", type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"' }],
      poster: "/media/ruckup22-2026-checkin-1-poster.webp",
    },
  },
  {
    id: "heron",
    src: `${DIR}/img-6220.webp`,
    width: 1200,
    height: 1600,
    alt: "A great blue heron standing on a rock in still water reflecting autumn trees",
    caption: "A great blue heron keeping watch along the water.",
  },
  {
    id: "beware-of-alligators",
    src: `${DIR}/img-6223.webp`,
    width: 1200,
    height: 1600,
    alt: "A Huntsville Parks & Recreation sign reading \"Beware of Alligators\" beside a creek",
    caption: "Not the sign you expect to pass on a ruck in North Alabama.",
  },
  {
    id: "check-in-0958",
    src: "/media/ruckup22-2026-checkin-2-poster.webp",
    width: 720,
    height: 1280,
    alt: "Video: Cody Hitson talking to the camera while rucking the Aldridge Creek Greenway",
    caption: "Trail check-in, 9:58 a.m.",
    video: {
      sources: [{ src: "/video/ruckup22-2026-checkin-2.mp4", type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"' }],
      poster: "/media/ruckup22-2026-checkin-2-poster.webp",
    },
  },
  {
    id: "blister",
    src: `${DIR}/img-6226.webp`,
    width: 1200,
    height: 1600,
    alt: "A torn blister on the back of a heel, sock pulled down, beside a ruck strap on the ground",
    caption: "The miles leave their mark. A heel blister, patched and pushed through.",
  },
  {
    id: "by-the-water",
    src: `${DIR}/img-6228.webp`,
    width: 1158,
    height: 1544,
    alt: "Cody Hitson smiling in a selfie with a ruck on his back, a pond and grass behind him",
    caption: "Still smiling, with the ruck still on.",
  },
  {
    id: "check-in-1124",
    src: "/media/ruckup22-2026-checkin-3-poster.webp",
    width: 720,
    height: 1280,
    alt: "Video: Cody Hitson talking to the camera while rucking the Aldridge Creek Greenway",
    caption: "Trail check-in, 11:24 a.m.",
    video: {
      sources: [{ src: "/video/ruckup22-2026-checkin-3.mp4", type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"' }],
      poster: "/media/ruckup22-2026-checkin-3-poster.webp",
    },
  },
  {
    id: "signing-the-banner",
    src: `${DIR}/img-6233.webp`,
    width: 1600,
    height: 1200,
    objectPosition: "65% 50%",
    alt: "The 11th Annual RuckUp22 October 2026 banner, signed by participants, including \"Cody Hitson, For the 22!\"",
    caption: "Cody's name on the 11th Annual RuckUp22 banner, alongside everyone else who showed up.",
  },
  {
    id: "refuel",
    src: `${DIR}/img-6235.webp`,
    width: 1158,
    height: 1544,
    alt: "Cody Hitson drinking from a green tumbler while rucking on a paved trail through the trees",
    caption: "Refuel and keep moving.",
  },
  {
    id: "22-mile-coin",
    src: `${DIR}/img-6237.webp`,
    width: 1200,
    height: 1600,
    alt: "A RuckUp22 2026 challenge coin reading \"22 Miles\" with a laurel wreath, held in a hand",
    caption: "The 2026 RuckUp22 22-mile coin.",
  },
  {
    id: "under-the-banner",
    src: `${DIR}/img-1524.webp`,
    width: 1200,
    height: 1600,
    alt: "Cody Hitson in a For The 22 shirt giving a thumbs up and holding the 22-mile coin under the RuckUp22 event tent",
    caption: "Coin in hand under the RuckUp22 tent in Huntsville.",
  },
];
