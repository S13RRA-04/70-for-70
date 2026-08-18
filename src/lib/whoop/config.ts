import { SITE_URL } from "@/lib/constants";

export const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
export const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

/** Must be registered exactly (including scheme/host) in the WHOOP Developer Dashboard. */
export const WHOOP_REDIRECT_URI = `${SITE_URL}/api/whoop/callback`;

export const WHOOP_AUTHORIZE_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
export const WHOOP_TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
export const WHOOP_API_BASE_URL = "https://api.prod.whoop.com/developer/v2";

export const WHOOP_SCOPES = [
  "read:recovery",
  "read:cycles",
  "read:sleep",
  "read:workout",
  "read:profile",
  "offline",
] as const;

export function isWhoopConfigured(): boolean {
  return Boolean(WHOOP_CLIENT_ID && WHOOP_CLIENT_SECRET);
}

/** CSRF-protection cookie name shared between the authorize and callback routes. */
export const WHOOP_STATE_COOKIE = "whoop_oauth_state";
