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

const TIER_GRID: Record<SponsorTier, string> = {
  presenting: "sm:grid-cols-1",
  mission: "sm:grid-cols-2",
  supporting: "sm:grid-cols-3",
  mile: "sm:grid-cols-4",
  community: "sm:grid-cols-4",
};

export function SponsorWall({ sponsors }: { sponsors: SponsorRow[] }) {
  const tiersWithSponsors = TIER_ORDER.filter((tier) =>
    sponsors.some((s) => s.tier === tier),
  );

  if (tiersWithSponsors.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-bronze">
          Founding Sponsors
        </p>
        <div className="mt-3">
          <EmptyState
            title="We're currently building the first group of organizations backing 70 for 70."
            cta={{ label: "Request to Sponsor", href: "/sponsors/request" }}
          />
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
          <div className={`mt-3 grid grid-cols-2 gap-4 ${TIER_GRID[tier]}`}>
            {sponsors
              .filter((s) => s.tier === tier)
              .map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
