"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const DASHBOARD_PATH = "/admin/for-the-22-app";

export async function updateAppEventAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(DASHBOARD_PATH);

  const status = String(formData.get("status") ?? "draft");
  const requiredSessions = Number(formData.get("requiredSessions") ?? 0);
  const minimumSessionMinutes = Number(formData.get("minimumSessionMinutes") ?? 0);
  const minimumTotalMinutes = Number(formData.get("minimumTotalMinutes") ?? 0);
  const startAt = String(formData.get("startAt") ?? "");
  const endAt = String(formData.get("endAt") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  // registration_close_at is a timestamp, not a boolean — "open" means null
  // (no close time set), "closed" means a close time at or before now. See
  // isAppEventRegistrationOpen(), the single place that reads this back.
  const registrationOpenChecked = formData.get("registrationOpen") === "on";

  const admin = createAdminClient();
  const { data: existing } = await admin.from("events").select("registration_open_at").eq("id", id).maybeSingle();

  const { error } = await admin
    .from("events")
    .update({
      status,
      registration_open_at: existing?.registration_open_at ?? new Date().toISOString(),
      registration_close_at: registrationOpenChecked ? null : new Date().toISOString(),
      required_sessions: Number.isFinite(requiredSessions) && requiredSessions > 0 ? requiredSessions : null,
      minimum_session_minutes:
        Number.isFinite(minimumSessionMinutes) && minimumSessionMinutes > 0 ? minimumSessionMinutes : null,
      minimum_total_minutes:
        Number.isFinite(minimumTotalMinutes) && minimumTotalMinutes > 0 ? minimumTotalMinutes : null,
      start_at: startAt ? new Date(startAt).toISOString() : undefined,
      end_at: endAt ? new Date(endAt).toISOString() : undefined,
      description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) console.error("Failed to update app event:", error);

  revalidatePath(DASHBOARD_PATH);
  redirect(DASHBOARD_PATH);
}
