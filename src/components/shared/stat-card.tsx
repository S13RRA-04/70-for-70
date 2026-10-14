import { cn } from "@/lib/utils";
import { Card } from "@/components/shared/card";

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
    <Card
      className={cn(
        "px-5 py-4",
        className,
      )}
    >
      <p className="font-display text-3xl tabular-nums text-ink sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
        {label}
      </p>
      {sublabel && <p className="mt-0.5 text-xs text-charcoal-light/80">{sublabel}</p>}
    </Card>
  );
}
