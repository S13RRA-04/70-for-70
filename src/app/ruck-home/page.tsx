import { ExternalLink, ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Countdown } from "@/components/shared/countdown";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { ExternalDonateButton } from "@/components/shared/external-donate-button";
import { DonationTrackingNote } from "@/components/shared/donation-tracking-note";
import {
  CAMPAIGNS,
  ORG_HOME_LINK,
  RUCK_DONATION_TRACKING_CODE,
  RUCK_EVENT_BENEFICIARIES,
  RUCK_EVENT_INFO,
  RUCK_EVENT_ORGANIZER,
  SITE_NAME,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { LogoBackground } from "@/types/database";

const RUCK = CAMPAIGNS.ruck;

export const metadata = pageMetadata({
  // Root layout's title template already appends " | Ruck For The 22" on
  // this host (see generateMetadata in src/app/layout.tsx).
  title: RUCK.tagline,
  description: RUCK.description,
  canonical: `${RUCK.url}/`,
});

function buildEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: RUCK_EVENT_INFO.name,
    startDate: RUCK_EVENT_INFO.eventDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: RUCK_EVENT_INFO.location,
      address: RUCK_EVENT_INFO.location,
    },
    description: RUCK_EVENT_INFO.formatNote,
    url: RUCK.url,
    // The event itself is organized by RuckUp 22, Inc., not For The 22 —
    // see RUCK_EVENT_INFO's doc comment.
    organizer: { "@type": "Organization", name: RUCK_EVENT_ORGANIZER.name, url: RUCK_EVENT_INFO.ticketUrl },
  };
}

interface BeneficiaryCardData {
  name: string;
  description?: string | null;
  websiteUrl?: string | null;
  donationUrl?: string | null;
  ein?: string | null;
  verified?: boolean;
  logo?: {
    url: string | null;
    lightUrl?: string | null;
    darkUrl?: string | null;
    background?: LogoBackground | null;
  } | null;
}

/**
 * One beneficiary card, reused for both RuckUp22's own beneficiaries
 * (plain data — see RUCK_EVENT_BENEFICIARIES) and Cody's usual campaign
 * beneficiaries (Supabase `partners` rows). `trackingCode` is only passed
 * for the latter group, and only when that partner's donation platform
 * can't self-attribute a gift — RuckUp22's own beneficiaries have no such
 * arrangement with Cody/RuckUp 22, Inc., so they never show one.
 */
function BeneficiaryCard({
  eyebrow,
  data,
  trackingCode,
}: {
  eyebrow: string;
  data: BeneficiaryCardData;
  trackingCode?: string;
}) {
  const hasLinks = Boolean(data.websiteUrl || data.donationUrl);

  return (
    <div className="flex flex-col gap-6 rounded-sm border border-ink/10 bg-off-white p-6 sm:flex-row sm:p-8">
      <div className="shrink-0 sm:w-48">
        <PartnerLogo
          name={data.name}
          logoUrl={data.logo?.url ?? null}
          logoLightUrl={data.logo?.lightUrl}
          logoDarkUrl={data.logo?.darkUrl}
          background={data.logo?.background}
          className="h-20"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold uppercase tracking-wide text-ink">
          {data.name}
        </h3>
        {data.verified && (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
            <ShieldCheck size={13} aria-hidden />
            Verified 501(c)(3){data.ein ? ` · EIN ${data.ein}` : ""}
          </p>
        )}
        {data.description && <p className="mt-4 text-sm text-charcoal-light">{data.description}</p>}
        {hasLinks && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {data.websiteUrl && (
              <a
                href={data.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="beneficiary_selected"
                className="inline-flex items-center gap-1.5 rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
              >
                Learn More
                <ExternalLink size={13} aria-hidden />
              </a>
            )}
            {data.donationUrl && (
              <ExternalDonateButton
                href={data.donationUrl}
                orgName={data.name}
                label={`Support ${data.name} Directly →`}
              />
            )}
          </div>
        )}
        {data.donationUrl && trackingCode && (
          <DonationTrackingNote partnerName={data.name} trackingCode={trackingCode} />
        )}
      </div>
    </div>
  );
}

/**
 * Ruck For The 22's entire site — rendered at "/" on ruck.forthe22.org via a
 * transparent middleware rewrite (see src/middleware.ts). Deliberately one
 * page: hero, event details, beneficiaries, done. No training tracker, no
 * per-mile fundraising mechanism, no admin CRUD — see RUCK_CAMPAIGN_URL's
 * doc comment in src/lib/constants.ts for why. Any other path on this host
 * redirects back here (see applyRuckSingleHomeGuard in src/middleware.ts).
 */
export default async function RuckHomePage() {
  const allPartners = await getPartners();
  const campaignBeneficiaries = allPartners.filter((p) =>
    (RUCK_EVENT_INFO.beneficiaries as readonly string[]).includes(p.name),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventJsonLd()).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{ backgroundImage: "url(/topo-map.png)" }}
          aria-hidden="true"
        />
        <Container className="relative py-16 sm:py-24">
          <a
            href={ORG_HOME_LINK.href}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light hover:underline"
          >
            {SITE_NAME} Presents
          </a>
          <h1 className="mt-3 text-balance font-display text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            {RUCK.name}
          </h1>

          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-bronze-light sm:text-xl">
            {RUCK_EVENT_INFO.name} &middot; {RUCK_EVENT_INFO.eventDateDisplay}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-off-white/80">
            {RUCK_EVENT_INFO.formatNote}
          </p>

          <p className="mt-3 max-w-xl text-base italic leading-relaxed text-off-white/70">
            {RUCK_EVENT_INFO.personalNote}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={RUCK.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="ruck_register_click"
              className="inline-flex items-center gap-1.5 rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              {RUCK.primaryCta.label} on Eventbee
              <ExternalLink size={16} aria-hidden />
            </a>
            <a
              href="#beneficiaries"
              className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Donate
            </a>
          </div>

          {RUCK_EVENT_INFO.eventDate && (
            <div className="mt-10 max-w-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-off-white/60">
                Event Countdown
              </p>
              <Countdown targetIso={RUCK_EVENT_INFO.eventDate} />
            </div>
          )}
        </Container>
      </section>

      {/* What is RuckUp22 */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="The Cause" title="Why 22?" />
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            22 has become a widely recognized symbol of veteran suicide awareness. It&apos;s historically
            significant, but it isn&apos;t the current national number — the VA&apos;s most recent data (2023)
            puts the daily average at 17.5 Veterans lost to suicide, and law enforcement, fire, EMS,
            dispatch, and corrections face a version of the same crisis with far less complete
            reporting. RuckUp22 turns that awareness into a physical act: rucking, walking, or hiking
            with those numbers in mind, alongside family, friends, and community.
          </p>
        </Container>
      </section>

      {/* Event details */}
      <section id="event" className="scroll-mt-24 border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="The Event"
            title={RUCK_EVENT_INFO.name}
            description={`${RUCK_EVENT_INFO.eventDateDisplay} — ${RUCK_EVENT_INFO.location}`}
          />
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                Huntsville Location
              </p>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">
                {RUCK_EVENT_INFO.locationDetail}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Format</p>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">
                {RUCK_EVENT_INFO.formatNote}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Organizer</p>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">
                RuckUp22 Huntsville is organized by {RUCK_EVENT_ORGANIZER.name}, a 501(c)(3)
                nonprofit (EIN {RUCK_EVENT_ORGANIZER.ein}) — not by {SITE_NAME}. Ruck For The 22 is
                Cody&apos;s own participation in, and parallel fundraising alongside, this event.
              </p>
            </div>
          </div>
          <a
            href={RUCK.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
          >
            Register on Eventbee
            <ExternalLink size={14} aria-hidden />
          </a>
        </Container>
      </section>

      {/* Beneficiaries */}
      <section id="beneficiaries" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Who It Supports"
            title="RuckUp22's Beneficiaries"
            description={`Registration and ticket proceeds for ${RUCK_EVENT_INFO.name}, organized by ${RUCK_EVENT_ORGANIZER.name} (EIN ${RUCK_EVENT_ORGANIZER.ein}), support these organizations.`}
          />
          <div className="mt-8 flex flex-col gap-6">
            {RUCK_EVENT_BENEFICIARIES.map((b) => (
              <BeneficiaryCard
                key={b.name}
                eyebrow="RuckUp22 Beneficiary"
                data={{
                  name: b.name,
                  description: b.description,
                  websiteUrl: b.websiteUrl,
                  donationUrl: b.donationUrl,
                  ein: b.ein,
                  verified: true,
                }}
              />
            ))}
          </div>

          {campaignBeneficiaries.length > 0 && (
            <div className="mt-14">
              <SectionHeading
                eyebrow="Also"
                title="Ruck For The 22 Also Supports"
                description={`Alongside RuckUp22 itself, Cody's own Ruck For The 22 effort supports the same causes as ${CAMPAIGNS.tri.name}.`}
              />
              <div className="mt-8 flex flex-col gap-6">
                {campaignBeneficiaries.map((partner) => (
                  <BeneficiaryCard
                    key={partner.id}
                    eyebrow="Ruck For The 22 Beneficiary"
                    data={{
                      name: partner.name,
                      description: partner.what_they_do,
                      websiteUrl: partner.website_url,
                      donationUrl: partner.donation_url,
                      ein: partner.ein,
                      verified: partner.nonprofit_status_verified,
                      logo: {
                        url: partner.logo_url,
                        lightUrl: partner.logo_light_url,
                        darkUrl: partner.logo_dark_url,
                        background: partner.logo_background,
                      },
                    }}
                    trackingCode={partner.requires_donation_note ? RUCK_DONATION_TRACKING_CODE : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 max-w-2xl text-sm font-medium text-charcoal-light">
            Donations are made directly through each independent nonprofit organization&apos;s
            authorized donation platform. Neither {SITE_NAME} nor {RUCK_EVENT_ORGANIZER.name}
            receives, processes, or takes possession of charitable contributions made this way, and
            neither issues tax receipts.
          </p>
        </Container>
      </section>
    </>
  );
}
