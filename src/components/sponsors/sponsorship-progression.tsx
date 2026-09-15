import { MISSION_PARTNER_TIERS } from "@/lib/constants";

/** Simple, generic jersey silhouette — not a real race-kit render or any sponsor's actual logo. */
function RaceKitSilhouette() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0" aria-hidden="true">
      <path
        d="M35 12 L20 24 L28 38 L38 32 V104 H82 V32 L92 38 L100 24 L85 12 C85 20 75 26 60 26 C45 26 35 20 35 12 Z"
        className="fill-off-white/10 stroke-bronze-light"
        strokeWidth={2}
      />
      <rect x="46" y="46" width="28" height="28" rx="2" className="fill-none stroke-bronze-light/70" strokeDasharray="4 3" />
    </svg>
  );
}

/**
 * The sponsorship ladder as a road/milestone progression rather than
 * identical pricing cards — see the spec's "movement, endurance, milestones"
 * framing. Ascending order (lowest tier → Presenting Partner → the race
 * itself), horizontal on desktop, stacked on mobile. Presenting Partner
 * gets a visually distinct, larger treatment; the rest share a compact
 * connected-step style.
 */
export function SponsorshipProgression() {
  const ascending = [...MISSION_PARTNER_TIERS].reverse();
  const presenting = ascending[ascending.length - 1];
  const steps = ascending.slice(0, -1);

  return (
    <div>
      <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
        {steps.map((tier) => (
          <div key={tier.id} className="flex flex-col lg:flex-1">
            <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-5">
              <p className="font-display text-base font-bold uppercase tracking-wide text-ink">{tier.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-bronze">{tier.range}</p>
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-charcoal-light">
                {tier.benefits.slice(0, 2).map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
            {/* Connector: vertical on mobile, horizontal on desktop */}
            <div
              className="mx-auto h-6 w-px bg-bronze/40 lg:mx-0 lg:h-px lg:w-6 lg:self-center"
              aria-hidden="true"
            />
          </div>
        ))}

        {/* Presenting Partner — the premium destination step */}
        <div className="flex flex-col rounded-sm border-2 border-bronze bg-ink p-6 text-off-white lg:flex-1">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-off-white">
            {presenting.name}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-bronze-light">{presenting.range}</p>
          <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-bronze-light">
            Go All the Way to Chattanooga.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <RaceKitSilhouette />
            <p className="text-sm leading-relaxed text-off-white/80">
              Premier campaign recognition culminating in your organization&apos;s logo appearing on the Tri
              For the 22 race kit at IRONMAN 70.3 Chattanooga.
            </p>
          </div>

          <ul className="mt-4 space-y-1 text-xs leading-relaxed text-off-white/70">
            {presenting.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          {"note" in presenting && presenting.note && (
            <p className="mt-4 text-xs leading-relaxed text-off-white/60">{presenting.note}</p>
          )}
        </div>

        <div className="mx-auto h-6 w-px bg-bronze/40 lg:mx-0 lg:h-px lg:w-6 lg:self-center" aria-hidden="true" />

        {/* Endpoint */}
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-bronze/60 bg-bronze/5 p-6 text-center lg:w-52 lg:shrink-0">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-ink">Chattanooga</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">70.3</p>
        </div>
      </div>
    </div>
  );
}
