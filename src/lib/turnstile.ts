import "server-only";

/**
 * Cloudflare Turnstile verification for the public write endpoints.
 *
 * Deliberately inert until the secret is configured: if
 * `TURNSTILE_SECRET_KEY` is unset, `verifyTurnstileToken()` returns true and
 * every route keeps working on honeypot + timing + rate limits alone. That
 * lets the server half ship ahead of the widget without breaking forms, and
 * keeps local dev (no secret) usable.
 *
 * IMPORTANT: once the secret IS set, verification is enforced — every public
 * form must solve the widget (see src/components/forms/turnstile-widget.tsx)
 * or the route drops the submission. Set the secret and ship the widget in
 * the same deploy.
 *
 * Siteverify is the only trusted signal. A token is single-use; the widget
 * resets after each attempt. We require `success`, the expected per-surface
 * `action`, and an approved `hostname` (siteverify echoes the hostname the
 * widget was solved on) so a token minted on an attacker's registered domain
 * can't be replayed against ours.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Actions are per surface and must match the widget's `data-action`/render `action`. */
export type TurnstileAction =
  | "email_signup"
  | "inquiry"
  | "donation_report"
  | "message"
  | "triathlon_team"
  | "event_registration";

const DEFAULT_HOSTNAMES = [
  "forthe22.org",
  "tri.forthe22.org",
  "ruck.forthe22.org",
  "22.forthe22.org",
  "app.forthe22.org",
];

/**
 * Production allowlist comes from `TURNSTILE_HOSTNAMES` (wrangler.jsonc `vars`);
 * dev additionally accepts localhost aliases so `*.localhost` host testing
 * works. A production backend must never accept localhost — enforced here by
 * only adding the dev entries when NODE_ENV !== "production".
 */
function buildAllowedHostnames(): Set<string> {
  const raw = process.env.TURNSTILE_HOSTNAMES;
  const allowed = new Set(
    raw ? raw.split(",").map((host) => host.trim()).filter(Boolean) : DEFAULT_HOSTNAMES,
  );
  if (process.env.NODE_ENV !== "production") {
    allowed.add("localhost");
    allowed.add("127.0.0.1");
  }
  return allowed;
}

/**
 * Returns true when the submission should be allowed. Fails closed on a
 * missing/invalid/mismatched token or a verification error once configured;
 * fails open when Turnstile isn't configured at all.
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  action: TurnstileAction,
  remoteIp?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || token.length > 4096) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;

    const data = (await res.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };

    if (data.success !== true) return false;
    if (data.action !== action) return false;

    const allowed = buildAllowedHostnames();
    const hostname = data.hostname ?? "";
    if (
      !allowed.has(hostname) &&
      !(process.env.NODE_ENV !== "production" && hostname.endsWith(".localhost"))
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
