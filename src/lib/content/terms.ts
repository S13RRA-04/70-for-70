/**
 * Site Terms — combines Terms of Use, Charitable Giving Disclosure, and a
 * trademark/endorsement disclaimer into one page with addressable
 * sections, mirroring the Privacy Policy's approach.
 */

export interface TermsSection {
  id: string;
  heading: string;
  body: string[];
}

export const TERMS_LAST_UPDATED = "2026-08-24T18:00:00Z";

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "acceptance",
    heading: "Terms of Use",
    body: [
      "By using this website, you agree to use it lawfully and not to interfere with its operation, attempt unauthorized access to any part of it, or misuse the contact form.",
      "This site is provided as-is, without warranty of any kind. For The 22 is not liable for any damages arising from your use of the site, to the fullest extent permitted by law.",
      "These terms may be updated from time to time; the current version always applies. Continued use of the site after a change means you accept the updated terms.",
    ],
  },
  {
    id: "charitable-giving-disclosure",
    heading: "Charitable Giving Disclosure",
    body: [
      "For The 22 does not process, collect, or take possession of charitable donations. Donation links on this site route directly to each beneficiary organization's own, independently operated donation platform, and your donation is governed by that organization's own terms and privacy practices.",
      "For The 22 does not issue tax receipts. If your donation is tax-deductible, the receiving nonprofit organization — not For The 22 — is responsible for providing documentation.",
      "Fundraising figures shown on this site (amounts raised, miles funded) reflect information reported to or verified by the campaign and may not update in real time with each beneficiary organization's own records.",
    ],
  },
  {
    id: "merchandise",
    heading: "Merchandise",
    body: [
      "The For The 22 store is operated independently by Bonfire, a third-party print-on-demand platform. Production, fulfillment, payment processing, and order support are all handled on Bonfire's platform — For The 22 does not process, collect, or take possession of merchandise proceeds.",
      "100% of net profit from store purchases is paid by Bonfire directly to Mighty Oaks Foundation.",
      "Merchandise purchases are retail transactions, not tax-deductible charitable contributions, and For The 22 does not issue donation receipts for them.",
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
