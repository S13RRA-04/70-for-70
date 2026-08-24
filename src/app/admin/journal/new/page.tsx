import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { getPartners } from "@/lib/data/partners";
import { Container } from "@/components/shared/container";
import { JournalEntryForm } from "../journal-entry-form";

export default async function NewJournalEntryPage() {
  await requireAdminUser();
  const partners = await getPartners();

  return (
    <Container className="max-w-3xl py-16">
      <Link href="/admin/journal" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
        &larr; Back to Journal
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">New Journal Entry</h1>
      <JournalEntryForm partners={partners} />
    </Container>
  );
}
