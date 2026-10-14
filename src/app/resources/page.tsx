import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CTASection } from "@/components/shared/cta-section";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { ResourceDirectory } from "@/components/resources/resource-directory";
import { ResourceNavigator } from "@/components/resources/resource-navigator";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { getResources } from "@/lib/data/resources";
import { AskForThe22Form, ResourceFeedbackForm } from "@/components/resources/resource-support-forms";

export const metadata = pageMetadata({
  title: "Resources",
  description: "A resource finder for veterans and first responders, curated by For The 22.",
  canonical: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <>
      <PageHero
        wide
        pillar="connection"
        eyebrow="01 · Connection"
        title="The right help, matched to you"
        description={`${SITE_NAME} helps veterans, first responders, and their families find support across mental, physical, emotional, spiritual, family, career, financial, legal, and community needs. Answer a few questions, or search and filter the full directory.`}
      />

      <section className="py-12 sm:py-16">
        <Container className="max-w-[min(96vw,2400px)]">
          <div className="rounded-xl border border-line bg-white p-4 shadow-[0_1px_0_#dedad0,0_12px_32px_rgba(18,30,61,0.06)] sm:p-7">
            <ResourceNavigator resources={resources} />
          </div>
          <div id="browse-resources" className="mt-8 scroll-mt-28 rounded-xl border border-line bg-white p-4 shadow-[0_1px_0_#dedad0,0_12px_32px_rgba(18,30,61,0.06)] sm:p-7">
            <Suspense fallback={null}>
              <ResourceDirectory resources={resources} />
            </Suspense>
          </div>
          <p className="mt-10 text-center text-base text-copy">
            Every listing is reviewed before it goes live.{" "}
            <a href="/standards" className="font-bold text-help underline underline-offset-2 hover:text-help-dark">
              How resources are reviewed &rarr;
            </a>
          </p>
          <div className="mt-8"><AskForThe22Form /></div>
          <details className="mt-8 rounded-xl border border-line bg-white p-6 sm:p-8">
            <summary className="cursor-pointer font-display text-2xl uppercase text-navy">Share private resource feedback</summary>
            <p className="mt-2 max-w-2xl text-base text-copy">Tell us whether a listing was useful or whether you connected. Individual responses are never displayed publicly.</p>
            <div className="mt-6"><ResourceFeedbackForm /></div>
          </details>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a good one?"
        title="Submit a resource"
        description="If you know a program, grant, or community that belongs here, send it our way — every submission is reviewed before it's added. The directory is focused on nonprofit, government, and official veteran/first-responder programs, not commercial services or individually licensed professionals."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Submit a resource", href: `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission` }]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Search", href: "#resource-search" }}
        primary={{ label: "Submit a Resource", href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission` : "/contact" }}
      />
    </>
  );
}
