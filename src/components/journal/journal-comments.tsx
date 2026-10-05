import { JournalCommentForm } from "@/components/forms/journal-comment-form";
import { formatDateLong } from "@/lib/utils";
import type { JournalCommentRow } from "@/types/database";

/** Approved comments for one journal entry, plus the submission form. A new comment only appears here once approved at /admin/journal-comments — see JournalCommentForm's doc comment. */
export function JournalComments({
  journalEntryId,
  comments,
}: {
  journalEntryId: string;
  comments: JournalCommentRow[];
}) {
  return (
    <div className="mt-10 border-t border-ink/10 pt-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        {comments.length > 0 ? `${comments.length} Comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </p>

      {comments.length > 0 && (
        <ul className="mt-5 space-y-5">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-sm border border-ink/10 bg-off-white p-4">
              <p className="text-sm leading-relaxed text-ink">{comment.body}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                {comment.name} <span className="font-normal normal-case">&middot; {formatDateLong(comment.submitted_at)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Leave a Comment</p>
        <JournalCommentForm journalEntryId={journalEntryId} />
      </div>
    </div>
  );
}
