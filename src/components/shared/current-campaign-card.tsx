import Image from "next/image";
import { CTAButton } from "@/components/shared/cta-button";
import { ATHLETIC_TEAM_NAME, CAMPAIGN_HOME_LINK, CAMPAIGN_NAME } from "@/lib/constants";

/**
 * "For The 22 Athletic Team → Current Campaign → Tri For The 22" module —
 * shared between the homepage and /athletes so the campaign hierarchy reads
 * identically everywhere it appears, per the Current Campaign Architecture.
 */
export function CurrentCampaignCard() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-bronze/30 bg-ink p-8 text-off-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-bronze"
      />
      <div className="flex items-center gap-4">
        <Image
          src="/campaign-logo.png"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className="shrink-0"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze-light">
            {ATHLETIC_TEAM_NAME}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-off-white/70">
            Current Campaign
          </p>
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
        {CAMPAIGN_NAME}
      </p>
      <p className="mt-2 max-w-lg text-sm text-off-white/75">
        A 70.3-mile triathlon paired with a $70,000 fundraising goal, in support of Mighty Oaks
        Foundation and Project Echelon — the first campaign under the {ATHLETIC_TEAM_NAME}.
      </p>
      <CTAButton href={CAMPAIGN_HOME_LINK.href} external className="mt-6">
        Visit {CAMPAIGN_HOME_LINK.label}
      </CTAButton>
    </div>
  );
}
