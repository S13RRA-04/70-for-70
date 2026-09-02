import Link from "next/link";
import { formatDateLong } from "@/lib/utils";
import type { JournalEntryRow } from "@/types/database";

/** 2–3 other entries sharing a category, newest-first, excluding the current entry. */
export function RelatedEntries({ entries }: { entries: JournalEntryRow[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-10 border-t border-ink/10 pt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Related Stories</p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/journal/${entry.slug}`}
              className="block rounded-sm border border-ink/10 bg-off-white p-4 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-bronze">{entry.primary_category}</p>
              <h3 className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-ink">
                {entry.title}
              </h3>
              {entry.published_at && (
                <time dateTime={entry.published_at} className="mt-1 block text-xs text-charcoal-light">
                  {formatDateLong(entry.published_at)}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
