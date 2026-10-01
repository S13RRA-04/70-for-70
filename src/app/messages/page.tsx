import { getApprovedMessages } from "@/lib/data/messages";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageForm } from "@/components/forms/message-form";
import { CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, CAMPAIGN_HOME_CRUMB, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Messages of Support",
  description: `Leave a message of encouragement, a quote, or a word of support for ${CAMPAIGN_NAME}.`,
  canonical: `${CAMPAIGN_URL}/messages`,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([CAMPAIGN_HOME_CRUMB, { name: "Messages", url: `${CAMPAIGN_URL}/messages` }]);

export default async function MessagesPage() {
  const messages = await getApprovedMessages();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow="Cheer Me On"
          title="Messages of Support"
          description="Leave a note of encouragement, a quote, or a word of support — every message helps on the road to 70.3."
        />
      </CampaignPageHero>

      <section className="border-b border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Leave a Note" title="Add Your Message" />
          <div className="mt-8">
            <MessageForm />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="The Board" title="Messages From Supporters" />
          {messages.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="Leave a Word of Encouragement"
                description="Messages of support show up here as they come in."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {messages.map((entry) => (
                <div key={entry.id} className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
                  <p className="text-sm leading-relaxed text-charcoal-light">&ldquo;{entry.message}&rdquo;</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink">
                    {entry.anonymous ? "Anonymous" : entry.name}
                  </p>
                  <p className="mt-1 text-xs text-charcoal-light">{formatDateLong(entry.submitted_at)}</p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
