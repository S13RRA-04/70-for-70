import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn, formatDateLong } from "@/lib/utils";
import { JOURNAL_PLACEHOLDER_IMAGE } from "@/lib/constants";
import type { JournalEntryRow } from "@/types/database";

interface JournalCardProps {
  entry: JournalEntryRow;
  /** Larger editorial treatment for the newest/pinned entry at the top of the feed — image and content sit side by side on wider screens. */
  featured?: boolean;
  className?: string;
}

export function JournalCard({ entry, featured = false, className }: JournalCardProps) {
  const isMilestone = entry.post_type === "milestone";
  const hasPhoto = Boolean(entry.image_url);

  return (
    <Link
      href={`/journal/${entry.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-off-white transition-shadow hover:shadow-md",
        featured && "sm:flex-row",
        className,
      )}
    >
      <div className={cn("relative aspect-[16/9] w-full shrink-0 bg-sand-light", featured && "sm:w-1/2")}>
        <Image
          src={entry.image_url ?? JOURNAL_PLACEHOLDER_IMAGE}
          alt={entry.title}
          fill
          priority={featured}
          // The placeholder is a round crest, not a wide photo — object-cover
          // crops its top/bottom off to fill the 16:9 frame. Only a real
          // photo (which is actually shot at this aspect ratio) should crop.
          className={hasPhoto ? "object-cover" : "object-contain p-6"}
          sizes={featured ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        />

        {entry.post_type === "vlog" && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
            <span className={cn("flex items-center justify-center rounded-full bg-off-white/90 text-ink", featured ? "h-14 w-14" : "h-12 w-12")}>
              <Play size={featured ? 24 : 20} fill="currentColor" aria-hidden />
            </span>
          </div>
        )}

        {entry.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-bronze px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-off-white">
            Featured
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-5", featured && "sm:justify-center sm:p-8")}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bronze">
          <span>{entry.primary_category}</span>
          {entry.published_at && (
            <>
              <span aria-hidden>&middot;</span>
              <time dateTime={entry.published_at}>{formatDateLong(entry.published_at)}</time>
            </>
          )}
        </div>
        <h3
          className={cn(
            "mt-2 font-display font-semibold uppercase tracking-wide text-ink group-hover:text-bronze",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {entry.title}
        </h3>
        {isMilestone && entry.milestone_value ? (
          <p className={cn("mt-2 flex-1 font-display font-semibold tabular-nums text-ink", featured ? "text-3xl" : "text-2xl")}>
            {entry.milestone_value}
          </p>
        ) : (
          <p className={cn("mt-2 flex-1 text-charcoal-light", featured ? "text-base" : "text-sm")}>{entry.summary}</p>
        )}
        <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-bronze">
          {entry.post_type === "vlog" ? "Watch Update →" : "Read Update →"}
        </span>
      </div>
    </Link>
  );
}
