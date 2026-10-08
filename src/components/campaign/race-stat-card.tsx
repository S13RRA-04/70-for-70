import { Card } from "@/components/shared/card";

/**
 * A single large KPI card — "Race at a Glance"'s building block. Deliberately
 * generic (label/value/detail only) so it isn't re-hardcoded per stat; see
 * RaceAtAGlance for the 5-card row this backs.
 */
export function RaceStatCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail?: string;
  /** Bronze accent treatment for the single most important card in the row (e.g. Primary Goal). */
  accent?: boolean;
}) {
  return (
    <Card variant={accent ? "accent" : "default"} className="p-5 text-center sm:text-left">
      <p
        className={`text-xs font-semibold uppercase tracking-widest ${accent ? "text-bronze" : "text-charcoal-light"}`}
      >
        {label}
      </p>
      <p className="mt-2 text-balance font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink sm:text-3xl">
        {value}
      </p>
      {detail && <p className="mt-1 text-sm text-charcoal-light">{detail}</p>}
    </Card>
  );
}
