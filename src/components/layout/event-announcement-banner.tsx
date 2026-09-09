import Link from "next/link";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getCurrentEventStatus, isEventPromoWindowNow } from "@/lib/22-for-the-22/event-status";
import type { CampaignSlug } from "@/lib/site-mode";

/**
 * Sitewide "22 For the 22" announcement — tri.forthe22.org only, and only
 * during the promo window (see isEventPromoWindow's doc comment), same
 * self-gating pattern as AwarenessBanner. Async Server Component: unlike
 * AwarenessBanner's pure date check, this needs the live event_config row
 * (dates, registration_open) before it can decide whether to render.
 */
export async function EventAnnouncementBanner({ campaignSlug }: { campaignSlug: CampaignSlug | null }) {
  if (campaignSlug !== "tri") return null;

  const event = await getCurrentEventConfig();
  if (!event) return null;

  if (!isEventPromoWindowNow(event.starts_at, event.ends_at)) return null;

  const status = getCurrentEventStatus(event.starts_at, event.ends_at, event.status_override);
  const ctaLabel = status === "live" ? "Follow the 22-Hour Challenge" : "Join the Challenge";

  return (
    <div className="border-b border-off-white/10 bg-ink text-off-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-3 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">
          <span className="font-semibold uppercase tracking-wide text-bronze-light">22 For the 22</span>{" "}
          {status === "live" ? "is live now — 22 hours, one mission." : "· Nov 21–22, 2026 · Free to join."}
        </p>
        <Link
          href="/22forthe22"
          className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 decoration-bronze underline-offset-4 hover:text-off-white/80 sm:text-sm"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
