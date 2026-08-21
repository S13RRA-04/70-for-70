import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { JoinInterestForm } from "@/components/forms/join-interest-form";
import { CAMPAIGN_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Find your place in the For The 22 mission — as a veteran or first responder looking for support, an athlete, an organization, a brand, or a volunteer.",
  alternates: { canonical: "/join" },
};

const PATHWAYS = [
  {
    title: "I Need a Resource",
    description: "Find support, programs, and services for veterans and first responders.",
    ctaLabel: "Find Resources →",
    href: "/resources",
  },
  {
    title: "I Want to Compete",
    description: "Join the For The 22 Athletic Team and race, ride, ruck, swim, or lift for the mission.",
    ctaLabel: "Tell Us About Yourself ↓",
    href: "#athlete-interest",
  },
  {
    title: "I Represent an Organization",
    description: "Become a mission partner or campaign beneficiary.",
    ctaLabel: "Partner With Us →",
    href: `${CAMPAIGN_URL}/partners/inquire`,
  },
  {
    title: "I Represent a Brand",
    description: "Sponsor a campaign or an athlete.",
    ctaLabel: "Sponsor Us →",
    href: `${CAMPAIGN_URL}/sponsors/request`,
  },
  {
    title: "I Want to Help",
    description: "Volunteer, share the mission, or support in another way.",
    ctaLabel: "Get in Touch →",
    href: "/contact",
  },
] as const;

export default function JoinPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Get Involved"
            title="Find Your Place in the Mission"
            description="Whoever you are, there's a way in."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PATHWAYS.map((pathway) => {
              const external = pathway.href.startsWith("http");
              const Element = external ? "a" : Link;
              return (
                <Element
                  key={pathway.title}
                  href={pathway.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex flex-col border border-ink/10 bg-off-white p-6 transition-colors hover:border-anchor/30"
                >
                  <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                    {pathway.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-light">
                    {pathway.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-bronze">
                    {pathway.ctaLabel}
                  </span>
                </Element>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="athlete-interest" className="scroll-mt-20 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={`Join ${SITE_NAME}`}
              title="Race. Ride. Ruck. Swim. Lift. Move."
              description="Use your challenge for something bigger. Onboarding isn't open yet — this is just the start of the list."
            />

            <p className="mt-6 text-sm text-charcoal-light">
              {SITE_NAME} is a movement, not a single event. Tri For The 22 is the current campaign —
              future campaigns (Run, Ride, Ruck For The 22) will open to more athletes over time. Tell
              us who you are, and we&apos;ll reach out as that grows.
            </p>

            <p className="mt-8 text-xs text-charcoal-light">
              Athletes who go on to formally affiliate with {SITE_NAME} accept a separate{" "}
              <Link href="/athlete-agreement" className="text-bronze hover:underline">
                Athlete Participation &amp; Affiliation Agreement
              </Link>{" "}
              before representing themselves as an affiliated athlete, using {SITE_NAME} branding, or
              receiving program support.
            </p>
          </div>

          <div>
            <JoinInterestForm />
          </div>
        </Container>
      </section>
    </>
  );
}
