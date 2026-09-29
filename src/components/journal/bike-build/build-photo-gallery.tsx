import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import type { BikeBuildGalleryPhoto } from "@/lib/content/building-the-bike";
import { formatDateLong } from "@/lib/utils";

function Thumbnail({ photo }: { photo: BikeBuildGalleryPhoto }) {
  return (
    <figure className="w-60 shrink-0 overflow-hidden rounded-sm border border-ink/10 bg-off-white sm:w-72">
      <PhotoLightbox src={photo.src} alt={photo.alt} caption={photo.caption} width={photo.width} height={photo.height}>
        <div className="relative aspect-[4/3] w-full bg-sand-light">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading="lazy"
            sizes="(min-width: 640px) 288px, 240px"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <span className="absolute right-2 top-2 rounded-full bg-ink/60 p-1.5 text-off-white opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn size={14} aria-hidden />
          </span>
        </div>
      </PhotoLightbox>
      <figcaption className="bg-off-white px-3 py-2">
        <time dateTime={photo.date} className="text-[11px] font-semibold uppercase tracking-widest text-bronze">
          {formatDateLong(photo.date)}
        </time>
        <p className="mt-0.5 truncate text-xs text-charcoal-light" title={photo.caption}>
          {photo.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/** Non-interactive copy of the track for the seamless marquee loop — see .animate-marquee in globals.css. Plain <img> (not next/image) since these never need to be the largest-contentful-paint or interactive; aria-hidden so screen readers only hear the real track once. */
function GhostTrack({ photos }: { photos: BikeBuildGalleryPhoto[] }) {
  return (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden="true">
      {photos.map((photo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={photo.src}
          alt=""
          className="aspect-[4/3] w-60 shrink-0 rounded-sm border border-ink/10 object-cover sm:w-72"
        />
      ))}
    </div>
  );
}

/**
 * Auto-scrolling strip of every real bike-build photo, oldest first — the
 * components going on the bike over time, one after another. Pauses on
 * hover/focus and respects prefers-reduced-motion (both handled by
 * .animate-marquee, same pattern as MerchTicker). Each thumbnail opens full
 * size via PhotoLightbox; the track is duplicated so the loop is seamless.
 */
export function BuildPhotoGallery({ photos }: { photos: BikeBuildGalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <div
      className="group overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 3%, black 97%, transparent)" }}
    >
      <div className="flex w-max animate-marquee-slow group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
        <div className="flex shrink-0 gap-4 pr-4">
          {photos.map((photo) => (
            <Thumbnail key={`${photo.entryId}-${photo.src}`} photo={photo} />
          ))}
        </div>
        <GhostTrack photos={photos} />
      </div>
    </div>
  );
}
