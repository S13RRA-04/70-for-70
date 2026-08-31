import { CAMPAIGN_URL } from "@/lib/constants";

export const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
export const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

/**
 * Must be registered exactly (including scheme/host) as an "Authorization
 * Callback Domain" in the Strava API app settings (strava.com/settings/api
 * only accepts a bare domain there, not a full path — but the redirect_uri
 * sent in the authorize request must still match this exactly). /admin/strava
 * and its callback route live on the campaign domain (tri.forthe22.org),
 * not the org domain — see README's "Movement/Campaign Domain Split", same
 * as WHOOP.
 */
export const STRAVA_REDIRECT_URI = `${CAMPAIGN_URL}/api/strava/callback`;

export const STRAVA_AUTHORIZE_URL = "https://www.strava.com/oauth/authorize";
export const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
export const STRAVA_API_BASE_URL = "https://www.strava.com/api/v3";

/**
 * "activity:read_all" (not just "activity:read") so activities marked
 * private on Strava still show up here — this is the athlete's own
 * account, connected by the athlete, for the athlete's own public page.
 */
export const STRAVA_SCOPES = ["read", "activity:read_all"] as const;

export function isStravaConfigured(): boolean {
  return Boolean(STRAVA_CLIENT_ID && STRAVA_CLIENT_SECRET);
}

/** CSRF-protection cookie name shared between the authorize and callback routes. */
export const STRAVA_STATE_COOKIE = "strava_oauth_state";
