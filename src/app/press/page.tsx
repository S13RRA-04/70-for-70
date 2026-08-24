import Link from "next/link";
import Image from "next/image";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CampaignByTheNumbers } from "@/components/campaign/campaign-by-the-numbers";
import { APPROVED_PHOTOS, MEDIA_COVERAGE, PRESS_RELEASES } from "@/lib/content/press";
import { CONTACT_EMAIL, SITE_TAGLINE } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: "Campaign summary, athlete bio, and media resources for For The 22.",
  canonical: "/press",
});

export default async function PressPage() {
  const partners = await getPartners();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading as="h1" eyebrow="Press & Media" title="Media Resources" />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-14">
          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Project Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              For The 22 is a personal, off-duty project created by Cody Hitson to connect
              veterans and first responders with established resources and use endurance
              challenges to encourage direct support for independent nonprofit organizations.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Campaign Summary
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Tri For The 22 is Cody&apos;s current endurance campaign: training for and
              completing a 70.3-mile triathlon while encouraging the public to donate directly
              to the campaign&apos;s confirmed beneficiary organizations.
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
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              Founder biography, service history, and the story behind the campaign live on the{" "}
              <Link href="/about#founders-story" className="text-bronze hover:underline">
                Founder&apos;s Story
              </Link>{" "}
              page — that&apos;s the authoritative source; it isn&apos;t reproduced here.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Logo Downloads
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              The compact icon/mark is available below, shown on both light and dark backgrounds,
              alongside the Tri For The 22 campaign mark (light background only). A horizontal lockup
              hasn&apos;t been produced yet.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="inline-flex flex-col items-start gap-3 rounded-sm border border-ink/10 bg-off-white p-6">
                <Image src="/logo.png" alt="For The 22 logo mark" width={140} height={140} />
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
                  alt="For The 22 logo mark"
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
