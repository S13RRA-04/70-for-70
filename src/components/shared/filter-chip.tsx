import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /** "md" (default) for the primary "What Do You Need?" row; "sm" for secondary filter rows so the hierarchy between them reads at a glance. */
  size?: "sm" | "md";
}

const SIZE_CLASSES = {
  sm: "px-3 py-1 text-[11px]",
  md: "px-4 py-2 text-xs",
} as const;

export function FilterChip({ label, active, onClick, size = "md" }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border font-semibold uppercase tracking-wide transition-colors",
        SIZE_CLASSES[size],
        active
          ? "border-bronze bg-bronze-text text-off-white"
          : "border-ink/15 text-charcoal-light hover:border-ink/30 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
