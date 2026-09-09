import Image from "next/image";
import Link from "next/link";
import { EventStatusClock } from "./event-status-clock";
import { EVENT_HERO_CONTENT } from "@/lib/content/22-for-the-22";
import { DONATE_LINK } from "@/lib/constants";
import type { EventConfigRow, EventLiveStatus } from "@/types/database";

export function EventHero({
  event,
  status,
  registerHref = "#register",
}: {
  event: EventConfigRow;
  status: EventLiveStatus;
  registerHref?: string;
}) {
  return (
    <section
      data-analytics-event="event_page_view"
      className="relative overflow-hidden bg-ink py-16 text-off-white sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Image
          src="/22-for-the-22-logo-white.png"
          alt="22 For the 22"
          width={88}
          height={88}
          className="h-16 w-16 sm:h-20 sm:w-20"
        />
        <h1 className="mt-6 text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
          {EVENT_HERO_CONTENT.headline}
        </h1>
        <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-bronze-light sm:text-xl">
          {EVENT_HERO_CONTENT.subheadline}
        </p>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">
          {EVENT_HERO_CONTENT.dateDisplay} &middot; {EVENT_HERO_CONTENT.timeDisplay} &middot;{" "}
          {EVENT_HERO_CONTENT.durationDisplay}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          {event.registration_open && (
            <Link
              href={registerHref}
              data-analytics-event="22_register_click"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              {EVENT_HERO_CONTENT.primaryCta}
            </Link>
          )}
          <Link
            href={event.donate_url ?? DONATE_LINK.href}
            data-analytics-event="22_donate_click"
            className="rounded-sm border border-off-white/40 px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
          >
            {EVENT_HERO_CONTENT.secondaryCta}
          </Link>
          {event.merch_url && (
            <a
              href={event.merch_url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="22_merch_click"
              className="text-sm font-semibold uppercase tracking-wide text-off-white/70 hover:text-off-white"
            >
              {EVENT_HERO_CONTENT.tertiaryCta} &rarr;
            </a>
          )}
        </div>

        <div className="mt-10 max-w-md">
          <EventStatusClock
            startsAtIso={event.starts_at}
            endsAtIso={event.ends_at}
            statusOverride={event.status_override}
            initialStatus={status}
          />
        </div>
      </div>
    </section>
  );
}
