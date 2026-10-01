import "server-only";
import { logServerError } from "@/lib/log";
import { ensureFreshToken, requestTokenGrant, type OAuthTokenResponse } from "@/lib/oauth";
import { createAdminClient } from "@/lib/supabase/admin";
import { WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET, WHOOP_REDIRECT_URI, WHOOP_TOKEN_URL } from "./config";
import type { WhoopTokenRow } from "@/types/whoop";

/** WHOOP's grant is relative and carries the scope it was issued with. */
interface WhoopTokenResponse extends OAuthTokenResponse {
  expires_in: number;
  scope: string;
}

/** The table holds exactly one row; this id never exists, so `.neq("id", …)` means "all of them". */
const NO_ROW = "00000000-0000-0000-0000-000000000000";

export async function exchangeAuthorizationCode(code: string): Promise<WhoopTokenResponse> {
  return requestTokenGrant<WhoopTokenResponse>(
    "WHOOP",
    "exchange",
    WHOOP_TOKEN_URL,
    WHOOP_CLIENT_ID,
    WHOOP_CLIENT_SECRET,
    {
      grant_type: "authorization_code",
      code,
      redirect_uri: WHOOP_REDIRECT_URI,
    },
  );
}

async function refreshAccessToken(refreshToken: string): Promise<WhoopTokenResponse> {
  return requestTokenGrant<WhoopTokenResponse>(
    "WHOOP",
    "refresh",
    WHOOP_TOKEN_URL,
    WHOOP_CLIENT_ID,
    WHOOP_CLIENT_SECRET,
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      // WHOOP only issues a refresh token when offline access is asked for again.
      scope: "offline",
    },
  );
}

/** Stores tokens as the single whoop_tokens row, replacing any existing one. */
export async function saveWhoopTokens(whoopUserId: string, tokens: WhoopTokenResponse): Promise<void> {
  const admin = createAdminClient();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  const { error: deleteError } = await admin.from("whoop_tokens").delete().neq("id", NO_ROW);
  if (deleteError) logServerError("whoop: clear previous tokens failed", deleteError);

  const { error: insertError } = await admin.from("whoop_tokens").insert({
    whoop_user_id: whoopUserId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    expires_at: expiresAt,
  });
  if (insertError) logServerError("whoop: store tokens failed", insertError);
}

export async function disconnectWhoop(): Promise<void> {
  const { error } = await createAdminClient().from("whoop_tokens").delete().neq("id", NO_ROW);
  if (error) logServerError("whoop: disconnect failed", error);
}

export async function getWhoopConnection(): Promise<WhoopTokenRow | null> {
  const { data } = await createAdminClient().from("whoop_tokens").select("*").maybeSingle();
  return (data as WhoopTokenRow | null) ?? null;
}

/**
 * Returns a valid access token, transparently refreshing (and persisting
 * the rotated refresh token) if the stored one is expired or near expiry.
 * Returns null if WHOOP was never connected.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const row = await getWhoopConnection();

  return ensureFreshToken(row, async (stored) => {
    const refreshed = await refreshAccessToken(stored.refresh_token);
    await saveWhoopTokens(stored.whoop_user_id, refreshed);
    return refreshed.access_token;
  });
}
