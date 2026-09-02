import { ChevronDown } from "lucide-react";
import { ComponentStatusBoard } from "@/components/journal/bike-build/component-status-board";
import { StatusBadge } from "@/components/journal/bike-build/status-badge";
import { GEAR_NEEDS_CATEGORIES } from "@/lib/content/gear-needs";

/**
 * Prominent, above-the-fold callout on /sponsors — the exact gear still
 * needed, at a glance, styled to stand out from the plainer sponsor-wall
 * section below it. Each category is a native <details>/<summary>
 * disclosure — collapsible without any client JS, keyboard-operable and
 * screen-reader-announced by default. Open by default so the list stays
 * scannable at a glance; visitors can collapse categories they don't care
 * about. Each row links to the general /contact page (pre-filled with the
 * item), pre-existing and already validated for exactly this kind of
 * general inquiry — not a new dedicated sponsorship-intake form, which
 * stays closed pending written federal ethics approval (see
 * GEAR_NEEDS_CATEGORIES's doc comment and SPONSOR_INQUIRY_INTERESTS).
 */
export function CurrentGearNeeds() {
  return (
    <div className="rounded-sm border-2 border-bronze bg-bronze/5 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Help Make This Possible</p>
      <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-ink sm:text-3xl">
        Current Gear &amp; Support Needs
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-charcoal-light">
        The equipment and support still needed to get to the starting line — updated as items are secured.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-charcoal-light">
        <span className="flex items-center gap-1.5">
          <StatusBadge status="needed" label="Needed" /> essential to safely train and race
        </span>
        <span className="flex items-center gap-1.5">
          <StatusBadge status="wanted" label="Wanted" /> would help, not required
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {GEAR_NEEDS_CATEGORIES.map((category) => (
          <details key={category.category} open className="group rounded-sm border border-ink/10 bg-off-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                {category.category}{" "}
                <span className="font-sans font-normal normal-case text-charcoal-light">
                  ({category.items.length})
                </span>
              </span>
              <ChevronDown
                size={16}
                className="shrink-0 text-charcoal-light transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t border-ink/10 p-4">
              <ComponentStatusBoard
                rows={category.items}
                actionHref={(row) => `/contact?item=${encodeURIComponent(row.component)}`}
                actionLabel="Offer to Help"
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
