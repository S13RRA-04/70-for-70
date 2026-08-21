import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { groupByDiscipline } from "@/lib/data/training-objectives";
import type { TrainingDiscipline, TrainingObjectiveRow } from "@/types/database";

export const DISCIPLINE_LABELS: Record<TrainingDiscipline, string> = {
  swim: "Swim",
  bike: "Bike",
  run: "Run",
};

function DisciplineColumn({
  discipline,
  objectives,
}: {
  discipline: TrainingDiscipline;
  objectives: TrainingObjectiveRow[];
}) {
  const completedCount = objectives.filter((o) => o.completed).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          {DISCIPLINE_LABELS[discipline]}
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          {completedCount} of {objectives.length}
        </p>
      </div>
      <ul className="mt-3 space-y-2">
        {objectives.map((objective) => (
          <li key={objective.id} className="flex items-start gap-2">
            {objective.completed ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
            ) : (
              <Circle size={16} className="mt-0.5 shrink-0 text-ink/25" aria-hidden="true" />
            )}
            <span
              className={cn(
                "text-sm",
                objective.completed ? "text-charcoal-light/70 line-through" : "text-charcoal-light",
              )}
            >
              {objective.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrainingObjectivesChecklist({ objectives }: { objectives: TrainingObjectiveRow[] }) {
  if (objectives.length === 0) {
    return (
      <EmptyState
        title="Training objectives are on the way."
        description="Swim, bike, and run milestones will appear here as they're set."
      />
    );
  }

  const grouped = groupByDiscipline(objectives);
  const total = objectives.length;
  const totalCompleted = objectives.filter((o) => o.completed).length;

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-3">
        <DisciplineColumn discipline="swim" objectives={grouped.swim} />
        <DisciplineColumn discipline="bike" objectives={grouped.bike} />
        <DisciplineColumn discipline="run" objectives={grouped.run} />
      </div>
      <p className="mt-6 text-xs text-charcoal-light">
        {totalCompleted} of {total} objectives complete.
      </p>
    </div>
  );
}
