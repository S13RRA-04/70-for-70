import type { JournalEntryRow } from "@/types/database";

const KIND_LABELS: Record<NonNullable<JournalEntryRow["milestone_kind"]>, string> = {
  fundraising: "Fundraising Milestone",
  training: "Training Milestone",
};

/** Big-number layout for post_type = "milestone" — shareable, headline-first treatment. */
export function MilestoneHeadline({ entry }: { entry: JournalEntryRow }) {
  if (!entry.milestone_value) return null;

  return (
    <div className="mt-8 rounded-sm border border-bronze/30 bg-bronze/10 px-6 py-8 text-center">
      {entry.milestone_kind && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">{KIND_LABELS[entry.milestone_kind]}</p>
      )}
      <p className="mt-2 text-balance font-display text-4xl font-semibold uppercase tracking-tight text-ink sm:text-5xl">
        {entry.milestone_value}
      </p>
    </div>
  );
}
