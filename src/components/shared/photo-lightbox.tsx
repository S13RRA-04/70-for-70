"use client";

import { useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
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
        aria-label={alt}
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
          <div className="relative max-h-[80vh] w-full bg-ink/5">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="92vw"
              className="mx-auto h-auto max-h-[80vh] w-auto object-contain"
            />
          </div>
          {caption && (
            <p className="border-t border-ink/10 bg-off-white px-4 py-3 text-sm text-charcoal-light">{caption}</p>
          )}
        </div>
      </dialog>
    </>
  );
}
