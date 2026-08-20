import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
        active
          ? "border-bronze bg-bronze text-off-white"
          : "border-ink/15 text-charcoal-light hover:border-ink/30 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
