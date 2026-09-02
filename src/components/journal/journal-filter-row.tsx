"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterChip } from "@/components/shared/filter-chip";
import type { JournalPrimaryCategory } from "@/types/database";

/**
 * "Bike Build" is a UI-only pseudo-category, not a real primary_category
 * value in the DB — see /journal's handling of it (surfaces the ongoing
 * series teaser plus any entries tagged "bike-build") rather than a
 * schema change.
 */
export type JournalCategoryFilter = JournalPrimaryCategory | "Bike Build";

/**
 * Category pills for /journal, driven by a `?category=` query param — no
 * free-text search (out of scope until post volume justifies it). The
 * caller passes only categories that actually have published entries (see
 * /journal, which also hides this component entirely below a minimum post
 * count) rather than hard-coding the full category list here.
 */
export function JournalFilterRow({ categories }: { categories: JournalCategoryFilter[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "All";

  function setCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);

    const query = params.toString();
    router.push(`/journal${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip label="All" active={active === "All"} onClick={() => setCategory("All")} />
      {categories.map((category) => (
        <FilterChip key={category} label={category} active={active === category} onClick={() => setCategory(category)} />
      ))}
    </div>
  );
}
