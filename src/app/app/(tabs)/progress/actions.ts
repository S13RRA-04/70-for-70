"use server";

import { revalidatePath } from "next/cache";
import { deleteActivity } from "@/lib/data/app/activities";

export async function deleteActivityFromProgressAction(
  activityId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteActivity(activityId);
  if (result.ok) {
    revalidatePath("/app/progress");
    revalidatePath("/app/share");
    revalidatePath("/app/home");
  }
  return result;
}
