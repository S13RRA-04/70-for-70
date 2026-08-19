import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { ABOUT_CONTENT } from "@/lib/content/about";
import { CAMPAIGN_HOME_LINK, CAMPAIGN_NAME, ORG_TAGLINE, SITE_NAME } from "@/lib/constants";

const MISSION_STATEMENT =
  "For The 22 is a national mission to raise awareness of veteran and first responder suicide, and to get them the help they need. Part of that mission is connecting them to resources — specifically, engagement in endurance sports.";

export default function HomePage() {
  const why22 = ABOUT_CONTENT.sections.find((s) => s.id === "why-22");

  return (
    <>
      {/* Hero — the movement, not a fundraiser */}
      <section className="relative overflow-hidden bg-ink text-off-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: "url(/hero-placeholder.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" aria-hidden="true" />

        <Container className="relative py-24 sm:py-32">
          <h1 className="text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            {SITE_NAME}
          </h1>
          <p className="mt-3 max-w-xl text-lg font-medium text-off-white/90 sm:text-xl">
            {ORG_TAGLINE}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-off-white/75">
            {MISSION_STATEMENT}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/resources"
              className="rounded-sm bg-bronze px-8 py-4 text-base font-semibold uppercase tracking-wide text-off-white shadow-sm transition-colors hover:bg-bronze-light"
            >
              Browse Resources
            </Link>
            <a
              href="#why-22"
              className="rounded-sm border border-off-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
            >
              Why 22?
            </a>
            <Link
              href="/join"
              className="text-sm font-semibold uppercase tracking-wide text-off-white/70 underline-offset-4 hover:text-off-white hover:underline"
            >
              Join the Movement
            </Link>
          </div>
        </Container>
      </section>

      {/* Why 22 */}
      {why22 && (
        <section id="why-22" className="scroll-mt-20 py-16 sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading eyebrow="Why 22" title={why22.heading} />
            <div className="mt-5 space-y-4">
              {why22.body.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* The Mission */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="The Mission"
            title="Endurance as a Path Forward"
            description="Awareness starts the conversation. Getting people moving — with a team, a mission, and people who understand — is what turns awareness into action."
          />
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            {SITE_NAME} connects veterans and first responders to the programs, communities, and
            equipment that make endurance sport an on-ramp back to purpose — not a replacement
            for professional help, but a real part of the path.
          </p>
        </Container>
      </section>

      {/* Resources teaser */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Get Connected"
            title="Resources for Veteran & First Responder Athletes"
            description="Programs, grants, equipment, and communities — organized by category."
          />
          <Link
            href="/resources"
            className="mt-6 inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
          >
            Browse Resources
          </Link>
        </Container>
      </section>

      {/* My Story teaser */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <MediaPlaceholder />
          </div>
          <div>
            <SectionHeading eyebrow="Who's Behind This" title="My Story" />
            <div className="mt-5 space-y-4">
              {ABOUT_CONTENT.homepageTeaser.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded-sm bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-charcoal"
            >
              Read My Story
            </Link>
          </div>
        </Container>
      </section>

      {/* Current campaign pointer — small, not a fundraising push */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="rounded-sm border border-ink/10 bg-off-white p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
              Current Mission
            </p>
            <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-tight text-ink">
              {CAMPAIGN_NAME}
            </p>
            <p className="mt-2 text-sm text-charcoal-light">
              A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of Mighty
              Oaks Foundation and Project Echelon — the first campaign under the {SITE_NAME}
              {" "}naming convention.
            </p>
            <a
              href={CAMPAIGN_HOME_LINK.href}
              className="mt-5 inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Visit {CAMPAIGN_HOME_LINK.label}
            </a>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow={`Join ${SITE_NAME}`}
        title="Race. Ride. Ruck. Swim. Lift. Move."
        description="Use your challenge for something bigger. Onboarding isn't open yet — this is just the start of the list."
        buttons={[
          { label: "Join the Movement", href: "/join" },
          { label: "Browse Resources", href: "/resources", variant: "secondary" },
        ]}
      />
    </>
  );
}
