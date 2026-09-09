import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentEventConfig } from "@/lib/data/event-config";
import {
  EVENT_RULES_PLACEHOLDER_SECTIONS,
  GIVEAWAY_ODDS_DISCLOSURE,
  NO_PURCHASE_NECESSARY_DISCLOSURE,
  SAFETY_LANGUAGE,
} from "@/lib/content/22-for-the-22";
import { Container } from "@/components/shared/container";
import { JournalMarkdown } from "@/components/journal/journal-markdown";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Official Rules | 22 For the 22",
  description: "Official Rules for the 22 For the 22 free giveaway/sweepstakes.",
  canonical: `${CAMPAIGN_URL}/22forthe22/rules`,
});

/**
 * Renders event_config.official_rules_body (markdown) once real,
 * counsel-approved copy is set — otherwise the hardcoded placeholder
 * scaffold from src/lib/content/22-for-the-22.ts, with every field the
 * client brief listed. Both verbatim disclosures and the safety language
 * always render regardless of which mode is active.
 */
export default async function EventRulesPage() {
  const event = await getCurrentEventConfig();

  return (
    <div data-analytics-event="22_rules_view" className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <Link href="/22forthe22" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
          &larr; Back to 22 For the 22
        </Link>

        <h1 className="mt-4 font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
          Official Rules
        </h1>
        <p className="mt-2 text-sm text-charcoal-light">22 For the 22 Free Giveaway/Sweepstakes</p>

        <p className="mt-6 rounded-sm border border-ink/10 bg-sand-light p-4 text-sm font-semibold uppercase tracking-wide text-ink">
          {NO_PURCHASE_NECESSARY_DISCLOSURE}
        </p>

        {event?.official_rules_body ? (
          <JournalMarkdown body={event.official_rules_body} className="mt-8" />
        ) : (
          <div className="mt-8 space-y-8">
            {EVENT_RULES_PLACEHOLDER_SECTIONS.map((section) => (
              <section key={section.id}>
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {section.heading}
                </h2>
                <div className="mt-2 space-y-2">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-charcoal-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs leading-relaxed text-charcoal-light/80">
          {GIVEAWAY_ODDS_DISCLOSURE} {SAFETY_LANGUAGE}
        </p>
      </Container>
    </div>
  );
}
