/**
 * Splits RACE_GOAL's combined podium strings (e.g. "≤29:00 (~1:22–1:25 per
 * 100 yd)") into a primary target and a secondary approximate-pace/speed
 * line, without altering the underlying value — same source string, just
 * two visual lines instead of one.
 */
function splitTarget(value: string): { primary: string; secondary?: string } {
  const match = value.match(/^(.*?)\s*\((.*)\)$/);
  if (!match) return { primary: value };
  return { primary: match[1], secondary: match[2] };
}

export function TargetSplitCard({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  /** Strongest visual treatment — used for the overall Finish target. */
  emphasized?: boolean;
}) {
  const { primary, secondary } = splitTarget(value);

  return (
    <div
      className={`rounded-sm border p-5 text-center ${
        emphasized ? "border-bronze bg-bronze/10" : "border-ink/10 bg-off-white"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-widest ${emphasized ? "text-bronze" : "text-charcoal-light"}`}>
        {label}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal-light/70">Target</p>
      <p className="mt-1 text-balance font-display text-2xl font-bold text-ink sm:text-3xl">{primary}</p>
      {secondary && <p className="mt-2 text-sm text-charcoal-light">{secondary}</p>}
    </div>
  );
}
