import type { Metadata } from "next";

/**
 * Every page.tsx across the site sets its own title/description/canonical,
 * but Next.js merges `openGraph` and `twitter` shallowly per top-level key
 * (see Metadata API's "Merging" docs) — a page that doesn't set its own
 * `openGraph`/`twitter` object inherits the root layout's whole object
 * unchanged, not just a title fallback. Without this, every page's social
 * share (Facebook/LinkedIn/iMessage/Slack preview, Twitter/X card) showed
 * the generic site-wide title/description instead of the page's own,
 * regardless of what that page's <title> actually said. Route every page's
 * metadata through this so title/description stay in sync across all three
 * (plain metadata, openGraph, twitter) instead of just the first.
 */
export function pageMetadata({
  title,
  description,
  canonical,
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    alternates: { canonical },
  };
}
