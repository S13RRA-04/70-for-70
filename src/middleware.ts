import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy-session";
import { getPreviewToken, isCampaignLive, isOrgLive, PREVIEW_COOKIE_NAME } from "@/lib/launch-gate";
import { isCampaignHost } from "@/lib/site-mode";
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
  const onCampaignHost = isCampaignHost(request.headers.get("host"));
  const live = onCampaignHost ? isCampaignLive() : isOrgLive();

  if (!live) {
    const gateResponse = applyLaunchGate(request, onCampaignHost);
    if (gateResponse) return gateResponse;
  }

  const splitResponse = applyDomainSplit(request, onCampaignHost);
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
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/whoop")) {
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
 * Movement (forthe22.org) vs campaign (tri.forthe22.org) page split —
 * see README's "Movement/Campaign Domain Split". Both domains are served
 * by this same app; this is the only place that decides which pages
 * belong to which. API routes and shared assets are intentionally not
 * listed here — they work identically on either host.
 */
const ORG_PATH_PREFIXES = [
  "/about",
  "/resources",
  "/join",
  "/merch",
  "/contact",
  "/privacy",
  "/terms",
  "/athlete-agreement",
  "/press",
];
const CAMPAIGN_PATH_PREFIXES = [
  "/the-mission",
  "/the-race",
  "/fund-a-mile",
  "/donate",
  "/sponsors",
  "/partners",
  "/live",
  "/updates",
  "/miles",
  "/admin",
];

function matchesPathPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Returns a response if this request needs to be rewritten/redirected to
 * stay on the correct side of the movement/campaign split, or null if it
 * should render normally as-is.
 */
function applyDomainSplit(request: NextRequest, onCampaignHost: boolean): Response | null {
  const url = request.nextUrl;

  // "/" is the one path that exists on both hosts with different content.
  // The campaign home lives at the real route /campaign-home and is
  // rewritten in transparently — the URL bar still shows "/".
  if (url.pathname === "/") {
    return onCampaignHost ? NextResponse.rewrite(new URL("/campaign-home", url)) : null;
  }

  if (onCampaignHost && matchesPathPrefix(url.pathname, ORG_PATH_PREFIXES)) {
    return NextResponse.redirect(`${SITE_URL}${url.pathname}${url.search}`);
  }

  if (!onCampaignHost && matchesPathPrefix(url.pathname, CAMPAIGN_PATH_PREFIXES)) {
    return NextResponse.redirect(`${CAMPAIGN_URL}${url.pathname}${url.search}`);
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
