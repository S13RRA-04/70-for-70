import { NextResponse } from "next/server";
import { readRateLimitedJson } from "@/lib/api-request";
import { APP_URL } from "@/lib/constants";
import { logServerError } from "@/lib/log";
import { createClient } from "@/lib/supabase/server";
import { requestPasswordResetSchema } from "@/lib/validation/app-auth";

/** Always responds { ok: true } regardless of whether the email matches an account — never reveal account existence via response differences. */
export async function POST(request: Request) {
  const outcome = await readRateLimitedJson(
    request,
    {
      rateLimitKey: "reset-password",
      schema: requestPasswordResetSchema,
      invalidError: "Enter a valid email address.",
    },
    () => NextResponse.json({ ok: true }),
  );
  if ("response" in outcome) return outcome.response;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(outcome.data.email, {
    redirectTo: `${APP_URL}/app/auth/callback?next=/app/update-password`,
  });

  // Logged, never surfaced: the response is always { ok: true } so it can't be
  // used to probe which addresses have accounts.
  if (error) logServerError("app-reset-password: request failed", error);

  return NextResponse.json({ ok: true });
}
