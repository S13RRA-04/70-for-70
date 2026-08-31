import { CheckCircle2, Circle, CircleDot, Target, Waves, Bike, Footprints, Repeat, HeartPulse, Dumbbell, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { groupByCategory } from "@/lib/data/training-objectives";
import type { TrainingObjectiveCategory, TrainingObjectiveRow } from "@/types/database";

export const CATEGORY_LABELS: Record<TrainingObjectiveCategory, string> = {
  swim: "Swim",
  bike: "Bike",
  run: "Run",
  brick: "Brick",
  vo2max: "VO2 Max",
  strength: "Hybrid Strength",
  race_readiness: "Race Readiness",
};

/** Shown under a category's header, in place of a doneCount claim — for
 * categories that are context rather than a checklist to clear. */
const CATEGORY_SUBTITLE: Partial<Record<TrainingObjectiveCategory, string>> = {
  vo2max: "Supporting fitness indicator",
};

const CATEGORY_ICON: Record<TrainingObjectiveCategory, typeof Waves> = {
  swim: Waves,
  bike: Bike,
  run: Footprints,
  brick: Repeat,
  vo2max: HeartPulse,
  strength: Dumbbell,
  race_readiness: Flag,
};

/** Rendering order — race_readiness (the summary/goal category) reads best last. */
const CATEGORY_ORDER: TrainingObjectiveCategory[] = [
  "swim",
  "bike",
  "run",
  "brick",
  "vo2max",
  "strength",
  "race_readiness",
];

function ObjectiveRow({ objective }: { objective: TrainingObjectiveRow }) {
  const isCurrent = objective.status === "in_progress";
  const hasMetric =
    objective.metric_historical || objective.metric_current || objective.metric_next || objective.metric_goal;

  return (
    <li
      className={cn(
        "flex items-start gap-2 rounded-sm px-2 py-1.5 -mx-2",
        isCurrent && "bg-bronze/10",
      )}
    >
      {objective.status === "done" && (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-olive" aria-hidden="true" />
      )}
      {objective.status === "in_progress" && (
        <CircleDot size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden="true" />
      )}
      {objective.status === "not_started" && (
        <Circle size={16} className="mt-0.5 shrink-0 text-ink/25" aria-hidden="true" />
      )}
      {objective.status === "goal" && (
        <Target size={16} className="mt-0.5 shrink-0 text-bronze" aria-hidden="true" />
      )}

      <span className="flex flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "text-sm",
              objective.status === "done" && "text-charcoal-light/70 line-through",
              objective.status === "not_started" && "text-charcoal-light",
              (isCurrent || objective.status === "goal") && "font-semibold text-ink",
            )}
          >
            {objective.label}
          </span>
          {objective.tag && (
            <span className="rounded-full border border-bronze/30 bg-bronze/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-bronze">
              {objective.tag}
            </span>
          )}
        </span>
        {hasMetric && (
          <span className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-charcoal-light">
            {objective.metric_historical && (
              <span>
                Historical: <span className="font-semibold text-ink">{objective.metric_historical}</span>
              </span>
            )}
            <span>
              Current: <span className="font-semibold text-ink">{objective.metric_current ?? "TBD"}</span>
            </span>
            {objective.metric_next && (
              <span>
                Next: <span className="font-semibold text-ink">{objective.metric_next}</span>
              </span>
            )}
            {objective.metric_goal && (
              <span>
                Race: <span className="font-semibold text-ink">{objective.metric_goal}</span>
              </span>
            )}
          </span>
        )}
      </span>
    </li>
  );
}

function CategoryCard({
  category,
  objectives,
}: {
  category: TrainingObjectiveCategory;
  objectives: TrainingObjectiveRow[];
}) {
  const Icon = CATEGORY_ICON[category];
  const doneCount = objectives.filter((o) => o.status === "done" || o.status === "goal").length;

  return (
    <div className="mb-4 break-inside-avoid rounded-sm border border-ink/10 bg-off-white p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-ink">
          <Icon size={16} className="text-bronze" aria-hidden="true" />
          {CATEGORY_LABELS[category]}
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          {doneCount} of {objectives.length}
        </p>
      </div>
      {CATEGORY_SUBTITLE[category] && (
        <p className="mt-1 text-xs italic text-charcoal-light/70">{CATEGORY_SUBTITLE[category]}</p>
      )}
      <ul className="mt-3 space-y-1">
        {objectives.map((objective) => (
          <ObjectiveRow key={objective.id} objective={objective} />
        ))}
      </ul>
    </div>
  );
}

export function TrainingObjectivesChecklist({ objectives }: { objectives: TrainingObjectiveRow[] }) {
  if (objectives.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-ink/15 bg-off-white p-6 text-center">
        <p className="text-sm text-charcoal-light">Training objectives are on the way.</p>
      </div>
    );
  }

  const grouped = groupByCategory(objectives);
  const total = objectives.length;
  const totalDone = objectives.filter((o) => o.status === "done" || o.status === "goal").length;

  return (
    <div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {CATEGORY_ORDER.filter((category) => grouped[category].length > 0).map((category) => (
          <CategoryCard key={category} category={category} objectives={grouped[category]} />
        ))}
      </div>
      <p className="mt-2 text-xs text-charcoal-light">{totalDone} of {total} benchmarks reached.</p>
    </div>
  );
}
