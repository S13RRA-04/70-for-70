import type { CampaignSlug } from "@/lib/site-mode";

/**
 * Institutional recognition — grants, official selections, memberships, and
 * awards. Deliberately its own taxonomy, separate from mission_partners
 * (sponsors, gear partners, in-kind supporters): a grantor recognizing the
 * campaign's work is not a commercial sponsor, so these never render in the
 * partner logo wall, never count toward campaignPartnerCount, and are never
 * described as a sponsorship. Rendered by InstitutionalRecognition
 * (src/components/shared/institutional-recognition.tsx).
 *
 * To add one, append an object to RECOGNITIONS. Once published, don't change
 * an existing entry's id. Only add a logo the organization has approved for
 * this use.
 */
export interface InstitutionalRecognition {
  id: string;
  /** The recognizing body, e.g. "USA Triathlon". */
  organization: string;
  /** The exact, approved designation — rendered verbatim as the heading. */
  designation: string;
  year: number;
  /** One or two sentences, in the voice of the campaign — never self-congratulatory. */
  description: string;
  /** Approved logo, sized for a light plate (the component always renders it on one). */
  logo?: { src: string; alt: string; width: number; height: number };
  /** Campaign this recognition belongs to — keeps a program-specific grant from reading as an endorsement of every For The 22 initiative. Null = org-wide. */
  campaign: CampaignSlug | null;
  /** Same-site details page (e.g. a journal announcement), relative to the campaign's own host. */
  detailsHref?: string;
  /** The recognizing organization's own public page about the program. */
  sourceUrl?: string;
}

export const USAT_TOGETHER_WE_THRIVE_2026: InstitutionalRecognition = {
  id: "usat-together-we-thrive-2026",
  organization: "USA Triathlon",
  designation: "2026 USA Triathlon Together We Thrive Grant Recipient",
  year: 2026,
  description:
    "Tri For The 22 was selected by USA Triathlon for a Together We Thrive grant supporting pathways to access and inclusion in multisport.",
  logo: { src: "/recognition/usa-triathlon-logo.png", alt: "USA Triathlon logo", width: 480, height: 362 },
  campaign: "tri",
  detailsHref: "/journal/tri-for-the-22-selected-for-usa-triathlon-together-we-thrive-grant",
};

export const RECOGNITIONS: InstitutionalRecognition[] = [USAT_TOGETHER_WE_THRIVE_2026];

export function getRecognitionsForCampaign(campaign: CampaignSlug): InstitutionalRecognition[] {
  return RECOGNITIONS.filter((r) => r.campaign === campaign);
}
