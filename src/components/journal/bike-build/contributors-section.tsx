import type { BikeBuildContributor } from "@/types/bike-build";

/**
 * Text-only acknowledgment cards — no logos yet. Each card is structured
 * so a `logoUrl`/`logoAlt` pair could be added to BikeBuildContributor and
 * rendered here later without any layout change; see the type's doc
 * comment and the project README.
 */
function ContributorCard({ contributor, dashed = false }: { contributor: BikeBuildContributor; dashed?: boolean }) {
  return (
    <div
      className={
        dashed
          ? "rounded-sm border border-dashed border-ink/20 p-5"
          : "rounded-sm border border-ink/10 bg-off-white p-5"
      }
    >
      <p className="font-display text-base font-semibold uppercase tracking-wide text-ink">{contributor.name}</p>
      <p className={dashed ? "mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light" : "mt-1 text-xs font-semibold uppercase tracking-widest text-bronze"}>
        {contributor.role}
      </p>
      <p className="mt-2 text-sm text-charcoal-light">{contributor.note}</p>
    </div>
  );
}

export function ContributorsSection({
  confirmed,
  inProgress,
}: {
  confirmed: BikeBuildContributor[];
  inProgress: BikeBuildContributor[];
}) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink">Confirmed Support</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {confirmed.map((contributor) => (
            <ContributorCard key={contributor.name} contributor={contributor} />
          ))}
        </div>
      </div>

      {inProgress.length > 0 && (
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal-light">
            Conversations in Progress
          </h3>
          <p className="mt-1 text-sm text-charcoal-light">
            Not yet confirmed support — listed here so nothing above reads as a locked-in sponsorship before it
            actually is one.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {inProgress.map((contributor) => (
              <ContributorCard key={contributor.name} contributor={contributor} dashed />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
