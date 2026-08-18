import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sublabel,
  className,
}: {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-ink/10 bg-off-white px-5 py-4",
        className,
      )}
    >
      <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        {label}
      </p>
      {sublabel && <p className="mt-0.5 text-xs text-charcoal-light/80">{sublabel}</p>}
    </div>
  );
}
