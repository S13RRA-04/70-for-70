import { createPublicClient } from "@/lib/supabase/public";
import { logServerError } from "@/lib/log";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_LIVE_EVENTS } from "./seed-data";
import type { LiveAuctionItemRow, LiveEventRow, LivePerformerRow } from "@/types/database";

/** Every published "For The 22: Live" show, soonest first. Empty (not fabricated) until a real show is announced — see SEED_LIVE_EVENTS. */
export async function getPublishedLiveEvents(): Promise<LiveEventRow[]> {
  if (!isSupabaseConfigured()) {
    return SEED_LIVE_EVENTS.filter((e) => e.published);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("live_events")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: true });

  if (error || !data) {
    logServerError("data.live-events: load failed, using seed", error);
    return SEED_LIVE_EVENTS.filter((e) => e.published);
  }

  return data;
}

/** A single published show by slug, or null (unpublished/unknown slugs 404 — see src/app/campaigns/live/[slug]/page.tsx). */
export async function getLiveEventBySlug(slug: string): Promise<LiveEventRow | null> {
  if (!isSupabaseConfigured()) {
    return SEED_LIVE_EVENTS.find((e) => e.slug === slug && e.published) ?? null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("live_events")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    logServerError("data.live-events: getLiveEventBySlug failed", error);
    return null;
  }

  return data ?? null;
}

export async function getLiveEventPerformers(eventId: string): Promise<LivePerformerRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("live_performers")
    .select("*")
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });

  if (error || !data) {
    logServerError("data.live-events: getLiveEventPerformers failed", error);
    return [];
  }

  return data;
}

export async function getLiveAuctionItems(eventId: string): Promise<LiveAuctionItemRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("live_auction_items")
    .select("*")
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });

  if (error || !data) {
    logServerError("data.live-events: getLiveAuctionItems failed", error);
    return [];
  }

  return data;
}
