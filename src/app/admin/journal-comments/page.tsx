import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn, formatDateLong } from "@/lib/utils";
import {
  approveJournalCommentAction,
  deleteJournalCommentAction,
  unapproveJournalCommentAction,
} from "./actions";

const FILTERS: { value: "all" | "pending" | "approved"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Awaiting Review" },
  { value: "approved", label: "Approved" },
];

interface JournalCommentWithEntry {
  id: string;
  name: string;
  email: string | null;
  body: string;
  approved: boolean;
  submitted_at: string;
  journal_entries: { title: string; slug: string } | null;
}

export default async function JournalCommentsAdminPage(props: PageProps<"/admin/journal-comments">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams.filter) ? searchParams.filter[0] : searchParams.filter;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;
  const activeFilter = (filterParam ?? "pending") as "all" | "pending" | "approved";

  const admin = createAdminClient();

  let query = admin
    .from("journal_comments")
    .select("id, name, email, body, approved, submitted_at, journal_entries(title, slug)")
    .order("submitted_at", { ascending: false });
  if (activeFilter === "pending") query = query.eq("approved", false);
  if (activeFilter === "approved") query = query.eq("approved", true);

  const { data, error } = await query;
  const comments = (data ?? []) as unknown as JournalCommentWithEntry[];

  return (
    <Container className="max-w-5xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Journal Comments</h1>
        <Link
          href="/admin"
          className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
        >
          Back to Overview
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        Visitor comments submitted on individual journal entries. Approving a comment is what makes
        it public on that post — nothing shows up there until you review it here.
      </p>

      {errorParam && (
        <p role="alert" className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "pending" ? "/admin/journal-comments" : `/admin/journal-comments?filter=${f.value}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              activeFilter === f.value
                ? "border-ink bg-ink text-off-white"
                : "border-ink/20 text-charcoal hover:border-ink/40",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {error && <p className="mt-6 text-sm font-medium text-red-700">Failed to load comments.</p>}

      <div className="mt-6 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-sm border border-ink/10 bg-off-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">
                  {comment.name}
                  {comment.email && <span className="ml-2 text-xs text-charcoal-light">{comment.email}</span>}
                </p>
                <p className="text-xs text-charcoal-light">
                  {formatDateLong(comment.submitted_at)}
                  {comment.journal_entries && (
                    <>
                      {" "}
                      &middot; on{" "}
                      <Link href={`/journal/${comment.journal_entries.slug}`} className="font-semibold text-bronze hover:text-bronze-dark">
                        {comment.journal_entries.title}
                      </Link>
                    </>
                  )}
                </p>
              </div>
              {comment.approved ? (
                <span className="rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-olive">
                  Approved
                </span>
              ) : (
                <span className="rounded-full border border-ink/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                  Pending
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink">&ldquo;{comment.body}&rdquo;</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {comment.approved ? (
                <form action={unapproveJournalCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button
                    type="submit"
                    className="rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
                  >
                    Hide From Post
                  </button>
                </form>
              ) : (
                <form action={approveJournalCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button
                    type="submit"
                    className="rounded-sm bg-bronze-text px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
                  >
                    Approve
                  </button>
                </form>
              )}
              <form action={deleteJournalCommentAction}>
                <input type="hidden" name="id" value={comment.id} />
                <button
                  type="submit"
                  className="rounded-sm border border-red-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="rounded-sm border border-dashed border-ink/20 p-6 text-sm text-charcoal-light">
            No comments match this filter.
          </p>
        )}
      </div>
    </Container>
  );
}
