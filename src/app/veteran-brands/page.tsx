import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { BrandCard } from "@/components/veteran-brands/brand-card";
import { SERVICE_BRANDS } from "@/lib/content/veteran-brands";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Veteran & First Responder Brands",
  description:
    "Brands whose purchases support veterans and first responders — veteran-owned and first-responder-owned companies, and businesses that give back, curated by For The 22.",
  canonical: "/veteran-brands",
});

export default function VeteranBrandsPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Shop With Purpose"
            title="Brands That Support Veterans & First Responders"
            description={`Every brand listed here is veteran-owned, first-responder-owned, gives back a share of what you spend to those causes, or some combination of the three. ${SITE_NAME} doesn't receive anything from these purchases — this is just a curated way to point everyday spending toward people who served.`}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <RevealGrid>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_BRANDS.map((brand) => (
                <BrandCard key={brand.name} brand={brand} />
              ))}
            </div>
          </RevealGrid>
        </Container>
      </section>

      <CTASection
        eyebrow="Know a Good One?"
        title="Suggest a Brand"
        description="If you know a veteran-owned or first-responder-owned business, or a brand that gives back to those causes, send it our way — every submission is checked against the brand's own site before it's added."
        buttons={
          CONTACT_EMAIL
            ? [{ label: "Suggest a Brand", href: `mailto:${CONTACT_EMAIL}?subject=Veteran%2FFirst%20Responder%20Brand%20Suggestion` }]
            : [{ label: "Contact Us", href: "/contact" }]
        }
      />
    </>
  );
}
