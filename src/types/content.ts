/** Nav link shape shared by the header and mobile nav. */
export interface NavLink {
  label: string;
  href: string;
}

/** A dropdown group of nav links (header desktop dropdown / mobile drawer section). */
export interface NavGroup {
  label: string;
  children: NavLink[];
}

/** A top-level nav entry — either a direct link or a dropdown group. */
export type NavEntry = NavLink | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}
