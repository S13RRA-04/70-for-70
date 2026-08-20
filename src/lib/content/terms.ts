/**
 * Site Terms — combines Terms of Use, Sponsorship Disclosure, Charitable
 * Giving Disclosure, and a trademark/endorsement disclaimer into one page
 * with addressable sections, mirroring the Privacy Policy's approach. This
 * is a working draft pending review by qualified legal counsel — same
 * caveat as src/lib/content/privacy.ts.
 */

export interface TermsSection {
  id: string;
  heading: string;
  body: string[];
}

export const TERMS_LAST_UPDATED = "2026-08-18T12:00:00Z";

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "acceptance",
    heading: "Terms of Use",
    body: [
      "By using this website, you agree to use it lawfully and not to interfere with its operation, attempt unauthorized access to any part of it, or misuse the contact or sponsorship request forms.",
      "This site is provided as-is, without warranty of any kind. For The 22 is not liable for any damages arising from your use of the site, to the fullest extent permitted by law.",
      "These terms may be updated from time to time; the current version always applies. Continued use of the site after a change means you accept the updated terms.",
    ],
  },
  {
    id: "sponsorship-disclosure",
    heading: "Sponsorship Disclosure",
    body: [
      "Sponsorship proposals submitted through this site are reviewed under a documented approval process before any sponsorship, gift, payment, product, or service is accepted. Submitting a sponsorship request does not create any obligation on the part of For The 22 to accept it.",
      "A business or individual is only recognized publicly as a sponsor after its request has been approved and activated by the campaign administrator. No sponsorship recognition implies an endorsement of the sponsor by any beneficiary organization named on this site.",
    ],
  },
  {
    id: "charitable-giving-disclosure",
    heading: "Charitable Giving Disclosure",
    body: [
      "For The 22 does not process, collect, or take possession of charitable donations. Donate links on this site route to each beneficiary organization's own, independently operated donation platform, and your donation is governed by that organization's own terms and privacy practices.",
      "For The 22 does not issue tax receipts. If your donation is tax-deductible, the receiving nonprofit organization — not For The 22 — is responsible for providing documentation.",
      "Fundraising figures shown on this site (amounts raised, miles funded) reflect information reported to or verified by the campaign and may not update in real time with each beneficiary organization's own records.",
    ],
  },
  {
    id: "merchandise-and-program-proceeds",
    heading: "Merchandise and Program Proceeds",
    body: [
      "For The 22 merchandise may be produced, sold, fulfilled, or processed by independent third-party providers. These providers may deduct production, fulfillment, platform, transaction, refund, and related costs before remitting proceeds to For The 22. “Net merchandise proceeds” means only the amount actually received by For The 22 after those deductions — not the retail purchase price paid by the customer.",
      "For The 22 currently allocates net merchandise proceeds according to its published 22/58/20 model: 22% to designated charitable organizations, 58% to athlete and program support, and 20% to operations, taxes, and reserves. See the Shop page for the current breakdown.",
      "Merchandise purchases are retail transactions and are not charitable contributions to For The 22. For The 22 does not issue charitable donation receipts for merchandise purchases.",
      "The applicable third-party provider's own terms govern the transaction itself — including payment processing, shipping, returns, and refunds. For The 22 may not directly control manufacturing, shipping, return processing, payment processing, or fulfillment.",
    ],
  },
  {
    id: "financial-disclaimer",
    heading: "Financial Disclaimer",
    body: [
      "Information regarding allocations, charitable giving, program support, and merchandise proceeds is provided for transparency and does not constitute tax, legal, or financial advice. Allocation percentages apply to net proceeds actually received by For The 22 and may be subject to applicable legal, tax, accounting, or regulatory requirements.",
    ],
  },
  {
    id: "trademarks-and-endorsement",
    heading: "Trademarks & Endorsement Disclaimer",
    body: [
      "IRONMAN® and 70.3® are trademarks of their respective owner. This site and campaign are not affiliated with, sponsored by, or endorsed by IRONMAN or its parent organization, and references to the race format are used only to describe the athletic challenge undertaken.",
      "Mighty Oaks Foundation, Project Echelon, and Veterans and Athletes United are named as the campaign's beneficiary organizations; this site is operated independently and is not an official website of any of them. Being named as a beneficiary does not mean any organization operates, endorses, or is responsible for this site's content.",
      "The views, statements, and activities described on this site are undertaken in a personal capacity. Nothing on this site represents or implies endorsement, sponsorship, or affiliation by any employer or government entity, including the U.S. Navy, the Department of Defense, the Department of Justice, or the FBI, unless written authorization has been obtained and stated explicitly.",
    ],
  },
];
