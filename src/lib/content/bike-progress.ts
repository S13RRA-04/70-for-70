import { RACE_LOGISTICS } from "./race-logistics";

/**
 * The current outdoor-ride benchmark behind /the-race's "Chattanooga Bike
 * Build" section and the Race Goal table's Bike "Current Benchmark" cell —
 * both read from this one object so a new ride only needs to be entered
 * here. Update in place as training progresses; keep BIKE_HR_ZONES and
 * BIKE_SEGMENT_HIGHLIGHTS in sync with whichever ride this represents.
 */
export const BIKE_PROGRESS = {
  date: "2026-09-10",
  distanceMi: 12.28,
  movingTime: "57:31",
  avgSpeedMph: 12.8,
  maxSpeedMph: 28.5,
  avgHr: 148,
  maxHr: 169,
  elevationFt: 276,
  relativeEffort: 96,
} as const;

/** Heart-rate zone distribution for the BIKE_PROGRESS ride, Z1 (easiest) through Z5 (hardest) — sums to 100. */
export const BIKE_HR_ZONES = [
  { zone: "Z1", pct: 3 },
  { zone: "Z2", pct: 12 },
  { zone: "Z3", pct: 79 },
  { zone: "Z4", pct: 6 },
  { zone: "Z5", pct: 0 },
] as const;

/**
 * Strongest representative segments from the BIKE_PROGRESS ride — short
 * efforts that show what's achievable above the whole-ride average, not
 * sustained or predicted race pace. See ChattanoogaBikeBuild's "Signs of
 * Progress" section.
 */
export const BIKE_SEGMENT_HIGHLIGHTS = [
  { distanceMi: 0.75, speedMph: 13.0, avgHr: 146 },
  { distanceMi: 1.19, speedMph: 15.1, avgHr: 148 },
  { distanceMi: 2.01, speedMph: 14.1, avgHr: 157 },
] as const;

/**
 * IRONMAN 70.3 Chattanooga bike-leg course demands. Elevation and course
 * character are re-derived from RACE_LOGISTICS.bike (race-logistics.ts)
 * rather than duplicated — that's the source of truth for course facts.
 */
export const CHATTANOOGA_BIKE_COURSE = {
  distanceMi: 56,
  elevationFt: RACE_LOGISTICS.bike.elevationGain,
  climbingDensity: "~40 ft / mile",
  character: "Rolling",
} as const;

export interface BikeDevelopmentStage {
  label: string;
  /** True only for the athlete's actual current fitness — styled distinctly from the developmental milestones ahead of it. */
  isCurrent: boolean;
  facts: string[];
}

/**
 * "The Road to 56" — developmental benchmarks between today's fitness and
 * a race-ready 56-mile Chattanooga effort. These are training milestones,
 * not predicted race paces; the actual competitive/podium race targets
 * live separately in RACE_GOAL (race-goal.ts) and stay untouched by this
 * progression. See ChattanoogaBikeBuild.
 */
export const BIKE_DEVELOPMENT_STAGES: BikeDevelopmentStage[] = [
  {
    label: "Baseline — Current",
    isCurrent: true,
    facts: [
      `${BIKE_PROGRESS.distanceMi} mi`,
      `${BIKE_PROGRESS.elevationFt}+ ft climbing`,
      `${BIKE_PROGRESS.avgSpeedMph} mph`,
      `${BIKE_PROGRESS.avgHr} bpm avg HR`,
    ],
  },
  {
    label: "Next Milestone",
    isCurrent: false,
    facts: ["20–25 mi", "Rolling terrain", "13+ mph", "Controlled aerobic/low-tempo effort"],
  },
  {
    label: "Build",
    isCurrent: false,
    facts: [
      "35–45 mi",
      "~1,400–1,900 ft climbing",
      "14–15+ mph",
      "Stable cardiovascular effort",
      "Begin regular brick runs",
    ],
  },
  {
    label: "Race-Specific",
    isCurrent: false,
    facts: [
      "50–60 mi",
      "~2,000–2,500 ft climbing",
      "Full race fueling",
      "Controlled race effort",
      "20–45 min brick run afterward",
    ],
  },
];
