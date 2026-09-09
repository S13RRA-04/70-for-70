"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TriathlonApplicationStatus } from "@/types/database";

const LIST_PATH = "/admin/triathlon-team";

function withError(id: string, message: string) {
  return `${LIST_PATH}/${id}?error=${encodeURIComponent(message)}`;
}

function revalidateApplicationPaths(id: string) {
  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${id}`);
}

export async function updateApplicationStatusAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TriathlonApplicationStatus;
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin.from("triathlon_team_applications").update({ status }).eq("id", id);

  if (error) {
    redirect(withError(id, "Failed to update status."));
  }

  revalidateApplicationPaths(id);
  redirect(`${LIST_PATH}/${id}`);
}

export async function saveApplicationNotesAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const adminNotes = String(formData.get("adminNotes") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin
    .from("triathlon_team_applications")
    .update({ admin_notes: adminNotes || null })
    .eq("id", id);

  if (error) {
    redirect(withError(id, "Failed to save notes."));
  }

  revalidateApplicationPaths(id);
  redirect(`${LIST_PATH}/${id}`);
}
