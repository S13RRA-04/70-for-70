import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_JOURNAL_ENTRIES } from "./seed-data";
import { getPartners } from "./partners";
import type { JournalEntryRow, JournalEntryWithMentions, JournalPrimaryCategory } from "@/types/database";

function isPubliclyVisible(entry: JournalEntryRow, nowIso: string): boolean {
  return entry.status === "published" || (entry.status === "scheduled" && (entry.scheduled_for ?? "") <= nowIso);
}

function sortByPublishedDesc(entries: JournalEntryRow[]): JournalEntryRow[] {
  return [...entries].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

/**
 * Wrapped in React's cache() so a single request only hits Supabase once —
 * the Supabase client doesn't opt into Next's fetch-level memoization the
 * way a plain fetch() call would, so without this /journal/[slug] would
 * fetch the full entry list twice per request (generateMetadata + the page
 * body).
 */
export const getJournalEntries = cache(async (): Promise<JournalEntryRow[]> => {
  const nowIso = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return sortByPublishedDesc(SEED_JOURNAL_ENTRIES.filter((e) => isPubliclyVisible(e, nowIso)));
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_for.lte.${nowIso})`)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) {
    console.error("Failed to load journal entries, falling back to seed data:", error);
    return sortByPublishedDesc(SEED_JOURNAL_ENTRIES.filter((e) => isPubliclyVisible(e, nowIso)));
  }

  return data;
});

export async function getLatestJournalEntries(count = 3): Promise<JournalEntryRow[]> {
  const entries = await getJournalEntries();
  return entries.slice(0, count);
}

export async function getFeaturedJournalEntry(): Promise<JournalEntryRow | null> {
  const entries = await getJournalEntries();
  return entries.find((e) => e.featured) ?? null;
}

export async function getJournalEntriesByCategory(
  category: JournalPrimaryCategory | "All",
): Promise<JournalEntryRow[]> {
  const entries = await getJournalEntries();
  return category === "All" ? entries : entries.filter((e) => e.primary_category === category);
}

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntryWithMentions | null> {
  const entries = await getJournalEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return null;

  if (!isSupabaseConfigured()) {
    return { ...entry, partnerMentions: [], beneficiaryMentions: [] };
  }

  const supabase = createPublicClient();
  const [{ data: partnerMentionRows }, { data: beneficiaryMentionRows }, partners] = await Promise.all([
    supabase.from("journal_entry_partner_mentions").select("partner_id").eq("journal_entry_id", entry.id),
    supabase.from("journal_entry_beneficiary_mentions").select("partner_id").eq("journal_entry_id", entry.id),
    getPartners(),
  ]);

  const partnerIds = new Set((partnerMentionRows ?? []).map((r) => r.partner_id));
  const beneficiaryIds = new Set((beneficiaryMentionRows ?? []).map((r) => r.partner_id));

  return {
    ...entry,
    partnerMentions: partners.filter((p) => partnerIds.has(p.id)),
    beneficiaryMentions: partners.filter((p) => beneficiaryIds.has(p.id)),
  };
}

/**
 * Buckets already-sorted (newest-first) entries by publish month, preserving
 * order. Entries with no published_at are grouped under "Undated" at the
 * end rather than dropped. Never emits an empty group — only produces
 * buckets for months that actually have entries in the input.
 */
export function groupByMonth(entries: JournalEntryRow[]): { label: string; entries: JournalEntryRow[] }[] {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const groups: { label: string; entries: JournalEntryRow[] }[] = [];

  for (const entry of entries) {
    const label = entry.published_at ? formatter.format(new Date(entry.published_at)) : "Undated";
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.entries.push(entry);
    } else {
      groups.push({ label, entries: [entry] });
    }
  }

  return groups;
}

export async function getAdjacentJournalEntries(
  slug: string,
): Promise<{ prev: JournalEntryRow | null; next: JournalEntryRow | null }> {
  const entries = await getJournalEntries();
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    // Entries are ordered newest-first: the "next" entry chronologically is
    // the one before it in the array, and "prev" is the one after.
    prev: entries[index + 1] ?? null,
    next: entries[index - 1] ?? null,
  };
}
