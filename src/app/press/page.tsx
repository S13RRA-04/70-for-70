import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CAMPAIGN_URL, CONTACT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Press & Media",
  description: "Core mission summary, logos, and media contact for For The 22.",
  canonical: "/press",
});

export default function PressPage() {
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
              For The 22 is an independent, off-duty resource initiative that helps veterans and
              first responders find established programs, services, and communities supporting
              mental, physical, emotional, and spiritual health.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Logo Downloads
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              The compact icon/mark is available below, shown on both light and dark backgrounds.
              A horizontal lockup hasn&apos;t been produced yet.
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

          <div>
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Campaign Media Kit
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light">
              For campaign statistics, athlete bio, beneficiary information, and the campaign
              logo, see the{" "}
              <a href={`${CAMPAIGN_URL}/press`} className="text-bronze hover:underline">
                Tri For The 22 media kit
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
