"use client";

import { useSyncExternalStore } from "react";
import {
  MINUTES_PER_SESSION,
  SESSION_MILESTONES,
  SHARING_OPTIONAL_NOTE,
  TOTAL_MINUTES,
  TOTAL_SESSIONS,
  TRACKER_ELIGIBILITY_NOTE,
  milestoneCaptionWithHashtags,
  sessionTrackerStorageKey,
} from "@/lib/content/22-for-the-22-tracker";
import { CURRENT_EVENT_SLUG } from "@/lib/content/22-for-the-22";
import { ShareButtons } from "@/components/shared/share-buttons";
import { CopyButton } from "./promokit/copy-button";
import { EVENT22_CAMPAIGN_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STORAGE_KEY = sessionTrackerStorageKey(CURRENT_EVENT_SLUG);
const SESSION_NUMBERS = Array.from({ length: TOTAL_SESSIONS }, (_, i) => i + 1);
const listeners = new Set<() => void>();

/**
 * localStorage as a React external store (see useSyncExternalStore docs) —
 * lets every SessionTracker instance stay in sync with the same underlying
 * value without ever calling setState inside an effect (this codebase's
 * lint config forbids that pattern; see EventStatusClock/Countdown's
 * useMounted for the sibling pattern used for hydration-only state).
 * getSnapshot returns the raw JSON string, not a parsed Set, so repeated
 * calls with no change return an equal value — required for
 * useSyncExternalStore to avoid re-render loops.
 */
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

function parseCompleted(raw: string): Set<number> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n): n is number => typeof n === "number" && n >= 1 && n <= TOTAL_SESSIONS));
  } catch {
    return new Set();
  }
}

function writeCompleted(next: Set<number>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // localStorage unavailable (private browsing, full storage) — tracker still works for this page view, just won't persist.
  }
  for (const listener of listeners) listener();
}

/**
 * Personal, local-browser progress tool — the site has no participant
 * accounts to persist this server-side (see the content file's doc
 * comment). Never gates or reports giveaway eligibility — see
 * TRACKER_ELIGIBILITY_NOTE.
 */
export function SessionTracker() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completed = parseCompleted(raw);

  function toggle(session: number) {
    const next = new Set(completed);
    if (next.has(session)) next.delete(session);
    else next.add(session);
    writeCompleted(next);
  }

  const completedCount = completed.size;
  const minutesLogged = completedCount * MINUTES_PER_SESSION;

  const reachedMilestone = SESSION_MILESTONES.filter(
    (m): m is typeof m & { threshold: number } => m.threshold !== null && m.threshold <= completedCount,
  ).sort((a, b) => b.threshold - a.threshold)[0];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
          {completedCount} OF {TOTAL_SESSIONS} COMPLETE
        </p>
        <p className="text-sm font-semibold uppercase tracking-wide text-charcoal-light">
          {minutesLogged} OF {TOTAL_MINUTES} MINUTES
        </p>
      </div>

      <div
        role="group"
        aria-label="22-session progress tracker"
        className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11"
      >
        {SESSION_NUMBERS.map((session) => {
          const isDone = completed.has(session);
          return (
            <button
              key={session}
              type="button"
              onClick={() => toggle(session)}
              aria-pressed={isDone}
              aria-label={`Session ${session} of ${TOTAL_SESSIONS}, ${isDone ? "complete" : "not complete"}`}
              data-analytics-event="tracker_session_toggle"
              className={cn(
                "flex min-h-[44px] items-center justify-center rounded-sm border font-display text-sm font-semibold tabular-nums transition-colors",
                isDone
                  ? "border-bronze bg-bronze text-off-white"
                  : "border-ink/20 bg-off-white text-ink hover:border-bronze/50",
              )}
            >
              {String(session).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-charcoal-light/80">{TRACKER_ELIGIBILITY_NOTE}</p>

      {reachedMilestone && (
        <div className="mt-6 rounded-sm border border-bronze/30 bg-bronze/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Milestone Reached</p>
          <p className="mt-2 text-sm text-ink">{reachedMilestone.caption}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <CopyButton
              text={milestoneCaptionWithHashtags(reachedMilestone.caption)}
              label="Copy Caption"
              analyticsEvent="tracker_milestone_caption_copy"
            />
            <ShareButtons
              url={EVENT22_CAMPAIGN_URL}
              title={reachedMilestone.caption}
              analyticsEvent="tracker_milestone_share_click"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-charcoal-light/80">{SHARING_OPTIONAL_NOTE}</p>
        </div>
      )}
    </div>
  );
}
