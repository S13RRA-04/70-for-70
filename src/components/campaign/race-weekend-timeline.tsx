import { RACE_LOGISTICS } from "@/lib/content/race-logistics";

/**
 * Race-weekend schedule as a day-grouped vertical timeline, replacing the
 * old flat definition-list presentation — see RACE_LOGISTICS.weekendSchedule
 * for the source data (same facts, day-grouped; nothing added or altered).
 */
export function RaceWeekendTimeline() {
  return (
    <div>
      <ol className="space-y-6 border-l-2 border-ink/10 pl-6">
        {RACE_LOGISTICS.weekendSchedule.map((day) => (
          <li key={day.day} className="relative">
            <span
              className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-bronze bg-off-white"
              aria-hidden="true"
            />
            <p className="font-display text-lg font-bold uppercase tracking-tight text-ink">{day.day}</p>
            <div className="mt-2 space-y-2">
              {day.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="text-sm font-semibold text-bronze">{item.time}</span>
                  <span className="text-sm text-charcoal-light">{item.label}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs leading-relaxed text-charcoal-light">
        Check-in is mandatory; there is no race-day check-in, and the bike stays racked in transition overnight.
        Based on recent-year race materials, not IRONMAN&apos;s own athlete guide for 2027 — confirm against the
        official athlete guide once published.
      </p>
    </div>
  );
}
