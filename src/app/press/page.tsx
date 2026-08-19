import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { CONTACT_EMAIL, SITE_TAGLINE } from "@/lib/constants";
import { ABOUT_CONTENT } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Press & Media",
  description: "Campaign summary, athlete bio, and media resources for For The 22.",
  alternates: { canonical: "/press" },
};

export default async function PressPage() {
  const partners = await getPartners();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Press & Media" title="Media Resources" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-14">
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Campaign Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Tri For The 22 pairs a 70.3-mile triathlon with a $70,000 fundraising goal — $1,000 per
              race mile — in support of veteran-focused nonprofit organizations.
              {" "}{SITE_TAGLINE}
            </p>
            <div className="mt-6">
              <CampaignByTheNumbers />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Athlete Bio
            </h2>
            <div className="mt-3 space-y-3">
              {ABOUT_CONTENT.homepageTeaser.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-charcoal-light">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-3 text-sm text-charcoal-light">
              Full biography, testimony, and campaign story on the{" "}
              <Link href="/about" className="text-bronze hover:underline">
                About page
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Logo Downloads
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              The compact icon/mark is available below in light- and dark-background versions,
              alongside the Tri For The 22 campaign mark (light background only). A horizontal lockup
              hasn&apos;t been produced yet.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-off-white p-6">
                <Image src="/logo.png" alt="For The 22 logo mark, dark numerals" width={140} height={140} />
                <a
                  href="/logo.png"
                  download
                  className="inline-flex rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                >
                  Download (Light Background)
                </a>
              </div>
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-ink p-6">
                <Image
                  src="/logo-white.png"
                  alt="For The 22 logo mark, white numerals"
                  width={140}
                  height={140}
                />
                <a
                  href="/logo-white.png"
                  download
                  className="inline-flex rounded-sm border border-off-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-off-white/10"
                >
                  Download (Dark Background)
                </a>
              </div>
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-off-white p-6">
                <Image
                  src="/campaign-logo.png"
                  alt="Tri For The 22 campaign logo mark"
                  width={140}
                  height={140}
                />
                <a
                  href="/campaign-logo.png"
                  download
                  className="inline-flex rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                >
                  Download (Campaign Mark)
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Approved Photos
            </h2>
            <div className="mt-3">
              <EmptyState
                title="Photography is coming soon."
                description="Approved campaign and training photos will be available here."
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Beneficiary Organizations
            </h2>
            <ul className="mt-3 space-y-2">
              {partners.map((partner) => (
                <li key={partner.id} className="text-base text-charcoal-light">
                  <span className="font-medium text-ink">{partner.name}</span>
                  {partner.website_url && (
                    <>
                      {" — "}
                      <a href={partner.website_url} className="text-bronze hover:underline">
                        {partner.website_url}
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Press Releases
            </h2>
            <div className="mt-3">
              <EmptyState title="No press releases published yet." />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Media Coverage
            </h2>
            <div className="mt-3">
              <EmptyState title="No media coverage yet." />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Media Contact
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              {CONTACT_EMAIL ? (
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze hover:underline">
                  {CONTACT_EMAIL}
                </a>
              ) : (
                <>
                  For media inquiries, use the{" "}
                  <Link href="/contact" className="text-bronze hover:underline">
                    contact form
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
