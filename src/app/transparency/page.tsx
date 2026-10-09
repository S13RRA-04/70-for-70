import Link from "next/link";
import {
  Banknote,
  Building2,
  HandHeart,
  Landmark,
  Mail,
  ShieldCheck,
  Handshake,
  ListChecks,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { getPartners } from "@/lib/data/partners";
import { getCampaign } from "@/lib/data/campaign";
import { RESOURCES } from "@/lib/content/resources";
import { formatCurrency } from "@/lib/utils";
import {
  CAMPAIGN_URL,
  CONTACT_EMAIL,
  MERCH_BENEFICIARIES,
  PERSONAL_PROJECT_DISCLOSURE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { formatDateLong } from "@/lib/utils";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export const metadata = pageMetadata({
  title: "Transparency",
  description: `How donations work, how ${SITE_NAME} selects beneficiaries and resources, what a campaign partnership means, and the organization's current legal status.`,
  canonical: "/transparency",
});

/** BreadcrumbList per credibility plan §25 — Home→page shape. */
const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "Transparency", url: `${SITE_URL}/transparency` },
]);

/**
 * What a "campaign partnership" can mean — pulled from the real contribution
 * categories already tracked on mission_partners (see
 * src/app/sponsors/page.tsx's PARTNER_TYPE_CATEGORY_LABEL and
 * MISSION_PARTNER_TIERS in constants.ts). Listed here so a logo on a
 * partner wall doesn't read as one uniform relationship.
 */
const PARTNERSHIP_CONTRIBUTION_TYPES = [
  "Equipment and gear",
  "Services (training, coaching, printing, lodging)",
  "Event support and logistics",
  "Financial contribution",
  "Promotion and visibility",
] as const;

export default async function TransparencyPage() {
  const [beneficiaries, campaign] = await Promise.all([getPartners(), getCampaign()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />

      {/* Hero */}
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Transparency"
            title="How the Mission Handles Money, Partnerships, and Trust"
            description={`Where donations go, how ${SITE_NAME} selects the resources and beneficiaries it points people to, what a campaign partnership means, and the organization's actual legal status — plainly stated, not implied.`}
          />
        </Container>
      </section>

      {/* How Donations Work */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <HandHeart className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="01 — Giving" title="How Donations Work" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              {SITE_NAME} and its campaigns do not collect, process, or take possession of charitable
              donations. Every donation link on this site sends visitors directly to a beneficiary
              organization&apos;s own, independently operated donation platform, governed by that
              organization&apos;s own terms and privacy practices.
            </p>
            <p>
              {SITE_NAME} does not issue tax receipts. If a donation is tax-deductible, the receiving
              nonprofit — not {SITE_NAME} — is responsible for providing that documentation.
            </p>
          </div>
          {beneficiaries.length > 0 && (
            <ul className="mt-6 space-y-3">
              {beneficiaries.map((beneficiary) => (
                <li key={beneficiary.id} className="border-l-2 border-bronze/50 pl-4 text-sm text-charcoal-light">
                  <span className="font-semibold text-ink">{beneficiary.name}</span>
                  {beneficiary.nonprofit_status_verified
                    ? ` · Verified 501(c)(3)${beneficiary.ein ? ` · EIN ${beneficiary.ein}` : ""}`
                    : ""}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`${CAMPAIGN_URL}/beneficiaries`}
            className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Meet the Beneficiaries &rarr;
          </Link>
        </Container>
      </section>

      {/* Fundraising Reporting */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <Banknote className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="02 — Reporting" title="Fundraising Reporting" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              Fundraising totals shown across the site (amounts raised, the shared {formatCurrency(campaign.fundraising_goal)} goal,
              miles funded) reflect donations reported to or verified by the campaign. They may not
              update in real time with each beneficiary organization&apos;s own records — a gift made
              directly to a beneficiary is counted once it&apos;s reported back.
            </p>
            <p>Every page that shows a total reads the same underlying number — there is no separate, higher, or lower figure shown elsewhere on the site.</p>
          </div>
          {campaign.updated_at && (
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              Fundraising total last updated {formatDateLong(campaign.updated_at)}
            </p>
          )}
          <Link
            href={`${CAMPAIGN_URL}/the-mission`}
            className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            See the Current Total &rarr;
          </Link>
        </Container>
      </section>

      {/* Beneficiary Standards */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="03 — Beneficiaries" title="Beneficiary Standards" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              Beneficiary organizations are established directly by the campaign, not through an
              open public application. Each one is chosen because its work is directly relevant to
              {" "}{SITE_NAME}&apos;s mission — supporting the mental, physical, emotional, and
              spiritual health of veterans, first responders, and their families — and because its
              nonprofit status and operational credibility have been reviewed.
            </p>
            <p>
              Where a beneficiary&apos;s 501(c)(3) status has been verified, that&apos;s noted directly
              on its listing, along with its EIN. Being named as a beneficiary doesn&apos;t mean that
              organization operates, endorses, or is responsible for this site&apos;s content.
            </p>
          </div>
        </Container>
      </section>

      {/* Resource Standards */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="04 — Resources" title="Resource Standards" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-charcoal-light">
            The resource directory lists {RESOURCES.length} resources — vetted programs and services, each checked for
            legitimacy, the population it serves, service type, geographic availability, and mission
            fit before it&apos;s added — and re-checked when details change. &quot;Reviewed&quot; does
            not mean guaranteed, certified, or endorsed.
          </p>
          <Link
            href="/standards"
            className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Read the Full Review Standards &rarr;
          </Link>
        </Container>
      </section>

      {/* Campaign Partnerships */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <Handshake className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="05 — Partnerships" title="Campaign Partnerships" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              A campaign partnership is a confirmed support relationship between a business,
              organization, or club and one of {SITE_NAME}&apos;s campaigns. Not every logo on a
              partner wall represents the same thing — a partnership can mean:
            </p>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PARTNERSHIP_CONTRIBUTION_TYPES.map((type) => (
              <li key={type} className="flex items-center gap-2 text-sm text-charcoal-light">
                <span className="h-1.5 w-1.5 rounded-full bg-bronze" aria-hidden="true" />
                {type}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-charcoal-light">
            Inclusion on a partner page reflects that confirmed relationship — it does not mean a
            partner operates, endorses, or is responsible for the campaign&apos;s content, and it
            does not imply endorsement by any employer or government agency.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`${CAMPAIGN_URL}/sponsors`}
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              See Current Partners &rarr;
            </Link>
            <Link
              href={`${CAMPAIGN_URL}/become-a-partner`}
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              Become a Partner &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* Merchandise */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <ShoppingBag className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="06 — Merchandise" title="Merchandise" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              Campaign merchandise is sold through Bonfire, an independent third-party store —
              {" "}{SITE_NAME} never takes possession of merchandise proceeds. 100% of net profit is
              paid by Bonfire directly to {MERCH_BENEFICIARIES[0]} or {MERCH_BENEFICIARIES[1]},
              with the specific beneficiary noted on each item.
            </p>
            <p>
              A separate, non-fundraising store on {SITE_NAME}&apos;s own site is not a fundraiser
              for either beneficiary — 100% of its net proceeds go toward the mission&apos;s own
              operating costs instead (equipment, training, campaign expenses), which is disclosed
              here rather than folded into the fundraising total above.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href={`${CAMPAIGN_URL}/shop`}
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              Shop (Beneficiary Fundraiser) &rarr;
            </Link>
            <Link
              href="/store"
              className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
            >
              For The 22 Store (Mission Costs) &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* Expenses */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <Landmark className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="07 — Expenses" title="Expenses" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              {SITE_NAME} does not currently publish a line-item expense ledger. The organization
              carries minimal overhead — there is no paid staff and no office — and campaign support
              (gear, services, printing, event logistics) is largely provided in-kind by partners
              rather than purchased.
            </p>
            <p>
              Where a campaign&apos;s own costs exceed what&apos;s been donated or contributed
              in-kind, the gap is currently covered out of pocket by the campaign&apos;s founder. That
              spending is disclosed directly, not folded into the fundraising total.
            </p>
          </div>
          <Link
            href={`${CAMPAIGN_URL}/financial-transparency`}
            className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            See Out-of-Pocket Spending &rarr;
          </Link>
        </Container>
      </section>

      {/* Organizational Status */}
      <section className="border-y border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="08 — Status" title="Organizational Status" />
          </div>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              {SITE_NAME} is not a registered nonprofit organization and does not process or receive
              charitable contributions through this site. Donations made through links on this site
              go directly to the beneficiary organization selected by the donor, not to {SITE_NAME}.
            </p>
            <p>
              Tri For The 22, Ruck For The 22, 22 For the 22, and For The 22: Live operate as campaigns
              under the {SITE_NAME} name — programs of one initiative, not separate legal entities or
              competing organizations.
            </p>
          </div>
        </Container>
      </section>

      {/* Independence Disclosure */}
      <section className="border-y border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-bronze-light" aria-hidden="true" />
            <SectionHeading tone="dark" eyebrow="09 — Independence" title="Independence Disclosure" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-off-white/80">{PERSONAL_PROJECT_DISCLOSURE}</p>
        </Container>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-6 w-6 shrink-0 text-bronze" aria-hidden="true" />
            <SectionHeading eyebrow="10 — Contact" title="Questions About Any of This?" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-charcoal-light">
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-bronze hover:underline">
                {CONTACT_EMAIL}
              </a>
            ) : (
              <>
                Reach out through the{" "}
                <Link href="/contact" className="font-semibold text-bronze hover:underline">
                  contact form
                </Link>
                .
              </>
            )}
          </p>
        </Container>
      </section>

      <CTASection
        title="See the Numbers for Yourself"
        buttons={[
          { label: "Explore the Network", href: "/network" },
          { label: "See the Mission Impact", href: "/impact", variant: "secondary" },
        ]}
      />
    </>
  );
}
