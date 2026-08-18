import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import {
  WHOOP_AUTHORIZE_URL,
  WHOOP_CLIENT_ID,
  WHOOP_REDIRECT_URI,
  WHOOP_SCOPES,
  WHOOP_STATE_COOKIE,
  isWhoopConfigured,
} from "@/lib/whoop/config";

/** Admin-only. Redirects to WHOOP's OAuth consent screen. */
export async function GET() {
  await requireAdminUser();

  if (!isWhoopConfigured()) {
    return NextResponse.json(
      { error: "WHOOP_CLIENT_ID / WHOOP_CLIENT_SECRET are not configured." },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(WHOOP_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const url = new URL(WHOOP_AUTHORIZE_URL);
  url.searchParams.set("client_id", WHOOP_CLIENT_ID ?? "");
  url.searchParams.set("redirect_uri", WHOOP_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", WHOOP_SCOPES.join(" "));
  url.searchParams.set("state", state);

  return NextResponse.redirect(url);
}
