"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TrainingObjectiveStatus } from "@/types/database";

const PAGE_PATH = "/admin/training-objectives";
const CATEGORIES = ["swim", "bike", "run", "brick", "vo2max", "strength", "race_readiness"];
const STATUSES: TrainingObjectiveStatus[] = ["not_started", "in_progress", "done", "goal"];

export async function saveObjectivesAction(formData: FormData) {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: objectives, error } = await admin
    .from("training_objectives")
    .select("id, status, tag, completed_at");

  if (error || !objectives) {
    redirect(PAGE_PATH);
  }

  for (const objective of objectives) {
    const statusValue = formData.get(`status-${objective.id}`);
    const status = STATUSES.includes(statusValue as TrainingObjectiveStatus)
      ? (statusValue as TrainingObjectiveStatus)
      : objective.status;
    const tagValue = String(formData.get(`tag-${objective.id}`) ?? "").trim();
    const tag = tagValue.length > 0 ? tagValue : null;

    const becameDone = (status === "done" || status === "goal") && objective.status !== "done" && objective.status !== "goal";
    const becameUndone = status !== "done" && status !== "goal" && (objective.status === "done" || objective.status === "goal");

    if (status !== objective.status || tag !== objective.tag) {
      await admin
        .from("training_objectives")
        .update({
          status,
          tag,
          completed_at: becameDone ? new Date().toISOString() : becameUndone ? null : objective.completed_at,
        })
        .eq("id", objective.id);
    }
  }

  revalidatePath(PAGE_PATH);
  revalidatePath("/the-race");
  redirect(PAGE_PATH);
}

export async function addObjectiveAction(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const tagValue = String(formData.get("tag") ?? "").trim();

  if (!label || !CATEGORIES.includes(category)) {
    redirect(PAGE_PATH);
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("training_objectives")
    .select("display_order")
    .eq("category", category)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  await admin.from("training_objectives").insert({
    category,
    label,
    display_order: nextOrder,
    tag: tagValue.length > 0 ? tagValue : null,
  });

  revalidatePath(PAGE_PATH);
  revalidatePath("/the-race");
  redirect(PAGE_PATH);
}

export async function deleteObjectiveAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(PAGE_PATH);

  const admin = createAdminClient();
  await admin.from("training_objectives").delete().eq("id", id);

  revalidatePath(PAGE_PATH);
  revalidatePath("/the-race");
  redirect(PAGE_PATH);
}
