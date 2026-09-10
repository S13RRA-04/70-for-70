"use server";

import { revalidatePath } from "next/cache";
import { updateMyProfile } from "@/lib/data/app/profiles";
import type { ProfileVisibility } from "@/types/app";

export async function updateProfileAction(input: {
  firstName: string;
  lastName: string;
  city?: string;
  state?: string;
  phone?: string;
  bio?: string;
  visibility: ProfileVisibility;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await updateMyProfile(input);
  if (result.ok) revalidatePath("/app/profile");
  return result;
}
