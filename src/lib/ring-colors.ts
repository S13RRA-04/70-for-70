/**
 * Nothing in the For The 22 mark is decorative — see the Brand Meaning
 * section of the About page. The outer ring is every branch of the U.S.
 * Armed Forces; the inner ring is every sector of first-responder service.
 * Colors are keyed to their meaning below rather than to a specific clock
 * position on the mark, since the ring segments aren't easily disambiguated
 * by position alone in the source artwork.
 *
 * Centralized here (rather than living only in the About page's content
 * module) so any component — the About "Brand Meaning" section, a future
 * Resources "I Am" filter, a header accent — can use the same source of
 * truth instead of re-deriving these hex values.
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
