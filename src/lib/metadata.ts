import type { Metadata } from "next";

/**
 * Every page.tsx across the site sets its own title/description/canonical,
 * but Next.js merges `openGraph` and `twitter` shallowly PER TOP-LEVEL KEY
 * (see Metadata API's "Merging" docs) — a page that sets its own
 * `openGraph`/`twitter` object REPLACES the root layout's whole object,
 * not just the fields it names. Without this, every page's social share
 * (Facebook/LinkedIn/iMessage/Slack preview, Twitter/X card) showed the
 * generic site-wide title/description instead of the page's own, regardless
 * of what that page's <title> actually said. Route every page's metadata
 * through this so title/description stay in sync across all three (plain
 * metadata, openGraph, twitter) instead of just the first — and so `url`,
 * `type`, and the Twitter `card` type (set once on the root layout) don't
 * silently vanish on every page that overrides openGraph/twitter, which is
 * every page that uses this helper.
 */
export function pageMetadata({
  title,
  description,
  canonical,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  canonical: string;
  /** Absolute or root-relative social share image — only set when a real one exists (e.g. a journal entry's hero image). */
  image?: string;
  /** og:type — "article" for journal/blog-style entries, "website" (default) for everything else. */
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: { canonical },
  };
}
