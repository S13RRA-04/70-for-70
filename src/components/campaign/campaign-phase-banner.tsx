import Link from "next/link";
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

/** Renders nothing during the default "active" phase — see getCampaignPhase(). */
export function CampaignPhaseBanner({ phase }: { phase: CampaignPhase }) {
  const copy = COPY[phase];
  if (!copy) return null;

  const showLiveLink = phase === "race-week" || phase === "race-day";

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-bronze/40 bg-bronze/10 px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{copy.label}</p>
        <p className="mt-1 text-sm text-charcoal-light">{copy.body}</p>
      </div>
      {showLiveLink && (
        <Link
          href="/live"
          className="shrink-0 rounded-sm bg-bronze px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Race Day Live &rarr;
        </Link>
      )}
    </div>
  );
}
