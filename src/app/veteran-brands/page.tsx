import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionSubnav } from "@/components/shared/section-subnav";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { BrandCard } from "@/components/veteran-brands/brand-card";
import { SERVICE_BRANDS, SERVICE_BRAND_TYPES } from "@/lib/content/veteran-brands";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Veteran & First Responder Brands",
  description:
    "Brands whose purchases support veterans and first responders — veteran-owned and first-responder-owned companies, and businesses that give back, curated by For The 22 and browsable by what they sell.",
  canonical: "/veteran-brands",
});

export default function VeteranBrandsPage() {
  const sections = SERVICE_BRAND_TYPES.map((type) => ({
    type,
    brands: SERVICE_BRANDS.filter((brand) => brand.typeId === type.id),
  })).filter((section) => section.brands.length > 0);

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Shop With Purpose"
            title="Brands That Support Veterans & First Responders"
            description={`Every brand listed here is veteran-owned, first-responder-owned, gives back a share of what you spend to those causes, or some combination of the three — separated by what they actually sell, from coffee to apparel to gear. ${SITE_NAME} doesn't receive anything from these purchases — this is just a curated way to point everyday spending toward people who served.`}
          />
        </Container>
      </section>

      <SectionSubnav
        items={sections.map((section) => ({
          id: section.type.id,
          label: section.type.label,
        }))}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="space-y-14 sm:space-y-16">
            {sections.map(({ type, brands }) => (
              <div key={type.id} id={type.id} className="scroll-mt-32">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-ink/15 pb-4">
                  <div>
                    <h2 className="text-balance text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
                      {type.label}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-charcoal-light/90">
                      {type.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-bronze-text">
                    {brands.length} {brands.length === 1 ? "Store" : "Stores"}
                  </span>
                </div>
                <RevealGrid>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {brands.map((brand) => (
                      <BrandCard key={brand.name} brand={brand} />
                    ))}
                  </div>
                </RevealGrid>
              </div>
            ))}
          </div>
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
