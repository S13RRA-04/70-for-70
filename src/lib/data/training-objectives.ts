import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_TRAINING_OBJECTIVES } from "./seed-data";
import type { TrainingObjectiveCategory, TrainingObjectiveRow } from "@/types/database";

export async function getTrainingObjectives(): Promise<TrainingObjectiveRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_TRAINING_OBJECTIVES].sort(
      (a, b) => a.category.localeCompare(b.category) || a.display_order - b.display_order,
    );
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("training_objectives")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load training objectives, falling back to seed data:", error);
    return [...SEED_TRAINING_OBJECTIVES].sort(
      (a, b) => a.category.localeCompare(b.category) || a.display_order - b.display_order,
    );
  }

  return data;
}

export type TrainingObjectivesByCategory = Record<TrainingObjectiveCategory, TrainingObjectiveRow[]>;

export function groupByCategory(objectives: TrainingObjectiveRow[]): TrainingObjectivesByCategory {
  return {
    swim: objectives.filter((o) => o.category === "swim"),
    bike: objectives.filter((o) => o.category === "bike"),
    run: objectives.filter((o) => o.category === "run"),
    brick: objectives.filter((o) => o.category === "brick"),
    vo2max: objectives.filter((o) => o.category === "vo2max"),
    strength: objectives.filter((o) => o.category === "strength"),
    race_readiness: objectives.filter((o) => o.category === "race_readiness"),
  };
}
