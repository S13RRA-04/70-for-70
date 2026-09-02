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

export interface CampaignMaterialFile {
  src: string;
  alt: string;
  /** Shown on the download link when a material has more than one file (e.g. "Front" / "Back"). Omit for single-file materials. */
  side?: string;
}

export interface CampaignMaterial {
  label: string;
  description: string;
  files: CampaignMaterialFile[];
}

export const APPROVED_PHOTOS: ApprovedPhoto[] = [];
export const PRESS_RELEASES: PressRelease[] = [];
export const MEDIA_COVERAGE: MediaCoverageItem[] = [];

/** Print-ready campaign materials for tabling, sponsors, and community outreach — shown in the Campaign Materials section of the campaign press page. */
export const CAMPAIGN_MATERIALS: CampaignMaterial[] = [
  {
    label: "Flier",
    description: "Single-page flier with the mission summary and Donate / Get Involved QR codes.",
    files: [{ src: "/press/campaign-materials/flier.png", alt: "Tri For The 22 campaign flier" }],
  },
  {
    label: "Poster",
    description: "Full poster layout of the flier, sized for print display.",
    files: [{ src: "/press/campaign-materials/poster.png", alt: "Tri For The 22 campaign poster" }],
  },
  {
    label: "Rack Card",
    description: "Two-sided rack card summarizing the mission, race details, and how to help.",
    files: [
      { src: "/press/campaign-materials/rack-card-front.png", alt: "Tri For The 22 rack card, front", side: "Front" },
      { src: "/press/campaign-materials/rack-card-back.png", alt: "Tri For The 22 rack card, back", side: "Back" },
    ],
  },
  {
    label: "Trifold Brochure",
    description: "Tri-fold brochure with the full mission, race breakdown, and beneficiary information.",
    files: [
      { src: "/press/campaign-materials/trifold-front.png", alt: "Tri For The 22 trifold brochure, front", side: "Front" },
      { src: "/press/campaign-materials/trifold-back.png", alt: "Tri For The 22 trifold brochure, back", side: "Back" },
    ],
  },
  {
    label: "QR Reference Cards",
    description: "Standalone QR cards for Donate and Get Involved — sized for a tabling display.",
    files: [
      { src: "/press/campaign-materials/qr-card-donate.png", alt: "Tri For The 22 Donate QR card", side: "Donate" },
      {
        src: "/press/campaign-materials/qr-card-get-involved.png",
        alt: "Tri For The 22 Get Involved QR card",
        side: "Get Involved",
      },
    ],
  },
];
