import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { PillarNextSteps } from "@/components/shared/pillar-next-steps";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { ResourceDirectory } from "@/components/resources/resource-directory";
import { AskForThe22Form, ResourceFeedbackForm } from "@/components/resources/resource-support-forms";
import { CONTACT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { getPublishedDirectory } from "@/lib/data/resource-directory";

export const metadata = pageMetadata({
  title: "Find Support",
  description: "Free and low-cost programs for veterans, first responders and their families, reviewed by For The 22.",
  canonical: "/resources",
});

const SUBMIT_HREF = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission` : "/contact";

export default async function ResourcesPage() {
  const { items } = await getPublishedDirectory();
  return (
    <>
      <PageHero
        pillar="connection"
        title="Find the right help"
        description="Free and low-cost programs for veterans, first responders and their families. No account needed, and nothing you type here is saved."
      />

      <section className="pb-4 pt-2">
        <Container>
          <Suspense fallback={null}>
            <ResourceDirectory resources={items} />
          </Suspense>
        </Container>
      </section>

      <section className="bg-navy text-white">
        <Container className="grid gap-6 py-10 md:grid-cols-2">
          <div id="ask" className="scroll-mt-24">
            <AskForThe22Form />
          </div>
          <div className="flex flex-col items-start gap-3 rounded-xl border border-white/20 p-6">
            <h2 className="font-display text-[26px] uppercase">Know a good one?</h2>
            <p className="text-[15px] text-mist">
              Suggest a nonprofit, government or official veteran or first-responder program. Every submission is reviewed before it&apos;s added.
            </p>
            <a href={SUBMIT_HREF} className="inline-flex min-h-11 items-center justify-center rounded-[4px] border-[1.5px] border-white px-[18px] text-sm font-bold tracking-[1px] text-white hover:bg-white/10">
              SUBMIT A RESOURCE
            </a>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <details id="report" className="scroll-mt-24 rounded-xl border border-line bg-white p-6 sm:p-8">
            <summary className="cursor-pointer font-display text-2xl uppercase text-navy">Report outdated info or share feedback</summary>
            <p className="mt-2 max-w-2xl text-base text-copy">
              Tell us if a listing has changed, whether it was useful, or whether you connected. Individual responses are never displayed publicly.
            </p>
            <div className="mt-6"><ResourceFeedbackForm /></div>
          </details>
        </Container>
      </section>

      <PillarNextSteps current="connection" />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Search", href: "#resource-search" }}
        primary={{ label: "Get Help Now", href: "/crisis" }}
      />
    </>
  );
}
