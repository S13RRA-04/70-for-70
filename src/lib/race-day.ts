/**
 * Provider-neutral race-day status. No GPS/timing provider is connected
 * yet — `getRaceDayStatus()` currently returns a static "not live" status.
 * When a provider (Garmin, official race timing, etc.) is chosen, replace
 * only this function's implementation; RaceDayStatus and the /live page
 * that consumes it don't need to change.
 */
export interface RaceDaySplit {
  discipline: "swim" | "bike" | "run";
  time: string;
}

export interface RaceDayStatus {
  isLive: boolean;
  currentDiscipline: "swim" | "bike" | "run" | "finished" | null;
  currentMile: number | null;
  totalMiles: number;
  elapsedTime: string | null;
  latestSplit: RaceDaySplit | null;
  mapUrl: string | null;
  lastUpdated: string | null;
}

export async function getRaceDayStatus(): Promise<RaceDayStatus> {
  return {
    isLive: false,
    currentDiscipline: null,
    currentMile: null,
    totalMiles: 70.3,
    elapsedTime: null,
    latestSplit: null,
    mapUrl: null,
    lastUpdated: null,
  };
}
