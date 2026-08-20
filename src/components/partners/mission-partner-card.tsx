import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { MissionPartnerRow } from "@/types/database";

export function MissionPartnerCard({ partner }: { partner: MissionPartnerRow }) {
  return (
    <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-6">
      {partner.logo_url ? (
        <Image
          src={partner.logo_url}
          alt={`${partner.name} logo`}
          width={160}
          height={64}
          className="h-12 w-auto object-contain"
        />
      ) : (
        <div className="flex h-12 items-center text-sm font-semibold uppercase tracking-wide text-ink">
          {partner.name}
        </div>
      )}

      <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide text-ink">
        {partner.name}
      </h3>

      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
        {partner.relationship_label}
      </p>

      <p className="mt-3 text-sm text-charcoal-light">{partner.description}</p>

      {(partner.support_type || partner.geographic_scope) && (
        <dl className="mt-4 space-y-1 text-xs text-charcoal-light">
          {partner.support_type && (
            <div className="flex gap-1.5">
              <dt className="font-semibold uppercase tracking-wide">Support:</dt>
              <dd>{partner.support_type}</dd>
            </div>
          )}
          {partner.geographic_scope && (
            <div className="flex gap-1.5">
              <dt className="font-semibold uppercase tracking-wide">Area:</dt>
              <dd>{partner.geographic_scope}</dd>
            </div>
          )}
        </dl>
      )}

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
