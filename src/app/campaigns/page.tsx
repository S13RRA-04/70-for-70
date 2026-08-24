import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { MOVEMENT_CAMPAIGNS, SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Campaigns",
  description: `The endurance fundraising campaigns ${SITE_NAME} is currently engaged in, in support of veteran-focused nonprofit organizations.`,
  canonical: "/campaigns",
});

export default function CampaignsPage() {
  const current = MOVEMENT_CAMPAIGNS.filter((c) => c.status === "current");
  const future = MOVEMENT_CAMPAIGNS.filter((c) => c.status === "future");

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Campaigns"
            title="Turning Endurance Into Direct Support"
            description={`Alongside the resource directory, ${SITE_NAME} runs personal endurance fundraising campaigns — each one pairs a physical challenge with direct fundraising support for confirmed veteran-focused nonprofit organizations.`}
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-8">
            {current.map((campaign) => (
              <div key={campaign.name} className="border border-ink/10 bg-off-white p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                  Current Campaign &middot; {campaign.discipline}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
                  {campaign.name}
                </h2>
                {"description" in campaign && (
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-light">
                    {campaign.description}
                  </p>
                )}
                {"url" in campaign && (
                  <CTAButton href={campaign.url} external className="mt-6">
                    Visit {campaign.name}
                  </CTAButton>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {future.length > 0 && (
        <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="Naming Convention"
              title="Possible Future Campaigns"
              description={`If ${current[0]?.name ?? "the current campaign"} goes well, future personal challenges may follow the same "[Mission] For The 22" naming idea — not a managed program or a commitment with dates, just a naming convention.`}
            />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {future.map((campaign) => (
                <div key={campaign.name} className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light/80">
                    Future
                  </p>
                  <p className="mt-1 font-display text-base font-semibold uppercase tracking-wide text-ink">
                    {campaign.name}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal-light">{campaign.discipline}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
