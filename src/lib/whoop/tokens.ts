import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  WHOOP_CLIENT_ID,
  WHOOP_CLIENT_SECRET,
  WHOOP_REDIRECT_URI,
  WHOOP_TOKEN_URL,
} from "./config";
import type { WhoopTokenRow } from "@/types/whoop";

interface WhoopTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/** Refresh a bit early so a request never races an about-to-expire token. */
const EXPIRY_BUFFER_MS = 60_000;

export async function exchangeAuthorizationCode(code: string): Promise<WhoopTokenResponse> {
  const res = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: WHOOP_REDIRECT_URI,
      client_id: WHOOP_CLIENT_ID ?? "",
      client_secret: WHOOP_CLIENT_SECRET ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`WHOOP token exchange failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<WhoopTokenResponse> {
  const res = await fetch(WHOOP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: WHOOP_CLIENT_ID ?? "",
      client_secret: WHOOP_CLIENT_SECRET ?? "",
      scope: "offline",
    }),
  });

  if (!res.ok) {
    throw new Error(`WHOOP token refresh failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/** Stores tokens as the single whoop_tokens row, replacing any existing one. */
export async function saveWhoopTokens(
  whoopUserId: string,
  tokens: WhoopTokenResponse,
): Promise<void> {
  const admin = createAdminClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await admin.from("whoop_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await admin.from("whoop_tokens").insert({
    whoop_user_id: whoopUserId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    expires_at: expiresAt,
  });
}

export async function disconnectWhoop(): Promise<void> {
  const admin = createAdminClient();
  await admin.from("whoop_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

export async function getWhoopConnection(): Promise<WhoopTokenRow | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("whoop_tokens").select("*").maybeSingle();
  return (data as WhoopTokenRow | null) ?? null;
}

/**
 * Returns a valid access token, transparently refreshing (and persisting
 * the rotated refresh token) if the stored one is expired or near expiry.
 * Returns null if WHOOP was never connected.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const row = await getWhoopConnection();
  if (!row) return null;

  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return row.access_token;
  }

  const refreshed = await refreshAccessToken(row.refresh_token);
  await saveWhoopTokens(row.whoop_user_id, refreshed);
  return refreshed.access_token;
}
