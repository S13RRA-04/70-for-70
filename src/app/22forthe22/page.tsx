import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import { getGiveawayPrizes } from "@/lib/data/giveaway-prizes";
import { getEventActivityLog } from "@/lib/data/event-activity-log";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getJournalEntriesByCategory } from "@/lib/data/journal";
import { getCurrentEventStatus } from "@/lib/22-for-the-22/event-status";
import {
  EVENT_CHALLENGE_FORMAT_COPY,
  EVENT_HOW_IT_WORKS_STEPS,
  EVENT_SEO,
  EVENT_WHAT_IS_COPY,
  GIVEAWAY_ODDS_DISCLOSURE,
  NO_PURCHASE_NECESSARY_DISCLOSURE,
  SAFETY_LANGUAGE,
} from "@/lib/content/22-for-the-22";
import { EventHero } from "@/components/22-for-the-22/event-hero";
import { EventGiveawaySection } from "@/components/22-for-the-22/event-giveaway-section";
import { LiveEventPanel } from "@/components/22-for-the-22/live-event-panel";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CampaignProgress } from "@/components/campaign/campaign-progress";
import { CAMPAIGN_URL, DONATE_LINK } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: EVENT_SEO.title,
  description: EVENT_SEO.description,
  canonical: `${CAMPAIGN_URL}/22forthe22`,
});

export default async function EventPage() {
  const event = await getCurrentEventConfig();

  if (!event) {
    return (
      <Container className="max-w-2xl py-24 text-center">
        <p className="text-sm text-charcoal-light">22 For the 22 details are coming soon.</p>
      </Container>
    );
  }

  const [prizes, activityLog, missionPartners, liveJournalEntries] = await Promise.all([
    getGiveawayPrizes(event.id),
    getEventActivityLog(event.id),
    getMissionPartners(),
    getJournalEntriesByCategory("22 For the 22"),
  ]);

  const status = getCurrentEventStatus(event.starts_at, event.ends_at, event.status_override);
  const giveawaySupporters = missionPartners.filter((p) => p.associated_campaigns?.includes("22-for-the-22"));

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.event_name,
    startDate: event.starts_at,
    endDate: event.ends_at,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    description: EVENT_SEO.description,
    organizer: { "@type": "Organization", name: "Tri For The 22" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c") }}
      />

      <EventHero event={event} status={status} registerHref={event.registration_open ? "#register" : "#giveaway"} />

      {status === "live" && (
        <LiveEventPanel event={event} activityLog={activityLog} latestJournalEntries={liveJournalEntries.slice(0, 3)} />
      )}

      {status === "complete" && (
        <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading eyebrow="22 Hours Complete" title="Thank You for Moving" tone="dark" />
            <p className="mt-4 text-base leading-relaxed text-off-white/75">
              {event.winner_announcement ?? "Winners will be announced here once the giveaway drawing is complete."}
            </p>
          </Container>
        </section>
      )}

      {/* What Is 22 For the 22? */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Challenge" title="What Is 22 For the 22?" />
          <div className="mt-5 space-y-4">
            {EVENT_WHAT_IS_COPY.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-charcoal-light">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="How It Works" title="Register. Move. Go for 22." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {EVENT_HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={step.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                <span className="font-display text-2xl font-bold text-bronze">{i + 1}</span>
                <p className="mt-2 font-display text-base font-bold uppercase tracking-wide text-ink">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Challenge Format */}
      <section className="border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Challenge Format" title="Keep Moving, However You Move" tone="dark" />
          <div className="mt-5 space-y-2">
            {EVENT_CHALLENGE_FORMAT_COPY.map((line, i) => (
              <p key={i} className="text-base leading-relaxed text-off-white/80">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-off-white/60">{SAFETY_LANGUAGE}</p>
        </Container>
      </section>

      {/* Registration */}
      {event.registration_open ? (
        <section id="register" className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading
              eyebrow="Register"
              title="Register Free"
              description="Solo or team, local or remote — registration is free, and completing it enters you in the 22-Hour Giveaway."
            />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink">
              {NO_PURCHASE_NECESSARY_DISCLOSURE}
            </p>
            <div className="mt-8">
              <EventRegistrationForm />
            </div>
          </Container>
        </section>
      ) : (
        <section id="register" className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading eyebrow="Register" title="Registration Is Closed" description="Check back for the next 22 For the 22." />
          </Container>
        </section>
      )}

      {/* Giveaway */}
      <EventGiveawaySection prizes={prizes} partners={missionPartners} />

      {/* Event Shirt */}
      {event.merch_url && (
        <section className="border-y border-ink/10 bg-off-white py-16 sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading
              eyebrow="Event Shirt"
              title="Get the 22 For the 22 Event Shirt"
              description="Shirt purchase is optional and does not affect giveaway eligibility or odds."
            />
            <a
              href={event.merch_url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="22_merch_click"
              className="mt-6 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Get the Event Shirt
            </a>
          </Container>
        </section>
      )}

      {/* Donation + Fundraising Goal */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Support the Mission"
            title="22 For the 22 Fundraising Goal"
            description="Registration is free. If the mission speaks to you, consider supporting the organizations behind Tri For the 22."
          />
          <div className="mt-8">
            <CampaignProgress totalRaised={event.amount_raised} goal={event.fundraising_goal} />
          </div>
          <Link
            href={event.donate_url ?? DONATE_LINK.href}
            data-analytics-event="22_donate_click"
            className="mt-6 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Support the Mission
          </Link>
        </Container>
      </section>

      {/* Supporters */}
      {giveawaySupporters.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="With Thanks To" title="22 For the 22 Supporters" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {giveawaySupporters.map((partner) => (
                <div key={partner.id} className="rounded-sm border border-ink/10 bg-off-white p-6">
                  <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {partner.name}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-light">{partner.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Safety */}
      <section className="border-t border-ink/10 py-10">
        <Container className="max-w-2xl">
          <p className="text-sm leading-relaxed text-charcoal-light">{SAFETY_LANGUAGE}</p>
          <p className="mt-3 text-xs leading-relaxed text-charcoal-light/80">{GIVEAWAY_ODDS_DISCLOSURE}</p>
          <Link href="/22forthe22/rules" data-analytics-event="22_rules_view" className="mt-3 inline-flex text-xs font-semibold uppercase tracking-wide text-bronze hover:underline">
            Read the Official Rules &rarr;
          </Link>
        </Container>
      </section>

      {/* Get Involved cross-link */}
      <section className="border-t border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-2xl font-semibold uppercase tracking-wide">Want to Do More?</p>
          <p className="mt-3 text-base text-off-white/75">
            Sponsor the event, donate a giveaway prize, or volunteer alongside the mission.
          </p>
          <Link
            href="/get-involved"
            className="mt-6 inline-flex rounded-sm border border-off-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-off-white/10"
          >
            See Get Involved
          </Link>
        </Container>
      </section>
    </>
  );
}
