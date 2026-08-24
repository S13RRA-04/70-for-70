import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { cn, formatDateLong } from "@/lib/utils";
import { deleteJournalEntryAction } from "./actions";
import type { JournalEntryRow, JournalStatus } from "@/types/database";

const STATUS_STYLES: Record<JournalStatus, string> = {
  draft: "border-ink/20 text-charcoal-light",
  scheduled: "border-bronze/40 bg-bronze/10 text-bronze",
  published: "border-olive/40 bg-olive/10 text-olive-dark",
};

export default async function JournalAdminPage() {
  await requireAdminUser();

  const admin = createAdminClient();
  const { data, error } = await admin.from("journal_entries").select("*").order("created_at", { ascending: false });
  const entries = (data ?? []) as JournalEntryRow[];

  return (
    <Container className="max-w-6xl py-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
            &larr; Back to Overview
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Journal</h1>
        </div>
        <Link
          href="/admin/journal/new"
          className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          New Entry
        </Link>
      </div>

      {error && <p className="mt-6 text-sm font-medium text-red-700">Failed to load journal entries.</p>}

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand-light text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-ink/5 last:border-0 hover:bg-sand-light/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/journal/${entry.id}/edit`} className="font-medium text-ink hover:text-bronze">
                    {entry.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal-light">{entry.post_type}</td>
                <td className="px-4 py-3 text-charcoal-light">{entry.primary_category}</td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide", STATUS_STYLES[entry.status])}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-charcoal-light">
                  {entry.published_at ? formatDateLong(entry.published_at) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/journal/${entry.id}/edit`} className="text-xs font-semibold uppercase tracking-wide text-bronze hover:underline">
                      Edit
                    </Link>
                    <form action={deleteJournalEntryAction}>
                      <input type="hidden" name="id" value={entry.id} />
                      <button type="submit" className="text-xs font-semibold uppercase tracking-wide text-red-700 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && <p className="p-6 text-sm text-charcoal-light">No journal entries yet.</p>}
      </div>
    </Container>
  );
}
