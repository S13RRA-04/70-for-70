import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CampaignPhase } from "@/lib/campaign-phase";

const COPY: Partial<Record<CampaignPhase, { label: string; body: string }>> = {
  "race-week": {
    label: "Race Week",
    body: "Race day is this week — follow training updates now and race-day tracking once it starts.",
  },
  "race-day": {
    label: "Race Day",
    body: "Today's the day. Follow live race-day status and fundraising progress.",
  },
  completed: {
    label: "Race Complete",
    body: "The race is done, but fundraising toward the goal continues.",
  },
};

/**
 * Renders nothing during the default "active" phase — see getCampaignPhase().
 *
 * `tone` describes the surface the banner is dropped onto, which differs per
 * host page. The band, copy and fill all have to flip together: the original
 * light-only tokens (bg-bronze/10, text-bronze, text-charcoal-light) are
 * illegible over a dark band, and the fill needs an ink label there for the
 * same reason CTASection/CTAButton do.
 */
export function CampaignPhaseBanner({
  phase,
  tone = "light",
}: {
  phase: CampaignPhase;
  tone?: "dark" | "light";
}) {
  const copy = COPY[phase];
  if (!copy) return null;

  const isDark = tone === "dark";
  const showLiveLink = phase === "race-week" || phase === "race-day";
  // Three-tier escalation instead of identical styling for every phase:
  // completed is the quietest (resolved, retrospective), race-week is the
  // existing muted tint (building anticipation), race-day is the one solid
  // fill (happening right now) — the highest-urgency moment previously
  // looked no different from the other two. Stays within the existing
  // bronze palette rather than reaching for `signal`, which is reserved for
  // crisis/emergency CTAs only (see its own doc comment in globals.css).
  const isRaceDay = phase === "race-day";

  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-center justify-between gap-3 rounded-sm border px-5 py-4",
        isRaceDay
          ? "border-bronze bg-bronze"
          : isDark
            ? "border-bronze/40 bg-bronze/15"
            : "border-bronze/40 bg-bronze/10",
      )}
    >
      <div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-widest",
            isRaceDay ? "text-ink" : isDark ? "text-bronze-light" : "text-bronze-text",
          )}
        >
          {copy.label}
        </p>
        <p
          className={cn(
            "mt-1 text-sm",
            isRaceDay ? "text-ink/80" : isDark ? "text-off-white/80" : "text-charcoal-light",
          )}
        >
          {copy.body}
        </p>
      </div>
      {showLiveLink && (
        <Link
          href="/live"
          className={cn(
            "shrink-0 rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
            isRaceDay
              ? "bg-ink text-off-white hover:bg-anchor-light"
              : isDark
                ? "bg-bronze text-ink hover:bg-bronze-light"
                : "bg-bronze-text text-off-white hover:bg-bronze-dark",
          )}
        >
          Race Day Live &rarr;
        </Link>
      )}
    </div>
  );
}
