"use client";

/**
 * Plausible Analytics — the custom-events layer Cloudflare Web Analytics
 * can't provide (Cloudflare's own FAQ: "Does Web Analytics support custom
 * events? Not yet."). Cloudflare Web Analytics (src/lib/analytics/config.ts,
 * cloudflare.ts) stays the pageview/performance RUM source; this is purely
 * additive for named events. See AnalyticsEventListener, which fires these
 * from the `data-analytics-event` attributes already present across ~35
 * components — this module only wraps the `window.plausible` call.
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * No-ops instead of throwing when the script hasn't loaded yet (ad blocker,
 * slow network, or not yet injected) — same fail-open shape as
 * verifyTurnstileToken/sendEmail elsewhere; a missed analytics event must
 * never break the interaction that triggered it.
 */
export function trackEvent(eventName: string, props?: Record<string, string>): void {
  try {
    window.plausible?.(eventName, props && Object.keys(props).length > 0 ? { props } : undefined);
  } catch {
    // Swallow — see doc comment above.
  }
}
