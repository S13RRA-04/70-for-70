import Image from "next/image";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { APPROVED_PHOTOS, MEDIA_COVERAGE, PRESS_RELEASES } from "@/lib/content/campaign-press";
import { CAMPAIGN_NAME, CONTACT_EMAIL, SITE_URL, SITE_TAGLINE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: `Campaign summary, athlete bio, and media resources for ${CAMPAIGN_NAME}.`,
  canonical: "/press",
});

export default async function CampaignPressPage() {
  const partners = await getPartners();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow={`${CAMPAIGN_NAME} · Press & Media`} title="Media Resources" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-14">
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Campaign Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              {CAMPAIGN_NAME} is Cody Hitson&apos;s current endurance campaign: training for and
              completing a 70.3-mile triathlon while encouraging the public to donate directly
              to the campaign&apos;s confirmed beneficiary organizations. {SITE_TAGLINE}
            </p>
            <div className="mt-6">
              <CampaignByTheNumbers />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Athlete Bio
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Athletic story, training history, and race details live on the{" "}
              <a href="/the-story" className="text-bronze hover:underline">
                The Story
              </a>{" "}
              page — that&apos;s the authoritative source; it isn&apos;t reproduced here. Service
              history and founder biography live on For The 22&apos;s{" "}
              <a href={`${SITE_URL}/about`} className="text-bronze hover:underline">
                About
              </a>{" "}
              page.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Logo Downloads
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              The {CAMPAIGN_NAME} campaign mark, light background only. A horizontal lockup
              hasn&apos;t been produced yet.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-off-white p-6">
                <Image
                  src="/campaign-logo.png"
                  alt={`${CAMPAIGN_NAME} campaign logo mark`}
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

          {APPROVED_PHOTOS.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Approved Photos
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {APPROVED_PHOTOS.map((photo) => (
                  <figure key={photo.src} className="overflow-hidden rounded-sm">
                    <div className="relative aspect-[4/5] w-full bg-sand-light">
                      <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
                    </div>
                    {photo.caption && (
                      <figcaption className="mt-1.5 text-xs text-charcoal-light">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

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

          {PRESS_RELEASES.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Press Releases
              </h2>
              <ul className="mt-3 space-y-2">
                {PRESS_RELEASES.map((release) => (
                  <li key={release.url} className="text-base text-charcoal-light">
                    <a href={release.url} className="text-bronze hover:underline">
                      {release.title}
                    </a>
                    {" — "}
                    {formatDateLong(release.date)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {MEDIA_COVERAGE.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
                Media Coverage
              </h2>
              <ul className="mt-3 space-y-2">
                {MEDIA_COVERAGE.map((item) => (
                  <li key={item.url} className="text-base text-charcoal-light">
                    <span className="font-medium text-ink">{item.outlet}</span>
                    {" — "}
                    <a href={item.url} className="text-bronze hover:underline">
                      {item.title}
                    </a>
                    {" — "}
                    {formatDateLong(item.date)}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                  For media inquiries, use For The 22&apos;s{" "}
                  <a href={`${SITE_URL}/contact`} className="text-bronze hover:underline">
                    contact form
                  </a>
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
