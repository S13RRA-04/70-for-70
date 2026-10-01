import {
  APP_URL,
  CAMPAIGN_URL,
  EVENT22_CAMPAIGN_URL,
  RUCK_CAMPAIGN_URL,
  SITE_URL,
} from "@/lib/constants";

/**
 * Fail-fast guard for the multi-domain URL config. This repo has silently
 * broken cross-domain links/metadata four separate times by ending up with a
 * missing or stale host value (a dashboard-only var wiped by deploy, a build
 * that inlined the wrong value — see the long comments in wrangler.jsonc and
 * next.config.ts). The failure mode was always the same: a *valid-looking*
 * wrong URL, so nothing threw and the breakage only showed up in production.
 *
 * This turns that into an immediate, descriptive error instead. It is called
 * once per isolate from the top of middleware, so a misconfigured deploy
 * fails loudly (every request 500s) rather than serving subtly wrong links.
 *
 * Deliberately NOT `import "server-only"` — middleware is not a React Server
 * Component and importing that package there throws at runtime.
 */

let validated = false;

const URL_VARS: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: SITE_URL,
  NEXT_PUBLIC_CAMPAIGN_URL: CAMPAIGN_URL,
  NEXT_PUBLIC_RUCK_URL: RUCK_CAMPAIGN_URL,
  NEXT_PUBLIC_APP_URL: APP_URL,
  NEXT_PUBLIC_EVENT22_URL: EVENT22_CAMPAIGN_URL,
};

export function assertValidRuntimeConfig(): void {
  if (validated) return;
  validated = true;

  const problems: string[] = [];

  for (const [name, value] of Object.entries(URL_VARS)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      problems.push(`${name} is not a valid absolute URL: "${value}"`);
      continue;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      problems.push(`${name} must be http(s), got "${value}"`);
    }

    // A localhost value in a production build means the env var was missing
    // and the constant's dev fallback won — exactly the drift this guards.
    if (
      process.env.NODE_ENV === "production" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ) {
      problems.push(`${name} is still the localhost fallback in production: "${value}"`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Invalid runtime configuration — refusing to serve with broken domains:\n- ${problems.join("\n- ")}`,
    );
  }
}
