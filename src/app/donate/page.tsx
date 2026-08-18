import type { Metadata } from "next";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PartnerCard } from "@/components/partners/partner-card";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support 70 for 70 through an authorized partner donation platform.",
  alternates: { canonical: "/donate" },
};

export default async function DonatePage(props: PageProps<"/donate">) {
  const searchParams = await props.searchParams;
  const mileParam = Array.isArray(searchParams.mile) ? searchParams.mile[0] : searchParams.mile;
  const mileNumber = mileParam ? Number.parseInt(mileParam, 10) : null;

  const partners = await getPartners();

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Support the Mission"
            title="Donate"
            description="70 for 70 does not process donations directly. Choose a beneficiary organization below to give through its authorized donation platform."
          />

          {mileNumber && Number.isFinite(mileNumber) && (
            <p className="mt-6 inline-block rounded-sm border border-bronze/40 bg-bronze/10 px-4 py-2 text-sm font-medium text-ink">
              You&apos;re helping fund Mile {mileNumber}. Mention it in your donation note if the
              platform supports one, so it can be recorded against that mile.
            </p>
          )}
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
            Donations are directed through the respective nonprofit organization&apos;s
            authorized donation platform. 70 for 70 does not independently process
            charitable contributions unless explicitly stated.
          </p>
        </Container>
      </section>
    </>
  );
}
