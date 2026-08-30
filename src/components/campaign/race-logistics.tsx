import { RACE_LOGISTICS } from "@/lib/content/race-logistics";

const LEG_CARDS = [
  {
    label: "Swim",
    description: RACE_LOGISTICS.swim.description,
    facts: [{ label: "Cutoff", value: RACE_LOGISTICS.swim.cutoff }],
  },
  {
    label: "Bike",
    description: RACE_LOGISTICS.bike.description,
    facts: [
      { label: "Elevation gain", value: RACE_LOGISTICS.bike.elevationGain },
      { label: "Intermediate cutoff", value: RACE_LOGISTICS.bike.intermediateCutoff },
      { label: "Overall cutoff", value: RACE_LOGISTICS.bike.overallCutoff },
      { label: "Aid stations", value: RACE_LOGISTICS.bike.aidStations },
    ],
  },
  {
    label: "Run",
    description: RACE_LOGISTICS.run.description,
    facts: [
      { label: "Elevation gain", value: RACE_LOGISTICS.run.elevationGain },
      { label: "Intermediate cutoff", value: RACE_LOGISTICS.run.intermediateCutoff },
      { label: "Overall cutoff", value: RACE_LOGISTICS.run.overallCutoff },
      { label: "Aid stations", value: RACE_LOGISTICS.run.aidStations },
    ],
  },
];

/**
 * Course + cutoff logistics for IRONMAN 70.3 Chattanooga — see
 * race-logistics.ts for the source caveat (a third-party race guide, not
 * IRONMAN's own athlete guide for the 2027 race).
 */
export function RaceLogistics() {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {LEG_CARDS.map((leg) => (
          <div key={leg.label} className="rounded-sm border border-ink/10 bg-off-white p-6">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{leg.label}</p>
            <p className="mt-2 text-sm text-charcoal-light">{leg.description}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {leg.facts.map((fact) => (
                <div key={fact.label} className="border-t border-ink/10 pt-2">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                    {fact.label}
                  </dt>
                  <dd className="text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">Race Weekend Schedule</p>
        <dl className="mt-4 space-y-3 text-sm">
          {RACE_LOGISTICS.schedule.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 border-t border-ink/10 pt-3 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="font-medium text-charcoal-light">{item.label}</dt>
              <dd className="text-ink sm:text-right">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-4 text-xs text-charcoal-light">
        Compiled from a third-party race guide, not IRONMAN&apos;s own athlete guide — treat as recent-year
        reference and confirm against the official 2027 athlete guide once IRONMAN publishes it.
      </p>
    </div>
  );
}
