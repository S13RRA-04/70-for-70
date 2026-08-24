/**
 * Public athlete team roster — archival content preserved from a retired
 * "Featured Athletes" page (public athlete recruitment/affiliation is
 * closed pending written federal ethics approval; the old org-domain
 * /athletes route now permanently redirects to the campaign's
 * /the-mission, see next.config.ts). Kept as data rather than hard-coded
 * JSX, same pattern as RESOURCES and CURRENT_CAMPAIGN. Deliberately empty
 * until a real, approved profile exists — no placeholder/fake athlete
 * cards (see README's "Eliminating Placeholder Content"). Populate an
 * entry here (and rebuild a page to render it) only once someone has
 * actually affiliated under the Athlete Participation & Affiliation
 * Agreement (src/lib/content/athlete-agreement.ts).
 *
 * Public fields only — no medical details, disability ratings, employer
 * details, addresses, financial assistance records, or internal
 * application information.
 */

export interface AthleteProfile {
  id: string;
  name: string;
  photoUrl: string | null;
  /** e.g. "Navy Veteran", "Law Enforcement", "Fire / EMS". */
  serviceCategory: string;
  sport: string;
  /** Goal or target event, e.g. "IRONMAN 70.3 Chattanooga, 2027". */
  goal: string;
  /** Short, approved bio — public-facing, not the athlete's full story. */
  bio: string;
  campaignStatus: string;
  /** Only included when the athlete has authorized disclosure. */
  sponsors?: string[];
}

export const ATHLETES: AthleteProfile[] = [];
