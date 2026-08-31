import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { exchangeAuthorizationCode, saveStravaTokens } from "@/lib/strava/tokens";
import { getStravaAthlete } from "@/lib/strava/client";
import { STRAVA_STATE_COOKIE } from "@/lib/strava/config";

function redirectToAdmin(request: Request, error?: string) {
  const url = new URL("/admin/strava", request.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  await requireAdminUser();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const scope = url.searchParams.get("scope");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STRAVA_STATE_COOKIE)?.value;
  cookieStore.delete(STRAVA_STATE_COOKIE);

  if (oauthError) {
    return redirectToAdmin(request, `Strava authorization was not completed (${oauthError}).`);
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToAdmin(request, "Invalid or expired authorization request. Please try again.");
  }

  try {
    const tokens = await exchangeAuthorizationCode(code);
    const athlete = await getStravaAthlete(tokens.access_token);
    await saveStravaTokens(String(athlete.id), tokens, scope ?? "");
  } catch (error) {
    console.error("Strava OAuth callback failed:", error);
    return redirectToAdmin(request, "Failed to connect Strava. Please try again.");
  }

  return redirectToAdmin(request);
}
