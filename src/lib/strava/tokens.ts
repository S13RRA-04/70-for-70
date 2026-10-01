import "server-only";
import { logServerError } from "@/lib/log";
import { ensureFreshToken, requestTokenGrant, type OAuthTokenResponse } from "@/lib/oauth";
import { createAdminClient } from "@/lib/supabase/admin";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_TOKEN_URL } from "./config";
import type { StravaTokenRow } from "@/types/strava";

/** Strava's grant is absolute, and returns no scope — that comes off the authorize redirect. */
interface StravaTokenResponse extends OAuthTokenResponse {
  expires_at: number;
}

/** The table holds exactly one row; this id never exists, so `.neq("id", …)` means "all of them". */
const NO_ROW = "00000000-0000-0000-0000-000000000000";

export async function exchangeAuthorizationCode(code: string): Promise<StravaTokenResponse> {
  return requestTokenGrant<StravaTokenResponse>(
    "Strava",
    "exchange",
    STRAVA_TOKEN_URL,
    STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET,
    {
      grant_type: "authorization_code",
      code,
    },
  );
}

async function refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
  return requestTokenGrant<StravaTokenResponse>(
    "Strava",
    "refresh",
    STRAVA_TOKEN_URL,
    STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET,
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  );
}

/** Stores tokens as the single strava_tokens row, replacing any existing one. */
export async function saveStravaTokens(
  stravaAthleteId: string,
  tokens: StravaTokenResponse,
  scope: string,
): Promise<void> {
  const admin = createAdminClient();
  const expiresAt = new Date(tokens.expires_at * 1000).toISOString();

  const { error: deleteError } = await admin.from("strava_tokens").delete().neq("id", NO_ROW);
  if (deleteError) logServerError("strava: clear previous tokens failed", deleteError);

  const { error: insertError } = await admin.from("strava_tokens").insert({
    strava_athlete_id: stravaAthleteId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope,
    expires_at: expiresAt,
  });
  if (insertError) logServerError("strava: store tokens failed", insertError);
}

export async function disconnectStrava(): Promise<void> {
  const { error } = await createAdminClient().from("strava_tokens").delete().neq("id", NO_ROW);
  if (error) logServerError("strava: disconnect failed", error);
}

export async function getStravaConnection(): Promise<StravaTokenRow | null> {
  const { data } = await createAdminClient().from("strava_tokens").select("*").maybeSingle();
  return (data as StravaTokenRow | null) ?? null;
}

/**
 * Returns a valid access token, transparently refreshing (and persisting
 * the rotated refresh token) if the stored one is expired or near expiry.
 * Returns null if Strava was never connected.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const row = await getStravaConnection();

  return ensureFreshToken(row, async (stored) => {
    const refreshed = await refreshAccessToken(stored.refresh_token);
    await saveStravaTokens(stored.strava_athlete_id, refreshed, stored.scope);
    return refreshed.access_token;
  });
}
