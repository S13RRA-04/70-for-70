/**
 * Cody's actual race-day goal for IRONMAN 70.3 Chattanooga — a placement
 * goal (podium, M35-39), not a single fixed split. Recalibrated from real
 * M35-39 results (see race-benchmarks.ts): 2023 was an unusually fast
 * year and 2025 dropped the swim from the results entirely, so neither
 * year alone sets the bar on its own — but together they show recent
 * Chattanooga M35-39 podiums running closer to ~4:05–4:15 than the
 * softer "podium contender" tier (4:15–4:25) this used to target. That
 * range is kept below as the "competitive" column — still a legitimate
 * next milestone, just no longer the finish line. Rolled forward on a
 * 3-year basis as more results come in.
 */
export interface GoalMetric {
  /** A real recorded M35–39 result at this race — not a target. Null where no relevant result exists. */
  historical: string | null;
  /** Cody's own current, measured benchmark — "TBD" until race-effort data exists for this split. */
  current: string;
  /** Where training is realistically pointed next — a more conservative, still-competitive range. */
  competitive: string;
  /** What the 2023/2025 M35–39 results say the podium actually takes. */
  podium: string;
}

export const RACE_GOAL = {
  ageGroup: "M35–39",
  placementLabel: "Podium finish (Top 3)",
  targetFinish: {
    historical: "4:04:51–4:27:25 (2023 top-9); 2025 not directly comparable — no swim leg held",
    current: "TBD",
    competitive: "4:15:00–4:25:00",
    podium: "4:05:00–4:15:00",
  } satisfies GoalMetric,
  splits: {
    swim: {
      historical: "28:19 (2023 winner)",
      current: "TBD",
      competitive: "30:00–32:00",
      podium: "≤29:00 (~1:22–1:25 per 100 yd)",
    } satisfies GoalMetric,
    bike: {
      historical: "2:10:23–2:14:36 (2023 & 2025 winners)",
      current: "12.1 mph outdoor training baseline (not race effort)",
      competitive: "2:20:00–2:25:00 (23.1–24.0 mph)",
      podium: "≤2:15:00 (~24.9+ mph)",
    } satisfies GoalMetric,
    run: {
      historical: "1:17:09–1:26:41 (2023 & 2025 winners)",
      current: "TBD",
      competitive: "1:25:00–1:30:00 (6:29–6:52 per mi)",
      podium: "≤1:20:00 (~6:06 per mi)",
    } satisfies GoalMetric,
    transitions: {
      historical: null,
      current: "TBD",
      competitive: "6:00 or less combined",
      podium: "5:00 or less combined",
    } satisfies GoalMetric,
  },
  note: "Historical is a real recorded M35–39 result at this race, not a target — 2023 was an unusually fast year and 2025 dropped the swim from official results, so its total isn't directly comparable (see the Race Benchmarks table below). Competitive and Podium are 3-year rolling targets, not a fixed pace plan.",
} as const;
