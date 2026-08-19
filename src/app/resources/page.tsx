import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { CTASection } from "@/components/shared/cta-section";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources",
  description: "Resources for veteran and first responder athletes, curated by For The 22.",
  alternates: { canonical: "/resources" },
};

const CATEGORIES = [
  {
    id: "veteran-athletes",
    title: "Veteran Athletes",
    description: "Programs and events built for veterans getting into endurance sport.",
  },
  {
    id: "first-responders",
    title: "First Responders",
    description: "Programs and events built for active and retired first responders.",
  },
  {
    id: "adaptive-sports",
    title: "Adaptive Sports",
    description: "Organizations and equipment resources for adaptive athletes.",
  },
  {
    id: "recovery-wellness",
    title: "Recovery & Wellness",
    description: "Mental health, physical recovery, and wellness support.",
  },
  {
    id: "equipment-grants",
    title: "Equipment & Grants",
    description: "Grants and equipment programs that help offset the cost of getting started.",
  },
  {
    id: "community",
    title: "Community",
    description: "Local and online communities of veteran and first-responder athletes.",
  },
] as const;

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Resources"
            title="Resources for Veteran & First Responder Athletes"
            description={`${SITE_NAME} is building a curated directory of programs, equipment resources, and communities — organized by category below. This gives the movement value even if you never donate a dollar.`}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <div key={category.id} id={category.id}>
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {category.title}
                </h2>
                <p className="mt-1 text-sm text-charcoal-light">{category.description}</p>
                <div className="mt-3">
                  <EmptyState title="Resources are being curated for this category." />
                </div>
              </div>
            ))}
          </div>
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
