/**
 * Race-day course and cutoff details for IRONMAN 70.3 Chattanooga, compiled
 * from a third-party race-guide summary — not IRONMAN's own athlete guide,
 * which hadn't been published for the 2027 race at the time this was
 * written. Treat specifics (cutoff times, elevation, aid-station spacing)
 * as "recent-year reference," not confirmed for 2027 — re-check against
 * the official athlete guide once IRONMAN publishes it. See RACE_INFO
 * (constants.ts) for the confirmed date/location/registration link.
 */

export const RACE_LOGISTICS = {
  swim: {
    description:
      "Point-to-point, downstream in the Tennessee River. Start is roughly 1.4 miles upriver of Ross's Landing; athletes exit at Ross's Landing Park.",
    cutoff: "1:20 (from swim start)",
  },
  transitionAccess: {
    description: "Race-morning transition area access.",
    window: "4:30–6:15 AM",
  },
  bike: {
    description:
      "Single loop from Ross's Landing through St. Elmo, Highway 193, West Cove Road, and Chickamauga/Highway 341. Rolling terrain with repeated climbs from roughly mile 10 to mile 45 — no extended recovery sections.",
    elevationGain: "2,218 ft",
    intermediateCutoff: "Mile 30.4 by 11:55 AM",
    overallCutoff: "5:30 (total elapsed race time)",
    aidStations: "Every 12–15 miles — water, hydration drink, gels, bars, bananas.",
  },
  run: {
    description:
      "2.25-lap course along the Riverwalk, across Veterans Bridge, and through the Northshore neighborhood.",
    elevationGain: "627 ft",
    intermediateCutoff: "Mile 6.8",
    overallCutoff: "8:30 (total elapsed race time)",
    aidStations: "Roughly every mile — water, hydration drink, cola, gels, bars, fruit.",
  },
  /**
   * Day-grouped for the Race Weekend timeline (see RaceWeekendTimeline) —
   * check-in is mandatory with no race-day check-in, and the bike stays
   * racked in transition overnight once checked in.
   */
  weekendSchedule: [
    {
      day: "Friday",
      items: [{ time: "2:00 PM–7:00 PM", label: "Athlete Check-In" }],
    },
    {
      day: "Saturday",
      items: [
        { time: "9:00 AM–4:00 PM", label: "Athlete Check-In" },
        { time: "10:00 AM–5:00 PM", label: "Bike Check-In" },
      ],
    },
    {
      day: "Sunday — Race Day",
      items: [{ time: "4:30 AM–6:15 AM", label: "Transition Access" }],
    },
  ],
} as const;
