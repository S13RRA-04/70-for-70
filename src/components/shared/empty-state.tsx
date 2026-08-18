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
}: {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-sm border border-dashed border-ink/20 bg-off-white p-8 text-center">
      <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
        {title}
      </p>
      {description && <p className="mt-2 text-sm text-charcoal-light">{description}</p>}
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex rounded-sm bg-bronze px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
