import { cn } from "@/lib/utils";

const PHASES = ["Base", "Build", "Specific", "Peak", "Race"] as const;

/**
 * Compact training-arc context — not a detailed training plan. `currentIndex`
 * is optional and should only be passed once it's computable from real
 * dates (see the-race/page.tsx: both a training start date and a race date
 * are required); without it, the sequence renders with nothing claimed as
 * "current" rather than guessing.
 */
export function TrainingTimeline({ currentIndex }: { currentIndex?: number }) {
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
            {i < PHASES.length - 1 && (
              <span aria-hidden="true" className="text-charcoal-light/40">
                &rarr;
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
