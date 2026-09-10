import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getCurrentEventStatus } from "@/lib/22-for-the-22/event-status";
import type { EventConfigRow } from "@/types/database";

/**
 * The campaign homepage's conditional 6th section — only rendered when
 * isEventPromoWindow() is true (see campaign-home/page.tsx), so it doesn't
 * show stale event content most of the year. CTA label switches to "Follow"
 * once the event goes live, same status-aware copy as
 * EventAnnouncementBanner.
 */
export function EventPromoSection({ event }: { event: EventConfigRow }) {
  const status = getCurrentEventStatus(event.starts_at, event.ends_at, event.status_override);

  return (
    <section className="border-b border-ink/10 bg-bronze py-16 text-off-white sm:py-20">
      <Container className="max-w-2xl text-center">
        <p className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">22 For the 22</p>
        <p className="mt-2 text-base font-semibold uppercase tracking-wide text-off-white/90">
          22 Minutes. 22 Times. One Mission.
        </p>
        <p className="mt-3 text-sm text-off-white/80">November 21–22, 2026</p>
        <Link
          href="/22forthe22"
          data-analytics-event="22_register_click"
          className="mt-6 inline-flex rounded-sm bg-ink px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-charcoal"
        >
          {status === "live" ? "Follow 22 For the 22" : "Join the Challenge"}
        </Link>
      </Container>
    </section>
  );
}
