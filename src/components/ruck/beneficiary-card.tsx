import { ExternalLink, ShieldCheck } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { ExternalDonateButton } from "@/components/shared/external-donate-button";
import { DonationTrackingNote } from "@/components/shared/donation-tracking-note";
import type { LogoBackground } from "@/types/database";

export interface BeneficiaryCardData {
  name: string;
  description?: string | null;
  websiteUrl?: string | null;
  donationUrl?: string | null;
  ein?: string | null;
  verified?: boolean;
  logo?: {
    url: string | null;
    lightUrl?: string | null;
    darkUrl?: string | null;
    background?: LogoBackground | null;
  } | null;
}

/**
 * One beneficiary card, reused for both an event's own beneficiaries (plain
 * data — e.g. RUCK_EVENT_BENEFICIARIES on a mission page) and Cody's usual
 * campaign beneficiaries (Supabase `partners` rows on the Ruck home page).
 * `trackingCode` is only passed for the latter group, and only when that
 * partner's donation platform can't self-attribute a gift — an event
 * organizer's own beneficiaries have no such arrangement, so they never show one.
 */
export function BeneficiaryCard({
  eyebrow,
  data,
  trackingCode,
}: {
  eyebrow: string;
  data: BeneficiaryCardData;
  trackingCode?: string;
}) {
  const hasLinks = Boolean(data.websiteUrl || data.donationUrl);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-line bg-white p-6 sm:flex-row sm:p-8">
      <div className="shrink-0 sm:w-48">
        <PartnerLogo
          name={data.name}
          logoUrl={data.logo?.url ?? null}
          logoLightUrl={data.logo?.lightUrl}
          logoDarkUrl={data.logo?.darkUrl}
          background={data.logo?.background}
          className="h-20"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-3xl uppercase text-ink">{data.name}</h3>
        {data.verified && (
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-olive">
            <ShieldCheck size={13} aria-hidden />
            Verified 501(c)(3){data.ein ? ` · EIN ${data.ein}` : ""}
          </p>
        )}
        {data.description && <p className="mt-4 text-sm text-charcoal-light">{data.description}</p>}
        {hasLinks && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {data.websiteUrl && (
              <a
                href={data.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="beneficiary_selected"
                className="action-control inline-flex items-center justify-center font-bold gap-1.5 border-2 border-navy px-4 py-2 text-[15px] text-navy hover:bg-white"
              >
                Learn More
                <ExternalLink size={13} aria-hidden />
              </a>
            )}
            {data.donationUrl && (
              <ExternalDonateButton href={data.donationUrl} orgName={data.name} label={`Support ${data.name} Directly →`} />
            )}
          </div>
        )}
        {data.donationUrl && trackingCode && (
          <details className="mt-4 text-xs text-charcoal-light">
            <summary className="cursor-pointer font-semibold uppercase tracking-wide text-olive">Donation attribution details</summary>
            <DonationTrackingNote partnerName={data.name} trackingCode={trackingCode} />
          </details>
        )}
      </div>
    </div>
  );
}
