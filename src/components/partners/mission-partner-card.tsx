import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerLogo } from "@/components/shared/partner-logo";
import type { MissionPartnerRow } from "@/types/database";

export function MissionPartnerCard({ partner }: { partner: MissionPartnerRow }) {
  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
      <PartnerLogo
        name={partner.name}
        logoUrl={partner.logo_url}
        logoLightUrl={partner.logo_light_url}
        logoDarkUrl={partner.logo_dark_url}
        background={partner.logo_background}
        className="h-24 w-full"
      />

      <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide text-ink">
        {partner.name}
      </h3>

      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
        {partner.relationship_label}
      </p>

      {partner.website_url && (
        <Link
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
        >
          Visit Partner
          <ExternalLink size={13} aria-hidden />
        </Link>
      )}
    </div>
  );
}
