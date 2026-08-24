import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { Container } from "@/components/shared/container";
import { getTrainingObjectives, groupByDiscipline } from "@/lib/data/training-objectives";
import { DISCIPLINE_LABELS } from "@/components/training/training-objectives-checklist";
import type { TrainingDiscipline, TrainingObjectiveRow } from "@/types/database";
import { saveObjectivesAction, addObjectiveAction, deleteObjectiveAction } from "./actions";

const DISCIPLINES: TrainingDiscipline[] = ["swim", "bike", "run"];

function ObjectiveCheckbox({ objective }: { objective: TrainingObjectiveRow }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name={objective.id}
        defaultChecked={objective.completed}
        className="h-4 w-4 accent-bronze"
      />
      {objective.label}
    </label>
  );
}

export default async function TrainingObjectivesAdminPage() {
  await requireAdminUser();
  const objectives = await getTrainingObjectives();
  const grouped = groupByDiscipline(objectives);

  return (
    <Container className="max-w-3xl py-16">
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
        Check off objectives as you hit them — this powers the public checklist on{" "}
        <Link href="/journal" className="text-bronze hover:underline">
          the Journal
        </Link>
        .
      </p>

      <form action={saveObjectivesAction} className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {DISCIPLINES.map((discipline) => (
            <div key={discipline}>
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                {DISCIPLINE_LABELS[discipline]}
              </p>
              <div className="mt-3 space-y-2.5">
                {grouped[discipline].length === 0 ? (
                  <p className="text-xs text-charcoal-light/70">No objectives yet.</p>
                ) : (
                  grouped[discipline].map((objective) => (
                    <ObjectiveCheckbox key={objective.id} objective={objective} />
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
            <label htmlFor="discipline" className="text-xs font-medium text-ink">
              Discipline
            </label>
            <select
              id="discipline"
              name="discipline"
              defaultValue="swim"
              className="mt-1.5 block rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
            >
              {DISCIPLINES.map((discipline) => (
                <option key={discipline} value={discipline}>
                  {DISCIPLINE_LABELS[discipline]}
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
                    {DISCIPLINE_LABELS[objective.discipline]}
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
