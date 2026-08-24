import Image from "next/image";
import type { SponsorRow } from "@/types/database";

export function SponsorCard({ sponsor }: { sponsor: SponsorRow }) {
  const logo = (
    <div className="flex h-24 items-center justify-center rounded-sm border border-ink/10 bg-off-white p-4 transition-shadow hover:shadow-md">
      {sponsor.logo_url ? (
        <Image
          src={sponsor.logo_url}
          alt={`${sponsor.name} logo`}
          width={160}
          height={64}
          className="h-full w-auto max-w-full object-contain"
        />
      ) : (
        <span className="text-center text-xs font-semibold uppercase tracking-wide text-charcoal-light">
          {sponsor.name}
        </span>
      )}
    </div>
  );

  const logoContent = sponsor.website_url ? (
    <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
      {logo}
    </a>
  ) : (
    logo
  );

  // The disclosure must appear immediately beside/below the logo, not
  // buried in the footer — see getSponsors()'s ethics_cleared gate.
  if (!sponsor.disclosure_text) return logoContent;

  return (
    <div>
      {logoContent}
      <p className="mt-2 text-xs leading-relaxed text-charcoal-light">{sponsor.disclosure_text}</p>
    </div>
  );
}
