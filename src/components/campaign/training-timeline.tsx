import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRAINING_PHASE_LABELS as PHASES } from "@/lib/campaign-phase";

/**
 * Compact training-arc context — not a detailed training plan. `currentIndex`
 * is optional and should only be passed once it's computable from real
 * dates (see the-race/page.tsx: both a training start date and a race date
 * are required); without it, the sequence renders with nothing claimed as
 * "current" rather than guessing. `raceDateLabel` (e.g. "May 16, 2027"),
 * when passed, appends a visually distinct finish marker after the phase
 * pills — additive only, PHASES itself (canonical training-plan data) is
 * never modified to add a fake "Chattanooga" phase.
 */
export function TrainingTimeline({
  currentIndex,
  raceDateLabel,
}: {
  currentIndex?: number;
  raceDateLabel?: string | null;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {PHASES.map((phase, i) => {
        const isCurrent = currentIndex === i;
        const isPast = currentIndex !== undefined && i < currentIndex;
        return (
          <li key={phase} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide",
                isCurrent
                  ? "border-bronze bg-bronze text-off-white"
                  : isPast
                    ? "border-ink/15 text-charcoal-light/50"
                    : "border-ink/15 text-charcoal-light",
              )}
            >
              {phase}
            </span>
            {(i < PHASES.length - 1 || raceDateLabel) && (
              <span aria-hidden="true" className="text-charcoal-light/40">
                &rarr;
              </span>
            )}
          </li>
        );
      })}
      {raceDateLabel && (
        <li className="flex items-center gap-1.5 rounded-full border border-bronze bg-ink px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-off-white">
          <Flag size={12} aria-hidden />
          Chattanooga
          <span className="text-off-white/60">· {raceDateLabel}</span>
        </li>
      )}
    </ol>
  );
}
