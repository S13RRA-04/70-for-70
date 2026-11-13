import type { MissionPillar } from "@/lib/pillars";

/** Nav link shape shared by the header and mobile nav. */
export interface NavLink {
  label: string;
  href: string;
}

/** A dropdown group of nav links (header desktop dropdown / mobile drawer section). */
export interface NavGroup {
  label: string;
  children: NavLink[];
  /** Set on the org nav's mission-pillar groups — drives the pillar color and "01 · Connection" eyebrow. */
  pillar?: MissionPillar;
}

/** A top-level nav entry — either a direct link or a dropdown group. */
export type NavEntry = NavLink | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}
