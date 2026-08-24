import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
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
