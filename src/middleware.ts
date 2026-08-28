import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy-session";
import { getPreviewToken, isCampaignLive, isOrgLive, PREVIEW_COOKIE_NAME } from "@/lib/launch-gate";
import { getCampaignSlug, type CampaignSlug } from "@/lib/site-mode";
import { CAMPAIGN_URL, SITE_URL } from "@/lib/constants";

const PREVIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

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
export function middleware(request: NextRequest) {
  const campaignSlug = getCampaignSlug(request.headers.get("host"));
  const onCampaignHost = campaignSlug !== null;
  const live = onCampaignHost ? isCampaignLive() : isOrgLive();

  if (!live) {
    const gateResponse = applyLaunchGate(request, onCampaignHost);
    if (gateResponse) return gateResponse;
  }

  const splitResponse = applyDomainSplit(request, onCampaignHost, campaignSlug);
  if (splitResponse) return splitResponse;

  return updateSupabaseSession(request);
}

/**
 * Returns a response if the request should be blocked/redirected by the
 * pre-launch gate, or null if the visitor has valid preview access and
 * should proceed to the real site. Gating is per-domain — see
 * isOrgLive/isCampaignLive — so this only runs for whichever domain isn't
 * live yet; the other domain skips the gate entirely.
 */
function applyLaunchGate(request: NextRequest, onCampaignHost: boolean): Response | null {
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
    return NextResponse.rewrite(comingSoonUrl);
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

/**
 * Returns a response if this request needs to be rewritten/redirected to
 * stay on the correct side of the movement/campaign split, or null if it
 * should render normally as-is.
 */
function applyDomainSplit(
  request: NextRequest,
  onCampaignHost: boolean,
  campaignSlug: CampaignSlug | null,
): Response | null {
  const url = request.nextUrl;

  const ruckGuardResponse = applyRuckSingleHomeGuard(request, campaignSlug);
  if (ruckGuardResponse) return ruckGuardResponse;

  // "/" is the one path that exists on every host with different content.
  // Each campaign's home lives at its own real route (see
  // CAMPAIGN_HOME_ROUTES) and is rewritten in transparently — the URL bar
  // still shows "/".
  if (url.pathname === "/") {
    return campaignSlug ? NextResponse.rewrite(new URL(CAMPAIGN_HOME_ROUTES[campaignSlug], url)) : null;
  }

  if (onCampaignHost && url.pathname in CAMPAIGN_PATH_REWRITES) {
    return NextResponse.rewrite(new URL(CAMPAIGN_PATH_REWRITES[url.pathname], url));
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
