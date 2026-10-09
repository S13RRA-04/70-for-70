import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { PartnerRoleBadge } from "@/components/partners/partner-role-badge";
import { TeamBenefitBadge } from "@/components/partners/team-benefit-badge";
import { ExternalDonateButton } from "@/components/shared/external-donate-button";
import { DonationTrackingNote } from "@/components/shared/donation-tracking-note";
import { CTAButton } from "@/components/shared/cta-button";
import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import { getPartnerProfileBySlug } from "@/lib/data/partner-profile";
import { DISTRIBUTION_STATUS_LABEL } from "@/components/partners/partner-card";
import { BIKE_BUILD_COMPONENT_STATUS } from "@/lib/content/building-the-bike";
import { findBackedComponents } from "@/lib/partner-matching";
import { CAMPAIGN_URL, MISSION_PARTNER_TIERS, SITE_URL, formatAssociatedCampaigns } from "@/lib/constants";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

const BREADCRUMB_BASE = [
  { name: "Home", url: SITE_URL },
  { name: "Network", url: `${SITE_URL}/network` },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPartnerProfileBySlug(slug);
  if (!profile) return {};

  const { partner } = profile;
  return pageMetadata({
    title: `${partner.name} | Partner Profile`,
    description: partner.description,
    canonical: `${SITE_URL}/network/partners/${slug}`,
    image: partner.logo_url ?? partner.logo_light_url ?? undefined,
  });
}

/**
 * One partner's full story — /network/partners/[slug]. Pulls together
 * category/tier, the real contribution (support_type/what_they_do), the
 * story (description, required+real on every row — see getPartnerProfileBySlug),
 * and, for mission partners, anything they've backed on the Stradalli bike
 * build (via findBackedComponents, the same name-based matching the
 * component board already uses — never a separate claim). No slug column
 * exists on either partner table; the route matches by slugify(name) (see
 * partner-profile.ts), so this page needs zero schema change.
 */
export default async function PartnerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getPartnerProfileBySlug(slug);
  if (!profile) notFound();

  const { partner, kind } = profile;
  const canonicalUrl = `${SITE_URL}/network/partners/${slug}`;
  const breadcrumbJsonLdData = breadcrumbJsonLd([...BREADCRUMB_BASE, { name: partner.name, url: canonicalUrl }]);

  const tierName =
    kind === "mission" && partner.tier ? MISSION_PARTNER_TIERS.find((t) => t.id === partner.tier)?.name : undefined;

  const backedComponents =
    kind === "mission" ? findBackedComponents(partner.name, BIKE_BUILD_COMPONENT_STATUS) : [];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbJsonLdData)} />

      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            <Link href="/network" className="hover:text-ink hover:underline">
              The Network
            </Link>{" "}
            / Partner Profile
          </p>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="shrink-0 sm:w-48">
              <PartnerLogo
                name={partner.name}
                logoUrl={partner.logo_url}
                logoLightUrl={partner.logo_light_url}
                logoDarkUrl={partner.logo_dark_url}
                background={partner.logo_background}
                className="h-24"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
                {kind === "beneficiary" ? "Official Campaign Beneficiary" : "Mission Partner"}
              </p>
              <h1 className="mt-1.5 text-balance font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                {partner.name}
              </h1>

              {kind === "beneficiary" && partner.nonprofit_status_verified && (
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
                  <ShieldCheck size={13} aria-hidden />
                  Verified 501(c)(3){partner.ein ? ` · EIN ${partner.ein}` : ""}
                </p>
              )}

              {kind === "mission" && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {tierName && (
                    <span className="inline-flex w-fit items-center rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-bronze-light">
                      {tierName}
                    </span>
                  )}
                  {partner.partner_type === "team-benefit-partner" && <TeamBenefitBadge />}
                </div>
              )}

              {kind === "mission" && (
                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-bronze">
                  {partner.relationship_label}
                </p>
              )}

              {kind === "mission" && partner.designation && (
                <div className="mt-2">
                  <PartnerRoleBadge label={partner.designation} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {kind === "beneficiary" && partner.what_they_do && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">What They Do</p>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">{partner.what_they_do}</p>
            </div>
          )}

          {kind === "mission" && partner.support_type && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                What They&apos;re Contributing
              </p>
              <p className="mt-2 text-base leading-relaxed text-charcoal-light">{partner.support_type}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              {kind === "beneficiary" ? "Why It Matters" : "The Story"}
            </p>
            <p className="mt-2 text-base leading-relaxed text-charcoal-light">{partner.description}</p>
          </div>

          {partner.associated_campaigns && partner.associated_campaigns.length > 0 && (
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-charcoal-light">
              Supporting Campaign: {formatAssociatedCampaigns(partner.associated_campaigns)}
            </p>
          )}

          {kind === "beneficiary" && partner.distribution_status && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Funding &amp; Distribution
              </p>
              <p className="mt-2 text-sm text-charcoal-light">
                {DISTRIBUTION_STATUS_LABEL[partner.distribution_status]}
                {partner.distributed_amount != null && ` — ${formatCurrency(partner.distributed_amount)} sent`}
                {partner.last_distributed_at && ` as of ${formatDateLong(partner.last_distributed_at)}`}
              </p>
            </div>
          )}

          {backedComponents.length > 0 && (
            <div className="mt-10 rounded-sm border border-bronze/30 bg-bronze/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-bronze">On the Bike Build</p>
              <p className="mt-2 text-sm text-charcoal-light">
                {partner.name} is credited on the Stradalli race-bike build currently underway for IRONMAN 70.3
                Chattanooga:
              </p>
              <ul className="mt-4 space-y-3">
                {backedComponents.map((row) => (
                  <li key={row.component}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{row.component}</span>
                      <StatusBadge status={row.status} label={row.statusLabel} />
                    </div>
                    <p className="mt-1 text-sm text-charcoal-light">{row.notes}</p>
                  </li>
                ))}
              </ul>
              <Link
                href={`${CAMPAIGN_URL}/journal/building-the-bike#component-status`}
                className="mt-4 inline-block text-sm font-semibold text-bronze hover:text-bronze-dark"
              >
                See the full bike build &rarr;
              </Link>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
            {partner.website_url && (
              <Link
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
              >
                Visit {partner.name}
                <ExternalLink size={13} aria-hidden />
              </Link>
            )}

            {kind === "beneficiary" && partner.donation_url && (
              <ExternalDonateButton
                href={partner.donation_url}
                orgName={partner.name}
                label={`Support ${partner.name} Directly →`}
              />
            )}
          </div>

          {kind === "beneficiary" && partner.donation_url && partner.requires_donation_note && (
            <DonationTrackingNote partnerName={partner.name} />
          )}
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-14 sm:py-16">
        <Container className="max-w-2xl text-center">
          <p className="text-balance font-display text-xl font-semibold uppercase tracking-tight text-ink">
            See Who Else Is Behind the Mission
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CTAButton href="/network">Back to the Network</CTAButton>
            <CTAButton href={`${CAMPAIGN_URL}/become-a-partner`} external variant="secondary">
              Become a Partner
            </CTAButton>
          </div>
        </Container>
      </section>
    </article>
  );
}
