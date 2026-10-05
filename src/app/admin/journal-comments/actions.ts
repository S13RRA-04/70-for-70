"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

const LIST_PATH = "/admin/journal-comments";

function withError(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

/**
 * Revalidates the specific journal post too, not just the admin list and
 * /journal index — an approved/hidden comment only shows or disappears on
 * its own entry's page.
 */
function revalidateCommentPaths(entrySlug: string | null) {
  revalidatePath(LIST_PATH);
  if (entrySlug) revalidatePath(`/journal/${entrySlug}`);
}

async function getEntrySlug(admin: ReturnType<typeof createAdminClient>, commentId: string): Promise<string | null> {
  const { data } = await admin
    .from("journal_comments")
    .select("journal_entries(slug)")
    .eq("id", commentId)
    .maybeSingle<{ journal_entries: { slug: string } | null }>();
  return data?.journal_entries?.slug ?? null;
}

export async function approveJournalCommentAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const entrySlug = await getEntrySlug(admin, id);
  const { error } = await admin
    .from("journal_comments")
    .update({ approved: true, approved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to approve comment."));
  }

  revalidateCommentPaths(entrySlug);
  redirect(LIST_PATH);
}

export async function unapproveJournalCommentAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const entrySlug = await getEntrySlug(admin, id);
  const { error } = await admin.from("journal_comments").update({ approved: false, approved_at: null }).eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to hide comment."));
  }

  revalidateCommentPaths(entrySlug);
  redirect(LIST_PATH);
}

export async function deleteJournalCommentAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  const entrySlug = await getEntrySlug(admin, id);
  const { error } = await admin.from("journal_comments").delete().eq("id", id);

  if (error) {
    redirect(withError(LIST_PATH, "Failed to delete comment."));
  }

  revalidateCommentPaths(entrySlug);
  redirect(LIST_PATH);
}
