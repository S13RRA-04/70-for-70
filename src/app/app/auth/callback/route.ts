import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";

/**
 * Where every Supabase Auth email link (signup confirmation, password
 * reset) redirects to — exchanges the one-time `code` for a real session
 * (PKCE flow), then continues to `next` (defaults to the app home, or
 * /app/update-password for a password-reset link — see that route's
 * `redirectTo`).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, APP_URL));
    }
  }

  return NextResponse.redirect(new URL("/app/login?error=link_expired", APP_URL));
}
