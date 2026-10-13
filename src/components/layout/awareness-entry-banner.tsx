import { Container } from "@/components/shared/container";
import { AWARENESS_CALENDAR, getActiveBannerEntry } from "@/lib/content/awareness-calendar";

/**
 * Generic, data-driven sitewide banner — replaces the old one-off
 * FirstResponderDayBanner file pair. Shows whichever AWARENESS_CALENDAR
 * entry's bannerLeadDays window is currently open (see
 * getActiveBannerEntry for how overlapping windows, e.g. Veterans Day
 * inside National Veterans and Military Families Month, are resolved);
 * renders nothing the rest of the year. Adding a new priority observance's
 * banner going forward means setting bannerLeadDays + bannerCopy on its
 * content entry, not writing a new component.
 *
 * September's Suicide Prevention Month intentionally has no bannerLeadDays
 * set, so it never competes with this banner — it stays on its own bespoke
 * AwarenessBanner (ribbon image + teal/purple accent colors threaded into
 * Header/Footer), which this component doesn't touch.
 */
export function AwarenessEntryBanner() {
  const now = new Date();
  const active = getActiveBannerEntry(AWARENESS_CALENDAR, now);
  if (!active) return null;

  return (
    <div className="border-b border-off-white/10 bg-ink text-off-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-3 text-center">
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">
          <span className="font-semibold uppercase tracking-wide text-bronze-light">{active.name}</span>{" "}
          {active.bannerCopy ?? active.summary}
        </p>
        {/* Plain <a>, not <Link> — /awareness is org-only (see
            ORG_PATH_PREFIXES in middleware.ts); on a campaign host this 308s
            cross-origin to forthe22.org, and Next's client-side
            fetch-based navigation gets CORS-blocked following that
            redirect. A full page load handles it fine, same reasoning as
            AwarenessBanner's /crisis link. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional, see comment above */}
        <a
          href={`/awareness/${active.slug}`}
          className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 decoration-bronze underline-offset-4 hover:text-off-white/80 sm:text-sm"
        >
          Learn More
        </a>
      </Container>
    </div>
  );
}
