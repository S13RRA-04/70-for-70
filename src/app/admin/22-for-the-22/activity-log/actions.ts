"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentEventConfig } from "@/lib/data/event-config";

const PAGE_PATH = "/admin/22-for-the-22/activity-log";

export async function addActivityLogEntryAction(formData: FormData) {
  await requireAdminUser();
  const hourLabel = String(formData.get("hourLabel") ?? "").trim();
  const activityLabel = String(formData.get("activityLabel") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!hourLabel || !activityLabel) redirect(PAGE_PATH);

  const event = await getCurrentEventConfig();
  if (!event) redirect(PAGE_PATH);

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("event_activity_log")
    .select("display_order")
    .eq("event_id", event.id)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  await admin.from("event_activity_log").insert({
    event_id: event.id,
    display_order: nextOrder,
    hour_label: hourLabel,
    activity_label: activityLabel,
    note: note || null,
  });

  revalidatePath(PAGE_PATH);
  revalidatePath("/22forthe22");
  redirect(PAGE_PATH);
}

export async function deleteActivityLogEntryAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(PAGE_PATH);

  const admin = createAdminClient();
  await admin.from("event_activity_log").delete().eq("id", id);

  revalidatePath(PAGE_PATH);
  revalidatePath("/22forthe22");
  redirect(PAGE_PATH);
}
