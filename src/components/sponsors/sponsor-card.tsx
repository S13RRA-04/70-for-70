import Image from "next/image";
import type { SponsorRow } from "@/types/database";

export function SponsorCard({ sponsor }: { sponsor: SponsorRow }) {
  const content = (
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

  if (!sponsor.website_url) return content;

  return (
    <a
      href={sponsor.website_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
    >
      {content}
    </a>
  );
}
