/**
 * For The 22 Athlete Participation & Affiliation Agreement — a separate
 * legal document from the Site Terms (see src/lib/content/terms.ts). It
 * governs athletes who formally affiliate with For The 22 (represent
 * themselves as a For The 22 athlete, use For The 22 branding, fundraise
 * under the For The 22 name, or receive program support), not general site
 * visitors. This is a working operational framework and, like
 * src/lib/content/terms.ts and src/lib/content/privacy.ts, is pending
 * review by qualified legal counsel before an athlete is required to accept
 * a production version of it.
 *
 * Athlete onboarding isn't open yet (the old /join route now permanently
 * redirects to the campaign's /the-mission, see next.config.ts) — there is no athlete
 * database record, acceptance flow, or admin tracking to accept this
 * agreement against. When that program is built, the acceptance UI must:
 *   - Require an affirmative, non-pre-checked checkbox (not a bundled
 *     acceptance implied by account creation).
 *   - Link to this agreement, the Privacy Policy, and any applicable
 *     program rules from the acceptance screen.
 *   - Record, per athlete: which ATHLETE_AGREEMENT_VERSION was accepted
 *     (not just a boolean), acceptance timestamp, IP address (if consistent
 *     with the Privacy Policy), user-agent, and method of acceptance.
 *   - Prompt re-acceptance when ATHLETE_AGREEMENT_VERSION changes materially
 *     (bump the version/effective date below and notify active athletes) —
 *     minor formatting fixes don't require it.
 */

export interface AthleteAgreementSection {
  id: string;
  heading: string;
  body: string[];
}

export const ATHLETE_AGREEMENT_VERSION = "1.0";
// Noon UTC avoids the date shifting a day in timezones behind/ahead of UTC.
export const ATHLETE_AGREEMENT_EFFECTIVE_DATE = "2026-08-19T12:00:00Z";

export const ATHLETE_AGREEMENT_SECTIONS: AthleteAgreementSection[] = [
  {
    id: "applicability",
    heading: "When This Agreement Applies",
    body: [
      "This Agreement applies to any individual who wishes to affiliate with For The 22 as an athlete. An athlete must affirmatively accept this Agreement before representing themselves publicly as a For The 22 athlete or affiliated athlete; using the For The 22 name, logo, marks, apparel, or branding; participating in an official For The 22 campaign; fundraising under the For The 22 name; receiving equipment, entry fees, coaching, travel assistance, grants, reimbursements, merchandise, or other program support; receiving sponsor-provided products or services through For The 22; or appearing on the For The 22 website as an affiliated athlete.",
      "This Agreement is separate from, and in addition to, the general Site Terms that apply to all visitors of this website.",
    ],
  },
  {
    id: "eligibility",
    heading: "1. Athlete Eligibility",
    body: [
      "Affiliation with For The 22 is available only to individuals approved through the applicable For The 22 athlete or program application process. Unless specifically approved otherwise, participating athletes must be at least 18 years old.",
      "Eligibility depends on the applicable program and may include veterans, current or former military personnel, law-enforcement personnel, firefighters, EMS personnel, dispatchers, corrections personnel, other first responders, adaptive athletes, and other individuals specifically approved under a For The 22 program. Falling within one of these categories does not make participation automatic — For The 22 may establish additional eligibility requirements for specific programs.",
    ],
  },
  {
    id: "relationship",
    heading: "2. Nature of the Relationship",
    body: [
      "An affiliated athlete is not an employee, officer, or director of For The 22; not an agent authorized to legally bind For The 22; not a spokesperson authorized to speak on behalf of For The 22 except where specifically authorized; and not entitled to wages, salary, commissions, employee benefits, or compensation merely because of affiliation.",
      "Athlete affiliation is a voluntary program relationship. Nothing in this Agreement creates an employment, partnership, joint venture, agency, fiduciary, or similar legal relationship between the athlete and For The 22.",
      "Athletes remain responsible for their own employment, professional, military, governmental, ethics, and outside-activity requirements.",
    ],
  },
  {
    id: "no-guaranteed-funding",
    heading: "3. No Guaranteed Funding",
    body: [
      "Acceptance as a For The 22 affiliated athlete does not guarantee funding, equipment, sponsorship, race registration, travel assistance, coaching, reimbursement, or any other benefit.",
      "Program support may depend on available funds, available equipment, sponsor restrictions, program eligibility, demonstrated need, event requirements, mission alignment, previous assistance, the applicant pool, and other published selection criteria. For The 22 may approve all, part, or none of a requested amount. Funding decisions are made against documented, published selection criteria, and anyone involved in a funding decision who has a material personal or financial relationship with the applicant discloses it and steps back from deciding that request.",
    ],
  },
  {
    id: "program-support",
    heading: "4. Athlete & Program Support",
    body: [
      "Support may include race or event registration, bicycles, adaptive sports equipment, wetsuits, helmets, shoes, apparel, training equipment, coaching, facility access, travel, lodging, transportation, recovery resources, and other approved mission-related expenses.",
      "Whenever practical, For The 22 may pay an approved vendor, race organization, service provider, or other third party directly rather than transferring cash to the athlete.",
    ],
  },
  {
    id: "restricted-use",
    heading: "5. Restricted Use of Assistance",
    body: [
      "Any support designated for a particular purpose must be used only for that approved purpose. Athletes may not convert assistance to unrelated personal use; sell funded equipment for personal profit without authorization; transfer funded equipment to another person without authorization; submit fraudulent or duplicate reimbursement requests; misrepresent expenses or eligibility; or use program funds for unlawful purposes.",
      "For The 22 may require receipts, invoices, proof of registration, photographs, serial numbers, or other reasonable documentation.",
    ],
  },
  {
    id: "equipment-ownership",
    heading: "6. Equipment Ownership",
    body: [
      "Equipment provided through a For The 22 program falls into one of three categories, which will be disclosed to the athlete at the time assistance is awarded: athlete-owned equipment, which becomes the athlete's property upon delivery; a conditional equipment award, where ownership transfers after specified program conditions are satisfied; or loaned equipment, which remains the property of For The 22 or another provider and must be returned as required. The athlete's award notice identifies which category applies — there is no single blanket ownership rule for all equipment.",
    ],
  },
  {
    id: "conduct",
    heading: "7. Athlete Conduct",
    body: [
      "Affiliated athletes are expected to conduct themselves in a manner consistent with the For The 22 mission. Prohibited conduct includes fraud, theft, harassment, threats, violence, hate-based conduct, intentional discrimination, illegal drug activity, material dishonesty concerning the program, misuse of charitable or program funds, misrepresentation of military or first-responder service, misrepresentation of disability or eligibility, unauthorized fundraising, unauthorized use of sponsor or partner identities, and conduct that falsely implies governmental or organizational endorsement.",
      "This provision is not a basis for removal merely because an athlete expresses an unpopular personal opinion. It is limited to conduct that materially affects the organization, program, participants, sponsors, beneficiaries, or public trust.",
    ],
  },
  {
    id: "fundraising-rules",
    heading: "8. Fundraising Rules",
    body: [
      "Athletes may not independently solicit money in the name of For The 22 unless expressly authorized for that campaign. Unless expressly authorized in writing, an athlete may not collect or hold charitable contributions on behalf of For The 22 or any beneficiary organization.",
      "Where fundraising is approved, campaigns must use approved links and donation mechanisms. Athletes may not receive charitable campaign money into personal accounts, issue charitable receipts, promise tax deductibility, alter beneficiary designations without approval, or create unauthorized GoFundMe, Venmo, Cash App, PayPal, Stripe, or similar accounts purporting to collect money for For The 22. Athletes must accurately describe where funds go and use approved campaign language when it's provided.",
    ],
  },
  {
    id: "sponsorships",
    heading: "9. Sponsorships",
    body: [
      "Organization sponsorships are negotiated or administered by For The 22. Athlete personal sponsorships are relationships an athlete obtains independently. Athletes may maintain personal sponsorship relationships unless they conflict with an official For The 22 sponsor, a program restriction, applicable law, an employer restriction, or a separately agreed exclusivity requirement — affiliation does not create automatic sponsor exclusivity unless specifically agreed.",
      "An athlete may not, without authorization, promise a sponsor For The 22 logo rights, website placement, event placement, exclusivity, tax deductibility, charitable status, partner status, access to other athletes, or access to beneficiary organizations.",
    ],
  },
  {
    id: "sponsor-disclosure",
    heading: "10. Sponsor and Gift Disclosure",
    body: [
      "Athletes are responsible for clearly disclosing material sponsorship, product, financial, or other relationships when making public endorsements or promotional statements where disclosure is required by law — for example, when an athlete receives free or discounted equipment, race entries, travel, lodging, coaching, cash, products, or services from For The 22 or a sponsor and publicly promotes or endorses the provider. For The 22 provides athletes with a simple disclosure guide separately from this Agreement.",
    ],
  },
  {
    id: "employer-ethics",
    heading: "11. Employer and Government Ethics Requirements",
    body: [
      "Some participating athletes may be federal employees, military personnel, state or local government employees, law-enforcement personnel, firefighters, or other public employees. Each athlete is personally responsible for obtaining any required outside-activity, ethics, sponsorship, gift, fundraising, uniform, insignia, or social-media approvals. For The 22 cannot authorize an athlete to violate obligations imposed by the athlete's employer, agency, military service, department, professional organization, or applicable ethics rules.",
      "Athletes may not suggest that their agency, department, military branch, or governmental employer endorses For The 22 unless documented authorization exists.",
    ],
  },
  {
    id: "branding-license",
    heading: "12. Branding License",
    body: [
      "Affiliation provides a limited, nonexclusive, nontransferable, revocable license to use approved For The 22 branding, valid only during active affiliation and limited to approved uses. Athletes may use the logo to identify themselves as an affiliated athlete and to promote approved campaigns.",
      "Athletes may not materially alter the logo, sell independently produced For The 22 merchandise, register confusingly similar domains or social accounts, sub-license the logo, use the logo to imply endorsement of another business, or use the branding after affiliation ends except in accurate historical references. Approved brand assets are available for download rather than copying images from the website.",
    ],
  },
  {
    id: "athlete-title",
    heading: "13. Athlete Title",
    body: [
      "The standardized public designation for an affiliated athlete is \"For The 22 Athlete\" or \"For The 22 Affiliated Athlete.\" Titles such as Official Representative, Agent, Officer, Director, or Employee may not be used unless separately authorized.",
    ],
  },
  {
    id: "social-media",
    heading: "14. Personal Social Media",
    body: [
      "Athletes retain ownership and control of their personal social-media accounts. Affiliation does not give For The 22 editorial control over an athlete's unrelated personal speech.",
      "However, when athletes specifically identify themselves as For The 22 athletes or promote official campaigns, they must accurately describe the relationship, avoid false statements about the program, follow the fundraising rules and sponsor disclosure requirements above, avoid unauthorized beneficiary or sponsor representations, and avoid implying governmental endorsement.",
    ],
  },
  {
    id: "name-image-story",
    heading: "15. Athlete Name, Image and Story",
    body: [
      "Accepting this Agreement is not an unlimited publicity release. Any use of an athlete's name, biography, photograph, race results, training updates, athlete profile, approved story or testimonial, video, or social-media handle in For The 22 program communications is authorized separately, through a clearly identified media permission — and, where practical, athletes may choose whether their story and photographs are publicly featured.",
      "Sensitive medical or trauma information is never required merely to participate.",
    ],
  },
  {
    id: "medical-information",
    heading: "16. Medical Information",
    body: [
      "This Agreement does not request detailed medical records. Where disability or medical eligibility must be verified for a specific program, For The 22 collects only the minimum information reasonably necessary for that program. Do not submit medical records or sensitive health information unless specifically requested through an approved secure process.",
      "For The 22 will not publicly disclose an athlete's disability, diagnosis, PTSD history, injury history, or other health information without the athlete's specific permission.",
    ],
  },
  {
    id: "athletic-risk",
    heading: "17. Athletic Risk",
    body: [
      "Endurance sport and athletic training involve inherent risks. The athlete is responsible for determining whether they are physically capable of participating in training and events. For The 22 does not provide medical diagnosis, medical clearance, or medical treatment.",
      "This Agreement is not the liability waiver for organized For The 22 events. Any event, group training session, clinic, camp, race, ride, ruck, swim, or other organized physical activity uses its own event-specific waiver and release, reviewed for the applicable jurisdiction.",
    ],
  },
  {
    id: "personal-insurance",
    heading: "18. Personal Insurance",
    body: [
      "Athletes remain responsible for their own health, vehicle, bicycle/equipment, travel, event, and other personal insurance needs. Athlete affiliation does not itself provide insurance coverage unless For The 22 actually maintains applicable coverage for a specific activity.",
    ],
  },
  {
    id: "third-party-rules",
    heading: "19. Events and Third-Party Rules",
    body: [
      "Athletes must comply with rules imposed by race organizers, national governing bodies, facilities, coaches, sponsors, equipment manufacturers, travel providers, and other third-party program providers. Affiliation with For The 22 does not guarantee acceptance into any race or third-party program.",
    ],
  },
  {
    id: "safety-sportsmanship",
    heading: "20. Athlete Safety and Sportsmanship",
    body: [
      "Athletes agree to follow applicable event safety rules, compete honestly, avoid intentional course cutting or cheating, observe anti-doping requirements where applicable, follow equipment safety requirements, and treat volunteers, competitors, staff, and spectators appropriately. For The 22 may withdraw official affiliation from an athlete who materially compromises program integrity or participant safety.",
    ],
  },
  {
    id: "term",
    heading: "21. No Guarantee of Continued Affiliation",
    body: [
      "Affiliation has a defined term — by default, one campaign season or 12 months, whichever is specified by the applicable program — and may then be renewed. Affiliation does not create a perpetual athlete status.",
    ],
  },
  {
    id: "withdrawal",
    heading: "22. Voluntary Withdrawal",
    body: [
      "An athlete may voluntarily end affiliation at any time by providing written or electronic notice to For The 22. On withdrawal: any unused approved support is canceled; loaned equipment must be returned as required; pending reimbursements for expenses properly incurred before withdrawal remain payable under their existing terms; the limited branding license ends; active fundraising campaigns are wound down or transitioned as For The 22 directs; and the athlete's public profile page is removed or marked inactive.",
    ],
  },
  {
    id: "suspension-termination",
    heading: "23. Suspension and Termination",
    body: [
      "For The 22 may suspend or terminate affiliation for legitimate program reasons, including fraud, misuse of funds, material breach of this Agreement, materially false application information, unauthorized fundraising, serious safety violations, brand misuse, loss of program eligibility, or conduct materially damaging program integrity.",
      "Except in circumstances involving immediate safety, fraud, or substantial legal risk, For The 22 will give the athlete notice of the concern and a reasonable opportunity to respond before permanent termination.",
    ],
  },
  {
    id: "effect-of-termination",
    heading: "24. Effect of Termination",
    body: [
      "Upon termination, the athlete must stop representing themselves as a currently affiliated athlete, and the limited branding license under Section 12 ends immediately. Future unspent awards may be canceled, and any loaned property must be returned as required. Existing lawful reimbursement obligations remain subject to their applicable terms. Historical, factual statements — for example, \"2027 For The 22 athlete\" — do not need to be erased.",
    ],
  },
  {
    id: "privacy",
    heading: "25. Privacy",
    body: [
      "Athlete-program records may include application data, contact information, program eligibility, funding decisions, equipment awards, race/event participation, sponsor relationships, and agreement acceptance records. These records are handled under the For The 22 Privacy Policy. Private application data is not publicly displayed merely because the applicant becomes an affiliated athlete.",
    ],
  },
  {
    id: "agreement-changes",
    heading: "26. Agreement Changes",
    body: [
      "Material changes to athlete obligations do not silently apply retroactively. When this Agreement materially changes, For The 22 updates the version number and effective date shown above, notifies active athletes, and requires renewed acceptance where appropriate. Minor administrative or formatting changes do not necessarily require reacceptance.",
    ],
  },
  {
    id: "related-documents",
    heading: "27. Related Documents",
    body: [
      "This Agreement does not attempt to cover every For The 22 activity. Depending on what an athlete is actually doing, they may also need to accept a For The 22 Privacy Policy, Athlete Program Rules or Funding Guidelines specific to their program, a Media & Publicity Authorization, an event-specific Waiver and Release, or an Equipment Award or Loan Agreement.",
    ],
  },
];
