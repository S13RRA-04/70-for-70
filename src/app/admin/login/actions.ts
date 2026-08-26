"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";

export interface LoginState {
  error: string | null;
}

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

/** Every other public form on this site rate-limits by IP (see src/lib/rate-limit.ts) — sign-in is the one credential-checking endpoint, so it needs it more, not less, to blunt password-guessing attempts. */
export async function signInAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();

  if (isRateLimited(`admin-login:${ip}`, { limit: 5, windowMs: 15 * 60_000 })) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
