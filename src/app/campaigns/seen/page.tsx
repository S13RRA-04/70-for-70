import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { getPartners } from "@/lib/data/partners";
import {
  SEEN_CAMPAIGN_DESCRIPTION,
  SEEN_CAMPAIGN_TAGLINE,
  SEEN_CONCEPT,
  SEEN_FUNDS_DISCLOSURE,
  SEEN_JOIN_PATHS,
  SEEN_MEDIA,
  SEEN_PILLARS,
  SEEN_STEPS,
} from "@/lib/content/seen-campaign";
import {
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  LIVE_CAMPAIGN_NAME,
  LIVE_CAMPAIGN_URL,
  MISSION_NAME,
  SEEN_CAMPAIGN_NAME,
  SEEN_CAMPAIGN_URL,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `${SEEN_CAMPAIGN_NAME} | ${SEEN_CAMPAIGN_TAGLINE}`,
  description: SEEN_CAMPAIGN_DESCRIPTION,
  canonical: "/",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: SEEN_CAMPAIGN_NAME, url: SEEN_CAMPAIGN_URL }]);

function mailto(subject: string): string | null {
  return CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${SEEN_CAMPAIGN_NAME} — ${subject}`)}` : null;
}

const STORY_MAILTO = mailto("I would like to share my story");
const ARTIST_MAILTO = mailto("Artist interest");

/** Joins beneficiary names into natural list copy ("A, B, and C"). */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default async function SeenCampaignPage() {
  const beneficiaries = await getPartners();
  const beneficiaryNames = joinNames(beneficiaries.map((b) => b.name));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      {/* Hero. */}
      <section className="relative overflow-hidden">
        <Image src="/brand/hero-topo.webp" alt="" fill priority sizes="100vw" className="pointer-events-none object-cover" />
        <Image
          src="/brand/hero-paint-left.webp"
          alt=""
          width={760}
          height={900}
          className="pointer-events-none absolute left-0 top-0 h-full w-auto opacity-35 md:opacity-100"
        />
        <Image
          src="/brand/hero-paint-right.webp"
          alt=""
          width={820}
          height={900}
          className="pointer-events-none absolute right-0 top-0 h-full w-auto opacity-35 md:opacity-100"
        />
        <Container className="relative flex max-w-[1080px] flex-col items-center gap-5 pb-20 pt-16 text-center sm:pb-22 sm:pt-18">
          <h1 className="flex flex-col items-center gap-2">
            <span className="label-caps text-sm text-muted">For The 22</span>
            <span className="text-worn font-display text-[clamp(5.5rem,16vw,12rem)] uppercase leading-[0.9]">Seen</span>
          </h1>
          <p className="text-[15px] font-bold uppercase tracking-[0.32em]">{SEEN_CAMPAIGN_TAGLINE}</p>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">{SEEN_MEDIA.join("  |  ")}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <CTAButton href="#list" size="lg" magnetic>
              Get on the list
            </CTAButton>
            <CTAButton href="#join" size="lg" variant="secondary" className="bg-transparent">
              Take part
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* The idea. */}
      <section id="idea" aria-labelledby="idea-heading" className="scroll-mt-24 bg-jet text-paper">
        <Container className="flex flex-wrap items-start gap-x-20 gap-y-10 py-section">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5">
            <span className="label-caps text-[#8c8c8c]">The idea</span>
            <h2 id="idea-heading" className="font-display text-[clamp(2.5rem,4.6vw,3.75rem)] uppercase leading-none">
              {SEEN_CONCEPT.lead}
            </h2>
          </div>
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-4.5 text-[#cfcfcf]">
            {SEEN_CONCEPT.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-bold text-white">{SEEN_CONCEPT.closer}</p>
            <p>
              SEEN is the companion to{" "}
              <a href={LIVE_CAMPAIGN_URL} className="font-bold text-white underline underline-offset-4">
                {LIVE_CAMPAIGN_NAME}
              </a>
              : the same stories, told in a different medium. Art isn&apos;t simply another thing to auction —
              it&apos;s another way to communicate the mission.
            </p>
          </div>
        </Container>
      </section>

      {/* How it works. */}
      <section id="how" aria-labelledby="how-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-11 py-section">
          <div className="flex flex-col gap-3.5">
            <span className="label-caps text-steel">How it works</span>
            <h2 id="how-heading" className="text-worn font-display text-[clamp(3.25rem,6.6vw,5.75rem)] uppercase leading-none">
              <span className="text-outline">Story.</span> Artwork.
              <br />
              Impact.
            </h2>
          </div>
          <div aria-hidden="true" className="h-1 border-y-2 border-jet" />
          <RevealGrid>
            <ol className="grid gap-4 md:grid-cols-3">
              {SEEN_STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-2.5 rounded-[4px] border-2 border-jet bg-white p-7">
                  <span aria-hidden="true" className="font-display text-[54px] leading-none text-steel">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[30px] uppercase leading-none">{step.title}</h3>
                  <p className="text-base text-copy">{step.description}</p>
                </li>
              ))}
            </ol>
          </RevealGrid>
        </Container>
      </section>

      {/* Pillars + where it goes. */}
      <section id="impact" aria-labelledby="impact-heading" className="scroll-mt-24 border-y-2 border-jet bg-white">
        <Container className="flex flex-col gap-11 py-section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <span className="label-caps text-steel">Where it goes</span>
              <h2 id="impact-heading" className="text-worn font-display text-[clamp(3.25rem,6.6vw,5.75rem)] uppercase leading-none">
                <span className="text-outline">More than</span>
                <br />
                a canvas.
              </h2>
            </div>
            <p className="max-w-[420px] text-copy">
              Every part of {SEEN_CAMPAIGN_NAME} feeds {MISSION_NAME} — the shared goal behind every For The 22
              campaign.
            </p>
          </div>
          <RevealGrid>
            <div className="grid gap-4 md:grid-cols-3">
              {SEEN_PILLARS.map((pillar) => (
                <div key={pillar.name} className="flex flex-col gap-2.5 rounded-[4px] border-2 border-jet bg-paper p-7">
                  <h3 className="font-display text-[30px] uppercase leading-none">{pillar.name}</h3>
                  <p className="text-base text-copy">
                    {pillar.name === "Impact" && beneficiaryNames
                      ? `Proceeds support ${beneficiaryNames}.`
                      : pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </RevealGrid>
          <p className="max-w-3xl text-sm text-copy">
            {SEEN_FUNDS_DISCLOSURE}{" "}
            <a href={`${SITE_URL}/beneficiaries`} className="font-bold text-jet underline underline-offset-4 hover:text-steel">
              See the beneficiaries &rarr;
            </a>
          </p>
        </Container>
      </section>

      {/* Take part. */}
      <section id="join" aria-labelledby="join-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-12 py-section">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="join-heading" className="text-worn font-display text-[clamp(4rem,8vw,7.5rem)] uppercase leading-none">
              <span className="text-outline">Take part</span>
            </h2>
            <p className="font-display text-[clamp(1.625rem,3vw,2.5rem)] uppercase leading-none">
              Every story deserves to be seen
            </p>
          </div>
          <RevealGrid>
            <div className="grid gap-5 md:grid-cols-3">
              {STORY_MAILTO && <JoinCard {...SEEN_JOIN_PATHS.storytellers} href={STORY_MAILTO} external primary />}
              {ARTIST_MAILTO && <JoinCard {...SEEN_JOIN_PATHS.artists} href={ARTIST_MAILTO} external />}
              <JoinCard {...SEEN_JOIN_PATHS.hosts} href={`${CAMPAIGN_URL}/become-a-partner`} external />
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* Remembrance. */}
      <section aria-labelledby="why-heading" className="bg-jet text-paper">
        <Container className="flex flex-wrap items-center gap-x-20 gap-y-10 py-section">
          <div className="min-w-0 flex-[1_1_360px]">
            <Image
              src="/brand/because-22-white.webp"
              alt="Because 22 does not equal 0"
              width={1600}
              height={1014}
              sizes="(min-width: 768px) 460px, 100vw"
              className="h-auto w-full max-w-[460px]"
            />
          </div>
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-4.5">
            <span className="label-caps text-[#8c8c8c]">Lives have value. Always.</span>
            <h2 id="why-heading" className="font-display text-[clamp(2.5rem,4.6vw,3.75rem)] uppercase leading-none">
              Every piece is for someone.
            </h2>
            <p className="text-[#cfcfcf]">
              The 22 is a symbol of the veterans and first responders we&apos;ve lost. We make their stories
              visible so the people still here know they&apos;re seen — and so the organizations helping them can
              keep going.
            </p>
            <a href={`${SITE_URL}/about#why-black`} className="self-start font-bold text-white underline-offset-4 hover:underline">
              Why we wear black &rarr;
            </a>
          </div>
        </Container>
      </section>

      {/* Get on the list. */}
      <RevealOnScroll>
        <section id="list" aria-labelledby="list-heading" className="scroll-mt-24">
          <Container className="flex max-w-[820px] flex-col items-center gap-5 py-section text-center">
            <h2 id="list-heading" className="font-display text-[clamp(2.75rem,5vw,4.25rem)] uppercase leading-none">
              Get on the list.
            </h2>
            <p className="text-copy">
              First word on featured stories, artists, exhibitions, and auctions, along with For The 22&apos;s other
              updates.
            </p>
            <div className="mt-1.5 flex justify-center">
              <EmailSignupForm idleLabel="Count me in" />
            </div>
          </Container>
        </section>
      </RevealOnScroll>
    </>
  );
}

function JoinCard({
  title,
  description,
  cta,
  href,
  external = false,
  primary = false,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-3.5 rounded-[4px] border-2 border-jet bg-paper p-8">
      <h3 className="font-display text-4xl uppercase leading-none">{title}</h3>
      <p className="flex-grow text-copy">{description}</p>
      <CTAButton href={href} external={external} size="lg" accent={primary ? "bronze" : "black"} className="self-start">
        {cta}
      </CTAButton>
    </div>
  );
}
