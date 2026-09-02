import { cn } from "@/lib/utils";
import type { JournalMilestone, JournalMilestoneStatus } from "@/lib/data/journal-milestones";

const STATUS_LABEL: Record<JournalMilestoneStatus, string> = {
  complete: "Complete",
  current: "In Progress",
  upcoming: "Ahead",
};

/**
 * Restrained campaign timeline, not a project tracker — see AGENTS.md's
 * Journal brief §3. Driven entirely by the milestones array passed in, so
 * a 5th/6th entry needs no layout changes here.
 */
export function RoadSoFar({ milestones }: { milestones: (JournalMilestone & { status: JournalMilestoneStatus })[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {milestones.map((milestone) => {
        const isComplete = milestone.status === "complete";
        const isCurrent = milestone.status === "current";
        return (
          <li
            key={milestone.id}
            className={cn(
              "rounded-sm border p-4",
              isComplete
                ? "border-bronze/40 bg-bronze/5"
                : isCurrent
                  ? "border-bronze bg-bronze/10"
                  : "border-ink/10 bg-off-white",
            )}
          >
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-widest",
                isComplete || isCurrent ? "text-bronze" : "text-charcoal-light/60",
              )}
            >
              {STATUS_LABEL[milestone.status]}
            </span>
            <h3
              className={cn(
                "mt-1.5 font-display text-sm font-semibold uppercase tracking-wide",
                isComplete || isCurrent ? "text-ink" : "text-charcoal-light",
              )}
            >
              {milestone.title}
            </h3>
            <p className="mt-1 text-sm text-charcoal-light">{milestone.description}</p>
            {milestone.date && (
              <time dateTime={milestone.date} className="mt-1.5 block text-xs text-charcoal-light/70">
                {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
                  new Date(milestone.date),
                )}
              </time>
            )}
          </li>
        );
      })}
    </ol>
  );
}
