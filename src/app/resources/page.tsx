import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { MobileActionBar } from "@/components/shared/mobile-action-bar";
import { ResourceDirectory } from "@/components/resources/resource-directory";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources",
  description: "A resource finder for veterans and first responders, curated by For The 22.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Mission One: Connect"
            title="Resources for Those Who Serve"
            description={`The primary mission of ${SITE_NAME} is simple: help veterans and first responders find the support, opportunities, and communities they need. Athletics is our strongest emphasis, alongside mental health, recovery, equipment, family support, career, and more. Search or filter by what you need and who you are below.`}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Suspense fallback={null}>
            <ResourceDirectory />
          </Suspense>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Good One?"
        title="Submit a Resource"
        description="If you know a program, grant, or community that belongs here, send it our way — every submission is reviewed before it's added."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Submit a Resource", href: `mailto:${CONTACT_EMAIL}?subject=Resource%20Submission` }]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />

      <div className="h-16 sm:hidden" aria-hidden="true" />
      <MobileActionBar
        secondary={{ label: "Search", href: "#resource-search" }}
        primary={{ label: "Join", href: "/join" }}
      />
    </>
  );
}
