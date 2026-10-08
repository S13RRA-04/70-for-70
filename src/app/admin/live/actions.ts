"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LiveAuctionItemStatus } from "@/types/database";

const LIST_PATH = "/admin/live";
const PERFORMER_SLOTS = 8;
const AUCTION_SLOTS = 8;

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

function optionalIso(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value.length > 0 ? new Date(value).toISOString() : null;
}

function optionalNumber(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildEventPatch(formData: FormData) {
  return {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    tagline: optionalStr(formData, "tagline"),
    venue_name: optionalStr(formData, "venueName"),
    venue_city: optionalStr(formData, "venueCity"),
    venue_state: optionalStr(formData, "venueState"),
    starts_at: optionalIso(formData, "startsAt"),
    ends_at: optionalIso(formData, "endsAt"),
    description: optionalStr(formData, "description"),
    hero_image_url: optionalStr(formData, "heroImageUrl"),
    ticket_url: optionalStr(formData, "ticketUrl"),
    published: formData.get("published") === "on",
    display_order: optionalNumber(formData, "displayOrder") ?? 0,
  };
}

function buildPerformerRows(formData: FormData, eventId: string) {
  const rows = [];
  for (let i = 1; i <= PERFORMER_SLOTS; i++) {
    const name = str(formData, `performer_name_${i}`);
    if (!name) continue;
    rows.push({
      event_id: eventId,
      name,
      billing: optionalStr(formData, `performer_billing_${i}`),
      bio: optionalStr(formData, `performer_bio_${i}`),
      image_url: optionalStr(formData, `performer_image_url_${i}`),
      display_order: i,
    });
  }
  return rows;
}

function buildAuctionItemRows(formData: FormData, eventId: string) {
  const rows = [];
  for (let i = 1; i <= AUCTION_SLOTS; i++) {
    const title = str(formData, `auction_title_${i}`);
    if (!title) continue;
    const status = str(formData, `auction_status_${i}`) as LiveAuctionItemStatus;
    rows.push({
      event_id: eventId,
      title,
      description: optionalStr(formData, `auction_description_${i}`),
      image_url: optionalStr(formData, `auction_image_url_${i}`),
      starting_bid: optionalNumber(formData, `auction_starting_bid_${i}`),
      bidding_url: optionalStr(formData, `auction_bidding_url_${i}`),
      status: status === "closed" ? "closed" : "open",
      display_order: i,
    });
  }
  return rows;
}

export interface SaveLiveEventState {
  error: string | null;
}

export async function saveLiveEventAction(
  _prevState: SaveLiveEventState,
  formData: FormData,
): Promise<SaveLiveEventState> {
  await requireAdminUser();
  const admin = createAdminClient();

  const id = optionalStr(formData, "id");
  const patch = buildEventPatch(formData);

  if (!patch.title || !patch.slug) {
    return { error: "Title and slug are required." };
  }

  let eventId = id;

  if (id) {
    const { error } = await admin.from("live_events").update(patch).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await admin.from("live_events").insert(patch).select("id").single();
    if (error) return { error: error.message };
    eventId = (data as { id: string }).id;
  }

  if (eventId) {
    const performerRows = buildPerformerRows(formData, eventId);
    const auctionRows = buildAuctionItemRows(formData, eventId);

    await admin.from("live_performers").delete().eq("event_id", eventId);
    if (performerRows.length > 0) {
      await admin.from("live_performers").insert(performerRows);
    }

    await admin.from("live_auction_items").delete().eq("event_id", eventId);
    if (auctionRows.length > 0) {
      await admin.from("live_auction_items").insert(auctionRows);
    }
  }

  revalidatePath(LIST_PATH);
  revalidatePath("/campaigns/live");
  revalidatePath("/campaigns/live/events");
  if (eventId) revalidatePath(`/campaigns/live/${patch.slug}`);
  redirect(LIST_PATH);
}

export async function deleteLiveEventAction(formData: FormData) {
  await requireAdminUser();
  const id = str(formData, "id");
  if (!id) redirect(LIST_PATH);

  const admin = createAdminClient();
  await admin.from("live_events").delete().eq("id", id);

  revalidatePath(LIST_PATH);
  revalidatePath("/campaigns/live");
  revalidatePath("/campaigns/live/events");
  redirect(LIST_PATH);
}
