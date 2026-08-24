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
    return [
      // The Journal replaces the old Updates feature — see supabase/schema.sql's
      // note on public.posts and src/app/journal/.
      { source: "/updates", destination: "/journal", permanent: true },
      { source: "/updates/:slug", destination: "/journal/:slug", permanent: true },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
