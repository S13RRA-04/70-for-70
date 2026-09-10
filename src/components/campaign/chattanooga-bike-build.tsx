import { ExternalLink } from "lucide-react";
import {
  BIKE_DEVELOPMENT_STAGES,
  BIKE_HR_ZONES,
  BIKE_PROGRESS,
  BIKE_SEGMENT_HIGHLIGHTS,
  CHATTANOOGA_BIKE_COURSE,
} from "@/lib/content/bike-progress";
import { RACE_INFO } from "@/lib/constants";

const HEAD_CELL = "px-4 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light";
const BODY_CELL = "px-4 py-3 align-top";
const ROW = "border-b border-ink/10 bg-off-white last:border-0";

const COURSE_DEMAND_CARDS = [
  { label: "Distance", value: `${CHATTANOOGA_BIKE_COURSE.distanceMi} mi` },
  { label: "Elevation", value: CHATTANOOGA_BIKE_COURSE.elevationFt },
  { label: "Climbing Density", value: CHATTANOOGA_BIKE_COURSE.climbingDensity },
  { label: "Course Character", value: CHATTANOOGA_BIKE_COURSE.character },
];

const BASELINE_FACTS = [
  { label: "Distance", value: `${BIKE_PROGRESS.distanceMi} mi` },
  { label: "Moving Time", value: BIKE_PROGRESS.movingTime },
  { label: "Average Speed", value: `${BIKE_PROGRESS.avgSpeedMph} mph` },
  { label: "Average HR", value: `${BIKE_PROGRESS.avgHr} bpm` },
  { label: "Maximum HR", value: `${BIKE_PROGRESS.maxHr} bpm` },
  { label: "Elevation Gain", value: `${BIKE_PROGRESS.elevationFt} ft` },
  { label: "Relative Effort", value: `${BIKE_PROGRESS.relativeEffort}` },
];

/**
 * The "Chattanooga Bike Build" section of /the-race — where training
 * stands today against what the actual 56-mile Chattanooga bike course
 * demands, and the development path between the two. Deliberately kept
 * separate from RaceGoalPanel's competitive/podium race targets (see
 * BIKE_DEVELOPMENT_STAGES's doc comment): this section is about the
 * training path, not a race-pace prediction.
 */
export function ChattanoogaBikeBuild() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COURSE_DEMAND_CARDS.map((card) => (
          <div key={card.label} className="rounded-sm border border-ink/10 bg-off-white p-4 text-center">
            <p className="font-display text-2xl font-semibold text-ink">{card.value}</p>
            <p className="text-xs uppercase tracking-wide text-charcoal-light">{card.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-charcoal-light">
        Repeated climbs from approximately mile 10 through mile 45 make sustained aerobic efficiency and
        disciplined pacing more important than chasing speed on individual sections.
      </p>

      <div className="mt-10">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
          Current Training Ride
        </h3>
        <p className="mt-1 text-xs text-charcoal-light">{BIKE_PROGRESS.date}</p>

        <div className="mt-4 rounded-sm border border-ink/10 bg-off-white p-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {BASELINE_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-ink/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Heart-Rate Distribution
            </p>
            <div className="mt-3 space-y-2">
              {BIKE_HR_ZONES.map((z) => (
                <div key={z.zone} className="flex items-center gap-3 text-xs">
                  <span className="w-6 font-semibold text-ink">{z.zone}</span>
                  <div className="h-2 flex-1 rounded-full bg-ink/10">
                    <div className="h-2 rounded-full bg-bronze" style={{ width: `${z.pct}%` }} />
                  </div>
                  <span className="w-9 text-right text-charcoal-light">{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-charcoal-light">
          This was predominantly a tempo ride rather than an easy aerobic session. The benchmark is useful as a
          starting point for measuring improvements in speed at the same or lower cardiovascular cost.
        </p>
      </div>

      <div className="mt-10">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">Signs of Progress</h3>
        <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-sand-light">
                <th scope="col" className={HEAD_CELL}>Segment</th>
                <th scope="col" className={HEAD_CELL}>Speed</th>
                <th scope="col" className={HEAD_CELL}>Avg HR</th>
              </tr>
            </thead>
            <tbody>
              {BIKE_SEGMENT_HIGHLIGHTS.map((segment) => (
                <tr key={segment.distanceMi} className={ROW}>
                  <th scope="row" className={`${BODY_CELL} font-semibold text-ink`}>
                    {segment.distanceMi} mi
                  </th>
                  <td className={BODY_CELL}>{segment.speedMph.toFixed(1)} mph</td>
                  <td className={BODY_CELL}>{segment.avgHr} bpm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-charcoal-light">
          Individual segments already show the ability to ride above the whole-ride average without extreme
          cardiovascular cost. The next challenge is extending that efficiency across increasingly long, rolling
          terrain.
        </p>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
          Current Fitness <span aria-hidden>&rarr;</span> Development Benchmarks{" "}
          <span aria-hidden>&rarr;</span> <span className="text-bronze">Race Performance Target</span>
        </p>
        <h3 className="mt-2 font-display text-sm font-semibold uppercase tracking-wide text-ink">The Road to 56</h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BIKE_DEVELOPMENT_STAGES.map((stage) => (
            <div
              key={stage.label}
              className={`rounded-sm border p-5 ${
                stage.isCurrent ? "border-bronze/40 bg-bronze/10" : "border-ink/10 bg-off-white"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-widest ${
                  stage.isCurrent ? "text-bronze" : "text-charcoal-light"
                }`}
              >
                {stage.label}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink">
                {stage.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-charcoal-light">
          Speed targets are developmental benchmarks, not prescribed race paces. As training progresses, power
          data, heart rate, terrain, weather, aerodynamics, and the ability to run effectively off the bike should
          carry more weight than average speed alone. The podium bike target above (≤2:15:00) remains the race
          performance goal these benchmarks are building toward.
        </p>
      </div>

      {RACE_INFO.courseInfoUrl && (
        <div className="mt-8">
          <a
            href={RACE_INFO.courseInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
          >
            Explore the Bike Course
            <ExternalLink size={14} aria-hidden />
          </a>
        </div>
      )}
    </div>
  );
}
