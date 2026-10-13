import { Container } from "@/components/shared/container";
import { isFirstResponderDayWindow } from "@/lib/first-responder-day";

/**
 * Shown on every route, every host (same placement/pattern as
 * AwarenessBanner) — National First Responder Day (October 28) isn't
 * campaign- or org-specific. Self-gating on the date check means nothing
 * needs to change when October rolls around next year.
 */
export function FirstResponderDayBanner() {
  if (!isFirstResponderDayWindow()) return null;

  return (
    <div className="border-b border-off-white/10 bg-ink text-off-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-3 text-center">
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">
          <span className="font-semibold uppercase tracking-wide text-bronze-light">
            October 28 is National First Responder Day.
          </span>{" "}
          Thank you to the police officers, firefighters, paramedics, and dispatchers who show up for everyone else.
        </p>
        {/* Plain <a>, not <Link> — same reasoning as AwarenessBanner: on a
            campaign host /resources 308s cross-origin to forthe22.org, and
            Next's client-side fetch-based navigation gets CORS-blocked
            following that redirect. A full page load handles it fine. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional, see comment above */}
        <a
          href="/resources"
          className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 decoration-bronze underline-offset-4 hover:text-off-white/80 sm:text-sm"
        >
          Find Resources
        </a>
      </Container>
    </div>
  );
}
