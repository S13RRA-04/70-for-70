"use client";

import { useActionState } from "react";
import { saveLiveEventAction, type SaveLiveEventState } from "./actions";
import type { LiveAuctionItemRow, LiveEventRow, LivePerformerRow } from "@/types/database";

const PERFORMER_SLOTS = 8;
const AUCTION_SLOTS = 8;

/** Local datetime-local input needs "YYYY-MM-DDTHH:mm", not a full ISO string with seconds/offset. */
function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function LiveEventForm({
  event,
  performers,
  auctionItems,
}: {
  event?: LiveEventRow;
  performers?: LivePerformerRow[];
  auctionItems?: LiveAuctionItemRow[];
}) {
  const [state, formAction] = useActionState<SaveLiveEventState, FormData>(saveLiveEventAction, { error: null });

  const performerSlots = Array.from({ length: PERFORMER_SLOTS }, (_, i) => performers?.[i]);
  const auctionSlots = Array.from({ length: AUCTION_SLOTS }, (_, i) => auctionItems?.[i]);

  return (
    <form action={formAction} className="mt-8 space-y-8">
      {event && <input type="hidden" name="id" value={event.id} />}

      {state.error && (
        <p role="alert" className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-ink">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={event?.title}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-ink">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={event?.slug}
            placeholder="chattanooga-benefit-show"
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tagline" className="text-sm font-medium text-ink">Tagline</label>
        <input
          id="tagline"
          name="tagline"
          type="text"
          defaultValue={event?.tagline ?? ""}
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="venueName" className="text-sm font-medium text-ink">Venue Name</label>
          <input
            id="venueName"
            name="venueName"
            type="text"
            defaultValue={event?.venue_name ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="venueCity" className="text-sm font-medium text-ink">City</label>
          <input
            id="venueCity"
            name="venueCity"
            type="text"
            defaultValue={event?.venue_city ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="venueState" className="text-sm font-medium text-ink">State</label>
          <input
            id="venueState"
            name="venueState"
            type="text"
            defaultValue={event?.venue_state ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startsAt" className="text-sm font-medium text-ink">Starts At</label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toLocalInputValue(event?.starts_at ?? null)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="endsAt" className="text-sm font-medium text-ink">Ends At</label>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toLocalInputValue(event?.ends_at ?? null)}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-ink">Description (Markdown)</label>
        <textarea
          id="description"
          name="description"
          rows={8}
          defaultValue={event?.description ?? ""}
          className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 font-mono text-sm text-ink"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="heroImageUrl" className="text-sm font-medium text-ink">Hero Image URL</label>
          <input
            id="heroImageUrl"
            name="heroImageUrl"
            type="url"
            defaultValue={event?.hero_image_url ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="ticketUrl" className="text-sm font-medium text-ink">Ticket URL</label>
          <input
            id="ticketUrl"
            name="ticketUrl"
            type="url"
            defaultValue={event?.ticket_url ?? ""}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="published"
            defaultChecked={event?.published ?? false}
            className="h-4 w-4 accent-bronze"
          />
          Published (visible on /campaigns/live)
        </label>
        <div>
          <label htmlFor="displayOrder" className="text-sm font-medium text-ink">Display Order</label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            step="1"
            defaultValue={event?.display_order ?? 0}
            className="mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <fieldset className="rounded-sm border border-ink/10 p-5">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-ink">Performers</legend>
        <div className="mt-4 space-y-4">
          {performerSlots.map((performer, i) => (
            <div key={i} className="grid gap-3 border-b border-ink/5 pb-4 last:border-0 last:pb-0 sm:grid-cols-5">
              <input
                name={`performer_name_${i + 1}`}
                type="text"
                placeholder="Name"
                defaultValue={performer?.name ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <input
                name={`performer_billing_${i + 1}`}
                type="text"
                placeholder="Billing (e.g. Headliner)"
                defaultValue={performer?.billing ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <input
                name={`performer_bio_${i + 1}`}
                type="text"
                placeholder="Bio"
                defaultValue={performer?.bio ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink sm:col-span-2"
              />
              <input
                name={`performer_image_url_${i + 1}`}
                type="url"
                placeholder="Photo URL"
                defaultValue={performer?.image_url ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-sm border border-ink/10 p-5">
        <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-ink">Auction Items</legend>
        <div className="mt-4 space-y-4">
          {auctionSlots.map((item, i) => (
            <div key={i} className="grid gap-3 border-b border-ink/5 pb-4 last:border-0 last:pb-0 sm:grid-cols-6">
              <input
                name={`auction_title_${i + 1}`}
                type="text"
                placeholder="Title"
                defaultValue={item?.title ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <input
                name={`auction_description_${i + 1}`}
                type="text"
                placeholder="Description"
                defaultValue={item?.description ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink sm:col-span-2"
              />
              <input
                name={`auction_image_url_${i + 1}`}
                type="url"
                placeholder="Image URL"
                defaultValue={item?.image_url ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <input
                name={`auction_starting_bid_${i + 1}`}
                type="number"
                step="0.01"
                min="0"
                placeholder="Starting Bid"
                defaultValue={item?.starting_bid ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <input
                name={`auction_bidding_url_${i + 1}`}
                type="url"
                placeholder="Bidding URL"
                defaultValue={item?.bidding_url ?? ""}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              />
              <select
                name={`auction_status_${i + 1}`}
                defaultValue={item?.status ?? "open"}
                className="rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="rounded-sm bg-bronze-text px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-dark"
      >
        Save Event
      </button>
    </form>
  );
}
