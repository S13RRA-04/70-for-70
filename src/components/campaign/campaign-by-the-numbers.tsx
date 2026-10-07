/** Compact "$70K"-style display, derived from the real goal rather than a hardcoded string — stays correct if the goal number ever changes. Only meant for round thousands. */
function formatCompactGoal(goal: number): string {
  return `$${Math.round(goal / 1000)}K`;
}

/**
 * 3 meaningful values, per AGENTS.md's Campaign Page spec — not a 5-stat row
 * diluted with restatements of the same facts. Both `goal` and
 * `beneficiaryCount` come from the live getFundraisingImpactStats() reading,
 * passed in by the page — never hardcoded here, so this never drifts from
 * the beneficiary count shown elsewhere on the same page.
 */
export function CampaignByTheNumbers({ goal, beneficiaryCount }: { goal: number; beneficiaryCount: number }) {
  const stats = [
    { value: "70.3", label: "Race Miles" },
    { value: formatCompactGoal(goal), label: "Goal" },
    { value: String(beneficiaryCount), label: "Beneficiaries" },
  ] as const;

  return (
    <dl className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
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
