import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import type { BikeBuildPhoto } from "@/types/bike-build";

function Frame({ photo, label }: { photo: BikeBuildPhoto; label: string }) {
  return (
    <figure className="flex-1 overflow-hidden rounded-sm border border-ink/10 bg-off-white">
      <PhotoLightbox src={photo.src} alt={photo.alt} caption={photo.caption} width={photo.width} height={photo.height}>
        <div className="relative aspect-[4/3] w-full bg-sand-light">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading="lazy"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </PhotoLightbox>
      <figcaption className="border-t border-ink/10 bg-off-white px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">{label}</p>
        <p className="mt-1 text-sm text-charcoal-light">{photo.caption}</p>
      </figcaption>
    </figure>
  );
}

/**
 * The gallery's closing beat: the first photo of the bare frame next to the
 * most current full-bike photo, side by side. Content comes from
 * BIKE_BUILD_BEFORE_AFTER — hand-picked, not derived, so this never
 * accidentally pairs the frame shot with an unrelated close-up.
 */
export function BuildBeforeAfter({ before, after }: { before: BikeBuildPhoto; after: BikeBuildPhoto }) {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Frame photo={before} label="Where It Started" />
      <ArrowRight
        size={28}
        className="mx-auto shrink-0 rotate-90 text-bronze sm:rotate-0"
        aria-hidden="true"
      />
      <Frame photo={after} label="Where It Stands Now" />
    </div>
  );
}
