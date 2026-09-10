import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";
import { requestPasswordResetSchema } from "@/lib/validation/app-auth";
import { APP_URL } from "@/lib/constants";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

/** Always responds { ok: true } regardless of whether the email matches an account — never reveal account existence via response differences. */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`app-reset-password:${ip}`, { limit: 5, windowMs: 10 * 60_000 })) {
    return NextResponse.json({ ok: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestPasswordResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${APP_URL}/app/auth/callback?next=/app/update-password`,
  });

  return NextResponse.json({ ok: true });
}
