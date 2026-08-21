/**
 * Press page content that doesn't exist yet — approved photography, press
 * releases, media coverage. Kept as empty arrays (same pattern as
 * ATHLETES in athletes.ts) rather than publishing an EmptyState
 * placeholder card for each one; the Press page only renders a section
 * once it has real entries here. See README's "Eliminating Placeholder
 * Content".
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
