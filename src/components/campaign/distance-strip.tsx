import { Waves, Bike, Footprints } from "lucide-react";
import { Container } from "@/components/shared/container";
import { RACE_LEGS, RACE_TOTAL_DISTANCE } from "@/lib/constants";

/**
 * Swim → Bike → Run → Total, at a glance — the leg-distance half of the
 * retired RaceDashboard (see RaceHero for the countdown/event-info half),
 * restyled with the same Waves/Bike/Footprints icon vocabulary
 * TrainingObjectivesChecklist and MediaPlaceholder already use, so the
 * icon language is consistent site-wide rather than invented here.
 */
export function DistanceStrip() {
  const legs = [
    { label: "Swim", distance: RACE_LEGS.swim, Icon: Waves },
    { label: "Bike", distance: RACE_LEGS.bike, Icon: Bike },
    { label: "Run", distance: RACE_LEGS.run, Icon: Footprints },
  ];

  return (
    <section className="border-b border-ink/10 bg-sand-light py-8">
      <Container>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-3">
          {legs.map((leg, i) => (
            <div key={leg.label} className="flex items-center gap-3 sm:gap-3">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <leg.Icon size={22} className="text-bronze" aria-hidden />
                <p className="font-display text-2xl font-semibold text-ink">{leg.distance}</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-charcoal-light">
                  {leg.label} · mi
                </p>
              </div>
              {i < legs.length - 1 && (
                <span aria-hidden="true" className="hidden text-lg text-charcoal-light/40 sm:inline">
                  &rarr;
                </span>
              )}
            </div>
          ))}

          <span aria-hidden="true" className="my-2 text-lg text-charcoal-light/40 sm:mx-1 sm:my-0">
            &rarr;
          </span>

          <div className="flex flex-col items-center gap-1.5 rounded-sm border border-bronze/40 bg-bronze/10 px-6 py-3 text-center">
            <p className="font-display text-3xl font-bold text-ink">{RACE_TOTAL_DISTANCE}</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-bronze">Total · mi</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
