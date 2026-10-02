import Image from "next/image";
import type { JournalGalleryImage } from "@/types/database";

/** Supporting photos beyond the single hero image — editable in the admin journal editor's 6 gallery slots. Null/empty renders nothing. */
export function JournalGallery({ images }: { images: JournalGalleryImage[] | null }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-sand-light">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
