/**
 * The 22-session progress tracker and its milestone share prompts. The
 * tracker is a personal, local-browser tool (localStorage — see
 * src/components/22-for-the-22/session-tracker.tsx) since the site has no
 * participant accounts to persist this server-side. It never verifies or
 * reports sweepstakes eligibility — see TRACKER_ELIGIBILITY_NOTE.
 */

export const TOTAL_SESSIONS = 22;
export const MINUTES_PER_SESSION = 22;
export const TOTAL_MINUTES = TOTAL_SESSIONS * MINUTES_PER_SESSION;

/** Namespaced by event slug so a future year's event starts with a clean tracker. */
export function sessionTrackerStorageKey(eventSlug: string): string {
  return `tri22-session-tracker:${eventSlug}`;
}

/** Shown near the tracker — it's a personal tool, not part of giveaway-entry verification. */
export const TRACKER_ELIGIBILITY_NOTE =
  "This tracker is a personal progress tool. It does not verify or affect giveaway eligibility — free registration is your giveaway entry, regardless of how many sessions you log.";

/** Same wording used across every share/download CTA on this event. Verbatim. */
export const SHARING_OPTIONAL_NOTE =
  "Sharing campaign content is optional and does not provide additional giveaway entries or improve odds of winning.";

/** Only these three — a deliberately short set for quick milestone shares (the full recommended set lives in 22-for-the-22-promokit.ts). */
export const MILESTONE_HASHTAGS = ["#22ForThe22", "#TriForThe22", "#Because22DoesNotEqual0"] as const;
export const MILESTONE_HASHTAGS_TEXT = MILESTONE_HASHTAGS.join(" ");

export interface SessionMilestone {
  id: string;
  /** Sessions completed to trigger this milestone; null for the registration-complete milestone. */
  threshold: number | null;
  caption: string;
}

/** Order matters — SHARING order low to high; "registration" always applies first. */
export const SESSION_MILESTONES: SessionMilestone[] = [
  {
    id: "registration",
    threshold: null,
    caption: "I'm in for 22 For the 22. 22 minutes, 22 times, one mission.",
  },
  {
    id: "session-1",
    threshold: 1,
    caption: "I just completed session 1 of 22.",
  },
  {
    id: "session-5",
    threshold: 5,
    caption: "I just completed session 5 of 22.",
  },
  {
    id: "session-11",
    threshold: 11,
    caption: "Halfway there. 11 × 22 minutes complete.",
  },
  {
    id: "session-17",
    threshold: 17,
    caption: "I just completed session 17 of 22.",
  },
  {
    id: "session-22",
    threshold: 22,
    caption: "22 sessions complete. 484 minutes for the mission.",
  },
];

export function milestoneCaptionWithHashtags(caption: string): string {
  return `${caption}\n\n${MILESTONE_HASHTAGS_TEXT}`;
}
