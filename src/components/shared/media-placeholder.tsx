import { Waves, Bike, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrainingDiscipline } from "@/types/database";

const DISCIPLINE_ICON: Record<TrainingDiscipline, typeof Waves> = {
  swim: Waves,
  bike: Bike,
  run: Footprints,
};

/**
 * Silent, on-brand fallback for a missing photo (portrait, post image,
 * hero, etc.) — a ghosted brand mark, never a "TODO"/"Image TODO" label.
 * See README's "Eliminating Placeholder Content" section. When a journal
 * entry's discipline is known, shows a discipline icon instead of the
 * generic "70" glyph — a clean illustration beats a repeated number.
 */
export function MediaPlaceholder({
  className,
  discipline,
}: {
  className?: string;
  discipline?: TrainingDiscipline | null;
}) {
  const Icon = discipline ? DISCIPLINE_ICON[discipline] : null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-olive-dark",
        className,
      )}
    >
      {Icon ? (
        <Icon size={40} strokeWidth={1.5} className="text-off-white/20" />
      ) : (
        <span className="font-display text-3xl font-semibold uppercase tracking-widest text-off-white/15">
          70
        </span>
      )}
    </div>
  );
}
