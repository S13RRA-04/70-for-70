import type { Metadata } from "next";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";
import { CAMPAIGN_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Partners",
  description: "The veteran-focused nonprofit organizations supported by Tri For The 22.",
  alternates: { canonical: `${CAMPAIGN_URL}/partners` },
};

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Who It Supports"
            title="Beneficiary Organizations"
            description="Tri For The 22 raises funds in support of the following veteran-focused nonprofit organizations."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-charcoal-light">
            Donations are directed through each organization&apos;s authorized donation
            platform. For The 22 does not independently process charitable contributions
            unless explicitly stated.
          </p>
        </Container>
      </section>
    </>
  );
}
