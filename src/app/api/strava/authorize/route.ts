import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import {
  STRAVA_AUTHORIZE_URL,
  STRAVA_CLIENT_ID,
  STRAVA_REDIRECT_URI,
  STRAVA_SCOPES,
  STRAVA_STATE_COOKIE,
  isStravaConfigured,
} from "@/lib/strava/config";

/** Admin-only. Redirects to Strava's OAuth consent screen. */
export async function GET() {
  await requireAdminUser();

  if (!isStravaConfigured()) {
    return NextResponse.json(
      { error: "STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET are not configured." },
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(STRAVA_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const url = new URL(STRAVA_AUTHORIZE_URL);
  url.searchParams.set("client_id", STRAVA_CLIENT_ID ?? "");
  url.searchParams.set("redirect_uri", STRAVA_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", STRAVA_SCOPES.join(","));
  url.searchParams.set("state", state);

  return NextResponse.redirect(url);
}
