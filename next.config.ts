import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Forces the exact build-time value Next.js inlines for these three
  // NEXT_PUBLIC_* vars, regardless of what process.env already holds by
  // the time this file loads. Added because the deployed Worker bundle
  // was found to have SITE_URL compiled in as the wrong, DNS-less
  // "https://www.forthe22.org" (see wrangler.jsonc's long comment on the
  // exact same value) even though every other layer — the GitHub Actions
  // "Build and deploy" step's own env: block, wrangler.jsonc's vars, and
  // the live Worker's actual runtime bindings (checked directly via the
  // Cloudflare API) — all correctly show "https://forthe22.org". Next's
  // own env-loading order (process.env, then .env.$(NODE_ENV).local,
  // .env.local, .env.$(NODE_ENV), .env) runs before this file is even
  // evaluated, so something upstream of next.config.ts was resolving to a
  // stale value for this one var specifically — CAMPAIGN_URL/RUCK_URL,
  // defined identically, were not affected, which is what made this so
  // hard to pin down. This `env` block is Next's own documented
  // last-word override for exactly this situation: whatever it says here
  // is what actually gets inlined, no matter what upstream env resolution
  // produced. Safe fallback matches wrangler.jsonc's vars exactly.
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://forthe22.org",
    NEXT_PUBLIC_CAMPAIGN_URL: process.env.NEXT_PUBLIC_CAMPAIGN_URL || "https://tri.forthe22.org",
    NEXT_PUBLIC_RUCK_URL: process.env.NEXT_PUBLIC_RUCK_URL || "https://ruck.forthe22.org",
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
