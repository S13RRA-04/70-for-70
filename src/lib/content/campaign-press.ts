/**
 * Campaign-domain (tri.forthe22.org) press content — approved photography,
 * press releases, media coverage for the Tri For The 22 campaign. Kept as
 * empty arrays (same pattern as ATHLETES in athletes.ts) rather than
 * publishing an EmptyState placeholder card for each one; the campaign
 * press page only renders a section once it has real entries here. See
 * README's "Eliminating Placeholder Content".
 */

export interface ApprovedPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface PressRelease {
  title: string;
  date: string;
  url: string;
}

export interface MediaCoverageItem {
  outlet: string;
  title: string;
  date: string;
  url: string;
}

export const APPROVED_PHOTOS: ApprovedPhoto[] = [];
export const PRESS_RELEASES: PressRelease[] = [];
export const MEDIA_COVERAGE: MediaCoverageItem[] = [];
