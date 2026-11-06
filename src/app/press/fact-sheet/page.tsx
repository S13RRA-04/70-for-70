import { Container } from "@/components/shared/container";
import { PrintButton } from "@/components/press/print-button";
import { formatPressDate } from "@/components/press/press-kit";
import { getMissionMetrics } from "@/lib/data/mission-metrics";
import { getFundraisingImpactStats } from "@/lib/data/fundraising-impact";
import { getPartners } from "@/lib/data/partners";
import { FOUNDER_BIO_SHORT } from "@/lib/content/press";
import {
  CONTACT_EMAIL,
  MOVEMENT_CAMPAIGNS,
  ORG_SUPPORTING_STATEMENT,
  ORG_TAGLINE,
  PERSONAL_PROJECT_DISCLOSURE,
  RACE_INFO,
  SITE_NAME,
  SITE_URL,
  isCurrentCampaign,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatCurrency, formatDateLong } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Fact Sheet",
  description: `One-page fact sheet for ${SITE_NAME}: mission, founder, verified figures, beneficiaries, current campaigns, and media contact.`,
  canonical: "/press/fact-sheet",
});

const PILLARS = [
  { name: "Connection", detail: "Connect people with vetted resources for veterans, first responders, and their families." },
  { name: "Mobilization", detail: "Mobilize communities through endurance, music, and awareness campaigns." },
  { name: "Impact", detail: "Direct support to confirmed nonprofit beneficiaries — donations go straight to them." },
] as const;

/**
 * Print-first page (Save as PDF from the browser). The `data-print-sheet`
 * marker tells globals.css to drop the site chrome when this page prints.
 * Every figure comes from the same getters as the rest of the site.
 */
export default async function FactSheetPage() {
  const [metrics, fundraising, beneficiaries] = await Promise.all([
    getMissionMetrics(),
    getFundraisingImpactStats(),
    getPartners(),
  ]);
  const currentCampaigns = MOVEMENT_CAMPAIGNS.filter(isCurrentCampaign);

  return (
    <section data-print-sheet className="py-12 print:py-0">
      <Container className="max-w-3xl">
        <div data-print-hide className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <a href="/press" className="text-sm font-semibold text-bronze hover:underline">
            &larr; Back to the newsroom
          </a>
          <PrintButton />
        </div>

        <article className="space-y-6 rounded-xl border border-line bg-white p-8 text-ink print:rounded-none print:border-0 print:p-0">
          <header className="border-b-2 border-navy pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">Fact sheet</p>
            <h1 className="mt-1 font-display text-4xl uppercase text-navy">{SITE_NAME}</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-charcoal-light">{ORG_TAGLINE}</p>
          </header>

          <FactBlock title="Mission">
            <p>{ORG_SUPPORTING_STATEMENT}</p>
          </FactBlock>

          <FactBlock title="Three pillars">
            <ul className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
              {PILLARS.map((pillar) => (
                <li key={pillar.name}>
                  <p className="font-semibold">{pillar.name}</p>
                  <p className="text-sm text-charcoal-light">{pillar.detail}</p>
                </li>
              ))}
            </ul>
          </FactBlock>

          <FactBlock title="Founder">
            <p>{FOUNDER_BIO_SHORT}</p>
          </FactBlock>

          <FactBlock title={`Figures — fundraising verified as of ${formatDateLong(fundraising.updatedAt)}`}>
            <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 print:grid-cols-2">
              <li>
                <strong>{formatCurrency(fundraising.amountRaised, { cents: true })}</strong> raised toward a{" "}
                {formatCurrency(fundraising.fundraisingGoal)} goal
              </li>
              {fundraising.beneficiaryTotals.map((row) => (
                <li key={row.organization}>
                  <strong>{formatCurrency(row.amount, { cents: true })}</strong> to {row.organization}
                </li>
              ))}
              {metrics.resources !== null && (
                <li>
                  <strong>{metrics.resources.toLocaleString()}</strong> vetted resource listings (listings, not
                  people served)
                </li>
              )}
              <li>
                <strong>{fundraising.partnerCount}</strong> campaign partners
              </li>
            </ul>
          </FactBlock>

          {beneficiaries.length > 0 && (
            <FactBlock title="Beneficiaries">
              <p>{beneficiaries.map((partner) => partner.name).join(" · ")}</p>
            </FactBlock>
          )}

          <FactBlock title="Current campaigns">
            <ul className="space-y-1 text-sm">
              {currentCampaigns.map((campaign) => (
                <li key={campaign.id}>
                  <strong>{campaign.name}</strong> — {campaign.type}
                  {campaign.id === "tri-for-the-22" && RACE_INFO.raceDate
                    ? `, IRONMAN 70.3 Chattanooga, ${formatPressDate(RACE_INFO.raceDate.slice(0, 10))}`
                    : ""}
                </li>
              ))}
            </ul>
          </FactBlock>

          <FactBlock title="Status">
            <p className="text-sm">
              {SITE_NAME} is not a registered nonprofit and does not receive charitable contributions.
              Donations go directly to the beneficiary organization each donor selects.{" "}
              {PERSONAL_PROJECT_DISCLOSURE}
            </p>
          </FactBlock>

          <footer className="border-t-2 border-navy pt-4 text-sm">
            <p>
              <strong>Media contact:</strong> Cody Hitson, founder · {CONTACT_EMAIL ?? `${SITE_URL}/contact`}
            </p>
            <p className="text-charcoal-light">
              Newsroom, photos, and logos: {SITE_URL.replace(/^https?:\/\//, "")}/press · Printed{" "}
              {formatDateLong(new Date())}
            </p>
          </footer>
        </article>
      </Container>
    </section>
  );
}

function FactBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">{title}</h2>
      <div className="mt-1.5 leading-relaxed">{children}</div>
    </section>
  );
}
