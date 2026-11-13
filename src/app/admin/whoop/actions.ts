"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { disconnectWhoop } from "@/lib/whoop/tokens";
import { TRI_JOURNAL_PATH, TRI_PAGE_PATH } from "@/lib/constants";

export async function disconnectWhoopAction() {
  await requireAdminUser();
  await disconnectWhoop();
  revalidatePath("/admin/whoop");
  revalidatePath(TRI_JOURNAL_PATH);
  revalidatePath(TRI_PAGE_PATH);
  redirect("/admin/whoop");
}
