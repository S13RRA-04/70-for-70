/**
 * Campaign-domain (tri.forthe22.org) privacy notice — everything specific
 * to running the Tri For The 22 fundraising campaign: WHOOP training data,
 * donation routing, merchandise, sponsorship intake, and campaign
 * administrator functions. The parent site's general privacy policy
 * (src/lib/content/privacy.ts) covers ordinary site use; this page
 * supplements rather than replaces it.
 */

import type { PrivacySection } from "@/lib/content/privacy";

export const CAMPAIGN_PRIVACY_LAST_UPDATED = "2026-08-24T18:00:00Z";

export const CAMPAIGN_PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "training-data",
    heading: "Training Data (WHOOP)",
    body: [
      "The 'Latest Training' snapshot on the Race page — recovery, sleep performance, day strain, and recent workouts — is the athlete's own data, pulled from his personal WHOOP account, which he has connected to this site himself. It is not collected from site visitors, and visitors cannot connect their own WHOOP accounts through this site.",
      "This data is displayed publicly as part of telling the campaign's story. The underlying account credentials (OAuth tokens) are stored server-side only and are never exposed to the browser.",
      "The only cookie this site sets beyond the parent site's administrator session cookie is a short-lived one used during the WHOOP account-connection flow (admin-only).",
    ],
  },
  {
    id: "campaign-information-we-collect",
    heading: "Campaign-Specific Information",
    body: [
      "Campaign-update mailing list (email signup): first name and email address.",
      "Sponsorship inquiries: the contact and organization details you provide when submitting a sponsorship inquiry.",
    ],
  },
  {
    id: "how-we-use-campaign-information",
    heading: "How Campaign Information Is Used",
    body: [
      "To send campaign updates to mailing list subscribers.",
      "To administer the campaign — for example, tracking fundraising progress and mile status.",
      "To review sponsorship inquiries.",
    ],
  },
  {
    id: "campaign-sharing",
    heading: "Campaign Third-Party Services",
    body: [
      "WHOOP: provides the athlete's training data displayed on the Race page, as described above.",
      "Bonfire: our merchandise/team-store provider, linked from the Shop page. Bonfire processes orders, sizing, shipping, and payment on its own platform, not this site — see Financial Transparency.",
      "Donation links route to each beneficiary nonprofit organization's own, separately operated donation platform — see the disclaimer on our Donate and Beneficiaries pages. We don't receive or process your payment information for those donations.",
    ],
  },
  {
    id: "donations-are-not-processed-here",
    heading: "Donations Are Not Processed Here",
    body: [
      "Donations are directed through each beneficiary organization's authorized donation platform. For The 22 does not independently process charitable contributions unless explicitly stated.",
    ],
  },
];
