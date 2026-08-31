import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_TOKEN_URL } from "./config";
import type { StravaTokenRow } from "@/types/strava";

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  /** Unix seconds — Strava returns an absolute expiry, not a duration. */
  expires_at: number;
  token_type: string;
}

/** Refresh a bit early so a request never races an about-to-expire token. */
const EXPIRY_BUFFER_MS = 60_000;

export async function exchangeAuthorizationCode(code: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: STRAVA_CLIENT_ID ?? "",
      client_secret: STRAVA_CLIENT_SECRET ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token exchange failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: STRAVA_CLIENT_ID ?? "",
      client_secret: STRAVA_CLIENT_SECRET ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`Strava token refresh failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/** Stores tokens as the single strava_tokens row, replacing any existing one. */
export async function saveStravaTokens(
  stravaAthleteId: string,
  tokens: StravaTokenResponse,
  scope: string,
): Promise<void> {
  const admin = createAdminClient();
  const expiresAt = new Date(tokens.expires_at * 1000).toISOString();

  await admin.from("strava_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await admin.from("strava_tokens").insert({
    strava_athlete_id: stravaAthleteId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope,
    expires_at: expiresAt,
  });
}

export async function disconnectStrava(): Promise<void> {
  const admin = createAdminClient();
  await admin.from("strava_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function getStravaConnection(): Promise<StravaTokenRow | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("strava_tokens").select("*").maybeSingle();
  return (data as StravaTokenRow | null) ?? null;
}

/**
 * Returns a valid access token, transparently refreshing (and persisting
 * the rotated refresh token) if the stored one is expired or near expiry.
 * Returns null if Strava was never connected.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const row = await getStravaConnection();
  if (!row) return null;

  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return row.access_token;
  }

  const refreshed = await refreshAccessToken(row.refresh_token);
  await saveStravaTokens(row.strava_athlete_id, refreshed, row.scope);
  return refreshed.access_token;
}
