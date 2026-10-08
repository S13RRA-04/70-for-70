import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
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
      <section className="border-b border-ink/10 bg-sand-light py-12 sm:py-16">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Our Core Mission"
            title="Resources for Those Who Serve"
            description={`The primary mission of ${SITE_NAME} is simple: help veterans and first responders find the support, opportunities, and communities they need — across mental, physical, emotional, spiritual, family, career, financial, legal, and community support. Search or filter by what you need and who you are below.`}
          />
        </Container>
      </section>

      <section className="bg-[linear-gradient(90deg,rgba(176,137,86,0.07)_1px,transparent_1px)] bg-[size:88px_100%] py-10 sm:py-14">
        <Container>
          <div className="rounded-sm border border-ink/10 bg-off-white p-4 shadow-[0_18px_60px_rgba(18,23,28,0.08)] sm:p-7">
            <ResourceNavigator resources={resources} />
          </div>
          <div id="browse-resources" className="mt-8 scroll-mt-24 border-t-4 border-bronze bg-off-white p-4 shadow-[0_18px_60px_rgba(18,23,28,0.08)] sm:p-7">
            <Suspense fallback={null}>
              <ResourceDirectory resources={resources} />
            </Suspense>
          </div>
          <p className="mt-10 text-center text-sm text-charcoal-light">
            Every listing is reviewed before it goes live.{" "}
            <a href="/standards" className="font-semibold text-bronze hover:text-bronze-dark">
              How Resources Are Reviewed &rarr;
            </a>
          </p>
          <div className="mt-8"><AskForThe22Form /></div>
          <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6 sm:p-8">
            <SectionHeading eyebrow="Improve the Directory" title="Share Resource Feedback" description="Tell us privately whether a listing was useful or whether you were able to connect. Individual responses are never displayed publicly." />
            <div className="mt-6"><ResourceFeedbackForm /></div>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Good One?"
        title="Submit a Resource"
        description="If you know a program, grant, or community that belongs here, send it our way — every submission is reviewed before it's added. The directory is focused on nonprofit, government, and official veteran/first-responder programs, not commercial services or individually licensed professionals."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Submit a Resource", href: `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission` }]
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
