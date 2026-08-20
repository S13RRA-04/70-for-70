import { Countdown } from "@/components/shared/countdown";
import { RACE_INFO, RACE_LEGS, RACE_TOTAL_DISTANCE } from "@/lib/constants";

const LEGS = [
  { label: "Swim", distance: RACE_LEGS.swim },
  { label: "Bike", distance: RACE_LEGS.bike },
  { label: "Run", distance: RACE_LEGS.run },
];

/**
 * Reusable race dashboard — distance-per-leg + total, plus event date
 * (countdown), location, and goal time where those are confirmed. Every
 * event-info field is independently null-guarded (see RACE_INFO in
 * constants.ts) so an unconfirmed field hides rather than showing a blank.
 */
export function RaceDashboard() {
  const hasEventInfo =
    RACE_INFO.raceDate || RACE_INFO.raceLocation || RACE_INFO.athleteGoalTime || RACE_INFO.courseInfoUrl;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-4">
        {LEGS.map((leg) => (
          <div key={leg.label} className="rounded-sm border border-ink/10 bg-off-white p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              {leg.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">{leg.distance}</p>
            <p className="text-xs text-charcoal-light">miles</p>
          </div>
        ))}
        <div className="rounded-sm border border-bronze/40 bg-bronze/10 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Total</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{RACE_TOTAL_DISTANCE}</p>
          <p className="text-xs text-bronze">miles</p>
        </div>
      </div>

      {hasEventInfo && (
        <div className="mt-8 rounded-sm border border-ink/10 bg-off-white p-8">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
            Race Day Countdown
          </h2>

          {RACE_INFO.raceDate && (
            <div className="mt-5">
              <Countdown targetIso={RACE_INFO.raceDate} />
            </div>
          )}

          {(RACE_INFO.raceLocation || RACE_INFO.athleteGoalTime || RACE_INFO.courseInfoUrl) && (
            <dl className="mt-8 space-y-4 text-sm">
              {RACE_INFO.raceLocation && (
                <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                  <dt className="font-medium text-charcoal-light">Race Location</dt>
                  <dd className="text-right text-ink">{RACE_INFO.raceLocation}</dd>
                </div>
              )}
              {RACE_INFO.athleteGoalTime && (
                <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                  <dt className="font-medium text-charcoal-light">Athlete Goal Time</dt>
                  <dd className="text-right text-ink">{RACE_INFO.athleteGoalTime}</dd>
                </div>
              )}
              {RACE_INFO.courseInfoUrl && (
                <div className="flex justify-between gap-4 border-t border-ink/10 pt-4">
                  <dt className="font-medium text-charcoal-light">Course Information</dt>
                  <dd className="text-right text-ink">
                    <a href={RACE_INFO.courseInfoUrl} className="text-bronze hover:underline">
                      View course details
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
