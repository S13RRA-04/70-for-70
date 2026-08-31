/**
 * M35-39 age-group benchmark data for IRONMAN 70.3 Chattanooga, compiled
 * from age-group results for the 2022-2026 races. Used on /the-race as
 * "times to beat" context for RACE_GOAL (race-goal.ts) — real recorded
 * results, not projections, except where marked unconfirmed below.
 *
 * Deliberately anonymous — this is about the times, not putting other
 * amateur athletes' names on a public campaign page, so no winner/finisher
 * names are stored or rendered here.
 *
 * 2025 is excluded from time comparisons: no swim leg was held that year
 * (river conditions), so total times aren't comparable to a normal-format
 * race. It's kept in the yearly table only for continuity, clearly flagged.
 */

export interface AgeGroupYearResult {
  year: number;
  swim: string | null;
  bike: string | null;
  run: string | null;
  finish: string | null;
  note?: string;
}

export const RACE_AGE_GROUP_YEARLY: AgeGroupYearResult[] = [
  {
    year: 2026,
    swim: "33:36",
    bike: "2:10:14",
    run: "1:25:34",
    finish: "4:16:00",
  },
  {
    year: 2025,
    swim: null,
    bike: "2:10:23",
    run: "1:26:41",
    finish: "3:39:31",
    note: "No swim leg held (river conditions) — not comparable to a normal-format race.",
  },
  {
    year: 2024,
    swim: null,
    bike: null,
    run: null,
    finish: null,
    note: "Unconfirmed — full results not yet verified.",
  },
  {
    year: 2023,
    swim: "28:19",
    bike: "2:14:36",
    run: "1:17:09",
    finish: "4:04:51",
  },
  {
    year: 2022,
    swim: "28:07",
    bike: "2:13:44",
    run: "1:19:32",
    finish: "4:06:33",
  },
];

export interface AgeGroupPlacingResult {
  place: number;
  swim: string | null;
  bike: string | null;
  run: string | null;
  finish: string;
}

/** Top 5 M35-39, 2026 — the most recent normal-format race. 218 M35-39 finishers that year. */
export const RACE_AGE_GROUP_TOP5_2026: AgeGroupPlacingResult[] = [
  { place: 1, swim: "33:36", bike: "2:10:14", run: "1:25:34", finish: "4:16:00" },
  { place: 2, swim: "29:30", bike: "2:15:27", run: "1:26:55", finish: "4:17:26" },
  { place: 3, swim: "32:14", bike: "2:21:00", run: "1:25:20", finish: "4:24:08" },
  { place: 4, swim: "35:22", bike: "2:18:52", run: "1:29:04", finish: "4:29:38" },
  { place: 5, swim: "30:57", bike: "2:25:11", run: "1:26:29", finish: "4:30:09" },
];

/**
 * Top 3 M35-39, 2025 — the shortened (no-swim) format, so finish times
 * aren't comparable to a normal-format year; kept for bike/run split
 * context and because it's the most recent race held. Places 2 and 3
 * have no reported splits.
 */
export const RACE_AGE_GROUP_TOP3_2025: AgeGroupPlacingResult[] = [
  { place: 1, swim: null, bike: "2:10:23", run: "1:26:41", finish: "3:39:31" },
  { place: 2, swim: null, bike: null, run: null, finish: "3:42:48" },
  { place: 3, swim: null, bike: null, run: null, finish: "3:44:53" },
];

export const RACE_AGE_GROUP_2026_FINISHER_COUNT = 218;

/** 2026 top-5% finish-time threshold for M35-39 — an intermediate benchmark between "sub-5" and the front of the division. */
export const RACE_AGE_GROUP_2026_TOP5_PERCENT_THRESHOLD = "4:48:18";

/** Top 5 M35-39, 2023 — kept as historical context; that year's field was unusually fast. */
export const RACE_AGE_GROUP_TOP5_2023: AgeGroupPlacingResult[] = [
  { place: 1, swim: "28:19", bike: "2:14:36", run: "1:17:09", finish: "4:04:51" },
  { place: 2, swim: "27:17", bike: "2:23:45", run: "1:18:07", finish: "4:13:59" },
  { place: 3, swim: "28:37", bike: "2:17:51", run: "1:24:33", finish: "4:16:14" },
  { place: 4, swim: "26:30", bike: "2:13:47", run: "1:31:22", finish: "4:17:55" },
  { place: 5, swim: "27:20", bike: "2:24:42", run: "1:23:12", finish: "4:21:38" },
];

/** 2023 9th place, finish time only — no splits recorded. */
export const RACE_AGE_GROUP_2023_NINTH_FINISH = "4:27:25";

/** 2023 10th place, finish time only — no splits recorded. */
export const RACE_AGE_GROUP_2023_TENTH_FINISH = "4:33:11";

export interface PerformanceTier {
  tier: string;
  swim: string;
  bike: string;
  run: string;
  transitions: string;
  finish: string;
}

/**
 * Composite performance tiers across the normal-format years (2022, 2023,
 * 2026) — see RACE_GOAL for the actual goal targets these back.
 *
 * "AG winner" is labeled "(podium range)" because that's what the 2023
 * and 2025 M35-39 results actually show: recent podiums here run closer
 * to age-group-winner pace than to this table's old "Podium contender"
 * tier, which undersold it by about 10 minutes. That tier is relabeled
 * "Competitive" — a legitimate next milestone, just not the finish line.
 */
export const RACE_AGE_GROUP_PERFORMANCE_TIERS: PerformanceTier[] = [
  { tier: "AG winner (podium range)", swim: "28–34m", bike: "2:10–2:15", run: "1:17–1:26", transitions: "~5–7m", finish: "4:05–4:16" },
  { tier: "Competitive", swim: "29–35m", bike: "2:15–2:22", run: "1:22–1:30", transitions: "~6–8m", finish: "4:15–4:25" },
  { tier: "Top 5–10", swim: "30–36m", bike: "2:20–2:30", run: "1:25–1:35", transitions: "~7–9m", finish: "4:25–4:40" },
  { tier: "Sub-5 target", swim: "~35–40m", bike: "~2:35–2:40", run: "~1:50–1:55", transitions: "~8–10m", finish: "4:50–5:00" },
];
