import { Footprints, HandCoins, Handshake, Flag, Trophy, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JournalPrimaryCategory } from "@/types/database";

const CATEGORY_ICON: Record<JournalPrimaryCategory, typeof Footprints> = {
  Training: Footprints,
  Fundraising: HandCoins,
  "Mighty Oaks": TreePine,
  Sponsors: Handshake,
  "Race Prep": Flag,
  Milestones: Trophy,
};

/**
 * Category-specific branded fallback for a journal card with no photo —
 * same visual language as MediaPlaceholder (ghosted icon on the campaign's
 * dark gradient), keyed by journal category instead of training discipline
 * so a card without a photo still communicates what it's about instead of
 * showing a generic mark. Never stock imagery — see AGENTS.md's Journal
 * brief §5.
 */
export function JournalCategoryPlaceholder({
  category,
  className,
}: {
  category: JournalPrimaryCategory;
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category] ?? Trophy;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-olive-dark",
        className,
      )}
    >
      <Icon size={40} strokeWidth={1.5} className="text-off-white/20" />
    </div>
  );
}
