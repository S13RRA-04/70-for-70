const STRAVA_ATHLETE_ID = "99955843";
const STRAVA_WIDGET_HASH = "0cf94d374a36722d17add5ddb5d141a42db0fd43";

/**
 * Official Strava embeddable widgets (see Strava's own embed generator) —
 * an iframe pointed at strava.com, not an API integration, so there's no
 * token/client to manage here. "Latest rides" is cycling-only (Strava
 * doesn't offer a combined swim/bike/run widget), so it's labeled as such
 * rather than implying it covers all training.
 */
export function StravaWidget() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="overflow-hidden rounded-sm border border-ink/10">
        <iframe
          height="160"
          width="300"
          frameBorder="0"
          allowTransparency
          scrolling="no"
          title="Strava activity summary"
          src={`https://www.strava.com/athletes/${STRAVA_ATHLETE_ID}/activity-summary/${STRAVA_WIDGET_HASH}`}
          loading="lazy"
        />
      </div>
      <div className="overflow-hidden rounded-sm border border-ink/10">
        <iframe
          height="454"
          width="300"
          frameBorder="0"
          allowTransparency
          scrolling="no"
          title="Strava latest rides"
          src={`https://www.strava.com/athletes/${STRAVA_ATHLETE_ID}/latest-rides/${STRAVA_WIDGET_HASH}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
