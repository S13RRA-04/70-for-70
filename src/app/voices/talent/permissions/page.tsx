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
  DISTRIBUTION,
  EDIT_LIMIT,
  EXPANDED_USE,
  KIT_FILES,
  PARTICIPANT_CONTROLS,
  PERMITTED_EDITS,
  PORTAL_PATHS,
  PRIVACY_POINTS,
  PROHIBITED_USES,
  RELEASE_DRAFT_NOTICE,
  RELEASE_VERSION,
  WITHDRAWAL,
} from "@/lib/content/voices-talent";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Voices For The 22 — Participation & Usage Permissions",
  description:
    "Where Voices For The 22 messages appear, how they may be edited, what they will never be used for, and how to withdraw.",
  canonical: PORTAL_PATHS.permissions,
});

const BREADCRUMB = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Voices For The 22", url: `${SITE_URL}/voices` },
  { name: "Talent participation", url: `${SITE_URL}${PORTAL_PATHS.talent}` },
  { name: "Permissions", url: `${SITE_URL}${PORTAL_PATHS.permissions}` },
]);

function Block({ id, eyebrow, title, children, shaded }: { id: string; eyebrow: string; title: string; children: React.ReactNode; shaded?: boolean }) {
  return (
    <section className={shaded ? "border-y border-line bg-paper py-14 sm:py-20" : "bg-white py-14 sm:py-20"} aria-labelledby={id}>
      <Container className="grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
        <PortalSectionHeading id={id} eyebrow={eyebrow} title={title} />
        <div>{children}</div>
      </Container>
    </section>
  );
}

export default function PermissionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB)} />
      <TalentPortalNav current={PORTAL_PATHS.permissions} />
      <TalentPageHero eyebrow="Voices For The 22 · Permissions" title="Limited use. Your terms.">
        <p>
          A message of hope should never become an ad. Here is exactly where contributions appear, how they may be edited,
          and what they will never be used for.
        </p>
      </TalentPageHero>

      <Block id="distribution-heading" eyebrow="Intended distribution" title="Where your message appears.">
        <RuleList items={DISTRIBUTION} />
      </Block>

      <Block id="edits-heading" eyebrow="Permitted editing" title="Light touch only." shaded>
        <p className="text-lg text-copy">Videos may be edited for:</p>
        <div className="mt-4">
          <RuleList items={PERMITTED_EDITS} />
        </div>
        <p className="mt-6 font-semibold text-navy">{EDIT_LIMIT}</p>
      </Block>

      <section className="bg-navy py-14 text-white sm:py-20" aria-labelledby="never-heading">
        <Container className="grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <PortalSectionHeading id="never-heading" eyebrow="Never used in" title="Hard limits." tone="dark" />
          <div>
            <RuleList items={PROHIBITED_USES} tone="dark" />
            <p className="mt-6 font-semibold text-gold">{EXPANDED_USE}</p>
          </div>
        </Container>
      </section>

      <Block id="controls-heading" eyebrow="You stay in control" title="Your restrictions travel with your message.">
        <RuleList items={PARTICIPANT_CONTROLS} />
      </Block>

      <Block id="withdrawal-heading" eyebrow="Withdrawal & deletion" title="Change your mind at any time." shaded>
        <ol className="flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed text-copy sm:text-lg">
          {WITHDRAWAL.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Block>

      <Block id="privacy-heading" eyebrow="Privacy" title="Private by default.">
        <RuleList items={PRIVACY_POINTS} />
      </Block>

      <section className="border-t border-line bg-paper py-14" aria-labelledby="release-heading">
        <Container className="max-w-5xl">
          <h2 id="release-heading" className="font-display text-3xl uppercase text-navy">The participation release</h2>
          <p className="mt-3 max-w-2xl text-base text-copy">
            Version {RELEASE_VERSION}. {RELEASE_DRAFT_NOTICE}
          </p>
          <a
            href={KIT_FILES.release.href}
            download
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-navy px-5 font-bold text-navy hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Download size={18} aria-hidden="true" />
            Download the draft release (PDF)
          </a>
        </Container>
      </section>

      <TalentContactBand />
    </>
  );
}
