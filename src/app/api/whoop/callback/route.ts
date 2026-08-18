import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { exchangeAuthorizationCode, saveWhoopTokens } from "@/lib/whoop/tokens";
import { getWhoopProfile } from "@/lib/whoop/client";
import { WHOOP_STATE_COOKIE } from "@/lib/whoop/config";

function redirectToAdmin(request: Request, error?: string) {
  const url = new URL("/admin/whoop", request.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  await requireAdminUser();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(WHOOP_STATE_COOKIE)?.value;
  cookieStore.delete(WHOOP_STATE_COOKIE);

  if (oauthError) {
    return redirectToAdmin(request, `WHOOP authorization was not completed (${oauthError}).`);
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToAdmin(request, "Invalid or expired authorization request. Please try again.");
  }

  try {
    const tokens = await exchangeAuthorizationCode(code);
    const profile = await getWhoopProfile(tokens.access_token);
    await saveWhoopTokens(String(profile.userId), tokens);
  } catch (error) {
    console.error("WHOOP OAuth callback failed:", error);
    return redirectToAdmin(request, "Failed to connect WHOOP. Please try again.");
  }

  return redirectToAdmin(request);
}
