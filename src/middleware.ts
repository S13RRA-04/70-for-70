import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy-session";
import { getPreviewToken, isCampaignLive, isOrgLive, PREVIEW_COOKIE_NAME } from "@/lib/launch-gate";
import { getCampaignSlug, isAppHost, type CampaignSlug } from "@/lib/site-mode";
import { CAMPAIGN_URL, EVENT22_CAMPAIGN_URL, SITE_URL } from "@/lib/constants";
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

  const legacyEvent22Response = applyEvent22LegacyRedirect(request);
  if (legacyEvent22Response) return applyCsp(legacyEvent22Response, csp);

  // app.forthe22.org is a different product surface entirely (authenticated
  // participant app, not marketing content) — never subject to the org/
  // campaign launch gate or domain split below. Real pages live under
  // src/app/app/* in the filesystem; this rewrites every path transparently
  // so the URL bar still shows app.forthe22.org/whatever.
  if (isAppHost(request.headers.get("host"))) {
    const appResponse = applyAppHostRewrite(request, renderHeaders);
    if (appResponse) return applyCsp(appResponse, csp);
    return applyCsp(await updateSupabaseSession(request, renderHeaders), csp);
  }

  const campaignSlug = getCampaignSlug(request.headers.get("host"));
  const onCampaignHost = campaignSlug !== null;
  const live = onCampaignHost ? isCampaignLive() : isOrgLive();

  if (!live) {
    const gateResponse = applyLaunchGate(request, onCampaignHost, renderHeaders);
    if (gateResponse) return applyCsp(gateResponse, csp);
  }

  const splitResponse = applyDomainSplit(request, onCampaignHost, campaignSlug, renderHeaders);
  if (splitResponse) return applyCsp(splitResponse, csp);

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
    // forms (src/components/forms/turnstile-widget.tsx). External origins are
    // allowlisted by host, so no nonce is needed for its script.
    `script-src 'self' https://challenges.cloudflare.com 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${supabaseOrigin ? ` ${supabaseOrigin}` : ""} https://img.youtube.com`,
    "font-src 'self' data:",
    `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin} ${supabaseOrigin.replace("https://", "wss://")}` : ""} https://challenges.cloudflare.com`,
    // The Journal's click-to-play video facade (src/lib/video-url.ts), plus the
    // Turnstile challenge iframe on the public forms.
    "frame-src https://www.youtube.com https://player.vimeo.com https://challenges.cloudflare.com",
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
 * "22 For the 22" moved off tri.forthe22.org/22forthe22 to its own
 * subdomain (22.forthe22.org) — see EVENT22_CAMPAIGN_URL's doc comment in
 * constants.ts. Permanently redirects any stray /22forthe22[/...] request,
 * on any host except the "22" host itself (which serves this same
 * underlying route directly via CAMPAIGN_HOME_ROUTES/EVENT22_PATH_REWRITES
 * below — never redirect it, that would loop), to the equivalent path on
 * the new host. Checked unconditionally, before the launch gate and domain
 * split, same as applyStrayDomainRedirect above.
 */
function applyEvent22LegacyRedirect(request: NextRequest): Response | null {
  const campaignSlug = getCampaignSlug(request.headers.get("host"));
  if (campaignSlug === "22") return null;

  const { pathname, search } = request.nextUrl;
  if (pathname !== "/22forthe22" && !pathname.startsWith("/22forthe22/")) return null;

  const rest = pathname.slice("/22forthe22".length); // "" | "/rules" | "/promokit" | ...
  return NextResponse.redirect(`${EVENT22_CAMPAIGN_URL}${rest}${search}`, 308);
}

/**
 * Returns a response if the request should be blocked/redirected by the
 * pre-launch gate, or null if the visitor has valid preview access and
 * should proceed to the real site. Gating is per-domain — see
 * isOrgLive/isCampaignLive — so this only runs for whichever domain isn't
 * live yet; the other domain skips the gate entirely.
 */
function applyLaunchGate(request: NextRequest, onCampaignHost: boolean, renderHeaders: Headers): Response | null {
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
    const comingSoonUrl = new URL("/coming-soon", url);
    if (onCampaignHost) comingSoonUrl.searchParams.set("scope", "campaign");
    return NextResponse.rewrite(comingSoonUrl, { request: { headers: renderHeaders } });
  }

  return null;
}

/**
 * Movement (forthe22.org) vs campaign page split — see README's
 * "Movement/Campaign Domain Split". These two prefix lists are Tri's own
 * campaign routes specifically (Ruck has none of its own — see
 * applyRuckSingleHomeGuard below); all hosts are served by this same app,
 * and this is the only place that decides which pages belong to which. API
 * routes, shared assets, and /admin (including /admin/analytics, which
 * reports on every domain — see src/lib/analytics/cloudflare.ts) are
 * intentionally not listed here — they work identically on every host, not
 * just tri.forthe22.org.
 */
const ORG_PATH_PREFIXES = [
  "/about",
  "/resources",
  "/veteran-brands",
  "/crisis",
  "/advocacy",
  "/contact",
  "/mission",
  "/campaigns",
  "/store",
];
const CAMPAIGN_PATH_PREFIXES = [
  "/the-mission",
  "/the-race",
  "/the-story",
  "/fund-a-mile",
  "/donate",
  "/sponsors",
  "/partners",
  "/live",
  "/journal",
  "/miles",
  "/campaign-supporters",
  "/beneficiaries",
  "/financial-transparency",
  "/shop",
  "/messages",
  "/get-involved",
  "/become-a-partner",
];

/**
 * Paths that exist on BOTH hosts but need different content per domain —
 * rewritten (URL bar unchanged) rather than redirected, same pattern as
 * "/" → "/campaign-home" below. The org versions render normally at these
 * exact paths; the campaign host transparently gets its own page instead.
 */
const CAMPAIGN_PATH_REWRITES: Record<string, string> = {
  "/press": "/campaign-press",
  "/terms": "/campaign-terms",
  "/privacy": "/campaign-privacy",
};

function matchesPathPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Maps each campaign to the real route "/" transparently rewrites to. */
const CAMPAIGN_HOME_ROUTES: Record<CampaignSlug, string> = {
  tri: "/campaign-home",
  ruck: "/ruck-home",
  // The page itself never moved on disk — only which host's "/" points at
  // it. See EVENT22_CAMPAIGN_URL's doc comment in constants.ts.
  "22": "/22forthe22",
};

/**
 * "22" host-only path rewrites — same idea as CAMPAIGN_PATH_REWRITES below,
 * but scoped to a single campaign rather than "any campaign host," since
 * these paths don't exist on Tri or Ruck. The real files stay nested under
 * src/app/22forthe22/* (see CAMPAIGN_HOME_ROUTES above for why).
 */
const EVENT22_PATH_REWRITES: Record<string, string> = {
  "/promokit": "/22forthe22/promokit",
  "/rules": "/22forthe22/rules",
};

/**
 * Paths that work identically regardless of which host is serving them —
 * never redirected/collapsed by the Ruck single-page guard below.
 */
const SHARED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/crisis",
  "/coming-soon",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
  "/manifest.webmanifest",
];

/**
 * Ruck For The 22 is deliberately a single page (see RUCK_CAMPAIGN_URL's
 * doc comment in src/lib/constants.ts) — unlike Tri, it has no set of real
 * campaign routes of its own. Without this, ruck.forthe22.org/the-race (a
 * real route that exists for Tri) would render Tri's page content under
 * Ruck's header/footer branding. Collapse anything else on that host back
 * to "/" instead.
 */
function applyRuckSingleHomeGuard(request: NextRequest, campaignSlug: CampaignSlug | null): Response | null {
  if (campaignSlug !== "ruck") return null;
  const { pathname } = request.nextUrl;
  if (pathname === "/" || matchesPathPrefix(pathname, SHARED_PATH_PREFIXES)) return null;
  return NextResponse.redirect(new URL("/", request.nextUrl), 308);
}

/** 22 For the 22's own real paths on its host — everything else collapses back to "/", same reasoning as applyRuckSingleHomeGuard above. */
const EVENT22_OWN_PATHS = ["/", "/promokit", "/rules"];

/**
 * Same idea as applyRuckSingleHomeGuard, sized for 22 For the 22's 3 real
 * pages instead of just 1 — without this, 22.forthe22.org/the-race (a real
 * route that exists for Tri) would render Tri's page content under 22's
 * own header/footer branding.
 */
function applyEvent22Guard(request: NextRequest, campaignSlug: CampaignSlug | null): Response | null {
  if (campaignSlug !== "22") return null;
  const { pathname } = request.nextUrl;
  if (EVENT22_OWN_PATHS.includes(pathname) || matchesPathPrefix(pathname, SHARED_PATH_PREFIXES)) return null;
  return NextResponse.redirect(new URL("/", request.nextUrl), 308);
}

/**
 * Returns a response if this request needs to be rewritten/redirected to
 * stay on the correct side of the movement/campaign split, or null if it
 * should render normally as-is.
 */
function applyDomainSplit(
  request: NextRequest,
  onCampaignHost: boolean,
  campaignSlug: CampaignSlug | null,
  renderHeaders: Headers,
): Response | null {
  const url = request.nextUrl;

  const ruckGuardResponse = applyRuckSingleHomeGuard(request, campaignSlug);
  if (ruckGuardResponse) return ruckGuardResponse;

  const event22GuardResponse = applyEvent22Guard(request, campaignSlug);
  if (event22GuardResponse) return event22GuardResponse;

  // "/" is the one path that exists on every host with different content.
  // Each campaign's home lives at its own real route (see
  // CAMPAIGN_HOME_ROUTES) and is rewritten in transparently — the URL bar
  // still shows "/".
  if (url.pathname === "/") {
    return campaignSlug
      ? NextResponse.rewrite(new URL(CAMPAIGN_HOME_ROUTES[campaignSlug], url), {
          request: { headers: renderHeaders },
        })
      : null;
  }

  if (campaignSlug === "22" && url.pathname in EVENT22_PATH_REWRITES) {
    return NextResponse.rewrite(new URL(EVENT22_PATH_REWRITES[url.pathname], url), {
      request: { headers: renderHeaders },
    });
  }

  if (onCampaignHost && url.pathname in CAMPAIGN_PATH_REWRITES) {
    return NextResponse.rewrite(new URL(CAMPAIGN_PATH_REWRITES[url.pathname], url), {
      request: { headers: renderHeaders },
    });
  }

  // Permanent (308) redirects — a visitor on the wrong domain for a given
  // page should be sent to the correct one for good, not just this visit.
  if (onCampaignHost && matchesPathPrefix(url.pathname, ORG_PATH_PREFIXES)) {
    return NextResponse.redirect(`${SITE_URL}${url.pathname}${url.search}`, 308);
  }

  if (!onCampaignHost && matchesPathPrefix(url.pathname, CAMPAIGN_PATH_PREFIXES)) {
    return NextResponse.redirect(`${CAMPAIGN_URL}${url.pathname}${url.search}`, 308);
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
