import Image from "next/image";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import type { AthleteProfile } from "@/lib/content/athletes";

export function AthleteCard({ athlete }: { athlete: AthleteProfile }) {
  return (
    <div className="overflow-hidden rounded-sm border border-ink/10 bg-off-white">
      <div className="relative aspect-[4/5] w-full bg-charcoal/10">
        {athlete.photoUrl ? (
          <Image
            src={athlete.photoUrl}
            alt={athlete.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <MediaPlaceholder />
        )}
      </div>
      <div className="p-5">
        <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          {athlete.name}
        </p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-bronze">
          {athlete.serviceCategory}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{athlete.bio}</p>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-3 text-xs text-charcoal-light">
          <p>
            <span className="font-semibold text-ink">Sport:</span> {athlete.sport}
          </p>
          <p>
            <span className="font-semibold text-ink">Goal:</span> {athlete.goal}
          </p>
          <p>
            <span className="font-semibold text-ink">Status:</span> {athlete.campaignStatus}
          </p>
        </div>
        {athlete.sponsors && athlete.sponsors.length > 0 && (
          <p className="mt-3 text-[10px] uppercase tracking-widest text-charcoal-light/80">
            Sponsored by {athlete.sponsors.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
