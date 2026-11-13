import { Fragment } from "react";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { CTAButton } from "@/components/shared/cta-button";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { EmailSignupForm } from "@/components/forms/email-signup-form";
import { GalleryWall } from "@/components/seen/gallery-wall";
import { getPartners } from "@/lib/data/partners";
import {
  SEEN_CAMPAIGN_DESCRIPTION,
  SEEN_CAMPAIGN_TAGLINE,
  SEEN_CONCEPT,
  SEEN_CONSENT_PROMISES,
  SEEN_HERO_INTRO,
  SEEN_JOIN_PATHS,
  SEEN_MEDIA,
  SEEN_PILLARS,
  SEEN_PROCEEDS,
  SEEN_STEPS,
  type SeenJoinPath,
  type SeenPillar,
} from "@/lib/content/seen-campaign";
import {
  CONTACT_EMAIL,
  LIVE_CAMPAIGN_NAME,
  LIVE_CAMPAIGN_URL,
  MISSION_NAME,
  SEEN_CAMPAIGN_NAME,
  SEEN_CAMPAIGN_URL,
  SITE_NAME,
  SITE_URL,
  SEEN_CAMPAIGN_PATH,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: `${SEEN_CAMPAIGN_NAME} | ${SEEN_CAMPAIGN_TAGLINE}`,
  description: SEEN_CAMPAIGN_DESCRIPTION,
  canonical: SEEN_CAMPAIGN_PATH,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([{ name: SEEN_CAMPAIGN_NAME, url: SEEN_CAMPAIGN_URL }]);

function mailto(subject: string): string | null {
  return CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${SEEN_CAMPAIGN_NAME} — ${subject}`)}` : null;
}

const STORY_MAILTO = mailto("I would like to share my story");
const ARTIST_MAILTO = mailto("Artist interest");

/** Lighter tints of each pillar color, readable on the jet "Where it goes" band. */
const PILLAR_ON_DARK: Record<SeenPillar["name"], string> = {
  Connection: "text-[#1e78c8]",
  Mobilization: "text-[#9daa4a]",
  Impact: "text-[#3fa672]",
};

const EYEBROW = "label-caps text-live-red";

/** Joins beneficiary names into natural list copy ("A, B, and C"). */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default async function SeenCampaignPage() {
  const beneficiaryNames = (await getPartners()).map((b) => b.name);
  const consentPromises = SEEN_CONSENT_PROMISES.filter((promise) => promise.confirmed);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      {/* Hero — the gallery wall. */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <Container className="flex flex-wrap items-center gap-x-16 gap-y-14 pb-24 pt-20">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5.5">
            <span className={EYEBROW}>{SITE_NAME} presents</span>
            <h1 id="hero-heading" className="relative">
              <span className="text-worn seen-reveal block font-display text-[clamp(140px,17vw,240px)] uppercase leading-[0.85] tracking-[0.02em]">
                Seen
              </span>
              <span
                aria-hidden="true"
                className="seen-reveal mt-2.5 block h-3.5 w-[78%] rounded-[2px] bg-[url(/brand/edge-left.webp)] bg-cover bg-left opacity-85"
              />
            </h1>
            <p className="font-serif text-[clamp(32px,3.4vw,46px)] italic leading-[1.12]">{SEEN_CAMPAIGN_TAGLINE}</p>
            <p className="max-w-[480px] text-lg text-[#3a3a3a]">{SEEN_HERO_INTRO}</p>
            <p className="label-caps text-xs text-[#6a6a6a]">{SEEN_MEDIA.join(" · ")}</p>
            <div className="flex flex-wrap gap-3">
              <CTAButton href="#join" size="lg" magnetic>
                Take part
              </CTAButton>
              <CTAButton href="#list" size="lg" variant="secondary" className="bg-transparent">
                Get on the list
              </CTAButton>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_520px] justify-center">
            <GalleryWall />
          </div>
        </Container>
      </section>

      {/* The idea. */}
      <section id="idea" aria-labelledby="idea-heading" className="scroll-mt-24 border-y border-[#e4e1d8] bg-white">
        <Container className="flex max-w-[1100px] flex-col gap-8 py-28">
          <span className={EYEBROW}>The idea</span>
          <h2 id="idea-heading" className="font-serif text-[clamp(44px,5.6vw,80px)] font-normal leading-[1.04] tracking-normal">
            {SEEN_CONCEPT.lead} <em>{SEEN_CONCEPT.leadEmphasis}</em>
          </h2>
          <div className="grid gap-x-14 gap-y-6 text-[19px] text-[#2a2a2a] md:grid-cols-2">
            <p>{SEEN_CONCEPT.body}</p>
            <p>
              {SEEN_CONCEPT.companion}{" "}
              <a href={LIVE_CAMPAIGN_URL} className="font-bold text-jet hover:text-live-red">
                {LIVE_CAMPAIGN_NAME}
              </a>{" "}
              {SEEN_CONCEPT.closer}
            </p>
          </div>
        </Container>
      </section>

      {/* How it works — each step carries its provenance. */}
      <section id="how" aria-labelledby="how-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-12 py-28">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex flex-col gap-3.5">
              <span className={EYEBROW}>How it works</span>
              <h2 id="how-heading" className="text-worn font-display text-[clamp(56px,7vw,100px)] uppercase leading-none">
                Story. Artwork. Impact.
              </h2>
            </div>
            <p className="max-w-[380px] font-serif text-2xl italic leading-[1.3] text-[#3a3a3a]">
              Every piece carries its provenance — where it came from, and who it&apos;s for.
            </p>
          </div>
          <RevealGrid>
            <ol className="grid gap-7 md:grid-cols-3">
              {SEEN_STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col gap-5.5">
                  <div aria-hidden="true" className="flex h-[260px] items-center justify-center gap-3.5">
                    {STEP_ILLUSTRATIONS[i]}
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span aria-hidden="true" className="font-display text-[44px] leading-none text-live-red">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[32px] uppercase leading-none">{step.title}</h3>
                  </div>
                  <p className="text-[#3a3a3a]">{step.description}</p>
                </li>
              ))}
            </ol>
          </RevealGrid>
        </Container>
      </section>

      {/* Where it goes. */}
      <section id="impact" aria-labelledby="impact-heading" className="scroll-mt-24 bg-jet text-paper">
        <Container className="flex flex-col gap-12 py-28">
          <div className="flex flex-wrap items-end justify-between gap-x-18 gap-y-8">
            <div className="flex max-w-[640px] flex-col gap-3.5">
              <span className="label-caps text-gold">Where it goes</span>
              <h2 id="impact-heading" className="font-display text-[clamp(56px,7vw,100px)] uppercase leading-none">
                More than a canvas.
              </h2>
            </div>
            <div className="flex max-w-[440px] items-center gap-4.5">
              <span aria-hidden="true" className="seen-dot h-11 w-11" />
              <p className="font-serif text-2xl italic leading-[1.3]">
                In a gallery, a red dot means a piece has found its home. Here, every red dot funds the mission.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-stretch gap-4">
            <FlowCard label="Proceeds">
              <span className="text-lg leading-normal">
                {SEEN_PROCEEDS.map((item) => (
                  <span key={item} className="block">
                    {item}
                  </span>
                ))}
              </span>
            </FlowCard>
            <FlowArrow />
            <FlowCard label="First received by">
              <span className="font-display text-[30px] uppercase leading-none">{SITE_NAME}</span>
              <span className="text-[15px] text-[#bdbdbd]">toward {MISSION_NAME}, the shared goal behind every campaign</span>
            </FlowCard>
            <FlowArrow />
            <FlowCard label="Distributed evenly to" highlight>
              {beneficiaryNames.length > 0 && (
                <span className="text-lg font-bold leading-normal">
                  {beneficiaryNames.map((name) => (
                    <span key={name} className="block">
                      {name}
                    </span>
                  ))}
                </span>
              )}
              <a href={`${SITE_URL}/impact#beneficiaries`} className="text-[15px] font-bold text-paper hover:text-gold">
                About the beneficiaries &rarr;
              </a>
            </FlowCard>
          </div>

          <div className="grid border-t border-[#3a3a3a] md:grid-cols-3">
            {SEEN_PILLARS.map((pillar) => (
              <div key={pillar.name} className="pt-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <span className={`label-caps text-xs ${PILLAR_ON_DARK[pillar.name]}`}>{pillar.name}</span>
                <p className="mt-2 text-base text-[#d8d6d0]">
                  {pillar.name === "Impact" && beneficiaryNames.length > 0
                    ? `Proceeds support ${joinNames(beneficiaryNames)}.`
                    : pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Take part — wall placards. */}
      <section id="join" aria-labelledby="join-heading" className="scroll-mt-24">
        <Container className="flex flex-col gap-12 pb-18 pt-28">
          <div className="flex flex-col items-center gap-3.5 text-center">
            <span className={EYEBROW}>Take part</span>
            <h2 id="join-heading" className="font-serif text-[clamp(48px,6vw,84px)] font-normal leading-[1.02] tracking-normal">
              Every story deserves <em>to be seen.</em>
            </h2>
          </div>
          <RevealGrid>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {STORY_MAILTO && (
                <Placard {...SEEN_JOIN_PATHS.storytellers} href={STORY_MAILTO}>
                  <span className="text-[13px] text-[#5a5a5a]">
                    Revisiting a story can bring things up. Help is there anytime:{" "}
                    <a href="tel:988" className="font-bold text-jet hover:text-live-red">
                      988, press 1
                    </a>
                    .
                  </span>
                </Placard>
              )}
              {ARTIST_MAILTO && <Placard {...SEEN_JOIN_PATHS.artists} href={ARTIST_MAILTO} />}
              <Placard {...SEEN_JOIN_PATHS.partners} href={`${SITE_URL}/network#partners`} />
            </div>
          </RevealGrid>
        </Container>
      </section>

      {/* Care & consent. */}
      <section aria-labelledby="terms-heading">
        <Container className="pb-28">
          <div className="flex flex-wrap gap-x-14 gap-y-7 rounded-[4px] border border-[#e4e1d8] bg-white p-10">
            <div className="flex flex-[1_1_280px] flex-col gap-3">
              <span className={EYEBROW}>Care &amp; consent</span>
              <h2 id="terms-heading" className="font-serif text-[44px] font-normal leading-[1.05] tracking-normal">
                Your story, <em>your terms.</em>
              </h2>
            </div>
            <ul className="grid min-w-0 flex-[999_1_560px] gap-x-7 gap-y-4.5 text-base sm:grid-cols-2">
              {consentPromises.map((promise) => (
                <li key={promise.title} className="border-t-[3px] border-jet pt-2.5">
                  <strong>{promise.title}</strong> {promise.detail}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Every piece is for someone — the dark room. */}
      <section aria-labelledby="why-heading" className="relative overflow-hidden bg-seen-room text-paper">
        <span
          aria-hidden="true"
          className="seen-spot left-1/2 top-0 ml-[-450px] h-[760px] w-[900px] bg-[radial-gradient(ellipse_45%_70%_at_50%_0%,rgb(255_236_190/0.22),rgb(255_236_190/0.05)_50%,transparent_78%)]"
        />
        <Container className="relative flex max-w-[900px] flex-col items-center gap-7 py-28 text-center">
          <div className="seen-frame bg-[#2a2a2a] p-3 shadow-[0_30px_60px_rgb(0_0_0/0.6)]">
            <div className="bg-[#111111] px-12 py-9">
              <Image
                src="/brand/because-22-white.webp"
                alt="Because 22 does not equal 0"
                width={1600}
                height={1014}
                sizes="380px"
                className="block h-auto w-[380px] max-w-full"
              />
            </div>
          </div>
          <h2 id="why-heading" className="mt-3 font-serif text-[clamp(44px,5.4vw,72px)] font-normal leading-[1.04] tracking-normal">
            Every piece is <em>for someone.</em>
          </h2>
          <p className="max-w-[640px] text-[#cfcfcf]">
            The 22 is a symbol of the veterans and first responders we&apos;ve lost. We make these stories visible so
            the people still here know they&apos;re seen — and so the organizations supporting them can keep going.
          </p>
          <a href={`${SITE_URL}/about#why-black`} className="font-bold text-white hover:underline">
            Why we wear black &rarr;
          </a>
        </Container>
      </section>

      {/* Get on the list. */}
      <section id="list" aria-labelledby="list-heading" className="scroll-mt-24">
        <Container className="flex max-w-[820px] flex-col items-center gap-4.5 py-26 text-center">
          <span className={EYEBROW}>Opening soon</span>
          <h2 id="list-heading" className="font-display text-[clamp(48px,6vw,80px)] uppercase leading-none">
            Get on the list.
          </h2>
          <p className="text-[#3a3a3a]">
            First word on featured stories, artists, exhibitions, and auctions — plus {SITE_NAME}&apos;s other updates.
          </p>
          <div className="mt-2 flex justify-center">
            <EmailSignupForm idleLabel="Count me in" />
          </div>
        </Container>
      </section>
    </>
  );
}

/** One illustration per SEEN_STEPS entry, in order: the story, the sketch, the finished piece. */
const STEP_ILLUSTRATIONS = [
  // A notebook page with the first line of a story.
  <div
    key="story"
    className="relative box-border h-[190px] w-[300px] max-w-full -rotate-2 bg-white bg-[repeating-linear-gradient(180deg,transparent_0_27px,#b9d3ea_27px_28px)] pl-10 pr-5.5 pt-7 shadow-[0_10px_22px_rgb(27_27_27/0.12)]"
  >
    <span className="absolute inset-y-0 left-[30px] border-l-2 border-[#e8a3a3]" />
    <span className="font-serif text-[22px] italic leading-[28px] text-[#2a3a5a]">
      &ldquo;I never told anyone about that night until&hellip;&rdquo;
    </span>
  </div>,
  // A sketchbook page mid-interpretation.
  <div
    key="sketch"
    className="relative h-[220px] w-[250px] rotate-[1.5deg] overflow-hidden border border-[#e4e1d8] bg-[#fbfaf6] shadow-[0_10px_22px_rgb(27_27_27/0.10)]"
  >
    <span className="absolute inset-x-0 top-0 h-[18px] bg-[repeating-linear-gradient(90deg,#c9c6bc_0_6px,transparent_6px_14px)]" />
    <svg viewBox="0 0 250 220" className="absolute inset-0 h-full w-full">
      <path
        d="M70 170 C 60 120, 80 70, 125 60 S 190 85, 185 135 S 150 190, 110 180"
        fill="none"
        stroke="#2A2A2A"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M95 150 C 90 120, 105 95, 130 92 S 165 110, 160 138"
        fill="none"
        stroke="#2A2A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M60 190 L 95 175 M 75 196 L 115 180 M 92 200 L 140 182 M 120 201 L 170 180"
        stroke="#2A2A2A"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M118 60 C 128 40, 150 38, 160 52"
        fill="none"
        stroke="#D3202A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  </div>,
  // The finished, framed piece — red-dotted.
  <Fragment key="piece">
    <div className="seen-frame box-border h-[220px] w-[170px] p-2.5">
      <div className="seen-mat p-3.5">
        <div className="h-full bg-[#edeae2] bg-[url(/brand/hero-paint-left.webp)] bg-cover bg-[30%_center]" />
      </div>
    </div>
    <div className="seen-label w-[120px] self-end">
      <span className="seen-dot h-3 w-3 align-[-1px]" /> <strong className="text-jet">Found its home</strong>
      <br />
      Proceeds to {MISSION_NAME}
    </div>
  </Fragment>,
];

function FlowCard({
  label,
  highlight = false,
  children,
}: {
  label: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-[1_1_260px] flex-col gap-2 rounded-[4px] border p-6 ${highlight ? "border-gold" : "border-[#3a3a3a]"}`}
    >
      <span className={`label-caps text-xs ${highlight ? "text-gold" : "text-[#bdbdbd]"}`}>{label}</span>
      {children}
    </div>
  );
}

function FlowArrow() {
  return (
    <span aria-hidden="true" className="hidden self-center text-[28px] text-gold md:inline">
      &rarr;
    </span>
  );
}

function Placard({
  title,
  meta,
  cta,
  href,
  children,
}: SeenJoinPath & { href: string; children?: React.ReactNode }) {
  return (
    <div className="seen-placard h-full">
      <h3 className="font-serif text-4xl font-normal normal-case leading-[1.05] tracking-normal">{title}</h3>
      <dl className="seen-meta">
        <dt>For</dt>
        <dd>{meta.for}</dd>
        <dt>Medium</dt>
        <dd>{meta.medium}</dd>
        <dt>Begins</dt>
        <dd>{meta.begins}</dd>
      </dl>
      <CTAButton href={href} external size="lg" className="mt-auto self-start">
        {cta}
      </CTAButton>
      {children}
    </div>
  );
}
