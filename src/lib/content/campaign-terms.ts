/**
 * Campaign-domain (tri.forthe22.org) Terms of Use — everything specific to
 * running the Tri For The 22 fundraising campaign: donations, merchandise,
 * fundraising tracking, race participation, trademark disclaimers, athlete
 * affiliation, and campaign administrator functions. The parent site's
 * general terms (src/lib/content/terms.ts) cover ordinary site use; this
 * page supplements rather than replaces them — see the "General Site Terms"
 * link on this page.
 */

import type { TermsSection } from "@/lib/content/terms";

export const CAMPAIGN_TERMS_LAST_UPDATED = "2026-08-24T18:00:00Z";

export const CAMPAIGN_TERMS_SECTIONS: TermsSection[] = [
  {
    id: "charitable-giving-disclosure",
    heading: "Charitable Giving Disclosure",
    body: [
      "Tri For The 22 does not process, collect, or take possession of charitable donations. Donation links on this site route directly to each beneficiary organization's own, independently operated donation platform, and your donation is governed by that organization's own terms and privacy practices.",
      "Tri For The 22 does not issue tax receipts. If your donation is tax-deductible, the receiving nonprofit organization — not For The 22 — is responsible for providing documentation.",
      "Fundraising figures shown on this site (amounts raised, miles funded) reflect information reported to or verified by the campaign and may not update in real time with each beneficiary organization's own records.",
    ],
  },
  {
    id: "merchandise",
    heading: "Merchandise",
    body: [
      "Merchandise is not currently available, and For The 22 does not receive merchandise proceeds at this time. See Financial Transparency for more.",
    ],
  },
  {
    id: "race-participation",
    heading: "Race Participation & Athletic Risk",
    body: [
      "Race and training activities described on this site are undertaken by the athlete at his own risk. Endurance sport carries inherent physical risk; nothing on this site is medical advice or a recommendation that any visitor undertake similar activity.",
    ],
  },
  {
    id: "athlete-affiliation",
    heading: "Athlete Affiliation",
    body: [
      "Public athlete recruitment, applications, and affiliation with Tri For The 22 are not currently open. This page will be updated if and when that changes.",
    ],
  },
  {
    id: "sponsorship-and-administration",
    heading: "Sponsorship Intake & Campaign Administration",
    body: [
      "Sponsorship inquiries submitted through this site are reviewed before any relationship is confirmed; submitting an inquiry does not create a sponsorship agreement.",
      "Campaign administrator accounts (used to manage journal entries, sponsorship review, and campaign data) are for the campaign's own operator only and are not available to site visitors.",
    ],
  },
  {
    id: "trademarks-and-endorsement",
    heading: "Trademarks & Endorsement Disclaimer",
    body: [
      "IRONMAN® and 70.3® are trademarks of their respective owner. This site and campaign are not affiliated with, sponsored by, or endorsed by IRONMAN or its parent organization, and references to the race format are used only to describe the athletic challenge undertaken.",
      "Mighty Oaks Foundation and Veterans and Athletes United are named as the campaign's beneficiary organizations; this site is operated independently and is not an official website of either of them. Being named as a beneficiary does not mean any organization operates, endorses, or is responsible for this site's content.",
      "All activities described on this site are undertaken in a personal capacity. Nothing on this site represents or implies endorsement, sponsorship, affiliation, or authorization by any employer, government agency, or United States Government entity.",
    ],
  },
];
