const STATS = [
  { value: "70", label: "Fundraising Miles" },
  { value: "$70K", label: "Goal" },
  { value: "70.3", label: "Race Distance" },
  { value: "2", label: "Veteran Organizations" },
  { value: "1", label: "Mission" },
] as const;

/**
 * Reusable stat row. Extend `STATS` later with donors/sponsors/training
 * hours/days remaining once that data exists — see README Priority 14.
 */
export function CampaignByTheNumbers() {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {STATS.map((stat) => (
        <div key={stat.label} className="rounded-sm border border-ink/10 bg-off-white p-5 text-center">
          <dt className="sr-only">{stat.label}</dt>
          <dd className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {stat.value}
          </dd>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            {stat.label}
          </p>
        </div>
      ))}
    </dl>
  );
}
