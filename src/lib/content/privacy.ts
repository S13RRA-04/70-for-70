/**
 * Privacy policy copy. Written to accurately describe what this codebase
 * actually does (see the linked source for each claim) rather than generic
 * boilerplate — but it is still a draft pending review by qualified legal
 * counsel before publishing, especially the jurisdiction-specific rights
 * language marked TODO below.
 */

export interface PrivacySection {
  id: string;
  heading: string;
  body: string[];
}

// Noon UTC avoids the date shifting a day in timezones behind/ahead of UTC.
export const PRIVACY_LAST_UPDATED = "2026-08-18T12:00:00Z";

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: [
      "This policy explains what information the 70 for 70 campaign website collects, how it's used, and who it's shared with. It covers this website only — not Mighty Oaks Foundation, Project Echelon, or any other organization's own website or donation platform, each of which has its own privacy policy.",
      "70 for 70 does not process donations or payments directly, and does not sell personal information.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    body: [
      "General contact form (/contact): name, organization, email, phone (optional), the topic you select, and your message.",
      "Sponsorship request form (/sponsors/request): contact name, organization name, email, phone, website, industry, proposed sponsorship level, proposed cash/in-kind value, type of support, a description of the proposed support, desired recognition, an optional requested mile number, how you heard about the campaign, and an optional message. See our Sponsorship Vetting Workflow for how this is reviewed.",
      "Administrator accounts: campaign administrators sign in with an email and password to manage the review queue. This is not available to, or used by, site visitors.",
      "Server logs: like most websites, our hosting infrastructure processes IP addresses transiently to serve requests and to rate-limit form submissions against spam and abuse. We do not maintain a database table of visitor IP addresses.",
      "We do not use advertising or analytics tracking cookies at this time. The only cookies set are a short-lived one used during the WHOOP account-connection flow (admin-only) and a session cookie for administrator sign-in.",
    ],
  },
  {
    id: "training-data",
    heading: "Training Data (WHOOP)",
    body: [
      "The 'Latest Training' snapshot on the Race page — recovery, sleep performance, day strain, and recent workouts — is the athlete's own data, pulled from his personal WHOOP account, which he has connected to this site himself. It is not collected from site visitors, and visitors cannot connect their own WHOOP accounts through this site.",
      "This data is displayed publicly as part of telling the campaign's story. The underlying account credentials (OAuth tokens) are stored server-side only and are never exposed to the browser.",
    ],
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Information",
    body: [
      "To respond to general inquiries and sponsorship proposals.",
      "To evaluate sponsorship requests through our review process before any sponsorship, gift, or benefit is accepted or a sponsor is recognized publicly.",
      "To administer the campaign — for example, tracking fundraising progress and mile status.",
      "To protect the site and its forms from spam and abuse.",
    ],
  },
  {
    id: "sharing",
    heading: "Third-Party Services",
    body: [
      "Supabase: our database, authentication, and hosting infrastructure provider. Form submissions and administrator accounts are stored in Supabase.",
      "WHOOP: provides the athlete's training data displayed on the Race page, as described above.",
      "We do not currently use an email delivery provider, payment processor, or analytics provider. If we add one, we'll update this policy first.",
      "Donate buttons route to each beneficiary nonprofit organization's own, separately operated donation platform — see the disclaimer on our Donate and Partners pages. We don't receive or process your payment information for those donations.",
    ],
  },
  {
    id: "retention",
    heading: "Data Retention",
    body: [
      "We keep contact and sponsorship request submissions, including the sponsorship review history, for as long as reasonably needed for campaign administration and recordkeeping (including declined or withdrawn sponsorship requests, which we retain for audit purposes rather than deleting).",
      "TODO — a specific retention period, and the process for a requester to ask that their submission be deleted, is pending legal review.",
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
      "TODO — jurisdiction-specific rights language (e.g. under CCPA, GDPR, or other applicable law) is pending legal review before publishing.",
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
