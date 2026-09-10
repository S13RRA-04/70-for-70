"use server";

import { revalidatePath } from "next/cache";
import { registerForAppEvent } from "@/lib/data/app/registrations";
import type { RegistrationType } from "@/types/app";

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
