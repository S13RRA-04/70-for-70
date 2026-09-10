"use server";

import { revalidatePath } from "next/cache";
import { registerForAppEvent } from "@/lib/data/app/registrations";
import { createActivity, deleteActivity } from "@/lib/data/app/activities";
import type { RegistrationType } from "@/types/app";
import type { CreateActivityInput } from "@/lib/validation/activity";
import type { ActivityRow } from "@/types/app";

export async function registerForChallengeAction(
  eventId: string,
  slug: string,
  registrationType: RegistrationType,
  teamName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await registerForAppEvent({ eventId, registrationType, teamName });
  if (result.ok) revalidatePath(`/app/challenges/${slug}`);
  return result;
}

export async function logSessionAction(
  slug: string,
  input: CreateActivityInput,
): Promise<{ ok: true; activity: ActivityRow } | { ok: false; error: string }> {
  const result = await createActivity(input);
  if (result.ok) {
    revalidatePath(`/app/challenges/${slug}`);
    revalidatePath("/app/progress");
    revalidatePath("/app/share");
    revalidatePath("/app/home");
  }
  return result;
}

export async function deleteActivityAction(
  activityId: string,
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteActivity(activityId);
  if (result.ok) {
    revalidatePath(`/app/challenges/${slug}`);
    revalidatePath("/app/progress");
    revalidatePath("/app/share");
    revalidatePath("/app/home");
  }
  return result;
}
