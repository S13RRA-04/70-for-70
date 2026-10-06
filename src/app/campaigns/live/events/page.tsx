import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { getPublishedLiveEvents } from "@/lib/data/live-events";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/constants";

export const metadata = pageMetadata({
  title: "For The 22: Live — Upcoming Shows",
  description: "Upcoming For The 22: Live benefit concerts — dates, venues, and ticket links.",
  canonical: "/campaigns/live/events",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "For The 22: Live", url: `${SITE_URL}/campaigns/live` },
  { name: "Shows", url: `${SITE_URL}/campaigns/live/events` },
]);

export default async function LiveEventsPage() {
  const events = await getPublishedLiveEvents();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading as="h1" eyebrow="For The 22: Live" title="Upcoming Shows" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {events.length === 0 ? (
            <EmptyState
              title="No Concerts Scheduled Yet"
              description="For The 22: Live shows will appear here as they're announced."
              cta={{ label: "See the Bigger Mission", href: "/70k" }}
            />
          ) : (
            <RevealGrid>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/campaigns/live/${event.slug}`}
                    className="hover-lift flex flex-col rounded-sm border border-ink/10 bg-off-white p-6"
                  >
                    {event.starts_at && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                        {formatDateLong(event.starts_at)}
                      </p>
                    )}
                    <h2 className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-ink">
                      {event.title}
                    </h2>
                    {event.venue_name && (
                      <p className="mt-1 text-sm text-charcoal-light">
                        {event.venue_name}
                        {event.venue_city && `, ${event.venue_city}`}
                        {event.venue_state && `, ${event.venue_state}`}
                      </p>
                    )}
                    {event.tagline && <p className="mt-3 flex-1 text-sm text-charcoal-light">{event.tagline}</p>}
                    <span className="mt-4 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark">
                      See Details &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </RevealGrid>
          )}
        </Container>
      </section>
    </>
  );
}
