"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventLiveStatus } from "@/types/database";

const SETTINGS_PATH = "/admin/22-for-the-22/settings";

export async function updateEventConfigAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(SETTINGS_PATH);

  const statusOverrideValue = String(formData.get("statusOverride") ?? "");
  const statusOverride: EventLiveStatus | null =
    statusOverrideValue === "pre" || statusOverrideValue === "live" || statusOverrideValue === "complete"
      ? statusOverrideValue
      : null;

  const fundraisingGoal = Number(formData.get("fundraisingGoal") ?? 0);
  const amountRaised = Number(formData.get("amountRaised") ?? 0);
  const merchUrl = String(formData.get("merchUrl") ?? "").trim();
  const donateUrl = String(formData.get("donateUrl") ?? "").trim();
  const officialRulesBody = String(formData.get("officialRulesBody") ?? "").trim();
  const winnerAnnouncement = String(formData.get("winnerAnnouncement") ?? "").trim();

  const admin = createAdminClient();
  const { error } = await admin
    .from("event_config")
    .update({
      status_override: statusOverride,
      registration_open: formData.get("registrationOpen") === "on",
      fundraising_goal: Number.isFinite(fundraisingGoal) ? fundraisingGoal : 0,
      amount_raised: Number.isFinite(amountRaised) ? amountRaised : 0,
      merch_url: merchUrl || null,
      donate_url: donateUrl || null,
      official_rules_body: officialRulesBody || null,
      winner_announcement: winnerAnnouncement || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    redirect(`${SETTINGS_PATH}?error=${encodeURIComponent("Failed to save event settings.")}`);
  }

  revalidatePath(SETTINGS_PATH);
  revalidatePath("/22forthe22");
  revalidatePath("/22forthe22/rules");
  redirect(SETTINGS_PATH);
}
