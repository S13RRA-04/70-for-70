"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { disconnectWhoop } from "@/lib/whoop/tokens";

export async function disconnectWhoopAction() {
  await requireAdminUser();
  await disconnectWhoop();
  revalidatePath("/admin/whoop");
  revalidatePath("/the-race");
  redirect("/admin/whoop");
}
