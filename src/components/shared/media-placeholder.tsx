import { cn } from "@/lib/utils";

/**
 * Silent, on-brand fallback for a missing photo (portrait, post image,
 * hero, etc.) — a ghosted brand mark, never a "TODO"/"Image TODO" label.
 * See README's "Eliminating Placeholder Content" section.
 */
export function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-olive-dark",
        className,
      )}
    >
      <span className="font-display text-3xl font-semibold uppercase tracking-widest text-off-white/15">
        70
      </span>
    </div>
  );
}
