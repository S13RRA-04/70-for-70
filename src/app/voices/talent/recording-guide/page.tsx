import Link from "next/link";
import { Download } from "lucide-react";
import { Container } from "@/components/shared/container";
import {
  PortalSectionHeading,
  RuleList,
  TalentContactBand,
  TalentPageHero,
  TalentPortalNav,
} from "@/components/voices/talent-portal";
import {
  DURATION_NOTE,
  KIT_FILES,
  PORTAL_PATHS,
  SAMPLE_MESSAGE,
  SAMPLE_MESSAGE_NOTE,
  TALKING_POINTS,
  TALKING_POINTS_NOTE,
  TECHNICAL_GUIDELINES,
} from "@/lib/content/voices-talent";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Voices For The 22 — Recording Guide",
  description:
    "How to record a 20–30 second Voices For The 22 message on a smartphone: technical tips, optional talking points and an optional sample message.",
  canonical: PORTAL_PATHS.recordingGuide,
});

const BREADCRUMB = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Voices For The 22", url: `${SITE_URL}/voices` },
  { name: "Talent participation", url: `${SITE_URL}${PORTAL_PATHS.talent}` },
  { name: "Recording guide", url: `${SITE_URL}${PORTAL_PATHS.recordingGuide}` },
]);

export default function RecordingGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB)} />
      <TalentPortalNav current={PORTAL_PATHS.recordingGuide} />
      <TalentPageHero eyebrow="Voices For The 22 · Recording guide" title="Your phone is enough.">
        <p>No crew, no studio, no script. A quiet room, good light and a few honest sentences.</p>
        <a
          href={KIT_FILES.guide.href}
          download
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm bg-white px-5 text-base font-bold text-navy hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Download size={18} aria-hidden="true" />
          Download the one-page guide (PDF)
        </a>
      </TalentPageHero>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="technical-heading">
        <Container className="grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <PortalSectionHeading id="technical-heading" eyebrow="Technical guidelines" title="Set up in two minutes." />
          <div>
            <RuleList items={TECHNICAL_GUIDELINES} />
            <p className="mt-8 rounded-xl border border-line bg-paper p-5 text-base leading-relaxed text-copy">{DURATION_NOTE}</p>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper py-16 sm:py-20" aria-labelledby="talking-heading">
        <Container className="grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <PortalSectionHeading id="talking-heading" eyebrow="Suggested talking points" title="Say what's true for you." />
          <div>
            <RuleList items={TALKING_POINTS} />
            <p className="mt-8 text-base leading-relaxed text-copy">{TALKING_POINTS_NOTE}</p>
          </div>
        </Container>
      </section>

      <section className="bg-navy py-16 text-white sm:py-20" aria-labelledby="sample-heading">
        <Container className="max-w-4xl">
          <p className="label-caps text-gold">Optional sample message</p>
          <h2 id="sample-heading" className="sr-only">Optional sample message</h2>
          <blockquote className="mt-6 border-l-2 border-gold pl-6 text-xl leading-relaxed text-white sm:text-2xl">
            “{SAMPLE_MESSAGE}”
          </blockquote>
          <p className="mt-6 text-base font-semibold text-white/75">{SAMPLE_MESSAGE_NOTE}</p>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-3xl uppercase text-navy">Recorded? Send it over.</p>
          <Link
            href={PORTAL_PATHS.submit}
            className="inline-flex min-h-[50px] items-center rounded-sm bg-navy px-6 font-bold text-white hover:bg-navy-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Submit your message
          </Link>
        </Container>
      </section>

      <TalentContactBand />
    </>
  );
}
