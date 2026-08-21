import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_TRAINING_OBJECTIVES } from "./seed-data";
import type { TrainingDiscipline, TrainingObjectiveRow } from "@/types/database";

export async function getTrainingObjectives(): Promise<TrainingObjectiveRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_TRAINING_OBJECTIVES].sort(
      (a, b) => a.discipline.localeCompare(b.discipline) || a.display_order - b.display_order,
    );
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("training_objectives")
    .select("*")
    .order("discipline", { ascending: true })
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load training objectives, falling back to seed data:", error);
    return [...SEED_TRAINING_OBJECTIVES].sort(
      (a, b) => a.discipline.localeCompare(b.discipline) || a.display_order - b.display_order,
    );
  }

  return data;
}

export type TrainingObjectivesByDiscipline = Record<TrainingDiscipline, TrainingObjectiveRow[]>;

export function groupByDiscipline(objectives: TrainingObjectiveRow[]): TrainingObjectivesByDiscipline {
  return {
    swim: objectives.filter((o) => o.discipline === "swim"),
    bike: objectives.filter((o) => o.discipline === "bike"),
    run: objectives.filter((o) => o.discipline === "run"),
  };
}
