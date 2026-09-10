import { createClient } from "@/lib/supabase/server";
import type { AppEventRow } from "@/types/app";

/** Public-read (RLS) — every event a participant can see, newest window first. */
export async function getAppEvents(): Promise<AppEventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").order("start_at", { ascending: false });
  if (error || !data) {
    console.error("Failed to load app events:", error);
    return [];
  }
  return data;
}

export async function getAppEventBySlug(slug: string): Promise<AppEventRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error(`Failed to load app event "${slug}":`, error);
    return null;
  }
  return data;
}
