/**
 * Public athlete team roster for /athletes' "Featured Athletes" section.
 * Kept as data rather than hard-coded JSX, same pattern as RESOURCES and
 * CURRENT_CAMPAIGN. Deliberately empty until a real, approved profile
 * exists — no placeholder/fake athlete cards (see README's "Eliminating
 * Placeholder Content"). Populate an entry here once someone has actually
 * affiliated under the Athlete Participation & Affiliation Agreement.
 *
 * Public fields only — no medical details, disability ratings, employer
 * details, addresses, financial assistance records, or internal
 * application information (see AthletesPage's "No Guaranteed Funding" /
 * "What We Expect" sections for the policy this profile shape enforces).
 */

export interface AthleteProfile {
  id: string;
  name: string;
  photoUrl: string | null;
  /** e.g. "Navy Veteran", "Law Enforcement", "Fire / EMS". */
  serviceCategory: string;
  sport: string;
  /** Goal or target event, e.g. "IRONMAN 70.3 Chattanooga, May 2027". */
  goal: string;
  /** Short, approved bio — public-facing, not the athlete's full story. */
  bio: string;
  campaignStatus: string;
  /** Only included when the athlete has authorized disclosure. */
  sponsors?: string[];
}

export const ATHLETES: AthleteProfile[] = [];
