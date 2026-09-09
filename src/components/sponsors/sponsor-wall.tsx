import type { SponsorRow, SponsorTier } from "@/types/database";
import { SponsorCard } from "./sponsor-card";
import { EmptyState } from "@/components/shared/empty-state";

const TIER_ORDER: SponsorTier[] = ["presenting", "mission", "supporting", "mile", "community"];

const TIER_LABELS: Record<SponsorTier, string> = {
  presenting: "Presenting Sponsors",
  mission: "Mission Sponsors",
  supporting: "Supporting Sponsors",
  mile: "Mile Sponsors",
  community: "Community Partners",
};

export function SponsorWall({ sponsors }: { sponsors: SponsorRow[] }) {
  const tiersWithSponsors = TIER_ORDER.filter((tier) =>
    sponsors.some((s) => s.tier === tier),
  );

  if (tiersWithSponsors.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Commercial Supporters
        </p>
        <div className="mt-3">
          <EmptyState title="No commercial supporters are publicly recognized at this time." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {tiersWithSponsors.map((tier) => (
        <div key={tier}>
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
            {TIER_LABELS[tier]}
          </p>
          {/* Presenting is a single standout sponsor, not a wall — kept at a fixed
              display size rather than stretching to fill the widened container.
              Every other tier uses a responsive auto-fit grid so any number of
              logos lays out proportionally across the available width instead of
              being locked to a fixed column count per tier. */}
          {tier === "presenting" ? (
            <div className="mt-3 max-w-sm">
              {sponsors
                .filter((s) => s.tier === tier)
                .map((sponsor) => (
                  <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center gap-4">
              {sponsors
                .filter((s) => s.tier === tier)
                .map((sponsor) => (
                  <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
