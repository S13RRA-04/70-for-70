import "server-only";

/**
 * The plumbing shared by the two connected-fitness providers (WHOOP and
 * Strava). Everything provider-specific — endpoints, scopes, redirect URIs,
 * token table columns, and what gets mapped into a public snapshot — stays in
 * src/lib/whoop/* and src/lib/strava/*.
 *
 * Raw tokens never leave this layer: callers get an access token to hand to
 * {@link providerFetch} and a redacted log line if a call fails.
 */

/**
 * A provider's token-endpoint JSON. The optional fields are the whole reason
 * this type is a union of both providers: WHOOP returns a relative
 * `expires_in` plus a `scope`, Strava returns an absolute `expires_at` and no
 * scope at all. Each module narrows with its own `extends` so the arithmetic
 * in `save*Tokens` stays type-checked.
 */
export interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  scope?: string;
  token_type?: string;
}

/** The subset of a `*_tokens` row that expiry math needs. */
export interface StoredToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

/** Refresh this far ahead of expiry so a request never races an about-to-expire token. */
const EXPIRY_BUFFER_MS = 60_000;

/**
 * Form-encoded POST to a provider's token endpoint. `params` is the
 * grant-specific half; the client credentials are appended here so no caller
 * can send a request missing them.
 */
export async function requestTokenGrant<T>(
  provider: string,
  action: "exchange" | "refresh",
  tokenUrl: string,
  clientId: string | undefined,
  clientSecret: string | undefined,
  params: Record<string, string>,
): Promise<T> {
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...params,
      client_id: clientId ?? "",
      client_secret: clientSecret ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`${provider} token ${action} failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/**
 * Returns a usable access token for a single-row token store, calling `refresh`
 * (which is also responsible for persisting the rotated token) when the stored
 * one is expired or close enough to it to be racy. Returns null when the
 * provider was never connected.
 */
export async function ensureFreshToken<TRow extends StoredToken>(
  row: TRow | null,
  refresh: (stored: TRow) => Promise<string>,
): Promise<string | null> {
  if (!row) return null;

  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - EXPIRY_BUFFER_MS > Date.now()) return row.access_token;

  return refresh(row);
}

/**
 * Bearer-authenticated GET. The `revalidate` window is the point of this
 * helper: these snapshots are rendered by public pages, so they're cached
 * rather than re-fetched per request.
 */
export async function providerFetch<T>(
  provider: string,
  baseUrl: string,
  path: string,
  accessToken: string,
  revalidateSeconds: number,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`${provider} API request failed (${path}): ${res.status}`);
  }

  return res.json();
}
