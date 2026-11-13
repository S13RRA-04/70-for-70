"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { disconnectStrava } from "@/lib/strava/tokens";
import { TRI_JOURNAL_PATH } from "@/lib/constants";

export async function disconnectStravaAction() {
  await requireAdminUser();
  await disconnectStrava();
  revalidatePath("/admin/strava");
  revalidatePath(TRI_JOURNAL_PATH);
  redirect("/admin/strava");
}
