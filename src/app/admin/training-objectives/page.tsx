import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { Container } from "@/components/shared/container";
import { getTrainingObjectives, groupByCategory } from "@/lib/data/training-objectives";
import { CATEGORY_LABELS } from "@/components/training/training-objectives-checklist";
import type { TrainingObjectiveCategory, TrainingObjectiveRow, TrainingObjectiveStatus } from "@/types/database";
import { saveObjectivesAction, addObjectiveAction, deleteObjectiveAction } from "./actions";

const CATEGORIES: TrainingObjectiveCategory[] = [
  "swim",
  "bike",
  "run",
  "brick",
  "vo2max",
  "strength",
  "race_readiness",
];

const STATUS_OPTIONS: { value: TrainingObjectiveStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "goal", label: "Goal (race day)" },
];

function ObjectiveRow({ objective }: { objective: TrainingObjectiveRow }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-ink/10 py-2 first:border-t-0 first:pt-0">
      <span className="min-w-0 flex-1 text-sm text-ink">{objective.label}</span>
      <select
        name={`status-${objective.id}`}
        defaultValue={objective.status}
        className="rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-xs text-ink"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        name={`tag-${objective.id}`}
        type="text"
        defaultValue={objective.tag ?? ""}
        placeholder="Tag (optional)"
        className="w-36 rounded-sm border border-ink/20 bg-off-white px-2 py-1.5 text-xs text-ink"
      />
    </div>
  );
}

export default async function TrainingObjectivesAdminPage() {
  await requireAdminUser();
  const objectives = await getTrainingObjectives();
  const grouped = groupByCategory(objectives);

  return (
    <Container className="max-w-4xl py-16">
      <Link
        href="/admin"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Overview
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">
        Training Objectives
      </h1>
      <p className="mt-1 text-sm text-charcoal-light">
        Update status and tags as benchmarks are hit — this powers the public ladder on{" "}
        <Link href="/the-race" className="text-bronze hover:underline">
          The Race
        </Link>
        .
      </p>

      <form action={saveObjectivesAction} className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="mt-2">
                {grouped[category].length === 0 ? (
                  <p className="text-xs text-charcoal-light/70">No objectives yet.</p>
                ) : (
                  grouped[category].map((objective) => (
                    <ObjectiveRow key={objective.id} objective={objective} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Save Progress
        </button>
      </form>

      <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Add Objective
        </h2>
        <form action={addObjectiveAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="category" className="text-xs font-medium text-ink">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue="swim"
              className="mt-1.5 block rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="label" className="text-xs font-medium text-ink">
              Objective
            </label>
            <input
              id="label"
              name="label"
              type="text"
              required
              className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <div>
            <label htmlFor="tag" className="text-xs font-medium text-ink">
              Tag (optional)
            </label>
            <input
              id="tag"
              name="tag"
              type="text"
              placeholder="Race distance"
              className="mt-1.5 w-36 rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            Add
          </button>
        </form>
      </div>

      {objectives.length > 0 && (
        <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
            Remove an Objective
          </h2>
          <ul className="mt-4 space-y-2">
            {objectives.map((objective) => (
              <li
                key={objective.id}
                className="flex items-center justify-between gap-3 border-t border-ink/10 pt-2 text-sm first:border-t-0 first:pt-0"
              >
                <span className="text-charcoal-light">
                  <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light/70">
                    {CATEGORY_LABELS[objective.category]}
                  </span>
                  {objective.label}
                </span>
                <form action={deleteObjectiveAction}>
                  <input type="hidden" name="id" value={objective.id} />
                  <button
                    type="submit"
                    className="shrink-0 text-xs font-semibold uppercase tracking-wide text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
