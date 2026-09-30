import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Forces the exact build-time value Next.js inlines for these three
  // NEXT_PUBLIC_* vars — deliberately NOT `process.env.X || fallback`,
  // because that was tried first and didn't work: something upstream of
  // this file (still unidentified — every layer we can directly inspect,
  // the GitHub Actions build step's own env: block, wrangler.jsonc's
  // vars, and the live Worker's runtime bindings via the Cloudflare API,
  // all show the correct domain) is setting process.env.NEXT_PUBLIC_SITE_URL
  // to a *truthy but wrong* value at build time, so `||` never reaches
  // the fallback. Only SITE_URL was affected — CAMPAIGN_URL/RUCK_URL,
  // defined identically, were not — which ruled out a generic env-passing
  // problem and pointed at something specific to this one value. Current
  // best theory: a build-time tool doing a naive (non-comment-aware) text
  // scan of wrangler.jsonc for this key's value, landing on the wrong
  // match inside that file's own prose about a past incident with this
  // exact bug (see wrangler.jsonc's comment — deliberately reworded to
  // remove the literal quoted URL that theory points at). Hardcoded
  // unconditionally here as the actually-reliable fix regardless of which
  // theory is right — confirm no regression by fetching a fresh deployed
  // bundle and checking it only contains the correct apex domain for
  // SITE_URL, never an unregistered "www"-prefixed one, after any change
  // near this (see README/wrangler.jsonc for how to check the live bundle).
  env: {
    NEXT_PUBLIC_SITE_URL: "https://forthe22.org",
    NEXT_PUBLIC_CAMPAIGN_URL: "https://tri.forthe22.org",
    NEXT_PUBLIC_RUCK_URL: "https://ruck.forthe22.org",
    NEXT_PUBLIC_APP_URL: "https://app.forthe22.org",
  },
  // Static security headers on every response. The Content-Security-Policy is
  // deliberately NOT here: it needs a per-request nonce, so it's built and set
  // in src/middleware.ts instead. These are the headers that need no per-request
  // state and would otherwise ship with nothing but Next's defaults.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Cloudflare already terminates TLS for every hostname on the zone.
          // No `preload` yet — that commits every current and future subdomain
          // to HTTPS-only and should be a deliberate, separate decision.
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Blocks MIME sniffing on every served file. Doesn't break the
          // Supabase-hosted journal images (their own response headers) or the
          // Next image optimizer (correct image/* content types).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Defense in depth alongside CSP's frame-ancestors 'none', for the
          // user agents that predate CSP2.
          { key: "X-Frame-Options", value: "DENY" },
          // The site is deliberately link-heavy to off-site donation and
          // sponsor pages; don't leak full URLs (donor/mile query params) to
          // those third parties.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // `fullscreen` is intentionally NOT disabled — the Journal's
          // YouTube/Vimeo embed facade offers a fullscreen button
          // (src/components/journal/journal-video-embed.tsx).
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Tabnabbing protection without breaking any auth flow: this app has
          // no popup-based OAuth, but 'same-origin' would also sever
          // window.opener for future ones, so allow popups explicitly.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Journal image uploads — see the "journal-media" Storage bucket in supabase/schema.sql.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // YouTube video thumbnails for the Journal's vlog embed facade.
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async redirects() {
    const campaignUrl = process.env.NEXT_PUBLIC_CAMPAIGN_URL ?? "http://localhost:3000";

    return [
      // The Journal replaces the old Updates feature — see supabase/schema.sql's
      // note on public.posts and src/app/journal/.
      { source: "/updates", destination: "/journal", permanent: true },
      { source: "/updates/:slug", destination: "/journal/:slug", permanent: true },

      // Retired org-domain routes — athlete recruitment/onboarding is
      // closed pending written federal ethics approval (see
      // src/lib/content/athletes.ts, athlete-agreement.ts). These used to
      // redirect to the org's own /mission page, which re-created the
      // exact movement/campaign confusion the domain split exists to fix —
      // they now go to the campaign's own explainer instead. See
      // README's "Movement/Campaign Domain Split".
      { source: "/athletes", destination: `${campaignUrl}/the-mission`, permanent: true },
      { source: "/join", destination: `${campaignUrl}/the-mission`, permanent: true },
      { source: "/athlete-agreement", destination: `${campaignUrl}/the-mission`, permanent: true },

      // Merchandise and donation-mechanics content are campaign-specific —
      // moved off the parent domain entirely (see src/app/shop,
      // src/app/financial-transparency).
      { source: "/merch", destination: `${campaignUrl}/shop`, permanent: true },
      { source: "/how-funds-work", destination: `${campaignUrl}/financial-transparency`, permanent: true },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
