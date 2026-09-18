import { RaceStatCard } from "@/components/campaign/race-stat-card";
import { RACE_GOAL } from "@/lib/content/race-goal";
import { RACE_AGE_GROUP_YEARLY } from "@/lib/content/race-benchmarks";
import { RACE_INFO } from "@/lib/constants";

/**
 * "Race at a Glance" — a 5-card competitive-context summary, immediately
 * after the hero. Every value here already exists elsewhere on the page
 * (RACE_GOAL, RACE_AGE_GROUP_YEARLY, RACE_INFO) — this is a compressed
 * restatement for a few-seconds read, not new data.
 */
export function RaceAtAGlance() {
  const raceDateLabel = RACE_INFO.raceDate
    ? new Date(RACE_INFO.raceDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    : null;
  const mostRecentYear = RACE_AGE_GROUP_YEARLY.find((row) => row.finish && !row.note);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <RaceStatCard label="Race" value="IRONMAN 70.3 Chattanooga" detail={raceDateLabel ?? undefined} />
      <RaceStatCard label="Division" value={RACE_GOAL.ageGroup} />
      <RaceStatCard label="Primary Goal" value="Top 3 / Podium" accent />
      <RaceStatCard label="Target Finish" value={RACE_GOAL.targetFinish.podium} />
      {mostRecentYear && (
        <RaceStatCard
          label="Recent Benchmark"
          value={mostRecentYear.finish!}
          detail={`${mostRecentYear.year} ${RACE_GOAL.ageGroup} winner`}
        />
      )}
    </div>
  );
}
