import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRAINING_PHASE_LABELS as PHASES } from "@/lib/campaign-phase";

/** One-line explanation per phase — descriptive captions only, doesn't change which phase is "current" (see CURRENT_TRAINING_PHASE in campaign-phase.ts, a manually-tracked value this component never computes on its own). */
const PHASE_DESCRIPTIONS: Record<(typeof PHASES)[number], string> = {
  Base: "Build aerobic capacity, durability, and technique.",
  Build: "Increase volume and discipline-specific workload.",
  Specific: "Increase race-specific intensity, pacing, and terrain preparation.",
  Peak: "Highest race-specific fitness and key simulation work.",
  Race: "Toe the line and execute the plan.",
};

/**
 * The training arc, Base through Race, as a horizontal progress timeline on
 * desktop (stacked on mobile) — `currentIndex` is optional and should only
 * be passed once it's computable from real dates (see the-race/page.tsx:
 * both a training start date and a race date are required); without it,
 * the sequence renders with nothing claimed as "current" rather than
 * guessing. `raceDateLabel` (e.g. "May 16, 2027"), when passed, appends a
 * visually distinct finish marker after the phase pills — additive only,
 * PHASES itself (canonical training-plan data) is never modified to add a
 * fake "Chattanooga" phase.
 */
export function TrainingTimeline({
  currentIndex,
  raceDateLabel,
}: {
  currentIndex?: number;
  raceDateLabel?: string | null;
}) {
  return (
    <ol className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
      {PHASES.map((phase, i) => {
        const isCurrent = currentIndex === i;
        const isPast = currentIndex !== undefined && i < currentIndex;
        return (
          <li key={phase} className="flex flex-1 gap-4 lg:flex-col lg:gap-0">
            <div className="flex flex-col items-center lg:w-full lg:flex-row">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold",
                  isCurrent
                    ? "border-bronze bg-bronze text-off-white"
                    : isPast
                      ? "border-ink/20 bg-ink/5 text-charcoal-light/50"
                      : "border-ink/20 bg-off-white text-charcoal-light",
                )}
              >
                {i + 1}
              </span>
              {i < PHASES.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden lg:block lg:h-0.5 lg:flex-1",
                    isPast ? "bg-bronze/40" : "bg-ink/10",
                  )}
                />
              )}
            </div>

            <div className="lg:mt-3 lg:pr-4">
              <p
                className={cn(
                  "font-display text-base font-bold uppercase tracking-wide",
                  isCurrent ? "text-bronze" : "text-ink",
                )}
              >
                {phase}
                {isCurrent && <span className="ml-2 text-[10px] tracking-widest text-bronze">CURRENT</span>}
              </p>
              <p className="mt-1 text-sm leading-snug text-charcoal-light">{PHASE_DESCRIPTIONS[phase]}</p>
            </div>
          </li>
        );
      })}

      {raceDateLabel && (
        <li className="flex flex-1 gap-4 lg:flex-col lg:gap-0">
          <div className="flex flex-col items-center lg:w-full lg:flex-row">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-bronze bg-ink text-off-white">
              <Flag size={16} aria-hidden />
            </span>
          </div>
          <div className="lg:mt-3">
            <p className="font-display text-base font-bold uppercase tracking-wide text-ink">Race</p>
            <p className="mt-1 text-sm leading-snug text-charcoal-light">
              IRONMAN 70.3 Chattanooga
              <br />
              {raceDateLabel}
            </p>
          </div>
        </li>
      )}
    </ol>
  );
}
