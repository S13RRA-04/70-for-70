import Link from "next/link";
import { AWARENESS_CALENDAR, getNextOccurrence, getUpcomingEntries } from "@/lib/content/awareness-calendar";

/**
 * The next few awareness observances with a link to the full calendar.
 * Renders nothing when there are none upcoming. Moved off the homepage onto
 * the /campaigns (Mobilization) hub, where people decide how to take part.
 */
export function UpcomingObservances({ limit = 3 }: { limit?: number }) {
  const upcoming = getUpcomingEntries(AWARENESS_CALENDAR, limit);
  if (upcoming.length === 0) return null;

  return (
    <section aria-labelledby="observances-heading" className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-start gap-x-[72px] gap-y-8 px-6 py-16 sm:py-20">
        <div className="flex flex-[1_1_320px] flex-col gap-3">
          <span className="label-caps text-olive">Awareness calendar</span>
          <h2 id="observances-heading" className="font-display text-5xl uppercase leading-none text-navy">
            Days we pause to recognize.
          </h2>
          <Link href="/awareness" className="mt-2 font-bold text-navy hover:text-help hover:underline">
            Full calendar →
          </Link>
        </div>
        <ol className="min-w-0 flex-[999_1_560px] border-t border-line">
          {upcoming.map((entry) => {
            // getUpcomingEntries only returns entries with a next occurrence.
            const next = getNextOccurrence(entry);
            if (!next) return null;
            const when = new Intl.DateTimeFormat("en-US", {
              month: "short",
              ...(entry.dateRule.type !== "month" && { day: "numeric" }),
            }).format(next.date);
            return (
              <li key={entry.slug} className="border-b border-line">
                <Link
                  href={`/awareness/${entry.slug}`}
                  className="flex items-baseline gap-6 py-5 font-bold text-navy hover:text-help hover:underline"
                >
                  <span className="min-w-24 font-display text-[26px] font-normal uppercase leading-none text-olive">
                    {when}
                  </span>
                  <span className="flex-1">{entry.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
