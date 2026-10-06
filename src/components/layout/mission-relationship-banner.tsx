import { Container } from "@/components/shared/container";
import { SITE_URL } from "@/lib/constants";

/**
 * Tri-only — states the campaign/mission relationship above the header on
 * every page, so it's never ambiguous that Tri For The 22 is one campaign
 * under the larger For The 22 mission. Same slim-band pattern as
 * AwarenessBanner/EventAnnouncementBanner, just unconditional rather than
 * date/event-gated: the relationship is permanent, not seasonal.
 */
export function MissionRelationshipBanner() {
  return (
    <div className="border-b border-off-white/10 bg-ink text-off-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-2.5 text-center">
        <p className="text-xs font-medium leading-snug text-off-white/90 sm:text-sm">
          Tri For The 22 is a campaign of{" "}
          <span className="font-semibold uppercase tracking-wide text-bronze-light">For The 22</span> — supporting
          veterans, first responders, and their families.
        </p>
        <a
          href={SITE_URL}
          className="text-xs font-semibold uppercase tracking-widest text-off-white underline decoration-2 decoration-bronze underline-offset-4 hover:text-off-white/80 sm:text-sm"
        >
          Explore ForThe22.org <span aria-hidden="true">&#8599;</span>
        </a>
      </Container>
    </div>
  );
}
