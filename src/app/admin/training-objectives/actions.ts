"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_PATH = "/admin/training-objectives";
const DISCIPLINES = ["swim", "bike", "run"];

export async function saveObjectivesAction(formData: FormData) {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: objectives, error } = await admin
    .from("training_objectives")
    .select("id, completed");

  if (error || !objectives) {
    redirect(PAGE_PATH);
  }

  for (const objective of objectives) {
    const checked = formData.get(objective.id) === "on";
    if (checked !== objective.completed) {
      await admin
        .from("training_objectives")
        .update({ completed: checked, completed_at: checked ? new Date().toISOString() : null })
        .eq("id", objective.id);
    }
  }

  revalidatePath(PAGE_PATH);
  revalidatePath("/updates");
  redirect(PAGE_PATH);
}

export async function addObjectiveAction(formData: FormData) {
  await requireAdminUser();
  const discipline = String(formData.get("discipline") ?? "");
  const label = String(formData.get("label") ?? "").trim();

  if (!label || !DISCIPLINES.includes(discipline)) {
    redirect(PAGE_PATH);
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("training_objectives")
    .select("display_order")
    .eq("discipline", discipline)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  await admin.from("training_objectives").insert({ discipline, label, display_order: nextOrder });

  revalidatePath(PAGE_PATH);
  revalidatePath("/updates");
  redirect(PAGE_PATH);
}

export async function deleteObjectiveAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(PAGE_PATH);

  const admin = createAdminClient();
  await admin.from("training_objectives").delete().eq("id", id);

  revalidatePath(PAGE_PATH);
  revalidatePath("/updates");
  redirect(PAGE_PATH);
}
