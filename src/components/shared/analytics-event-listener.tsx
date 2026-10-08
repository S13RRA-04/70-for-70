"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/plausible";

/**
 * Two conventions already exist across the ~35 components that set
 * `data-analytics-event` (predating this file, never previously consumed by
 * anything — see git history): on an interactive element (a/button/
 * role=button), it names a click event; on a plain container (div/section),
 * it names a "this was seen" view event. This component is the single place
 * that reads the attribute and fires it through Plausible — individual
 * components never need to import an analytics module themselves, so
 * adding a new instrumented element anywhere is just adding the attribute.
 * Any other `data-*` attribute on the same element (e.g. data-asset-id) is
 * forwarded as a Plausible prop.
 */
const INTERACTIVE_SELECTOR =
  "a[data-analytics-event], button[data-analytics-event], [role='button'][data-analytics-event], input[type='submit'][data-analytics-event]";

function datasetProps(el: HTMLElement): Record<string, string> | undefined {
  const rest = Object.fromEntries(
    Object.entries(el.dataset).filter(([key, value]) => key !== "analyticsEvent" && value !== undefined),
  ) as Record<string, string>;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

export function AnalyticsEventListener() {
  const pathname = usePathname();

  // Click tracking: one stable, document-level delegated listener. Event
  // delegation means this needs no re-registration as the DOM changes
  // across client-side navigations, unlike the view-tracking effect below.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (el?.dataset.analyticsEvent) {
        trackEvent(el.dataset.analyticsEvent, datasetProps(el));
      }
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // View tracking: re-scan on every route change. The App Router keeps the
  // root layout (and this component) mounted across client-side
  // navigations, so the previous render's DOM nodes are gone but this
  // effect wouldn't otherwise know to look for new ones.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          if (el.dataset.analyticsEvent) {
            trackEvent(el.dataset.analyticsEvent, datasetProps(el));
          }
        }
      },
      { threshold: 0.25 },
    );

    document.querySelectorAll<HTMLElement>("[data-analytics-event]").forEach((el) => {
      if (!el.matches(INTERACTIVE_SELECTOR)) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
