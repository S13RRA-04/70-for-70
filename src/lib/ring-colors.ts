/**
 * The For The 22 mark's three colors (refined logo, October 2026 — see
 * src/lib/content/announcements.ts "three-colors-one-mission"), sampled from
 * brand/forthe22-logo-source.png. Order is the ring's, clockwise from the
 * top-left. Used by the About page's mark diagram, the Press brand kit, and
 * BrandStripe.
 */
export const MARK_COLORS = [
  { name: "Ranger Green", hex: "#616F36", who: "Those Who Serve", detail: "Our military veterans" },
  { name: "Blue", hex: "#0766C1", who: "Those Who Respond", detail: "Law enforcement, firefighters, EMS, and every first responder" },
  { name: "Muted Gold", hex: "#D4A845", who: "Those Who Stand Beside Them", detail: "The families" },
] as const;

/**
 * Per-branch / per-sector identification colors — chips, borders, dots on
 * pages like Mission. These came from the original segmented ring mark,
 * which the three-color mark above replaced; they're no longer part of the
 * logo, so don't present them as its meaning.
 */
export const OUTER_RING_COLORS = [
  { branch: "Navy", color: "Navy Blue", hex: "#002147" },
  { branch: "Marine Corps", color: "Scarlet", hex: "#C41E3A" },
  { branch: "Coast Guard", color: "Coast Guard Blue", hex: "#0093AF" },
  { branch: "Air Force", color: "Air Force Blue", hex: "#00308F" },
  { branch: "Army", color: "Ranger Green", hex: "#4B5320" },
  { branch: "Space Force", color: "Black", hex: "#1A1A1A" },
] as const;

export const INNER_RING_COLORS = [
  { sector: "Law enforcement, police officers, and sheriff deputies", color: "Blue", hex: "#1C4E80" },
  { sector: "Firefighters and fire rescue departments", color: "Red", hex: "#C8102E" },
  { sector: "EMS, paramedics, nurses, and doctors", color: "White", hex: "#FFFFFF" },
  { sector: "911 dispatchers and public safety telecommunicators", color: "Gold / Yellow", hex: "#EAB308" },
  { sector: "Border patrol and federal security", color: "Green", hex: "#2E7D32" },
  { sector: "Corrections officers and probation staff", color: "Silver / Grey", hex: "#9CA3AF" },
] as const;
