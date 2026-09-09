import type { EventActivityLogRow } from "@/types/database";

/** The admin-editable "Current Movement" module — a simple ordered log ("Hour 1: Run", "Hour 4: Ruck"). */
export function CurrentMovementLog({ entries }: { entries: EventActivityLogRow[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-charcoal-light">Live updates will post here once the challenge begins.</p>;
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-baseline gap-3 border-t border-ink/10 pt-3 first:border-t-0 first:pt-0">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-bronze">
            {entry.hour_label}
          </span>
          <span className="text-sm text-ink">
            {entry.activity_label}
            {entry.note && <span className="text-charcoal-light"> — {entry.note}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
