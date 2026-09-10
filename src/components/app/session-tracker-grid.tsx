import { cn } from "@/lib/utils";

/**
 * Read-only visual tracker — unlike the marketing site's localStorage
 * tracker (a personal, unverified tool for people without accounts), every
 * tile here reflects a real logged public.activities row. Tiles aren't
 * independently toggleable; correcting a mistake means deleting the
 * actual session (see the Progress screen's timeline), not un-tapping a
 * tile.
 */
export function SessionTrackerGrid({ completed, total }: { completed: number; total: number }) {
  const sessionNumbers = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div role="group" aria-label={`${total}-session progress tracker`} className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11">
      {sessionNumbers.map((session) => {
        const isDone = session <= completed;
        return (
          <div
            key={session}
            aria-label={`Session ${session} of ${total}, ${isDone ? "complete" : "not complete"}`}
            className={cn(
              "flex min-h-[44px] items-center justify-center rounded-sm border font-display text-sm font-semibold tabular-nums",
              isDone ? "border-bronze bg-bronze text-off-white" : "border-ink/20 bg-off-white text-ink",
            )}
          >
            {String(session).padStart(2, "0")}
          </div>
        );
      })}
    </div>
  );
}
