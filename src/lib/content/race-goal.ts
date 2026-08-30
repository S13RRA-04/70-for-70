/**
 * Cody's actual race-day goal for IRONMAN 70.3 Chattanooga — a placement
 * goal (podium, M35-39), not a single fixed split. The target split ranges
 * below are the "podium contender" tier of RACE_AGE_GROUP_PERFORMANCE_TIERS
 * in race-benchmarks.ts, i.e. what recent-year M35-39 podium finishers
 * (2022-2023, 2026) actually ran — not an invented target.
 */
export const RACE_GOAL = {
  ageGroup: "M35–39",
  placementLabel: "Podium finish (Top 3)",
  targetFinish: { low: "4:15:00", high: "4:25:00" },
  splits: {
    swim: { low: "29:00", high: "35:00" },
    bike: { low: "2:15:00", high: "2:22:00" },
    run: { low: "1:22:00", high: "1:30:00" },
    /** Combined T1 + T2. */
    transitions: { low: "6:00", high: "8:00" },
  },
  note: "Target ranges reflect what recent M35–39 podium finishers at this race have actually run, not a fixed pace plan.",
} as const;
