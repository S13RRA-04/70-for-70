import { CURRENT_CAMPAIGN } from "@/lib/constants";

/** 3 meaningful values, per AGENTS.md's Campaign Page spec — not a 5-stat row diluted with restatements of the same facts. */
const STATS = [
  { value: "70.3", label: "Race Miles" },
  { value: "$70K", label: "Goal" },
  { value: String(CURRENT_CAMPAIGN.beneficiaries.length), label: "Beneficiaries" },
] as const;

export function CampaignByTheNumbers() {
  return (
    <dl className="grid grid-cols-3 gap-4">
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
