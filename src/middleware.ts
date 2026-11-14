import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy-session";
import { getPreviewToken, isOrgLive, PREVIEW_COOKIE_NAME } from "@/lib/launch-gate";
import { getRetiredCampaignHost, isAppHost, type RetiredCampaignHost } from "@/lib/site-mode";
import {
  EVENT22_CAMPAIGN_PATH,
  LIVE_CAMPAIGN_PATH,
  RUCK_CAMPAIGN_PATH,
  SEEN_CAMPAIGN_PATH,
  SITE_URL,
  TRI_BIKE_BUILD_PATH,
  TRI_JOURNAL_PATH,
  TRI_PAGE_PATH,
} from "@/lib/constants";
import { getPremiere } from "@/lib/content/premieres";
import { assertValidRuntimeConfig } from "@/lib/config-validation";

/**
 * How long a `?preview=<token>` unlock lasts. Deliberately short: the cookie
 * is a bearer credential that bypasses the pre-launch gate for its host, so a
 * leaked cookie (shared browser, backup, devtools export) should expire
 * quickly. 30 days is long enough for a review cycle, short enough that a
 * stale link isn't a six-month hole. Rotate PREVIEW_ACCESS_TOKEN if a link is
 * ever exposed. The cookie is httpOnly + Secure + SameSite=Lax + Path=/
 * (set in applyLaunchGate below).
 */
const PREVIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Deliberately kept on the deprecated `middleware.ts` convention (not
 * `proxy.ts`) — Next.js 16's `proxy.ts` always runs on the Node.js runtime
 * with no override, which @opennextjs/cloudflare doesn't yet support
 * ("Node.js middleware is not currently supported"). `middleware.ts`
 * still defaults to the Edge runtime, which this function only needs
 * (fetch-based Supabase client, no Node APIs) and which Cloudflare Workers
 * fully support. Switch back to `proxy.ts` once OpenNext adds Node
 * middleware support — see https://github.com/cloudflare/workers-sdk/issues/13755
 */
export async function middleware(request: NextRequest) {
  // Fails the whole request (500) if the multi-domain URL config is missing
  // or malformed — see src/lib/config-validation.ts. Memoized per isolate.
  assertValidRuntimeConfig();

  const nonce = btoa(crypto.randomUUID());
  const csp = buildContentSecurityPolicy(nonce);

  // Every path below that RENDERS A DOCUMENT (a rewrite, or the session
  // passthrough) has to be built from a request carrying these two headers:
  // Next reads the CSP off the *request* to nonce its own inline bootstrap
  // scripts and styles, and without that nonce our own policy blocks them and
  // the page ships dead JavaScript. Redirects and JSON responses don't need
  // them, but still get the header via applyCsp() so no response leaves the
  // Worker without it.
  const renderHeaders = new Headers(request.headers);
  renderHeaders.set("x-nonce", nonce);
  renderHeaders.set("Content-Security-Policy", csp);

  // API routes are same-origin only. Rejecting cross-site mutations here is a
  // single choke point for CSRF-style abuse of the public form/auth endpoints
  // (none of which use a CSRF token) — see isCrossSiteApiRequest below.
  if (isCrossSiteApiRequest(request)) {
    return applyCsp(
      NextResponse.json({ error: "Cross-site requests are not allowed." }, { status: 403 }),
      csp,
    );
  }

  const strayDomainResponse = applyStrayDomainRedirect(request);
  if (strayDomainResponse) return applyCsp(strayDomainResponse, csp);

  const retiredResponse = applyRetiredCampaignHostRedirect(request);
  if (retiredResponse) return applyCsp(retiredResponse, csp);

  const legacyPathResponse = applyLegacyPathRedirect(request);
  if (legacyPathResponse) return applyCsp(legacyPathResponse, csp);

  // app.forthe22.org is a different product surface entirely (authenticated
  // participant app, not marketing content) — never subject to the org's
  // launch gate below. Real pages live under
  // src/app/app/* in the filesystem; this rewrites every path transparently
  // so the URL bar still shows app.forthe22.org/whatever.
  if (isAppHost(request.headers.get("host"))) {
    const appResponse = applyAppHostRewrite(request, renderHeaders);
    if (appResponse) return applyCsp(appResponse, csp);
    return applyCsp(await updateSupabaseSession(request, renderHeaders), csp);
  }

  if (!isOrgLive()) {
    const gateResponse = applyLaunchGate(request, renderHeaders);
    if (gateResponse) return applyCsp(gateResponse, csp);
  }

  return applyCsp(await updateSupabaseSession(request, renderHeaders), csp);
}

/**
 * Nonce-based CSP, built fresh per request. Nonces only help if they're
 * unpredictable and single-use, which is why this is not a static
 * next.config.ts header. Origins are derived from real config rather than
 * wildcards: the Supabase project URL and the exact video-embed hosts this
 * app can actually embed, so a CSP change can't quietly widen the allowlist.
 *
 * - `script-src` gets the nonce but no 'unsafe-inline': that's the whole point,
 *   and it works because every route is already dynamically rendered (the root
 *   layout reads the request host — see getSiteMode()). 'unsafe-eval' is added
 *   in development only, because React's dev-mode debugging uses eval
 *   (node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * - `style-src` does need 'unsafe-inline': nonces don't cover style
 *   *attributes*, and this codebase uses React inline styles (progress bars,
 *   timeline positions) plus next/font's injected <style> tags throughout.
 * - `connect-src`/`img-src` use the exact Supabase project origin — the admin
 *   login page and the app's auth pages talk to Supabase from the browser, and
 *   journal images are served from that project's Storage bucket. `*.supabase.co`
 *   would be simpler but would trust every other project's subdomain too.
 * - The /resources map loads OpenStreetMap tiles (img-src) and geocodes
 *   city/ZIP searches through OpenStreetMap's Nominatim (connect-src) — see
 *   src/components/resources/resource-map.tsx.
 * - `upgrade-insecure-requests` is production-only; in local dev it would
 *   rewrite http://localhost asset and navigation URLs to https.
 */
function buildContentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : null;

  const directives = [
    "default-src 'self'",
    // challenges.cloudflare.com is Cloudflare Turnstile, loaded by the public
    // forms (src/components/forms/turnstile-widget.tsx). plausible.io is the
    // custom-events script (src/lib/analytics/plausible.ts) — Cloudflare Web
    // Analytics' own beacon is injected at Cloudflare's edge, after this
    // header is already set, so it needs no entry here. External origins are
    // allowlisted by host, so no nonce is needed for either script.
    `script-src 'self' https://challenges.cloudflare.com https://plausible.io 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${supabaseOrigin ? ` ${supabaseOrigin}` : ""} https://img.youtube.com https://badges.strava.com https://tile.openstreetmap.org`,
    "font-src 'self' data:",
    `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin} ${supabaseOrigin.replace("https://", "wss://")}` : ""} https://challenges.cloudflare.com https://plausible.io https://nominatim.openstreetmap.org`,
    // The Journal's click-to-play video facade (src/lib/video-url.ts), LIVE
    // premiere teasers (YouTube's privacy-enhanced nocookie player), plus the
    // Turnstile challenge iframe on the public forms.
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://challenges.cloudflare.com",
    // The participant app registers its own service worker (/sw.js).
    "worker-src 'self'",
    "manifest-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ").replace(/\s{2,}/g, " ").trim();
}

/** Attaches the CSP to a response that middleware returns before rendering. */
function applyCsp(response: Response, csp: string): Response {
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * True when a state-changing /api/* request did not come from this site.
 *
 * No API route here uses a CSRF token, and the public form/auth endpoints are
 * exactly the kind of thing a hostile page would POST to on a visitor's
 * behalf. SameSite cookies already blunt the cookie-bearing cases; this is
 * the explicit origin check for the rest (and for cookie-less service-role
 * writes, which have no cookie protection at all).
 *
 * `Sec-Fetch-Site` is the primary signal (browsers set it; scripts can't
 * forge it cross-site). When it's absent (older Safari, non-browser clients),
 * fall back to comparing `Origin` against the request host, allowing any
 * `*.forthe22.org` / `*.localhost` host so legitimate same-site
 * cross-subdomain calls aren't blocked. No Origin at all is allowed — that's
 * a non-browser caller which the honeypot + rate limits handle.
 */
function isCrossSiteApiRequest(request: NextRequest): boolean {
  if (!MUTATING_METHODS.has(request.method)) return false;
  if (!request.nextUrl.pathname.startsWith("/api/")) return false;

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") return true;

  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;

  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get("host") ?? request.nextUrl.host;
    if (originHost === requestHost) return false;

    const hostname = new URL(origin).hostname;
    return !(
      hostname === "forthe22.org" ||
      hostname.endsWith(".forthe22.org") ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return true;
  }
}

/**
 * Paths that must NOT be rewritten under /app/* even on the app host — API
 * routes and admin (identical across every host, same as SHARED_PATH_PREFIXES
 * below) plus the PWA manifest/service-worker files, which Next.js/the
 * browser expect at their conventional root paths.
 */
const APP_HOST_PASSTHROUGH_PREFIXES = [
  "/api",
  "/admin",
  "/manifest.webmanifest",
  "/sw.js",
  "/robots.txt",
];

function applyAppHostRewrite(request: NextRequest, renderHeaders: Headers): Response | null {
  const { pathname } = request.nextUrl;
  if (APP_HOST_PASSTHROUGH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }
  if (pathname.startsWith("/app")) return null; // already a real /app/* path (e.g. a Link href built server-side)
  return NextResponse.rewrite(new URL(`/app${pathname}`, request.nextUrl), {
    request: { headers: renderHeaders },
  });
}

/**
 * forthe22.com is a defensive registration, not a real domain of this
 * site — it exists only to keep someone else from squatting on the .com
 * next to forthe22.org. Bound to this same Worker via a Cloudflare Workers
 * Custom Domain (same mechanism as forthe22.org/tri./ruck. — see the
 * `workers/domains` account resource), so any request that reaches this
 * Worker under forthe22.com (bare or "www.") gets a permanent redirect to
 * the real org domain, path and query preserved. Checked before the
 * launch gate and domain split, unconditionally — forthe22.com never
 * renders anything of its own.
 */
function applyStrayDomainRedirect(request: NextRequest): Response | null {
  const host = request.headers.get("host");
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname !== "forthe22.com" && hostname !== "www.forthe22.com") return null;

  const url = request.nextUrl;
  return NextResponse.redirect(`${SITE_URL}${url.pathname}${url.search}`, 308);
}

/**
 * Every campaign used to have its own subdomain (tri., ruck., live., seen.,
 * 22.forthe22.org). They all live on the org site under /campaigns now, so
 * every page request on a retired host gets a permanent redirect to its org
 * equivalent — links already shared keep working. /api and /admin still
 * serve on those hosts: the WHOOP and Strava OAuth callbacks are registered
 * on the Tri host (see src/lib/whoop/config.ts). Checked before the launch
 * gate: the destination applies the org's gate.
 */
const RETIRED_HOST_PASSTHROUGH_PREFIXES = ["/api", "/admin"];

/** Each retired host's home on the org site — where any path without a more specific match lands. */
const RETIRED_HOST_HOMES: Record<RetiredCampaignHost, string> = {
  tri: TRI_PAGE_PATH,
  ruck: RUCK_CAMPAIGN_PATH,
  live: LIVE_CAMPAIGN_PATH,
  seen: SEEN_CAMPAIGN_PATH,
  "22": EVENT22_CAMPAIGN_PATH,
};

/**
 * Paths that mean the same thing on the org site, so they keep their path.
 * /assets and /video matter: registration emails already sent link the 22
 * For the 22 promo-kit zip on 22.forthe22.org/assets/...
 */
const RETIRED_HOST_SHARED_PATHS = [
  "/crisis",
  "/donate",
  "/press",
  "/terms",
  "/privacy",
  "/assets",
  "/video",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
];

/** Old Tri paths with a specific org home (folded in on the Tri host and, for the Tri-only ones, on the org host too). */
const TRI_REDIRECTS: Record<string, string> = {
  "/beneficiaries": "/impact#beneficiaries",
  "/sponsors": "/network#partners",
  "/partners": "/network#partners",
  "/become-a-partner": "/network#partners",
  "/campaign-supporters": "/network#partners",
  "/financial-transparency": "/transparency",
  "/shop": "/store",
};

/** Paths that only ever existed on the Tri site — redirected on the org host too. */
const TRI_LEGACY_PATH_PREFIXES = [
  "/the-mission",
  "/the-race",
  "/the-story",
  "/fund-a-mile",
  "/live",
  "/journal",
  "/miles",
  "/messages",
  "/get-involved",
  ...Object.keys(TRI_REDIRECTS),
];

/** Where `pathname` on retired host `host` lives now, as an org-site path. */
function retiredHostDestination(host: RetiredCampaignHost, pathname: string): string {
  const home = RETIRED_HOST_HOMES[host];
  if (matchesPathPrefix(pathname, RETIRED_HOST_SHARED_PATHS)) return pathname;
  if (host === "tri") return triDestination(pathname);
  if (pathname === "/") return home;
  if (host === "ruck" && /^\/missions\/[a-z0-9-]+$/.test(pathname)) return `${home}${pathname}`;
  if (host === "22" && (pathname === "/promokit" || pathname === "/rules")) return `${home}${pathname}`;
  if (host === "live") {
    // Artist premieres moved from Live to Tri For The 22.
    const premiere = movedPremiereDestination(pathname.slice(1));
    if (premiere) return premiere;
    // Live's /events, /auction, and /<event-slug> keep their shape under
    // /campaigns/live; an unknown slug 404s there, as it did before.
    if (/^\/[a-z0-9-]+$/.test(pathname)) return `${home}${pathname}`;
  }
  return home;
}

function triDestination(pathname: string): string {
  // The journal and bike build are Tri sub-pages now; post slugs carry over.
  if (pathname === "/journal/building-the-bike" || pathname.startsWith("/journal/building-the-bike/")) {
    return TRI_BIKE_BUILD_PATH;
  }
  if (pathname === "/journal" || pathname === "/journal/gear-journey") return TRI_JOURNAL_PATH;
  const post = /^\/journal\/([a-z0-9-]+)$/.exec(pathname);
  if (post) return `${TRI_JOURNAL_PATH}/${post[1]}`;
  const prefix = Object.keys(TRI_REDIRECTS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return prefix ? TRI_REDIRECTS[prefix] : TRI_PAGE_PATH;
}

function applyRetiredCampaignHostRedirect(request: NextRequest): Response | null {
  const host = getRetiredCampaignHost(request.headers.get("host"));
  if (!host) return null;
  const { pathname, search } = request.nextUrl;
  if (matchesPathPrefix(pathname, RETIRED_HOST_PASSTHROUGH_PREFIXES)) return null;
  const destination = retiredHostDestination(host, pathname);
  // Fragment destinations (/impact#beneficiaries) carry their own anchor;
  // everything else keeps the visitor's query string (UTM tags, ?preview=).
  return NextResponse.redirect(`${SITE_URL}${destination}${destination.includes("#") ? "" : search}`, 308);
}

/**
 * Org-host paths from earlier layouts: the Tri-only pages, and 22 For the
 * 22's original /22forthe22 home.
 */
/** Artist premieres used to be Live episodes; they're Tri For The 22's now. */
function movedPremiereDestination(slug: string): string | null {
  return getPremiere(slug) ? `${TRI_PAGE_PATH}/premiere/${slug}` : null;
}

function applyLegacyPathRedirect(request: NextRequest): Response | null {
  if (isAppHost(request.headers.get("host"))) return null;
  const { pathname, search } = request.nextUrl;
  const livePremiere = /^\/campaigns\/live\/([a-z0-9-]+)$/.exec(pathname);
  const premiereDestination = livePremiere && movedPremiereDestination(livePremiere[1]);
  if (premiereDestination) return NextResponse.redirect(`${SITE_URL}${premiereDestination}${search}`, 308);
  if (pathname === "/22forthe22" || pathname.startsWith("/22forthe22/")) {
    const rest = pathname.slice("/22forthe22".length); // "" | "/rules" | "/promokit"
    return NextResponse.redirect(`${SITE_URL}${EVENT22_CAMPAIGN_PATH}${rest}${search}`, 308);
  }
  if (matchesPathPrefix(pathname, TRI_LEGACY_PATH_PREFIXES)) {
    return NextResponse.redirect(`${SITE_URL}${triDestination(pathname)}`, 308);
  }
  return null;
}

function matchesPathPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Returns a response if the request should be blocked/redirected by the
 * pre-launch gate, or null if the visitor has valid preview access and
 * should proceed to the real site. Only runs while SITE_LIVE isn't "true"
 * (see isOrgLive).
 */
function applyLaunchGate(request: NextRequest, renderHeaders: Headers): Response | null {
  const url = request.nextUrl;

  // /admin/* (and its own API routes, e.g. WHOOP OAuth) is never gated —
  // requireAdminUser() already guards every page in there, and the owner
  // needs to manage the site (connect WHOOP, review sponsorships) before
  // a domain goes live, not just after.
  //
  // /crisis is never gated either — someone looking for immediate crisis
  // support shouldn't hit a "coming soon" wall if the site is ever taken
  // back offline for maintenance/relaunch.
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/whoop") ||
    url.pathname.startsWith("/crisis") ||
    url.pathname === "/sitemap.xml" ||
    url.pathname === "/llms.txt" ||
    url.pathname === "/robots.txt" ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    return null;
  }

  const previewToken = getPreviewToken();

  // Unlock via ?preview=<token> — set the cookie, then redirect to the
  // same URL with the query param stripped so it doesn't linger visibly.
  const queryToken = url.searchParams.get("preview");
  if (previewToken && queryToken === previewToken) {
    const redirectUrl = new URL(url.pathname, url.origin);
    url.searchParams.forEach((value, key) => {
      if (key !== "preview") redirectUrl.searchParams.set(key, value);
    });

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(PREVIEW_COOKIE_NAME, previewToken, {
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      maxAge: PREVIEW_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
    return response;
  }

  const cookieToken = request.cookies.get(PREVIEW_COOKIE_NAME)?.value;
  const unlocked = Boolean(previewToken && cookieToken === previewToken);
  if (unlocked) return null;

  if (url.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Site is not live yet." }, { status: 503 });
  }

  if (url.pathname !== "/coming-soon") {
    return NextResponse.rewrite(new URL("/coming-soon", url), { request: { headers: renderHeaders } });
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)",
  ],
};
