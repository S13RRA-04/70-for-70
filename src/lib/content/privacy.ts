/**
 * Parent-site (forthe22.org) privacy policy — covers this website only: the
 * resource directory, the general contact form, resource submissions, and
 * basic site analytics. Campaign-specific data practices (WHOOP training
 * data, donation routing, merchandise, sponsorship intake) live on the
 * campaign domain — see src/lib/content/campaign-privacy.ts.
 */

export interface PrivacySection {
  id: string;
  heading: string;
  body: string[];
}

// Noon UTC avoids the date shifting a day in timezones behind/ahead of UTC.
export const PRIVACY_LAST_UPDATED = "2026-08-24T18:00:00Z";

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: [
      "This policy explains what information the For The 22 website collects, how it's used, and who it's shared with. It covers this website only — not any third-party resource, organization, or program listed in the directory, each of which has its own privacy policy.",
      "For The 22 does not process donations or payments directly, and does not sell personal information.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    body: [
      "General contact form (/contact): name, organization, email, phone (optional), the topic you select, and your message.",
      "Resource submissions: the resource details and contact information you provide when submitting a resource for review.",
      "Administrator accounts: site administrators sign in with an email and password to manage the site. This is not available to, or used by, site visitors.",
      "Server logs: like most websites, our hosting infrastructure processes IP addresses transiently to serve requests and to rate-limit form submissions against spam and abuse. We do not maintain a database table of visitor IP addresses.",
      "Aggregate traffic analytics: we use Cloudflare Web Analytics to understand overall site traffic — approximate page views, unique visits, referring sites, and general geography (country-level) and device type. It is cookieless and does not use any persistent identifier to track you individually or across other websites; we cannot identify who visited from this data. We do not use advertising cookies. The only cookie this site sets is a session cookie for administrator sign-in.",
    ],
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Information",
    body: [
      "To respond to general inquiries.",
      "To review and, where appropriate, publish submitted resources.",
      "To protect the site and its forms from spam and abuse.",
    ],
  },
  {
    id: "sharing",
    heading: "Third-Party Services",
    body: [
      "Supabase: our database, authentication, and hosting infrastructure provider. Form submissions and administrator accounts are stored in Supabase.",
      "Cloudflare: in addition to hosting this site, Cloudflare provides the aggregate, cookieless traffic analytics described above (Cloudflare Web Analytics).",
      "We do not currently use an email delivery provider. If we add one, we'll update this policy first.",
    ],
  },
  {
    id: "retention",
    heading: "Data Retention",
    body: [
      "We keep contact form submissions for as long as reasonably needed for campaign administration and recordkeeping.",
      "If you'd like your submission removed, contact us using the form on this site and we'll evaluate the request. A fixed retention schedule is under legal review and will be published here once finalized.",
    ],
  },
  {
    id: "childrens-privacy",
    heading: "Children's Privacy",
    body: [
      "This site is not directed to children under 13, and we do not knowingly collect personal information from children.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your Choices",
    body: [
      "You can decline to submit a form — nothing on this site requires you to provide personal information to browse it.",
      "Depending on where you live, you may have additional legal rights over your information (for example, under CCPA or GDPR). That jurisdiction-specific language is under legal review and will be published here once finalized; in the meantime, contact us using the form on this site with any request.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to This Policy",
    body: [
      "We'll post any changes to this policy on this page and update the date below.",
    ],
  },
];
