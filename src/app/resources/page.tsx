import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
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
            eyebrow="Resources"
            title="Find What You Need"
            description={`${SITE_NAME} is building a resource finder for veterans and first responders — mental health, sports, equipment, family support, career, and more. Sport is one entry point, not the only one. Filter by what you need and who you are below.`}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <ResourceDirectory />
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
    </>
  );
}
