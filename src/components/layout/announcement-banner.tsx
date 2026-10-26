import { Container } from "@/components/shared/container";
import { SITE_URL } from "@/lib/constants";
import { getActiveAnnouncementBanner } from "@/lib/content/announcements";

/**
 * Sitewide banner for org announcements (src/lib/content/announcements.ts).
 * Self-gates on the entry's bannerUntil window, same as AwarenessEntryBanner,
 * so it disappears on its own without a follow-up deploy. The post lives on
 * forthe22.org only, so the link is an absolute SITE_URL — a relative /news
 * link on a campaign host would cost a middleware redirect hop.
 */
export function AnnouncementBanner() {
  const active = getActiveAnnouncementBanner(new Date());
  if (!active) return null;

  return (
    <div className="border-b border-off-white/10 bg-navy text-off-white">
      {/* The three ring colors from the new logo: Ranger Green, Blue, Muted Gold. */}
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #616f36 0 33.33%, #0766c1 33.33% 66.66%, #d4a845 66.66%)" }}
      />
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-3 text-center">
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">{active.bannerCopy}</p>
        <a
          href={`${SITE_URL}/news/${active.slug}`}
          className="text-xs font-bold uppercase tracking-[0.2em] text-off-white underline decoration-2 underline-offset-4 hover:text-off-white/80 sm:text-sm"
          style={{ textDecorationColor: "#d4a845" }}
        >
          Read the Story
        </a>
      </Container>
    </div>
  );
}
