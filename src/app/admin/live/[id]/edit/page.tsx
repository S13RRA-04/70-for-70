import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { LiveEventForm } from "../../live-event-form";
import type { LiveAuctionItemRow, LiveEventRow, LivePerformerRow } from "@/types/database";

export default async function EditLiveEventPage(props: PageProps<"/admin/live/[id]/edit">) {
  await requireAdminUser();
  const { id } = await props.params;

  const admin = createAdminClient();
  const [{ data: event }, { data: performers }, { data: auctionItems }] = await Promise.all([
    admin.from("live_events").select("*").eq("id", id).maybeSingle(),
    admin.from("live_performers").select("*").eq("event_id", id).order("display_order", { ascending: true }),
    admin.from("live_auction_items").select("*").eq("event_id", id).order("display_order", { ascending: true }),
  ]);

  if (!event) notFound();

  return (
    <Container className="max-w-3xl py-16">
      <Link href="/admin/live" className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
        &larr; Back to For The 22: Live
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Edit Live Event</h1>
      <LiveEventForm
        event={event as LiveEventRow}
        performers={(performers ?? []) as LivePerformerRow[]}
        auctionItems={(auctionItems ?? []) as LiveAuctionItemRow[]}
      />
    </Container>
  );
}
