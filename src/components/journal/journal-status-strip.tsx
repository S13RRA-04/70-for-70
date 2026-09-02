import Link from "next/link";
import { TRAINING_PHASE_LABELS, getCurrentTrainingPhaseIndex } from "@/lib/campaign-phase";
import { CURRENT_CAMPAIGN, RACE_INFO } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

/**
 * Compact status row under the Journal hero — not a dashboard. Current
 * Phase reads "TBD" rather than guessing until RACE_INFO.trainingStartDate
 * is set (see getCurrentTrainingPhaseIndex, shared with /the-race so both
 * pages always agree).
 */
export function JournalStatusStrip({ latestEntryPublishedAt }: { latestEntryPublishedAt: string | null }) {
  const phaseIndex = getCurrentTrainingPhaseIndex();
  const currentPhase = phaseIndex !== undefined ? TRAINING_PHASE_LABELS[phaseIndex] : "TBD";

  const items: { label: string; value: React.ReactNode }[] = [
    { label: "Next Race", value: CURRENT_CAMPAIGN.event },
    {
      label: "Race Date",
      value: RACE_INFO.raceDate ? (
        <time dateTime={RACE_INFO.raceDate}>{formatDateLong(RACE_INFO.raceDate)}</time>
      ) : (
        "TBD"
      ),
    },
    { label: "Current Phase", value: currentPhase },
    {
      label: "Latest Journal Update",
      value: latestEntryPublishedAt ? (
        <time dateTime={latestEntryPublishedAt}>{formatDateLong(latestEntryPublishedAt)}</time>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <div className="mt-8 border-t border-off-white/15 pt-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-[10px] font-semibold uppercase tracking-widest text-off-white/50">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium text-off-white">{item.value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href="/the-race"
        className="mt-5 inline-block text-xs font-semibold uppercase tracking-wide text-bronze-light hover:text-bronze"
      >
        View Training Dashboard &rarr;
      </Link>
    </div>
  );
}
