import { CAMPAIGN_URL } from "@/lib/constants";

export const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
export const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

/**
 * Must be registered exactly (including scheme/host) in the WHOOP
 * Developer Dashboard. Uses CAMPAIGN_URL, not SITE_URL — /admin/whoop and
 * its callback route live on the campaign domain (tri.forthe22.org), not
 * the org domain. See README's "Movement/Campaign Domain Split".
 */
export const WHOOP_REDIRECT_URI = `${CAMPAIGN_URL}/api/whoop/callback`;

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
