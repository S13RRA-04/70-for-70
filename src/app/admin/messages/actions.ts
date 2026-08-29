"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const LIST_PATH = "/admin/messages";

function withError(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function revalidateMessagePaths() {
  revalidatePath(LIST_PATH);
  revalidatePath("/messages");
}

export async function approveMessageAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .update({ approved: true, approved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to approve message."));
  }

  revalidateMessagePaths();
  redirect(LIST_PATH);
}

export async function unapproveMessageAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .update({ approved: false, approved_at: null })
    .eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to hide message."));
  }

  revalidateMessagePaths();
  redirect(LIST_PATH);
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const { error } = await admin.from("messages").delete().eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to delete message."));
  }

  revalidateMessagePaths();
  redirect(LIST_PATH);
}
