import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { Container } from "@/components/shared/container";
import { LiveEventForm } from "../live-event-form";

export default async function NewLiveEventPage() {
  await requireAdminUser();

  return (
    <Container className="max-w-3xl py-16">
      <Link href="/admin/live" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
        &larr; Back to For The 22: Live
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">New Live Event</h1>
      <LiveEventForm />
    </Container>
  );
}
