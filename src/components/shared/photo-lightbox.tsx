"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

/**
 * Wraps a photo thumbnail so clicking it opens the full-size image in a
 * native <dialog> for closer inspection — same hand-rolled <dialog>
 * pattern as RoleDetailDialog/ExternalDonateButton, not a lightbox
 * library. `children` is the existing thumbnail markup (whatever size/crop
 * it already uses); the dialog always renders the photo uncropped via
 * object-contain.
 */
export function PhotoLightbox({
  src,
  alt,
  caption,
  width,
  height,
  children,
  gallery,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  children: React.ReactNode;
  /**
   * The full ordered set of photos this one belongs to (e.g. every photo
   * on the same journal entry) — when given, the dialog adds Previous/Next
   * controls to step through them without closing and reopening. Omit for
   * a standalone photo (e.g. a single before/after frame); no nav renders.
   */
  gallery?: LightboxPhoto[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const hasGallery = (gallery?.length ?? 0) > 1;
  const active = hasGallery ? gallery![index] : { src, alt, caption, width, height };

  function open() {
    if (gallery) {
      const startIndex = gallery.findIndex((photo) => photo.src === src);
      setIndex(startIndex === -1 ? 0 : startIndex);
    }
    dialogRef.current?.showModal();
  }

  function step(delta: number) {
    if (!gallery) return;
    setIndex((current) => (current + delta + gallery.length) % gallery.length);
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`View larger: ${alt}`}
        className="group block w-full cursor-zoom-in text-left"
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (!hasGallery) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={active.alt}
        className="m-auto w-[min(92vw,64rem)] max-h-[90vh] overflow-y-auto rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/80"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-full bg-ink/70 p-1.5 text-off-white hover:bg-ink"
          >
            <X size={20} aria-hidden />
          </button>

          {hasGallery && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ink/70 p-2 text-off-white hover:bg-ink"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ink/70 p-2 text-off-white hover:bg-ink"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
              <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-off-white">
                {index + 1} / {gallery!.length}
              </span>
            </>
          )}

          <div className="relative max-h-[80vh] w-full bg-ink/5">
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="92vw"
              className="mx-auto h-auto max-h-[80vh] w-auto object-contain"
            />
          </div>
          {active.caption && (
            <p className="border-t border-ink/10 bg-off-white px-4 py-3 text-sm text-charcoal-light">
              {active.caption}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
