/**
 * Parent-site (forthe22.org) Terms of Use — covers this website only: the
 * resource directory, the general contact form, resource submissions, and
 * ordinary site use. Campaign-specific terms (charitable-giving disclosure,
 * merchandise, race participation, trademark disclaimers) live on the
 * campaign domain — see src/lib/content/campaign-terms.ts.
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
      "By using this website, you agree to use it lawfully and not to interfere with its operation, attempt unauthorized access to any part of it, or misuse the contact form or resource submission process.",
      "This site is provided as-is, without warranty of any kind. For The 22 is not liable for any damages arising from your use of the site, to the fullest extent permitted by law.",
      "For The 22 is not a nonprofit organization and does not process or receive charitable contributions through this site.",
      "These terms may be updated from time to time; the current version always applies. Continued use of the site after a change means you accept the updated terms.",
    ],
  },
];
