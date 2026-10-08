import Image from "next/image";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getPartners } from "@/lib/data/partners";
import { getMissionPartners } from "@/lib/data/mission-partners";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { ExternalDonateButton } from "@/components/shared/external-donate-button";
import { DonationTrackingNote } from "@/components/shared/donation-tracking-note";
import { MissionProgress } from "@/components/campaign/mission-progress";
import {
  CAMPAIGNS,
  ORG_HOME_LINK,
  RUCK_DONATION_TRACKING_CODE,
  RUCK_EVENT_BENEFICIARIES,
  RUCK_EVENT_INFO,
  RUCK_EVENT_ORGANIZER,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatCurrency } from "@/lib/utils";
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
          <details className="mt-4 text-xs text-charcoal-light">
            <summary className="cursor-pointer font-semibold uppercase tracking-wide text-olive">Donation attribution details</summary>
            <DonationTrackingNote partnerName={data.name} trackingCode={trackingCode} />
          </details>
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
  const [allPartners, missionPartners, fundraisingStats] = await Promise.all([
    getPartners(),
    getMissionPartners(),
    getFundraisingImpactStats(),
  ]);
  const campaignBeneficiaries = allPartners.filter((p) =>
    (RUCK_EVENT_INFO.beneficiaries as readonly string[]).includes(p.name),
  );
  const campaignPartners = missionPartners.filter((p) => p.associated_campaigns?.includes("ruck"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventJsonLd()).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <Image
          src="/topo-map.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover opacity-[0.08]"
        />
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:min-h-[76vh] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <a
              href={ORG_HOME_LINK.href}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light hover:underline"
            >
              {SITE_NAME} Presents
            </a>
            <h1 className="mt-3 text-balance font-display text-hero font-bold uppercase leading-[0.95] tracking-tight">
              {RUCK.name}
            </h1>

            <div className="mt-7 grid max-w-2xl grid-cols-2 gap-px bg-off-white/15 sm:grid-cols-3">
              <div className="col-span-2 bg-ink/90 p-5 sm:col-span-1"><p className="font-display text-6xl font-bold leading-none text-sand">22</p><p className="mt-1 text-xs font-semibold uppercase tracking-widest text-off-white/65">Miles</p></div>
              <div className="bg-ink/90 p-5"><p className="font-display text-2xl font-bold uppercase text-off-white">Oct 24</p><p className="mt-1 text-xs font-semibold uppercase tracking-widest text-off-white/65">2026</p></div>
              <div className="bg-ink/90 p-5"><p className="font-display text-2xl font-bold uppercase text-off-white">0800</p><p className="mt-1 text-xs font-semibold uppercase tracking-widest text-off-white/65">Start</p></div>
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-sand">Huntsville, Alabama</p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={RUCK.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="ruck_register_click"
                className="inline-flex items-center gap-1.5 rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-ink shadow-sm transition-colors hover:bg-bronze-light"
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
          </div>

          <div className="border-l-4 border-olive bg-off-white/5 p-7 backdrop-blur-sm sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Event status</p>
            <p className="mt-2 font-display text-4xl font-bold uppercase leading-tight text-off-white">Registration Open</p>
            <p className="mt-5 font-display text-2xl font-semibold text-sand">October 24, 2026 · 0800</p>
            <p className="mt-4 text-sm leading-relaxed text-off-white/70">Join Cody in Huntsville for the full distance, or walk your own distance with your community.</p>
          </div>
        </Container>
      </section>

      {/* What is RuckUp22 */}
      <section className="relative overflow-hidden border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-24">
        <Image src="/topo-map.png" alt="" fill aria-hidden="true" className="object-cover opacity-[0.06]" />
        <Container className="relative grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <p aria-hidden="true" className="font-display text-[10rem] font-bold leading-none text-olive sm:text-[14rem]">22</p>
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">The Cause</p><h2 className="mt-2 font-display text-4xl font-semibold uppercase">Why 22?</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-off-white/75">
            22 has become a widely recognized symbol of veteran suicide awareness. It&apos;s historically
            significant, but it isn&apos;t the current national number — the VA&apos;s most recent data (2023)
            puts the daily average at 17.5 Veterans lost to suicide, and law enforcement, fire, EMS,
            dispatch, and corrections face a version of the same crisis with far less complete
            reporting. RuckUp22 turns that awareness into a physical act: rucking, walking, or hiking
            with those numbers in mind, alongside family, friends, and community.
          </p>
          </div>
        </Container>
      </section>

      {/* Event details */}
      <section id="event" className="scroll-mt-24 border-b border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The Event"
            title={RUCK_EVENT_INFO.name}
            description={`${RUCK_EVENT_INFO.eventDateDisplay} — ${RUCK_EVENT_INFO.location}`}
          />
          <dl className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {[["Date", "October 24, 2026"], ["Start", "0800 Central"], ["Location", "Huntsville, Alabama"], ["Distance", "22 Miles"], ["Organizer", RUCK_EVENT_ORGANIZER.name], ["Registration", "Open"]].map(([label, value]) => <div key={label} className="bg-off-white p-6"><dt className="text-xs font-semibold uppercase tracking-widest text-olive">{label}</dt><dd className="mt-2 font-display text-xl font-semibold uppercase text-ink">{value}</dd></div>)}
          </dl>
          <div className="mt-8 grid gap-6 lg:grid-cols-2"><p className="text-sm leading-relaxed text-charcoal-light">{RUCK_EVENT_INFO.locationDetail}</p><p className="text-sm leading-relaxed text-charcoal-light">{RUCK_EVENT_INFO.formatNote}</p></div>
          <a
            href={RUCK.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 rounded-sm bg-bronze-text px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-dark"
          >
            Register on Eventbee
            <ExternalLink size={14} aria-hidden />
          </a>
        </Container>
      </section>

      {/* Campaign partners — e.g. GORUCK supporting RuckUp22 with event-day gear. */}
      {campaignPartners.length > 0 && (
        <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="With Thanks To" title="Campaign Partners" />
            <div className="mt-8 flex flex-wrap items-center gap-8">
              {campaignPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url ?? undefined}
                  target={partner.website_url ? "_blank" : undefined}
                  rel={partner.website_url ? "noopener noreferrer" : undefined}
                  className="group"
                >
                  <PartnerLogo
                    name={partner.name}
                    logoUrl={partner.logo_url}
                    logoLightUrl={partner.logo_light_url}
                    logoDarkUrl={partner.logo_dark_url}
                    background={partner.logo_background}
                    className="h-16 w-fit transition-opacity group-hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Beneficiaries */}
      <section id="beneficiaries" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <div className="border-l-4 border-olive bg-sand-light p-6 sm:p-8">
          <SectionHeading
            eyebrow="RuckUp22 Event Proceeds"
            title="Registration Supports Two Event Beneficiaries"
            description={`Registration and ticket proceeds for ${RUCK_EVENT_INFO.name}, organized by ${RUCK_EVENT_ORGANIZER.name} (EIN ${RUCK_EVENT_ORGANIZER.ein}), support these organizations.`}
          />
          <p className="mt-5 font-display text-lg font-semibold uppercase text-olive">RuckUp22 <span aria-hidden="true">↓</span> Battle Buddy Foundation + Tunnel to Towers</p>
          </div>
          <RevealGrid>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
          </RevealGrid>

          {campaignBeneficiaries.length > 0 && (
            <div className="mt-16 border-t-4 border-ink pt-8">
              <SectionHeading
                eyebrow="Cody's Ruck Campaign"
                title="A Separate Path Into The $70K Mission"
                description={`Alongside RuckUp22 itself, Cody's own Ruck For The 22 effort supports the same causes as ${CAMPAIGNS.tri.name} — and contributes to For The 22's shared ${formatCurrency(fundraisingStats.fundraisingGoal)} mission goal.`}
              />
              <p className="mt-5 font-display text-lg font-semibold uppercase text-ink">Cody&apos;s Ruck Campaign <span aria-hidden="true">↓</span> The $70K Mission <span aria-hidden="true">↓</span> {campaignBeneficiaries.length} verified {campaignBeneficiaries.length === 1 ? "beneficiary" : "beneficiaries"}</p>
              <div className="mt-6 rounded-sm border border-ink/10 bg-sand-light p-6 lg:max-w-3xl">
                <MissionProgress totalRaised={fundraisingStats.amountRaised} goal={fundraisingStats.fundraisingGoal} />
                <p className="mt-4 text-xs text-charcoal-light">
                  This reflects Cody&apos;s own Ruck For The 22 fundraising, not RuckUp22 Huntsville&apos;s
                  registration/ticket proceeds — those go directly to RuckUp22&apos;s own event beneficiaries above.
                </p>
                <a
                  href={`${SITE_URL}/70k`}
                  className="mt-5 inline-flex text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  Explore the Full $70K Mission &rarr;
                </a>
              </div>
              <RevealGrid>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
              </RevealGrid>
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
