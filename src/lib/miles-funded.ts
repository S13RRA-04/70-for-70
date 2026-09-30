import { FUNDRAISING_GOAL, RACE_TOTAL_DISTANCE } from "./constants";
import { percentFunded } from "./utils";

export interface MilesFundedMetric {
  /** Race miles "funded" so far, proportional to $ raised vs. the goal — not a count of individually dedicated miles (that UX was retired, see /fund-a-mile). */
  milesFunded: number;
  milesRemaining: number;
  totalDistance: number;
  percentFunded: number;
}

/**
 * Derives the "miles funded" campaign metaphor (70.3 miles ↔ $70,000 goal)
 * directly from the fundraising total — the single authoritative source —
 * rather than tracking mile-by-mile funding state separately. $1,293 raised
 * against a $70,000 goal funds 1,293/70,000 × 70.3 ≈ 1.29 miles.
 */
export function getMilesFundedMetric(
  amountRaised: number,
  goal: number = FUNDRAISING_GOAL,
  totalDistance: number = RACE_TOTAL_DISTANCE,
): MilesFundedMetric {
  const percent = percentFunded(amountRaised, goal);
  const milesFunded = Math.round(((percent / 100) * totalDistance) * 100) / 100;

  return {
    milesFunded,
    milesRemaining: Math.round((totalDistance - milesFunded) * 100) / 100,
    totalDistance,
    percentFunded: percent,
  };
}
