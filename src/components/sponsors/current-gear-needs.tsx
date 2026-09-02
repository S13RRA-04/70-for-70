import { ComponentStatusBoard } from "@/components/journal/bike-build/component-status-board";
import { GEAR_NEEDS } from "@/lib/content/gear-needs";

/**
 * Prominent, above-the-fold callout on /sponsors — the exact gear still
 * needed, at a glance, styled to stand out from the plainer sponsor-wall
 * section below it. Informational only — see GEAR_NEEDS's doc comment for
 * why there's no contact CTA attached here.
 */
export function CurrentGearNeeds() {
  return (
    <div className="rounded-sm border-2 border-bronze bg-bronze/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Help Make This Possible</p>
      <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-ink sm:text-3xl">
        Current Gear Needs
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
        The equipment still needed to get to the starting line — updated as items are secured.
      </p>
      <div className="mt-6">
        <ComponentStatusBoard rows={GEAR_NEEDS} />
      </div>
    </div>
  );
}
