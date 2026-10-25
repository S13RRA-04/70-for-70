import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { JournalVideoEmbed } from "@/components/journal/journal-video-embed";
import { BeneficiaryCard } from "@/components/ruck/beneficiary-card";
import { MissionAccomplishedStamp } from "@/components/ruck/mission-accomplished-stamp";
import { MissionJournal } from "@/components/ruck/mission-journal";
import { getRuckMission, type RuckMission } from "@/lib/content/ruck-missions";
import { CAMPAIGNS, MISSION_NAME, SITE_NAME, SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { formatCurrency } from "@/lib/utils";

const RUCK = CAMPAIGNS.ruck;

/**
 * One completed Ruck For The 22 mission — served at /missions/<slug> on
 * ruck.forthe22.org through a Ruck-host rewrite in src/middleware.ts. All
 * content comes from RUCK_MISSIONS (src/lib/content/ruck-missions.ts);
 * sections without data (no coverage yet, no reconciled raised amount)
 * are left out rather than shown empty.
 */
function missionUrl(slug: string) {
  return `${RUCK.url}/missions/${slug}`;
}

export async function generateMetadata(props: PageProps<"/ruck-missions/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const mission = getRuckMission(slug);
  if (!mission || mission.status !== "completed") return {};
  const photo = mission.journal.find((entry) => !entry.video);
  return pageMetadata({
    title: `${mission.name} — Mission Accomplished`,
    description: mission.summary,
    canonical: missionUrl(mission.slug),
    image: photo?.src,
    type: "article",
  });
}

function missionJsonLd(mission: RuckMission) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: mission.name,
      startDate: mission.date,
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: mission.location, address: mission.location },
      description: mission.summary,
      url: missionUrl(mission.slug),
      ...(mission.organizer && { organizer: { "@type": "Organization", name: mission.organizer.name } }),
    },
    ...mission.mediaCoverage.map((coverage) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: coverage.title,
      description: `${coverage.outlet} coverage of ${mission.name}.`,
      thumbnailUrl: `https://img.youtube.com/vi/${coverage.youtubeId}/hqdefault.jpg`,
      uploadDate: coverage.uploadDate,
      duration: coverage.duration,
      embedUrl: `https://www.youtube.com/embed/${coverage.youtubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${coverage.youtubeId}`,
    })),
    breadcrumbJsonLd([
      { name: RUCK.name, url: RUCK.url },
      { name: mission.name, url: missionUrl(mission.slug) },
    ]),
  ];
}

export default async function RuckMissionPage(props: PageProps<"/ruck-missions/[slug]">) {
  const { slug } = await props.params;
  const mission = getRuckMission(slug);
  if (!mission || mission.status !== "completed") notFound();

  const facts: [string, string][] = [
    ["Date", mission.dateDisplay],
    ["Location", mission.location],
    ["Distance", `${mission.distanceMiles} Miles`],
    ...(mission.organizer ? [["Organizer", mission.organizer.name] as [string, string]] : []),
  ];

  return (
    <>
      {missionJsonLd(mission).map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(data)} />
      ))}

      {/* Header */}
      <section className="bg-ink py-14 text-off-white sm:py-20">
        <Container>
          <Link
            href="/#completed"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-sand hover:text-off-white"
          >
            <ArrowLeft size={14} aria-hidden />
            All Missions
          </Link>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-light">{RUCK.name} · Completed Mission</p>
              <h1 className="mt-3 text-balance font-display text-5xl uppercase leading-[0.95] sm:text-6xl">{mission.name}</h1>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-sand">
                {mission.dateDisplay} · {mission.location}
              </p>
              <p className="mt-6 text-base leading-relaxed text-off-white/75">{mission.summary}</p>
            </div>
            <MissionAccomplishedStamp date={mission.dateDisplay} tone="dark" className="shrink-0 self-start lg:self-center" />
          </div>
        </Container>
      </section>

      {/* Mission facts */}
      <section className="border-b border-ink/10 py-12 sm:py-16">
        <Container>
          <dl className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="bg-off-white p-6">
                <dt className="text-xs font-bold uppercase tracking-[0.2em] text-olive">{label}</dt>
                <dd className="mt-2 font-display text-2xl uppercase text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {mission.details && mission.details.length > 0 && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {mission.details.map((detail) => (
                <p key={detail} className="text-sm leading-relaxed text-charcoal-light">{detail}</p>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Media coverage */}
      {mission.mediaCoverage.length > 0 && (
        <section id="media-coverage" className="scroll-mt-28 border-b border-off-white/10 bg-ink py-16 text-off-white sm:py-20">
          <Container>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sand">Media Coverage</p>
            <div className="mt-6 grid gap-12">
              {mission.mediaCoverage.map((coverage) => (
                <div key={coverage.youtubeId} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
                  <RevealOnScroll>
                    <h2 className="font-display text-4xl uppercase">{coverage.outlet} Covers {mission.name}</h2>
                    <p className="mt-5 text-base leading-relaxed text-off-white/75">{coverage.title}.</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${coverage.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-sand hover:text-off-white"
                    >
                      Watch on YouTube
                      <ExternalLink size={14} aria-hidden />
                    </a>
                  </RevealOnScroll>
                  <RevealOnScroll>
                    <JournalVideoEmbed provider="youtube" videoId={coverage.youtubeId} title={coverage.title} fallbackImageUrl={null} />
                  </RevealOnScroll>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Raised by For The 22 */}
      {mission.amountRaised !== null && (
        <section id="raised" className="scroll-mt-28 border-b border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container>
            <RevealOnScroll as="div" className="border-l-4 border-olive pl-6 sm:pl-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-olive">Raised by {SITE_NAME}</p>
              <p className="mt-3 font-display text-6xl text-ink sm:text-7xl">{formatCurrency(mission.amountRaised)}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal-light">
                What {SITE_NAME} raised through this mission, counted toward {MISSION_NAME}.
              </p>
              <a
                href={`${SITE_URL}/70k`}
                className="mt-5 inline-flex text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
              >
                Explore {MISSION_NAME} &rarr;
              </a>
            </RevealOnScroll>
          </Container>
        </section>
      )}

      {/* Participation journal */}
      {(mission.journal.length > 0 || mission.specialEntry) && (
        <section id="journal" className="scroll-mt-28 border-b border-ink/10 py-16 sm:py-20">
          <Container>
            <RevealOnScroll>
              <SectionHeading
                eyebrow="Participation Journal"
                title="From the Trail"
                description={`Cody's own photos and videos from ${mission.name} on ${mission.dateDisplay}.`}
              />
            </RevealOnScroll>

            {mission.specialEntry && (
              <RevealOnScroll>
                <article
                  id={mission.specialEntry.id}
                  className="mt-10 scroll-mt-28 overflow-hidden rounded-xl border border-line border-l-4 border-l-bronze bg-white"
                >
                  <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="p-6 sm:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">Special Journal Entry</p>
                      <h3 className="mt-2 font-display text-3xl uppercase text-ink">{mission.specialEntry.title}</h3>
                      <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal">
                        {mission.specialEntry.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      <p className="mt-5 font-display text-xl uppercase text-ink">— Cody</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {mission.specialEntry.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-control inline-flex items-center gap-1.5 border-2 border-navy px-4 py-2 text-[15px] font-bold text-navy hover:bg-sand-light"
                          >
                            {link.label}
                            <ExternalLink size={13} aria-hidden />
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-1">
                      {mission.specialEntry.photos.map((photo) => (
                        <div key={photo.src} className="relative aspect-[4/3] bg-ink">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            )}

            {mission.journal.length > 0 && (
              <div className="mt-10">
                <MissionJournal entries={mission.journal} />
              </div>
            )}
          </Container>
        </section>
      )}

      {/* The event's own beneficiaries */}
      {mission.eventBeneficiaries && mission.eventBeneficiaries.length > 0 && mission.organizer && (
        <section id="event-beneficiaries" className="scroll-mt-28 py-16 sm:py-20">
          <Container>
            <RevealOnScroll as="div" className="border-l-4 border-olive bg-sand-light p-6 sm:p-8">
              <SectionHeading
                eyebrow={`${mission.name} Event Proceeds`}
                title="Event Beneficiaries"
                description={`Registration and ticket proceeds for ${mission.name}, organized by ${mission.organizer.name}${mission.organizer.ein ? ` (EIN ${mission.organizer.ein})` : ""}, support these organizations.`}
              />
            </RevealOnScroll>
            <RevealGrid>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {mission.eventBeneficiaries.map((b) => (
                  <BeneficiaryCard
                    key={b.name}
                    eyebrow={`${mission.name} Beneficiary`}
                    data={{ ...b, verified: true }}
                  />
                ))}
              </div>
            </RevealGrid>
            <p className="mt-8 max-w-2xl text-sm font-medium text-charcoal-light">
              Donations are made directly through each independent nonprofit organization&apos;s authorized donation
              platform. Neither {SITE_NAME} nor {mission.organizer.name} receives, processes, or takes possession of
              charitable contributions made this way, and neither issues tax receipts.
            </p>
          </Container>
        </section>
      )}
    </>
  );
}
