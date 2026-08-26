import { MediaPlaceholder } from "@/components/shared/media-placeholder";

/**
 * Clearly-labeled empty slots for photos the story hasn't reached yet —
 * never a fabricated image. Swap an item out of BIKE_BUILD_PHOTO_ROADMAP
 * and add a real <figure> to the relevant timeline entry once a photo
 * exists; this grid shrinks automatically as that happens.
 */
export function PhotoRoadmap({ slots }: { slots: { label: string; description: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <div key={slot.label} className="overflow-hidden rounded-sm border border-dashed border-ink/20">
          <div className="relative aspect-[4/3] w-full">
            <MediaPlaceholder discipline="bike" />
          </div>
          <div className="p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{slot.label}</p>
            <p className="mt-1 text-xs text-charcoal-light/80">{slot.description}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-bronze">Photo Coming Soon</p>
          </div>
        </div>
      ))}
    </div>
  );
}
