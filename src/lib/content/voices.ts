/**
 * Voices For The 22 — short messages of support from public figures to
 * veterans, first responders, and their families. Messages *to* the people
 * For The 22 serves, not endorsements of the organization, so copy here never
 * implies a speaker backs, partners with, or fundraises for For The 22.
 *
 * Publishing a new message is a content edit: re-encode the video into
 * public/media/ (H.264 + AAC, faststart), add it to the FILMS allowlist in
 * src/app/video/[file]/route.ts, and append an entry at the **end** — the last
 * entry is the "latest" one featured on the homepage. `id` becomes the
 * /voices#<id> anchor and must never change after publishing.
 */
export interface VoiceMessage {
  id: string;
  /** Speaker's name as it should appear on the site. */
  name: string;
  /** Short descriptor under the name, e.g. "Comedian and veterans advocate". */
  descriptor: string;
  /** Publish date, YYYY-MM-DD. */
  publishedOn: string;
  /** One or two sentences introducing the message — never a quote unless verbatim from the video. */
  summary: string;
  video: {
    src: string;
    /** Full MIME type with codecs, so browsers can skip sources they can't play. */
    type: string;
    poster: string;
    /** WebVTT captions in public/media/. Omit until a reviewed transcript exists. */
    captions?: string;
  };
  /** Reviewed, verbatim transcript paragraphs, shown under the video. Omit until reviewed. */
  transcript?: readonly string[];
}

export const VOICES_SERIES_NAME = "Voices For The 22";

export const VOICES_SERIES_DESCRIPTION =
  "Messages of support from public figures to veterans, first responders, and their families — because your life matters.";

export const VOICE_MESSAGES: readonly VoiceMessage[] = [
  {
    id: "jon-stewart",
    name: "Jon Stewart",
    descriptor: "Comedian, host, and longtime advocate for veterans and first responders",
    publishedOn: "2026-11-18",
    summary:
      "The first message in the series: Jon Stewart speaks directly to veterans, first responders, and their families.",
    video: {
      src: "/video/voices-jon-stewart.mp4",
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      poster: "/media/voices-jon-stewart-poster.webp",
    },
  },
];

/** The most recently published message — featured on the homepage. */
export const LATEST_VOICE_MESSAGE: VoiceMessage | undefined = VOICE_MESSAGES[VOICE_MESSAGES.length - 1];
