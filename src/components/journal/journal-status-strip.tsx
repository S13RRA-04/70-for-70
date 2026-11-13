import {
  TRAINING_PHASE_LABELS,
  TRAINING_PHASE_DESCRIPTIONS,
  getCurrentTrainingPhaseIndex,
  getWeeksToRace,
} from "@/lib/campaign-phase";
import { RACE_INFO } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";

/**
 * Single-line status row under the Journal hero — race date, current
 * phase, weeks to race. Deliberately not a stat-card grid (that was the
 * previous design): this is one glanceable line, not a dashboard, in
 * keeping with the page's editorial-over-data direction.
 */
export function JournalStatusStrip() {
  const phaseIndex = getCurrentTrainingPhaseIndex();
  const currentPhase =
    phaseIndex !== undefined ? TRAINING_PHASE_DESCRIPTIONS[TRAINING_PHASE_LABELS[phaseIndex]] : "TBD";
  const weeksToRace = getWeeksToRace();

  const parts = [
    RACE_INFO.raceDate ? formatDateLong(RACE_INFO.raceDate) : "Race Date TBD",
    currentPhase,
    weeksToRace !== null ? `${weeksToRace} Weeks to Race` : null,
  ].filter((part): part is string => Boolean(part));

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-off-white/15 pt-6 text-sm font-medium text-off-white/80">
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-off-white/40">&middot;</span>}
          {part}
        </span>
      ))}
    </div>
  );
}
