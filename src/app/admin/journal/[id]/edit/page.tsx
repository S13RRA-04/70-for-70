import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { JournalEntryForm } from "../../journal-entry-form";
import type { JournalEntryRow } from "@/types/database";

export default async function EditJournalEntryPage(props: PageProps<"/admin/journal/[id]/edit">) {
  await requireAdminUser();
  const { id } = await props.params;

  const admin = createAdminClient();
  const [{ data: entry }, partners, { data: partnerMentions }, { data: beneficiaryMentions }] = await Promise.all([
    admin.from("journal_entries").select("*").eq("id", id).single(),
    getPartners(),
    admin.from("journal_entry_partner_mentions").select("partner_id").eq("journal_entry_id", id),
    admin.from("journal_entry_beneficiary_mentions").select("partner_id").eq("journal_entry_id", id),
  ]);

  if (!entry) notFound();

  return (
    <Container className="max-w-3xl py-16">
      <Link href="/admin/journal" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
        &larr; Back to Journal
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Edit Journal Entry</h1>
      <JournalEntryForm
        entry={entry as JournalEntryRow}
        partners={partners}
        partnerMentionIds={(partnerMentions ?? []).map((r) => r.partner_id)}
        beneficiaryMentionIds={(beneficiaryMentions ?? []).map((r) => r.partner_id)}
      />
    </Container>
  );
}
