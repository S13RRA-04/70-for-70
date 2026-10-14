import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";
import { CONTACT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "General contact for For The 22 — media and other questions.",
  canonical: "/contact",
});

export default async function ContactPage(props: PageProps<"/contact">) {
  const searchParams = await props.searchParams;
  const itemParam = Array.isArray(searchParams.item) ? searchParams.item[0] : searchParams.item;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        description={
          CONTACT_EMAIL
            ? `For media or general questions, use the form below or reach us directly at ${CONTACT_EMAIL}.`
            : "For media or general questions, use the form below."
        }
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="rounded-xl border border-line bg-white p-6 shadow-[0_1px_0_#dedad0,0_12px_32px_rgba(18,30,61,0.06)] sm:p-8">
            <SponsorInquiryForm prefillItem={itemParam} />
          </div>
        </Container>
      </section>
    </>
  );
}
