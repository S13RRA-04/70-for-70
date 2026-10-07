import Link from "next/link";

/**
 * Standard "nothing here yet" treatment. Used instead of publishing
 * TODO/placeholder text on production-facing pages — see README's
 * "Eliminating Placeholder Content" section.
 */
export function EmptyState({
  title,
  description,
  cta,
  onAction,
}: {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  /** For a "clear filters"-style recovery action that resets state rather than navigates — `cta` is for the latter. Rendered alongside `cta` if both are given. */
  onAction?: { label: string; onClick: () => void };
}) {
  return (
    <div className="rounded-sm border border-dashed border-ink/20 bg-off-white p-8 text-center">
      <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
        {title}
      </p>
      {description && <p className="mt-2 text-sm text-charcoal-light">{description}</p>}
      {(cta || onAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {onAction && (
            <button
              type="button"
              onClick={onAction.onClick}
              className="inline-flex rounded-sm border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
            >
              {onAction.label}
            </button>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex rounded-sm bg-bronze-text px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
