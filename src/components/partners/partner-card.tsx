import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { ExternalDonateButton } from "@/components/shared/external-donate-button";
import { DonationTrackingNote } from "@/components/shared/donation-tracking-note";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { PartnerRow } from "@/types/database";
import { Card } from "@/components/shared/card";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { partnerProfileHref } from "@/lib/data/partner-profile";

export const DISTRIBUTION_STATUS_LABEL: Record<NonNullable<PartnerRow["distribution_status"]>, string> = {
  not_started: "Distribution not yet started",
  in_progress: "Distribution in progress",
  distributed: "Funds distributed",
};

/**
 * Large feature panel, not a small generic card — beneficiary
 * relationships are formally confirmed 501(c)(3) recipients, so each one
 * gets room to be read, not just recognized. Logo/mark block sits beside
 * the copy on sm+ screens and stacks above it on mobile.
 */
export function PartnerCard({
  partner,
  mileNumber,
  allocatedAmount,
}: {
  partner: PartnerRow;
  mileNumber?: number;
  /** This org's share of verified donations, from getAllocationBreakdown() — omitted entirely (not shown as $0) when no allocation policy is set or this org has no verified donations yet. */
  allocatedAmount?: number;
}) {
  return (
    <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
      <div className="shrink-0 sm:w-48">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="h-20"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Official Campaign Beneficiary
        </p>

        <h3 className="mt-1.5 font-display text-2xl font-semibold uppercase tracking-wide text-ink">
          {partner.name}
        </h3>

        {partner.nonprofit_status_verified && (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
            <ShieldCheck size={13} aria-hidden />
            Verified 501(c)(3){partner.ein ? ` · EIN ${partner.ein}` : ""}
          </p>
        )}

        {partner.what_they_do && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              What They Do
            </p>
            <p className="mt-1 text-sm text-charcoal-light">{partner.what_they_do}</p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            About This Partnership
          </p>
          <p className="mt-1 text-sm text-charcoal-light">{partner.description}</p>
        </div>

        {(allocatedAmount !== undefined || partner.distribution_status) && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Funding &amp; Distribution
            </p>
            {allocatedAmount !== undefined && (
              <p className="mt-1 text-sm text-charcoal-light">
                {formatCurrency(allocatedAmount)} in verified donations attributed to this organization.
              </p>
            )}
            {partner.distribution_status && (
              <p className="mt-1 text-sm text-charcoal-light">
                {DISTRIBUTION_STATUS_LABEL[partner.distribution_status]}
                {partner.distributed_amount != null && ` — ${formatCurrency(partner.distributed_amount)} sent`}
                {partner.last_distributed_at && ` as of ${formatDateLong(partner.last_distributed_at)}`}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={partnerProfileHref(partner.name)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
          >
            Full Partner Profile &rarr;
          </Link>

          {partner.website_url && (
            <Link
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="beneficiary_selected"
              className="inline-flex items-center gap-1.5 rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
            >
              Learn More
              <ExternalLink size={13} aria-hidden />
            </Link>
          )}

          {partner.donation_url && (
            <ExternalDonateButton
              href={partner.donation_url}
              orgName={partner.name}
              mileNumber={mileNumber}
              label={`Support ${partner.name} Directly →`}
            />
          )}
        </div>

        {partner.donation_url && partner.requires_donation_note && (
          <DonationTrackingNote partnerName={partner.name} mileNumber={mileNumber} />
        )}
      </div>
    </Card>
  );
}
