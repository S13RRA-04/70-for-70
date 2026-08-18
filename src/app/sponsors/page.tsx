import type { Metadata } from "next";
import Link from "next/link";
import { getSponsors } from "@/lib/data/sponsors";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SponsorWall } from "@/components/sponsors/sponsor-wall";
import { CTASection } from "@/components/shared/cta-section";
import { SPONSORSHIP_LEVELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Sponsorship levels for businesses supporting the 70 for 70 campaign.",
  alternates: { canonical: "/sponsors" },
};

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="For Businesses"
            title="Become a Sponsor"
            description="Interested in supporting 70 for 70 as a corporate or in-kind sponsor? Submit a sponsorship request — all proposals are individually reviewed before acceptance."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SPONSORSHIP_LEVELS.map((level) => (
              <div
                key={level.id}
                className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6"
              >
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {level.name}
                </h3>
                <p className="mt-1 font-display text-2xl font-semibold text-bronze">
                  {formatCurrency(level.minimumContribution)}+
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-charcoal-light">
                  {level.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span aria-hidden className="text-bronze">
                        &bull;
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/sponsors/request"
              className="inline-flex rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
            >
              Request to Sponsor
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-xs text-charcoal-light">
            Submitting a request does not commit the campaign to accepting any gift, payment, or
            benefit. Every proposal is reviewed before acceptance — see below for how sponsorship
            differs from a direct charitable donation.
          </p>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Current Sponsors" title="Sponsor Wall" />
          <div className="mt-8">
            <SponsorWall sponsors={sponsors} />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Two Separate Things" title="Sponsorship vs. Charitable Donation" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-sm border border-ink/10 bg-off-white p-6">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                Charitable Donation
              </h3>
              <p className="mt-2 text-sm text-charcoal-light">
                Money sent directly to Mighty Oaks Foundation, Project Echelon, or another
                approved nonprofit through that organization&apos;s own authorized donation
                platform. See the{" "}
                <Link href="/donate" className="text-bronze hover:underline">
                  Donate
                </Link>{" "}
                page.
              </p>
            </div>
            <div className="rounded-sm border border-ink/10 bg-off-white p-6">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                Sponsorship
              </h3>
              <p className="mt-2 text-sm text-charcoal-light">
                A proposed business relationship or benefit supporting the athlete or campaign.
                Every sponsorship proposal requires review and written approval before it&apos;s
                accepted or recognized publicly.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Put Your Company Behind the Mission"
        description="Submit a sponsorship request to discuss cash, in-kind support, or a community partnership."
        buttons={[{ label: "Request to Sponsor", href: "/sponsors/request" }]}
      />
    </>
  );
}
