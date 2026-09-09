"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventRegistrationStatus } from "@/types/database";

const LIST_PATH = "/admin/22-for-the-22";

function withError(id: string, message: string) {
  return `${LIST_PATH}/${id}?error=${encodeURIComponent(message)}`;
}

function revalidateRegistrationPaths(id: string) {
  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${id}`);
}

export async function updateRegistrationStatusAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as EventRegistrationStatus;
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin.from("event_registrations").update({ status }).eq("id", id);

  if (error) {
    redirect(withError(id, "Failed to update status."));
  }

  revalidateRegistrationPaths(id);
  redirect(`${LIST_PATH}/${id}`);
}

export async function setGiveawayEligibleAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const giveawayEligible = formData.get("giveawayEligible") === "on";
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin
    .from("event_registrations")
    .update({ giveaway_eligible: giveawayEligible })
    .eq("id", id);

  if (error) {
    redirect(withError(id, "Failed to update giveaway eligibility."));
  }

  revalidateRegistrationPaths(id);
  redirect(`${LIST_PATH}/${id}`);
}

export async function saveRegistrationNotesAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const adminNotes = String(formData.get("adminNotes") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin
    .from("event_registrations")
    .update({ admin_notes: adminNotes || null })
    .eq("id", id);

  if (error) {
    redirect(withError(id, "Failed to save notes."));
  }

  revalidateRegistrationPaths(id);
  redirect(`${LIST_PATH}/${id}`);
}
