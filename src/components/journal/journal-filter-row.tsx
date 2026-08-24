"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterChip } from "@/components/shared/filter-chip";
import type { JournalPrimaryCategory } from "@/types/database";

const CATEGORIES: JournalPrimaryCategory[] = [
  "Training",
  "Fundraising",
  "Mighty Oaks",
  "Sponsors",
  "Race Prep",
  "Milestones",
];

/** Category pills for /journal, driven by a `?category=` query param — no free-text search (out of scope until post volume justifies it). */
export function JournalFilterRow() {
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
      {CATEGORIES.map((category) => (
        <FilterChip key={category} label={category} active={active === category} onClick={() => setCategory(category)} />
      ))}
    </div>
  );
}
