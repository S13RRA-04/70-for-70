import Link from "next/link";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

/**
 * Featured horizontal treatment for a partner whose support goes beyond a
 * standard tiered contribution — a functional designation (e.g. "Official
 * Bicycle Support Partner") independent of any monetary tier. See
 * MissionPartnerRow.designation's doc comment. More substantial than a
 * generic sponsor tile, but distinct from PresentingPartnerFeature, which
 * is reserved for the paid Presenting Partner tier.
 */
export function OfficialDesignationFeature({
  partner,
  quote,
  linkHref,
  linkLabel,
}: {
  partner: MissionPartnerRow;
  quote?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-bronze/40 bg-off-white">
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center">
        <PartnerLogo
          name={partner.name}
          logoUrl={partner.logo_url}
          logoLightUrl={partner.logo_light_url}
          logoDarkUrl={partner.logo_dark_url}
          background={partner.logo_background}
          className="h-28 w-full shrink-0 md:w-56"
        />

        <div className="flex-1">
          {partner.designation && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">{partner.designation}</p>
          )}
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            {partner.name}
          </h3>

          {quote && <p className="mt-4 max-w-xl text-base italic leading-relaxed text-charcoal-light">“{quote}”</p>}

          {linkHref && linkLabel && (
            <Link
              href={linkHref}
              className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
            >
              {linkLabel} &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
