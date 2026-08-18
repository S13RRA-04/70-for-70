import Image from "next/image";
import Link from "next/link";
import type { PartnerRow } from "@/types/database";

export function PartnerCard({ partner }: { partner: PartnerRow }) {
  const hasLinks = Boolean(partner.website_url || partner.donation_url);

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

      {partner.what_they_do && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            What They Do
          </p>
          <p className="mt-1 text-sm text-charcoal-light">{partner.what_they_do}</p>
        </div>
      )}

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Why It Matters to Me
        </p>
        <p className="mt-1 text-sm text-charcoal-light">{partner.description}</p>
      </div>

      {hasLinks && (
        <div className="mt-5 flex flex-wrap gap-3">
          {partner.website_url && (
            <Link
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
            >
              Learn More
            </Link>
          )}

          {partner.donation_url && (
            <Link
              href={partner.donation_url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="partner_click"
              className="rounded-sm bg-bronze px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Donate
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
