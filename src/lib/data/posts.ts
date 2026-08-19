import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_POSTS } from "./seed-data";
import type { PostRow } from "@/types/database";

export async function getPosts(): Promise<PostRow[]> {
  if (!isSupabaseConfigured()) {
    return [...SEED_POSTS]
      .filter((p) => p.published)
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load posts, falling back to seed data:", error);
    return [...SEED_POSTS]
      .filter((p) => p.published)
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  }

  return data;
}

export async function getLatestPosts(count = 3): Promise<PostRow[]> {
  const posts = await getPosts();
  return posts.slice(0, count);
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
