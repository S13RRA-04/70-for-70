import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { RevealGrid } from "@/components/shared/reveal-on-scroll";
import { CampaignJournalEntryCard } from "@/components/campaign/campaign-journal-entry";
import { getCampaignJournalEntries, getCampaignJournalLastUpdated } from "@/lib/content/campaign-journal";
import { formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = pageMetadata({
  title: "Campaign Journal",
  description: "Mission-wide announcements from For The 22 — new campaigns, cross-campaign milestones, and other updates that span the whole mission.",
  canonical: "/campaigns/journal",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Campaigns", url: `${SITE_URL}/campaigns` },
  { name: "Journal", url: `${SITE_URL}/campaigns/journal` },
]);

/**
 * The full Campaign Journal archive — every entry, newest first. /campaigns
 * only teases the latest couple of entries and links here, so that page
 * stays a fixed size no matter how many entries this grows to.
 */
export default function CampaignJournalPage() {
  const entries = getCampaignJournalEntries();
  const lastUpdated = getCampaignJournalLastUpdated();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
            <Link href="/campaigns" className="hover:underline">
              Campaigns
            </Link>{" "}
            &middot; Journal
          </p>
          <SectionHeading
            as="h1"
            className="mt-2"
            title="Campaign Journal"
            description="Mission-wide announcements — new campaigns, cross-campaign milestones, and other updates that span the whole For The 22 mission, not any single campaign's own journal."
          />
          {lastUpdated && (
            <p className="mt-4 text-sm text-charcoal-light">
              Last updated <time dateTime={lastUpdated}>{formatDateLong(lastUpdated)}</time>
            </p>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          {entries.length === 0 ? (
            <EmptyState
              title="No Announcements Yet"
              description="Mission-wide updates will appear here as they happen."
              cta={{ label: "See the Campaigns", href: "/campaigns" }}
            />
          ) : (
            <RevealGrid>
              <div className="space-y-10">
                {entries.map((entry, i) => (
                  <CampaignJournalEntryCard
                    key={entry.id}
                    entry={entry}
                    className={i > 0 ? "border-t border-ink/10 pt-10" : undefined}
                  />
                ))}
              </div>
            </RevealGrid>
          )}
        </Container>
      </section>
    </>
  );
}
