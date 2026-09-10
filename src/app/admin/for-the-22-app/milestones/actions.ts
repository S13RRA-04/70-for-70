"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const MILESTONES_PATH = "/admin/for-the-22-app/milestones";

export async function updateMilestoneAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const shareTemplate = String(formData.get("shareTemplate") ?? "").trim();

  const admin = createAdminClient();
  const { error } = await admin
    .from("milestones")
    .update({ title, message, share_template: shareTemplate || null })
    .eq("id", id);

  if (error) console.error("Failed to update milestone:", error);
  revalidatePath(MILESTONES_PATH);
}
