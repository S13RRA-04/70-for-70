import { NextResponse } from "next/server";
import { readRateLimitedJson } from "@/lib/api-request";
import { logServerError } from "@/lib/log";
import { createClient } from "@/lib/supabase/server";
import { updatePasswordSchema } from "@/lib/validation/app-auth";

/** Requires an active session — reached only via the reset-password email link's callback exchange, or while already logged in. */
export async function POST(request: Request) {
  const outcome = await readRateLimitedJson(
    request,
    {
      rateLimitKey: "update-password",
      schema: updatePasswordSchema,
      invalidError: "Password must be at least 8 characters.",
    },
    () => NextResponse.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 }),
  );
  if ("response" in outcome) return outcome.response;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Your reset link has expired. Request a new one." },
      { status: 401 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password: outcome.data.password });
  if (error) {
    logServerError("app-update-password: update failed", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
