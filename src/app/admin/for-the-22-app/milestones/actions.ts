"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerError } from "@/lib/log";

const MILESTONES_PATH = "/admin/for-the-22-app/milestones";

export async function updateMilestoneAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(MILESTONES_PATH);

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const shareTemplate = String(formData.get("shareTemplate") ?? "").trim();

  const admin = createAdminClient();
  const { error } = await admin
    .from("milestones")
    .update({ title, message, share_template: shareTemplate || null })
    .eq("id", id);

  if (error) {
    logServerError("for-the-22-app: failed to update milestone", error);
    redirect(`${MILESTONES_PATH}?error=${encodeURIComponent("Failed to update milestone.")}`);
  }

  revalidatePath(MILESTONES_PATH);
  redirect(MILESTONES_PATH);
}
