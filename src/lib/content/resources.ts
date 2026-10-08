/**
 * Curated directory entries for the Resources page. Kept as data rather
 * than hard-coded JSX so entries can be revised without touching the page.
 * Organized by "what do you need" (needCategoryIds) rather than by
 * organization type — sport is one entry point among several, not the
 * organizing principle. audienceTags answer "who are you" — PRIMARY_AUDIENCE_TAGS
 * in resource-directory.tsx is the curated subset shown as filter chips;
 * a resource can carry additional tags (Caregiver, Gold Star, Survivor, etc.)
 * shown only on its own card. Every entry's URL and cost/eligibility framing
 * was checked against the organization's own site — cost is never assumed
 * "Free" just because the audience is veterans/first responders (e.g. First
 * Responder Support Network's WCPR is a paid program even though most peer
 * entries here are free).
 *
 * Financial Assistance, Housing & Transportation, and Legal & Benefits were
 * originally held back nationally, but now carry national entries too — each
 * one verified against the organization's own site in a dedicated national
 * research pass. State-specific entries live in the "<State> Regional" blocks
 * below, now covering all 50 states. Entries there carry a `state` and a
 * `verifiedDate`; a handful still have an inline TODO where the source
 * research flagged something to reconfirm (a specific URL, an active
 * chapter schedule) before treating it as fully production-checked the
 * same way the rest of this file's entries are. Coverage still varies by
 * state — some regional blocks are a handful of entries, others (the
 * original Southeast pass: AL, TN, GA, FL, MS, NC, SC, KY) are deeper and
 * span more categories — so a state having a section here is not a claim
 * that its entry is exhaustive.
 */

export interface Resource {
  name: string;
  url: string;
  description: string;
  /** "What do you need" — one or more of NEED_CATEGORIES' ids. */
  needCategoryIds: string[];
  /** "Who are you" — full tag set; see PRIMARY_AUDIENCE_TAGS for the curated filter subset. */
  audienceTags: string[];
  /** Short, factual cost framing — never defaults to "Free" without checking. */
  cost: string;
  geographicScope: string;
  /** Set for state/regional entries to support state-level filtering — omit for national entries. */
  state?: string;
  /**
   * Marks an entry as eligible for the homepage crisis quick-link and the
   * /crisis page — immediate-response hotlines/peer-support lines, not
   * "mental health" broadly. See CRISIS_AUDIENCE_GROUPS in this file.
   */
  crisisResource?: true;
  /** Which /crisis page section this surfaces under. Required when crisisResource is true. */
  crisisAudience?: "veterans" | "first-responders" | "general";
  /**
   * tel:/sms:-linkable contact info. Only set once a number/shortcode is
   * confirmed against the organization's own site — same rule the rest of
   * this file follows for cost/eligibility. Leave unset (falls back to a
   * "Visit their site" link) rather than publish a guessed crisis number.
   */
  phone?: string;
  text?: string;
  hours?: string;
  /** ISO date this entry (URL, cost, eligibility, and crisis contact info if applicable) was last checked against the org's own site. */
  verifiedDate?: string;
  /**
   * Who specifically qualifies, when that's more specific than audienceTags
   * captures (e.g. "Post-9/11 combat-wounded veterans only", "Sworn
   * law enforcement, active or retired"). Only set when the org's own site
   * states it — leave unset rather than infer/guess eligibility criteria.
   */
  eligibility?: string;
  /**
   * When/how the program runs (e.g. "Year-round, rolling admission",
   * "Seasonal — spring and fall cohorts", "By application, reviewed
   * quarterly"). Only set when the org's own site states it.
   */
  availability?: string;
  /** Structured trust/access fields. Unknown values stay unset; the UI must never infer them. */
  organizationType?: "nonprofit" | "government" | "commercial" | "peer-community" | "education" | "other";
  verificationStatus?: "verified" | "reviewed" | "community-recommended" | "pending-review" | "information-incomplete";
  whyIncluded?: string;
  veteranLed?: boolean;
  firstResponderLed?: boolean;
  faithBased?: boolean;
  /** Provider-owned page explicitly supporting the faithBased classification. */
  faithAffiliationSource?: string;
  peerLed?: boolean;
  virtualAvailable?: boolean;
  inPersonAvailable?: boolean;
  selfReferral?: boolean;
  employerInvolvementRequired?: boolean;
  anonymousInitialContact?: boolean;
  outsideAgencyProvider?: boolean;
  insuranceRequired?: boolean;
  referralRequired?: boolean;
  applicationRequired?: boolean;
  documentationRequired?: boolean;
  confidentialityPolicyUrl?: string;
  situationalTags?: string[];
}

export interface NeedCategory {
  id: string;
  label: string;
}

/**
 * "What do you need" — the primary way this directory is organized; sport
 * is one entry point among several. Lives here (not in
 * resource-directory.tsx, which renders it as filter chips) so
 * resource-card.tsx can also import it, for the card's own category label,
 * without an import cycle between the two components.
 */
export const NEED_CATEGORIES: NeedCategory[] = [
  { id: "mental-health", label: "Mental Health" },
  { id: "sports-fitness", label: "Sports & Fitness" },
  { id: "equipment-grants", label: "Equipment & Grants" },
  { id: "outdoor-programs", label: "Outdoor Programs" },
  { id: "family-support", label: "Family Support" },
  { id: "purpose-community", label: "Purpose & Community" },
  { id: "career-education", label: "Career & Education" },
  { id: "financial-assistance", label: "Financial Assistance" },
  { id: "housing-transportation", label: "Housing & Transportation" },
  { id: "legal-benefits", label: "Legal & Benefits" },
];

export const RESOURCES: Resource[] = [
  // ---------------------------------------------------------------------
  // Sports & Fitness
  // ---------------------------------------------------------------------
  {
    name: "Team Red, White & Blue",
    url: "https://teamrwb.org/",
    description:
      "Nonprofit that organizes thousands of weekly and monthly running, cycling, and fitness events nationwide to build community and improve veterans' health and well-being.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Free / varies by event",
    geographicScope: "Nationwide",
  },
  {
    name: "Wounded Warrior Project — Soldier Ride",
    url: "https://www.woundedwarriorproject.org/programs/soldier-ride",
    description:
      "Multi-day adaptive cycling program — road bikes, hand cycles, and recumbent trikes — that has served roughly 2,000 veterans and family members annually since 2004.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free to eligible participants",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "IRONMAN Foundation — Gold Star Initiative",
    url: "https://ironmanfoundation.org/gold-star-initiative-impact/",
    description:
      "Pairs veterans and active-duty service members with Gold Star Families; participants carry a flag during select IRONMAN run legs and present it to the family at the finish line.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Gold Star"],
    cost: "Free / sponsored",
    geographicScope: "Select IRONMAN events",
  },
  {
    name: "Spartan — Service Member Discounts",
    url: "https://www.spartan.com/en/pages/service-member-discounts",
    description:
      "Discounted race registration and merchandise for current and former military, law enforcement, firefighters, and other first responders (verified via GovX ID).",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS"],
    cost: "Discounted",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "California Police Athletic Federation",
    url: "https://cpaf.org/",
    description:
      "Administers the U.S. Police & Fire Championships — Olympic-style competition across roughly 40 sports — for active and retired law enforcement and fire personnel.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Law Enforcement", "Fire"],
    cost: "Registration fee",
    geographicScope: "California / national competitors",
  },
  {
    name: "First Responder Games",
    url: "https://firstrespondergames.com/",
    description:
      "Annual Olympic-style multi-sport competition in Florida for police, fire, EMS/paramedics, military, and federal agents, run by the nonprofit First Responder Sports.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Active Military"],
    cost: "Registration fee",
    geographicScope: "Florida / event-based",
  },
  {
    name: "Firefighter Challenge League",
    url: "https://firefighterchallenge.com/",
    description:
      "Sanctioned league of fire-service athletic events — stair climb, hose hoist, forcible entry, victim rescue — open to junior through veteran/retired firefighters.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Fire"],
    cost: "Registration fee",
    geographicScope: "National / international events",
  },
  {
    name: "Catch A Lift Fund",
    url: "https://www.catchaliftfund.org/apply/",
    description:
      "Free 8-week wellness program for post-9/11 combat veterans with a 50%+ VA disability rating — one-on-one coaching, in-home gym equipment grants, and veteran-led mentorship.",
    needCategoryIds: ["sports-fitness", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / grant",
    geographicScope: "Nationwide",
  },
  {
    name: "Operation WarriorFit",
    url: "https://www.operationwarriorfit.org/",
    description:
      "501(c)(3) providing free or heavily discounted race entries — 5Ks, marathons, Spartan races, triathlons — to veterans, active duty, reservists/Guard, and first responders as a mental-health tool.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "First Responder"],
    cost: "Free / discounted",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "DAV 5K",
    url: "https://www.dav.org/events/dav-5k/",
    description:
      "Annual run/walk/roll/ride event series, in person and virtual, from Disabled American Veterans, with free entry for veterans and active-duty service members.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family", "Civilian Supporter"],
    cost: "Free for some military categories / varies",
    geographicScope: "Event-based / virtual",
  },
  {
    name: "GORUCK",
    url: "https://www.goruck.com/pages/one-percent-for-those-who-serve",
    description:
      "Rucking-events company built on Special Forces values; commits 1% of revenue to vetted nonprofits serving veterans and first responders, and hosts community ruck events. A commercial company, not a nonprofit — its events are paid.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Civilian Supporter"],
    cost: "Paid",
    geographicScope: "Nationwide / event-based",
  },

  {
    name: "Warrior WOD",
    url: "https://warriorwod.org/",
    description:
      "Six-month program pairing veterans with certified trainers and a peer support network across 38+ states, combining gym-based fitness with mental-health support and serving 100–120 veterans a year.",
    needCategoryIds: ["sports-fitness", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free — donor-funded; veterans pay nothing",
    geographicScope: "Nationwide / 38+ states",
    eligibility: "Application-based",
  },
  {
    name: "Veteran Golfers Association",
    url: "https://vgagolf.org/",
    description:
      "National 501(c)(3) supporting veteran golfers with local chapter events, tournaments, and national championships, bringing active-duty members, veterans, Guard/Reserve, retirees, and their families together through the game.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Paid membership — about $76/year, plus $20 per tournament registration and greens fees of roughly $35–$55",
    geographicScope: "Nationwide",
    eligibility: "Active duty, Guard/Reserve, retirees, and honorably discharged veterans; spouses and dependents 18 and older",
  },
  {
    // TODO(verify): participant travel/lodging cost is not stated on wintersportsclinic.org — confirm before publishing a firmer cost line.
    name: "National Disabled Veterans Winter Sports Clinic",
    url: "https://wintersportsclinic.org/",
    description:
      "Annual week-long adaptive skiing and rehabilitation clinic in Snowmass, Colorado, co-sponsored by the VA and DAV, serving nearly 400 profoundly disabled veterans each year with world-class instruction (2027 clinic: March 27–April 3).",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the clinic's own site — participation is by application",
    geographicScope: "Nationwide / annual event in Colorado",
    eligibility: "Veterans with spinal cord injuries, multiple sclerosis, traumatic brain injury, orthopedic amputations, visual impairments, or CVA with residual effects",
    availability: "Annual — 2027 application posted on the site",
  },

  // ---------------------------------------------------------------------
  // Adaptive (folded into Sports & Fitness as a need, Disabled as audience)
  // ---------------------------------------------------------------------
  {
    name: "Veterans and Athletes United (VetsAU)",
    url: "https://www.vetsau.org/",
    description:
      "Runs accessible retreats, adaptive sports and recreation events, and a memorial initiative for fallen service members, to empower wounded, injured, and ill veterans.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "Move United — Warfighters",
    url: "https://moveunitedsport.org/get-involved/warfighters/",
    description:
      "Free adaptive sports programming across 70+ sports and 245+ chapters for service members and veterans with a permanent physical disability. Official U.S. Olympic & Paralympic Committee affiliate.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free / low-cost / varies",
    geographicScope: "Nationwide network",
  },
  {
    name: "Achilles International — Achilles Freedom Team",
    url: "https://www.achillesinternational.org/achilles-freedom-team",
    description:
      "Provides adaptive equipment and training so wounded, ill, and injured service members and veterans can train for and complete mainstream marathons.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Nationwide / major events",
  },
  {
    name: "Wounded Warrior Project — Adaptive Sports",
    url: "https://www.woundedwarriorproject.org/programs/adaptive-sports",
    description:
      "Single- and multi-day clinics that teach adaptive-equipment use and athletic skills tailored to each warrior's abilities.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "Oscar Mike Foundation",
    url: "https://oscarmike.org/pages/mission",
    description:
      "Veteran-founded nonprofit providing adaptive programs — off-roading, skydiving, wheelchair rugby, obstacle courses — and expeditions for wounded veterans.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "Paralyzed Veterans of America — Sports & Recreation",
    url: "https://pva.org/sports-recreation/",
    description:
      "Adaptive sports, outdoor recreation, and wellness programming for veterans with mobility challenges — some programs open to family and caregivers too.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Free / varies",
    geographicScope: "Nationwide",
  },
  {
    name: "VA National Veterans Sports Programs",
    url: "https://department.va.gov/veteran-sports/",
    description:
      "The VA's own national adaptive sports program — clinics, competitions, and therapeutic arts for veterans with disabilities. Not a charity, but a direct VA benefit.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / VA-supported",
    geographicScope: "Nationwide",
  },
  {
    name: "S.H.O.W. Swimming",
    url: "https://showswimming.com/",
    description:
      "Swimming and water-safety program founded to serve wounded warriors and Gold Star families, with a team across FL, MD, NJ, and GA plus online training sessions.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Multi-state / virtual (FL, MD, NJ, GA plus online sessions)",
    eligibility: "Wounded warriors and Gold Star families (per the org's mission)",
    phone: "+1 (904) 540-2418",
    // TODO(verify): participant cost and whether the online program is open nationwide.
  },
  {
    name: "Adaptive Adventures — Adaptive Skiing & Snowboarding (Military Outreach)",
    url: "https://adaptiveadventures.org/programs/skiing-and-snowboarding/",
    description:
      "Adaptive ski and snowboard program — day lessons, clinics, and multi-day camps at partner resorts across the country — with dedicated military outreach for veterans and service members with physical disabilities. Stand-up skiing, sit-skiing, snowboarding, and ski biking; equipment and instruction included.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family"],
    cost: "Free — every program is offered at no cost to participants with physical disabilities and the family, friends, or caretakers who join them",
    geographicScope: "Nationwide — multi-resort camps and clinics across the U.S.",
    eligibility: "People with physical disabilities (and their family, friends, or caretakers), including veterans and service members through the org's military outreach",
    availability: "Seasonal winter day lessons, clinics, and multi-day camps; dates posted in the org's events list",
    phone: "303-679-2770",
  },
  {
    // TODO(verify): participant cost/scholarship terms not stated on the event page — only that the event is funded in part by a VA grant; confirm registration cost for veterans.
    name: "Move United — The Hartford Ski Spectacular",
    url: "https://moveunitedsport.org/2026-the-hartford-ski-spectacular/",
    description:
      "One of the nation's largest adaptive winter sports festivals (39th annual, Dec 7–13, 2026, Breckenridge, CO) with 800+ participants in alpine and Nordic skiing, snowboarding, biathlon, sled hockey, and curling. More than 60 wounded veterans, active service members, family members, and military medical staff attend from military medical centers and VA facilities across the U.S.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Family", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide — attendees travel from VA facilities across the U.S. to Breckenridge, CO",
    eligibility: "Wounded military veterans, active service members, family members, and military medical staff, alongside the general adaptive-sports community",
    availability: "Annual — 39th edition Dec 7–13, 2026 at Breckenridge, CO",
  },
  {
    // TODO(verify): participant cost not stated on site — confirm whether retreats are fully funded for veterans.
    name: "Challenge Accepted",
    url: "https://challengeacceptedusa.org/",
    description:
      "Nonprofit running helicopter-accessed backcountry snowboarding (and monoskiing) retreats for veterans with physical and/or invisible injuries — recent retreats in Sun Valley, ID and Alaska with backcountry safety instruction, small-group cohesion, and wellness planning. Nationwide veteran applicants; next retreat planned for Feb 2027.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide recruitment — retreats rotate (Sun Valley, ID; Alaska; pilot at Sugarloaf, ME)",
    eligibility: "U.S. veterans with a physical disability and/or invisible injury or mental health condition who were honorably discharged, plus active service members with such conditions; must snowboard at an intermediate-to-advanced level",
    availability: "Next: Heli Snowboarding Retreat, February 2027, Sun Valley, Idaho",
  },
  {
    // TODO(verify): camp FAQ says program fees vary by session and season and scholarships may be available — confirm how veterans apply for scholarship waivers of the $1,000 Beginner Winter Camp fee; active duty/Guard-Reserve not listed on camp pages.
    name: "National Ability Center — Military Winter Camps",
    url: "https://nationalabilitycenter.org/program/military-nordic-ski-camp/",
    description:
      "Park City, UT military camps for veterans (18+), each 5 days, no prior experience required, with all equipment, instruction, and support provided: Military Nordic Ski Camp (cross-country skiing plus biathlon practice and a backcountry yurt ski — Cost: $0), Military Spring Experience Camp (spring ski/snowboard for beginner/intermediate veterans — Cost: $0), and Military Beginner Winter Camp (alpine ski/snowboard with adaptive lessons plus sled hockey, yoga, climbing, and biathlon — Cost: $1000; scholarships offered).",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Varies by camp — $0 listed for Military Nordic Ski Camp and Military Spring Experience Camp; $1000 listed for Military Beginner Winter Camp (per nationalabilitycenter.org camp pages)",
    geographicScope: "Single destination — Park City, UT; open to veterans nationwide",
    eligibility: "Veterans, 18+ (camp pages list veterans only); no prior experience required",
    availability: "5-day winter and spring sessions each season; register through the org's registration portal",
    phone: "435-649-3991",
  },
  {
    // TODO(verify): confirm participant cost/model (program described as free to participants on some pages but not stated explicitly on national site).
    name: "Back on My Feet",
    url: "https://www.backonmyfeet.org/",
    description:
      "National nonprofit that uses running and walking as a platform for mentorship and community, pairing participants with volunteer coaches for early morning workouts and goal-setting support.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide",
  },
  {
    name: "PGA HOPE",
    url: "https://www.pgareach.org/pgahope/",
    description:
      "Flagship military program of PGA REACH (the PGA of America's charitable foundation): a developmental 6–8 week golf curriculum led by PGA of America Golf Professionals trained in adaptive golf and military cultural competency, enhancing veterans' physical, mental, social, and emotional well-being. Active in every U.S. state at roughly 670 program locations and has served 71,000+ veterans since 2015; a VA Memorandum of Understanding allows recreational therapists to refer veterans as a therapeutic resource.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free — all programs provided at no cost to participating veterans, fully funded by PGA REACH",
    geographicScope: "Nationwide — active in every U.S. state",
    eligibility: "Veterans and active-duty service members of any branch, era, or ability level, including veterans with disabilities",
    availability: "6–8 week developmental sessions; register online and connect with the local PGA Section office for clinic schedules",
  },
  {
    name: "Soldiers To Sidelines",
    url: "https://soldierstosidelines.org/",
    description:
      "501(c)(3) that trains veterans, service members, military spouses, and Gold Star family members to become certified character-based sports coaches in their communities. Free virtual coaching certification seminars are step one, followed by free in-person coaching workshops and clinics for young athletes, coaching webinars, and a continuing-development program for certified Soldier Coaches — 2,093 Soldier Coaches nationwide, with certified coaches in 41 states and 6 countries.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse", "Gold Star"],
    cost: "Free — virtual certification seminars, workshops, clinics, and webinars offered at no cost",
    geographicScope: "Nationwide — virtual certification seminars; own-site annual report counts coaches in 41 states and 6 countries",
    eligibility: "Veterans, active service members, military spouses, and Gold Star family members",
    availability: "Free virtual certification seminars run as step one, with dates listed on the site; workshops, webinars, and the annual STS Summit follow",
  },
  {
    // TODO(verify): membership dues/fees live on usmes.org/about/membership-info/, which could not be fetched — confirm the exact membership cost and whether dues are free or discounted before firming up the cost line.
    name: "US Military Endurance Sports (USMES)",
    url: "https://usmes.org/",
    description:
      "501(c)(3) division of American Servicemembers Amateur Sports supporting cycling, triathlon, running, and adventure racing teams for amateur athletes of all abilities, including wounded-veteran and adaptive programs. Offers camps, clinics, races, and gatherings plus a mentoring program with discounted coaching and skill development, along with gear discounts, event reimbursement, and limited competition grants.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide — 17 USMES regions covering every U.S. state, plus territories and overseas members",
    eligibility: "Current, retired, and veteran members of the United States Uniformed Services; military credentials affirmed during membership application",
    availability: "Year-round membership with regional club events, camps, clinics, and a national events calendar",
  },
  {
    // TODO(verify): participant cost (challenge registration fee, if any) is not stated on the org's own site — confirm whether individual access through the app and partner facilities is free.
    name: "Fit First Responders",
    url: "https://fitfirstresponders.org/",
    description:
      "Tulsa-founded 501(c)(3) delivering strength-and-conditioning, nutrition, and mental-conditioning coaching to first responders and veterans through a 24/7 digital platform and mobile app, a 12-week Fit for Duty. Fit for Life challenge, and Certified FFR Training Facilities whose staff are trained on the FFR curriculum. Own site states the program is accessible in all 50 states, with a network of 5,000+ first responders across 100+ partner agencies and 4,000+ served.",
    needCategoryIds: ["sports-fitness", "mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Veteran", "Guard/Reserve"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide — own site states the platform is accessible in all 50 states (the 12-week challenge runs at its Tulsa, OK headquarters)",
    eligibility: "Police officers, firefighters, paramedics, National Guard, and veterans",
    availability: "Digital platform available 24/7; 12-week challenge has run twice a year since 2015; individual intake via contact form",
    phone: "800-382-1506",
  },

  // ---------------------------------------------------------------------
  // Equipment & Grants
  // ---------------------------------------------------------------------
  {
    name: "Challenged Athletes Foundation — Operation Rebound",
    url: "https://www.challengedathletes.org/programs/operation-rebound/",
    description:
      "Grants for U.S. military, veterans, and first responders with permanent physical injuries, covering adaptive sports equipment, competition costs, and training.",
    needCategoryIds: ["equipment-grants", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Disabled"],
    cost: "Grant / free to awardees",
    geographicScope: "Nationwide",
  },
  {
    name: "High Fives Foundation — Empowerment Fund",
    url: "https://highfivesfoundation.org/grant-application/",
    description:
      "Grants covering adaptive sports equipment, medical equipment, and living expenses for people with life-altering injuries, including service-connected veterans.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Grant",
    geographicScope: "U.S. / program-specific",
  },
  {
    name: "Semper Fi & America's Fund",
    url: "https://thefund.org/",
    description:
      "Case management, adaptive equipment, and financial/family assistance for critically wounded, ill, and catastrophically injured service members and veterans from every branch.",
    needCategoryIds: ["equipment-grants", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family", "Caregiver"],
    cost: "Grant / direct assistance",
    geographicScope: "Nationwide",
  },
  {
    name: "Getting Back Up",
    url: "https://www.gettingbackup.org/apply/",
    description:
      "Financial assistance for people with spinal cord injuries, including veterans, to fund exercise-based recovery programs and adaptable products that support independence.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Grant",
    geographicScope: "Nationwide",
  },
  {
    name: "Hope For The Warriors — Warrior's Wish",
    url: "https://www.hopeforthewarriors.org/programs-and-services/warriors-wish/",
    description:
      "Grant program that has funded hundreds of individual wishes, including adaptive sporting and exercise equipment, for post-9/11 veterans and military families.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Grant",
    geographicScope: "Nationwide",
  },
  {
    name: "The Independence Fund",
    url: "https://independencefund.org/",
    description:
      "Mobility equipment, casework, and caregiver support for catastrophically wounded and disabled veterans.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "Caregiver"],
    cost: "Grant / direct assistance",
    geographicScope: "Nationwide",
  },

  // ---------------------------------------------------------------------
  // Mental Health
  // ---------------------------------------------------------------------
  {
    name: "988 Suicide & Crisis Lifeline",
    url: "https://988lifeline.org/",
    description:
      "The federally designated national crisis line — free, confidential support for anyone in suicidal or emotional distress, available by call or text at any hour.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "general",
    phone: "988",
    text: "988",
    availability: "24/7 — call or text",
  },
  {
    name: "Veterans Crisis Line",
    url: "https://www.veteranscrisisline.net/",
    description:
      "Official 24/7 crisis line for veterans and their loved ones, run in partnership with the VA. Dial 988 and press 1, or chat/text.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "veterans",
    phone: "988",
    availability: "24/7 — call, chat, or text",
  },
  {
    name: "CopLine",
    url: "https://www.copline.org/",
    description:
      "24/7 confidential hotline staffed by retired law enforcement officers, exclusively for active and retired law enforcement and their families.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "first-responders",
    eligibility: "Active and retired law enforcement and their families only",
    availability: "24/7",
  },
  {
    name: "Responder Health (Safe Call Now)",
    url: "https://www.safecallnowusa.org/",
    description:
      "24/7 peer advocate hotline for all first-responder disciplines and their families — confidential support and referrals from people who've done the job.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "first-responders",
    availability: "24/7",
  },
  {
    name: "Boulder Crest Foundation — Warrior PATHH",
    url: "https://bouldercrest.org/",
    description:
      "Free, science-based 90-day Posttraumatic Growth program for combat veterans and first responders, beginning with a week-long immersive training and followed by ongoing peer support.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free",
    geographicScope: "Nationwide / retreat-based",
  },
  {
    name: "Save A Warrior",
    url: "https://saveawarrior.org/",
    description:
      "A structured intervention plus long-term peer-supported care for active-duty military, veterans, and first responders dealing with complex PTSD and suicidal ideation.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free / donor-funded",
    geographicScope: "Nationwide / retreat-based",
  },
  {
    name: "Mighty Oaks Foundation",
    url: "https://www.mightyoaksprograms.org/",
    description:
      "Peer-led intensive programs for veterans, active military, and select first-responder groups, centered on faith, responsibility, and purpose as a path through combat trauma and reintegration.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free",
    geographicScope: "Nationwide / retreat-based",
    // Own FAQ: "While Mighty Oaks is a Christian faith-based organization, we welcome attendees from all backgrounds."
    faithBased: true,
    faithAffiliationSource: "https://www.mightyoaksprograms.org/",
  },
  {
    name: "Cohen Veterans Network",
    url: "https://www.cohenveteransnetwork.org/",
    description:
      "In-person and telehealth mental health clinics for post-9/11 veterans, service members, and their families, regardless of discharge status or insurance.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free / low-cost depending on clinic/service",
    geographicScope: "Multi-state clinic network + telehealth",
  },
  {
    name: "The Headstrong Project",
    url: "https://theheadstrongproject.org/",
    description:
      "Confidential, no-cost trauma-focused mental health treatment for veterans, service members, and their families, with no insurance or paperwork required.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Multi-state / telehealth",
  },
  {
    name: "Home Base",
    url: "https://homebase.org/",
    description:
      "Clinical care and intensive treatment programs for the invisible wounds of war — PTSD, TBI, and related conditions — for veterans, service members, and their families.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "National programs + regional care",
  },
  {
    name: "ResponderStrong",
    url: "https://responderstrong.org/",
    description:
      "Responder-informed mental health education, self-assessments, and resource navigation built specifically around the realities of emergency response work.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Healthcare", "First Responder", "Family"],
    cost: "Free / low-cost resources",
    geographicScope: "Nationwide / online",
  },
  {
    name: "First Responder Support Network — WCPR",
    url: "https://www.frsn.org/",
    description:
      "Residential post-trauma retreat, treatment, education, and peer support for first responders affected by work-related trauma. This is a paid, tuition-based program — not a free service — though agency or sponsor support may be available.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "First Responder"],
    cost: "Paid — tuition-based; sponsorship/agency support may apply",
    geographicScope: "Retreat locations in CA, WA, OR, KS, IN",
  },
  {
    name: "VA Vet Centers",
    url: "https://www.vetcenter.va.gov/",
    description:
      "Community-based VA counseling centers offering readjustment counseling, bereavement support, and military sexual trauma counseling, separate from VA medical centers.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
  },
  {
    name: "K9s For Warriors",
    url: "https://k9sforwarriors.org/",
    description:
      "Trains and provides service dogs, at no cost, to veterans living with PTSD, traumatic brain injury, or military sexual trauma.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "All 50 states + Puerto Rico/Guam",
  },
  {
    name: "Patriot PAWS Service Dogs",
    url: "https://patriotpaws.org/",
    description:
      "Trains and places service dogs, at no cost to the veteran, for mobility disabilities, traumatic brain injury, and PTSD.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "Nationwide",
  },
  {
    name: "Creative Forces: NEA Military Healing Arts Network",
    url: "https://www.arts.gov/initiatives/creative-forces",
    description:
      "National Endowment for the Arts initiative, in partnership with the VA and Department of War, delivering creative arts therapies (art, music, dance/movement, drama therapy) at military and VA clinical sites nationwide — including telehealth — plus community-based arts programming for service members, veterans, and their families and caregivers exposed to trauma or traumatic brain injury.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Not stated as free or paid on this page — clinical program runs through VA/military treatment facilities",
    geographicScope: "Nationwide (clinical sites + telehealth + community programs)",
  },
  {
    name: "Armed Services Arts Partnership (ASAP)",
    url: "https://asapasap.org/",
    description:
      "Free art and comedy classes — visual arts, writing, music, storytelling, improv, acting, dance, comedy — for veterans, service members, military spouses, family members, caregivers, and survivors, taught by veterans, in person in five city chapters or online.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse", "Family", "Caregiver", "Survivor"],
    cost: "Free",
    geographicScope: "Nationwide (online) + in-person chapters in Hampton Roads VA, Indianapolis, San Antonio, San Diego, and Washington DC",
  },
  {
    // TODO(verify): cost and specific eligibility criteria not stated on the org's own site; contact directly before publishing firmer claims.
    name: "CreatiVets",
    url: "https://www.creativets.org/",
    description:
      "Nonprofit teaching veterans to process trauma through visual art and songwriting, including a Visual Arts Program and Astrophotography Program; has served 4,500+ veterans through a network of nonprofit partners.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated — apply through their online portal",
    geographicScope: "Nationwide",
  },
  {
    name: "Patriot Art Foundation",
    url: "https://www.patriotartfoundation.org/",
    description:
      "Free watercolor and drawing instruction plus free art materials for veterans, through online classes (Watercolor Boot Camp, Drawing Boot Camp) and in-person workshops at partner VA hospitals and clinics.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free",
    geographicScope: "Nationwide (online) + in-person at partner VA facilities",
    phone: "703-203-1746",
  },

  {
    name: "Give an Hour",
    url: "https://giveanhour.org/",
    description:
      "National network of volunteer licensed mental health professionals providing confidential, no-cost care to the military community through one-on-one counseling, peer support groups, and wellness training.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Caregiver"],
    cost: "Free — no-cost care from volunteer licensed clinicians",
    geographicScope: "Nationwide",
    eligibility: "Active duty, Reserve, Guard, and veterans; spouses and caregivers in certain programs",
  },
  {
    name: "PsychArmor",
    url: "https://psycharmor.org/",
    description:
      "Free, donor-funded online courses that teach people how to support service members, veterans, and their families — used by more than 500 organizations nationwide.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver", "Survivor"],
    cost: "Free — donor-funded",
    geographicScope: "Nationwide",
  },
  {
    name: "Make the Connection",
    url: "https://www.maketheconnection.net/",
    description:
      "VA-run site featuring thousands of veteran video stories alongside mental health information and a way to find local VA and community resources.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — U.S. Department of Veterans Affairs resource",
    geographicScope: "Nationwide",
  },
  {
    name: "Military OneSource",
    url: "https://www.militaryonesource.mil/",
    description:
      "The Department of Defense's free, confidential support for the entire military community — non-medical counseling, peer support, and referrals by phone (800-342-9647) or secure chat.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Caregiver", "Survivor"],
    cost: "Free",
    geographicScope: "Nationwide",
    eligibility: "Active duty, Guard/Reserve (including non-activated), families, wounded warriors, caregivers, and survivors; retirees and those within 365 days of separation",
    availability: "24/7 — phone and secure chat",
  },
  {
    name: "SAMHSA National Helpline",
    url: "https://www.samhsa.gov/find-help/national-helpline",
    description:
      "Confidential treatment referral and information service for individuals and families facing mental health or substance use challenges — call 1-800-662-HELP (4357), TTY 1-800-487-4889.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    phone: "1-800-662-4357",
    availability: "24/7 — call, 365 days a year",
  },
  {
    name: "Crisis Text Line",
    url: "https://www.crisistextline.org/",
    description:
      "Free, confidential 24/7 crisis support by text for anyone in emotional distress — text HOME to 741741 to reach a trained crisis counselor.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "general",
    text: "741741",
    availability: "24/7 — text HOME to 741741",
  },
  {
    name: "Disaster Distress Helpline",
    url: "https://www.samhsa.gov/find-help/disaster-distress-helpline",
    description:
      "SAMHSA's national hotline for people experiencing distress related to disasters, serving survivors, first responders, rescue workers, and their families — call or text 1-800-985-5990.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    crisisResource: true,
    crisisAudience: "general",
    phone: "1-800-985-5990",
    text: "1-800-985-5990",
    availability: "24/7 — call or text",
  },
  {
    // TODO(verify): VA.gov describes this support as free, but vets4warriors.com does not say so on its own pages — confirm "free" wording on the org's site before publishing a firmer cost claim.
    name: "Vets4Warriors",
    url: "https://vets4warriors.com/",
    description:
      "24/7 confidential peer support staffed by veterans for every member of the military community — call 855-838-8255, chat online, or request a call anytime.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own site — VA.gov describes the service as free",
    geographicScope: "Nationwide",
    availability: "24/7 — call, chat, or request a call",
  },
  {
    // TODO(verify): goroger.org/our-services states "We're not a crisis line" while /get-help invites crisis calls 24/7 — confirm positioning before publishing crisis-resource flags.
    name: "Stop Soldier Suicide — ROGER",
    url: "https://goroger.org/",
    description:
      "Stop Soldier Suicide's ROGER service provides free virtual counseling, suicide prevention, and crisis intervention for U.S. veterans and service members — 100% free regardless of discharge status, age, or years of service.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — 100% free to U.S. veterans and service members",
    geographicScope: "Nationwide",
    eligibility: "U.S. veterans and service members only — welcome regardless of discharge status",
    phone: "833-697-6437",
    availability: "24/7 — call",
  },
  {
    name: "NAMI HelpLine",
    url: "https://www.nami.org/nami-helpline/",
    description:
      "Free, confidential nationwide helpline offering one-on-one emotional support, mental health information, and referrals — call 1-800-950-6264 or text NAMI to 62640.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Nationwide",
    availability: "Monday–Friday, 10:00 AM – 10:00 PM ET (closed federal holidays)",
  },
  {
    // TODO(verify): realwarriors.net blocks automated access (JS challenge); campaign confirmed active via health.mil publications updated Oct 2025 — recheck realwarriors.net in a browser before publishing.
    name: "Real Warriors Campaign",
    url: "https://www.health.mil/realwarriors",
    description:
      "Department of Defense public health campaign, established in 2009, that encourages help-seeking among service members, veterans, and military families; its Psychological Health Resource Center gives free, confidential 24/7 guidance at 866-966-1020.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    availability: "24/7 — phone and live chat",
  },
  {
    // TODO(verify): the site does not state that its online tools are free — confirm cost wording before publishing.
    name: "Man Therapy",
    url: "https://mantherapy.org/",
    description:
      "Evidence-based men's mental health campaign featuring the 20-Point Head Inspection self-assessment, plain-spoken topic guides, and a provider directory, with dedicated resources for military members and veterans.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide",
  },
  {
    // TODO(verify): cost is not stated on codegreencampaign.org — confirm before publishing.
    name: "Code Green Campaign",
    url: "https://codegreencampaign.org/",
    description:
      "First responder mental health organization offering education, training, department consulting, and a national database of behavioral health resources for responders.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide",
  },
  {
    // TODO(verify): cost is not stated on allsecurefoundation.org — confirm before publishing. The site explicitly says it has no crisis call center, so this entry is not listed as a crisis resource.
    name: "All Secure Foundation",
    url: "https://allsecurefoundation.org/",
    description:
      "Programs for the special operations community, including one-on-one coaching, family retreats like Camp Homefront, and VIRAGO support for spouses — focused on military family wellness and transitions.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide",
    eligibility: "Special operations warriors and their families",
  },
  {
    name: "NVFC Share the Load — First Responder Helpline",
    url: "https://www.nvfc.org/programs/share-the-load-program/",
    description:
      "The NVFC's Share the Load program pairs a 24/7 First Responder Helpline (offered through Provident) with a Directory of Behavioral Health Professionals and toolkits for fire and EMS departments.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "EMS", "Family"],
    cost: "Included with NVFC membership — complimentary membership available on request",
    geographicScope: "Nationwide",
    eligibility: "NVFC members and household family members; complimentary memberships available for those who cannot purchase one",
    availability: "24/7 — helpline for NVFC members",
  },
  {
    name: "IAFF Center of Excellence for Behavioral Health",
    url: "https://www.iaff.org/center-of-excellence/",
    description:
      "Residential behavioral health treatment for IAFF members living with PTSD, addiction, depression, and anxiety — designed by firefighters, with 24/7 admissions and in-network coverage with most major insurers.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire"],
    cost: "Paid through the member's health insurance — in network with most major plans",
    geographicScope: "Nationwide (treatment center in Upper Marlboro, Maryland)",
    eligibility: "Active and retired IAFF members across North America",
    availability: "24/7 admissions — call 855-900-8437",
  },
  {
    name: "Mission 22",
    url: "https://mission22.org/",
    description:
      "National nonprofit offering no-cost recovery programs for veterans and families dealing with PTSD, TBI, MST and isolation — including Recovery + Resiliency coaching, family support, and a volunteer ambassador network; 6,222+ veterans and families served.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community", "sports-fitness"],
    audienceTags: ["Veteran", "Military Spouse", "Family"],
    cost: "Free — no-cost programs funded by donations",
    geographicScope: "Nationwide — all 50 states plus virtual resources",
    phone: "503-908-8505",
  },
  {
    name: "Boot Campaign",
    url: "https://bootcampaign.org/",
    description:
      "Dallas-based nonprofit providing individualized health-and-wellness care for the physical and emotional wounds of war — TBI, PTSD, insomnia, chronic pain — plus gift-box support through its Seasons of Service program; in 2025 it served 2,168 veterans and military family members in 47 states.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site — apply via the Get Help intake form",
    geographicScope: "Nationwide",
    eligibility: "Veterans and military family members, including active-duty families",
  },
  {
    name: "Paws for Purple Hearts",
    url: "https://pawsforpurplehearts.org/",
    description:
      "Places mobility and PTSD/TBI service dogs with veterans and active-duty service members and runs Canine-Assisted Warrior Therapy — 24,134 lives directly improved; facility dogs are also placed with counselors serving military-connected individuals.",
    needCategoryIds: ["mental-health", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free — recipients \"will never have to pay for any of our services\"",
    geographicScope: "Nationwide — four U.S. service regions",
    eligibility: "Service members and veterans with mobility issues or diagnosed PTSD or TBI; staff determine fit through an application process",
    phone: "844-700-7297",
  },
  {
    name: "Freedom Service Dogs of America",
    url: "https://freedomservicedogs.org/",
    description:
      "Rescues and trains service dogs for veterans, active-duty military, and first responders living with PTSD, plus adults with mobility limitations and young adults with autism — hundreds of client-dog teams since 1987.",
    needCategoryIds: ["mental-health", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Disabled"],
    cost: "Free — service dogs and lifetime client support are provided at no cost to those served",
    geographicScope: "Nationwide (headquarters in Englewood, Colorado)",
    eligibility: "Veterans, active-duty military, and first responders with PTSD; adults with mobility limitations; young adults with autism",
    phone: "303-922-6231",
  },
  {
    name: "Blue H.E.L.P.",
    url: "https://bluehelp.org/",
    description:
      "National nonprofit that reduces mental health stigma in law enforcement through education, maintains the largest database of officers lost to suicide, and supports their families after a loss.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Corrections", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide",
  },
  {
    // NOTE: law-enforcement-specific; First H.E.L.P. is the all-discipline parent umbrella — kept as two entries because both orgs maintain distinct sites and programs.
    name: "First H.E.L.P.",
    url: "https://1sthelp.org/",
    description:
      "National 501(c)(3) that reduces first-responder mental-health stigma, supports families after a first-responder suicide, and maintains the largest known database of first responders lost to suicide — police and corrections since 2016, fire, EMS and dispatch since 2021. Runs the congressionally recognized National First Responder Suicide Awareness Days each September.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free — family support, honor walls and data are free; Camp April children's camp is cost-free for affected families",
    geographicScope: "Nationwide",
  },
  {
    name: "One More Wave",
    url: "https://onemorewave.com/",
    description:
      "Surf nonprofit funding custom adaptive surfboards and surf therapy for veterans from coast to coast, with local chapters in CA, HI, NC, VA, and FL; 748 grants awarded since 2015.",
    needCategoryIds: ["mental-health", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "National reach; chapters in CA, HI, NC, VA, FL",
    eligibility: "Wounded and disabled veterans",
    // TODO(verify): participant cost and chapter meeting schedule.
  },
  {
    name: "The SWEL",
    url: "https://theswel.org/",
    description:
      "Provides free surf missions for uniformed heroes, first responders, active-duty military, and veterans from across the country.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free — free surf missions for uniformed heroes (stated on the org's own site)",
    geographicScope: "National (participants from across the country)",
    eligibility: "Uniformed heroes, first responders, active-duty military, and veterans",
    // TODO(verify): mission dates/locations; no phone published (contact is info@theswel.org only).
  },
  {
    // TODO(verify): current-year camp dates and phone number.
    name: "Waves of Impact",
    url: "https://wavesofimpact.com/veterans",
    description:
      "Adaptive surf-camp programs for wounded veterans held in California, Texas, New Jersey, and Massachusetts at no cost to participants.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — no cost to participants (stated on the org's own site)",
    geographicScope: "Multi-state (CA, TX, NJ, MA)",
    eligibility: "Wounded veterans",
  },
  {
    // TODO(verify): current session schedule and that Hawaii satellite operations are active.
    name: "Jimmy Miller Memorial Foundation",
    url: "https://jimmymillerfoundation.org/",
    description:
      "Runs military ocean-therapy sessions — surfing, ocean safety, and water confidence — free of charge for veterans, active-duty military, and first responders from San Diego up the coast to Oregon, with satellite operations in Hawaii.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free — military ocean-therapy sessions offered free of charge (stated on the org's own site)",
    geographicScope: "Multi-state (Southern/Central CA to Oregon, plus Hawaii satellite operations)",
    eligibility: "Military (veterans and active duty) and first responders",
    phone: "424-290-1953",
  },
  {
    // TODO(verify): participant cost and chapter event calendar — site is a client-rendered SPA; facts sourced from the org's own published policy PDF.
    name: "AmpSurf",
    url: "https://ampsurf.org/",
    description:
      "Adaptive-surfing nonprofit with chapters in California, New England, New York, and the Pacific Northwest (plus a Puerto Rico program), teaching adaptive surfing to disabled veterans and first responders.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Multi-chapter (CA, New England, NY, Pacific Northwest; Puerto Rico program)",
    eligibility: "Disabled veterans and first responders (per the org's own published policy)",
    phone: "805-295-5000",
    hours: "Wednesday-Friday, Pacific Time (office hours per the org's own site)",
  },
  {
    // TODO(verify): cost is not stated on pathintl.org and varies by member center — confirm typical veteran-program pricing before publishing.
    name: "PATH International — Equine Services for Heroes®",
    url: "https://pathintl.org/programs/veterans/",
    description:
      "Accreditation body behind Equine Services for Heroes®, PATH Intl. works to make mounted and unmounted equine-assisted services available to any veteran or military personnel within or near their home communities, with certified instructors trained to serve veterans and referral relationships in all U.S. territories; its Find a Program tool searches member centers nationwide.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own site — pricing is set by each PATH Intl. member center",
    geographicScope: "Nationwide (member centers across the U.S. and all U.S. territories)",
    eligibility: "Veterans and military personnel, served through PATH Intl. member centers in or near their home community; VA education benefits can reimburse CTRI/ESMHL certification exam fees for veterans, servicemembers, National Guard, Selected Reserve, and eligible dependents",
    phone: "800-369-7433",
  },
  {
    // TODO(verify): cost is not stated on eagala.org — confirm how veterans are quoted/charged by designated providers.
    name: "Eagala Military Services",
    url: "https://www.eagala.org/equine-therapy-veterans/",
    description:
      "Eagala's Military Services Designation credentials equine-assisted psychotherapy providers with mandatory military-culture and clinical training (30 hours each) for active duty, reserves, veterans and their families; its Find A Program tool locates designated providers.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own site — session fees are set by individual Eagala providers",
    geographicScope: "Nationwide (Eagala provider network; association based in Fort Myers, FL)",
    eligibility: "Active duty, reserves, veterans, and their families seeking the Eagala Model with military-designated providers",
    phone: "801-754-0400",
  },
  {
    name: "BraveHearts",
    url: "https://braveheartsriding.org/",
    description:
      "Illinois/Wisconsin nonprofit that describes itself as the largest equine-assisted services program for veterans in the country, offering recreational riding plus mental health and wellness therapy while serving veterans nationwide and helping veterans outside IL/WI get connected to a center near them.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Free — all services are offered at no cost to the veteran and one accompanying immediate family member or caregiver",
    geographicScope: "Nationwide (serves veterans nationwide; program sites in Illinois and Wisconsin)",
    eligibility: "Veterans, plus one accompanying immediate family member or caregiver; veterans who do not live in IL or WI are helped to find a center near them",
    phone: "815-943-8226",
  },
  {
    // TODO(verify): cost, phone, and where/how the equine programs are delivered are not stated on houndsandheroes.org — confirm before treating as fully production-checked.
    name: "Hounds & Heroes",
    url: "https://www.houndsandheroes.org/",
    description:
      "National nonprofit founded in 2011 that rescues animals and serves veterans, active-duty members, first responders and military families through service/therapy dog placements, equine therapy with rescued horses, outreach and disaster relief, with locations in Los Angeles and San Francisco, CA and Dallas, TX.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide (locations in Los Angeles and San Francisco, CA and Dallas, TX; own site states 'Serving Veterans Nationwide' since 2015)",
    eligibility: "Veterans, active-duty military, first responders, and military families",
  },
  {
    // TODO(verify): the own-site affiliates page lists facilities in 13 states but does not state which deliver veteran/first-responder programming — confirm affiliate coverage before relying on it.
    name: "Horses4Heroes",
    url: "https://horses4heroes.org/",
    description:
      "Las Vegas nonprofit (The Ranch Las Vegas) offering mental health and wellness programs with horses for veterans and first responders with PTSD — including the Back in the Saddle™ workshop for veterans with PTS/MST/TBI and family members — alongside affordable youth camps, supported by a network of affiliates listed in 13 states.",
    needCategoryIds: ["mental-health", "outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Free for veterans and first responders with PTSD (funded by grants, donations and sponsorships); other ranch programs are fee-based",
    geographicScope: "Nationwide (flagship ranch in Las Vegas, NV plus affiliate locations in 13 states)",
    eligibility: "Veterans, first responders, active duty members and their families; kids' programs are for children of active duty, veterans and first responders",
    phone: "702-645-8446",
  },
  {
    // TODO(verify): cost is set by individual partner programs and is not stated on horsesformentalhealth.org.
    name: "Horses for Mental Health",
    url: "https://horsesformentalhealth.org/",
    description:
      "National 501(c)(3) that expands access to equine-assisted mental health services through its Find a Program directory, partner funding and awareness campaigns, and a VA Adaptive Sports Grant that expanded life-changing services to U.S. veterans across the country in 2024; its fifth annual campaign united 130 organizations across 36 states and six countries.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Civilian Supporter"],
    cost: "Not stated on the org's own site — HMH funds and lists partner programs that set their own fees",
    geographicScope: "Nationwide (find-a-program directory; partner campaign across 36 states and six countries)",
    eligibility: "Anyone can search the directory; veterans are served through VA Adaptive Sports Grant-funded partner programs",
  },

  // ---------------------------------------------------------------------
  // Outdoor Programs
  // ---------------------------------------------------------------------
  {
    name: "Camp HERO",
    url: "https://www.campheroky.org/activities",
    description:
      "All-volunteer nonprofit running multi-day Appalachian Mountain retreats — hiking, ATV riding, fishing, campfire fellowship — for wounded veterans and first responders, at no cost to participants.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Free",
    geographicScope: "Kentucky / regional retreats",
  },
  {
    name: "Warriors Renewal Coalition — Rest, Reset, Renewal",
    url: "https://www.warriorsrenewalcoalition.org/rest-reset/",
    description:
      "Fully-funded resort-style retreats (flights, lodging, meals, activities included) for combat-injured post-9/11 veterans, couples, and caregivers to reconnect and decompress.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Destination retreats",
  },
  {
    name: "Huts for Vets",
    url: "https://www.hutsforvets.org/",
    description:
      "No-cost wilderness therapy retreats in the Colorado Rockies — guided hikes, group discussion, and community — to support veterans' mental, physical, and emotional health.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free",
    geographicScope: "Colorado",
  },
  {
    name: "Project Healing Waters Fly Fishing",
    url: "https://projecthealingwaters.org/",
    description:
      "Fly fishing, fly tying, rod building, mentoring, and outings for military and veterans — equipment and instruction provided at no cost through local chapters.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free",
    geographicScope: "Nationwide chapters",
  },
  {
    name: "Heroes on the Water",
    url: "https://heroesonthewater.org/",
    description:
      "Kayak fishing and outdoor recreation therapy for veterans, first responders, and their families through local chapters nationwide.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Nationwide chapters",
  },
  {
    name: "Outward Bound Veterans Expeditions",
    url: "https://www.outwardbound.org/find-a-program/enroll-in-a-course/veterans/",
    description:
      "Tuition-supported wilderness expeditions and transition-focused courses for veterans and active-duty service members.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Free / commitment fee may apply",
    geographicScope: "Multiple U.S. regions",
  },
  {
    name: "No Barriers Warriors",
    url: "https://nobarriersusa.org/warriors/",
    description:
      "Multi-phase outdoor challenge and personal-development programs for veterans with a VA disability rating.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Nationwide / destination",
  },

  {
    name: "Sierra Club Military Outdoors",
    url: "https://www.sierraclub.org/military-outdoors",
    description:
      "Sierra Club program running outdoor outings — camping, hiking, climbing, and paddling — for veterans, service members, and their families through local chapter events nationwide.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — chapter-run outings are offered free of charge to veterans, service members, and families",
    geographicScope: "Nationwide — Sierra Club chapter events",
  },
  {
    // TODO(verify): confirm whether Military Families Outdoors participants pay anything — the program page does not state cost.
    name: "Wilderness Inquiry — Military Families Outdoors",
    url: "https://wildernessinquiry.org/",
    description:
      "Nonprofit behind the Military Families Outdoors program (launched 2024 with the Defense Health Agency, National Park Service, and Blue Star Families) that brings service members and their families to outdoor experiences at national parks — 9,000+ participants at 43 NPS sites in its pilot year.",
    needCategoryIds: ["outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated for the Military Families Outdoors program — general Wilderness Inquiry trips are paid (from about $65) with financial aid available",
    geographicScope: "Nationwide — 40+ communities and national park sites",
  },
  {
    // NOTE: national entry — four regional Team River Runner chapter entries (Kentucky Central, Fort Belvoir, Boise, Southern Maryland) already exist in the regional blocks below.
    name: "Team River Runner",
    url: "https://www.teamriverrunner.org/",
    description:
      "Largest adaptive and therapeutic paddling program in the nation for veterans, active duty, and their families — local chapters plus national and regional clinics, certification training, adaptive series, and virtual training.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family", "Disabled"],
    cost: "Free — all programming is free of charge for veterans and service members",
    geographicScope: "Nationwide — chapters, regional coordinators, and national clinics",
  },
  {
    // TODO(verify): confirm phone number; participants are matched to events near home per the org's site.
    name: "Wake for Warriors",
    url: "https://www.wakeforwarriors.org/",
    description:
      "All-volunteer nonprofit running therapeutic wakeboarding and wakesurf events for wounded veterans and their families, with a 2026 schedule of events across roughly 19 states, plus multi-day adaptive ski and snowboard events with partner providers (NSCD at Winter Park, Challenge Aspen at Aspen, Park City, UT) that include adaptive equipment rental, coaching, lodging, and meals.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family"],
    cost: "Free — no cost for veterans and military personnel to participate (stated on the org's own site)",
    geographicScope: "National event-based (2026 wake events in ~19 states; winter events in CO and UT)",
    eligibility: "Veterans and active-duty military; personnel with service-related injuries have priority — participants may have physical disabilities, PTSD, or traumatic brain injury",
    availability: "Application-based; 2026 event schedule published by state, plus an annual winter event series",
  },
  {
    name: "Warrior Sailing",
    url: "https://warriorsailing.org/",
    description:
      "National adaptive sailing program offering camps and clinics for wounded, ill, and injured service members and veterans.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Nationwide camps and clinics",
    eligibility: "Wounded, ill, and injured service members and veterans",
    phone: "269-598-7119",
    // TODO(verify): participant cost is not published on the org's own site; confirm camp schedule.
  },
  {
    // TODO(verify): cost of team participation and current season schedule.
    name: "US Patriot Sailing",
    url: "https://uspatriotsailing.org/",
    description:
      "Sailing program open to all veterans and active duty, with teams in Annapolis and Solomons, Maryland; San Diego and Los Angeles, California; and Seattle and Tacoma, Washington, plus no-cost ASA sailing courses for participating veterans.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "No-cost ASA sailing courses for participating veterans; other participation costs not stated on the org's own site",
    geographicScope: "Multi-state (MD, CA, WA)",
    eligibility: "All veterans and active duty",
  },
  {
    // TODO(verify): explicit eligibility wording, retreat schedule, and phone number.
    name: "Wind Sports for Wounded Warriors",
    url: "https://ws4ww.org/",
    description:
      "Free, community-driven adaptive wind-sports retreats — kiteboarding, sailing, wakesurfing, and foiling — held along the East Coast (NC, SC, GA, FL).",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — free, community-driven programs (stated on the org's own site)",
    geographicScope: "Multi-state East Coast retreats (NC, SC, GA, FL)",
  },
  {
    // TODO(verify): nationwide availability (program is trip-based from a California HQ) and participant cost.
    name: "WAVES Project",
    url: "https://wavesproject.org/",
    description:
      "Temecula, California-based nonprofit providing adaptive scuba experiences for wounded American veterans and a companion, with trips to Nevada, Florida, and Hawaii.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Multi-state trips (NV, FL, HI); HQ in Temecula, CA",
    eligibility: "Wounded American veterans, each accompanied by a companion",
    phone: "951-308-0049",
  },
  {
    // TODO(verify): phone number and current affiliate-dive-shop list.
    name: "Patriots for Disabled Divers",
    url: "https://patriotsfordisableddivers.org/",
    description:
      "Covers 100% of the cost to train disabled veterans to scuba dive through a network of 16 affiliate dive shops nationwide.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — covers 100% of dive-training cost for disabled veterans (stated on the org's own site)",
    geographicScope: "National network of 16 affiliate dive shops",
    eligibility: "Injured veterans with a VA disability rating of 30% or higher (per the org's own blog)",
  },
  {
    // TODO(verify): participant cost and full list of domestic program locations (own-site /military-wounded page 404s).
    name: "Diveheart",
    url: "https://diveheart.org/",
    description:
      "Adaptive-scuba nonprofit serving people with disabilities including veterans, with trips to Key Largo, Florida and international destinations and a training-affiliate network.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Multi-state (HQ Downers Grove, IL; trips in FL plus international)",
    eligibility: "People with disabilities, including veterans with disabilities (per the org's mission)",
    phone: "630-964-1983",
  },
  {
    // TODO(verify): participant cost, phone number, and full chapter list.
    name: "VetsBoats",
    url: "https://vetsboats.org/",
    description:
      "Builds a nationwide network of chapters and partner vessels to heal veterans through on-the-water camaraderie, with partner boats in San Francisco Bay, San Diego, Springfield, Ohio, and Annapolis; 1,000+ veterans served.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "National chapter/affiliate network (partner vessels in CA, OH, MD)",
    eligibility: "Veterans and their families; focus on veterans healing from PTSD and addiction",
  },
  {
    name: "Freedom Waters Foundation",
    url: "https://freedomwatersfoundation.org/programs/for-veterans",
    description:
      "Offers no-cost therapeutic boating, sailing, and fishing experiences for veterans, active-duty military, and their families — year-round in Southwest and Southeast Florida with yearly events in Georgia and Indiana.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — every experience is offered at no cost (stated on the org's own site)",
    geographicScope: "Multi-state (FL year-round; GA and IN yearly)",
    eligibility: "Veterans, active-duty military, and their families — all ages, backgrounds, and abilities; no prior boating experience required",
    availability: "Year-round events in Southwest and Southeast Florida, with yearly events in Georgia and Indiana",
    phone: "239-263-2377",
    // TODO(verify): transportation to trips is not provided (per the org's FAQ).
  },
  {
    // TODO(verify): own-site events calendar was empty at verification time and sister domain sudsdiving.org was unreachable — confirm current trip schedule before treating as fully production-checked.
    name: "SUDS — Servicemembers Undertaking Disabled Sports",
    url: "https://sudsusa.org/",
    description:
      "501(c)(3) providing adaptive/adventure sports — including snow skiing, scuba, rock climbing, and mountain biking — to wounded, injured, and ill Iraq/Afghanistan veterans and to post-9/11 police, firefighters, and EMTs. Trips cover airfare, lodging, meals, and training expenses.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled", "First Responder", "Law Enforcement", "Fire", "EMS"],
    cost: "Free — there is no cost to the service members (stated on the org's own site)",
    geographicScope: "Nationwide recruitment — trips originate from the org's San Antonio, TX base",
    eligibility: "Wounded, injured, and ill veterans who served in Iraq and Afghanistan, plus post-9/11 police, firefighters, and EMTs",
    availability: "Multiple adventure trips per year across disciplines; see the org's events calendar",
    phone: "210-303-2181",
  },
  {
    name: "No Boundaries Military — Winter Trip",
    url: "https://www.noboundariesmilitary.org/winter-trip/",
    description:
      "Six-day adaptive winter trip at Snowbird, Utah with Wasatch Adaptive Sports — adaptive downhill skiing, snowboarding, mono-skiing, ski-biking, and snow tubing — with travel, meals, lodging, and activities covered for combat-wounded veterans recruited nationwide.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — all expenses paid, including flights, meals, lodging, and activities (stated on the org's own site)",
    geographicScope: "Destination trip — Snowbird, UT; recruits combat-wounded veterans nationwide",
    eligibility: "Active duty or retired combat-wounded veterans who are independent in their care (e.g., amputees, PTSD, TBI)",
    availability: "2027 winter trip: Feb 28 – Mar 5, 2027",
  },
  {
    name: "Vail Veterans Program — Winter Therapeutic Outdoor Programs",
    url: "https://www.vailveteransprogram.org/programs/",
    description:
      "Winter programs at Vail Mountain providing private adaptive ski, snowboard, and ski-bike instruction for wounded service members plus group lessons for spouses, caregivers, and children — part of the org's year-round therapeutic outdoor programming for military families.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Free — winter programs provided at no cost to participants",
    geographicScope: "Destination programs — Vail, CO; serves wounded military families recruited nationwide",
    eligibility: "Wounded/injured military service members and their spouses, caregivers, and children",
    availability: "Annual winter programs (2026: Winter Family Program in January, Winter Mountain Adventure Mar 1–6); dates published per season",
  },
  {
    name: "Unbroken Spirit — Adaptive Sports Program",
    url: "https://unbrokenspirit.org/what-we-do/adaptive-sports-program/",
    description:
      "Yearlong veteran program whose in-person phase is a 7-day adaptive sports week at the National Ability Center in Park City, Utah — alpine ski/snowboard days, a Nordic ski and snowshoe yurt excursion, biathlon, and sled hockey — bracketed by virtual training and mentorship phases.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free — the program is completely free including travel expenses (stated on the org's own site)",
    geographicScope: "Nationwide — virtual phases open nationwide; in-person week in Park City, UT",
    eligibility: "Any veteran or active-duty military member (no disability rating or proof-of-service requirement stated); adaptive sports applicants must provide documented proof of their condition on request; teams of 12–15",
    availability: "Team 1 – 2027: Phase 1 Jan 6 – Mar 17 (virtual), Phase 2 Mar 19–25 in Park City, Phase 3 Mar 31 – Sep 29 (virtual)",
  },

  // ---------------------------------------------------------------------
  // Family Support
  // ---------------------------------------------------------------------
  {
    name: "Willing Warriors — Warrior Retreat at Bull Run",
    url: "https://www.willingwarriors.org/warrior-retreat",
    description:
      "A 37-acre, fully handicapped-accessible respite retreat in Northern Virginia where wounded, injured, and ill service members and their families get a therapeutic break from the hospital environment.",
    needCategoryIds: ["family-support", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family"],
    cost: "Free",
    geographicScope: "Virginia / regional",
  },
  {
    name: "Wounded Warriors Family Support (WWFS)",
    url: "https://www.wwfs.org/familyretreats/",
    description:
      "Not affiliated with Wounded Warrior Project. Restorative family retreats and staycations, plus vehicle grants and caregiver support, for the families of those wounded, injured, or killed in combat.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Free / grant",
    geographicScope: "Nationwide",
  },
  {
    name: "Project Sanctuary",
    url: "https://projectsanctuary.us/",
    description:
      "Six-day therapeutic family retreats blending outdoor recreation with counseling and relationship-building, plus two years of follow-on family support, for veterans, spouses, caregivers, and children.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Nationwide / retreat-based",
  },
  {
    name: "Operation Second Chance",
    url: "https://operationsecondchance.org/retreats/",
    description:
      "All-inclusive retreats — individual, couples, family, caregiver, and Gold Star Family — for combat-wounded, injured, and ill service members to relax and reconnect outside hospital settings.",
    needCategoryIds: ["family-support", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family", "Caregiver", "Gold Star"],
    cost: "Free / sponsored",
    geographicScope: "Nationwide / event-based",
  },
  {
    name: "Elizabeth Dole Foundation — Hidden Heroes",
    url: "https://www.elizabethdolefoundation.org/",
    description:
      "Peer support, resources, advocacy, and financial assistance built specifically for military and veteran caregivers — a group that often doesn't think to search for help meant for them.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Active Military", "Caregiver", "Family"],
    cost: "Free / grant",
    geographicScope: "Nationwide",
  },
  {
    name: "Fisher House Foundation",
    url: "https://www.fisherhouse.org/",
    description:
      "No-cost lodging near military and VA medical centers for the families of patients receiving care, so they can stay close during treatment.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Nationwide + overseas military locations",
  },
  {
    name: "Concerns of Police Survivors (C.O.P.S.)",
    url: "https://www.concernsofpolicesurvivors.org/",
    description:
      "Peer support, retreats, survivor services, and agency training for those affected by a line-of-duty law enforcement death.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Law Enforcement", "Family", "Coworker", "Survivor"],
    cost: "Free / no membership fee",
    geographicScope: "Nationwide",
  },
  {
    name: "First Responders Children's Foundation",
    url: "https://1strcf.org/",
    description:
      "Financial assistance, bereavement support, scholarships, and family mental-health programs for the children and families of first responders.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "First Responder", "Family"],
    cost: "Grant / free support",
    geographicScope: "Nationwide; some counseling limited by state",
  },
  {
    name: "National Fallen Firefighters Foundation",
    url: "https://www.firehero.org/",
    description:
      "Family support, peer groups, retreats, and line-of-duty-death resources for the families and colleagues of fallen firefighters.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Fire", "Family", "Coworker", "Survivor"],
    cost: "Free",
    geographicScope: "Nationwide",
  },
  {
    name: "TAPS — Tragedy Assistance Program for Survivors",
    url: "https://www.taps.org/",
    description:
      "24/7 survivor support, grief programs, peer care, and benefits navigation for anyone grieving the death of a military or veteran loved one — regardless of cause or how long ago.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Nationwide",
  },

  {
    name: "Our Military Kids",
    url: "https://www.ourmilitarykids.org/",
    description:
      "National nonprofit that has awarded $38 million in extracurricular activity grants — 107,000 grants total — covering sports, arts, and tutoring for children ages 1–18 of deployed National Guard/Reserve members and of post-9/11 combat-wounded, ill, or injured veterans in treatment.",
    needCategoryIds: ["family-support", "sports-fitness"],
    audienceTags: ["Guard/Reserve", "Veteran", "Disabled", "Family"],
    cost: "Free — extracurricular activity grants cover the child's program fees",
    geographicScope: "Nationwide",
    eligibility: "Children ages 1–18 of deployed National Guard or Reserve members, or of veterans receiving care for combat-related injuries or illnesses",
  },
  {
    // TODO(verify): USO's own site frames support as donor-driven rather than explicitly stating "free" — confirm phrasing before publishing a firmer cost claim.
    name: "USO",
    url: "https://www.uso.org/",
    description:
      "Since 1941, the USO has supported service members and military families through a global network of 260+ centers, programs and 27,000 volunteers — from airport lounges and deployment support to one-on-one transition coaching; programs were used 11.7+ million times in 2025.",
    needCategoryIds: ["family-support", "purpose-community", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Veteran", "Military Spouse", "Family", "Caregiver"],
    cost: "Free to service members and military families — donor-funded",
    geographicScope: "Nationwide and overseas (260+ centers at airports and military installations)",
  },
  {
    // NOTE: national parent organization — a Blue Star Families — Maryland chapter entry is already listed in the regional blocks below.
    name: "Blue Star Families",
    url: "https://bluestarfam.org/",
    description:
      "Nationwide nonprofit building community for military and veteran families through local chapters, the Blue Star Neighborhood digital community, spouse career programs, caregiver and peer-support networks, and Blue Star Outdoors — 450,000+ members reaching 1.5 million military family members annually.",
    needCategoryIds: ["family-support", "purpose-community", "career-education", "outdoor-programs"],
    audienceTags: ["Active Military", "Veteran", "Military Spouse", "Family", "Caregiver", "Civilian Supporter"],
    cost: "Free — membership is free and everyone is welcome",
    geographicScope: "Nationwide — 16 local chapters plus a nationwide digital community",
    phone: "202-630-2583",
  },
  {
    name: "National Military Family Association",
    url: "https://www.militaryfamily.org/",
    description:
      "Serving military families since 1969, runs the free Operation Purple summer camp for children ages 7–17, the Bloom military teen program, and military spouse scholarships of $500–$2,500, advocating for families across all uniformed services.",
    needCategoryIds: ["family-support", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Military Spouse", "Family", "Veteran"],
    cost: "Free — Operation Purple camp has no cost to families; spouse scholarships of $500–$2,500 are awarded",
    geographicScope: "Nationwide",
    eligibility: "Families of all uniformed services — Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force, National Guard, Reserve, NOAA, and Public Health Service",
    phone: "703-931-6632",
  },
  {
    name: "Armed Services YMCA",
    url: "https://www.asymca.org/",
    description:
      "Provides no- or low-cost programs for active-duty military families, especially junior enlisted ranks, including the free Operation Little Learners early-learning program, Operation Kid Comfort quilts, and food assistance.",
    needCategoryIds: ["family-support", "financial-assistance"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free / low-cost — programs are no- or low-cost, with some (like Operation Little Learners) free",
    geographicScope: "Nationwide",
  },
  {
    // TODO(verify): militarychild.org's home page 404'd on direct fetch during research; confirmed active via search snippets — recheck the URL before publishing.
    name: "Military Child Education Coalition",
    url: "https://www.militarychild.org/",
    description:
      "Serves the children of those who serve, connecting them to schools, organizations and resources so they can be college-, work- and life-ready, including free parent webinars.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family"],
    cost: "Free — webinars and most resources are free",
    geographicScope: "Nationwide",
  },
  {
    name: "Operation Shower",
    url: "https://www.operationshower.org/",
    description:
      "Hosts joyful group baby showers for military families nationwide, celebrating expectant moms and delivering community and support for families navigating pregnancy and parenthood while serving.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family", "Military Spouse", "Active Military", "Guard/Reserve"],
    cost: "Free for participating families — donor-funded",
    geographicScope: "Nationwide",
  },
  {
    name: "United Through Reading",
    url: "https://unitedthroughreading.org/",
    description:
      "Keeps military families connected during separation by recording deployed service members reading storybooks aloud for their children, supported by a free app and literacy resources.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family", "Active Military", "Guard/Reserve"],
    cost: "Free for military families",
    geographicScope: "Nationwide — recordings available worldwide",
  },
  {
    name: "Sesame Street for Military Families",
    url: "https://sesamestreetformilitaryfamilies.org/",
    description:
      "Free bilingual resources and videos from Sesame Workshop that help military and veteran families — especially young children — navigate deployments, homecomings, relocation, injuries and grief.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family"],
    cost: "Free",
    geographicScope: "Nationwide — online self-serve resources",
  },
  {
    name: "The Comfort Crew for Military Kids",
    url: "https://www.comfortcrew.org/",
    description:
      "Has impacted more than 1 million military children, delivering 450,000+ comfort kits and school presentations that help kids navigate deployments, moves and reintegration.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family"],
    cost: "Free for military kids and families",
    geographicScope: "Nationwide",
  },
  {
    name: "Military Family Advisory Network",
    url: "https://www.mfan.org/",
    description:
      "Researches military family needs and runs direct programs like PCS Pantry Restock, which sends grocery gift cards to families undergoing costly permanent-change-of-station moves to combat food insecurity.",
    needCategoryIds: ["family-support", "financial-assistance"],
    audienceTags: ["Family", "Active Military", "Guard/Reserve"],
    cost: "Free for participating families",
    geographicScope: "Nationwide",
  },
  {
    // NOTE: program of the Gary Sinise Foundation — the foundation itself is listed under Housing & Transportation; kept separate because Snowball Express has its own eligibility and application.
    name: "Snowball Express (Gary Sinise Foundation)",
    url: "https://www.garysinisefoundation.org/snowball-express",
    description:
      "Five-day healing and remembrance experience for children and surviving spouses of fallen military and first-responder heroes at Walt Disney World Resort — 28,057 loved ones served to date.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family", "Gold Star", "Survivor", "Military Spouse"],
    cost: "No cost to participating families — donor-funded",
    geographicScope: "Nationwide — events at Walt Disney World Resort plus community events nationwide",
    eligibility: "Families of a fallen military or first responder hero who served on or after 9/11",
    phone: "888-708-7757",
  },
  {
    // TODO(verify): membership dues amount (approximately $80/year from research notes) is not confirmed on goldstarwives.org — confirm before publishing.
    name: "Gold Star Wives of America",
    url: "https://www.goldstarwives.org/",
    description:
      "National membership organization supporting surviving spouses of fallen service members through advocacy, community and connection.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Gold Star", "Survivor", "Military Spouse"],
    cost: "Membership-based — dues amount not confirmed on the org's own site",
    geographicScope: "Nationwide",
  },
  {
    name: "FOCUS",
    url: "https://www.focusproject.org/",
    description:
      "Families OverComing Under Stress provides resilience training to military children, families and couples, teaching practical skills to communicate, adapt and thrive through stress and change.",
    needCategoryIds: ["family-support", "mental-health"],
    audienceTags: ["Family", "Active Military", "Guard/Reserve", "Veteran"],
    cost: "Free — program of the DoD Office of Military Community & Family Policy",
    geographicScope: "Nationwide — military installations and online",
  },
  {
    // NOTE: national parent entry — a Folds of Honor — Iowa Chapter entry is already listed in the regional blocks below.
    name: "Folds of Honor",
    url: "https://foldsofhonor.org/",
    description:
      "Provides K-12 and higher-education scholarships to spouses and children of fallen or disabled U.S. service members and first responders — more than 73,000 scholarships awarded since 2007, based on unmet need.",
    needCategoryIds: ["family-support", "career-education"],
    audienceTags: ["Veteran", "Disabled", "First Responder", "Family", "Survivor", "Gold Star", "Military Spouse"],
    cost: "Not applicable — scholarship funds are awarded based on unmet need; no cost to apply",
    geographicScope: "Nationwide",
    eligibility: "Spouses and/or dependents of fallen or disabled U.S. service members, or of fallen or catastrophically injured first responders; higher-education awards require a 2.0 term GPA",
    availability: "Annual application window — February 1 through March 31; award notifications emailed by end of July",
    phone: "918-274-4700",
    hours: "Monday–Friday, 8 AM–5 PM Central",
  },

  // ---------------------------------------------------------------------
  // Purpose & Community
  // ---------------------------------------------------------------------
  {
    name: "wear blue: run to remember",
    url: "https://www.wearblueruntoremember.org/",
    description:
      "Weekly no-cost community runs plus a Gold Star & Survivor Endurance Program, built around remembrance and peer support for military families, veterans, and Gold Star families.",
    needCategoryIds: ["purpose-community", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Gold Star", "Family", "Civilian Supporter"],
    cost: "Free / varies by event",
    geographicScope: "Nationwide",
  },
  {
    name: "9/11 Heroes Run — Travis Manion Foundation",
    url: "https://www.travismanion.org/events/911-heroes-run",
    description:
      "Nationwide 5K series across 100+ communities each September, honoring 9/11 and the veterans and first responders who've served since, from the Travis Manion Foundation.",
    needCategoryIds: ["purpose-community", "sports-fitness"],
    audienceTags: ["Veteran", "First Responder", "Family", "Civilian Supporter"],
    cost: "Registration fee / fundraising",
    geographicScope: "Nationwide",
  },
  {
    name: "Team Rubicon",
    url: "https://teamrubiconusa.org/",
    description:
      "Veteran-led disaster-response volunteering — training, deployment, and a service-oriented community built for the next mission after military service.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Civilian Supporter"],
    cost: "Free to volunteer",
    geographicScope: "Nationwide",
  },
  {
    name: "The Mission Continues",
    url: "https://www.missioncontinues.org/",
    description:
      "Veteran-led community service platoons and leadership programs — a structured way to keep serving locally after leaving the military.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Civilian Supporter"],
    cost: "Free",
    geographicScope: "Nationwide / city-based",
  },

  {
    name: "IAVA",
    url: "https://www.iava.org/",
    description:
      "Founded in 2004, nonpartisan national organization supporting post-9/11 veterans through community and peer support, career programs and policy advocacy.",
    needCategoryIds: ["purpose-community", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Free to join",
    geographicScope: "Nationwide",
  },
  {
    // NOTE: merged from separate purpose and legal research passes — the Legion's accredited service officers, benefits help and Be The One mission are one organization-wide entry rather than near-duplicates.
    name: "The American Legion",
    url: "https://www.legion.org/",
    description:
      "Chartered in 1919 and the nation's largest veterans service organization, providing free help understanding and applying for benefits through accredited service officers and appeals representatives — $23 billion minimum in federal benefits secured for veterans in FY2025 — plus local posts and the \"Be The One\" suicide-prevention mission.",
    needCategoryIds: ["purpose-community", "legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — benefits assistance from accredited service officers; membership dues vary by post",
    geographicScope: "Nationwide — local posts with a Find a Service Officer locator",
  },
  {
    // NOTE: merged from separate purpose, legal and financial research passes — claims help, Unmet Needs grants and post-based community are one organization-wide entry.
    name: "Veterans of Foreign Wars (VFW)",
    url: "https://www.vfw.org/",
    description:
      "Chartered in 1899, the VFW provides emergency financial-assistance grants of up to $2,500 — paid directly to creditors, not loans — to eligible active-duty service members including activated Guard and Reserve, plus free VA-claims help through more than 2,200 accredited service officers and direct support through its posts.",
    needCategoryIds: ["purpose-community", "legal-benefits", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Survivor"],
    cost: "Free — claims assistance is free of charge; Unmet Needs grants are paid directly to creditors (up to $2,500)",
    geographicScope: "Nationwide — local posts and 2,200+ accredited service officers",
    eligibility: "Financial assistance: active-duty service members, including activated National Guard and Reserve units; claims help is open to veterans, service members, families and survivors",
  },
  {
    name: "AMVETS",
    url: "https://www.amvets.org/",
    description:
      "Provides free assistance filing VA claims, plus career centers and programs supporting veterans' reintegration, delivered through local departments and posts nationwide.",
    needCategoryIds: ["purpose-community", "legal-benefits", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Free — VA claims assistance; membership-based organization",
    geographicScope: "Nationwide",
  },
  {
    name: "Vietnam Veterans of America",
    url: "https://www.vva.org/",
    description:
      "Serves and advocates for Vietnam-era veterans, offering claims and benefit counseling, Agent Orange exposure support and outreach programs through chapters nationwide.",
    needCategoryIds: ["purpose-community", "legal-benefits"],
    audienceTags: ["Veteran"],
    cost: "Membership-based — dues vary by chapter",
    geographicScope: "Nationwide",
  },
  {
    name: "RallyPoint",
    url: "https://www.rallypoint.com/",
    description:
      "The military's largest social and professional network, with 2 million registered members — combining peer discussion of military life with a job board and veteran-recruiting marketplace.",
    needCategoryIds: ["purpose-community", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Caregiver", "Military Spouse"],
    cost: "Free to join",
    geographicScope: "Nationwide — online",
  },
  {
    name: "Together We Served",
    url: "https://www.togetherweserved.com/",
    description:
      "Free-to-join online community of 2.6 million+ veteran members where veterans reconnect by unit, ship, squadron or era through unit pages, photo galleries and memorials.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free to join",
    geographicScope: "Nationwide — online",
  },
  {
    name: "Operation Gratitude",
    url: "https://www.operationgratitude.com/",
    description:
      "Has shipped 4 million+ care packages to service members, veterans and first responders over 23+ years, built by more than 250,000 volunteers each year.",
    needCategoryIds: ["purpose-community", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "First Responder", "Family"],
    cost: "Free for recipients — donation-funded",
    geographicScope: "Nationwide",
  },
  {
    name: "Soldiers' Angels",
    url: "https://www.soldiersangels.org/",
    description:
      "Provides free support including food assistance, holiday adopt-a-family programs, deployed-soldier care packages and letters, caregiver aid and virtual baby showers for veteran families.",
    needCategoryIds: ["purpose-community", "family-support", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Caregiver"],
    cost: "Free for those it serves",
    geographicScope: "Nationwide",
  },
  {
    name: "America's Warrior Partnership",
    url: "https://www.americaswarriorpartnership.org/",
    description:
      "Partners with communities to improve and save veteran lives through one-size-fits-one support — Community Integration, the AWP Network and local Warrior Partnership branches — with 7,874 cases closed at an 84% success rate.",
    needCategoryIds: ["purpose-community", "mental-health"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Free for veterans and families — donor-funded",
    geographicScope: "Nationwide — community branches",
  },

  // ---------------------------------------------------------------------
  // Career & Education
  // ---------------------------------------------------------------------
  {
    name: "Hire Heroes USA",
    url: "https://www.hireheroesusa.org/",
    description:
      "Free career coaching, résumé support, interview preparation, and job-search help for transitioning service members, veterans, and military spouses.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Free",
    geographicScope: "Nationwide / virtual",
  },
  {
    name: "American Corporate Partners",
    url: "https://www.acp-usa.org/",
    description:
      "One-on-one professional mentorship pairing veterans and active-duty spouses with experienced corporate mentors.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Free",
    geographicScope: "Nationwide / virtual",
  },
  {
    name: "IVMF — Onward to Opportunity",
    url: "https://ivmf.syracuse.edu/programs/career-training/",
    description:
      "Free career training and industry certifications for transitioning service members, veterans, and military spouses, run by Syracuse University's Institute for Veterans and Military Families.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse"],
    cost: "Free",
    geographicScope: "Nationwide / online",
  },
  {
    name: "Hiring Our Heroes",
    url: "https://www.hiringourheroes.org/",
    description:
      "U.S. Chamber of Commerce Foundation program offering fellowships, hiring events, career resources, and direct employer connections for the military community.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Free",
    geographicScope: "Nationwide",
  },

  {
    name: "SkillBridge",
    url: "https://skillbridge.osd.mil/",
    description:
      "Department of Defense program that lets service members in their final months of service work civilian jobs at approved industry partners as a full-time duty assignment during their last up to 180 days before separation, with hundreds of partner companies across career fields.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Active Military"],
    cost: "Free — DoD continues to pay military salary and benefits while the industry partner provides the on-the-job training",
    geographicScope: "Nationwide — partner opportunities at duty stations across the U.S.",
    eligibility: "Service members with 180 days or fewer remaining before separation, at least 180 continuous days of service, and commander approval",
  },
  {
    name: "Helmets to Hardhats",
    url: "https://helmetstohardhats.org/",
    description:
      "National program connecting veterans, transitioning service members, and Guard/Reserve members with registered apprenticeships and careers in the building trades — earn while you learn toward well-paid careers with wages, benefits, and GI Bill support usable during the apprenticeship.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve"],
    cost: "Free — no cost to job seekers; apprenticeships are paid employment",
    geographicScope: "Nationwide",
  },
  {
    name: "FourBlock",
    url: "https://fourblock.org/",
    description:
      "Nonprofit offering a free, ten-week Career Readiness Program that teaches veterans to build professional relationships and land meaningful careers, with spring and fall cohorts held both in person and online (serving veterans since 2010).",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Free",
    geographicScope: "Nationwide — in-person and virtual cohorts",
    availability: "Ten-week cohorts in spring and fall",
  },
  {
    name: "VET TEC 2.0",
    url: "https://www.va.gov/education/other-va-education-benefits/vet-tec-2/",
    description:
      "VA program that pays tuition and fees directly to approved technology-training providers (bootcamps, coding schools, certification courses) for eligible veterans and transitioning service members, plus a monthly housing allowance and book stipend — limited to 4,000 paid participants per fiscal year.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Free to participants — the VA pays tuition and fees directly and provides a monthly housing allowance and book stipend",
    geographicScope: "Nationwide — online and in-person providers",
    eligibility: "Veterans with other-than-dishonorable discharges or service members within 180 days of separating, with at least 36 months of active duty, and under age 62",
  },
  {
    name: "Tillman Scholars",
    url: "https://pattillmanfoundation.org/eligibility-and-compensation",
    description:
      "Merit-based scholarship covering full tuition, books, living expenses and more for military veterans, active-duty service members, Guard/Reserve members, and military spouses (including surviving spouses) pursuing full-time degrees — nearly 1,000 scholars supported to date, with up to 60 selected each year.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Survivor"],
    cost: "Scholarship — covers tuition, books and living expenses; no cost to apply",
    geographicScope: "Nationwide",
    eligibility: "Veterans, active-duty and Guard/Reserve service members, and military spouses (including surviving spouses) enrolled full-time",
    availability: "Annual selection cycle of up to 60 scholars",
  },
  {
    name: "VetsinTech",
    url: "https://vetsintech.org/",
    description:
      "National nonprofit connecting veterans, active-duty service members, and military spouses to technology careers through education (VIT Academy courses in cybersecurity, web development, data science, cloud, and AI), employment, and entrepreneurship — supported by 30+ local chapters.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Free — most classes and programs are offered at no cost to the military community",
    geographicScope: "Nationwide — 30+ chapters",
  },
  {
    name: "Operation Code",
    url: "https://operationcode.org/",
    description:
      "Largest community of military veterans, service members, and spouses pursuing software development careers — 15,000+ members get mentorship, scholarships, and tech-partner connections through a members-only Slack community and local meetups.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Free — membership is free",
    geographicScope: "Nationwide — online community with in-person meetups",
  },
  {
    name: "Code Platoon",
    url: "https://www.codeplatoon.org/",
    description:
      "Software engineering training for veterans, military spouses, and service members — a 15-week full-time immersive program or a 28-week evening/weekend program (fully remote options), plus a free self-paced intro-to-coding course.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Pay-What-You-Can scholarships cover up to 100% of tuition; VA education benefits accepted",
    geographicScope: "Nationwide — remote and in-person formats",
  },
  {
    name: "Post-9/11 GI Bill (Chapter 33)",
    url: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
    description:
      "VA education benefit providing up to 36 months of tuition and fees (full in-state tuition at public schools), a monthly housing allowance, and a yearly book stipend for service members and veterans with qualifying post-9/11 active duty — benefits can be transferred to dependents.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "VA-funded benefit — no cost to recipients; the benefit level is a percentage based on length of qualifying service",
    geographicScope: "Nationwide",
    eligibility: "At least 90 days of aggregate active duty on or after September 11, 2001 (or a Purple Heart after 9/11 with any length of honorable service, or 30 continuous days discharged with a service-connected disability), or a dependent using transferred benefits",
  },
  {
    // TODO(verify): job-seeker pricing (career-fair admission and profile costs) is not stated on recruitmilitary.com — confirm before publishing a firmer cost line.
    name: "RecruitMilitary",
    url: "https://recruitmilitary.com/",
    description:
      "Veteran-owned military-to-civilian recruiting company (30+ years) connecting veterans, transitioning service members, Guard/Reserve, and military spouses with employers through a job board, direct placement services, and more than 100 career fairs a year across 30+ cities, military bases, and virtual spaces.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse"],
    cost: "Not stated for job seekers on the org's own site — employers pay for recruiting, advertising, and career-fair services",
    geographicScope: "Nationwide",
  },
  {
    name: "Sentinels of Freedom",
    url: "https://www.sentinelsoffreedom.org/",
    description:
      "Helps wounded and transitioning veterans rebuild their lives with comprehensive support — including the Bridge for Education Program, Veterans' Resource Centers, mentoring and STEM tutoring grants.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for served veterans",
    geographicScope: "Nationwide",
  },
  {
    name: "Student Veterans of America",
    url: "https://studentveterans.org/",
    description:
      "National nonprofit helping veterans succeed in higher education through 1,500+ on-campus chapters, a free MySVA platform with 600,000+ peers, scholarships, career resources and an annual national conference.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — MySVA account and membership are free, including chapter tools, scholarships, and career benefits",
    geographicScope: "Nationwide — campus chapters",
  },
  {
    name: "Marine Corps Scholarship Foundation",
    url: "https://www.mcsf.org/",
    description:
      "The nation's oldest and largest provider of need-based scholarships to military children, covering post-high school, undergraduate, and career/technical programs — more than $260 million awarded since 1962; Children of the Fallen receive a guaranteed $30,000 over four years.",
    needCategoryIds: ["career-education", "family-support"],
    audienceTags: ["Family", "Gold Star", "Active Military", "Guard/Reserve", "Veteran"],
    cost: "Need-based scholarships of $2,500–$10,000 per academic year; no cost to apply",
    geographicScope: "Nationwide",
    eligibility: "Child or stepchild of an active, Reserve, or veteran Marine (honorable discharge) or Navy Corpsman/Chaplain/Religious Program Specialist attached to a Marine unit; minimum 2.00 GPA; family adjusted gross income of $134,000 or less (2025 tax year) for the 2027–2028 application",
    availability: "Application opens January 1, deadline March 1; award decisions emailed by May 31. Career & Technical Education scholarships accepted year-round",
    phone: "866-496-5462",
    hours: "Weekdays 9:00 AM – 5:00 PM Eastern, excluding holidays",
  },
  {
    name: "Military Officers Association of America (MOAA)",
    url: "https://www.moaa.org/",
    description:
      "Country's largest uniformed-services officers' association, providing career-transition resources (career fairs, résumé critiques, seminars), one-on-one benefits counseling, legislative advocacy, and dependent college scholarships through local councils and chapters.",
    needCategoryIds: ["career-education", "legal-benefits", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Survivor", "Military Spouse"],
    cost: "Membership tiers — Basic free; Premium $66/year; life membership varies by age; many advocacy resources and newsletters are public",
    geographicScope: "Nationwide — councils and chapters",
    eligibility: "Open to active duty, former, retired, and National Guard/Reserve commissioned and warrant officers of the uniformed services, and their surviving spouses",
    phone: "800-234-6622",
  },
  {
    name: "Microsoft Software & Systems Academy (MSSA)",
    url: "https://military.microsoft.com/mssa/",
    description:
      "Microsoft's full-time, 17-week technical training program in cloud development, cloud administration, and cybersecurity operations for transitioning service members and veterans, with mentorship and job-search support — 4,400 graduates and a 96% employment rate among graduates seeking employment.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse"],
    cost: "Free — fully funded by Microsoft since January 2021; participants keep their GI Bill funding",
    geographicScope: "Nationwide — U.S. cohorts delivered remotely",
    eligibility: "Military veterans and retirees, Coast Guard, National Guard and Reserve members, and U.S. or UK MoD service members within six months of separation or retirement; separate Military Spouse track",
    availability: "Cohort windows published on site; monthly virtual briefings the first Tuesday of each month",
  },
  {
    // NOTE: distinct from the general Fisher House Foundation lodging entry — this is a separate scholarship program administered by Scholarship Managers, not tied to Fisher House stays.
    name: "Fisher House Foundation — Scholarships for Military Children",
    url: "https://www.fisherhouse.org/programs/scholarship-programs/scholarships-for-military-children",
    description:
      "A minimum of one $2,000 scholarship is awarded at every commissary location receiving qualified applications — 500 scholarships in the most recent round — to unmarried military dependents under age 23; awards may run up to four years.",
    needCategoryIds: ["career-education", "family-support"],
    audienceTags: ["Family", "Gold Star", "Active Military", "Guard/Reserve", "Veteran"],
    cost: "$2,000 scholarships funded by commissary business-partner donations; no cost to apply",
    geographicScope: "Nationwide — awarded at commissary locations that receive qualified applications",
    eligibility: "Unmarried dependents under age 23 with a valid USID card whose sponsor is active duty, reserve/guard, deceased, or retired; full-time undergraduate enrollment; not for U.S. Service Academy appointees or students holding a full scholarship",
    availability: "Application period for 2027–2028 opens December 2026",
    phone: "856-616-9311",
  },
  {
    name: "Freedom Alliance",
    url: "https://freedomalliance.org/",
    description:
      "Has awarded $33 million in college scholarships to 2,500 students over 36 years and supported 5,000 combat veterans since founding, plus mortgage-free Heroes to Homeowners homes, customized wheelchairs, non-emergency financial assistance, outdoor adventures, and caregiver retreats.",
    needCategoryIds: ["career-education", "housing-transportation", "equipment-grants", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Not applicable — scholarships and grants are awarded to approved recipients",
    geographicScope: "Nationwide",
    eligibility: "Wounded service members, combat veterans, and military families; college scholarships go to the sons and daughters of military heroes",
    availability: "Presents for Patriots application period: Oct. 9 – Nov. 9; other programs by application",
    phone: "800-475-6620",
  },
  {
    name: "Special Operations Warrior Foundation",
    url: "https://specialops.org/",
    description:
      "Founded in 1980 after Operation Eagle Claw, funds the total cost of attendance at any accredited school for the children of fallen special operations forces and of all Medal of Honor recipients — no application required — supporting a USSOCOM community of roughly 70,000 service members.",
    needCategoryIds: ["career-education", "family-support"],
    audienceTags: ["Gold Star", "Survivor", "Family"],
    cost: "Not applicable — grants cover the total cost of attendance; no application required",
    geographicScope: "Nationwide",
    eligibility: "Surviving children of fallen special operations forces and children of all Medal of Honor recipients",
  },

  // ---------------------------------------------------------------------
  // Financial Assistance (national)
  // ---------------------------------------------------------------------
  {
    name: "Army Emergency Relief",
    url: "https://www.armyemergencyrelief.org/",
    description:
      "The U.S. Army's official nonprofit — supporting Soldiers and their families since 1942 — offering zero-interest emergency loans and grants for rent, utilities, car repairs, medical bills, and funeral expenses, plus college scholarships, applied for through an online portal.",
    needCategoryIds: ["financial-assistance", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Zero-interest loans (repayable) and grants — no interest charged",
    geographicScope: "Nationwide — U.S. Army community",
  },
  {
    // NOTE: national parent entry — a Navy-Marine Corps Relief Society — Pearl Harbor office is already listed in the regional blocks below.
    name: "Navy-Marine Corps Relief Society",
    url: "https://www.nmcrs.org/",
    description:
      "Founded in 1904 and staffed by roughly 90% volunteers, provides interest-free loans and scholarships to Navy and Marine Corps families — often disbursed the same day — along with emergency travel assistance, financial counseling, a visiting-nurse service, and nationwide thrift shops.",
    needCategoryIds: ["financial-assistance", "career-education"],
    audienceTags: ["Active Military", "Veteran", "Family", "Military Spouse"],
    cost: "Interest-free loans (repayable) and scholarships — often disbursed the same day",
    geographicScope: "Nationwide — offices on Navy and Marine Corps installations",
    eligibility: "Active-duty and retired Navy and Marine Corps members and their families; clients meet with a local NMCRS office",
  },
  {
    name: "Air & Space Forces Aid Society",
    url: "https://afas.org/",
    description:
      "The official aid society of the U.S. Air Force and Space Force, providing no-interest emergency loans, grants, and education assistance — about $11.6 million in support across roughly 12,600 assists in 2025 — through an online Request Assistance portal.",
    needCategoryIds: ["financial-assistance", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "No-interest loans (repayable) and grants",
    geographicScope: "Nationwide — Air Force and Space Force community",
  },
  {
    name: "Coast Guard Mutual Assistance",
    url: "https://mycgma.org/",
    description:
      "The Coast Guard's official mutual-aid society — 100% donation-funded — offering interest-free loans and grants for emergencies, education, and everyday needs, with more than $260 million in assistance disbursed to date.",
    needCategoryIds: ["financial-assistance", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Veteran", "Family", "Military Spouse"],
    cost: "Interest-free loans (repayable) and grants — funded entirely by donations",
    geographicScope: "Nationwide — Coast Guard community",
    eligibility: "Active-duty and reserve Coast Guard members, retirees, spouses, surviving spouses, civilian employees, Auxiliary, chaplains, and PHS personnel",
  },
  {
    // TODO(verify): the fetched page did not explicitly state free/no-charge wording — only a toll-free number and free-app references; confirm before publishing a firmer cost claim. The URL also returns 403 to automated fetches while browsers load it fine — recommend a manual spot-check.
    name: "American Red Cross — Hero Care Network",
    url: "https://www.redcross.org/get-help/military-families/hero-care-network/financial-assistance.html",
    description:
      "The only organization chartered by Congress to independently verify emergencies for the U.S. military, providing emergency communications, referrals, and financial-assistance facilitation through the military aid societies — more than 1,300 emergency communications a day across 380+ military installations.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own page — the Red Cross facilitates the transfer while the military aid societies determine the type and amount of aid",
    geographicScope: "Nationwide and overseas military locations",
    eligibility: "Active-duty members of all branches, activated National Guard/Reserve, their immediate family members, military retirees and their spouses/widow(er)s; veterans (unless medically retired) and non-activated Reserve/Guard are not eligible",
    phone: "877-272-7337",
  },
  {
    name: "Green Beret Foundation",
    url: "https://greenberetfoundation.org/",
    description:
      "Supports pre- and post-9/11 Green Berets and their families with emergency financial assistance, scholarships, casualty support, and family programs — \"our programs and services are free of charge\" — having invested $28 million and served more than 26,000 members of the Special Forces community.",
    needCategoryIds: ["financial-assistance", "family-support", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family"],
    cost: "Free — the org states \"our programs and services are free of charge\"",
    geographicScope: "Nationwide",
    eligibility: "Pre- and post-9/11 U.S. Army Special Forces soldiers (Green Berets) and their families",
  },
  {
    name: "Operation First Response",
    url: "https://www.operationfirstresponse.org/",
    description:
      "Provides emergency financial assistance to active-duty service members, active-duty first responders (law enforcement, firefighters, EMS, paramedics, 911 dispatchers), and Gold Star families — 45,611 served since 2004 — plus no-cost IT certification training and inpatient PTSD/substance-use treatment funding for qualifying veterans.",
    needCategoryIds: ["financial-assistance", "career-education", "mental-health"],
    audienceTags: ["Active Military", "First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Gold Star", "Veteran", "Family"],
    cost: "Grant-based — emergency cases evaluated individually; Project Specialized Training is explicitly no cost to qualifying veterans",
    geographicScope: "Nationwide",
    eligibility: "Emergency program: active-duty service members (all branches), active-duty first responders, Gold Star families, and families of fallen active-duty first responders; veterans are served through the training and treatment programs",
    availability: "By email to info@operationfirstresponse.org — inquiries evaluated individually",
  },
  {
    // TODO(verify): cost to recipients is not stated on the org's own site — confirm before publishing a firmer cost claim.
    name: "Coalition to Salute America's Heroes",
    url: "https://saluteheroes.org/",
    description:
      "Founded in 2004 to rebuild the lives of severely wounded post-9/11 veterans, pays urgent expenses directly — utilities, rent, mortgage, auto loans, groceries — and runs the Veteran's Caregiver Alliance for primary caregivers.",
    needCategoryIds: ["financial-assistance", "family-support", "career-education"],
    audienceTags: ["Veteran", "Disabled", "Caregiver", "Family"],
    cost: "Not stated on the org's own site — Emergency Financial Aid is provided to approved applicants after verification",
    geographicScope: "Nationwide",
    eligibility: "Post-9/11 disabled American veterans; Veteran's Caregiver Alliance membership requires a DoD/VA disability rating of 30% or greater from a single sustained injury and that the caregiver lives with the veteran",
  },
  {
    // TODO(verify): cost to recipients is not stated on the Critical Financial Assistance page — confirm before publishing a firmer cost claim.
    name: "Operation Homefront",
    url: "https://operationhomefront.org/",
    description:
      "Provides short-term Critical Financial Assistance for overdue bills, home repairs, and other urgent family needs — nearly $50 million in assistance to military families since 2011 — plus mortgage-free homes through Permanent Homes for Veterans (700+ deeded since 2012), transitional housing, family events, and Military Child of the Year.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "family-support"],
    audienceTags: ["Active Military", "Guard/Reserve", "Veteran", "Family", "Military Spouse"],
    cost: "Grant-based — assistance provided upon application approval; housing programs are mortgage-free or rent-free for participants",
    geographicScope: "Nationwide",
    eligibility: "Military families experiencing financial hardship; documentation depends on category (deployment orders, line-of-duty records, or DD-214)",
    availability: "Year-round — applications submitted online through the My Operation Homefront portal",
    phone: "877-264-3968",
  },

  // ---------------------------------------------------------------------
  // Housing & Transportation (national)
  // ---------------------------------------------------------------------
  {
    // TODO(verify): NCHV's own site never states a cost for its helpline/referral — confirm before publishing a firmer cost claim.
    name: "National Coalition for Homeless Veterans (NCHV)",
    url: "https://nchv.org/",
    description:
      "The only national organization solely focused on ending veteran homelessness, operating a referral helpline (1-877-424-3838) that connects veterans to a national network of community providers — NCHV does not provide direct housing or case management itself.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site — referral and information service",
    geographicScope: "Nationwide",
    eligibility: "Veterans experiencing or at risk of homelessness, plus community partners seeking training and technical assistance",
    phone: "1-877-424-3838",
  },
  {
    // TODO(verify): the housing page gives no cost/rent framing — confirm emergency/transitional/permanent housing costs before publishing a firmer claim.
    name: "U.S.VETS",
    url: "https://usvets.org/how-we-serve/housing/",
    description:
      "Housing-first nonprofit operating emergency, transitional and permanent veteran housing across sites in California, Arizona, Hawaii, Nevada, Texas and Washington, D.C., with wraparound career, mental-health and case-management services.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site — call to confirm current shelter and housing costs",
    geographicScope: "Nationwide — multi-state",
    eligibility: "Veterans and their families needing shelter; emergency beds are low-barrier",
    availability: "Intake by phone; emergency, transitional and permanent housing at sites in seven locations",
    phone: "877-548-7838",
  },
  {
    name: "Homes For Our Troops",
    url: "https://www.hfotusa.org/",
    description:
      "Builds and donates specially adapted custom homes nationwide for severely injured post-9/11 veterans — 448 homes completed and 63 projects underway, with no financial cost to the veteran.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — $0 cost to the veteran, stated on the org's own site",
    geographicScope: "Nationwide",
    eligibility: "Post-9/11 veterans with severe service-connected disabilities who are eligible for a VA Specially Adapted Housing (SAH/SHA) grant and will use the home as their primary residence",
    phone: "866-787-6677",
  },
  {
    name: "Veterans Community Project",
    url: "https://vcp.org/",
    description:
      "Villages of tiny homes with full wraparound services for homeless veterans — seven villages in Dallas, Glendale, Kansas City, Longmont, Milwaukee, Sioux Falls and St. Louis — with a published 85% success rate and $0 rent for residents.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Free — residents pay $0 in rent",
    geographicScope: "Nationwide — multi-state",
    eligibility: "Veterans experiencing homelessness",
  },
  {
    name: "Habitat for Humanity — Veterans Build",
    url: "https://www.habitat.org/volunteer/near-you/veterans-build",
    description:
      "Volunteer, homeownership, home-repair and employment program for U.S. veterans, service members and their families — 9,097+ veterans and families have partnered with Habitat since 2013 through 350+ participating affiliates.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Homebuyers pay an affordable mortgage; repair-program and volunteer costs vary by local affiliate",
    geographicScope: "Nationwide — delivered through participating local Habitat affiliates",
    eligibility: "U.S. veterans, active service members and their families",
    // Own mission page: "Since our founding in 1976 as a Christian organization..." — mission is "Seeking to put God's love into action."
    faithBased: true,
    faithAffiliationSource: "https://www.habitat.org/about/mission-and-vision",
  },
  {
    // TODO(verify): cost to the veteran is never stated outright on the org's own site — confirm before publishing a firmer claim.
    name: "Helping A Hero",
    url: "https://helpingahero.org/",
    description:
      "Specially adapted homes for veterans severely injured in the post-9/11 war on terror — more than 100 homes awarded across 24 states, with developers donating lots and builders constructing at cost so the home fits the veteran's injuries. Also runs marriage and caregiver retreats.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site — homes are donor-funded (lot donated, built at cost)",
    geographicScope: "Nationwide — multi-state (24 states)",
    eligibility: "Veterans severely injured in the post-9/11 Global War on Terror; nomination or application through Helping A Hero",
    phone: "888-786-9531",
  },
  {
    name: "Operation Finally Home",
    url: "https://www.operationfinallyhome.org/",
    description:
      "Builds mortgage-free homes and funds home modifications for veterans, first responders and surviving spouses — over 500 projects completed across 41+ states since 2005.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "First Responder", "Survivor"],
    cost: "Free — mortgage-free homes and no-cost home modifications, donation-funded",
    geographicScope: "Nationwide",
    eligibility: "Veterans, first responders and surviving spouses; application required",
  },
  {
    name: "Tunnel to Towers Foundation",
    url: "https://t2t.org/",
    description:
      "Provides mortgage-free homes to Gold Star and fallen-first-responder families, specially adapted smart homes for catastrophically injured veterans and first responders, and homeless-veteran housing services — more than 20,000 veterans housed and $1 billion+ committed to programs.",
    needCategoryIds: ["housing-transportation", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Gold Star", "Family", "Disabled", "Survivor"],
    cost: "Free — homes are mortgage-free; explicit \"no cost to recipients\" wording not published",
    geographicScope: "Nationwide",
    eligibility: "Program-specific: smart homes for post-9/11 catastrophically injured veterans and first responders; mortgage-free homes for Gold Star families and families of fallen first responders; homeless-veteran services for veterans in need",
  },
  {
    name: "VA Veterans Transportation Service",
    url: "https://www.va.gov/healtheligibility/veteranstransportationservice/",
    description:
      "VA program offering free rides to and from VA-approved health appointments, reimbursement of mileage and other travel expenses, and special modes of transportation such as stretcher or wheelchair van service.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — rides for VA-enrolled veterans to VA-approved appointments; mileage and travel-expense reimbursement available",
    geographicScope: "Nationwide",
    eligibility: "Veterans enrolled in VA health care with a VA-approved health care appointment",
  },
  {
    // NOTE: same organization as the DAV 5K event entry, but a distinct program — not a duplicate.
    name: "DAV Transportation Network",
    url: "https://www.dav.org/get-help-now/medical-transportation/",
    description:
      "Volunteer-staffed fleet providing free transportation to and from VA medical facilities for injured and ill veterans at more than 247 VA locations — DAV departments and chapters have donated 4,183 vehicles since 1987.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "Nationwide — 247+ VA locations",
    eligibility: "Ill and injured veterans needing rides to and from VA medical facilities",
  },
  {
    // TODO(verify): cost to recipients for the equipment-grant and modification programs is not stated outright on the org's own site — confirm before publishing a firmer claim.
    name: "Gary Sinise Foundation",
    url: "https://www.garysinisefoundation.org/",
    description:
      "National nonprofit honoring and serving veterans, active-duty service members, and first responders through 100% mortgage-free custom homebuilding for the severely wounded, home modifications, mobility devices, adapted vehicles, first-responder equipment grants, and mental-wellness retreats — 106 mortgage-free homes and 23,112 pieces of equipment donated since 2011.",
    needCategoryIds: ["housing-transportation", "equipment-grants", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Disabled", "Family", "Gold Star", "Caregiver"],
    cost: "Free — homes are delivered 100% mortgage-free and retreats and concerts are offered free",
    geographicScope: "Nationwide",
    eligibility: "Severely wounded heroes, families of fallen military and first responders, first-responder communities, veterans of every conflict, and active-duty service members",
    phone: "615-575-3500",
  },
  {
    // NOTE: programs are delivered by state-level VOA affiliates — this is the national page, distinct from any state affiliate entry.
    name: "Volunteers of America — Supportive Services for Veterans and Their Families",
    url: "https://www.voa.org/services/supportive-services-for-veterans-and-their-families/",
    description:
      "National human-services nonprofit serving 27,000 veterans annually — including over 10,000 homeless veterans — through VA-funded SSVF outreach, case management and rapid rehousing, and DOL-funded Homeless Veterans Reintegration Program job services.",
    needCategoryIds: ["housing-transportation", "career-education", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — services are funded by federal grants (VA SSVF, DOL HVRP); no fee stated for veterans",
    geographicScope: "Nationwide — 47 states, the District of Columbia, and Puerto Rico; service areas are specific local offices",
    eligibility: "SSVF: very low-income veteran families living in or transitioning to permanent housing. HVRP: homeless veterans seeking employment services",
    // Own About page: "Founded in 1896, the faith-based nonprofit..." — mission: "VOA puts faith into action."
    faithBased: true,
    faithAffiliationSource: "https://www.voa.org/about-us/",
  },

  // ---------------------------------------------------------------------
  // Legal & Benefits (national)
  // ---------------------------------------------------------------------
  {
    name: "National Veterans Legal Services Program (NVLSP)",
    url: "https://nvlsp.org/",
    description:
      "National nonprofit law firm fighting for veterans' benefits — $7.2 billion in benefits delivered since 1981 and a 98%+ win rate in cases argued before the Court of Appeals for Veterans Claims.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — legal help at no cost to veterans and their families",
    geographicScope: "Nationwide",
  },
  {
    name: "ABA Military Pro Bono Project",
    url: "https://www.militaryprobono.org/",
    description:
      "American Bar Association project that places civil legal cases for junior-enlisted active-duty servicemembers with volunteer attorneys, with referrals routed through military legal assistance offices. Also runs Operation Stand-By for attorney-to-attorney advice.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Active Military", "Family"],
    cost: "Free — pro bono legal help",
    geographicScope: "Nationwide",
    eligibility: "Junior-enlisted active-duty servicemembers and their families; cases must be referred by a military legal assistance attorney",
  },
  {
    name: "GI Rights Hotline",
    url: "https://www.girightshotline.org/",
    description:
      "Free, confidential and accurate information on U.S. military regulations and discharges since 1994, for servicemembers, veterans, potential recruits and their families — call 1-877-447-4487. Staffed by a consortium of nonprofit counselors, including veterans and lawyers.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
    eligibility: "Servicemembers, veterans, potential recruits and their families — no membership or eligibility screening stated",
    phone: "1-877-447-4487",
  },
  {
    // NOTE: distinct from the existing DAV 5K event entry and the DAV Transportation Network entry — this is DAV's organization-wide claims, benefits and support entry.
    name: "Disabled American Veterans (DAV) — VA Benefits Help",
    url: "https://www.dav.org/get-help-now/va-benefits-help/",
    description:
      "DAV benefits experts located across the country help veterans file VA claims and appeals and counsel them through the process — all at no cost to the veteran — plus free medical transportation to VA appointments, transition and employment services, and caregiver support, helping more than a million veterans every year.",
    needCategoryIds: ["legal-benefits", "career-education", "housing-transportation", "purpose-community"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver", "Survivor"],
    cost: "Free — stated as \"no cost to the veteran\" on dav.org",
    geographicScope: "Nationwide — local offices and chapters",
    eligibility: "Veterans of all generations, their families, and survivors",
  },
  {
    name: "The Veterans Consortium Pro Bono Program",
    url: "https://www.vetsprobono.org/",
    description:
      "National nonprofit founded in 1992 by the U.S. Court of Appeals for Veterans Claims, The American Legion, DAV, NVLSP and PVA that trains law-firm and corporate attorneys to represent veterans free of charge — 7,500+ attorneys trained, 89,000+ service members given free legal advice, and an 83% win rate through end of 2025.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Disabled"],
    cost: "Free — pro bono representation and legal advice clinics",
    geographicScope: "Nationwide — representation before the U.S. Court of Appeals for Veterans Claims; in-person clinics in DC/MD/VA plus wider virtual clinics",
    eligibility: "Veterans with a final Board of Veterans Appeals decision (120-day CAVC window), OTH discharges linked to PTSD/TBI/MST, women veterans, and naturalization applicants",
  },
  {
    name: "Blinded Veterans Association",
    url: "https://bva.org/",
    description:
      "Congressionally chartered 501(c)(3) (est. 1946) serving veterans who are blind or have low vision; its Veterans Service Program uses VA-accredited National Service Officers for free claims help nationwide, plus VetTech and education support, scholarships, ambassador peer visits and regional groups. In 2026 BVA partnered with Meta to deliver Ray-Ban Meta AI glasses to 130,000 blinded veterans.",
    needCategoryIds: ["legal-benefits", "equipment-grants", "career-education", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — VA claims assistance is provided at no cost to the veteran or their family; the glasses program is free to recipients (waitlisted)",
    geographicScope: "Nationwide — regional groups and ambassadors across the U.S.",
    eligibility: "Honorably discharged or active-duty service members who qualify for VA Blind Rehabilitation Service — legal blindness or low vision",
    phone: "844-250-5180",
    availability: "Monday–Friday, 9 AM – 7 PM ET (claims line)",
  },
  {
    // NOTE: distinct national entry from the existing Paralyzed Veterans of America — Sports & Recreation entry — this covers PVA's claims, benefits, advocacy, career and caregiver services.
    name: "Paralyzed Veterans of America — Benefits, Claims & Advocacy",
    url: "https://pva.org/",
    description:
      "Congressionally chartered VSO providing free VA benefits help through accredited National Service Officers co-located at 25 SCI/D centers and 100+ VA medical centers, plus career counseling, caregiver support, accessible home-design assistance and federal disability advocacy — nearly 27,000 claims filed in FY25.",
    needCategoryIds: ["legal-benefits", "career-education", "family-support", "housing-transportation"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver"],
    cost: "Free — \"we are here for you... free of charge\" per the org's site",
    geographicScope: "Nationwide — NSOs at 25 SCI/D centers and 100+ VA medical centers",
    eligibility: "NSO help open to all veterans and their families; specialized expertise in SCI, MS, ALS and other spinal cord disease/injury",
    phone: "866-734-0857",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Alabama
  // ---------------------------------------------------------------------
  {
    // TODO(verify): Verify active Huntsville schedule before publishing specific sports.
    name: "Catalyst Sports – Huntsville Chapter",
    url: "https://moveunitedsport.org/locations/",
    description:
      "Community-based adaptive adventure sports through the Catalyst Sports / Move United network.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Varies / often subsidized",
    geographicScope: "Huntsville / North Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): Useful Alabama adaptive-sports option; verify current chapter programming.
    name: "Catalyst Sports – Birmingham Chapter",
    url: "https://moveunitedsport.org/locations/",
    description:
      "Community-based adaptive adventure sports through the Catalyst Sports / Move United network.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Varies / often subsidized",
    geographicScope: "Birmingham / Central Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Alabama First Responder Peer Support",
    url: "https://www.afrps.com/",
    description:
      "Free, confidential peer-to-peer support from trained first responders for job stress, trauma, personal challenges, mental health and substance-use concerns.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "EMS", "First Responder"],
    cost: "Free",
    geographicScope: "Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Alabama Law Enforcement Alliance for Peer Support (ALLEAPS)",
    url: "https://alleaps.org/",
    description:
      "Peer support, crisis intervention, family support, suicide-prevention resources, substance-use support and critical-incident response.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Dispatch", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    name: "NAMI Alabama – Frontline Professionals",
    url: "https://namialabama.org/your-journey/frontline-professionals/",
    description:
      "Frontline Wellness resources, peer-support leader materials and Stronger Together relationship workshop content.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Healthcare", "Family"],
    cost: "Free / Varies",
    geographicScope: "Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Priority Veteran – United Way of Central Alabama",
    url: "https://www.uwca.org/need-help/veteran-services/",
    description:
      "Housing stabilization, homelessness prevention, benefits connection, job-search help, financial coaching, and health/mental-health connections.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Most of Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Alabama Veteran",
    url: "https://alabamaveteran.org/",
    description:
      "Resource navigation, employment, financial planning, health-care guidance, events, VSO connections and purpose-focused support.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free / Varies",
    geographicScope: "Alabama",
    state: "Alabama",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): ADVA's FY24 annual report says offices in 61 counties while aggregators say 67 — confirm current office count/coverage.
    name: "Alabama Department of Veterans Affairs",
    url: "https://va.alabama.gov/",
    description:
      "State agency delivering certified claims representation and benefits counseling, the Alabama GI Dependent Scholarship, state veterans homes, burial and memorial services, and referrals for Alabama veterans and their families.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — certified claims representation provided at no charge (stated in ADVA's Alabama Laws Affecting Veterans guide)",
    geographicScope: "Alabama — statewide agency with regional veterans service offices",
    eligibility: "Alabama veterans and their dependents and survivors",
    phone: "334-242-5077",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    name: "Legal Services Alabama — Veterans Services",
    url: "https://legalservicesalabama.org/veterans-services/",
    description:
      "Free civil legal help for eligible Alabamians with dedicated veterans services covering eviction and housing, foreclosure, discharge upgrades, record expungement, and other civil matters, including a homeless/at-risk veteran program.",
    needCategoryIds: ["legal-benefits", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — civil legal services provided at no cost to eligible clients",
    geographicScope: "Alabama — statewide legal aid organization",
    eligibility: "Income-eligible clients; veterans services include homeless and at-risk veterans (LSV-H)",
    phone: "866-456-4995",
    hours: "Monday–Friday 8:30am–4:30pm",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm current clinic session and intake schedule on the org's site.
    name: "Cumberland Veterans Legal Assistance Clinic (C-VETS)",
    url: "https://www.samford.edu/law/c-vets",
    description:
      "Free veterans legal clinic run by Samford University Cumberland School of Law students under supervising attorneys, serving veterans across eight Alabama counties.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran"],
    cost: "Free — clinic legal services provided at no cost",
    geographicScope: "Eight Central Alabama counties — Bibb, Blount, Chilton, Cullman, Etowah, Jefferson, Shelby, Walker",
    eligibility: "Veterans in the clinic's eight-county service area",
    phone: "205-726-4735",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm AVRC walk-in hours and whether services extend to military spouses.
    name: "Workforce Alabama — Veterans",
    url: "https://workforce.alabama.gov/job-seekers/veterans/",
    description:
      "State workforce agency career services for veterans: résumé and interview help, priority of service at all Alabama Career Centers, apprenticeship and on-the-job-training navigation, and the Alabama Veterans Resource Center (AVRC) at 100 Dexter Avenue in Montgomery.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Alabama — statewide Alabama Career Centers; AVRC office in Montgomery",
    eligibility: "Veterans — priority of service applies across state workforce programs",
    phone: "334-309-9000",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    name: "AIDT Military Transition Program",
    url: "https://www.aidt.edu/aidt-military-transition-program/",
    description:
      "Job-readiness and technical training that moves transitioning military and DOD personnel, veterans, and their spouses and dependents into Alabama careers, with training centers statewide including Huntsville, Birmingham, Montgomery, and Mobile.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — provided at no cost to transitioning military/DOD personnel (stated on the org's site)",
    geographicScope: "Alabama — statewide AIDT training centers",
    eligibility: "Transitioning military and DOD personnel, veterans, and their spouses and dependents",
    phone: "334-993-5390",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): homepage pairs a (334) 384-9111 contact with a Columbus, GA office — confirm which Alabama number to publish for claims/benefits.
    name: "Still Serving Veterans",
    url: "https://ssv.org/",
    description:
      "Alabama-based nonprofit offering veteran-to-veteran career transition coaching (resumes, interviews, salary negotiation, LinkedIn), accredited VA claims and benefits counseling, and a North Alabama Support Network connecting veterans with benefits and community resources.",
    needCategoryIds: ["career-education", "legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — all services provided at no charge (stated on the org's site)",
    geographicScope: "Nationwide for career transition; North Alabama only for Support Network and claims/benefits — headquartered in Huntsville",
    eligibility: "U.S. veterans — career transition available nationwide; Support Network and claims/benefits limited to North Alabama",
    availability: "No time limit on support — veterans can use services for as long as they need (stated on the org's site)",
    phone: "256-883-7035",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm on the Alabama SSVF page whether services are free to veterans — the org's site does not state cost.
    name: "Volunteers of America Southeast — Veterans Services",
    url: "https://voase.org/services/veterans-services/",
    description:
      "Homeless-veteran services in Alabama: Supportive Services for Veteran Families (SSVF) case management, Eagle's Landing (38-unit transitional housing in Mobile with wraparound services), and Valor Grove (50-unit permanent housing on the Tuscaloosa VA campus).",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Alabama — statewide SSVF, with veteran housing in Mobile and Tuscaloosa",
    eligibility: "Veterans experiencing homelessness or at risk of homelessness, and their families",
    phone: "251-300-3968",
    state: "Alabama",
    verifiedDate: "2026-10-07",
    // Own site: "Volunteers of America (VOA) Southeast is a ministry of service..."
    faithBased: true,
    faithAffiliationSource: "https://voase.org/",
  },
  {
    // TODO(verify): confirm grant amount limits, review cadence, and whether assistance carries any repayment terms.
    name: "Alabama National Guard Foundation",
    url: "https://www.alngfoundation.org/about",
    description:
      "501(c)(3) providing emergency and crisis financial support to Alabama National Guard members and their families, with grant requests submitted through the chain of command; self-funded and donation-supported since 2004.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Active Military", "Veteran", "Family"],
    cost: "Not stated on the org's own site — donation-funded emergency grants",
    geographicScope: "Alabama — statewide Alabama National Guard members and families",
    eligibility: "Alabama National Guard members and their families facing an emergency or crisis situation",
    phone: "334-603-6833",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm application window, grant amount, and eligibility details on the org's site.
    name: "Alabama Marines Foundation — Emergency Assistance Program",
    url: "https://alamarinesfoundation.org/about/grants--programs/emergency-assistance-program",
    description:
      "One-time, non-repayable emergency assistance grants for Alabama-connected Marines and their families from a Tuscaloosa-based nonprofit that also runs support programs for the Corps community.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — one-time, non-repayable emergency grants (stated on the org's site)",
    geographicScope: "Alabama — for Alabama-connected Marines and families; based in Tuscaloosa",
    eligibility: "Marines and families connected to Alabama facing an emergency financial need",
    phone: "205-310-2125",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): no phone published (email only); Apply-for-Assistance page shows 'Coming Soon' — confirm submission process and that services are no-cost.
    name: "First Responders Foundation of Alabama",
    url: "https://www.firstrespondersal.com/",
    description:
      "Alabama 501(c)(3) offering first responders individual, marital, family, financial and grief counseling, chaplaincy training and crisis-intervention care, board-approved financial hardship assistance for responders injured on duty, and keepsake memorials for families of fallen responders.",
    needCategoryIds: ["family-support", "financial-assistance", "mental-health"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Alabama — first responders statewide; office in Cullman",
    eligibility: "First responders and their families; hardship assistance requires a written recommendation from a chief, HR, or appropriate personnel, approved by the Board based on need and available funds",
    state: "Alabama",
    verifiedDate: "2026-10-08",
    // The organization explicitly describes itself as a ministry and publishes
    // Bible, devotional, chaplaincy, and faith-based counseling programs.
    faithBased: true,
    faithAffiliationSource: "https://www.firstrespondersal.com/",
  },
  {
    name: "Lakeshore Foundation — Veterans Program",
    url: "https://www.lakeshore.org/activity/veterans/",
    description:
      "Free year-round membership for honorably discharged U.S. veterans living in Alabama and their household family members — fieldhouse and track, fitness center, two heated pools, adapted fitness and aquatics classes, and competitive adapted sport programs; funded by a grant from the State of Alabama.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — membership funded by a grant from the State of Alabama",
    geographicScope: "Alabama veterans statewide (facility at 4000 Ridgeway Dr, Birmingham/Homewood, AL)",
    eligibility: "Honorably discharged U.S. veterans living in Alabama and their household family members; proof of DD-214, military ID, VA healthcare card, or Alabama driver license with veteran stamp",
    phone: "205-313-7400",
    hours: "Weekdays 5:30 AM–7:30 PM; Saturday 7:00 AM–3:00 PM; Sunday closed",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): aherousa.org blocks automated access (HTTP 403) — reverify phone, participant cost, and eligibility manually in a browser.
    name: "AHERO",
    url: "https://aherousa.org/",
    description:
      "Alabama-based nonprofit serving wounded veterans and first responders with fellowship, mentoring, and outdoor recreational activities; the org states 100% of donations go directly to veterans and first responders.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Tuskegee, Alabama — Major General James E. Livingston USMC Warrior Lodge, 8410 US Highway 80 W",
    eligibility: "Wounded veterans and first responders (per the org's mission statement)",
    phone: "910-548-8864",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm upcoming retreat dates and the application process on the org's site.
    name: "St. Michael's Iron Horse Charities",
    url: "https://www.stmichaelsironhorse.org/wildlife-retreats",
    description:
      "Fully funded three-day outdoor retreats at Iron Horse Farms in Marion, Alabama for veterans dealing with physical and mental trauma, plus Gold Star family retreats in a wheelchair-accessible setting.",
    needCategoryIds: ["outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Family", "Gold Star"],
    cost: "Free — retreats are all-expenses-paid and fully funded (stated on the org's site)",
    geographicScope: "Iron Horse Farms, Marion, Alabama",
    eligibility: "Veterans experiencing physical or mental trauma; Gold Star families for family retreats",
    phone: "334-683-4450",
    state: "Alabama",
    verifiedDate: "2026-10-07",
    // Own site: "Inspired by the strength and guidance of St. Michael the Archangel..."
    faithBased: true,
    faithAffiliationSource: "https://www.stmichaelsironhorse.org/",
  },
  {
    name: "Alabama Mentorship-HUB (Military Spouse Advocacy Network)",
    url: "https://militaryspouseadvocacynetwork.org/alhub-main",
    description:
      "Free mentorship and resource hub created with the Alabama Military Stability Commission, giving military dependents, spouses, caregivers, and Gold Star families 24/7 access to mentors who are military spouses and professionally trained mental health allies.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Family", "Veteran", "Gold Star"],
    cost: "Free — a range of free programs (stated on the org's site)",
    geographicScope: "Alabama — statewide virtual hub; no installation proximity required",
    eligibility: "Spouses and caregivers of U.S. military members and veterans (active duty, Reserve, National Guard), including Gold Star surviving spouses and families",
    availability: "24/7 access to mentors and resources (stated on the org's site)",
    hours: "24/7",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm phone/hours and whether the foundation provides direct assistance or referrals only; cost of programs not stated.
    name: "Mission Forward Alabama — Alabama Veterans Resource Center Foundation",
    url: "https://missionforwardal.org/",
    description:
      "Statewide hub connecting Alabama veterans and their families with employment and workforce training, education and skills development, and health and wellness support; opened a Montgomery office and named an executive director in March 2026.",
    needCategoryIds: ["purpose-community", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Alabama — statewide hub with an office in Montgomery",
    eligibility: "Alabama veterans and their families",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm the next application window — 2026 limit was $4,000 per agency, priority given to service-increase requests and state EMS reporting hardware.
    name: "Alabama Joint Fire Council EMS Equipment Grant",
    url: "https://www.alabamafirecollege.org/alabama-joint-fire-council-ems-equipment-grant/",
    description:
      "Annual reimbursement grant (Code of Alabama §22-18-63) administered by Alabama Fire College funding EMS equipment and operations purchases for volunteer fire departments and rescue squads — up to $4,000 per agency for 2026, no match required.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["First Responder", "Fire", "EMS"],
    cost: "Grant — reimbursement only with no match required; awardees buy the specified equipment first and are paid after receipts and proof of purchase are verified",
    geographicScope: "Alabama — statewide; administered from Alabama Fire College in Tuscaloosa",
    eligibility: "Volunteer fire departments recognized by the Alabama Forestry Commission and rescue squads listed with the Alabama Association of Rescue Squads at time of application",
    availability: "2026 applications accepted February 18 – March 30, 2026, with awards announced before May 1, 2026; funds are residual and may not be available every fiscal year",
    phone: "800-241-2467",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // NOTE: state-specific view of the national 988 entry above — Alabama's calls, texts and chats are answered in-state by four regional centers, backed by mobile crisis response. Not flagged as a crisisResource to avoid duplicating the national 988 card on /crisis.
    name: "Alabama 988 Suicide & Crisis Lifeline",
    url: "https://mh.alabama.gov/988-2/",
    description:
      "Alabama Department of Mental Health's 988 page: the three-digit crisis line integrated with Alabama's crisis system of care — calls, texts and chats answered in-state (AltaPointe Mobile, JBS/Crisis Center Birmingham, SpectraCare Dothan, WellStone Huntsville), backed by mobile crisis response and crisis centers.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Alabama",
    eligibility: "Anyone in crisis for themselves or a loved one; veterans can push 1 for direct access",
    availability: "24/7 — call, text, or chat",
    phone: "988",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm cost and insurance accepted.
    name: "Vets Recover",
    url: "https://vetsrecover.org/",
    description:
      "Mobile, Alabama nonprofit providing integrated outpatient, residential and community care for service members, veterans, first responders and their families, with veteran/first-responder peer specialists available 24/7 and partnerships across healthcare, housing, employment and benefits services.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Mobile, Alabama (1200 Spring Hill Ave)",
    eligibility: "Service members, veterans, first responders and their families — 'DD-214 or no DD-214, VA enrolled or not'",
    availability: "24/7 — talk to a veteran peer specialist by phone",
    phone: "251-405-3677",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    name: "South Central Alabama Mental Health — Veterans & First Responders",
    url: "https://scamhc.org/veterans-and-first-responders",
    description:
      "Specialized behavioral-health program for veterans and first responders: 24/7 helpline, MyCare-tablet on-demand confidential support, mobile crisis response, crisis services, outpatient and substance-use care with TRICARE-accepted licensed staff, VA referrals welcome, and peer support networks.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "First Responder", "Law Enforcement", "Fire", "EMS", "Healthcare"],
    cost: "Insurance accepted (including TRICARE) with sliding-scale fees — 'no one should be turned away due to cost'",
    geographicScope: "Butler, Coffee, Covington, and Crenshaw counties (south Alabama)",
    eligibility: "Veterans and first responders in the four-county service area",
    availability: "24/7 crisis helpline; walk-in psychiatric urgent care weekdays",
    phone: "877-530-0002",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm costs for retreats/hunts on the org's site.
    name: "WarHawgs",
    url: "https://warhawgs.org/",
    description:
      "Dothan-based 501(c)(3) running an outdoor retreat and adaptive hunting program — 22 Heroes retreats, hunting, fishing, sporting clays and an adaptive sports program — for veterans, active duty and first responders, with adaptive equipment for spinal cord injuries, TBI and vision loss.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Dothan / Wiregrass, Alabama (2149 Denton Rd)",
    eligibility: "Veterans, active-duty military and first responders",
    phone: "855-927-4294",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    name: "Forging A Difference",
    url: "http://www.forgingadifference.com/",
    description:
      "Daphne 501(c)(3) using blacksmithing and knife-making to serve active duty, veteran, law enforcement and first-responder communities — multi-week classes, family days and open shop, each class starting with a shared meal.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "First Responder"],
    cost: "$20–$40 per class — meals and materials included (per the org's class listings)",
    geographicScope: "Daphne / Baldwin County, Alabama",
    eligibility: "Veterans, active duty, law enforcement and first responders only — per the org, others should not sign up for these classes",
    availability: "Multi-week class sessions; family days and open shop scheduled periodically",
    phone: "251-525-6274",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },
  {
    // TODO(verify): confirm current tuition/fees for certification and EMS courses and any free-tuition programs for Alabama volunteer firefighters before publishing.
    name: "Alabama Fire College",
    url: "https://www.alabamafirecollege.org/courses-training",
    description:
      "State fire-service training college (delivering firefighter training since 1936) with fire fighter, EMS, hazardous materials and rescue certification and continuing-education courses, plus a Veterans Information Center for veteran and veteran-family education benefits.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Fire", "EMS", "Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Alabama (2501 Phoenix Dr, Tuscaloosa)",
    phone: "800-241-2467",
    state: "Alabama",
    verifiedDate: "2026-10-07",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Tennessee
  // ---------------------------------------------------------------------
  {
    name: "SPARC – Sports, Arts & Recreation of Chattanooga",
    url: "https://www.sparctn.org/about-sparc",
    description:
      "Adaptive water skiing, snow skiing, cycling, basketball, racing/running, kayaking and tennis.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Varies / subsidized",
    geographicScope: "Chattanooga / Southeast Tennessee",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Catalyst Sports – Chattanooga Chapter",
    url: "https://www.catalystsports.org/chattanooga",
    description:
      "Adaptive climbing and adaptive mountain biking in Chattanooga.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled"],
    cost: "Varies",
    geographicScope: "Chattanooga",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Tennessee Veterans Services Resource Hub",
    url: "https://www.tn.gov/veteran.html",
    description:
      "Statewide verified services, benefits, mental-health links, State Veterans Services Offices and resource coordination.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Tennessee",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Tennessee Public Safety Network (TNPSN)",
    url: "https://www.tnpsn.org/",
    description:
      "Critical-incident stress services, peer support, post-shooting teams, assessment/referral, relationship and substance-use support, training.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Corrections", "Dispatch", "First Responder"],
    cost: "Free / Varies",
    geographicScope: "Tennessee",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Serve & Protect",
    url: "https://www.serveprotect.org/",
    description:
      "Peer support, trauma-service referrals, chaplain network and first-responder crisis-resource navigation.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free support / Varies by referred care",
    geographicScope: "Tennessee / National",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Operation Stand Down Tennessee",
    url: "https://osdtnwebsite.wixsite.com/osdtn",
    description:
      "Crisis relief, housing, transitional housing, employment/career services, connection and community support.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Tennessee",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Mission United – United Way of Greater Nashville",
    url: "https://www.unitedwaygreaternashville.org/mission-united/",
    description:
      "Free connections to housing, employment, mental health, financial assistance and other resources through a nine-county footprint and 211.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Active Military", "Veteran", "Family"],
    cost: "Free",
    geographicScope: "Greater Nashville / Middle Tennessee",
    state: "Tennessee",
    verifiedDate: "2026-08-20",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Georgia
  // ---------------------------------------------------------------------
  {
    name: "BlazeSports America – Veteran Programs",
    url: "https://blazesports.org/veteran/",
    description:
      "Free veteran membership for adaptive cycling, rowing, air rifle, bowling, archery, water aerobics and other sports.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "Metro Atlanta / Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Georgia Department of Veterans Service / Unite Georgia",
    url: "https://veterans.georgia.gov/",
    description:
      "Benefits claims help plus coordinated resource navigation for employment, education, transportation, food, mental and behavioral health and more.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Caregiver", "Survivor"],
    cost: "Free",
    geographicScope: "Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Veterans Empowerment Organization",
    url: "https://www.veohero.org/our-mission",
    description:
      "Emergency/supportive housing, mental-health and substance-use clinical care, workforce training, stability support and cycling team.",
    needCategoryIds: ["housing-transportation", "sports-fitness"],
    audienceTags: ["Veteran"],
    cost: "Free / Varies",
    geographicScope: "Atlanta / Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },
  {
    name: "VETLANTA",
    url: "https://vetlanta.org/",
    description:
      "Connections across education, employment, housing, business/entrepreneurship and other veteran-support pillars.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Metro Atlanta",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Georgia First Responder PTSD Program",
    url: "https://doas.ga.gov/human-resources-administration/georgia-first-responder-ptsd-program-hb-451/program",
    description:
      "State-mandated PTSD benefits including lump-sum and long-term disability benefits for qualifying service-connected diagnoses.",
    needCategoryIds: ["mental-health", "legal-benefits"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "First Responder"],
    cost: "Benefit program",
    geographicScope: "Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
    eligibility: "Requires a qualifying service-connected diagnosis",
  },
  {
    name: "NAMI Georgia – Frontline Professionals",
    url: "https://namiga.org/frontline-professionals/",
    description:
      "Frontline Wellness resources, peer-support leader materials and family relationship support.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Healthcare", "Family"],
    cost: "Free / Varies",
    geographicScope: "Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): Verify current service footprint before location-based ranking.
    name: "Code Blue Support",
    url: "https://www.codebluesupport.com/",
    description:
      "First-responder and family wellbeing support in partnership with behavioral-health providers; community support navigation.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Family"],
    cost: "Varies",
    geographicScope: "Georgia",
    state: "Georgia",
    verifiedDate: "2026-08-20",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Florida
  // ---------------------------------------------------------------------
  {
    name: "Outdoor Valor",
    url: "https://outdoorvalor.org/",
    description:
      "Free veteran-led fishing experiences, PTSD peer-support groups, whole-person wellness/accountability and spouse support.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Free",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "VetCATCH",
    url: "https://www.vetcatch.org/",
    description:
      "Therapeutic fishing and boating adventures including travel, lodging, meals, charters, gear and apparel.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for participants",
    geographicScope: "Florida / Gulf Coast",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Vets On Board Network",
    url: "https://vetsonboardnetwork.org/",
    description:
      "Water-based experiences, outdoor education and peer community supporting connection and mental wellbeing.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran"],
    cost: "Free / Varies",
    geographicScope: "South Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Florida Veterans Coalition",
    url: "https://floridaveterans.org/",
    description:
      "Emergency relief, claims education, dental referrals, employment readiness, financial wellness, food, housing, education and legal-resource connections.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free / Assistance-based",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Veterans Florida",
    url: "https://www.veteransflorida.org/",
    description:
      "No-cost SkillBridge, career, training and entrepreneurship support focused on Florida opportunity.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Active Military", "Veteran", "Guard/Reserve", "Military Spouse"],
    cost: "Free",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Florida Veterans Foundation / FDVA Resource Programs",
    url: "https://floridavets.org/",
    description:
      "Veteran support, statewide resource connections, dental-program access and assistance programs.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free / Assistance-based",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Operation Barnabas",
    url: "https://operationbarnabas.com/our-impact/",
    description:
      "Housing, counseling connections, mentorship, employment support and outdoor/fishing experiences with continued community support.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free / Varies",
    geographicScope: "Northeast Florida",
    state: "Florida",
    verifiedDate: "2026-08-20",
    // Own About page publishes a "What We Believe" statement of faith; mission works "through faith, action, and encouragement."
    faithBased: true,
    faithAffiliationSource: "https://operationbarnabas.com/about/",
  },
  {
    name: "Paralyzed Veterans of America — Central Florida Chapter",
    url: "https://pvacf.org/",
    description:
      "Adaptive sports and recreation, an adaptive-equipment loaner program, and advocacy/benefits support for veterans with spinal cord injury or dysfunction, MS, or related neurological conditions.",
    needCategoryIds: ["sports-fitness", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Membership-based veteran service organization — contact chapter to confirm program-specific costs",
    geographicScope: "Central Florida",
    state: "Florida",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Florida Veterans Support Line (1-844-MyFLVet)",
    url: "https://www.myflvet.com/",
    description:
      "Free, 24/7 confidential statewide crisis and peer-support line for veterans, active duty, Guard, Reserve, and their loved ones, with care coordination through a database of 3,000+ Florida resources. Operated through Florida's 211 network.",
    needCategoryIds: ["mental-health", "financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-09-29",
    phone: "1-844-693-5838",
    availability: "24/7",
  },
  {
    name: "Blueline Rescue (UCF RESTORES)",
    url: "https://bluelinerescue.org/",
    description:
      "Free, confidential mobile peer-support platform for Florida law enforcement, connecting active and retired officers and their families to trained peer supporters, chaplains, and culturally competent licensed clinicians statewide.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Family"],
    cost: "Free",
    geographicScope: "Florida",
    state: "Florida",
    verifiedDate: "2026-09-29",
    eligibility: "Sworn law enforcement (active and retired) and their families",
  },
  {
    name: "Volunteers of America Florida — Veteran Services",
    url: "https://www.voaflorida.org/services/veteran-services/",
    description:
      "Florida's largest provider of supportive housing for veterans — outreach, transitional and affordable housing, SSVF case management/rental assistance, and residential substance-use treatment across 19 Florida communities.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family", "Disabled"],
    cost: "Free / income-based — SSVF programs are federally funded for low-income veteran families",
    geographicScope: "Florida (19 communities, Pensacola to Key West)",
    state: "Florida",
    verifiedDate: "2026-09-29",
    // Own About page: "Volunteers of America of Florida is a faith-based, non-profit human service organization..."
    faithBased: true,
    faithAffiliationSource: "https://www.voaflorida.org/about-us/",
  },
  {
    name: "National Veterans Homeless Support (NVHS)",
    url: "https://nvhs.org/programs/housing-homelessness-prevention-for-veterans/",
    description:
      "Central Florida nonprofit providing transitional housing with case management, emergency shelter referrals, rental/eviction-prevention assistance, and street outreach for veterans experiencing or at risk of homelessness.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Assistance-based — contact to confirm current cost/eligibility specifics",
    geographicScope: "Central Florida (Brevard County-focused)",
    state: "Florida",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Mission United — United Way Miami",
    url: "https://unitedwaymiami.org/mission-united/",
    description:
      "Free program connecting veterans and their families in Miami-Dade County to a coordinated network of community partners for job training/career coaching, legal resources, financial empowerment, and food assistance.",
    needCategoryIds: ["financial-assistance", "career-education", "legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Miami-Dade County / South Florida",
    state: "Florida",
    verifiedDate: "2026-09-29",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Mississippi
  // ---------------------------------------------------------------------
  {
    name: "Mississippi Veterans Affairs",
    url: "https://www.msva.ms.gov/",
    description:
      "State veterans benefits, service coordination, veterans homes, benefits assistance and statewide support information.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Mississippi Veterans Benefits Specialists & County Service Officers",
    url: "https://www.msva.ms.gov/serviceofficers",
    description:
      "State and county-level benefits assistance through named specialists and county service officers.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Mississippi counties",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Mississippi Department of Employment Security – Veterans Services",
    url: "https://www.mdes.ms.gov/i-need-a-job/veterans-services/",
    description:
      "Priority employment services, job search, education/training, employment-rights resources and housing/homeless links.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran"],
    cost: "Free",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Veterans OutReach of Mississippi – Resource Directory",
    url: "https://veteransoutreachms.org/resources/",
    description:
      "Mississippi-specific directory covering benefits, career, training, food, housing and other assistance.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
    // Own About page: mission is "to provide spiritual guidance and counseling"; site footer carries a Bible verse (John 16:33).
    faithBased: true,
    faithAffiliationSource: "https://veteransoutreachms.org/about-us/",
  },
  {
    name: "Mississippi DMH – Mental Health First Aid for Public Safety",
    url: "https://www.dmh.ms.gov/mental-health-first-aid-training-now-available-sign-up-today/",
    description:
      "No-cost Mental Health First Aid training tailored to public-safety personnel.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "First Responder"],
    cost: "Free",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Mississippi DMH – Peer Support Services",
    url: "https://www.dmh.ms.gov/service-options/peer-support/",
    description:
      "Certified peer-support and peer-run service pathways across the state behavioral-health system.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Family"],
    cost: "Free / Insurance / Varies",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "VA Gulf Coast – Recreation & Adaptive Sports Support",
    url: "https://www.va.gov/gulf-coast-health-care/health-services/",
    description:
      "Recreation and creative arts therapy plus support connecting veterans to national VA adaptive sports and arts events.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran"],
    cost: "VA eligibility",
    geographicScope: "Mississippi Gulf Coast",
    state: "Mississippi",
    verifiedDate: "2026-08-20",
  },
  {
    name: "L.E.A.P.S. — Law Enforcement Alliance for Peer Support",
    url: "https://msleaps.org/",
    description:
      "All-volunteer, statewide peer-support network of trained Mississippi law enforcement officers and dispatchers who respond confidentially to officer-involved shootings, suicides/interventions, line-of-duty deaths, and job or family-related stress.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Dispatch", "First Responder"],
    cost: "Free",
    geographicScope: "Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-09-29",
    eligibility: "Sworn law enforcement personnel and dispatchers (does not serve fire/EMS)",
  },
  {
    name: "South Mississippi Veterans Resources — SSVF Program",
    url: "https://southmsveteransresources.com/?page_id=9",
    description:
      "Supportive Services for Veteran Families (SSVF) program providing case management, rental/utility/deposit/moving-cost assistance, and help accessing VA and public benefits for very low-income veteran families who are homeless or at imminent risk.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Jackson, MS south to the Mississippi Gulf Coast",
    state: "Mississippi",
    verifiedDate: "2026-09-29",
    eligibility: "Non-dishonorable discharge; homeless or at imminent risk; household income ≤50% area median income",
    phone: "601-545-3668",
  },
  {
    name: "MUTEH (Mississippi United to End Homelessness) — SSVF Program",
    url: "https://www.muteh.org/ssvf-grants-per-diem",
    description:
      "Supportive Services for Veteran Families program providing temporary housing assistance and case management to rapidly re-house or prevent homelessness among very low-income veteran families in Central Mississippi.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free / VA-grant funded",
    geographicScope: "Copiah, Hinds, Madison, Rankin, Simpson & Yazoo counties (Central Mississippi / Jackson metro)",
    state: "Mississippi",
    verifiedDate: "2026-09-29",
    eligibility: "Veteran household member; income ≤50% area median income; currently homeless or at imminent risk",
  },
  {
    name: "Mississippi National Guard — Military & Family Readiness Assistance Center",
    url: "https://www.ng.ms.gov/installations/cs/res/sfac",
    description:
      "Comprehensive, coordinated support services for Mississippi National Guard members, Reserve, and their families, including deployment support, mental-health referrals, wounded warrior program connections, and reintegration assistance.",
    needCategoryIds: ["family-support", "mental-health"],
    audienceTags: ["Guard/Reserve", "Active Military", "Family", "Military Spouse", "Veteran"],
    cost: "Free",
    geographicScope: "Mississippi (Camp Shelby Joint Forces Training Center)",
    state: "Mississippi",
    verifiedDate: "2026-09-29",
    phone: "601-387-6764",
  },
  {
    name: "Wounded Warriors of Mississippi",
    url: "https://www.wwofms.org/",
    description:
      "Brandon-based nonprofit helping Mississippi veterans with invisible wounds reconnect with society through peer-connection events, help with daily tasks, and emergency financial aid (utility bills, medications, essential needs).",
    needCategoryIds: ["mental-health", "financial-assistance", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — volunteer-run, donation-funded",
    geographicScope: "Brandon / Central Mississippi",
    state: "Mississippi",
    verifiedDate: "2026-09-29",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — North Carolina
  // ---------------------------------------------------------------------
  {
    name: "North Carolina Adapted Sports",
    url: "https://moveunitedsport.org/organization/north-carolina-adapted-sports/",
    description:
      "Adaptive cycling, mountain biking, wheelchair basketball, climbing and other recreational/competitive opportunities.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled"],
    cost: "Varies / subsidized",
    geographicScope: "Cary / Raleigh-Durham / North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Honor the Warriors",
    url: "https://honorthewarriors.org/donate/",
    description:
      "Adaptive cycling and outdoor gear plus goal-oriented supported veteran events.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran"],
    cost: "Free / Assistance-based",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "North Carolina DMVA – Services",
    url: "https://www.milvets.nc.gov/services",
    description:
      "Benefits, transition, employment, housing, education, spouse support and statewide resource navigation.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Responder Assistance Initiative (RAI)",
    url: "https://www.ncdps.gov/dps-services/responder-assistance-initiative",
    description:
      "Free confidential behavioral health care, peer support, critical-incident services, training, family/couple therapy and statewide navigation.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "North Carolina First Responder Peer Support",
    url: "https://ncfrps.org/",
    description:
      "Confidential peer support, clinician/treatment navigation and 24/7 peer-support access.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "Law Enforcement", "EMS"],
    cost: "Free",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
    availability: "24/7 peer-support access",
  },
  {
    name: "NCLEAP",
    url: "https://nc-leap.org/",
    description:
      "No-cost peer support, chaplaincy, post-critical-incident seminars, education and pastoral care.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "First Responder", "Coworker", "Family"],
    cost: "Free",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "First Responders Peer Support Network",
    url: "https://www.frpsn.org/",
    description:
      "Peer support, clinical referrals, crisis intervention, chaplain services, training and possible treatment financial assistance.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Family"],
    cost: "Free / Assistance-based",
    geographicScope: "North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Veterans Bridge Home",
    url: "https://veteransbridgehome.org/",
    description:
      "Connects veterans, service members, and their families to housing, employment, mental/behavioral health services, VA benefits navigation, transportation, and financial support through personalized case navigation.",
    needCategoryIds: ["housing-transportation", "career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free",
    geographicScope: "Metrolina/Charlotte, Triad, Sandhills & Triangle, North Carolina",
    state: "North Carolina",
    verifiedDate: "2026-09-29",
  },
  {
    name: "United Way of Forsyth County — Veterans Services (SSVF)",
    url: "https://www.uwforsyth.org/veterans",
    description:
      "SSVF program run with Salvation Army and Goodwill Industries providing housing search/placement, short-term rent/utility/moving-cost assistance, VA benefits navigation, transportation, childcare, and legal services for very low-income veteran families.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Piedmont Triad — Davidson, Davie, Forsyth, Guilford, Stokes, Surry & Yadkin counties",
    state: "North Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Very low-income veteran families (SSVF income-based criteria)",
  },
  {
    name: "NCServes (AmericaServes network)",
    url: "https://www.ncserves.org/about-ncserves",
    description:
      "North Carolina's statewide coordinated-care network of 250+ partner organizations connecting veterans, service members, and families to housing, employment, mental health, financial, legal, and crisis assistance through a single point of entry.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free",
    geographicScope: "North Carolina (4 regional coordination centers)",
    state: "North Carolina",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Camp Corral — North Carolina",
    url: "https://www.campcorral.org/camps/",
    description:
      "Free week-long summer camp for children ages 8–15 of wounded, ill, injured, or fallen military service members and veterans, held at YMCA Camp Hanes in King, NC.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Family", "Gold Star", "Survivor"],
    cost: "Free",
    geographicScope: "King, North Carolina (Piedmont Triad)",
    state: "North Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Children ages 8-15 of wounded, ill, injured, or fallen military service members/veterans",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — South Carolina
  // ---------------------------------------------------------------------
  {
    name: "South Carolina Veteran Coalition",
    url: "https://scdva.sc.gov/south-carolina-veteran-coalition",
    description:
      "No-wrong-door coordinated platform connecting users with vetted housing, employment, education, mental health, benefits and family support.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "South Carolina Department of Veterans' Affairs",
    url: "https://scdva.sc.gov/",
    description:
      "Benefits/claims, county offices, employment, housing, transition support and peer mentorship.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Upstate SC AMBUCS",
    url: "https://www.upstatescambucs.org/",
    description:
      "Custom-fitted adaptive AmTryke tricycles for veterans and children with lifelong mobility challenges.",
    needCategoryIds: ["equipment-grants", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Grant / Donor-funded",
    geographicScope: "Upstate South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "First Responder Support Team (FRST)",
    url: "https://bhdd.sc.gov/index.php/office-mental-health/services/first-responder-support-team-frst",
    description:
      "Confidential assessment, referral, short-term counseling, trauma therapy, substance-use treatment, couples and family therapy.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Family"],
    cost: "Free / State-supported / Varies",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "South Carolina Law Enforcement Assistance Program (SCLEAP)",
    url: "https://www.sled.sc.gov/scleap",
    description:
      "Critical incident stress management, chaplaincy, peer support and confidential care/referral.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Coworker", "Family"],
    cost: "Free",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "SHIELD Recovery Peer Support",
    url: "https://sc-rsi.org/shield/",
    description:
      "Peer-led trauma-recovery support groups plus chaplaincy, therapy-K9 and critical-incident peer support.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "EMS", "Law Enforcement"],
    cost: "Free / Varies",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): Verify current direct website before production publish.
    name: "Coastal Carolina Adaptive Sports & Recreation",
    url: "https://www.va.gov/adaptivesports/docs/cbasp_web_spreads.pdf",
    description:
      "Adaptive archery, boccia, golf, powerlifting, tennis, track and field, and wheelchair basketball.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Varies",
    geographicScope: "North Myrtle Beach / Coastal South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Warrior Surf Foundation",
    url: "https://www.warriorsurf.org/",
    description:
      "Free 12-week surf-therapy program combining surfing, yoga, and psycho-education for veterans, active-duty service members, and their immediate family members struggling with PTSD, anxiety, depression, and transition issues.",
    needCategoryIds: ["mental-health", "sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Folly Beach / Charleston, South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans, active-duty service members, and their immediate family members",
  },
  {
    name: "Upstate Warrior Solution",
    url: "https://upstatewarriorsolution.org/",
    description:
      "Community-based nonprofit providing holistic service coordination — housing, employment, healthcare/benefits navigation, education, and mental-health referrals — for veterans and (since 2022) first responders and their families across the SC Upstate.",
    needCategoryIds: ["purpose-community", "career-education", "housing-transportation", "mental-health"],
    audienceTags: ["Veteran", "Law Enforcement", "Fire", "EMS", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Upstate South Carolina — Greenville, Anderson, Pickens, Spartanburg & Oconee counties",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    phone: "864-520-2073",
  },
  {
    name: "SC FAST (South Carolina Firefighters Assistance and Support Team)",
    url: "https://scfast.org/learn_more/",
    description:
      "Statewide behavioral-health nonprofit providing peer support, suicide-awareness training, and connections to clinical mental-health services for SC firefighters, EMS, public safety personnel, and 911 telecommunicators/dispatchers and their families.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Fire", "EMS", "Dispatch", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    phone: "1-844-972-3278",
  },
  {
    name: "Mission United — Trident United Way",
    url: "https://www.tuw.org/mission-united",
    description:
      "Connects veterans, active-duty service members, and their families in the Charleston tri-county area to navigation/referral support, financial assistance, employment/education services, legal assistance, and healthcare/mental-health resources.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family", "Caregiver"],
    cost: "Free — navigation/case-management service",
    geographicScope: "Charleston / Tri-County South Carolina (Berkeley, Charleston & Dorchester counties)",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Active duty (all branches, incl. Reserve/Guard), military spouses and dependents, caregivers, and veterans of any era with any discharge",
    phone: "843-740-9000",
  },
  {
    name: "Fisher House — Ralph H. Johnson VA Medical Center",
    url: "https://www.fisherhouse.org/programs/houses/current-houses/south-carolina-ralph-h-johnson-va-medical-center/",
    description:
      "Free \"home away from home\" lodging near the Charleston VA Medical Center for families and caregivers of veterans receiving treatment there.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Charleston, South Carolina",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Family/caregiver of a veteran patient at the Charleston VA Medical Center, generally living 50+ miles away; referral needed via the veteran's VA social worker/provider",
    phone: "843-805-8200",
  },
  {
    name: "Alston Wilkes Society — Veteran Services",
    url: "https://www.alstonwilkes.org/veteran-services",
    description:
      "South Carolina nonprofit providing transitional Veterans Homes for homeless male veterans in Columbia and Greenville, plus a statewide SSVF program offering temporary financial assistance (rent, utilities, deposits, moving costs) to veterans and families at risk of or experiencing homelessness.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free to eligible participants",
    geographicScope: "South Carolina (statewide SSVF; Veterans Homes in Columbia, Greenville, Greer, Summerville & Spartanburg)",
    state: "South Carolina",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans Homes program is for male veterans experiencing homelessness; SSVF eligibility depends on discharge characterization, income, and homelessness/at-risk status",
    phone: "803-995-8464",
  },

  // ---------------------------------------------------------------------
  // Southeast Regional — Kentucky
  // ---------------------------------------------------------------------
  {
    // TODO(verify): Cost not confirmed on the org's own page — call 404-692-0933 to confirm before publishing as "Free."
    name: "Catalyst Sports – Louisville/Lexington Chapter",
    url: "https://www.catalystsports.org/louisville",
    description:
      "Adaptive rock climbing clinics in Louisville (Rocksport) and Lexington (LEF Climbing) for people with physical disabilities, plus a dedicated Veterans program (VetsClimb/VetsCycle/VetsHike) for service members with physical or mental service-related injuries.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Civilian Supporter"],
    cost: "Not confirmed — contact to confirm program cost",
    geographicScope: "Louisville / Lexington, Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Kentucky First Responder Peer Support Team",
    url: "https://kyfrpst.org/",
    description:
      "Confidential peer support from a statewide multidisciplinary first-responder team.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder"],
    cost: "Free",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): Cost not explicitly stated on the org's own site — call 1-888-522-7228 to confirm before publishing a firmer cost claim.
    name: "Kentucky Community Crisis Response Team (KCCRT)",
    url: "https://kccrt.ky.gov/",
    description:
      "Statewide, state-run volunteer peer-support and crisis-response team of first responders, mental-health professionals, and chaplains that deploys 24/7 to provide Critical Incident Debriefings and Psychological First Aid to first responders and communities after line-of-duty deaths, mass casualty events, and disasters.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "First Responder", "Civilian Supporter"],
    cost: "Not explicitly stated — state-run program requested via a 24/7 hotline",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    phone: "1-888-522-7228",
    availability: "24/7 response request line",
  },
  {
    name: "Kentucky Veterans Program Trust Fund",
    url: "https://veterans.ky.gov/veterans-trust-fund/Pages/default.aspx",
    description:
      "State trust fund supporting programs and projects benefiting Kentucky veterans.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran"],
    cost: "Grant / Varies",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Kentucky 988",
    url: "https://988.ky.gov/",
    description:
      "State 988 suicide, mental-health and substance-use crisis access.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Kentucky Law Enforcement Peer Support Grant Program",
    url: "https://www.kentucky.gov/Pages/Activity-stream.aspx?n=AttorneyGeneral&prId=1923",
    description:
      "Grant support for agencies creating or strengthening peer-support teams addressing chronic stress and officer mental health.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement"],
    cost: "Grant",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
  },
  {
    // TODO(verify): Find public registration landing page before production if available.
    name: "Kentucky Post-Critical Incident Seminar (KYPCIS)",
    url: "https://apps.legislature.ky.gov/law/kar/titles/503/005/140/",
    description:
      "Multi-day seminar with stress/trauma education, coping, resiliency, relationship work, peer groups and clinician sessions.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Dispatch", "Family"],
    cost: "Free / State-supported",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
  },
  {
    name: "Kentucky Department of Veterans Affairs — Veterans Benefits Field Representatives",
    url: "https://veterans.ky.gov/Benefits/Pages/default.aspx",
    description:
      "State agency providing free, professional help to veterans and their dependents filing federal and state VA claims, appeals, and benefits counseling, through Veterans Benefits Field Representatives located statewide.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Kentucky (statewide field offices)",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    phone: "502-564-9203",
  },
  {
    name: "Team River Runner — Kentucky Central Chapter",
    url: "https://www.teamriverrunner.org/kentucky-central/",
    description:
      "Free adaptive paddlesports (kayaking, SUP, whitewater) program for veterans, active-duty service members, and their families, providing all boats, gear, instruction, transportation, food and lodging at no cost to participants.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Family", "Disabled"],
    cost: "Free",
    geographicScope: "Central Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Kentucky C.O.P.S. (Concerns of Police Survivors)",
    url: "https://www.copskentucky.net/",
    description:
      "Statewide nonprofit providing emotional support, financial assistance, and legal help to surviving families and coworkers of Kentucky law enforcement officers killed in the line of duty; support available 24/7/365 with no membership fee.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Law Enforcement", "Survivor", "Family", "Coworker", "Gold Star"],
    cost: "Free",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    eligibility: "Surviving families/coworkers of law enforcement officers whose line-of-duty death meets federal C.O.P.S. criteria",
    phone: "606-356-5578",
  },
  {
    name: "Volunteers of America Mid-States — Veterans Services (SSVF)",
    url: "https://www.voamid.org/services/veterans-services/",
    description:
      "VA-funded Supportive Services for Veteran Families program providing outreach, case management, and direct rent/utility/moving-cost assistance to low-income veteran families who are homeless or at risk of homelessness, serving Louisville, Lexington, and many other Kentucky counties.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Kentucky (statewide/multi-county, HQ Louisville)",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    eligibility: "Low-income veteran families (household income ≤50% area median income) who are homeless or at risk",
    phone: "502-636-0771",
    // Own site's "Ministry of Service" page: "Volunteers of America is an interdenominational church — a church with a distinctive ministry of service."
    faithBased: true,
    faithAffiliationSource: "https://www.voamid.org/ministry-of-service/",
  },
  {
    name: "USA Cares",
    url: "https://usacares.org/",
    description:
      "Kentucky-headquartered (Louisville) national nonprofit providing emergency financial assistance to post-9/11 veterans and military families facing housing loss or job disruption, plus career transition support.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free — grant/assistance program, apply via the site",
    geographicScope: "Kentucky (HQ Louisville) / national",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    phone: "1-800-773-0387",
  },
  {
    // TODO(verify): ky.ng.mil returned a 403 on direct automated fetch (likely bot-blocking); recommend a manual spot-check of the link.
    name: "Kentucky National Guard Family Assistance Center",
    url: "https://ky.ng.mil/Benefits-Resources/Family-Assistance-Center/",
    description:
      "Statewide \"one-stop shop\" offering legal assistance, financial counseling, TRICARE support, ID card/DEERS help, crisis intervention/referral, and community outreach for service members, veterans, retirees, and their military dependents, with locations in 10 Kentucky cities.",
    needCategoryIds: ["family-support", "financial-assistance", "legal-benefits"],
    audienceTags: ["Guard/Reserve", "Active Military", "Veteran", "Family", "Military Spouse"],
    cost: "Free",
    geographicScope: "Kentucky (statewide — Frankfort, Louisville, Lexington, Bowling Green, London, Prestonsburg, Burlington, Ashland, Richmond, Owensboro)",
    state: "Kentucky",
    verifiedDate: "2026-09-29",
    phone: "1-800-372-7601",
    availability: "24/7 main hotline",
  },

  // ---------------------------------------------------------------------
  // Texas Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): tvc.texas.gov blocks automated verification requests; reconfirm page content directly before publishing.
    name: "Texas Veterans Commission — Military Veteran Peer Network",
    url: "https://tvc.texas.gov/mental-health/military-veteran-peer-network/",
    description:
      "Statewide network of trained veteran and family peers offering camaraderie, mental-health awareness and connection to local, state and federal resources.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Texas",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Combined Arms",
    url: "https://www.combinedarms.us/",
    description:
      "Veteran-founded referral platform connecting service members, veterans and military families to 300+ vetted partner organizations for housing, employment, benefits claims and mental-health support.",
    needCategoryIds: ["career-education", "housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family", "Guard/Reserve"],
    cost: "Free",
    geographicScope: "Houston / North Texas (statewide via the Texas Veterans Network)",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Adaptive Training Foundation",
    url: "https://www.adaptivetrainingfoundation.org/",
    description:
      "Adaptive strength-and-conditioning programs (ReDefine, Hyper Training Camp, AdaptiveX) for veterans and others with limb loss, spinal cord injury or physical/traumatic impairment.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free to participants",
    geographicScope: "Carrollton / Dallas–Fort Worth (draws participants nationwide)",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Texas Veterans Land Board — Home Loans",
    url: "https://www.glo.texas.gov/veterans/home-loans",
    description:
      "State-backed home loans up to $832,750 with competitive below-market fixed rates and little-to-no down payment for eligible Texas veterans, military members and surviving spouses.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Survivor"],
    cost: "Loan program — not a grant; rates below market, discounted further at 30%+ VA disability rating",
    geographicScope: "Texas",
    state: "Texas",
    eligibility:
      "Texas resident; active duty, Guard/Reserve with 20+ qualifying years, or veteran with 90+ active-duty days (or earlier discharge for service-connected disability); honorable, general or medical discharge required.",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): site does not itemize per-program cost/fee structure; confirm before publishing.
    name: "Texas Parasport",
    url: "https://www.texasparasport.org/",
    description:
      "Statewide network connecting Texans with physical disabilities, including veterans, to adaptive-sports programs, equipment loans and competitions across the Austin, Dallas–Fort Worth, Houston and San Antonio regions.",
    needCategoryIds: ["sports-fitness", "equipment-grants"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Varies by member program",
    geographicScope: "Texas",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Texas Statewide Peer Support Network (TDEM)",
    url: "https://tdem.texas.gov/response/peer-support-network",
    description:
      "Confidential, voluntary peer-to-peer support and emotional first aid for volunteer, paid, active and retired Texas first responders — law enforcement, fire, EMS, dispatch and corrections — by phone/text (979-820-7337) or the Lone Star Readiness app.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "First Responder"],
    cost: "Free",
    geographicScope: "Texas",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): tvc.texas.gov blocks automated verification requests; reconfirm page content directly before publishing.
    name: "Texas Veterans Commission — Fund for Veterans' Assistance",
    url: "https://tvc.texas.gov/grants/",
    description:
      "State grant fund reimbursing nonprofits, local governments and veterans service organizations that deliver direct services — emergency financial assistance, transportation, mental-health counseling, homeless-veteran housing and legal aid — to Texas veterans and families; does not grant directly to individuals.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Grant / Varies (funds service providers, not individuals)",
    geographicScope: "Texas",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): hhs.texas.gov blocks automated verification requests; reconfirm page content directly before publishing.
    name: "Texas 988",
    url: "https://www.hhs.texas.gov/services/mental-health-substance-use/mental-health-crisis-services/988-suicide-crisis-lifeline",
    description:
      "State-coordinated 988 suicide, mental-health and substance-use crisis access connecting Texans to local crisis centers and mobile outreach by call, text or chat.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Texas",
    state: "Texas",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Texas Lawyers for Texas Veterans (State Bar of Texas)",
    url: "https://www.texasbar.com/AM/Template.cfm?Section=Texas_Lawyers_for_Texas_Veterans",
    description:
      "State Bar of Texas program (since 2010) working with local bar associations, legal aid organizations and veteran service providers to host civil legal advice clinics throughout the state, connecting veterans and their families with volunteer attorneys for pro bono help.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — pro bono civil legal assistance and legal advice clinics for veterans and families who otherwise cannot afford legal services (texasbar.com)",
    geographicScope: "Texas — clinics hosted throughout the state",
    eligibility: "Veterans and their families who otherwise cannot afford legal services",
    availability: "Legal advice clinics scheduled statewide — see the TLTV Legal Clinic Calendar on the site",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Texas Legal Services Center — Texas Veterans Legal Assistance Program",
    url: "https://www.tlsc.org/veterans",
    description:
      "Statewide legal-aid project providing civil legal help at no charge to low-income Texas veterans and their families — VA benefits and discharge upgrades, family law, housing and eviction, consumer and bankruptcy issues, estate planning, employment discrimination and public benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — 'legal assistance at no charge' for eligible clients (tlsc.org)",
    geographicScope: "Texas — statewide project (Austin-based)",
    eligibility: "Texas resident; veteran or the spouse, dependent, or surviving spouse of a veteran; household income at or below 200% of the Federal Poverty Guidelines",
    availability: "Year-round — phone intake and online application",
    phone: "800-622-2520 (Option 2)",
    hours: "Monday–Friday, 8:00 AM–5:00 PM",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): tvc.texas.gov blocks automated verification (browser firewall) — reconfirm the 294-VCSO count, directory link and free-claims wording directly before publishing.
    name: "Texas Veterans Commission — Veteran County Service Officers",
    url: "https://tvc.texas.gov/",
    description:
      "Network of 294 county-level Veteran Service Officers across Texas who help veterans, dependents and survivors file VA disability, pension, education and burial claims and appeals — free assistance, with a statewide VCSO directory linked from the TVC site.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — TVC states veterans can get 'free assistance including claims filing' (tvc.texas.gov)",
    geographicScope: "Texas — 294 county Veteran Service Officer offices (directory linked from tvc.texas.gov)",
    eligibility: "Texas veterans, dependents and survivors seeking help with VA claims",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Texas State Affordable Housing Corporation — Homes for Texas Heroes",
    url: "https://www.tsahc.org/landing/veteran-mortgage-loans",
    description:
      "Statewide nonprofit program pairing fixed-rate home loans for veterans, police, firefighters, EMS, county jailers, corrections officers and educators with down payment assistance of up to 5% of the loan amount — as a grant that never has to be repaid or a forgivable second lien fully forgiven after three years — plus Mortgage Credit Certificates for first-time buyers.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Survivor", "Law Enforcement", "Fire", "EMS", "Corrections"],
    cost: "Loan program — fixed-rate mortgage plus DPA up to 5% of the loan amount (grant that never has to be repaid, or forgivable second lien forgiven after three years); MCC fee waived for Texas Heroes",
    geographicScope: "Texas — statewide through TSAHC-approved participating lenders",
    eligibility: "Veterans (including active duty assigned to a Texas base with Texas home of record, Texas National Guard members, and unmarried surviving spouses of veterans), police, firefighters, EMS, county jailers, corrections officers and educators; credit score 620+ (government loans) or 640+ (conventional); income and purchase-price limits vary by county",
    phone: "877-508-4611",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not state cost — confirm temporary housing, rent/utility assistance and home-repair services are provided free of charge before setting cost to 'Free'.
    // Own About page: "VOA Texas a faith-based organization that empowers individuals and families to overcome obstacles..."
    name: "Volunteers of America Texas — Assistance for Veterans",
    url: "https://www.voatx.org/services/veterans",
    description:
      "Texas nonprofit providing veterans and their families with temporary housing, temporary financial assistance for rent and utility deposits, individualized case management, housing location and stabilization help, and job placement in Dallas/Fort Worth, plus a specialized Veterans' Home Repair Program in Houston.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Dallas / Fort Worth and Houston, Texas",
    eligibility: "Veterans and their families in the Dallas/Fort Worth and Houston areas",
    phone: "817-369-8857 (Fort Worth veteran programs); 713-460-0781 (Houston home repair)",
    state: "Texas",
    verifiedDate: "2026-10-08",
    faithBased: true,
    faithAffiliationSource: "https://www.voatx.org/about",
  },
  {
    name: "Fisher House Inc. San Antonio",
    url: "https://fisherhouseinc.org/",
    description:
      "Local Fisher House support corporation for nine houses across three San Antonio campuses — Brooke Army Medical Center, South Texas VA and JBSA-Lackland — providing lodging at no cost to military and veteran families while their loved ones receive care at nearby VA and military hospitals (26,656 nights of lodging to 1,904 families in 2025).",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free — 'providing them with lodging at no cost to them while their loved ones undergo medical treatment' (fisherhouseinc.org)",
    geographicScope: "San Antonio, TX — three campuses / nine Fisher Houses",
    eligibility: "Families of veterans and active-duty patients receiving care at BAMC, the South Texas VA or JBSA-Lackland; each house sets its own guest requirements",
    phone: "210-673-7500",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not state a cost/fee for recipient families — confirm assistance is provided at no cost before setting cost to 'Free'.
    name: "The 100 Club — Houston",
    url: "https://the100club.org/",
    description:
      "Member-funded nonprofit (since 1953) providing immediate financial assistance — $20,000 at first response — to dependent families of peace officers and firefighters killed or seriously injured in the line of duty, fulfilling mortgages, auto loans and debts and funding college costs for dependents, plus life-protecting equipment grants to local law enforcement agencies ($14.4M+ to date).",
    needCategoryIds: ["financial-assistance", "family-support", "equipment-grants"],
    audienceTags: ["Law Enforcement", "Fire", "Family", "Survivor"],
    cost: "Not stated on the org's own site — 100% member-funded charity providing assistance to families",
    geographicScope: "Houston, TX — dependent families of fallen or seriously injured peace officers and firefighters, including statewide agencies such as Texas DPS",
    eligibility: "Dependent families of peace officers and firefighters killed or seriously injured in the line of duty",
    phone: "713-952-0100",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Project MEND — Veterans Program",
    url: "https://www.projectmend.org/veterans",
    description:
      "San Antonio nonprofit providing Texas veterans, surviving spouses and dependents with free refurbished medical equipment and assistive devices — wheelchairs, power chairs, hospital beds, Hoyer lifts, walkers, scooters and more — with no VA disability-rating requirement (program supported by a Texas Veterans Commission Fund for Veterans' Assistance grant).",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Veteran", "Survivor", "Family"],
    cost: "Free — 'free medical equipment for veterans, surviving spouses, and their dependents' (projectmend.org)",
    geographicScope: "San Antonio / South Texas — serves Texas veterans and families (Texas photo ID required)",
    eligibility: "Texas veterans (any discharge status), surviving spouses and dependent spouses/children; prescription or letter of medical necessity plus proof of veteran status or relationship; no income or VA disability-rating requirement stated on the site",
    availability: "Rolling intake — apply online and a caseworker follows up with next steps",
    phone: "210-223-6363",
    hours: "Monday–Friday, 8:00 AM–12:00 PM and 1:00 PM–5:00 PM",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): tvc.texas.gov blocks automated verification (browser firewall) — reconfirm the free-of-charge wording, phone number and priority-of-service details directly before publishing.
    name: "Texas Veterans Commission — Veterans Employment Services",
    url: "https://tvc.texas.gov/employment",
    description:
      "State employment program pairing Texas veterans, transitioning service members and eligible spouses with Veteran Career Advisors for skills assessment, job coaching, resume and interview help and placement — offered free through American Job Centers, VA facilities and military installations across Texas.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse", "Family"],
    cost: "Free — 'All employment services to veterans, eligible spouses and family members, and employers are offered free of charge' (tvc.texas.gov)",
    geographicScope: "Texas — statewide through 28 Local Workforce Development Areas, American Job Centers, VA facilities and military installations",
    eligibility: "Texas veterans, transitioning service members and eligible spouses and family members; priority of service for veterans facing barriers to employment (disabled, homeless, low-income, recently separated, or without a high school diploma)",
    phone: "512-463-2333",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): tvc.texas.gov blocks automated verification (browser firewall) — reconfirm the 150-hour exemption terms and current eligibility rules directly on the TVC Hazlewood page before publishing.
    name: "Hazlewood Act (Texas Veterans Commission)",
    url: "https://tvc.texas.gov/education/hazlewood",
    description:
      "State tuition exemption granting eligible Texas veterans, spouses and dependent/legacy children up to 150 semester credit hours of tuition and specified fees at Texas public colleges and universities, including transferring unused hours to a child under Hazlewood Legacy.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "State tuition exemption — up to 150 credit hours of tuition and specified fees at Texas public institutions (not a cash award)",
    geographicScope: "Texas — usable at public colleges and universities statewide",
    eligibility: "Veterans with Texas residency ties (resident at enlistment, Texas home of record, or entered service in Texas) and 181+ days of active duty, honorably discharged, plus their spouses and dependent/legacy children; federal education-benefit and student-loan-default restrictions apply; DD-214 or discharge papers required",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not state program cost — confirm services are free before setting cost to 'Free'.
    name: "Grace After Fire",
    url: "https://www.graceafterfire.org/",
    description:
      "Women-veteran-founded nonprofit (since 2002) serving women veterans across Texas with peer-led groups (Coffee and Conversation, Table Talk Color Me Camo), the STARS financial-resiliency program, health and wellness programs and resource navigation — 900+ women veterans served in 2025.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Texas — women veterans statewide (certified by the Texas Veterans Commission)",
    eligibility: "Women veterans and their families — programs designed by women veterans, for women veterans",
    availability: "Peer groups meet weekly — Coffee and Conversation Mondays 9:30–10:00 AM CT and Table Talk Color Me Camo Thursdays 10:00–11:00 AM CT, in person and online",
    phone: "832-769-6582",
    hours: "Monday–Friday, 8:00 AM–5:00 PM CT",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "PTSD Foundation of America — Camp Hope",
    url: "https://ptsdusa.org/camp-hope",
    description:
      "Six-to-nine-month interim housing program in Houston for combat veterans with PTSD — peer support, certified combat-trauma mentoring, weekly sessions with licensed clinicians, family transition support, vocational prep and job training — at no cost to veterans or their families, with virtual navigation support for veterans beyond the Houston area.",
    needCategoryIds: ["mental-health", "housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — 'There is no cost for the veteran or their families' (ptsdusa.org)",
    geographicScope: "Houston, TX (Camp Hope facility) — virtual navigation for veterans regardless of location; outreach chapters in three states",
    eligibility: "Combat veterans with PTSD and their families; residents enter through the Resident Application on the site",
    availability: "Rolling — six-to-nine-month program with Resident Application; no-cost warrior and family peer groups run through outreach chapters",
    phone: "877-717-7873 (Combat Trauma Help Line); 832-912-4429 (office)",
    hours: "Combat Trauma Help Line: 24/7",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Steven A. Cohen Military Family Clinics at Endeavors — San Antonio, El Paso & Killeen",
    url: "https://www.endeavors.org/cohen-clinics",
    description:
      "Three Texas outpatient mental-health clinics of the Cohen Veterans Network providing therapy (in person or telehealth), case management, support groups and life-skills events for post-9/11 veterans regardless of discharge status, active-duty members with a TRICARE referral and military family members.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Accepts all major insurance including TRICARE — 'cost should never be a barrier to care'; for clients without insurance, care may be available at no cost (case-by-case) (endeavors.org)",
    geographicScope: "San Antonio, El Paso and Killeen, Texas (in-person clinics plus telehealth)",
    eligibility: "All post-9/11 veterans, including National Guard and Reserves, regardless of role in uniform, discharge status or combat experience; active-duty service members with a TRICARE referral; military family members (parents, siblings, spouses, children) regardless of dependent status",
    phone: "833-828-6439 (main); 210-399-4838 (San Antonio clinic)",
    hours: "San Antonio clinic: Monday–Thursday 8:00 AM–8:00 PM; Friday 8:00 AM–3:00 PM",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Gold Star Parent's Retreat",
    url: "https://goldstarparentsretreat.org/",
    description:
      "Fort Worth nonprofit founded in 2016 by Gold Star parents hosting an all-inclusive weekend retreat of healing and connection for parents of fallen service members — any branch, any cause of loss — with room, meals and entertainment covered for the entire weekend.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Gold Star", "Survivor", "Family"],
    cost: "Free to attendees — 'We cover your room and meals and entertainment for the entire weekend' (goldstarparentsretreat.org); donor-sponsored",
    geographicScope: "Fort Worth, TX — annual retreat open to Gold Star parents nationwide (out-of-state guests coordinate travel by email)",
    eligibility: "Parents of a service member who died while serving — any branch, any cause of death; retreats are RSVP-only",
    availability: "Annual retreat — 2027 date and location pending; RSVP/waitlist via GSPRTX@gmail.com",
    phone: "817-908-0073",
    state: "Texas",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Virginia Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): dvs.virginia.gov blocks automated verification requests; reconfirm page content directly before publishing.
    name: "Virginia Department of Veterans Services — Benefits & Services",
    url: "https://www.dvs.virginia.gov/benefits-services",
    description:
      "34 regional Veteran Service Representative offices statewide provide free help developing and filing claims for federal and state veterans benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Virginia Law Enforcement Assistance Program (VALEAP)",
    url: "https://valeap.org/",
    description:
      "Critical Incident Stress Management, peer support, Post Critical Incident Seminars and EMDR therapy for Virginia law enforcement officers, dispatchers and their families after traumatic or critical incidents; staffed largely by volunteer LE peers and clinicians.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Dispatch", "Family"],
    cost: "Free to Virginia law enforcement, dispatchers and CISM/peer-team members",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Virginia First Responder Support Services (VFRSS)",
    url: "https://www.vfrss.org/",
    description:
      "Trains police, fire, EMS and dispatch personnel as certified peer supporters covering suicide prevention, PTSD and mental wellness, and connects first responders to a peer within 24 hours of a request.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "First Responder"],
    cost:
      "Peer-support requests are free; 2-day agency peer-support training includes 5 free seats for the hosting department, additional seats $150/person",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): confirm current Fort Belvoir chapter session schedule before publishing.
    name: "Team River Runner — Fort Belvoir Chapter",
    url: "https://www.trrftbelvoir.org/",
    description:
      "Adaptive kayaking, whitewater training and paddling sessions for veterans, active-duty service members and their families, built around community and peer connection.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family", "Disabled"],
    cost: "Free",
    geographicScope: "Fort Belvoir / Northern Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Virginia Values Veterans (V3) Program",
    url: "https://dvsv3.com/",
    description:
      "State program training and certifying Virginia employers on veteran recruiting, hiring and retention, connecting job-seeking veterans with V3-certified employers; certified small employers can also earn up to $10,000 in hiring grants.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Guard/Reserve", "Military Spouse"],
    cost: "Free",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): dvs.virginia.gov blocks automated verification requests; reconfirm page content directly before publishing.
    name: "Virginia Veteran and Family Support (VVFS)",
    url: "https://www.dvs.virginia.gov/benefits-services/veteran-and-family-support",
    description:
      "Statewide peer recovery support, care coordination, couples workshops and family retreats for veterans and families navigating PTSD, TBI, substance use or transition stress; does not provide crisis services.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    name: "Virginia Housing — Granting Freedom",
    url: "https://www.virginiahousing.com/homebuyers/military-grants",
    description:
      "Home-accessibility modification grants for Virginia veterans and service members with a service-connected disability from a line-of-duty injury; pairs with VA-guaranteed loans and closing-cost assistance for homebuying.",
    needCategoryIds: ["housing-transportation", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Grant — no repayment; up to $8,000",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },
  {
    // TODO(verify): 988va.org / dbhds.virginia.gov block automated verification requests; reconfirm page content directly before publishing.
    name: "Virginia 988 Suicide & Crisis Lifeline",
    url: "https://988va.org/",
    description:
      "State-coordinated 988 access connecting Virginians to local crisis centers by call, text or chat; Virginia's 988 line handled an average of over 10,000 contacts per month in 2024.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free",
    geographicScope: "Virginia",
    state: "Virginia",
    verifiedDate: "2026-08-21",
  },

  // ---------------------------------------------------------------------
  // Kansas Regional
  // ---------------------------------------------------------------------
  {
    name: "War Horses for Veterans",
    url: "https://warhorsesforveterans.org/",
    description:
      "Fully funded, donor-backed equine programs (3-5 day sessions) pairing combat veterans, active-duty/veteran special operations personnel, and first responders with performance horses to build leadership, communication and resilience skills.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free — travel, lodging, meals and program costs are fully covered for participants",
    geographicScope: "Stilwell, KS / national reach",
    state: "Kansas",
    verifiedDate: "2026-08-27",
    eligibility: "Combat veterans, active-duty/veteran SOF personnel, and first responders.",
  },
  {
    name: "Outside the Wire Veterans Foundation",
    url: "https://www.outsidethewire.org/",
    description:
      "Southeast Kansas (Pittsburg, KS) veteran-led nonprofit providing hands-on VA disability and pension claims assistance, peer support, suicide-prevention training, and hiking, fishing, camping and reunification retreats.",
    needCategoryIds: ["legal-benefits", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — accredited VA claims assistance is free by federal law; no fees stated for peer-support or outdoor programming",
    geographicScope: "Southeast Kansas",
    state: "Kansas",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): KDADS's own page returned a 403 to automated verification; the mirror (Kansas Prevention Collaborative) doesn't state cost explicitly either. Reasonable to infer free as a state referral network, but reconfirm before treating as fully checked.
    name: "LiveConnected KS (KDADS Veterans Services)",
    url: "https://www.kdads.ks.gov/services-programs/behavioral-health/veterans-services",
    description:
      "State-run behavioral-health and suicide-prevention resource network connecting Kansas service members, veterans, National Guard/Reserve, and families to treatment and peer support statewide, regardless of county.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Kansas",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Kansas Office of Veterans Services",
    url: "https://www.kovs.ks.gov/veteran-services",
    description:
      "Accredited Veteran Service Representatives, available in-person, by video, or by phone, help Kansas veterans and families file claims and navigate state and federal disability, education, medical, burial, and other earned benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — all services are provided at no charge by trained, accredited VSRs",
    geographicScope: "Statewide",
    state: "Kansas",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Arkansas Regional
  // ---------------------------------------------------------------------
  {
    name: "Arkansas Freedom Fund",
    url: "https://www.arkansasfreedomfund.org/",
    description:
      "Arkansas nonprofit restoring veterans' physical and mental wellness through free cycling, hunting, fishing, hiking, martial arts, golf, and kayaking programs, including adaptive equipment for wounded and disabled veterans.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Family"],
    cost: "Free — all programs are provided free of charge to members",
    geographicScope: "Arkansas (statewide)",
    state: "Arkansas",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Warhorse Legacy Foundation",
    url: "https://warhorselegacy.org/",
    description:
      "Northwest Arkansas nonprofit operating a 140-acre ranch near Winslow offering equine-assisted activities, outdoor recreation, peer mentorship, networking, and wellness treatments for veterans and their families.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — programs and wellness treatments are provided at no cost to veterans and their families",
    geographicScope: "Northwest Arkansas",
    state: "Arkansas",
    verifiedDate: "2026-08-27",
  },
  {
    name: "We Are The 22",
    url: "https://wearethe22.org/",
    description:
      "Arkansas-based, all-volunteer veteran suicide-intervention nonprofit whose trained veteran responder teams deploy in person 24/7 to veterans in suicidal crisis, provide peer support, and connect them with continuing care.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free",
    geographicScope: "Arkansas (statewide)",
    state: "Arkansas",
    verifiedDate: "2026-08-27",
    phone: "855-932-7384",
  },
  {
    name: "Home Base Arkansas",
    url: "https://homebasearkansas.com/",
    description:
      "Arkansas Department of Veterans Affairs initiative helping veterans and transitioning service members relocate to and settle in Arkansas through a jobs database, plus benefits, education, housing, and relocation resources.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Arkansas (statewide)",
    state: "Arkansas",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Warriors Retreat Foundation",
    url: "https://www.warriorsretreat.org/",
    description:
      "Permanent affordable-housing community for veterans in Harrison, Arkansas, offering one-bedroom units with wraparound support services and an onsite small-engine-repair shop for workforce and purpose-building opportunities.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "$738/month (includes utilities), plus $37/month for WiFi",
    geographicScope: "Harrison, AR / Northwest Arkansas",
    state: "Arkansas",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Louisiana Regional
  // ---------------------------------------------------------------------
  {
    name: "The Boot",
    url: "https://theboot.la",
    description:
      "Louisiana state-funded nonprofit helping transitioning service members and military families build post-service lives in Louisiana through one-on-one career counseling, employer connections, all-expense-paid community visits, and case management.",
    needCategoryIds: ["career-education", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Louisiana",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Louisiana Hunters for Heroes",
    url: "https://lahuntersforheroes.com/",
    description:
      "West Monroe-based Louisiana chapter of Hunters for Heroes providing cost-free hunting, fishing, and outdoor experiences for veterans, active military, law enforcement, fire, and other first responders, with transportation, lodging, meals, and gear provided.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "First Responder"],
    cost: "Free — events are cost-free to participants, funded entirely by donations",
    geographicScope: "Louisiana",
    state: "Louisiana",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Heroes on the Water — Lafayette Louisiana",
    url: "https://heroesonthewater.org/chapters/lafayette-louisiana/",
    description:
      "Volunteer-led chapter providing no-cost, therapeutic kayak-fishing events for veterans, active-duty military, first responders, and their families in the Acadiana region, with kayaks, fishing gear, and safety equipment provided; no prior experience necessary.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Acadiana region (Lafayette, LA area)",
    state: "Louisiana",
    verifiedDate: "2026-08-27",
    eligibility: "Active-duty military, veteran, law enforcement officer, first responder, or family member.",
  },
  {
    name: "Louisiana Department of Veterans Affairs",
    url: "https://vetaffairs.la.gov/",
    description:
      "Louisiana's state veterans agency, operating 80+ locations statewide including parish service officers, provides assistance with state and federal benefits, education, employment, financial assistance, veterans homes, and burial honors.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Louisiana",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Outdoor Wish Foundation (Swollfest)",
    url: "https://www.swollfest.com/outdoor-wish-foundation",
    description:
      "Grants fully-funded, once-in-a-lifetime hunting or fishing trips to armed-forces veterans and people with disabilities, funded through the annual Swollfest fishing rodeo in Grand Isle, LA; recipients are selected directly by the foundation with no application process.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — the foundation covers 100% of trip costs",
    geographicScope: "South Louisiana",
    state: "Louisiana",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Oklahoma Regional
  // ---------------------------------------------------------------------
  {
    name: "Operation Freedom Outdoors",
    url: "https://ofoveterans.com/",
    description:
      "Oklahoma nonprofit providing no- and low-cost hunting, fishing, and camping trips for veterans and first responders, pre-funded through sponsorships so participants pay little to nothing, built around camaraderie and reconnection.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free / sponsored — trips are no- and low-cost, pre-paid through donations",
    geographicScope: "Oklahoma",
    state: "Oklahoma",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): okvetunited.org blocked automated verification (403); content corroborated via search-indexed snippets and their /ssvf/ program page only — spot-check directly before publishing.
    name: "Oklahoma Veterans United",
    url: "https://okvetunited.org/",
    description:
      "Tulsa-based nonprofit (formerly Community Service Council) running housing assistance for Oklahoma veterans through the Supportive Services for Veteran Families program, a suicide-prevention grant program, and veteran employment initiatives.",
    needCategoryIds: ["housing-transportation", "mental-health", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Free",
    geographicScope: "56 of 77 Oklahoma counties (SSVF housing program)",
    state: "Oklahoma",
    verifiedDate: "2026-08-27",
    eligibility: "SSVF housing program: low-income veterans and families who are homeless or facing eviction (Housing First model).",
  },
  {
    name: "Volunteers of America Oklahoma — Veterans Employment Services",
    url: "https://www.voaok.org/services/veteran-employment-services/",
    description:
      "VOA Oklahoma program helping homeless or at-risk veterans translate military skills into civilian employment through mentoring, resume help, job matching, vocational training, transportation assistance, and clothing/tools, plus referrals to housing and behavioral-health services.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran"],
    cost: "Free — DOL-sponsored (Homeless Veteran Reintegration Program grant)",
    geographicScope: "Oklahoma City and Tulsa metro areas, plus 13 surrounding counties",
    state: "Oklahoma",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans must be homeless or at risk of homelessness and actively participating in job search activities; DD-214 preferred but not required.",
    // Own About page: "Founded in 1896, the faith-based nonprofit has services in 46 states..."
    faithBased: true,
    faithAffiliationSource: "https://www.voaok.org/about/",
  },
  {
    name: "OKVALOR — Oklahoma Veterans Assistance Locator",
    url: "https://okvalor.ok.gov/",
    description:
      "State-run locator tool from the Oklahoma Department of Veterans Affairs helping veterans, service members, and their families find nearby mental-health, housing, employment, financial, transportation, legal, education, food, and health resources by location.",
    needCategoryIds: ["purpose-community", "legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Oklahoma",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Oklahoma Veterans Resources",
    url: "https://okveteransresources.com/",
    description:
      "Free, community-maintained directory of 145+ Oklahoma veteran resources, with every listing manually reviewed, covering benefits/VSOs, tribal veteran programs, health and counseling, housing and homeless services, employment, education, legal/justice assistance, and family and community support.",
    needCategoryIds: ["purpose-community", "legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Oklahoma",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Missouri Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): org's own site doesn't explicitly state cost; a third-party source (usvetconnect.com) says events are free, but reconfirm on movetsoutdoors.org before treating as fully checked.
    name: "MO Vets Outdoors",
    url: "https://movetsoutdoors.org/",
    description:
      "Statewide veteran outdoor community operating across six Missouri regions, using roughly 60-75 annual events — archery, fishing, hunting, golf, off-roading — to reduce isolation and support veteran mental health and suicide prevention.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free / sponsored",
    geographicScope: "Statewide",
    state: "Missouri",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Camp Valor Outdoors",
    url: "https://www.campvaloroutdoors.org/",
    description:
      "Kingsville, Missouri-based nonprofit providing wounded, ill, and injured veterans free adaptive hunting, fishing, shooting sports, archery, and ATV recreation, plus lodging, meals, and equipment, now operating across 14 states.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — events are provided free for ill, injured, and wounded veterans",
    geographicScope: "Kingsville, MO / regional (14 states)",
    state: "Missouri",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Charlie 22 Outdoors",
    url: "https://charlie22outdoors.com/",
    description:
      "Webb City, Missouri-based veteran suicide-prevention organization providing free outdoor activities — hunting, fishing, archery, target shooting — and fellowship for veterans, with travel, lodging, meals, and licensing costs covered.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free — all expenses including travel, lodging, meals, tags, and licenses are covered",
    geographicScope: "Statewide",
    state: "Missouri",
    verifiedDate: "2026-08-27",
    // Own site menu: "Devotions", "Spiritual Help and Guidance", "Monthly Bible Studies"; copy calls volunteers "the core to the ministry."
    faithBased: true,
    faithAffiliationSource: "https://charlie22outdoors.com/",
  },
  {
    name: "Missouri Veterans Commission — Veterans Service Program",
    url: "https://mvc.dps.mo.gov/service/",
    description:
      "Accredited Veterans Service Officers, with offices in nearly every county, help Missouri veterans and survivors navigate disability compensation, pension, health care, education, vocational rehabilitation, burial benefits, and VA home loans.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Missouri",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): street address/phone sourced from a search-result snippet, not confirmed directly on the live-fetched site.
    name: "Warrior's Hoof Haven",
    url: "https://www.warriorshoofhaven.org/",
    description:
      "Uses structured interactions with horses, plus farming, gardening, and outdoor activities like fishing, hunting, and kayaking, to support the healing and mental wellness of combat veterans; family members participate through their veteran's membership.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "Family"],
    cost: "No participation fee stated; donation-supported",
    geographicScope: "Missouri",
    state: "Missouri",
    verifiedDate: "2026-08-27",
    eligibility: "Membership is built for combat veterans; family members participate through their veteran's membership.",
  },

  // ---------------------------------------------------------------------
  // West Virginia Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): the org's URL is ambiguous between patriots4.org (reads as a commercial resort/store page) and patriotsfour.org (veteran-mission framing) — same EIN, unclear which is current/canonical. The "354-acre" figure and a "combat wounded only" eligibility qualifier are each stated by only one secondary source — reconfirm both before publishing.
    name: "Patriots 4",
    url: "https://patriotsfour.org/",
    description:
      "Tucker County, West Virginia retreat with frontage on the Cheat River and access to the Monongahela National Forest, providing wounded veterans and their families no-cost outdoor recreation regardless of injury type.",
    needCategoryIds: ["outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free",
    geographicScope: "St. George, WV (Tucker County)",
    state: "West Virginia",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): org's own site doesn't explicitly state "free to participants" — only that donations fund the program. Reconfirm before treating as fully checked.
    name: "Potomac Highlands Wounded Warrior Outreach",
    url: "https://www.phwwo.com/",
    description:
      "Buckhannon, West Virginia nonprofit organizing outdoor sporting events — hunting, fishing, golfing, whitewater rafting, rock climbing — for wounded veterans of all wound types, visible and invisible, to support healing and community.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Potomac Highlands region",
    state: "West Virginia",
    verifiedDate: "2026-08-27",
  },
  {
    name: "RAFT — Resource Availability Family Tapestry",
    url: "https://veterans.wv.gov/Pages/Suicide-Prevention.aspx",
    description:
      "West Virginia Department of Veterans Assistance suicide-prevention initiative taking a comprehensive prevention, intervention, and postvention approach for service members, veterans, and families, connecting them with mental-health providers and community resources statewide.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "West Virginia",
    verifiedDate: "2026-08-27",
  },
  {
    name: "West Virginia Department of Veterans Assistance — Benefits Offices",
    url: "https://veterans.wv.gov/facilities/Pages/BenefitsOffices.aspx",
    description:
      "Fourteen state benefits offices plus a claims office in Huntington provide Veteran Service Officers who help veterans and families access health care, disability compensation, pension, education, housing, burial benefits, employment assistance, and appeals.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide (14 offices + 1 claims office)",
    state: "West Virginia",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Michigan Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): miofo.org doesn't explicitly state cost; program is donor/sponsor-funded and widely described as free, but not confirmed in the org's own words.
    name: "Michigan Operation Freedom Outdoors",
    url: "https://miofo.org/",
    description:
      "Partnership with the Michigan DNR centered on Sharonville State Game Area and Camp Liberty, connecting wounded veterans and people with health challenges to accessible hunting and outdoor recreation as part of recovery and peer support.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Michigan (Sharonville State Game Area / Camp Liberty)",
    state: "Michigan",
    verifiedDate: "2026-08-27",
    eligibility: "Wounded veterans and individuals with health challenges or disabilities.",
  },
  {
    name: "Croton Sportsmen for Youth and Disabled Veterans",
    url: "https://csydv.org/",
    description:
      "All-volunteer Michigan nonprofit serving the Croton River area since 2010, offering disabled veterans no-cost fishing, shooting sports, and archery while developing accessible facilities for participants with mobility limitations.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — no participation fees; 100% volunteer-run and donor-funded",
    geographicScope: "Croton, MI",
    state: "Michigan",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Michigan Outdoor Wishmakers",
    url: "https://www.mioutdoorwishmakers.com/",
    description:
      "Michigan nonprofit providing no-cost hunting and fishing adventures — including a dedicated veterans' whitetail hunt — for veterans and others living with a life-threatening illness or limiting disability, using specialized equipment and accessible lodges and charters.",
    needCategoryIds: ["outdoor-programs", "equipment-grants", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — adventures come at no cost to participants or their families",
    geographicScope: "Michigan (statewide)",
    state: "Michigan",
    verifiedDate: "2026-08-27",
    eligibility: "Participants must have a life-threatening illness or life-limiting disability; nominated via the organization's website.",
  },
  {
    // TODO(verify): mvaa.michigan.gov blocks automated verification requests; details corroborated via MI DNR license pages and MVAA search snippets — reconfirm directly before publishing.
    name: "Michigan Veterans Affairs Agency — Recreation Benefits",
    url: "https://www.michigan.gov/mvaa/quality-of-life/quality-of-life/recreation-a",
    description:
      "State portal covering free hunting and fishing licenses and free state-park (Recreation Passport) access for qualifying disabled veterans, plus links to programs like Michigan Operation Freedom Outdoors.",
    needCategoryIds: ["outdoor-programs", "financial-assistance"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for veterans who meet eligibility criteria",
    geographicScope: "Statewide",
    state: "Michigan",
    verifiedDate: "2026-08-27",
    eligibility:
      "Free hunting/fishing license: Michigan resident veteran rated 100% permanently and totally disabled (for a disability other than blindness) or individually unemployable by VA. Free Recreation Passport: Medal of Honor recipients, 100% permanently and totally disabled veterans, and ex-POWs.",
  },
  {
    // TODO(verify): fst5.org returns HTTP 403 to automated requests; facts confirmed from the org's own site content and the Michigan MDHHS behavioral-health crisis-services page — reconfirm by opening the site directly.
    name: "Frontline Strong Together (FST5)",
    url: "https://fst5.org/",
    description:
      "Statewide Michigan initiative led by Wayne State University's Department of Psychiatry with first-responder unions, offering trained peer supporters, confidential clinical care, wellness training, and a 24/7 crisis and resource line for police, fire, EMS, dispatch, and corrections personnel and their immediate families. Funded by a State of Michigan grant, with regional peer maps and provider directories covering all 83 counties.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "No out-of-pocket cost for first responders and their immediate family through Wayne Health, per the org's site",
    geographicScope: "Statewide (all 83 Michigan counties, per the org)",
    crisisResource: true,
    crisisAudience: "first-responders",
    eligibility: "Michigan police officers, firefighters, EMS personnel, correctional officers, and 911 dispatchers, plus their immediate families",
    availability: "24/7 crisis and resource line; regional peer-support teams matched through the site's map",
    phone: "833-347-8766",
    hours: "24/7",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): grant amounts are not published on this page (an MVAA news item cites an average award above $3,000 for wartime-era veterans in FY2021) — confirm current ranges before publishing.
    name: "Michigan Veterans Trust Fund (MVTF)",
    url: "https://www.michigan.gov/mvaa/quality-of-life/emergency-assistance/emergency-asst",
    description:
      "State emergency-grant program created in 1946 that helps Michigan veterans and eligible dependents weather short-term financial crises such as utility bills, rent or mortgage help, home repairs, and medical bills, with applications reviewed by local county committees. The same MVAA page takes an Emergency Assistance resource form answered within 48 hours and points to other aid such as county Soldier and Sailor Relief Funds.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site (the program provides emergency grants)",
    geographicScope: "Statewide (apply through the MVTF committee in your county of residence)",
    eligibility: "Michigan residents honorably discharged with 180 days of wartime active duty, or an expeditionary medal, or fewer days due to a service-incurred disability; peacetime-era veterans 65 and older qualify under the 65+ Peacetime Program; dependents may apply if the veteran is eligible",
    phone: "800-642-4838",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Michigan Veterans Affairs Agency — Veteran Service Officers",
    url: "https://www.michigan.gov/mvaa/county-filter-search-locations",
    description:
      "Statewide finder for VA-accredited Veteran Service Officers — MVAA staff, county offices, and the Michigan Veterans Coalition (American Legion, DAV, Vietnam Veterans of America, and VFW) — who help veterans and dependents gather evidence, file and track claims, take appeals, and get referrals on education, employment, and death benefits. Veterans may choose any VSO in their county regardless of affiliation.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — assistance is provided free of charge (MVAA)",
    geographicScope: "Statewide (searchable by county of residence)",
    eligibility: "Michigan veterans and their dependents; no requirement to stay with a particular VSO or organization",
    phone: "800-642-4838 (MVAA); 833-648-3826 (Michigan Veterans Coalition)",
    hours: "Monday–Friday, 8:00 a.m.–4:50 p.m. (1-800-MICH-VET line, per the MVAA site)",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the page lists providers but does not state their costs (it links to a Free Legal Aid Clinic and to legal aid) — confirm fee status for each resource before publishing.
    name: "Michigan Veterans Affairs Agency — Veteran Legal Services",
    url: "https://www.michigan.gov/mvaa/quality-of-life/quality-of-life/veterans-justice-a",
    description:
      "MVAA's legal-help hub for Michigan military members and veterans, pointing to law-school Veteran Legal Clinics (including Wayne State's Free Legal Aid Clinic), the Attorney General's Michigan Military and Veterans Legal Services Guide, local legal-aid offices, expungement tools, and phone intake through the Counsel and Advocacy Law Line.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Michigan)",
    eligibility: "Michigan veterans and military personnel; income rules vary by the legal-aid provider listed",
    phone: "888-783-8190",
    hours: "Counsel and Advocacy Law Line intake: Monday–Thursday 9:00 a.m.–5:00 p.m. (Wednesday until 6:00 p.m.), Friday 9:00 a.m.–1:00 p.m.",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the page never says services are free — the program is federally funded through the Jobs for Veterans State Grant, so confirm no-fee framing before publishing.
    name: "Michigan LEO — Veterans' Employment Services",
    url: "https://www.michigan.gov/leo/bureaus-agencies/wd/veterans",
    description:
      "Michigan's Department of Labor and Economic Opportunity runs Veterans' Employment Services through the Michigan Works! network, giving veterans, transitioning service members, and eligible spouses one-on-one career advising, resume and interview support, connections to registered apprenticeships and training, and employer outreach. It also runs the Michigan Incarcerated Veterans' In-Reach Program at seven correctional facilities.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Michigan Works! service centers)",
    eligibility: "Veterans with at least one day of active military service and eligible spouses receive Priority of Service; career services focus on veterans and eligible persons facing barriers to employment",
    phone: "800-285-9675",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site does not state what residents pay for housing or services — confirm the Detroit Veterans Center is no-cost before publishing.
    name: "Michigan Veterans Foundation",
    url: "https://michiganveteransfoundation.org/",
    description:
      "Detroit nonprofit serving veterans since 1989 that runs the Detroit Veterans Center transitional housing facility and resource center at 4626 Grand River Ave., with nine core services: housing, a veteran rescue program, life-skills and employment support, health-care access, PTSD counseling, transportation and meals, substance-use support, legal assistance, and permanent housing placement.",
    needCategoryIds: ["housing-transportation", "mental-health", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Detroit (statewide expansion described as planned, not yet operating)",
    eligibility: "Homeless veterans seeking transitional housing and wrap-around support services",
    availability: "Detroit Veterans Center is accepting referrals (banner on the org's site)",
    phone: "313-831-5500",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): programs and funding sources are listed but no costs are stated (SSVF aid, food, employment, case management) — confirm they are provided at no charge before publishing.
    // Own About page: "Ministry of Service — We represent our faith through joyful service to others."
    name: "Volunteers of America Michigan — Veteran Services",
    url: "https://www.voami.org/services/veteran-services/",
    description:
      "Michigan branch of Volunteers of America running veterans transitional housing in Detroit plus a menu of programs: Supportive Services for Veteran Families for homelessness prevention and rapid re-housing, the Homeless Veterans Reintegration Program for job training and placement, a Veteran Food Security Project, GPD case management, and SERV suicide-prevention engagement funded by the Staff Sgt. Parker Gordon Fox grant.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Michigan (transitional housing in Detroit; program intake form covers southern Michigan counties, and SERV is listed for 17 counties)",
    eligibility: "Program-specific: transitional housing by referral for homeless veterans; SSVF for very low-income veterans and their families; HVRP for veterans needing employment training; SERV for at-risk veterans in 17 southern Michigan counties",
    phone: "877-509-8387",
    state: "Michigan",
    verifiedDate: "2026-10-08",
    faithBased: true,
    faithAffiliationSource: "https://www.voami.org/about-us/",
  },
  {
    name: "Fisher House Michigan",
    url: "https://www.fisherhousemichigan.org/",
    description:
      "Michigan's two Fisher Houses, at the Ann Arbor and Detroit VA medical centers, let military and veterans' families stay free while a loved one receives treatment — the site states there is never a lodging fee. Together the houses can offer up to 11,680 nights of free lodging annually and have hosted more than 14,000 military and veteran caregivers.",
    needCategoryIds: ["family-support", "housing-transportation"],
    audienceTags: ["Family", "Caregiver", "Veteran", "Active Military"],
    cost: "Free — families stay at no cost and there is never a lodging fee (own site)",
    geographicScope: "Ann Arbor and Detroit",
    eligibility: "Military and veterans' families who need lodging while a loved one is receiving treatment at the medical center the house serves",
    availability: "Detroit Fisher House is newly open (site banner); combined capacity up to 11,680 nights annually",
    phone: "313-483-6543",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site does not describe how to apply or what expenses are covered — confirm current application process and award scope before publishing.
    name: "Fallen and Wounded Soldiers Fund",
    url: "https://www.fwsf.org/about",
    description:
      "Bloomfield Hills-based, all-volunteer Michigan nonprofit founded in 2006 that supports Michigan-based soldiers injured in service with living expenses and assists the families of the fallen. The org states that 97% of donations go directly to the veterans and families it serves, funded through events and private giving.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Active Military", "Veteran", "Family", "Gold Star", "Survivor"],
    cost: "Not stated on the org's own site",
    geographicScope: "Michigan (supports Michigan-based soldiers statewide)",
    eligibility: "Michigan-based soldiers injured in service and the families of the fallen, per the org's mission; application process is not described on the site",
    phone: "800-397-3729 (published as 1-800-FWSF-729)",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): only the rides are called no-cost; aid amounts, scholarship values, and any application costs are not stated — confirm before publishing.
    name: "West Michigan Veterans Coalition",
    url: "https://westmichiganveterans.org/",
    description:
      "Coalition serving veterans, service members, and families across 13 West Michigan counties with the Military Family Assistance Fund for emergency aid on housing, utilities, and critical repairs, a Share-a-Meal food program, no-cost rides to medical appointments and essential trips, employment connections, and three annual scholarships. The org reports more than 100 scholarships awarded and over 2,000 people fed.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Not stated on the org's own site (the Transportation Program is described as no-cost)",
    geographicScope: "13 West Michigan counties: Allegan, Barry, Ionia, Kent, Lake, Mason, Mecosta, Montcalm, Muskegon, Newaygo, Oceana, Osceola, Ottawa",
    eligibility: "Veterans, service members, and families in the 13 counties served; scholarships cover those currently or formerly serving (active duty, Guard, reserves, retired, honorably discharged) plus spouses and dependents up to age 26",
    availability: "Scholarships awarded annually; community meetings, workshops, and a speakers series run through the year on the site's calendar",
    phone: "231-259-8642",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the grant application PDF is from a prior cycle and no costs are stated for Loan Closet loans or grants — confirm current cycle dates, fees, and whether MPVA membership is required.
    name: "Michigan Paralyzed Veterans of America",
    url: "https://www.michiganpva.org/",
    description:
      "Michigan chapter of Paralyzed Veterans of America, serving the state since 1961 from its Brighton headquarters, with an adaptive Loan Closet, Sports and Recreation grants of up to $5,000 per cycle, Rollin' Traveler and membership grants, educational scholarships, veteran benefits services, and peer support for veterans with spinal cord injury or disease.",
    needCategoryIds: ["equipment-grants", "sports-fitness", "legal-benefits"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (chapter headquartered in Brighton, MI; describes itself as serving Michigan since 1961)",
    eligibility: "Sports and Recreation Grant: Michigan residents with spinal cord injury or disease who are voting MPVA members, a member's spouse or child, or a Michigan nonprofit building inclusive sports programs; other programs carry their own rules",
    phone: "248-476-9000",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site does not say whether tables or the virtual meeting are free, nor list locations or schedules — confirm before publishing.
    name: "Veterans Adventure League",
    url: "https://www.veteransadventureleague.org/",
    description:
      "Michigan 501(c)(3) that uses tabletop gaming to end social isolation and prevent suicide among veterans, service members, and their families, with game tables located throughout the state and a virtual peer-support meeting. New players, Game Masters, and volunteers can join or start a table in their area.",
    needCategoryIds: ["purpose-community", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (tables located throughout Michigan, per the org)",
    eligibility: "Veterans, service members, and their families; membership takes many forms and new local tables can be started on request",
    availability: "Recurring game tables across Michigan plus a virtual peer-support meeting for veterans and service members",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site does not state session fees or training costs, and several program pages read as dated — confirm current programs, costs, and intake before publishing.
    name: "No Veteran Left Behind",
    url: "https://veteranrescue.org/",
    description:
      "Lincoln Park, Michigan nonprofit founded in 2014 offering evidence-based mental health care for veterans and their families — screening, assessment, and individual, couples, family, and group therapy from master's-level clinicians — plus career programs such as VET2WORK and cyber and medical certification training, a youth empowerment program for military kids, and benefits and claims support.",
    needCategoryIds: ["mental-health", "career-education", "family-support"],
    audienceTags: ["Veteran", "Family", "Active Military"],
    cost: "Not stated on the org's own site",
    geographicScope: "Detroit / Southeast Michigan (Lincoln Park, MI)",
    eligibility: "Veterans and their families; VET2WORK requires a DD-214 (other-than-honorable accepted in most cases), state ID, and proof of education level",
    phone: "313-595-1262",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Sailor's Manifesto",
    url: "https://www.sailorsmanifesto.org/",
    description:
      "West Michigan nonprofit founded by Army combat veteran Sue Fisher providing veteran-focused suicide prevention and mental wellness through a four-part program of mental-health education, peer support, and shared sailing experiences, followed by a 33-day guided workshop journal. Other services include adaptive sailing for veterans dealing with PTSD or MST and women's sailing retreats.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free — all services are provided at no cost to participants (own site)",
    geographicScope: "West Michigan (sailing on West Michigan waters)",
    eligibility: "Veterans; the program is educational and peer-based and does not provide clinical treatment or diagnosis",
    availability: "Bookable programs — sailing experiences, full-day retreats, workshops, and classes",
    phone: "616-900-7773",
    state: "Michigan",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Operation Welcome Home",
    url: "https://welcomehomewv.com/",
    description:
      "Morgantown, West Virginia 501(c)(3) veterans support facility at Mylan Park serving the North Central West Virginia population of service members, veterans, and families. Its own site lists job placement, resume services, employment search, linkage to existing services, recreational opportunities, agriculture training, and a common meeting place for veterans.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "North Central West Virginia (Morgantown / Monongalia County)",
    eligibility: "Own site: services to all veterans and family members regardless of service era, branch, rank, ability, or socioeconomic status; \"No veteran, relative, or partner will be turned away at the time of need.\"",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Veterans Upward Bound — West Virginia",
    url: "https://vubwv.org/",
    description:
      "Elkins-based U.S. Department of Education TRIO program that has served West Virginia veterans since 1990, helping them enroll in and complete studies at colleges, universities, and technical or trade schools. The program's own site states it provides services and materials to participants at no cost.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran"],
    cost: "Free — \"VUB provides services and materials (at no cost to program participants)\" (own site)",
    geographicScope: "Statewide West Virginia (Elkins-based)",
    eligibility: "Veterans who meet the TRIO Veterans Upward Bound eligibility criteria",
    phone: "304-637-1322",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    name: "OPERATION ACTIVET",
    url: "https://operationactivet.com/",
    description:
      "Morgantown, West Virginia 501(c)(3) founded in 2017 by an Army veteran that hosts community events for veterans and first responders to build connection and support their overall physical and mental health. Its own site states the organization is locally founded and operated, not a chapter of a national organization.",
    needCategoryIds: ["purpose-community", "mental-health"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free — \"hosting completely free events that all veterans and first responders are eligible to attend\" (own site)",
    geographicScope: "Morgantown, West Virginia (locally founded and operated)",
    eligibility: "All veterans and first responders, regardless of branch, component, or department",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Legal Aid of West Virginia — Veterans Services",
    url: "https://legalaidwv.org/our-programs/legal-services/veterans-services",
    description:
      "Statewide West Virginia legal aid nonprofit running two dedicated veterans projects that help with VA benefits, discharge upgrades, eviction and housing problems, expungement, driver's license reinstatement, and other civil issues. Its own site says it serves veterans in every West Virginia county through the SSVF program and through a Legal Services to Veterans grant partnership with the Huntington VA.",
    needCategoryIds: ["legal-benefits", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — \"Any veterans qualified for our services will not be charged for our services\" (own site)",
    geographicScope: "Statewide West Virginia (12 offices, all 55 counties)",
    phone: "866-255-4370",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Compass Huntington",
    url: "https://compasshuntington.com/",
    description:
      "Huntington, West Virginia first-responder wellness program that gives members of the Huntington Police Department and Huntington Fire Department embedded mental wellness coaching, on-scene and post-incident critical incident support, confidential one-to-one coaching and resource navigation, training, and access to the Compass wellness center. Its own site describes it as promoting the overall health and wellness of police officers and fire fighters in Huntington.",
    needCategoryIds: ["mental-health", "sports-fitness"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Huntington, WV (Huntington Police & Fire Departments)",
    eligibility: "Members of the Huntington Police Department and Huntington Fire Department",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the cost quote is specifically about first-responder training access codes; other Armor Up services do not state a cost. The site also lists the national Safe Call Now line (206-459-3020) as its crisis referral, but that hotline is not operated by Armor Up WV, so no crisisResource flag.
    name: "Armor Up WV",
    url: "https://armorupwv.weebly.com/",
    description:
      "West Virginia effort providing first responders with resources and referrals for trauma, substance use, and family struggles, plus in-person and online education and training for first responders and their families. Its own site also publishes a West Virginia referral contact and free access codes to first-responder training recordings.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Family"],
    cost: "Free — \"All WV first responders can receive a code to watch the recordings for free... It is our gift to all WV First Responders\" (own site)",
    geographicScope: "West Virginia (statewide referrals and training)",
    phone: "304-651-3008",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the org's site footer shows the project is operated by Battalion 1 Consultants LLC (Hamilton, NJ) in partnership with First Responder Coaching, LLC (Winchendon, MA); the contact address is out-of-state.
    name: "West Virginia Peer Support Group",
    url: "https://www.wvpsg.org/",
    description:
      "Peer support network for West Virginia first responders and their families, created in 2024 by Upshur, Randolph, and Lewis county fire, law enforcement, EMS, and dispatch leaders to provide social connection, peer supporters with similar experience, education, training, and resource referrals. Its own site states it is not funded or endorsed by the State of West Virginia.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Upshur, Randolph & Lewis counties, West Virginia (tri-county)",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "West Virginia National Guard Foundation",
    url: "https://wvnationalguardfoundation.org/",
    description:
      "Charleston-based 501(c)(3) established in 1991 to strengthen the well-being, resilience, and readiness of West Virginia National Guard members and their families. Its own site says it provides non-reimbursable financial grants for situations such as shortfall in pay from a civilian job when called to duty, uncovered medical costs, moving expenses, unavoidable home or vehicle repairs, and education expenses not covered by other aid.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Guard/Reserve", "Family", "Gold Star"],
    cost: "Not stated on the org's own site",
    geographicScope: "West Virginia (statewide; Charleston-based)",
    eligibility: "National Guard members and their families facing unexpected financial hardship through no fault of their own",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Ascend Heroes",
    url: "https://ascendwv.com/ascend-heroes",
    description:
      "Veterans-specific initiative of Ascend WV, created in partnership with the State of West Virginia, that recruits U.S. veterans to relocate to West Virginia with a $12,000 cash incentive paid over 24 monthly payments, settlement in one of six Ascend communities, and job placement assistance from the West Virginia National Guard for veterans seeking West Virginia employment. Its own FAQ states applicants must currently live outside West Virginia.",
    needCategoryIds: ["career-education", "housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide West Virginia (six Ascend communities: Charleston, Greenbrier Valley, Morgantown, Eastern Panhandle, Greater Elkins, New River Gorge)",
    eligibility: "U.S. veterans (or within six months of separation) who are 18 or older, live outside West Virginia, and work full-time remotely, own a remote-capable business, or have secured full-time employment in West Virginia",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    name: "West Virginia Department of Agriculture — Veterans & Heroes to Agriculture",
    url: "https://agriculture.wv.gov/ag-business/veterans-and-heroes-to-agriculture",
    description:
      "West Virginia Department of Agriculture program dedicated to integrating and supporting veterans, Guard members, firefighters, law enforcement, emergency services personnel, and first responders entering or working in agriculture. Its own site offers a free membership application, scholarships reimbursing up to $600 per fiscal year for pre-approved agricultural classes or certifications, an agribusiness pitch competition, and grants to organizations serving those populations.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "First Responder", "Law Enforcement", "Fire", "EMS", "Family"],
    cost: "Free — \"The application collects a baseline of information to help direct members to pertinent resources and is free to join\" (own site)",
    geographicScope: "Statewide West Virginia (Charleston-based)",
    phone: "304-558-2210",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the org's site describes Patriot Guardens as a program of the West Virginia Military Authority (a state agency) rather than an independent nonprofit.
    name: "Patriot Guardens",
    url: "https://www.patriotguardens.com/",
    description:
      "Program of the West Virginia Military Authority providing non-formal agricultural education and hands-on learning opportunities to veterans, active duty members, and their families, including a grant-funded urban farm in Dunbar offering hydroponic and field-grown crop training and workforce development. Its own site lists free workshops in urban agriculture, food production, value-added processing, and small business development.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family", "Guard/Reserve"],
    cost: "Free — \"Free workshops in urban agriculture, food production, value-added processing, and small business development\" (own site)",
    geographicScope: "Charleston & Dunbar, West Virginia (Kanawha Valley)",
    state: "West Virginia",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Wisconsin Regional
  // ---------------------------------------------------------------------
  {
    name: "Wisconsin Hero Outdoors",
    url: "https://wiherooutdoors.org/",
    description:
      "All-volunteer Wisconsin nonprofit connecting veterans, first responders, and their families to hunting, fishing, golf, scuba, and equestrian activities, coordinating with VA medical facilities to support recreational therapy and suicide-prevention goals.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Family"],
    cost: "Free — all activities are free to participants",
    geographicScope: "Statewide",
    state: "Wisconsin",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Wounded Warriors United of Wisconsin",
    url: "https://woundedwarriorsunitedwi.org/",
    description:
      "Wisconsin nonprofit providing no-cost, cross-country hunting and fishing trips plus free stays for veterans and their families at Country Haven Farm, a retreat in Gleason, WI.",
    needCategoryIds: ["outdoor-programs", "family-support"],
    audienceTags: ["Veteran"],
    cost: "Free — trips and farm stays are at no charge to the veteran",
    geographicScope: "Statewide",
    state: "Wisconsin",
    verifiedDate: "2026-08-27",
    eligibility: "Wisconsin veterans; farm retreat open to any Wisconsin veteran with family or another veteran.",
  },
  {
    // TODO(verify): a separate, similarly named org ("Valor & Honor Outdoors") also exists — confirmed via EIN 85-4206365 that honorandvaloroutdoors.com (Green Bay / NE Wisconsin) is the correct match for this entry; don't conflate the two.
    name: "Honor and Valor Outdoors",
    url: "https://honorandvaloroutdoors.com/",
    description:
      "Green Bay-based nonprofit offering free guided walleye, ice, and waterfowl/upland hunting and fishing trips to veterans and current service members, ranging from one-on-one outings to larger camaraderie events.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — free guided hunting and fishing trips",
    geographicScope: "Northeast Wisconsin",
    state: "Wisconsin",
    verifiedDate: "2026-08-27",
    eligibility: "Honorably discharged or currently serving; may bring one family member or friend.",
  },
  {
    name: "Wisconsin Department of Veterans Affairs — Benefits",
    url: "https://dva.wi.gov/benefits/",
    description:
      "State benefits portal covering education (WI GI Bill, retraining grants), employment, financial and subsistence grants, recreation (hunting/fishing licenses, park passes), licensing, and veteran-owned business support.",
    needCategoryIds: ["legal-benefits", "career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free resource — the portal is free to use; specific benefits vary by program",
    geographicScope: "Statewide",
    state: "Wisconsin",
    verifiedDate: "2026-08-27",
    eligibility:
      "Example: the one-time free hunting/fishing license requires honorable discharge within the past 365 days and service during a qualifying war period.",
  },
  {
    // TODO(verify): the organization formed May 15, 2026 and was recognized as 501(c)(3) effective May 15, 2026; the own site says the platform is still onboarding test agencies.
    name: "Peer Response Inc.",
    url: "https://www.peerresponse.org/",
    description:
      "Wisconsin 501(c)(3) based in Fitchburg that funds initial peer-support training and continuing education for fire, EMS, law enforcement, 911 dispatch and healthcare personnel, helps departments build and sustain their own peer support teams, and connects responders across the region to confidential peer support resources through its Peer Responder platform.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Healthcare"],
    cost: "Free — \"The platform and the network are free to the departments and responders who use them\" (own site)",
    geographicScope: "Statewide (Wisconsin; connects responders \"across the region\")",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Professional Fire Fighters of Wisconsin Charitable Foundation",
    url: "https://pffwcf.org/fire-fighter-support",
    description:
      "Wisconsin fire fighters' charitable foundation whose Fire Fighter Support program provides mental health peer support, individual disaster assistance for line-of-duty death, severe illness or traumatic injury, and state honor guard tributes for fire and EMS personnel and their families. It also delivers peer support and group crisis intervention training to first responders around the state.",
    needCategoryIds: ["mental-health", "financial-assistance", "family-support"],
    audienceTags: ["Fire", "EMS", "First Responder", "Family", "Coworker"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide",
    eligibility: "\"Fire and EMS providers - whether paid or volunteer\" and their families in Wisconsin (own site)",
    phone: "(608) 630-8440",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Center for Veterans Issues",
    url: "https://www.cvivet.org/",
    description:
      "Milwaukee-based nonprofit that describes itself as the largest private nonprofit serving U.S. military veterans and their families in Wisconsin, offering Supportive Services for Veteran Families (homelessness prevention, rental/utility assistance, case management), transitional and permanent supportive housing including Vets Place Central and Boudicca House, employment reintegration services, and an SSG Fox suicide-prevention program.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (own site: programs available in 55 counties; offices in Milwaukee, Green Bay, Beloit, Eau Claire, Fond du Lac, Janesville, La Crosse, Racine and Waukesha)",
    eligibility: "SSVF: a \"Veteran family\", under 80% of Area Median Income, and homeless or at risk of becoming homeless (own site)",
    phone: "414-345-3917",
    hours: "Monday - Friday 8 AM - 4:30 PM (own site; hours vary by location)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Veterans Outreach of Wisconsin",
    url: "https://vowvillages.com/",
    description:
      "Racine-based nonprofit assisting homeless and at-risk veteran households across Wisconsin with a Veterans Marketplace stocked with food and personal care products, a village of 15 tiny homes with a community center, and trauma-informed programming.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — \"Services are free to veteran households\" (own site)",
    geographicScope: "Statewide (headquartered in Racine, WI; own site serves veteran households \"in every community across Wisconsin\")",
    eligibility: "Homeless and at-risk veteran households; the Marketplace is open to veterans and surviving spouses of veterans (own site)",
    phone: "262-221-8350",
    availability: "Marketplace: Tue 10 AM - 4 PM, Wed 12 PM - 5 PM, Thu 12 PM - 4 PM; office Mon - Thu 8 AM - 4 PM, Fri 8 AM - 12 PM (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the site footer carries a 2019 copyright; confirm the program is still actively admitting veterans before publishing.
    name: "Housing 4 Our Vets",
    url: "https://www.housing4ourvets.org/veteran-housing",
    description:
      "Rock Valley Community Programs' veterans transitional housing program in Janesville, Wisconsin, opened in April 2011, providing up to 48 single-occupancy suites for homeless veterans for up to 24 months with three meals a day, laundry, transportation, computer labs, substance-use recovery support and individualized case management.",
    needCategoryIds: ["housing-transportation", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free — \"available at no cost to the veteran\" (own site)",
    geographicScope: "Rock County, Wisconsin (single-city program based in Janesville, WI)",
    eligibility: "Homeless veterans; sober living environment is maintained; stays up to 24 months before transition to permanent housing (own site)",
    phone: "608-741-4500",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the physical location (Pewaukee, WI) is confirmed only by the Wisconsin DHS peer-run respite listing, not on the org's own page; the warmline is explicitly non-crisis, so callers in crisis are directed to the Veterans Crisis Line.
    name: "Mental Health America of Wisconsin — R&R House",
    url: "https://www.mhawisconsin.org/veterans-services",
    description:
      "Operates the R&R House, described as the nation's first peer-run respite exclusively for former members of the U.S. Armed Forces, offering stays of up to seven days in an ADA-accessible residential setting staffed by veteran Certified Peer Specialists, plus a 24/7 non-crisis warmline for veterans and military families.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (own site: \"Any Wisconsin Veteran\" is eligible)",
    eligibility: "\"All Wisconsin veterans who have spent at least one day in uniform are eligible. Discharge status is irrelevant.\" (own site)",
    phone: "262-336-9540",
    availability: "Warmline operates 24/7; stays are scheduled by calling the warmline (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the Warrior Wellness page notes referral therapy has \"session limits and insurance requirements\"; whether retreats and Project Nights carry a cost is not stated.
    name: "H.O.O.A.H. WI",
    url: "https://hooahwi.org/warrior-wellness",
    description:
      "Green Bay-based nonprofit whose mission is to eliminate suicide through a proactive approach to the overall wellness of service members, veterans and their support systems. Its Warrior Wellness program offers referral therapy with certified professionals, two- or three-day wellness retreats, and weekly Project Night peer-support gatherings, in partnership with The Wellness Command Post.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Northeast Wisconsin (Green Bay-based; retreats \"hosted throughout the year\")",
    phone: "920-227-4077",
    availability: "Project Nights on the second and fourth Wednesday of every month, 5-8pm, at the Green Bay location (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Dryhootch of America",
    url: "https://www.dryhootch.org/",
    description:
      "Combat-veteran-founded nonprofit running drug- and alcohol-free coffee houses in Milwaukee and Madison where veterans and their families can gather informally and access peer support, readjustment guidance, resource navigation, employment and legal-help referrals, and family peer support. It also runs the QRF certified veteran peer mentor training program.",
    needCategoryIds: ["mental-health", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Milwaukee and Madison, Wisconsin",
    phone: "(414) 763-5473 (Milwaukee)",
    hours: "Mon - Fri 9am - 5pm (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "MKE Urban Stables",
    url: "https://mkeurbanstables.org/equine-assisted-services",
    description:
      "Milwaukee facility that combines equine-assisted services, community engagement programs and the Milwaukee Police Department Mounted Patrol. Its veteran therapy program provides equine-assisted psychotherapy in partnership with the Zablocki VA Medical Center, with participants working with certified instructors, equine specialists and mental health professionals.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Milwaukee, Wisconsin (veteran program serves Milwaukee's veterans)",
    phone: "(414) 744-2844",
    availability: "By appointment only (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): national scope is claimed on the org's own site, but the distinct Wisconsin identity is strong (Talent Recruitment Grant, Brown County relocation pathway, Wisconsin hospital and education partners); confirm current grant-funded relocation terms before publishing.
    name: "Heroes for Healthcare",
    url: "https://www.heroesforhealthcare.org/",
    description:
      "Milwaukee-based nonprofit that helps medically trained veterans, military personnel and their medically trained spouses find healthcare careers after service, partnering with Wisconsin hospitals and schools and supporting the Wisconsin Military Medics and Corpsmen pathway. It was awarded $200,000 through Wisconsin's Talent Recruitment Grant to recruit and relocate veteran households to Brown County, with relocation support up to $7,500.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Wisconsin-focused (Milwaukee HQ; own site also states it helps military personnel \"across the country\")",
    eligibility: "Medically trained veterans (and medically trained spouses) transitioning to civilian healthcare careers; specific eligibility is determined through the organization's application (own site)",
    phone: "866-456-3864",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Wisconsin Legal Assistance for Military Personnel (State Bar of Wisconsin)",
    url: "https://www.wisbar.org/lamp",
    description:
      "State Bar of Wisconsin program offering a limited number of referrals to volunteer attorneys plus access to other legal resources for eligible veterans, active duty military personnel and National Guard/Reserve members on civilian civil-law issues such as tenant-landlord, debts and bankruptcy, guardianship, employment, simple wills and powers of attorney. The page also points to Wisconsin Free Legal Answers, a free online legal clinic for civil questions under Wisconsin law.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve"],
    cost: "Free for eligible low-income households — \"Generally, free legal assistance is only available to households that qualify as low income. If your income is too high to qualify for free legal help, reduced cost assistance may be available\" (own site)",
    geographicScope: "Statewide (Wisconsin)",
    eligibility: "Legal issues that can be resolved by a Wisconsin lawyer and applicable income requirements met; volunteers handle civilian legal issues only (own site)",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the own site states \"Pathfinder Membership is required\" with a required deposit for reservations and mentions coalition reservation rates, but publishes no fee amounts; \"free of charge\" language appears only in an org press release hosted on a third-party site, so it is not used as the cost.
    name: "Access Ability Wisconsin",
    url: "https://www.accessabilitywi.org/",
    description:
      "Statewide nonprofit lending adaptive outdoor equipment such as all-terrain wheelchairs and adaptive kayaks through partner host locations so people with mobility challenges - including veterans - can hunt, fish, hike and access parks, trails and public lands. Its site highlights veteran-focused programming and events such as Veterans @ Wehr.",
    needCategoryIds: ["equipment-grants", "outdoor-programs"],
    audienceTags: ["Disabled", "Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Wisconsin), with check-out hosts across multiple counties",
    phone: "608-886-9388",
    state: "Wisconsin",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Minnesota Regional
  // ---------------------------------------------------------------------
  {
    name: "Minnesota Veterans Outdoors",
    url: "https://www.mnvetsoutdoors.org/",
    description:
      "Minnesota nonprofit offering disabled veterans a turkey hunt, a \"Trolling 4 Troops\" fishing event, and a deer hunt at Camp Ripley, built around outdoor recreational therapy, camaraderie, and connection with fellow veterans.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — meals and lodging are provided at no cost to hunt participants",
    geographicScope: "Statewide",
    state: "Minnesota",
    verifiedDate: "2026-08-27",
    eligibility: "Minnesota-resident disabled veterans; hunt slots awarded by lottery application.",
  },
  {
    // TODO(verify): davmn.org doesn't state cost explicitly for this program; no "free" language found on the org's own program page.
    name: "DAV of Minnesota Outdoors Program",
    url: "https://davmn.org/our-programs/veterans-outdoors/",
    description:
      "DAV of Minnesota's veteran recreational-therapy program offers fishing, hunting, hiking, and other outdoor events statewide, run through local American Legion, DAV, MOPH, and VFW chapters, aimed at building strength, endurance, confidence, and camaraderie.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Free / sponsored",
    geographicScope: "Statewide",
    state: "Minnesota",
    verifiedDate: "2026-08-27",
    eligibility: "Open to veterans of all backgrounds, ages, and genders.",
  },
  {
    name: "Hometown Hero Outdoors",
    url: "https://hometownherooutdoors.org/",
    description:
      "National nonprofit headquartered in Stillwater, MN, offering peer-led hunting, fishing, and outdoor trips for veterans, active-duty military, law enforcement, firefighters, and EMS professionals to build community and support mental wellness.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "First Responder"],
    cost: "Free / sponsored — offered without cost to participants",
    geographicScope: "National (headquartered in Stillwater, MN)",
    state: "Minnesota",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Minnesota Department of Veterans Affairs / LinkVet",
    url: "https://mn.gov/mdva/contacts/linkvet.jsp",
    description:
      "State agency and one-stop veteran service line (LinkVet) providing free accredited benefits counseling, claims assistance, emergency financial aid, homelessness prevention, education, and family services through MDVA and County/Tribal Veteran Service Officers.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — all services are provided free of charge",
    geographicScope: "Statewide",
    state: "Minnesota",
    verifiedDate: "2026-08-27",
    phone: "888-546-5838",
  },
  {
    // TODO(verify): the site does not state an overall cost for services; subsidized housing tenants pay a portion of income toward rent, and the site mentions a free representative payee service.
    name: "Minnesota Assistance Council for Veterans (MACV)",
    url: "https://www.mac-v.org/",
    description:
      "Minnesota's largest nonprofit focused on ending Veteran homelessness, providing statewide outreach, case management, housing/deposit/rental assistance and housing subsidies, plus employment/training services and the Vetlaw pro-bono legal program for Veterans who are homeless or at risk of becoming homeless.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "career-education", "legal-benefits", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide Minnesota (offices in the Twin Cities, Duluth, and Mankato, with staff in Bemidji, Moorhead, Rochester, and St. Cloud)",
    eligibility: "Any Veteran living in Minnesota (broad definition: anyone who served or is serving in a U.S. military branch, regardless of discharge status, including MN National Guard pre-basic-training members) and their immediate family/household members; fewer-than-honorable discharges reviewed case-by-case.",
    phone: "(833) 222-6228",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Every Third Saturday (ETS)",
    url: "https://www.everythirdsaturday.org/",
    description:
      "Minneapolis nonprofit fostering purpose and post-traumatic growth for Veterans through ETS Fire Team small-group peer connection, a free fitness center, a monthly supply store, career-building paid internships, classes/groups, and post-traumatic-growth courses at its Veterans Resource & Empowerment Center.",
    needCategoryIds: ["mental-health", "purpose-community", "career-education", "sports-fitness", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — \"Free to Veterans\" (own site, fitness center)",
    geographicScope: "Twin Cities metro (Minneapolis, MN)",
    eligibility: "Veterans and their immediate family members (proof of veteran status required).",
    availability: "Center and fitness center open Monday-Friday, 9AM-4PM (fitness center 10AM-3PM); supply store visits once per month.",
    phone: "(952) 356-5116",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Lutheran Social Service of Minnesota — Military & Veteran Services",
    url: "https://www.lssmn.org/services/military-and-veterans",
    description:
      "Lutheran Social Service of Minnesota supports Veterans, service members, and their families statewide through the Minnesota Service CORE program (casework, outreach, referral and education) plus caregiver support and respite, financial counseling, housing assistance, meals, and behavioral health therapy, partnering with MDVA, MACV, and County Veterans Service Officers.",
    needCategoryIds: ["family-support", "mental-health", "housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family", "Caregiver"],
    cost: "Free — \"CORE services are free to eligible veterans\" (own site)",
    geographicScope: "Statewide Minnesota (LSS presence in all 87 counties)",
    eligibility: "Veterans (meeting the MN Statute definition), military members, and their families; CORE free to eligible veterans per their own site.",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
    // Own About page mission: "Lutheran Social Service of Minnesota expresses the love of Christ for all people..." — work "grounded in two principles - God loves all people without condition and God yearns for us to love the neighbor."
    faithBased: true,
    faithAffiliationSource: "https://www.lssmn.org/about",
  },
  {
    name: "Honor Flight Twin Cities",
    url: "https://www.honorflighttwincities.org/",
    description:
      "Independent hub of the Honor Flight Network based in Lindstrom, MN, flying America's World War II, Korean War, and Vietnam War Veterans from the Minneapolis/St. Paul airport to Washington, D.C. for a one-day tour of their memorials, always at no cost to the Veteran.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Free — \"Honored Veterans always travel free of charge\" (own site)",
    geographicScope: "70-mile radius of the Minneapolis/St. Paul airport, including western Wisconsin",
    eligibility: "World War II, Korean War, and Vietnam War Veterans living within a 70-mile radius of MSP, including western Wisconsin; top priority to veterans who have never seen their memorials.",
    phone: "320-445-9541",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Sanctuary For Veterans",
    url: "https://sanctuaryforveterans.org/",
    description:
      "Minnesota nonprofit (Maple Grove, serving since 2017) helping Veterans and their families who are homeless or at risk of homelessness through housing support, case management, employment services, transportation assistance, mental health and psychological support, and 24/7 assistance.",
    needCategoryIds: ["housing-transportation", "career-education", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Minnesota (headquartered in Maple Grove; partners include Hennepin County Veterans Services, Minneapolis VA Medical Center, and MACV)",
    phone: "612-807-9725",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Eagle Group of Minnesota Veterans",
    url: "https://www.eaglegroupmn.org/",
    description:
      "Minneapolis-based, veteran-led 501(c)(3) (established 2010) helping Veterans, active military personnel, and their families transition to civilian life via a trusting community, camaraderie-focused meetings, career-transition coaching and plans, networking events, and mentorship referrals.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse", "Family", "Civilian Supporter"],
    cost: "Not stated on the org's own site",
    geographicScope: "Minnesota (Twin Cities metro-focused; monthly and weekly meetings)",
    eligibility: "Veterans, active military personnel, military spouses, and their families.",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the site also says free programs serve veterans \"from across the Nation\" while featuring a Minnesota retreat schedule and Minnesota address; confirm the distinct-Minnesota identity is strong enough for this directory.
    name: "Project New Hope",
    url: "https://projectnewhope.net/",
    description:
      "Underwood, MN-based volunteer nonprofit offering free weekend retreats that give Veterans and their families education, training, and skills to manage life after wartime service; its featured 2026-27 schedule lists retreats at Good Earth Village, Faith Haven Camp, Camp Shetek, and Osprey Wilds in Minnesota.",
    needCategoryIds: ["mental-health", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Family", "Military Spouse", "Survivor"],
    cost: "Free — \"There is no cost to the families on the retreat\" (own site)",
    geographicScope: "Minnesota (retreat sites across the state; HQ in Underwood, MN)",
    phone: "218-770-6834",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Minnesota Firefighter Initiative (MnFIRE)",
    url: "https://mnfireinitiative.com/",
    description:
      "Statewide Minnesota nonprofit founded in 2016 that advocates for and delivers firefighter wellbeing — the Hometown Heroes Assistance Program provides a MnFIRE Assistance Program (24/7 confidential mental-health hotline, peer support), an up-to-$20,000 critical illness policy, and health/wellness training to all Minnesota firefighters.",
    needCategoryIds: ["mental-health", "financial-assistance", "family-support"],
    audienceTags: ["Fire", "First Responder", "Family", "Caregiver"],
    cost: "Free — \"all provided to Minnesota firefighters for free\" (own site, Hometown Heroes Assistance Program)",
    geographicScope: "Statewide Minnesota",
    crisisResource: true,
    crisisAudience: "first-responders",
    eligibility: "All active volunteer, paid-on-call, part-time, and full-time Minnesota firefighters (and their families).",
    availability: "24-hour confidential hotline, 7 days a week",
    phone: "888-784-6634",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the immediate-help line coverage/hours are not confirmed on the org's own site.
    name: "Metro CISM Team",
    url: "https://www.metrocism.org/",
    description:
      "Bloomington, MN-based 501(c)(3) (established 1987) providing free, trained peer support to emergency responders in the ten-county Twin Cities region — pre-incident training, on-site support, psychological first aid, critical incident stress debriefings, peer-to-peer support, and continuing-care referrals, staffed by volunteer peers from law enforcement, fire, dispatch, EMS, and medical professions plus chaplains and mental-health professionals.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Healthcare"],
    cost: "Free — \"free, trained peer support to emergency responders\" (own site)",
    geographicScope: "Ten-county Twin Cities region (Anoka, Carver, Chisago, Dakota, Hennepin, Isanti, Ramsey, Scott, Sherburne, Washington counties)",
    crisisResource: true,
    crisisAudience: "first-responders",
    availability: "24/7 immediate-help line (own site); general office line 612-207-1130",
    phone: "612-347-5710",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Heroes Helping Heroes (H3)",
    url: "https://www.h3mn.org/",
    description:
      "Minnesota-founded peer-support group for active and retired First Responders serving the entire Upper Midwest, connecting law enforcement, fire, EMS, dispatch, and corrections personnel through peer support groups, outdoor and recreational activities, retreats, wellness workshops, mentorship, and mental-health resources — all at no cost.",
    needCategoryIds: ["mental-health", "purpose-community", "sports-fitness", "outdoor-programs"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family"],
    cost: "Free — \"all at no cost\" (own site)",
    geographicScope: "Minnesota and the Upper Midwest (founded by a retired Minneapolis Police Department sergeant)",
    eligibility: "All active and retired first responders (law enforcement, fire, EMS, dispatch, corrections) and their families.",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Minnesotans' Military Appreciation Fund (MMAF)",
    url: "http://thankmntroops.org/",
    description:
      "Statewide Minnesota 501(c)(3) that shows thanks with cash grants to Minnesota service members who served in a combat zone since September 11, 2001 — $500 for combat-zone service, $2,000-$10,000 for Purple Heart recipients based on injury severity, and $5,000 to the families of Minnesota service members killed in combat.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Gold Star", "Survivor"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide Minnesota",
    eligibility: "Minnesota resident prior to deployment, or non-resident drilling member of a MN Guard/Reserve unit prior to deployment (must have deployed with the MN unit); served in a designated combat zone and received Hostile Fire Pay after 9/11/2001; all branches, active or honorably discharged.",
    phone: "1-877-MN-THANX (877-668-4269)",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "LELS Benevolent Fund (Law Enforcement Labor Services)",
    url: "https://www.lels.org/benevolentfund",
    description:
      "Minnesota 501(c)(3) fund providing support and financial aid — over $1.5 million since 2018 — to families of LELS members and families of other Minnesota public safety professionals who are seriously injured or killed in the line of duty, regardless of union membership, plus annual scholarships and first-responder fundraising support.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family", "Survivor"],
    cost: "Not stated on the org's own site",
    geographicScope: "Minnesota",
    eligibility: "Families of LELS members and of other Minnesota Public Safety Professionals seriously injured or killed in the line of duty, regardless of union membership.",
    phone: "651-793-2323",
    state: "Minnesota",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // North Dakota Regional
  // ---------------------------------------------------------------------
  {
    name: "On the Water, Inc.",
    url: "https://www.otwnd.org/",
    description:
      "Minot, ND-based nonprofit serving 100+ veterans annually through free summer fishing events at Lake Sakakawea plus seasonal Veterans Cabin access, with boats, equipment, and meals provided.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — all programs, including use of the Veterans Cabin, are provided at zero cost",
    geographicScope: "Lake Sakakawea / North Dakota",
    state: "North Dakota",
    verifiedDate: "2026-08-27",
    eligibility: "Combat veterans (served in overseas conflicts) or veterans with a service-connected disability.",
  },
  {
    name: "North Dakota County & Tribal Veteran Service Officers",
    url: "https://www.veterans.nd.gov/about/find-a-service-officer",
    description:
      "Accredited County (all 53 ND counties) and Tribal (Fort Berthold, Lake Traverse, Spirit Lake, Standing Rock, Turtle Mountain) Veteran Service Officers provide free local assistance with health care, disability compensation, pension, long-term care, and burial benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — all services are provided free of charge to veterans and their dependents",
    geographicScope: "Statewide",
    state: "North Dakota",
    verifiedDate: "2026-08-27",
  },
  {
    name: "North Dakota Department of Veterans Affairs",
    url: "https://www.veterans.nd.gov/",
    description:
      "State veterans agency provides free claims assistance and benefit navigation alongside the Veterans Aid Loan, the Hardship Assistance Grant, transportation to VA medical facilities, and education/employment resources.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "housing-transportation", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost:
      "Claims assistance, VSO help, and the Hardship Assistance Grant are free; the Veterans Aid Loan (up to $8,000) carries 8% interest and is not a free program",
    geographicScope: "Statewide",
    state: "North Dakota",
    verifiedDate: "2026-08-27",
    eligibility:
      "Veterans Aid Loan: ND veterans, current/former Guard/Reserve members, and unmarried surviving spouses. Hardship Grant: ND residency, veteran status, documented financial need, income/asset limits.",
  },
  {
    name: "North Dakota Veterans Benefits Eligibility Portal",
    url: "https://www.veterans.nd.gov/benefits-and-services/what-am-i-eligible",
    description:
      "State resource explaining VA disability compensation eligibility criteria and connecting veterans with free accredited state, county, tribal, and national representatives for claims help.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — a Veteran Service Officer can assist at no cost",
    geographicScope: "Statewide",
    state: "North Dakota",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // South Dakota Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): hero-haven.org doesn't explicitly state cost; press coverage describes trips as free but this isn't confirmed on the org's own site.
    name: "Hero Haven",
    url: "https://www.hero-haven.org/",
    description:
      "South Dakota-based nonprofit organizing outdoor adventures — hunting, fly fishing, ATV rides, and custom trips — for veterans, active-duty military, law enforcement, firefighters, EMS, and other first responders.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "First Responder"],
    cost: "Free / sponsored",
    geographicScope: "South Dakota / regional (multi-state trips)",
    state: "South Dakota",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): warriorsnevergiveup.org doesn't explicitly state cost or what expenses are covered; a local news article described one specific event as free.
    name: "Warriors Never Give Up",
    url: "https://www.warriorsnevergiveup.org/",
    description:
      "Sioux Falls-based nonprofit offering hunting and fishing trips — pheasant, goose, and coyote hunts, plus fishing tournaments — for previously deployed or service-connected disabled veterans.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Eastern South Dakota / regional",
    state: "South Dakota",
    verifiedDate: "2026-08-27",
    eligibility: "Previously deployed or service-connected disabled veterans.",
    // Own site: self-describes as a "God-inspired volunteer non-profit organization offering... faith-based outdoor experiences."
    faithBased: true,
    faithAffiliationSource: "https://www.warriorsnevergiveup.org/",
  },
  {
    name: "Wings of Valor Lodge",
    url: "https://www.wingsofvalorlodge.org/",
    description:
      "Fully wheelchair-accessible hunting lodge near Parker, SD, offering pheasant and deer hunts at no cost, with a historical focus on wounded and disabled veterans; has hosted 500+ veterans from across the country since 2006.",
    needCategoryIds: ["outdoor-programs", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — veterans can visit, hunt, and experience the lodge at no cost to themselves",
    geographicScope: "Parker, SD / national reach",
    state: "South Dakota",
    verifiedDate: "2026-08-27",
    eligibility: "Open to all veterans; facility is fully wheelchair-accessible with a historical focus on wounded/disabled veterans.",
  },
  {
    name: "South Dakota Department of Veterans Affairs — County & Tribal VSOs",
    url: "https://vetaffairs.sd.gov/veteransserviceofficers/what%20is%20a%20vso.aspx",
    description:
      "State-mandated network of County and Tribal Veteran Service Officers, present in every South Dakota county and on some reservations, helping veterans and dependents apply for federal and state veterans benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "South Dakota",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans, and dependents including widows, dependent children, and dependent parents of veterans who died in military service.",
  },

  // ---------------------------------------------------------------------
  // Colorado Regional
  // ---------------------------------------------------------------------
  {
    name: "Challenge Aspen Military Opportunities (CAMO)",
    url: "https://challengeaspen.org/programs/veteran-programs/",
    description:
      "Adaptive recreation program in Aspen/Snowmass for veterans and active-duty members with service-connected disabilities, offering cost-free application-based Rocky Mountain Retreats and low-cost drop-in Western Slope Socials with adaptive winter and summer sports instruction.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Free (application-based Rocky Mountain Retreats) or low-cost (drop-in Western Slope Socials)",
    geographicScope: "Aspen/Snowmass, extending to Colorado's Western Slope",
    state: "Colorado",
    verifiedDate: "2026-08-27",
    eligibility:
      "Veterans with a VA disability rating (low-cost drop-in programs); veterans and active-duty members with service-connected disabilities (multi-day retreats).",
  },
  {
    name: "Colorado Discover Ability",
    url: "https://cdagj.org/",
    description:
      "Grand Junction-based adaptive recreation nonprofit offering year-round skiing, snowboarding, cycling, kayaking, paddleboarding, hiking, and horseback riding for people with disabilities, including veteran programming and custom group opportunities for veteran organizations.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Program fees apply; financial assistance and state disability waivers (CES/SLS) may be available",
    geographicScope: "Western Colorado",
    state: "Colorado",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Bodhi Battalion",
    url: "https://bodhibattalion.org/",
    description:
      "Broomfield, Colorado nonprofit pairing veterans and first responders facing PTSD, isolation, or suicide risk with mental-health services and trained service dogs, combining therapeutic practice with hands-on service-dog training.",
    needCategoryIds: ["mental-health", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "$50 one-time application fee for the service-dog program; Bodhi Battalion covers the dog's first year of food and veterinary care",
    geographicScope: "Statewide",
    state: "Colorado",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): vets.colorado.gov blocks automated verification requests; cost/scope corroborated via secondary county-government sources — reconfirm directly before publishing.
    name: "Colorado County Veterans Service Offices",
    url: "https://vets.colorado.gov/county-veterans-service-offices",
    description:
      "Statewide network of 64 County Veterans Service Offices providing free, accredited assistance to Colorado veterans and their family members with VA claims, benefit applications, and appeals.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Colorado",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Mt. Carmel Veterans Service Center",
    url: "https://www.veteranscenter.org/",
    description:
      "Colorado Springs veterans services center offering transition and employment help (quarterly job fairs, workshops), behavioral health counseling, financial coaching, housing and food assistance, family services, and military-spouse career support; also home to the Colorado Veterans Business Outreach Center, with additional offices in Pueblo, Trinidad, Alamosa, and Westcliffe.",
    needCategoryIds: ["career-education", "mental-health", "financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Free — own site states transition and employment services are 'provided at no cost to our clients'; behavioral health counseling accepts insurance with sliding-scale options and a no-cost screening appointment",
    geographicScope: "Colorado Springs / southern Colorado (offices in Colorado Springs, Pueblo, Trinidad, Alamosa, and Westcliffe)",
    eligibility: "Active duty, Guard and Reserve members, and veterans of any era regardless of discharge status, plus their family members (own site)",
    availability: "Year-round services; quarterly job fairs and regular LINK workshops",
    phone: "719-772-7000",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm on the org's own site whether services are free — the site describes 'emergency financial assistance' but never states a cost.
    name: "Home Front Military Network",
    url: "https://homefrontmilitarynetwork.org/",
    description:
      "Colorado Springs-based network connecting Colorado military service members, veterans, and their families with community resources and one-time emergency financial bridge support for costs like rent, utilities, and transportation, awarded case by case.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide — Colorado (financial assistance limited to 'Colorado residents only' per the org's own site)",
    eligibility: "Colorado residents in the military community (service members, veterans, and their families) facing a one-time financial emergency; assistance determined case by case",
    availability: "Resource navigation via the site's 'Find Help' tool; case managers by phone",
    phone: "719-577-7417",
    hours: "Case manager: Monday–Friday 8am–5pm (own site)",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm whether clinics are walk-in or by appointment and whether any income or discharge-status limits apply.
    name: "Colorado Lawyers for Colorado Veterans",
    url: "https://www.cobar.org/CLCV",
    description:
      "Colorado Bar Association program delivering free and low-cost legal services to veterans at monthly clinics held inside VA facilities, covering VA benefits, taxes, housing, family, criminal, and administrative legal issues.",
    needCategoryIds: ["legal-benefits", "housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Free and low-cost (own site: 'free and low-cost legal services to military veterans')",
    geographicScope: "Denver and Colorado Springs (VA clinic locations)",
    eligibility: "Military veterans (per the program's own site)",
    availability: "Monthly clinics — Denver VA Medical Center (3836 York St) second Tuesday 12:30–2:30pm; Colorado Springs Lindstrom VA clinic (3141 Centennial Blvd) fourth Tuesday 12:30–3pm",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm whether participation carries any cost and how many judicial districts currently run a veterans treatment court specifically.
    name: "Colorado Veterans Treatment Courts",
    url: "https://cjpu.colorado.gov/veterans-court",
    description:
      "State judicial-branch program whose veterans treatment courts 'serve justice-involved military and former-military members with substance use and mental health needs through intensive supervision and treatment'; part of a statewide problem-solving court network of 61 courts across 20 judicial districts.",
    needCategoryIds: ["legal-benefits", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve"],
    cost: "Not stated on the program's own site",
    geographicScope: "Statewide — Colorado (court-based; availability varies by judicial district)",
    eligibility: "Justice-involved military and former-military members with substance-use or mental-health needs (own site)",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm on the program's own site whether services are free.
    name: "Homes for All Veterans (Rocky Mountain Human Services)",
    url: "https://www.rmhumanservices.org/departments/homes-for-all-veterans/",
    description:
      "Rocky Mountain Human Services housing program 'operates statewide in all counties in Colorado, with staff members located across the state,' helping veterans who are homeless or at imminent risk of homelessness secure housing and connect to benefits and support services.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the program's own site",
    geographicScope: "Statewide — Colorado (all counties; staff located across the state per own site)",
    eligibility: "Veterans who are homeless or at imminent risk of homelessness, not dishonorably discharged, and who meet county-specific income requirements (own site)",
    phone: "855-838-7428",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Rocky Mountain Regional VA Fisher House",
    url: "https://www.fisherhouse.org/programs/houses/current-houses/colorado-va-eastern-colorado-health-care-system/",
    description:
      "16-suite comfort home at 1700 N. Wheeling St., Aurora, CO 80045, where families of veterans receiving care at the VA Eastern Colorado Health Care System can stay at no cost while their loved one is in treatment.",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Family", "Caregiver", "Disabled"],
    cost: "Free — Fisher House Foundation states 'Fisher Houses at VA medical centers do not charge a room fee'",
    geographicScope: "Aurora / Denver metro (serving families of veterans treated at the VA Eastern Colorado Health Care System)",
    eligibility: "Families of veterans receiving care at the VA Eastern Colorado Health Care System; own site says veterans of all eras — contact the house for requirements",
    phone: "720-723-7683",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): add a central or per-facility admissions phone number from the individual cdhs.colorado.gov center pages.
    name: "Colorado Veterans Community Living Centers",
    url: "https://cdhs.colorado.gov/VCLCs",
    description:
      "Five state-run long-term care homes for veterans — Fitzsimons (Aurora), Bruce McCandless (Florence), Homelake (Monte Vista), Rifle, and Spanish Peaks (Walsenburg) — offering skilled nursing, memory care, and short-term rehabilitation under one comprehensive daily rate covering medications, therapies, oxygen, and medical transport; veteran rates are lower because part of the cost is covered by the VA.",
    needCategoryIds: ["housing-transportation", "family-support", "financial-assistance"],
    audienceTags: ["Veteran", "Family", "Caregiver", "Gold Star", "Disabled"],
    cost: "Paid — published daily rates vary by center (own site: veteran semi-private $144.28/day at Homelake, $183.23/day at Rifle, $254.62/day at Fitzsimons); Medicaid, Medicare, and VA benefits may offset the cost",
    geographicScope: "Statewide — Colorado (five centers: Aurora, Florence, Monte Vista, Rifle, Walsenburg)",
    eligibility: "Honorably discharged veterans, their spouses or widows, and Gold Star parents, plus medical-criteria requirements; Medicaid-eligible and private-pay residents accepted (own site)",
    availability: "Admissions ongoing — own site says applications and medical records are reviewed within a week",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Colorado National Guard Tuition Waiver",
    url: "https://dmva.colorado.gov/tuition-waiver",
    description:
      "State education benefit covering up to 100% of in-state tuition for Colorado National Guard members at Colorado's approved institutions of higher education, with term limits of four terms for an associate degree, eight for a bachelor's, and six for a master's.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Guard/Reserve"],
    cost: "Tuition covered up to 100% of in-state tuition; members pay their own fees, textbooks, and equipment (own site)",
    geographicScope: "Statewide — Colorado (approved Colorado institutions of higher education)",
    eligibility: "Colorado National Guard members (own site)",
    availability: "Fall, Spring, and Summer terms",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): add a statewide Veterans Employment Specialist contact number from cdle.colorado.gov if one is published.
    name: "Colorado Department of Labor & Employment — Veterans Employment Services",
    url: "https://cdle.colorado.gov/jobs-training/veterans",
    description:
      "State workforce agency services giving Colorado veterans priority of service at Colorado Workforce Centers: dedicated Veteran Employment Specialists, résumé and interview help, career counseling, training and apprenticeship referrals, and connections to education benefits — 'All of this at no cost to you!' per the agency's own site.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Free (own site: 'All of this at no cost to you!')",
    geographicScope: "Statewide — Colorado (Colorado Workforce Centers)",
    eligibility: "Veterans who have served at least one day of active duty, and eligible military spouses (own site)",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): recheck the Badge2Badge page for a resumed meeting schedule before publishing.
    name: "Badge2Badge (The Badge Group)",
    url: "https://www.thebadgegroup.com/badge-to-badge/",
    description:
      "Colorado peer-to-peer support groups for current and former police, fire, EMS, corrections, and dispatch personnel — free, stigma-free meetings led by responders, approved by organizations including the Fraternal Order of Police, South Metro Fire Rescue, and Path for EMS. Note: the org's site currently shows no scheduled meetings while the groups undergo restructuring.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Coworker"],
    cost: "Free (own site: 'We bring you free support')",
    geographicScope: "Colorado (support groups limited to Colorado residents per own site)",
    eligibility: "Current and former police, fire, EMS, corrections, and dispatch personnel who are Colorado residents",
    availability: "No scheduled meetings at present — groups restructuring, updates expected in 2026; pre-registration by email (own site)",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm 2026 conference dates and location on the org's site.
    name: "Gold Star Project of Colorado",
    url: "http://www.coloradogoldstarparentsweekend.com/",
    description:
      "Colorado nonprofit formed in December 2017 out of the Blue Star Mothers of Colorado, running an annual fall healing conference for Colorado Gold Star parents with peer mentoring and workshops — 'We do not ask our parents to pay for the conference' (own site); the 2024 conference was held at the Hotel Colorado in Glenwood Springs.",
    needCategoryIds: ["family-support", "purpose-community", "mental-health"],
    audienceTags: ["Gold Star", "Survivor", "Family"],
    cost: "Free — own site: 'We do not ask our parents to pay for the conference'",
    geographicScope: "Statewide — Colorado (annual conference rotates locations; 2024 in Glenwood Springs)",
    eligibility: "Colorado Gold Star parents (families who lost a service member in the line of duty)",
    availability: "Annual fall healing conference plus peer mentoring",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm costs for device loans and clinical assessments — not stated on the program page.
    name: "Colorado Assistive Technology Act Program (CIDE / Assistive Technology Partners)",
    url: "https://www.ucdenver.edu/center-for-innovative-design-and-engineering/community-engagement/colorado-assistive-technology-act-program",
    description:
      "CU Denver program (formerly Assistive Technology Partners) providing statewide assistive-technology help to Coloradans with disabilities: device demonstrations, an AT Network lending library of device kits 'across the state of Colorado,' the AT Exchange marketplace for used devices at 'little or no cost,' and the AT Funding $ources directory helping individuals and caregivers find money to pay for equipment.",
    needCategoryIds: ["equipment-grants"],
    audienceTags: ["Disabled", "Family", "Caregiver"],
    cost: "Device demonstrations free of charge; used devices via AT Exchange at 'little or no cost' (own site)",
    geographicScope: "Statewide — Colorado (AT Network 'across the state of Colorado' per own site)",
    eligibility: "Coloradans with disabilities and their caregivers (own site)",
    phone: "303-315-1280",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Comeback Yoga",
    url: "https://comebackyoga.org/",
    description:
      "Denver-based nonprofit providing free, trauma-informed yoga to the military community, with in-person classes across Colorado through VA healthcare systems, VFW posts, and military installations, plus free online classes.",
    needCategoryIds: ["sports-fitness", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free (own site: 'Comeback Yoga provides FREE yoga classes to the military, veterans, and their families')",
    geographicScope: "Statewide — Colorado (in-person classes across Colorado plus free online classes)",
    eligibility: "Military community — active duty, veterans, and their families (own site)",
    availability: "Year-round in-person classes and free online classes",
    phone: "303-416-4961",
    state: "Colorado",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // New Mexico Regional
  // ---------------------------------------------------------------------
  {
    name: "Adaptive Sports Program New Mexico",
    url: "https://www.adaptivesportsprogram.org/",
    description:
      "Statewide adaptive recreation nonprofit offering skiing, snowboarding, paddling, rafting, climbing, archery and other activities for people with disabilities; veteran-specific programs run periodically, including a Disabled Veterans' Winter Sports Camp offered free to participating veterans.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free for veterans at designated veteran events (e.g. the Winter Sports Camp); other general programs may carry fees or scholarships depending on the session",
    geographicScope: "Statewide",
    state: "New Mexico",
    verifiedDate: "2026-08-27",
    eligibility: "Veteran-specific events open to veterans with disabilities; some sessions reserved for disabled veterans only.",
  },
  {
    name: "Strongpoint Theinert Ranch",
    url: "https://www.strongpointtheinert.org/",
    description:
      "350+ acre veterans retreat adjoining the Cibola National Forest near Magdalena, NM, offering weeklong therapeutic retreats — hiking, team-building, licensed clinical social work support — for veterans, service members, and Gold Star families.",
    needCategoryIds: ["mental-health", "outdoor-programs", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Gold Star", "Family"],
    cost: "Free — retreat costs, including round-trip travel, meals, and equipment, are covered by the organization",
    geographicScope: "Magdalena, NM / national reach",
    state: "New Mexico",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans (separate cohorts for male/female veterans and unit groups) and Gold Star families; some programs are unit-specific.",
  },
  {
    name: "New Mexico Department of Veterans Services — Field Services",
    url: "https://www.nmdvs.org/field-services/",
    description:
      "Accredited Veteran Service Officers at 16 field offices statewide help veterans and eligible dependents file VA claims, obtain federal and state benefits, and connect with housing, medical, and behavioral-health referrals.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "New Mexico",
    verifiedDate: "2026-08-27",
  },
  {
    name: "New Mexico State Veterans Benefits",
    url: "https://www.dvs.nm.gov/benefits/",
    description:
      "State benefit program covering veteran property-tax exemptions, Vietnam/Wartime educational scholarships, free or reduced-fee hunting and fishing licenses, specialty license plates, and free state-park and museum access.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "career-education", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost:
      "Free/no-cost benefits; specifics vary — e.g. a $10 reduced-fee hunting/fishing license for disabled veterans, a free lifetime license and full property-tax exemption for 100% disabled veterans, and a $10,000 standard exemption for others",
    geographicScope: "Statewide",
    state: "New Mexico",
    verifiedDate: "2026-08-27",
    eligibility:
      "Varies by benefit — property-tax exemption requires 90+ days consecutive active duty and honorable discharge; full exemption and free hunting/fishing license require a 100% VA service-connected disability rating; Wartime Scholarship requires service after August 1990; New Mexico residency required for most benefits.",
  },

  // ---------------------------------------------------------------------
  // Arizona Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): source notes described a broader active-military/first-responder/family reach, but the org's VORTEX program page names only veterans as eligible — this entry is scoped to VORTEX specifically.
    name: "EmpoweRanch — VORTEX",
    url: "https://empoweranch.org/vortex",
    description:
      "Phoenix ranch-based nonprofit whose VORTEX program uses horsemanship, outdoor recreation, and peer connection in an 8-week group therapeutic model for veterans experiencing depression, anxiety, PTSD, or TBI.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free for qualifying veterans, sponsored through the Arizona Elk Society's Heroes Rising Outdoors program",
    geographicScope: "Phoenix",
    state: "Arizona",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans; participants become AES HRO members upon qualifying for VORTEX sponsorship; full 8-session attendance commitment expected.",
  },
  {
    // TODO(verify): grant coverage amount (full vs. partial equipment cost) not confirmed on the org's own site.
    name: "Hoppers for Heroes",
    url: "https://hoppersforheroes.org/",
    description:
      "Nonprofit providing grants and community partnerships to place TerrainHopper all-terrain mobility vehicles with veterans, first responders, and people with disabilities, plus placements at Arizona state parks for public adaptive-recreation access.",
    needCategoryIds: ["equipment-grants", "outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Grant-supported",
    geographicScope: "Arizona",
    state: "Arizona",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans, first responders, and individuals with mobility challenges; apply via email describing mobility needs.",
  },
  {
    // TODO(verify): the Arizona chapter page doesn't state cost explicitly, though a sponsored/no-cost-to-participant model is consistent with the org's broader materials.
    name: "Homeward for Heroes — Arizona",
    url: "https://homewardforheroes.org/arizona-chapter-1649",
    description:
      "Arizona chapter of a national nonprofit taking veterans, first responders, and their loved ones on 3-7 night off-road and overlanding treks through remote Arizona backcountry, designed to reduce isolation and support post-traumatic growth.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Family"],
    cost: "Free / sponsored",
    geographicScope: "Arizona",
    state: "Arizona",
    verifiedDate: "2026-08-27",
    eligibility: "Must qualify as a veteran or first responder; for the Couples Trek, only one member of a couple needs to qualify.",
  },
  {
    name: "Arizona Department of Veterans' Services",
    url: "https://dvs.az.gov/",
    description:
      "State veterans agency operating 19 Veterans Benefits Offices statewide, connecting Arizona veterans and military families with federal and state benefits claims assistance, four State Veteran Homes, a state veterans' cemetery, and the Military Family Relief Fund for unforeseen financial hardship.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — Veteran Benefits Counselor services are free; the Military Family Relief Fund is a grant/assistance fund, not a fee-for-service program",
    geographicScope: "Statewide",
    state: "Arizona",
    verifiedDate: "2026-08-27",
    eligibility:
      "Veterans, service members, and their families; Military Family Relief Fund open to pre- and post-9/11 veterans facing hardship caused by military service; State Veteran Homes require honorable discharge (or veteran's spouse) and documented need for skilled nursing care.",
  },
  {
    // Distinct from the already-listed "The 100 Club — Houston" (the100club.org) — separate organizations.
    // TODO(verify): confirm recipient cost for family financial assistance; only Peer 100 trainings are stated as no cost.
    name: "The 100 Club of Arizona",
    url: "https://100club.org/",
    description:
      "Arizona public-safety charity (since 1968) providing immediate financial assistance to the families of officers and firefighters killed or seriously injured, scholarships for their family members' college costs, Safety Enhancement Stipend equipment grants to agencies, and the Peer 100 mental-health wellness and training programs for Arizona's public safety personnel.",
    needCategoryIds: ["financial-assistance", "family-support", "equipment-grants", "mental-health"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "Corrections", "Family", "Survivor"],
    cost: "Peer 100 wellness trainings are 'NO COST to Arizona Public Safety Personnel' (own site); cost of family financial assistance and scholarships is not stated on the org's own site",
    geographicScope: "Arizona statewide (city, county, tribal, state, federal agencies)",
    eligibility: "Arizona police, corrections, probation/parole officers, firefighters and federal agents and their immediate families; assistance requests must be submitted by a supervisor or agency HR — potential beneficiaries are not authorized to submit requests (own site); scholarships require the applicant be the child, spouse or stepchild of an active, retired or deceased sworn officer or firefighter",
    phone: "602-485-0100",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Be Connected — Arizona Coalition for Military Families",
    url: "https://connectveterans.org/",
    description:
      "Core program of the Arizona Coalition for Military Families: a statewide support line (866-4AZ-VETS) and team of community navigators who listen, provide information and connect Arizona's service members, veterans, families, caregivers and helpers to resources, plus no-cost coaching and career-navigation services.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free — 'Support and connection to resources are provided by the Be Connected team at no cost to everyone in the community' (own site)",
    geographicScope: "Statewide Arizona",
    eligibility: "Service members, veterans, family members, caregivers and helpers — 'no wrong door'; resources are offered 'regardless of status or eligibility' (own site guidelines)",
    phone: "866-429-8387",
    hours: "Monday–Friday, 8 a.m.–5 p.m. Arizona time (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site never uses the word 'free' — assistance is described only as one-time grants paid directly to payees; confirm no-cost framing before strengthening cost wording.
    name: "Military Assistance Mission (MAM)",
    url: "https://azmam.org/",
    description:
      "Arizona nonprofit providing one-time emergency financial assistance for rent, mortgage, utilities, car payments, car insurance and food, plus education-assistance scholarships, baby showers and holiday programs, to Arizona active-duty, National Guard and Reserve members ranked E-5 or below and separated post-9/11 veterans with a Purple Heart or Combat Action Badge or equivalent.",
    needCategoryIds: ["financial-assistance", "family-support", "career-education"],
    audienceTags: ["Active Military", "Guard/Reserve", "Veteran", "Family", "Military Spouse"],
    cost: "Not stated on the org's own site — financial assistance is a one-time grant with bills paid directly to the payee (own site)",
    geographicScope: "Arizona (applicant must be stationed in and reside in Arizona)",
    eligibility: "Arizona active-duty, Guard and Reserve E-5 and below (eligibility also dependent on income), plus separated post-9/11 veterans who received a Purple Heart or Combat Action Badge or equivalent and reside in Arizona; assistance is one-time only (own site)",
    phone: "602-246-6429",
    hours: "Applications reviewed during business hours, Monday–Friday 8 a.m.–3 p.m. (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): also runs the VORTEX equine program jointly with EmpoweRanch — VORTEX (listed separately); confirm whether non-hunt programs carry the same disability eligibility requirement.
    name: "Arizona Elk Society — Heroes Rising Outdoors",
    url: "https://www.arizonaelksociety.org/heroes-rising-outdoors",
    description:
      "Arizona Elk Society program (since 2015) providing free, all-inclusive guided big-game hunts through the Arizona Game & Fish tag-transfer program, fly-fishing classes, equine therapy, kayaking, fishing and camping experiences for Arizona veterans with service-connected disabilities — 125+ outdoor experiences yearly.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — the program 'delivers comfortable, all-inclusive guided hunts and fishing trips free of charge' (own site brochure)",
    geographicScope: "Arizona statewide (program office in Peoria, AZ)",
    eligibility: "Arizona veterans with a service-connected disability (A.R.S. 17-332 definition, confirmed by physician form); tag-transfer hunts require a valid Arizona hunting license at time of transfer (own site)",
    phone: "623-444-4147",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): participation cost not stated on the courts page; availability varies by county — page is a directory with individual court coordinators/contacts.
    name: "Arizona Veterans Treatment Courts",
    url: "https://www.azcourts.gov/selfservicecenter/Arizona-Specialty-Courts",
    description:
      "Arizona Judicial Branch specialty (problem-solving) courts whose stated goal is 'to rehabilitate and restore veterans as active, contributing members of their community,' creating and supervising treatment plans that address the underlying causes of a veteran's behavior and substance-abuse issues; operated as Veterans Treatment Courts in courts across the state.",
    needCategoryIds: ["legal-benefits", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide Arizona (directory lists Veterans Treatment Courts in Apache, Coconino, Gila, Maricopa, Mohave, Pima, Pinal and Yuma counties)",
    eligibility: "Veterans in or entering the criminal justice system; each county's presiding judge sets referral eligibility criteria under A.R.S. 22-601; programs typically handle misdemeanors and require VA confirmation of military service (own site/state statute)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the veterans page does not publish specific repair fees or sweat-equity terms — recheck with Family Services details before treating repair cost as fully verified.
    name: "Habitat for Humanity Central Arizona — Veterans Program",
    url: "https://habitatcaz.org/veterans/",
    description:
      "Local Habitat affiliate partnering with U.S. military veterans and families in Maricopa and portions of Pinal County on a pathway to home ownership, affordable home repairs and modifications (roofs, AC, windows, ramps, grab bars), plus a pre-apprenticeship Construction Training Program specifically for veterans entering the trades or construction field.",
    needCategoryIds: ["housing-transportation", "career-education", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Home repairs are described as 'affordable' (not stated as free); home ownership requires meeting all Habitat qualifications including income guidelines (own site)",
    geographicScope: "Maricopa County and portions of Pinal County (Phoenix metro)",
    eligibility: "Veterans must meet all Habitat for Humanity qualifications including income guidelines and demonstrate veteran status from the United States Military (own site)",
    phone: "602-268-9022",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): des.az.gov returned HTTP 403 to a direct fetch — page content verified via the indexed copy of the same URL; recommend a manual check.
    name: "Arizona Department of Economic Security — Veterans Program (ARIZONA@WORK)",
    url: "https://des.az.gov/services/employment/veterans",
    description:
      "State workforce program under the Wagner-Peyser Act and Title 38 giving veterans and eligible spouses priority services in job referrals, training and other employment services through ARIZONA@WORK, with Disabled Veterans Outreach Program specialists providing intensive career services and Local Veteran Employment Representatives engaging employers, plus Jobs for Veterans State Grants for veterans with significant barriers to employment.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide Arizona (ARIZONA@WORK Employment Service Offices)",
    eligibility: "Veterans and eligible spouses are entitled to priority services; JVSG-funded intensive services target veterans and eligible persons with significant barriers to employment (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): program page lists only an email contact (no public phone) — confirm a phone number if one is later published.
    name: "Arizona Veterans StandDown Alliance",
    url: "https://azhousingcoalition.org/avsa/",
    description:
      "Program of the Arizona Housing Coalition holding annual StandDown resource events across the state (18 events in 2025, 2026 schedule posted) where veterans and families experiencing housing instability and homelessness receive housing assistance, veterans' benefits support, employment opportunities, medical/vision and mental-health help, hot meals, clothing and move-in kits in one place — the Maricopa County StandDown is billed as the nation's largest of its kind.",
    needCategoryIds: ["housing-transportation", "career-education", "legal-benefits", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — 'This FREE event allows veterans and their families ... to receive and stay connected to complimentary support services' (own site)",
    geographicScope: "Statewide Arizona (18 StandDown events in 2025 from Parker, Bullhead City and Tucson to Page, Kingman, Show Low and tribal communities)",
    eligibility: "Veterans and their families experiencing housing instability and homelessness (own site)",
    availability: "Annual StandDown series — 18 events in 2025; 2026 dates and venues posted on the program page",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the 'Get Assistance' pathway's eligibility criteria, processing time and any recipient cost are not detailed on the public pages reviewed.
    name: "Honor The Fallen",
    url: "https://honorthefallen.org/",
    description:
      "Tempe, Arizona 501(c)(3) (established 2015) supporting children and families of fallen military, police, fire, EMS and first responder heroes through community events (its flagship 5K For Heroes has raised over $130,000), financial assistance and connections to therapeutic support and resources through vetted partner organizations.",
    needCategoryIds: ["family-support", "financial-assistance", "purpose-community"],
    audienceTags: ["Family", "Survivor", "First Responder", "Law Enforcement", "Fire", "EMS"],
    cost: "Not stated on the org's own site — assistance is described as funded by donations and delivered through the org's own funds and vetted partners",
    geographicScope: "Phoenix metro, Arizona (Tempe-based; events in Tempe/Scottsdale)",
    eligibility: "Children and families of fallen military, police, fire, EMS and first responder heroes (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): About page does not list a phone number or a formal application process — contact runs through the site's Get Involved/Calendar pages.
    name: "Arizona Veterans Fly Fishing",
    url: "https://www.azveteransff.org/about",
    description:
      "Arizona nonprofit (since 2013) dedicated to supporting the physical and emotional well-being of disabled veterans through peer-led fly fishing — shared outings, fly-tying classes, rod building and fishing education guided largely by volunteers who have served: 'we are not therapists; we are your peers.'",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — experiences are 'All without charge to the disabled veteran' (own site)",
    geographicScope: "Phoenix metro and central Arizona (own events calendar: Phoenix, Mesa/Gilbert, Payson and Show Low outings)",
    eligibility: "Disabled veterans (own site mission statement)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): Financial Assistance Program eligibility and any recipient cost are not stated on the public pages reviewed; About/Values pages were not fully reviewed, so no faithBased flag is set even though the org runs a chaplain program.
    name: "Arizona Fallen Hero Memorial Riders",
    url: "https://azfhmr.org/",
    description:
      "Arizona nonprofit honoring the state's fallen first responders and military heroes while supporting the families, coworkers and communities they leave behind — through memorial and wellness rides, its Financial Assistance Program, the United Together Family Support Program, First Responder and Veteran Initiatives, a chaplain program and the Arizona Legacy Scholarship Program.",
    needCategoryIds: ["family-support", "financial-assistance", "purpose-community", "career-education"],
    audienceTags: ["Survivor", "Family", "First Responder", "Law Enforcement", "Fire", "Veteran", "Coworker"],
    cost: "Not stated on the org's own site — operates a Financial Assistance Program and Hero Family Assistance Fund for those it serves (own site)",
    geographicScope: "Arizona statewide (memorial rides and events across the state)",
    eligibility: "Families of fallen Arizona first responders and military heroes, plus serving first responders and veterans (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): paper license is issued free with an optional $4 plastic card; active-duty members stationed in Arizona and their spouses have separate resident-license rules under A.R.S. 17-337 on other pages.
    name: "Arizona Game & Fish Department — Disabled Veteran License",
    url: "https://www.azgfd.com/hunting/hunt-draw-and-licenses/special-licenses-2/disabled-veteran-license/",
    description:
      "State wildlife benefit issuing a complimentary combination hunting and fishing license (lifetime when the VA rating is permanent) to Arizona residents with a permanent service-connected disability rated at 100% disabling, plus reduced-fee licenses for veterans with a service-connected disability and for Purple Heart recipients, all granting the privileges of a full hunt/fish combination license.",
    needCategoryIds: ["legal-benefits", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for 100% disabled — 'Fee: None for 100% service connected disability' (complimentary license); reduced-fee tiers are $42 for a service-connected disability under 100% and $28 for Purple Heart recipients (own site)",
    geographicScope: "Arizona (licenses issued at Arizona Game and Fish Department offices)",
    eligibility: "At least one year of Arizona residency immediately preceding application; 100% complimentary license requires VA certification of a permanent service-connected disability rated as 100% disabling (100% IU does not qualify); reduced-fee license requires any service-connected disability; Purple Heart license requires bona fide Purple Heart proof (own site)",
    state: "Arizona",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Utah Regional
  // ---------------------------------------------------------------------
  {
    name: "Continue Mission",
    url: "https://www.continuemission.org/",
    description:
      "Utah nonprofit offering veterans, service members, and their family/support members year-round recreation — skiing, snowshoeing, cycling, mountain biking, paddleboarding, hiking, pickleball, and multi-day adventures — combined with mental-health and suicide-prevention programming.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — events are held at no cost to registered veterans or their family/support members",
    geographicScope: "Statewide",
    state: "Utah",
    verifiedDate: "2026-08-27",
    eligibility: "Participants must be registered veterans/service members or their invited family/support members.",
  },
  {
    name: "American Heroes Project",
    url: "https://americanheroesproject.org/",
    description:
      "Utah nonprofit using boating and outdoor recreational therapy — fishing, boating, camping — to reduce the effects of PTSD, TBI, and veteran suicide among disabled combat veterans and their families, including a Gold Star family program.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — no individual who boards the organization's boats or uses its facilities is ever charged",
    geographicScope: "Utah",
    state: "Utah",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled combat veterans.",
  },
  {
    // TODO(verify): cost is not stated anywhere on the org's own site; likely donor/sponsor-funded given 501(c)(3) status with no paid staff, but not confirmed in writing.
    name: "Operation Pay It Forward",
    url: "https://opif4ourvets.org/",
    description:
      "Utah nonprofit that reintroduces veterans dealing with combat-related injuries and mental-health challenges to outdoor recreation and camaraderie, then encourages participants to become \"Ambassadors\" who bring other veterans into the mission.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free / sponsored",
    geographicScope: "Utah",
    state: "Utah",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Utah Department of Veterans & Military Affairs",
    url: "https://veterans.utah.gov/",
    description:
      "Utah state agency providing free accredited VA claims and appeals assistance, connecting veterans with health care, education, employment, legal assistance, housing, recreation, and state benefits, including the Utah Veteran First-Time Homebuyer Grant.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free for claims, applications, and appeals assistance",
    geographicScope: "Statewide",
    state: "Utah",
    verifiedDate: "2026-08-27",
    eligibility:
      "First-Time Homebuyer Grant: $2,500 for eligible first-time homebuyers who are recently separated veterans (within the last 5 years) or currently serving Active Duty/Reserve/Guard members living in Utah.",
  },
  {
    name: "Mountain Veteran Program",
    url: "https://www.mountainveteranprogram.org/",
    description:
      "Utah-based 501(c)(3) providing year-round, multi-day mountain experiences at Sundance Mountain Resort for veterans living with the lasting impacts of their service and their families.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — \"provided at no cost to participants\" and \"includes programming, lodging, meals, and full mountain access\" (own site)",
    geographicScope: "Sundance, Utah",
    eligibility: "U.S. military veterans living with a service-connected injury, illness, or disability; applicants must be able to participate in a multi-day group program and provide documentation of service and disability.",
    availability: "Multi-day immersive programs throughout the year",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Wasatch Adaptive Sports — Veterans Program",
    url: "https://wasatchadaptivesports.org/participate",
    description:
      "Utah nonprofit offering adaptive year-round outdoor recreation for veterans coping with military-related physical, cognitive, and emotional difficulties.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Free — \"all WAS Veterans Program [experiences] are offered 100% on scholarship\" (own site)",
    geographicScope: "Utah",
    eligibility: "Veterans coping with military-related physical, cognitive, or emotional difficulties.",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): participation cost/scholarship availability is not stated on the org's own site; only descriptive program information is provided.
    name: "Dive Into Healing",
    url: "https://diveintohealing.org/about/",
    description:
      "Veteran-run Utah nonprofit using structured scuba training in a supportive environment led by veterans to support healing, connection, and confidence for veterans.",
    needCategoryIds: ["sports-fitness", "purpose-community", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Utah",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Hope on the Hill",
    url: "https://www.hopeonthehillut.org/",
    description:
      "Utah-based nonprofit providing mental health services, suicide prevention resources, and emotional support to veterans and active military members.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Not stated on the org's own site",
    geographicScope: "Utah",
    phone: "916-798-6464",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Behind the Lavalava Foundation",
    url: "https://www.behindthelavalavafoundation.org/",
    description:
      "Utah community-driven nonprofit creating opportunities for veterans, their families, and youth through scholarships, monthly meetups, annual community events, and a veterans business market.",
    needCategoryIds: ["purpose-community", "family-support"],
    audienceTags: ["Veteran", "Family", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Utah",
    eligibility: "Veterans, their families, and youth in Utah.",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Bowden's Brigade",
    url: "https://bowdensbrigade.org/",
    description:
      "Utah nonprofit connecting veterans and their families with mental health resources and community support in Saratoga Springs, Provo, and Utah County.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Saratoga Springs, Provo, and Utah County, Utah",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },
  {
    name: "4 Paws 4 Patriots — Utah",
    url: "https://www.4pawsutah.org/",
    description:
      "Ogden, Utah-based 501(c)(3) providing psychiatric service animal training with veterans and first responders actively training their dogs as a team.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free — \"free of charge\" (own site)",
    geographicScope: "Ogden, Utah",
    eligibility: "Veterans, First Responders, and their legal spouses with a medical need for a psychiatric service animal verified by a medical provider.",
    state: "Utah",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Wyoming Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): cost is not stated explicitly on the org's own site; a Sponsors page implies sponsor funding but doesn't confirm cost to participants.
    name: "Operation Veterans First",
    url: "https://operationveteransfirst.com/",
    description:
      "Wyoming nonprofit based in Gillette specializing in outdoor excursions for disabled veterans of any era, including hunting, fishing, shooting sports, and camping.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "Gillette, WY / regional",
    state: "Wyoming",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veterans, any era or campaign.",
  },
  {
    // NOTE: the state's "Benefits Guide" and "Outreach" program are the same office described two other ways, not distinct services — consolidated into one entry rather than publishing near-duplicates.
    name: "Wyoming Veterans Commission",
    url: "https://www.wyomilitary.wyo.gov/resources/veteran/veterans-commission/",
    description:
      "Wyoming state commission, under the Wyoming Military Department, providing free VA claims filing and disability-rating-review assistance through Veteran Service Officers statewide, plus a benefits guide and outreach focused on improving access to services for veterans, families, survivors, and caregivers.",
    needCategoryIds: ["legal-benefits", "purpose-community"],
    audienceTags: ["Veteran", "Family", "Survivor", "Caregiver"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Wyoming",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Veterans Talking to Veterans (VTTV)",
    url: "https://www.mentoragility.com/find-a-vttv-meeting",
    description:
      "Wyoming peer-led, trauma-informed coaching program that trains veterans and veteran spouses to lead free weekly coaching groups for fellow veterans and families around the state; won the VA/NASDVA 2024 award for Most Innovative State Program in Suicide Prevention.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Family", "Military Spouse"],
    cost: "Free",
    geographicScope: "Wyoming (statewide)",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Volunteers of America Northern Rockies — Supportive Services for Veteran Families",
    url: "https://www.voanr.org/services/supportive-services-for-veteran-families/",
    description:
      "VA-funded program providing outreach, case management, help obtaining VA benefits, and short-term financial assistance (rent, deposits, car repair) to veteran families experiencing a housing crisis, from offices across Wyoming.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Wyoming (statewide; also serves Montana)",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
    phone: "1-844-486-2838",
    // Own "Our Ministry" page: "Volunteers of America is a spiritual-based ministry of service," founded as a church; offers Bible studies and chapel services.
    faithBased: true,
    faithAffiliationSource: "https://www.voanr.org/ministry/",
  },
  {
    name: "Wyoming Department of Workforce Services — Veteran Employment Services",
    url: "https://dws.wyo.gov/dws-division/workforce-centers-and-program-operations/job-seekers/veteran-employment-services/",
    description:
      "State-run Workforce Centers across Wyoming offer veterans free job search/placement help, resume support, career counseling, skills assessments, and training referrals, with Priority of Service ahead of non-veterans.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Caregiver"],
    cost: "Free",
    geographicScope: "Wyoming (statewide, 20 Workforce Centers)",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
  },
  {
    name: "Wyo W.E.S.T. Warrior Foundation",
    url: "https://www.wyowestwarriorfoundation.org/",
    description:
      "Sheridan-based nonprofit hosting an annual free retreat (shooting sports, rappelling, horseback riding, guided fly fishing, rodeo) for veterans, first responders, law enforcement officers, and Gold Star families to build camaraderie and support healing.",
    needCategoryIds: ["outdoor-programs", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Law Enforcement", "First Responder", "Gold Star", "Family"],
    cost: "Free to attendees — fully funded by fundraising",
    geographicScope: "Sheridan, Wyoming",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans, first responders, law enforcement, and Gold Star families; org vets applicants and prioritizes greatest need",
  },
  {
    name: "Wyoming Military Assistance Trust Fund — Dependent Care Assistance",
    url: "https://www.wyomilitary.wyo.gov/military-assistance-trust-fund/",
    description:
      "Wyoming Military Department grant fund reimbursing Wyoming National Guard members for dependent/child care costs incurred during drill duty, capped at state Dept. of Family Services market rates.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free — grant/reimbursement, not a loan",
    geographicScope: "Wyoming (statewide)",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
    eligibility: "Wyoming National Guard members called to drill duty with dependents needing care; dependents 12+ require documented medical need",
  },
  {
    name: "Wyoming Military Department — Soldier & Family Readiness Specialists",
    url: "https://www.wyomilitary.wyo.gov/resources/soldier-and-family-readiness-specialists/",
    description:
      "Formerly \"Family Assistance Centers\" — offers support to service members, families, and veterans including crisis intervention, legal guidance, financial counseling, TRICARE help, employment support, and DEERS/Family Readiness Group assistance.",
    needCategoryIds: ["family-support", "legal-benefits"],
    audienceTags: ["Guard/Reserve", "Veteran", "Family", "Military Spouse"],
    cost: "Not stated — free state-run support service",
    geographicScope: "Wyoming (statewide)",
    state: "Wyoming",
    verifiedDate: "2026-09-29",
    phone: "307-292-5331",
  },

  // ---------------------------------------------------------------------
  // Montana Regional
  // ---------------------------------------------------------------------
  {
    name: "DREAM Adaptive Recreation",
    url: "https://www.dreamadaptive.org/",
    description:
      "Year-round adaptive recreation nonprofit based in Whitefish offering skiing, cycling, mountain biking, paddlesports, fishing, and water sports using adaptive equipment and trained volunteers, with dedicated military and veteran programming.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free for active-duty military and veterans with a disability via the DREAM Scholarship, which covers course and equipment costs for select sessions",
    geographicScope: "Northwest Montana (Whitefish / Flathead Valley)",
    state: "Montana",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans/active duty must have a qualifying disability for scholarship-covered slots.",
  },
  {
    name: "Evoke Changes Outdoors",
    url: "https://www.evokechangesoutdoors.org/",
    description:
      "Kalispell-based nonprofit pairing hunting/fishing trips with a 12-week program for veterans and first responders, aimed at building coping skills and improving daily functioning.",
    needCategoryIds: ["mental-health", "outdoor-programs"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Lodging and food are covered by the organization; participants are responsible for their own travel and hunting/fishing licenses",
    geographicScope: "Kalispell, MT / Northwest Montana",
    state: "Montana",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): eligibility corrected from source notes — the org's own site states it serves combat-wounded AND non-wounded veterans, not "combat-wounded only."
    name: "Big Hearts Under the Big Sky",
    url: "https://bigheartsmt.org/",
    description:
      "Montana Outfitters & Guides Education Institute program providing fully outfitted outdoor adventures, at no cost to the family, for active-duty and honorably discharged veterans, first responders, and children with life-threatening illnesses.",
    needCategoryIds: ["outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Gold Star", "Family", "First Responder"],
    cost: "Free — cost to the family is, and always has been, $0",
    geographicScope: "Montana",
    state: "Montana",
    verifiedDate: "2026-08-27",
    eligibility:
      "Active duty or honorably discharged veterans (combat-wounded and non-wounded), first responders, and children with a life-threatening illness; Gold Star families eligible through the nomination process.",
  },
  {
    // TODO(verify): cost to participants is not stated on the org's own site; secondary press suggests some workshops are free, but this is unconfirmed on the org's own pages.
    name: "Montana Grit Outdoors",
    url: "https://www.montanagritoutdoors.com/",
    description:
      "Philipsburg-based nonprofit created by and for women veterans and first responders, combining a six-month emotional-recovery coaching program with a culminating guided hunting trip; also serves Gold Star families and survivors of first responders.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Family"],
    cost: "Sponsored",
    geographicScope: "Philipsburg, MT / statewide",
    state: "Montana",
    verifiedDate: "2026-08-27",
    eligibility: "Serves female veterans and first responders specifically.",
  },
  {
    name: "Homeward for Heroes — Montana",
    url: "https://homewardforheroes.org/montana",
    description:
      "Bozeman-based chapter of the national Homeward for Heroes organization, providing peer-led off-road and camping treks through Montana's wilderness — ghost towns, hot springs, backroads — to build post-traumatic growth, community, and healing.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Military Spouse"],
    cost: "Free — explicitly \"No cost to veterans\"",
    geographicScope: "Bozeman, MT / statewide",
    state: "Montana",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Montana Veterans Affairs Division",
    url: "https://veterans.mt.gov",
    description:
      "Montana state agency, under the Department of Military Affairs, helping veterans and their families navigate federal and state benefits and employment resources through a statewide network of 9 veteran service offices.",
    needCategoryIds: ["legal-benefits", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Montana",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Idaho Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): a secondary directory (findhelp.org) confirms "free" and travel reimbursement, but this wasn't found explicitly stated on the org's own Programs/Veterans pages during verification.
    name: "Higher Ground",
    url: "https://highergroundusa.org/",
    description:
      "Ketchum-based adaptive-sports nonprofit with a dedicated Veteran Day Program and a 7-day Military Program addressing visible and invisible disabilities — PTSD, TBI, MST, polytrauma — through recreational therapy, fly fishing, skiing, climbing, and peer connection.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Free / subsidized",
    geographicScope: "Ketchum / Sun Valley, ID",
    state: "Idaho",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Team River Runner — Boise",
    url: "https://www.teamriverrunnerboise.org/",
    description:
      "Boise chapter of the national Team River Runner nonprofit, operated with Cascade Raft and Kayak, providing veterans, service members with disabilities, first responders, and families a progression from pool sessions to whitewater kayaking and rafting for health and healing.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Family", "Disabled"],
    cost: "Free — events are offered free of charge, with boats, safety gear, instruction, transportation, food, and lodging provided through donor support",
    geographicScope: "Boise, ID",
    state: "Idaho",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): Mission43's own programs (advising, education, engagement) are confirmed free; the Idaho Outdoor Fieldhouse facility's general day-use/membership pricing is not stated on its own site.
    name: "Idaho Outdoor Fieldhouse / Mission43",
    url: "https://mission43.org/",
    description:
      "Mission43, headquartered at the Idaho Outdoor Fieldhouse in Boise, is free to join and offers veterans and military spouses employment advising, education scholarships, and community engagement, alongside adaptive-athlete programming through Challenged Athletes Foundation-Idaho.",
    needCategoryIds: ["sports-fitness", "career-education", "purpose-community"],
    audienceTags: ["Veteran", "Military Spouse", "Disabled"],
    cost: "Free to join Mission43; advising, education, and engagement programs are provided at no cost",
    geographicScope: "Statewide (Mission43); facility in Boise",
    state: "Idaho",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Idaho Division of Veterans Services",
    url: "https://veterans.idaho.gov/",
    description:
      "Idaho state agency providing benefits advocacy, education support, employment services, homeless-veteran assistance, women-veteran programs, financial relief grants, veterans homes, and cemetery services statewide.",
    needCategoryIds: ["legal-benefits", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free for veteran-facing services",
    geographicScope: "Statewide",
    state: "Idaho",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Nevada Regional
  // ---------------------------------------------------------------------
  {
    name: "Nevada PVA (Paralyzed Veterans of America — Nevada Chapter)",
    url: "https://nevadapva.org/",
    description:
      "Nevada chapter of Paralyzed Veterans of America offering adaptive sports — wheelchair basketball, quad rugby, bowling, shooting sports — recreation therapy, and support attending the National Veterans Wheelchair Games.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — membership is free",
    geographicScope: "Statewide",
    state: "Nevada",
    verifiedDate: "2026-08-27",
    eligibility: "U.S. military veterans with a spinal cord injury, dysfunction, or disease (e.g. MS, ALS); caregivers and family also served.",
  },
  {
    // TODO(verify): org's site describes low overhead but doesn't explicitly state participation is free for recipients.
    name: "Buck Bedard Outdoor Foundation",
    url: "https://buckbedardoutdoorfoundation.org/",
    description:
      "Las Vegas-based nonprofit founded by Lt. Gen. E.R. \"Buck\" Bedard (USMC Ret.) introducing veterans, first responders, and Nevada youth to hunting, fishing, hiking, camping, and archery.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "First Responder"],
    cost: "Free / sponsored",
    geographicScope: "Nevada",
    state: "Nevada",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): org's site states programs are privately funded but doesn't explicitly confirm no cost to participants.
    name: "Brave Waters",
    url: "https://www.bravewaters.org/",
    description:
      "Northern Nevada nonprofit running outdoor retreats — historically at Hobart Reservoir in the Spooner Backcountry — for wounded veterans and their caregivers, in partnership with the Reno Vet Center and Nevada Department of Wildlife.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Caregiver"],
    cost: "Sponsored",
    geographicScope: "Northern Nevada",
    state: "Nevada",
    verifiedDate: "2026-08-27",
    eligibility: "Wounded veterans receiving care, plus their caregivers.",
  },
  {
    name: "Nevada Peer Support Network",
    url: "https://nvpsn.org/",
    description:
      "Reno-based network of trained peer supporters providing confidential 24/7 peer support and connections to vetted mental-health resources for veterans, first responders, military personnel, healthcare workers, and their families across Nevada.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family", "Healthcare"],
    cost: "Free — every service is delivered at no cost to the individuals and agencies served",
    geographicScope: "Statewide (17 Nevada counties)",
    state: "Nevada",
    verifiedDate: "2026-08-27",
    phone: "775-464-1797",
  },
  {
    name: "Nevada Veterans Fund",
    url: "https://www.nevadaveteransfund.org/",
    description:
      "Las Vegas-based nonprofit providing direct emergency assistance to Nevada veterans — food delivery, utility and appliance grants, homelessness outreach, and VA-claims support via accredited VSOs — through its Operation Direct Support initiative.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "legal-benefits"],
    audienceTags: ["Veteran"],
    cost: "Free — VSO claims assistance and direct aid are provided at no cost",
    geographicScope: "Nevada (primarily Southern Nevada / Las Vegas)",
    state: "Nevada",
    verifiedDate: "2026-08-27",
    eligibility: "Focus on homeless, low-income, and underserved veterans, including those with disabilities or transportation barriers.",
  },
  {
    name: "Nevada Department of Veterans Services",
    url: "https://veterans.nv.gov/",
    description:
      "Nevada's state veterans agency, providing accredited VA claims assistance plus employment, housing, financial, legal, transportation, education, and suicide-prevention services statewide through Veterans Service Officers.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "housing-transportation", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — VSO claims assistance is provided at no cost",
    geographicScope: "Statewide",
    state: "Nevada",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // California Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): third-party sources describe VSA programs as free, but the org's own site doesn't explicitly state cost.
    name: "Veterans Sportsman Alliance — California Chapter",
    url: "https://www.veteranssportsmanalliance.org/california-chapter",
    description:
      "California chapter of a multi-state nonprofit running hunting, fishing, kayaking, hiking, and golf outings for injured and disabled veterans, including amputees.",
    needCategoryIds: ["outdoor-programs", "sports-fitness"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / varies",
    geographicScope: "California",
    state: "California",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans with significant physical injuries or disabilities, including double/triple amputees.",
  },
  {
    name: "Our Heroes' Dreams",
    url: "https://www.ourheroesdreams.org/",
    description:
      "Hanford, CA-based nonprofit running a four-phase program — retreat, follow-up support, family retreat, and life-mission planning — with fishing, hunting, skiing, scuba, and adaptive sports for veterans, peace officers, first responders, and Gold Star families.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Law Enforcement", "First Responder", "Gold Star"],
    cost: "Free — no charge for any programs or services",
    geographicScope: "California (headquartered); retreats and partnerships operate nationwide",
    state: "California",
    verifiedDate: "2026-08-27",
    eligibility:
      "Open to all veterans regardless of discharge type, rank, or length of service; first responders, correctional officers, and contractors also qualify. Must be drug-free for 14 days prior to attendance.",
  },
  {
    name: "High Fives Foundation",
    url: "https://highfivesfoundation.org/",
    description:
      "Truckee, CA-based foundation providing Empowerment Fund grants — for adaptive sports equipment, rehab, and camps — to people with life-changing injuries, including a Military to the Mountains program that has supported 290+ veteran and first-responder experiences.",
    needCategoryIds: ["sports-fitness", "equipment-grants", "outdoor-programs"],
    audienceTags: ["Veteran", "First Responder", "Disabled"],
    cost: "Free to apply for and receive Empowerment Fund grants",
    geographicScope: "Truckee, CA / national (has funded athletes from 47 states/territories and Canada)",
    state: "California",
    verifiedDate: "2026-08-27",
    eligibility:
      "Must have a qualifying life-changing injury (spinal cord injury, TBI, amputation, or other mobility-limiting injury); service-connected veterans may apply for adaptive sports equipment funding within five designated pillar sports.",
  },
  {
    // TODO(verify): direct WebFetch of calvet.ca.gov failed repeatedly during verification; corroborated via search results referencing the org's own published pages — recommend a follow-up direct check.
    name: "CalVet",
    url: "https://www.calvet.ca.gov/",
    description:
      "California's state veterans agency, helping nearly 1.6 million veterans and families access state and federal benefits — VA claims assistance, education, employment, health care, and home loans — and operating the Veterans Homes of California.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost:
      "Free for core VA claims assistance and counseling through District Office Veteran Service Officers; other programs (e.g. the CalVet Home Loan, Veterans Homes long-term care) carry standard program-specific costs",
    geographicScope: "Statewide",
    state: "California",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): own site does not state a blanket "free" cost for its services — confirm cost wording before publishing a firmer claim.
    name: "Swords to Plowshares",
    url: "https://www.swords-to-plowshares.org/",
    description:
      "San Francisco-based nonprofit serving veterans since 1974 with a Veterans Resource Center, transitional and permanent housing, employment programs, legal assistance, and case management focused on veterans experiencing or at risk of homelessness.",
    needCategoryIds: ["housing-transportation", "career-education", "legal-benefits", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "San Francisco Bay Area with statewide reach for specific programs",
    eligibility: "Veterans experiencing or at risk of homelessness; program eligibility varies by service",
    availability: "Year-round, rolling admission for many services",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    name: "California Veterans Legal Task Force",
    url: "https://www.cvltf.org/",
    description:
      "Statewide coalition of legal-aid organizations providing pro bono civil legal assistance to California veterans on VA benefits, discharge upgrades, housing, and other civil legal matters.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran"],
    cost: "Free — pro bono",
    geographicScope: "Statewide (California)",
    eligibility: "Low-income veterans in California; case-by-case evaluation",
    availability: "Year-round; intake varies by clinic",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost and eligibility are not stated on habitatca.org/veterans — confirm before publishing.
    name: "Habitat for Humanity California - Veterans Build",
    url: "https://www.habitatca.org/veterans",
    description:
      "Statewide coalition supporting Habitat affiliates across California to build and repair homes for veterans and military families through Veterans Build initiatives.",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Military Spouse", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (California)",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not state whether services are free — confirm cost wording before publishing a firmer claim.
    name: "Veterans Village of San Diego (VVSD)",
    url: "https://vvsd.net/",
    description:
      "San Diego resource center providing veterans with housing, substance-use treatment, mental-health care, employment support, and family services.",
    needCategoryIds: ["housing-transportation", "mental-health", "career-education", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "San Diego County",
    eligibility: "Veterans; specific programs have additional criteria",
    availability: "Year-round",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not state a blanket "free" cost for its services — confirm cost wording before publishing a firmer claim.
    name: "Golden Gate Veterans Foundation",
    url: "https://ggvf.org/",
    description:
      "Northern California nonprofit offering veterans and their families mental-wellness programs, recreation including adaptive sports, employment assistance, and community support.",
    needCategoryIds: ["mental-health", "sports-fitness", "purpose-community", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Northern California (Bay Area focus)",
    eligibility: "Veterans and their families",
    availability: "Year-round",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): warriorfoundation.org returned HTTP 403 to automated fetch — reconfirm the free-cost claim and current programs directly in a browser.
    name: "Warrior Foundation Freedom Station",
    url: "https://warriorfoundation.org/",
    description:
      "San Diego nonprofit supporting injured, ill, and wounded veterans and their families with transitional housing, advocacy, career support, and recreational activities.",
    needCategoryIds: ["housing-transportation", "family-support", "career-education", "purpose-community"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free",
    geographicScope: "San Diego County (California)",
    eligibility: "Veterans who are injured, ill, or wounded; families included",
    availability: "Year-round",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Operation Mend",
    url: "https://www.uclahealth.org/operationmend",
    description:
      "UCLA Health and VA partnership providing advanced medical care, mental-health support, and intensive treatment for post-9/11 veterans and service members with TBI, PTSD, and other complex injuries, plus support for their caregivers.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — own site states care is provided 'at no cost'",
    geographicScope: "California (UCLA Health, Los Angeles)",
    eligibility: "Post-9/11 veterans and service members with qualifying injuries or conditions",
    availability: "By referral or application; intensive treatment cycles",
    state: "California",
    verifiedDate: "2026-10-08",
  },
  {
    name: "California Fire Foundation",
    url: "https://www.cafirefoundation.org/",
    description:
      "Statewide foundation supporting California firefighters and their families with immediate assistance after a line-of-duty death or serious injury (family resource guide and benevolent fund), the Daniel A. Terry Scholarship for firefighters' children, wildfire and disaster relief grants, and the annual California Firefighters Memorial ceremony in Sacramento.",
    needCategoryIds: ["family-support", "financial-assistance"],
    audienceTags: ["Fire", "First Responder", "Family"],
    cost: "Not stated on the org's own site (scholarships and assistance are awarded to recipients)",
    geographicScope: "Statewide (California)",
    state: "California",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Oregon Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): org-wide pricing is mixed (some single-day summer programs free, winter lessons $80-100 with scholarships available); the veteran-specific camp page itself doesn't state a price.
    name: "Oregon Adaptive Sports — Service to Summit",
    url: "https://oregonadaptivesports.org/sport/heroes/",
    description:
      "Bend, Oregon-based adaptive-sports nonprofit offering veterans with disabilities adaptive skiing, snowboarding, mountain biking, and gravel cycling camps, plus recurring instruction and community-building events.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Free / subsidized",
    geographicScope: "Central Oregon (statewide draw)",
    state: "Oregon",
    verifiedDate: "2026-08-27",
    eligibility:
      "Open to any veteran with a disability or diagnosis requiring adaptive sports equipment or specialized instruction; priority given to those facing the greatest access barriers and first-time participants.",
  },
  {
    // TODO(verify): cost not stated explicitly on the org's own site.
    name: "Forward Assist Oregon",
    url: "https://www.forwardassistnw.org/",
    description:
      "Wilsonville, Oregon nonprofit founded by combat-injured veterans, addressing individual needs one-on-one, coordinating outdoor and relationship-building events, and helping veterans and first responders navigate the VA and other agencies.",
    needCategoryIds: ["purpose-community", "outdoor-programs", "legal-benefits", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Family"],
    cost: "Free / sponsored",
    geographicScope: "Oregon",
    state: "Oregon",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Oregon Veteran Recreation Benefits",
    url: "https://www.oregon.gov/odva/benefits/pages/recreation.aspx",
    description:
      "Oregon provides service-connected disabled veterans (25%+ rating) a free combined hunting, fishing, and shellfish license, plus a Special Access Pass for free year-round camping and day-use at 26 Oregon State Parks.",
    needCategoryIds: ["outdoor-programs", "financial-assistance"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Oregon",
    verifiedDate: "2026-08-27",
    eligibility:
      "Federal VA-rated service-connected disability of 25% or more; Oregon resident for at least 6 months prior to application; Special Access Pass valid 4 years.",
  },
  {
    name: "Oregon Department of Veterans' Affairs",
    url: "https://www.oregon.gov/odva/pages/default.aspx",
    description:
      "Oregon's state agency connecting veterans and families to state and federal benefits — including claims assistance, the ORVET Home Loan Program, Oregon Veterans' Homes, employment and education resources, and the Veterans Crisis Line.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "career-education", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free for claims assistance and the Veterans Crisis Line; other benefit programs (e.g. home loans, veterans' homes) carry their own program-specific terms",
    geographicScope: "Statewide",
    state: "Oregon",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Returning Veterans Project",
    url: "https://www.returningveterans.org/",
    description:
      "Portland-based nonprofit providing free trauma-informed mental health services, peer support, and integrative care for post-9/11 veterans and their families.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver"],
    cost: "Free — \"All of our services are free of charge to post-9/11 veterans and their families\" (own site)",
    geographicScope: "Portland, Oregon metro area",
    eligibility: "Post-9/11 veterans and their immediate family members/caregivers",
    availability: "By appointment as stated on the org's own site",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Volunteers of America Oregon",
    url: "https://www.voaor.org/",
    description:
      "Oregon-based nonprofit offering housing, employment support, behavioral health, and veteran-specific services including Supportive Services for Veteran Families (SSVF) throughout Oregon.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "career-education"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Oregon (statewide)",
    eligibility: "Veterans and families who meet program-specific income/eligibility criteria for housing/employment/behavioral health services",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Central City Concern",
    url: "https://centralcityconcern.org/",
    description:
      "Portland-based nonprofit providing integrated healthcare, housing, addiction recovery, and employment services with dedicated programming for veterans experiencing homelessness or housing instability.",
    needCategoryIds: ["housing-transportation", "mental-health", "career-education"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Portland, Oregon metro area",
    eligibility: "Veterans experiencing or at risk of homelessness; eligibility varies by program as stated on the org's own site",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "9Line Veteran Services",
    url: "https://9lineveteranservices.org/",
    description:
      "Oregon-based veteran service organization providing transitional and permanent housing, career development, transportation assistance, and peer support for veterans and their families.",
    needCategoryIds: ["housing-transportation", "career-education", "financial-assistance", "purpose-community"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Oregon (statewide)",
    eligibility: "Veterans and their families as stated on the org's own site",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "The Warrior's Journey",
    url: "https://thewarriorsjourney.org/",
    description:
      "Oregon-based nonprofit offering peer-based mental wellness and resilience training for veterans, active-duty service members, and first responders through evidence-informed programs.",
    needCategoryIds: ["mental-health", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Law Enforcement", "Fire", "EMS", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Oregon (with in-person and virtual programming)",
    availability: "Scheduled cohort-based programming as stated on the org's own site",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "Compass Housing Alliance",
    url: "https://www.compasshousingalliance.org/",
    description:
      "Housing organization with programs serving the Portland metro area providing affordable housing, eviction prevention, and supportive services for veterans and people experiencing homelessness.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Portland, Oregon metro area",
    state: "Oregon",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Washington Regional
  // ---------------------------------------------------------------------
  {
    name: "Outdoors For Our Heroes",
    url: "https://outdoorsforourheroes.org/",
    description:
      "All-volunteer Washington nonprofit providing service-connected disabled veterans, active-duty members, and first responders burden-free hunting and fishing trips plus rod-building classes, aimed at suicide prevention and community connection.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled", "Active Military", "First Responder"],
    cost: "Free — described as burden-free adventures; donation and volunteer funded",
    geographicScope: "Washington",
    state: "Washington",
    verifiedDate: "2026-08-27",
    eligibility: "Service-connected disabled veterans, active-duty personnel, and first responders.",
  },
  {
    // TODO(verify): main site blocked direct verification (403); cost inferred from charter-boat coverage of free trips, not confirmed on the org's own site.
    name: "Mission Outdoors",
    url: "https://missionoutdoors.org/",
    description:
      "Bonney Lake, Washington nonprofit using hunting, fishing, and outdoor events — including the annual Washington Tuna Classic in Westport — to provide emotional support, connection, and hope to combat veterans, active military, and first responders.",
    needCategoryIds: ["outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "First Responder"],
    cost: "Free / sponsored",
    geographicScope: "Washington",
    state: "Washington",
    verifiedDate: "2026-08-27",
  },
  {
    // NOTE: this benefit reaches veterans indirectly, through a qualifying organization — a veteran cannot apply for the pass directly.
    name: "Everyone Outdoors Program",
    url: "https://discoverpass.wa.gov/about-pass/free-ways-visit/everyone-outdoors-program",
    description:
      "Washington State Parks, WDFW, and DNR jointly provide free annual Discover Passes to Washington-based nonprofit and veteran organizations — not individual veterans directly — so those organizations can give their constituents direct outdoor access.",
    needCategoryIds: ["outdoor-programs", "financial-assistance"],
    audienceTags: ["Veteran"],
    cost: "Free (the pass, to qualifying organizations)",
    geographicScope: "Washington",
    state: "Washington",
    verifiedDate: "2026-08-27",
    eligibility:
      "Applicant must be an organization, not an individual, based in and serving Washington residents; passes reviewed monthly, first-come-first-served; cannot be used for auctions or other fundraising purposes.",
  },
  {
    name: "Washington Department of Veterans Affairs",
    url: "https://dva.wa.gov/",
    description:
      "Washington's state agency providing claims assistance, PTSD/TBI/suicide-prevention counseling, four State Veterans Homes, the Washington State Veterans Cemetery, and statewide benefit navigation for veterans, service members, and families.",
    needCategoryIds: ["legal-benefits", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost:
      "Varies by service — claims assistance and counseling are free; a $300 interment fee applies for eligible family members at the state veterans cemetery; the four State Veterans Homes bill based on ability to pay",
    geographicScope: "Statewide",
    state: "Washington",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Northwest Justice Project — Veterans Project",
    url: "https://nwjustice.org/veterans-project",
    description:
      "Washington's only dedicated civil legal aid program for low-income and at-risk veterans — a Veterans Unit handling VA benefits, housing, and other civil legal matters, with teams in King, Pierce, Kitsap, Mason, Lewis, Thurston, and Spokane counties reaching hundreds of veterans across the state each year.",
    needCategoryIds: ["legal-benefits", "housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Free — NJP services are free for eligible clients; the Veterans Project provides legal assistance in VA benefits and housing at no cost",
    geographicScope: "Statewide",
    eligibility: "Low-income and at-risk veterans in Washington; veterans in King County can call the King County Veterans Program (206-263-8387) for an appointment to speak with NJP.",
    availability: "Ongoing intake via the CLEAR legal hotline and NJP's online legal-help application",
    phone: "1-888-201-1014 (CLEAR hotline)",
    hours: "CLEAR hotline: Monday–Friday, 9:15 AM – 12:15 PM",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Washington Attorney General — Office of Military and Veteran Legal Assistance (OMVLA)",
    url: "https://www.atg.wa.gov/veteran-and-military-resources",
    description:
      "The Washington State Attorney General's Office of Military and Veteran Legal Assistance connects veterans, service members, and their families with free civil legal help — referrals to legal aid and community resources, self-help information and rights guides, and in some cases a referral to a pro bono lawyer for up to an hour of legal advice.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — the program helps community members 'get free civil legal help,' including referrals to a pro bono (free) lawyer",
    geographicScope: "Statewide",
    eligibility: "Veterans, service members, or their families with a civil legal (non-criminal) problem; for legal clinics, individuals must live or be stationed in Washington and meet certain financial eligibility requirements.",
    availability: "Ongoing — submit a legal-help request through the office's online form",
    phone: "(206) 464-6431",
    hours: "Monday–Friday, 8:00 AM – 5:00 PM (closed weekends and state holidays)",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    name: "King County Veterans Program",
    url: "https://kingcounty.gov/en/dept/dchs/human-social-services/king-county-veterans-program",
    description:
      "King County's veteran services agency providing financial assistance (rent, mortgage, utilities, move-in costs, medical expenses, medical aids and devices, work clothing and tools), housing stability support, employment services, wellness resources, and onsite legal and end-of-life specialists to veterans, servicemembers, and their families throughout the county.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "career-education", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "No fees for services (listed as 'None' in Washington state's Care-A-Van directory); some services are income dependent",
    geographicScope: "King County",
    eligibility: "Veteran (served at least one day in the military, any discharge type), servicemember, or respective family member living in King County; some services are income dependent — bring ID, proof of military service, and proof of income.",
    availability: "In-person intake — new clients seen first-come, first-served during walk-in hours; returning clients within 6 months may call to schedule with a case manager; assistance provided every 12 months",
    phone: "(206) 263-8387",
    hours: "Monday–Friday, 8:30 AM – 4:30 PM; walk-in intake Monday–Friday 8:30–11:00 AM and 1:00–3:00 PM",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    name: "WDVA Veterans Transitional Housing Program",
    url: "https://dva.wa.gov/veterans-service-members-and-their-families/veterans-benefits/housing-resources/veterans-transitional-housing-program",
    description:
      "Washington Department of Veterans Affairs transitional housing for veterans without homes at two sites — Building 10 in Port Orchard and Roosevelt Barracks in Orting — providing a stable place to live while veterans work toward independence.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Program fee charged based on individual income — the standard fee is 30% of income, not to exceed the fair market rate of the county (stated on dva.wa.gov)",
    geographicScope: "Washington — residences at Port Orchard and Orting",
    eligibility: "Veterans of any branch with an Honorable or General (Under Honorable) discharge.",
    availability: "Intake by contacting the site program managers directly",
    phone: "360-982-4830 (Orting) · 360-764-0727 (Port Orchard)",
    hours: "Monday–Friday, 8:00 AM – 4:30 PM",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    name: "WDVA Veterans Conservation Corps",
    url: "https://dva.wa.gov/vcc",
    description:
      "WDVA's Veterans Conservation Corps offers paid internships in environmental conservation and sustainable agriculture across Washington — hands-on habitat restoration, farming, and environmental research paired with veteran support for well-being and civilian career pathways (22 veterans enrolled in 2025).",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Paid — the program provides 'Paid Internships for Veterans'",
    geographicScope: "Statewide",
    eligibility: "Washington State veterans.",
    availability: "Applications accepted through the program's online application; training events and conferences posted on the site",
    phone: "1-800-562-2308 (WDVA)",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): add an explicit cost statement from the VIP application packet if published — the program page describes grant-funded assistance but does not use the word free.
    name: "WDVA Veterans Innovations Program (VIP)",
    url: "https://dva.wa.gov/node/1383/veterans-innovations-program-vip",
    description:
      "WDVA's Veterans Innovations Program provides grant-funded assistance to post-9/11 Washington veterans facing financial hardship — employment transitions, homelessness/eviction/foreclosure prevention, transitions to education, utility shutoff prevention, and transportation needs (FY 24–25: 77 veterans transitioned to employment, 70 assisted with housing crises, 41 with utility shutoff prevention).",
    needCategoryIds: ["financial-assistance", "housing-transportation", "career-education"],
    audienceTags: ["Veteran"],
    cost: "Grant-funded assistance — the program page states requests must fall 'within the grant funding capabilities'; no fee or repayment is stated",
    geographicScope: "Statewide",
    eligibility: "Washington resident; served on or after September 11, 2001; served under honorable conditions (or already eligible for federal VA monetary benefits, or separated with less than honorable characterization solely due to sexual orientation, gender identity, or gender expression); experiencing financial hardship where income is not sufficient to meet basic needs; request must present a discernible positive outcome and fall within grant funding capabilities.",
    availability: "Applications accepted on an ongoing basis — submit a complete application packet with required supporting documentation",
    phone: "1-800-562-2308",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Fisher House — Joint Base Lewis-McChord at Madigan I & II",
    url: "https://www.fisherhouse.org/programs/houses/current-houses/washington-joint-base-lewis-mcchord-at-madigan-army-medical-center-i-ii",
    description:
      "Two Fisher Houses at Joint Base Lewis-McChord's Madigan Army Medical Center (90700 Gardener Loop, Tacoma, WA 98431) give military and veteran families a free place to stay while a loved one receives care at the medical center.",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver"],
    cost: "Free — 'Is there a charge to stay at a Fisher House? No.' (fisherhouse.org FAQ); room fees for Army Fisher Houses are paid by Fisher House Foundation",
    geographicScope: "Joint Base Lewis-McChord / Tacoma area",
    eligibility: "Family members staying while a loved one receives care at Madigan Army Medical Center; eligibility, priorities, and selection criteria are set locally by the medical center — Fisher Houses are open to veterans of all eras (contact the house manager for specific requirements).",
    availability: "Contact the house manager directly to arrange a stay",
    phone: "(253) 967-8362",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): add cost wording if the org publishes one — the site gives no fee statement and appears donation-supported.
    name: "Gold Star Families of Washington",
    url: "https://www.goldstarfamilieswashington.org/about-1",
    description:
      "Edmonds-based 501(c)(3) (formerly Washington State American Gold Star Mothers) providing unwavering support and solace to Washington families who have lost a loved one to war, injury, or the battle at home, with a stated commitment to serving veteran and active-duty families — 'Remember, Serve, Uplift.'",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Gold Star", "Survivor", "Family", "Veteran", "Active Military"],
    cost: "Not stated on the org's own site",
    geographicScope: "Washington",
    eligibility: "Families who have lost a cherished loved one due to war, injury, or the battle at home; veteran and active-duty families are also served.",
    availability: "Year-round support and community activities — reach out by phone, email, or the site's contact form",
    phone: "206-852-4559",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm on ccsww.org that SSVF services are provided at no cost to veteran families — the page does not state a cost.
    // Own Mission page: "Rooted in Catholic Social Teaching and the Gospel imperative..." — describes its agencies as "outreaches of the Catholic Church in Western Washington."
    name: "Catholic Community Services of Western Washington — Supportive Services for Veteran Families (SSVF)",
    url: "https://ccsww.org/services/supportive-services-for-veteran-families-ssvf",
    description:
      "CCS's SSVF program quickly connects veteran families and individuals experiencing homelessness or at risk of losing housing to permanent housing through tailored housing stability plans that may include short-term financial assistance, supportive services, and longer-term shallow subsidies — a voluntary, housing-first program across ten Western Washington counties.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "King, Pierce, Thurston, Kitsap, Mason, Grays Harbor, Pacific, Lewis, Wahkiakum and Cowlitz counties",
    eligibility: "Veterans (any length of service, discharge other than dishonorable, including National Guard with at least one day under Title 10 orders) who are currently experiencing literal homelessness, fleeing domestic violence, or at risk of losing housing within 30 days; under 80% Area Median Income; residing in one of the ten listed counties.",
    availability: "Ongoing intake — call the area office in the county where you reside (King: 206-814-1660; Pierce: 253-471-5340; Thurston & surrounding counties: 253-278-6548 / 253-208-7505)",
    phone: "206-814-1660 (King) · 253-471-5340 (Pierce) · 253-278-6548 (Thurston & surrounding counties)",
    state: "Washington",
    verifiedDate: "2026-10-08",
    faithBased: true,
    faithAffiliationSource: "https://ccsww.org/about/mission-beliefs-and-values/",
  },
  {
    name: "Northwest Battle Buddies",
    url: "https://northwestbattlebuddies.org/veterans/apply-for-a-service-dog",
    description:
      "Battle Ground, Washington nonprofit providing professionally trained PTSD service dogs to veterans — 315+ veteran teams to date — including a five-week veteran handler pairing program and lifetime follow-up support, at no cost to the veteran.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free to the veteran — 'There is no cost to the Veteran' (northwestbattlebuddies.org); after graduating from the program the veteran is financially responsible for the service dog's ongoing care",
    geographicScope: "National — headquartered in Washington state (veterans served in 26+ states)",
    eligibility: "Veterans who have deployed, are honorably discharged from the U.S. armed forces, and have been diagnosed with PTSD are eligible for further evaluation; active-duty personnel may also apply with written command approval to participate in the 5-week training program.",
    availability: "Application-based — submit the pre-application questionnaire, then the full application with Member-4 copy of DD214; waiting list managed as dogs become available",
    phone: "360-558-2049 (Veteran Liaison)",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm on behindthebadgefoundation.org that family-support services (memorial planning, benefits navigation, peer support) are provided at no cost — only the site's database tools are stated as free.
    name: "Behind the Badge Foundation",
    url: "https://behindthebadgefoundation.org/about/",
    description:
      "Redmond, Washington foundation providing immediate and ongoing support to Washington law enforcement families, agencies, and communities after a line-of-duty death — memorial planning, benefits navigation, and peer support — plus grief, traumatic-stress, and suicide-prevention training, the Law Enforcement Family Network (LEFN), and the Washington State Law Enforcement Memorial.",
    needCategoryIds: ["family-support", "mental-health", "purpose-community"],
    audienceTags: ["Law Enforcement", "First Responder", "Family", "Survivor", "Coworker"],
    cost: "Not stated on the org's own site",
    geographicScope: "Washington",
    eligibility: "Washington law enforcement families, agencies, and communities affected by a line-of-duty death or serious line-of-duty injury; LEFN unites active officers and their families.",
    availability: "Immediate after-event response for line-of-duty deaths, with ongoing family and survivor support year-round",
    phone: "(425) 747-7523",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): add a chapter phone number if the org publishes one — a (253) 905-1392 number appears only on the chapter's Facebook page, not on heroesonthewater.org.
    name: "Heroes on the Water — Northwest Washington Chapter",
    url: "https://heroesonthewater.org/chapters/northwest-washington",
    description:
      "Volunteer-led chapter of Heroes on the Water hosting no-cost therapeutic kayaking, fishing, and social events for veterans, first responders, and their families in Pierce, King, and Kitsap counties — including family events, small-group and women-only outings — with all kayaks, fishing gear, and safety equipment provided.",
    needCategoryIds: ["sports-fitness", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Law Enforcement", "Family"],
    cost: "Free — chapter events are no-cost, and all necessary equipment (kayaks, fishing gear, safety gear) is provided",
    geographicScope: "Pierce, King, and Kitsap counties — events on Puget Sound, the Pacific Ocean, and lakes within 30 miles of Tacoma",
    eligibility: "Participants must be active-duty military, veteran, law enforcement officer, first responder, or family member; no prior experience necessary.",
    availability: "Regularly scheduled on-the-water events plus social gatherings and off-season activities; sign up by emailing the chapter",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm on esd.wa.gov (or worksourcewa.com) that WorkSource veteran services are free.
    name: "Washington Employment Security Department — Veteran Services (WorkSource)",
    url: "https://esd.wa.gov/jobs-and-training/veteran-services",
    description:
      "Washington's Employment Security Department gives veterans and military spouses priority access to WorkSource services statewide — job listings, referrals and hiring events, resume/interview assistance, computer and phone access, skill assessments, and referrals to training — with dedicated veteran employment specialists at most centers serving veterans with disabilities and other severe employment barriers.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide",
    eligibility: "Anyone who served in the military, plus their spouses; identify yourself as a veteran to receive priority access to WorkSource services.",
    availability: "Ongoing — visit any WorkSource center",
    state: "Washington",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Alaska Regional
  // ---------------------------------------------------------------------
  {
    // NOTE: org describes itself as Kenai Peninsula/local, not statewide — scoped accordingly.
    name: "SOLVE Alaska",
    url: "https://www.solvealaska.org/",
    description:
      "Kenai Peninsula-based nonprofit providing Alaska veterans no-cost groceries, temporary housing help, heating fuel, emergency home and vehicle repairs, financial assistance, limited transportation, spouse support, and wilderness activities including fishing, hunting, skiing, camping, and snowmachine trips.",
    needCategoryIds: ["financial-assistance", "housing-transportation", "outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — all at no cost to veterans served",
    geographicScope: "Kenai Peninsula / regional",
    state: "Alaska",
    verifiedDate: "2026-08-27",
  },
  {
    name: "The Fallen Outdoors — Team Alaska",
    url: "https://thefallenoutdoors.org/alaska",
    description:
      "Alaska chapter of a national veteran-suicide-prevention nonprofit connecting veterans, active-duty service members, and Gold Star family members through locally guided hunting, fishing, and wheelchair-accessible outdoor trips.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Gold Star", "Family"],
    cost: "Free — outdoor opportunities are provided at no cost to veterans",
    geographicScope: "Statewide",
    state: "Alaska",
    verifiedDate: "2026-08-27",
  },
  {
    name: "SCI Alaska Wounded Warriors Outdoors",
    url: "https://aksafariclub.org/sci-alaska-chapter-warriors/",
    description:
      "Safari Club International's Alaska chapter sponsors a Purple Heart-only moose and deer hunting program (Warriors on Safari) that fully covers transportation, licenses, and processing, plus separate saltwater halibut trips and Family Fun Days open more broadly to military, law enforcement, fire, and other first responders.",
    needCategoryIds: ["outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "First Responder"],
    cost: "Free — fully sponsored by SCI Alaska and volunteer/donor organizations",
    geographicScope: "Statewide",
    state: "Alaska",
    verifiedDate: "2026-08-27",
    eligibility:
      "Flagship moose/deer hunts require Purple Heart recipient status and certified 100% service-connected disability; halibut trips and Family Fun Days are open more broadly to military, law enforcement, fire, and other first responders.",
  },
  {
    name: "Alaska Disabled Veteran Hunting/Fishing/Trapping Benefit",
    url: "https://www.adfg.alaska.gov/index.cfm?adfg=license.veterans",
    description:
      "Alaska Department of Fish and Game program offering a complimentary, non-expiring hunting, sport fishing, and trapping identification card to Alaska resident veterans certified 50% or more disabled, also exempting holders from the king salmon and waterfowl conservation stamps.",
    needCategoryIds: ["outdoor-programs", "financial-assistance"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Alaska",
    verifiedDate: "2026-08-27",
    eligibility:
      "Must meet Alaska residency requirements and be certified 50%+ disabled (VA Benefit Summary Letter or equivalent documentation required); card becomes void if residency lapses.",
  },
  {
    name: "Alaska Office of Veterans Affairs",
    url: "https://veterans.alaska.gov/",
    description:
      "State office, part of the Alaska Department of Military and Veterans Affairs, providing free statewide Veteran Service Officer assistance with benefit counseling, claims filing, and paperwork for veterans, dependents, and survivors.",
    needCategoryIds: ["legal-benefits", "career-education"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Alaska",
    verifiedDate: "2026-08-27",
    eligibility: "Most benefits require discharge under other-than-dishonorable conditions.",
  },

  // ---------------------------------------------------------------------
  // Hawaii Regional
  // ---------------------------------------------------------------------
  {
    name: "AMVETS Hawaii Service Foundation",
    url: "https://amvetshawaii.org/amvets-hawaii-service-foundation/",
    description:
      "Hawaii-based nonprofit providing adaptive sports, wellness programming (PTSD/TBI, creative arts therapy), agricultural and beekeeping therapy, scuba certification, and career/employment assistance for veterans, active-duty members, and military families across Hawaii, American Samoa, and the Pacific.",
    needCategoryIds: ["mental-health", "sports-fitness", "career-education", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family", "Gold Star"],
    cost: "Free",
    geographicScope: "Statewide / Pacific region",
    state: "Hawaii",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Big Tire Bootcamp (AMVETS Hawaii Human Performance Center)",
    url: "https://bigtirebootcamp.com/",
    description:
      "Outdoor adaptive and group-fitness program at AMVETS Hawaii's Human Performance Center in Ewa Beach, Oahu; veterans and active-duty personnel train free, while adaptive athletes, first responders, families, and the general public can join through paid membership.",
    needCategoryIds: ["sports-fitness", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Disabled", "Family"],
    cost: "Free for veterans and active duty; general public pays $59/month individual or $99/month family, with a free 7-day trial",
    geographicScope: "Ewa Beach, Oahu",
    state: "Hawaii",
    verifiedDate: "2026-08-27",
  },
  {
    // NOTE: "Hawaii OVS Island Outreach" from source notes is the same office, not a distinct program — its island-coverage detail is folded into this entry's description rather than published separately.
    name: "Hawaii Office of Veterans' Services",
    url: "https://dod.hawaii.gov/ovs/",
    description:
      "State office (Hawaii Department of Defense) providing free VA disability claims and appeals assistance, employment support, Military Funeral Honors, and state veteran cemetery/home liaison services, with counselors stationed on Kauai, Oahu, Maui, and Hawaii Island, plus monthly Molokai and quarterly Lanai outreach visits.",
    needCategoryIds: ["legal-benefits", "career-education", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Hawaii",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): cost not explicitly confirmed as free on the org's own site — no fees mentioned, but not stated outright either.
    name: "Friends of First Responders Hawaiʻi Island",
    url: "https://www.ffrhawaii.org/resources",
    description:
      "Hilo-based nonprofit providing counseling, peer support, wellness events, and training to help police, firefighters, EMS personnel, and their families manage stress, trauma, and PTSD.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "First Responder", "Family"],
    cost: "Not explicitly stated — no participant fees mentioned",
    geographicScope: "Hawaii Island (Big Island)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
    eligibility: "Police, fire, and EMS personnel and their families in Hawaii County",
  },
  {
    name: "Honolulu Vet Center",
    url: "https://www.va.gov/honolulu-vet-center/",
    description:
      "Federally-run community counseling center offering free individual, couples/family, and group counseling for military trauma, PTSD, depression, grief, military sexual trauma, and readjustment — no VA enrollment or specific discharge status required.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Oahu (Honolulu)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans who served in a combat zone/area of hostility, active duty/Guard/Reserve, their families, Vietnam-era veterans, and anyone who experienced military sexual trauma",
    phone: "877-927-8387",
    availability: "24/7 Vet Center call center",
  },
  {
    name: "Volunteer Legal Services Hawaiʻi — Veterans Assistance Program",
    url: "https://www.vlsh.org/what-we-do/veterans-assistance/",
    description:
      "Statewide nonprofit matching low-to-moderate income Hawaii veterans and their dependents with volunteer attorneys to file VA disability benefit claims and appeals.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — delivered by volunteer attorneys",
    geographicScope: "Hawaii (statewide)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
    eligibility: "Hawaii resident; veteran or dependent of a veteran meeting VLSH income/asset limits; must first obtain own VA service and medical records",
    phone: "808-528-7046",
  },
  {
    name: "Navy-Marine Corps Relief Society — Pearl Harbor",
    url: "https://www.nmcrs.org/locations/pearl-harbor-hi",
    description:
      "Financial assistance office for active-duty and retired Sailors and Marines, providing interest-free loans and grants for emergencies like utility shortfalls, car repairs, emergency travel, and disaster relief.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Active Military", "Veteran", "Family"],
    cost: "No-cost consultation; assistance via interest-free loans and grants",
    geographicScope: "Oahu (Pearl Harbor)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
    eligibility: "Active duty or retired Navy/Marine Corps and eligible family members",
    phone: "808-473-0282",
  },
  {
    name: "Armed Services YMCA Hawaiʻi",
    url: "https://hawaii.asymca.org/services/",
    description:
      "Since 1917, provides military family support on Oahu — early childhood education/preschool, youth resiliency programs, food/grocery assistance, and holiday travel/meal support — focused on junior-enlisted families across all branches including Guard/Reserve.",
    needCategoryIds: ["family-support"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family", "Military Spouse"],
    cost: "Free or low-cost; no membership fees",
    geographicScope: "Oahu (Joint Base Pearl Harbor-Hickam, Wahiawa, Kailua)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
    phone: "808-448-1972",
  },
  {
    // TODO(verify): usvets.org blocked direct automated fetch (403); content verified via a third-party text-extraction proxy rendering the org's own page plus cross-checked search summaries, not a direct fetch. Recommend a manual check before treating cost/eligibility/phone as confirmed.
    name: "U.S.VETS Wai'anae",
    url: "https://usvets.org/locations/waianae/",
    description:
      "Oahu Leeward Coast shelter/services campus (108 emergency beds plus a newer community for up to 80) providing emergency, transitional, and permanent supportive housing, plus meals, mental-health resources, and career/job placement for veterans and civilian families experiencing or at risk of homelessness.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family", "Disabled"],
    cost: "Not confirmed — contact to verify",
    geographicScope: "Oahu (Leeward/Waianae Coast)",
    state: "Hawaii",
    verifiedDate: "2026-09-29",
  },

  // ---------------------------------------------------------------------
  // New York Regional
  // ---------------------------------------------------------------------
  {
    name: "Heroes on the Hudson — New York",
    url: "https://hudsonsailing.org/veterans-programs/",
    description:
      "Annual adaptive maritime sports clinic hosted by Hudson River Community Sailing in partnership with VA New York Harbor Healthcare, serving injured veterans from the New York/New Jersey region through sailing, kayaking, and recreation-based rehabilitation.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for eligible veterans",
    geographicScope: "New York / New Jersey region",
    state: "New York",
    verifiedDate: "2026-08-27",
    eligibility:
      "Open to veterans eligible for VA medical care with a qualifying condition (e.g. orthopedic amputation, TBI, burn injury, mental-health condition, visual impairment, or other injury).",
  },
  {
    // TODO(verify): direct site fetch was blocked (403); content sourced via cached/search-indexed copies of the org's own materials — recommend a manual check.
    name: "Adaptive Sports Foundation",
    url: "https://www.adaptivesportsfoundation.org/military-programs/",
    description:
      "Windham, NY-based adaptive-sports nonprofit whose Warriors in Motion program serves injured service members with adaptive skiing, cycling, paddling, and wellness instruction, and partners with regional veteran adaptive-sports events including Heroes on the Hudson.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — equipment, meals, and lodging are provided at no cost to veterans",
    geographicScope: "Windham, NY / statewide",
    state: "New York",
    verifiedDate: "2026-08-27",
  },
  {
    name: "True North Foundation",
    url: "https://www.truenorth4heroes.com/",
    description:
      "New York City-based grant-making foundation that funds and promotes veteran-serving nonprofits — including Merging Vets & Players, the Marine Corps Scholarship Foundation, Dog Tag Inc., and the Stay In Step Foundation — across education, adaptive sports, employment transition, and rehabilitation; it does not deliver services directly.",
    needCategoryIds: ["career-education", "sports-fitness", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "N/A — grant-making foundation; services are delivered by its partner organizations, each with their own cost and eligibility terms",
    geographicScope: "New York (headquartered); partner organizations operate more broadly",
    state: "New York",
    verifiedDate: "2026-08-27",
  },
  {
    name: "New York State Department of Veterans' Services",
    url: "https://veterans.ny.gov/",
    description:
      "New York State's cabinet-level veterans agency; veteran-staffed Benefits Advisors provide free claims assistance and mobile outreach, plus housing grants, family resources, and suicide-prevention and PTSD support.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "family-support", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free for claims assistance and benefits advising",
    geographicScope: "Statewide",
    state: "New York",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Veterans Outreach Center",
    url: "https://veteransoutreachcenter.org/",
    description:
      "Rochester, NY veterans services center offering housing and residential programs, workforce development, behavioral health and wellness, legal resources including Veterans Treatment Court and Lawyer for a Day, a Quartermaster pantry of free food and clothing, and care management for veterans and their families. Serves Genesee, Livingston, Monroe, Ontario, Orleans and Wayne counties.",
    needCategoryIds: ["housing-transportation", "career-education", "legal-benefits", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — 'every service we provide is delivered with respect, compassion, and at no cost' (own site)",
    geographicScope: "Rochester, NY area — Genesee, Livingston, Monroe, Ontario, Orleans & Wayne counties",
    eligibility: "'No matter your branch, rank, or time served, you are welcome here' (own site); veterans and their families in six Western NY/Finger Lakes counties",
    availability: "Walk-in — no appointment necessary",
    phone: "585-546-1081",
    hours: "Monday–Friday, 8:30 a.m.–4:30 p.m.",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): grant page says 14 surrounding counties while homepage says 17 — confirm the county list; site does not explicitly state assistance is free to recipients.
    name: "WNY Heroes",
    url: "https://wnyheroes.org/",
    description:
      "Buffalo, NY nonprofit providing immediate assistance to Western New York veterans and their families — Heroes' Bridge grants for rent, mortgage and utilities paid directly to vendors, Adopt-A-Hero's Family holiday support, Operation Backpack school supplies, Operation B.O.O.T.S. peer-to-peer groups, service dogs through Pawsitive for Heroes, and up to $1,500 scholarships.",
    needCategoryIds: ["financial-assistance", "family-support", "career-education", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — grants paid directly to vendors ('All checks are written to the landlord, utility company, mortgage company'); no application fee is mentioned (own site)",
    geographicScope: "Western New York — Buffalo HQ; grants for residents of the surrounding counties",
    eligibility: "Grant programs: veterans legally residing in Western New York for a minimum of one year in Buffalo and the surrounding counties (own site's grant page)",
    availability: "Grants reviewed by a committee of veterans and renewable once every three years; Adopt-A-Hero's Family and Operation Backpack run annually",
    phone: "716-630-5020",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm whether the site currently lists pantries beyond the Utica location (its pantry page links out to a general food-pantry finder).
    name: "Feed Our Vets",
    url: "https://feedourvets.org/",
    description:
      "Utica, NY nonprofit that since 2009 has run community food pantries providing regular, free food to veterans, active-duty members and their families — 79,000+ veterans served, 6 million+ pounds of food and $430,000+ in gift cards distributed.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — 'community food pantries that provide regular, free food to Veterans and their families' (own site)",
    geographicScope: "Utica, NY — Mohawk Valley",
    eligibility: "Veterans, active-duty service members, and their spouses and children (own site)",
    hours: "Wednesday, 1:30–5:30 p.m.; Saturday, 8:00–11:00 a.m. on the third Saturday of the month",
    phone: "315-525-9206",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site notes remote options for those not local to the Hudson Valley — confirm which programs are available outside the region.
    name: "Guardian Revival",
    url: "https://www.guardianrevival.org/",
    description:
      "Beacon, NY nonprofit improving the mental health and well-being of military members, veterans and first responders — 'guardians' — and their families at no cost, through outdoor adventures (Another Summit), companion dogs (Boots & Paws), peer support (Dwyer Vet2Vet of Putnam), department training (RISE) and ICISF crisis-intervention courses.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections"],
    cost: "Free — 'All our programs are provided free of cost to guardians' (own site)",
    geographicScope: "Hudson Valley, NY — Beacon HQ with partnerships across Orange, Dutchess, Putnam and Westchester counties; online courses also offered",
    eligibility: "Active and retired military (including Reserves and National Guard), first responders (law enforcement, fire & rescue, EMS, dispatch, corrections, federal agents) and their families (own site)",
    availability: "Year-round programs and events; courses and HQ visits by arrangement (own site)",
    phone: "845-617-6164",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Honor Flight Long Island",
    url: "https://www.honorflightlongisland.org/",
    description:
      "Long Island chapter of the Honor Flight Network that has flown more than 2,000 local veterans on all-expenses-paid trips to Washington, D.C. to visit the memorials honoring their service.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free — 'all-expenses-paid trip to Washington DC to see their memorials' (own site)",
    geographicScope: "Long Island, NY — flights depart from Long Island airports",
    eligibility: "Veterans with an honorable discharge prior to May 7, 1975 (end of the Vietnam War era); terminally ill veterans of any era receive highest priority (own site)",
    availability: "Applications accepted continuously on a first-come, first-served waiting list; flights run seasonally",
    phone: "631-702-2423",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm from the application form whether any cost-sharing, income limits, or insurance-exhaustion requirements apply.
    name: "Ray Pfeifer Foundation",
    url: "https://theraypfeiferfoundation.org/",
    description:
      "Massapequa Park, NY 501(c)(3) founded by FDNY first responders in memory of FDNY firefighter Ray Pfeifer, assisting September 11 first responders with medical needs not covered by insurance — home health and hospice care, motorized scooters, portable oxygen, and other equipment and therapy.",
    needCategoryIds: ["equipment-grants", "financial-assistance"],
    audienceTags: ["First Responder", "Fire", "Law Enforcement", "EMS"],
    cost: "Not stated on the org's own site — assistance covers medical needs and equipment 'not covered by insurance' and requires an application (own site)",
    geographicScope: "Nationwide — assists 9/11 first responders around the country; HQ Massapequa Park, NY",
    eligibility: "September 11, 2001 first responders suffering from 9/11-related illnesses (own site's application process)",
    availability: "By application — submit the foundation's application form by email; contact the foundation directly by phone",
    phone: "516-882-2870",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site states only that programs are available to registered families — confirm whether any carry a fee or are explicitly free.
    name: "Tuesday's Promise",
    url: "https://www.tuesdayspromise.org/",
    description:
      "Manhasset, NY nonprofit (formerly Tuesday's Children) providing lifelong support to families affected by traumatic loss — one-on-one youth mentoring for children ages 6–18 who lost a parent, guardian or sibling in military service, plus community and peer support, family engagements and resource-navigation case management for military families of the fallen, 9/11 families and 9/11 first responders.",
    needCategoryIds: ["family-support", "mental-health", "purpose-community"],
    audienceTags: ["Family", "Gold Star", "Survivor", "First Responder"],
    cost: "Not stated on the org's own site — 'Programs are available to any registered Tuesday's Promise family or individual' (own site)",
    geographicScope: "Long Island HQ (Manhasset, NY); programs offered in person and virtually",
    eligibility: "Children ages 6–18 who lost a parent, guardian or sibling in military service; also serves military families of the fallen (since 9/11/2001), 9/11 families and 9/11 first responders (own site)",
    availability: "Year-round — youth-mentoring matches run a minimum of one year; register through the site",
    phone: "516-562-9000",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm current county/district coverage — the official page links a statewide resources directory but does not list locations or participation costs inline.
    name: "New York State Veterans Treatment Courts",
    url: "https://www.nycourts.gov/problem-solving-courts/veterans-treatment-courts",
    description:
      "New York State Unified Court System's Veterans Treatment Courts, which connect justice-involved veterans to treatment and services in a therapeutic court setting surrounded by an interdisciplinary team — judge, court staff, prosecutors, treatment providers, defense attorneys, probation, law enforcement, volunteer veteran peer mentors and federal veterans-department representatives. New York created the first VTC in the country in Buffalo City Court in 2008.",
    needCategoryIds: ["legal-benefits", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide — New York State Unified Court System courts where a Veterans Treatment Court operates",
    eligibility: "'VTCs accept veterans with all characters of military discharge' (own page); for justice-involved veterans referred within a court setting",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Legal Services NYC — Veterans Justice Project",
    url: "https://www.legalservicesnyc.org/resources/veterans-military-advocacy/",
    description:
      "New York City civil legal aid for low-income military veterans and service members — housing and eviction defense, consumer debt and tax matters, family law, income supports and public benefits, and health-care access — delivered in partnership with VA hospitals, vet centers and veteran housing programs across the five boroughs.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Free — 'Legal Services NYC provides FREE civil legal assistance to military veterans and service members across New York City' (own site)",
    geographicScope: "New York City — five boroughs",
    eligibility: "Low-income veterans and service members in NYC — 'Legal help subject to capacity and location' (own site)",
    phone: "917-661-4500",
    hours: "Monday–Friday, 9:30 a.m.–4:00 p.m.",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site lists only an email and a Plattekill/Saugerties mailing address — confirm a referral phone number; scholarship schedule is stated for 2027.
    name: "Joseph P. Dwyer Veterans Peer Support Project",
    url: "https://www.josephpdwyerpeerproject.org/",
    description:
      "Statewide coordinating body (the Dwyer Coalition for Military Veterans & Families) for New York's county-based Joseph P. Dwyer Veterans Peer Support Project network — confidential, non-clinical peer support for veterans, service members and military families in all 62 counties, plus DwyerCare referral navigation, a Connection Lounge of local and virtual activities, and scholarships.",
    needCategoryIds: ["mental-health", "purpose-community", "family-support", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Family", "Caregiver", "Survivor", "Gold Star"],
    cost: "Free — 'The Joseph Dwyer Program is a 100% confidential and FREE program that covers NY State' (own site); Connection Lounge activities are listed as free",
    geographicScope: "Statewide — all 62 New York counties",
    eligibility: "Veterans, service members, military families, caregivers, survivors and Gold Star families across New York State (own site)",
    availability: "Year-round — county peer-support programs, DwyerCare referrals and a statewide virtual community; two $1,500 scholarships planned for 2027 (applications Jan 1–Apr 1)",
    state: "New York",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm cost wording for housing, shelter and WeCare suicide-prevention services — only employment programs are described as free.
    name: "Black Veterans for Social Justice",
    url: "https://bvsj.org/",
    description:
      "Brooklyn-founded nonprofit serving all veterans regardless of race, gender or discharge status with VA benefits assistance and job readiness at its Veterans Service Center, free job training and placement, emergency, transitional and permanent supportive housing, a food pantry and community services, and a suicide-prevention program across New York City.",
    needCategoryIds: ["housing-transportation", "career-education", "mental-health", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free for employment programs — 'Free job training, resume help, interview prep, and job placement for veterans in NYC' (own site); housing, pantry and other service costs are not stated",
    geographicScope: "New York City — founded in Brooklyn; resource center at 665 Willoughby Ave.",
    eligibility: "'All veterans and their families' served 'regardless of race, gender, or discharge status' (own site)",
    hours: "Monday–Friday, 8:00 a.m.–6:00 p.m.",
    phone: "718-852-6004",
    state: "New York",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // New Jersey Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): exact per-event cost isn't itemized; org states experiences are "provided at little to no cost."
    name: "American Warrior Outdoors",
    url: "https://americanwarrioroutdoors.org/",
    description:
      "Galloway, NJ-headquartered, veteran-led nonprofit connecting veterans and active-duty service members through fishing, hunting, and outdoor experiences aimed at camaraderie, mental clarity, and renewed purpose; also serves NY, PA, MA, DE, and MD.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Little to no cost to participants",
    geographicScope: "New Jersey / regional (NY, PA, MA, DE, MD)",
    state: "New Jersey",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Operation Beachhead",
    url: "https://www.opbeachhead.org/",
    description:
      "Jersey Shore nonprofit founded in 2011 by wounded Vietnam veteran Michael Ricci, offering year-round adaptive sports — surfing, paddleboarding, and kayaking in summer, sled hockey, skiing, and ice skating in winter — for veterans, active-duty troops, and people with disabilities.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free — provides free services and opportunities to participants",
    geographicScope: "Jersey Shore / statewide",
    state: "New Jersey",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Heroes on the Hudson — New Jersey",
    url: "https://hudsonsailing.org/veterans-programs/",
    description:
      "Annual adaptive maritime sports clinic hosted by Hudson River Community Sailing in partnership with VA New York Harbor Healthcare, serving injured veterans from the New York/New Jersey region through sailing, kayaking, and recreation-based rehabilitation.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for eligible veterans",
    geographicScope: "New York / New Jersey region",
    state: "New Jersey",
    verifiedDate: "2026-08-27",
    eligibility:
      "Open to veterans eligible for VA medical care with a qualifying condition (e.g. orthopedic amputation, TBI, burn injury, mental-health condition, visual impairment, or other injury).",
  },
  {
    // TODO(verify): PTSD/readjustment-counseling and diversion-program claims from source notes weren't independently confirmed on the fetched page — reconfirm against program-specific subpages before treating as fully checked.
    name: "New Jersey Department of Veterans Affairs",
    url: "https://www.nj.gov/dva/",
    description:
      "New Jersey's state veterans agency, operating Veteran Service Offices in all 21 counties plus three Veterans Homes, providing benefits assistance, housing support, suicide-prevention and peer-support resources, and statewide resource navigation via Unite NJ Veterans.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "New Jersey",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): phone number, hours, and formal eligibility criteria could not be confirmed from public program pages on the org's own site.
    name: "Valor Clinic Foundation",
    url: "https://valorclinic.org/",
    description:
      "Clark, New Jersey-based nonprofit providing trauma-focused mental health care, counseling, and support services to veterans, active-duty service members, and first responders, including those affected by PTSD and moral injury.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Law Enforcement", "Fire", "EMS", "Family"],
    cost: "Free — 'services are provided at no cost to veterans, service members, and first responders' (own site)",
    geographicScope: "Clark, NJ (with virtual options available in some programs)",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost for veteran programs not stated on the org's own site; income thresholds, phone, and hours not confirmed from public pages.
    name: "Eva's Village",
    url: "https://evasvillage.org/",
    description:
      "Paterson, New Jersey-based nonprofit providing comprehensive services including housing, recovery support, job training, and veteran-specific programming for veterans experiencing homelessness, poverty, or substance use challenges.",
    needCategoryIds: ["housing-transportation", "career-education", "mental-health", "financial-assistance"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Paterson, NJ (with some services extending to Northern NJ)",
    eligibility: "Veterans (as stated for veteran-specific programming on the org's own site)",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): award amounts, application deadlines, and cost structure are not fully detailed on the org's own site.
    name: "The 200 Club of Morris County",
    url: "https://www.200clubofmorriscounty.com/",
    description:
      "Morris County, New Jersey nonprofit providing financial support to families of fallen first responders and scholarships to dependents of first responders and military personnel killed in the line of duty or training.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Military Spouse", "Family", "Survivor", "Gold Star"],
    cost: "Not stated on the org's own site",
    geographicScope: "Morris County, NJ",
    eligibility: "Families and dependents of fallen first responders; scholarships open to dependents as specified, including military line-of-duty deaths where eligible per program guidelines stated on site",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): contact information, award timelines, and explicit inclusion of military line-of-duty cases beyond first-responder categories are not confirmed on the org's own site.
    name: "The 200 Club of Bergen County",
    url: "https://www.200clubbergen.org/",
    description:
      "Bergen County, New Jersey nonprofit supporting the families of law enforcement officers, firefighters, and EMS personnel killed in the line of duty, and providing educational scholarships to their children and grandchildren.",
    needCategoryIds: ["financial-assistance", "family-support", "career-education"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Family", "Survivor"],
    cost: "Not stated on the org's own site",
    geographicScope: "Bergen County, NJ",
    eligibility: "Families of fallen first responders (law enforcement, fire, EMS) in Bergen County; scholarship eligibility as stated on site",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): admission fees and insurance requirements are not stated on the org's own site.
    name: "New Jersey Firemen's Home",
    url: "https://www.njfh.org/",
    description:
      "Boonton, New Jersey facility providing long-term care and residential services for eligible retired New Jersey firefighters, including those with disabilities or in need of skilled nursing care.",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Fire", "Disabled", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Boonton, NJ (statewide eligibility for NJ firefighters)",
    eligibility: "Eligible retired New Jersey firefighters (as stated on the org's own site)",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): office hours are not consolidated on the page; documentation requirements not fully confirmed from this page alone.
    name: "New Jersey Department of Labor & Workforce Development — Veterans Services",
    url: "https://www.nj.gov/labor/career-services/veterans/",
    description:
      "Official New Jersey state program providing employment and training services for veterans, transitioning service members, and eligible spouses through Disabled Veterans' Outreach Program specialists and Local Veterans' Employment Representatives.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Disabled"],
    cost: "Free — 'no cost to veterans' (stated on the program page of the NJ .gov site)",
    geographicScope: "Statewide (NJ)",
    eligibility: "Veterans, transitioning service members, and eligible spouses (as stated on the NJ .gov site)",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): interest rates, fees, income limits, and Guard/Reserve eligibility details require lender verification; cost structure not fully stated on the summary page.
    name: "New Jersey Housing and Mortgage Finance Agency (NJHMFA) — Veterans Programs",
    url: "https://www.nj.gov/dca/hmfa/homeownership/owners/veteransprograms/",
    description:
      "Official New Jersey state housing agency offering mortgage and down payment assistance programs specifically for veterans and service members, including the NJHMFA Veterans Loan Program.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (NJ)",
    eligibility: "Eligible veterans and service members (as stated on the NJ .gov site)",
    state: "New Jersey",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Connecticut Regional
  // ---------------------------------------------------------------------
  {
    name: "Open Doors Outdoors",
    url: "https://www.opendoorsoutdoors.org/",
    description:
      "Connecticut nonprofit providing guided hikes, UTV excursions, snowshoeing, and kayaking for veterans and their families throughout New England, using nature and peer connection to support healing and reconnection.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free to participants — donations cover 100% of program expenses",
    geographicScope: "Connecticut / New England",
    state: "Connecticut",
    verifiedDate: "2026-08-27",
    eligibility: "Veteran Hiking Program is veteran-specific; the Family Hiking Program is open to non-veterans too.",
  },
  {
    // TODO(verify): general (non-veteran) program pricing isn't disclosed on-site.
    name: "Summit Adaptive Sports — Veteran Program",
    url: "https://www.summitadaptive.org/",
    description:
      "New Hartford, CT-based adaptive sports nonprofit offering veterans and service members with permanent disabilities free adaptive skiing, snowboarding, kayaking, hiking, mountain biking, and disc golf, via the Move United VA Adaptive Sports Grant Program.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled", "Active Military"],
    cost: "Free for veterans and service members with permanent disabilities",
    geographicScope: "Northwestern Connecticut",
    state: "Connecticut",
    verifiedDate: "2026-08-27",
    eligibility: "Requires a permanent disability (veterans and active-duty service members).",
  },
  {
    // TODO(verify): cost not stated on the org's own site; contact required.
    name: "LOF Adaptive Skiers — Wounded Veteran Programs",
    url: "https://www.lofadaptiveskiers.org/",
    description:
      "Lake Zoar (Southbury, CT)-based adaptive water-sports organization — the first in the country to develop adaptive water sports for veterans — offering waterskiing, wakeboarding, and Wounded Warrior events, including a dedicated Women Warriors program for female veterans.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Sponsored",
    geographicScope: "Lake Zoar, CT / regional",
    state: "Connecticut",
    verifiedDate: "2026-08-27",
    eligibility: "Wounded Warrior event open to all veterans regardless of disability type; Women Warriors program serves female veterans specifically.",
  },
  {
    // TODO(verify): cost for residential/nursing/cemetery services isn't disclosed on-site (likely eligibility- and means-based).
    name: "Connecticut Department of Veterans Affairs",
    url: "https://portal.ct.gov/dva",
    description:
      "Statewide Connecticut agency providing benefits advocacy, residential and skilled nursing care, cemetery and memorial services, a free veteran bus-pass program, and referrals for legal assistance and suicide-prevention resources.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free bus-pass program; benefits advocacy provided at no cost",
    geographicScope: "Statewide",
    state: "Connecticut",
    verifiedDate: "2026-08-27",
    eligibility: "Advocacy services available to veterans, eligible spouses, and dependents; nursing/residential care limited to eligible wartime veterans.",
  },

  // ---------------------------------------------------------------------
  // Rhode Island Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): no fee/pricing information stated anywhere on the org's site.
    name: "SAIL TO WIN",
    url: "https://www.sailtowin.org/",
    description:
      "Newport, RI-based nonprofit using adaptive competitive sailing, training, and regatta competition to empower wounded veterans and injured first responders with visible and invisible disabilities.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "First Responder"],
    cost: "Sponsored",
    geographicScope: "Newport, RI / regional",
    state: "Rhode Island",
    verifiedDate: "2026-08-27",
    eligibility: "Serves wounded veterans and injured first responders with disabilities, explicitly including non-visible injuries.",
  },
  {
    // TODO(verify): cost not stated on-site; contact required.
    name: "Outdoors With Veterans",
    url: "https://outdoorswithveterans.com/",
    description:
      "Exeter, RI-based nonprofit providing veterans fishing, hunting, canoeing, and other outdoor activities across Rhode Island, Massachusetts, Connecticut, Maine, New Hampshire, and beyond, building veteran community.",
    needCategoryIds: ["outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Sponsored",
    geographicScope: "Rhode Island / New England",
    state: "Rhode Island",
    verifiedDate: "2026-08-27",
  },
  {
    name: "SMGA New England — Rhode Island",
    url: "https://www.smganewengland.org/",
    description:
      "Regional chapter of the Salute Military Golf Association serving all six New England states, providing post-9/11 combat-wounded veterans free golf clinics, group lessons, custom-fitted clubs, and recurring outings.",
    needCategoryIds: ["sports-fitness", "mental-health", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for approved Members (Warrior Golf Clinics, lessons, clubs); group golf-course memberships available for a cart-fee-only rate",
    geographicScope: "New England region (all six states)",
    state: "Rhode Island",
    verifiedDate: "2026-08-27",
    eligibility:
      "Post-9/11 combat-wounded veterans only for full Member benefits, with documentation required; a separate, narrower Participant tier exists for service-connected but non-combat injuries.",
  },
  {
    // TODO(verify): home/cemetery-specific costs aren't detailed on the general RIVETS page.
    name: "Rhode Island Office of Veterans Services — RIVETS",
    url: "https://vets.ri.gov/",
    description:
      "Statewide Rhode Island veterans agency providing benefits counseling, discharge-paperwork assistance, and case management through its Veterans Resource Center, plus the RI Veterans Home and Memorial Cemetery, focused on reducing veteran homelessness, poverty, and unemployment.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Rhode Island",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Operation Stand Down Rhode Island",
    url: "https://osdri.org/",
    description:
      "Rhode Island's primary nonprofit resource for homeless and at-risk veterans, providing permanent and transitional housing, SSVF-eligible temporary financial assistance, employment and training services, VA disability claims support, pro bono legal representation, and a food pantry as part of wrap-around services.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "legal-benefits", "career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Pro bono for eligible veterans — \"Our Legal Assistance for Warriors (LAW) program provides pro-bono representation to eligible Rhode Island veterans\"; fees for housing, employment, and other services are not stated on the org's own site",
    geographicScope: "Rhode Island (Johnston)",
    eligibility: "Serves \"Active Duty Military Personnel, National Guard, Reservists, Veterans and Military Families\"; financial housing assistance is \"for SSVF-eligible veterans\"",
    availability: "Office hours 8:30AM-4:30PM Monday through Friday",
    phone: "401-383-4730",
    hours: "8:30AM - 4:30PM Monday-Friday",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Rhode Island CISM",
    url: "https://rhodeislandcism.com/",
    description:
      "Nonprofit team of trained peers from fire, EMS, law enforcement, nursing, and dispatch providing critical incident stress management, peer support, crisis intervention, and trauma-recovery referrals for Rhode Island's emergency personnel, spanning pre-crisis planning through on-scene support, defusings, debriefings, follow-up, and family support.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch"],
    cost: "Free — \"Our services are free of charge and strictly confidential.\"",
    geographicScope: "Rhode Island",
    crisisResource: true,
    crisisAudience: "first-responders",
    eligibility: "Includes responders involved in any critical incident — \"Our response is not limited to exclusively public safety personnel. Any organization involved in the scene is considered to be a responder\"",
    availability: "24/7 crisis support line (site header: \"CISM Support 24/7\")",
    phone: "401-763-2778",
    hours: "24/7",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the Military Families Connect page says it is \"made possible through grants, underwriting, and community sponsorship\" and a scholarship program exists; no explicit participant fee is stated on the site.
    name: "Stable Strides Foundation — Military Families Connect",
    url: "https://www.stablestridesri.org/military-programs",
    description:
      "Portsmouth, RI nonprofit offering non-clinical, ground-based equine-facilitated programming for active-duty service members, veterans, military spouses, and families, designed to build emotional regulation, resilience, communication, and connection with the herd.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Military Spouse", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Portsmouth, RI (Rhode Island)",
    eligibility: "Program serves \"active-duty service members, veterans, military spouses, and families in Rhode Island\"",
    availability: "Sessions offered as single gatherings or multi-session series and customizable upon request; registration via the site",
    phone: "401-300-0851",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "MISSION: Boots to Briefcases",
    url: "https://missionbootstobriefcases.com/",
    description:
      "Veteran-founded and led Rhode Island 501(c)(3) providing single-source military-to-civilian transition assistance — tailored assessments, referrals for benefits and career training, community events, and family programming for veterans and their families.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Fees — \"Fees for transitioning are highly competitive\" (own site)",
    geographicScope: "Warwick, RI (Rhode Island)",
    eligibility: "Mission targets \"veterans and their families\" in Rhode Island",
    availability: "All programs and services by appointment; evening and Saturday appointments available",
    phone: "401.213.8786",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Rhode Island Veterans Network",
    url: "https://www.rivetsnetwork.org/",
    description:
      "Veteran-founded, volunteer-run network connecting Rhode Island veterans, Guard and Reserve members, spouses, and supporters through monthly networking socials, a veteran career and support directory, mentorship, and free career training including Scrum certification prep.",
    needCategoryIds: ["purpose-community", "career-education"],
    audienceTags: ["Veteran", "Guard/Reserve", "Military Spouse", "Family", "Civilian Supporter"],
    cost: "Free — \"Free networking, career resources, and mentorship for veterans and their families in Rhode Island\"; socials are \"Free. The venue covers the room and the food\"",
    geographicScope: "Rhode Island / New England",
    eligibility: "Site: \"Veterans, Guard and Reserve, spouses, and supporters\"",
    availability: "Monthly networking socials; running since October 2018",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Weekend Warriors of New England",
    url: "https://www.weekendwarriorsofnewengland.us/",
    description:
      "Veteran-led nonprofit organizing low-pressure outdoor and community activities — time in nature, creative hobbies, and peer connection — to reduce isolation and build supportive community for veterans across New England.",
    needCategoryIds: ["purpose-community", "outdoor-programs"],
    audienceTags: ["Veteran"],
    cost: "Free — \"All activities are free to attend.\"",
    geographicScope: "New England (Rhode Island-based)",
    availability: "Recurring event-based activities; see events calendar on site",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Providence Clemente Veterans' Initiative",
    url: "https://pvdvets.org/",
    description:
      "Free college-style humanities course for veterans exploring history, art, philosophy, and literature in an engaged peer community, with transferable college credits available at no cost and without using VA benefits.",
    needCategoryIds: ["career-education", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free — \"The course is free\"; \"offer an opportunity to experience a college classroom and earn transferable college credits at no cost, and without using any VA benefits. All books and instructional materials are provided free to participants.\"",
    geographicScope: "Providence, RI (classes via Zoom)",
    eligibility: "Accepts \"applications from all veterans, regardless of race, gender identity, service years, deployment history, disability status, or discharge status\"",
    availability: "Fall semester classes begin mid-September; Monday/Thursday evenings 6pm-8pm via Zoom",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the org's own site does not state its headquarters/service area, participant costs, or hard eligibility; Rhode Island placement and free-for-veterans framing come from partner listings (e.g., VA Providence Vet Center), not the org's own site — confirm before publishing.
    name: "Beyond The Battle",
    url: "https://www.beyondthebattle.org/",
    description:
      "Veteran-service nonprofit whose stated mission is to \"provide opportunities for individuals to escape their personal battles through outdoor adventures and financial support,\" organizing outdoor excursions such as hunting, fishing, and range time for veterans.",
    needCategoryIds: ["outdoor-programs", "financial-assistance", "purpose-community"],
    audienceTags: ["Veteran", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Rhode Island",
    availability: "Application-based for excursions — \"You will be contacted if selected!\" (sign-up form on site)",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    name: "RI Fire Chiefs Honor Flight Hub",
    url: "https://www.rihonorflight.com/",
    description:
      "Official Honor Flight Network hub operated by the Rhode Island Association of Fire Chiefs, transporting WWII, Korea, and Vietnam-era veterans to Washington, DC memorials at no cost to the veteran, with 33 flights and over 1,000 veterans served to date.",
    needCategoryIds: ["purpose-community"],
    audienceTags: ["Veteran", "Guard/Reserve", "Family"],
    cost: "Free — \"we do this free of any charge to our veterans\" (mission statement PDF on own site)",
    geographicScope: "Rhode Island",
    eligibility: "\"Any veteran who has served honorably in the U.S. military (including U.S. Reserves and National Guard) is eligible\"; priority chronological by conflict (WWII first)",
    availability: "Recurring flights by application; flights periodically reach capacity and close for new applicants",
    phone: "401-741-7999",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the own site is thin/template-style and never states fees or concrete delivery; costs and day-to-day service availability need reconfirmation before publishing.
    name: "VetsHub",
    url: "https://vetshub.org/",
    description:
      "Cranston, RI organization providing financial counseling and education to Rhode Island veterans, spouses, and families — budgeting, credit repair, debt counseling, retirement planning, VA mortgage and home-purchase support, business start-up counseling, and tax guidance.",
    needCategoryIds: ["financial-assistance", "career-education"],
    audienceTags: ["Veteran", "Military Spouse", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Cranston, RI / Rhode Island",
    eligibility: "Mission serves \"Rhode Island veterans, spouses, and families\"",
    phone: "(401)-206-4446",
    state: "Rhode Island",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Massachusetts Regional
  // ---------------------------------------------------------------------
  {
    name: "VA Boston Adaptive Sports",
    url: "https://www.va.gov/boston-health-care/programs/adaptive-sports-therapy/",
    description:
      "VA Boston Healthcare System program offering enrolled veterans kayaking, cycling, surfing, rowing, fishing, sailing, golf, archery, skiing, snowboarding, and wheelchair sports, plus annual weeklong winter and summer sports clinics.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for enrolled VA patients",
    geographicScope: "VA Boston catchment area / New England-wide clinics",
    state: "Massachusetts",
    verifiedDate: "2026-08-27",
    eligibility: "Must be enrolled in VA Healthcare, medically stable/cleared, and obtain an Adaptive Sports/Recreation consult from a primary care physician.",
  },
  {
    name: "Massachusetts Universal Access Program",
    url: "https://www.mass.gov/orgs/universal-access-program",
    description:
      "Massachusetts DCR program providing adaptive and accessible recreation — kayaking, cycling, rowing, golf, skiing, skating — at state parks statewide, in partnership with All Out Adventures, Easterseals Massachusetts, Holyoke Rows, and Waypoint Adventure; a general disability-access program rather than veteran-specific, though veterans are among those it serves.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Disabled", "Veteran"],
    cost: "Free or low-cost — free specialized adaptive equipment and free or low-cost accessible recreation programs June-August at 29 DCR properties; some programs may carry a fee",
    geographicScope: "Statewide",
    state: "Massachusetts",
    verifiedDate: "2026-08-27",
  },
  {
    name: "SMGA New England — Massachusetts",
    url: "https://www.smganewengland.org/",
    description:
      "Massachusetts-headquartered chapter of the Salute Military Golf Association using golf as physical and mental rehabilitation for post-9/11 combat-wounded veterans, offering free formal instruction, custom-fitted clubs, and recurring outings.",
    needCategoryIds: ["sports-fitness", "mental-health", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free for approved Members (Warrior Golf Clinics, lessons, clubs); group golf-course memberships available for a cart-fee-only rate",
    geographicScope: "New England region (all six states, hub in MA)",
    state: "Massachusetts",
    verifiedDate: "2026-08-27",
    eligibility: "Post-9/11 combat-wounded veterans only for full Member benefits, with documentation required.",
  },
  {
    // TODO(verify): exact current dollar cap for the Chapter 115 benefit wasn't independently confirmed directly on mass.gov (fetch blocked); corroborated via secondary legal-aid sources.
    name: "Massachusetts Executive Office of Veterans Services / Chapter 115",
    url: "https://www.mass.gov/info-details/chapter-115-benefitssafety-net-program",
    description:
      "Massachusetts General Laws Chapter 115 is a means-tested state and municipal safety-net program, administered through a mandatory Veterans Service Officer in every Massachusetts city and town, providing eligible veterans and dependents financial assistance for food, shelter, clothing, fuel, and medical care.",
    needCategoryIds: ["legal-benefits", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free to apply and receive VSO assistance; the benefit itself is a means-tested cash/in-kind assistance payment",
    geographicScope: "Statewide",
    state: "Massachusetts",
    verifiedDate: "2026-08-27",
    eligibility: "Must be a veteran or dependent of a veteran, demonstrate financial need, and reside in Massachusetts.",
  },
  {
    // TODO(verify): cost not stated on the org's own site; own-site FAQ does not state a discharge-character rule.
    name: "Veterans Inc.",
    url: "https://www.veteransinc.org/",
    description:
      "Massachusetts-based nonprofit (HQ Worcester) offering emergency and transitional housing, employment services, food pantry, transportation, education, case management, substance use treatment, and suicide prevention for veterans across New England and in Montana and North Dakota.",
    needCategoryIds: ["housing-transportation", "career-education", "financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Guard/Reserve", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Massachusetts (HQ Worcester) plus veterans across New England, Montana, and North Dakota (own site)",
    eligibility: "'Any veteran of the U.S. military is eligible'; Guard/Reserve members assisted regardless of mobilization status (own site FAQ)",
    availability: "Phone intake answered 24/7 (own site)",
    phone: "1-800-482-2565",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost not stated on the org's own site; confirm whether Mass Vets Connect accepts statewide referrals.
    name: "New England Center and Home for Veterans (NECHV)",
    url: "https://nechv.org/",
    description:
      "Boston-based center providing transitional and permanent housing, employment and training, and support services for veterans experiencing or at risk of homelessness, plus its Mass Vets Connect point of contact for veterans in need.",
    needCategoryIds: ["housing-transportation", "career-education", "mental-health"],
    audienceTags: ["Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Boston, Massachusetts (own site)",
    eligibility: "Veterans experiencing or at risk of homelessness, any era, 'regardless of the length or character of discharge'; must be able to independently care for themselves (own site FAQ)",
    phone: "617-371-1800",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): legacy domain soldieron.org no longer resolves — canonical site is wesoldieron.org; verify current SSVF regional coverage.
    name: "Soldier On",
    url: "https://www.wesoldieron.org/",
    description:
      "Massachusetts nonprofit (HQ Pittsfield) offering shelter, transitional and permanent housing for veterans, SSVF homeless-prevention assistance capped at $2,000 for rent and utilities, and free financial counseling since 1994.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Guard/Reserve", "Family", "Caregiver"],
    cost: "'Safe and affordable housing' — permanent-housing residents pay monthly rent including a daily meal; financial counseling is free via a foundation grant (own site)",
    geographicScope: "Massachusetts (HQ Pittsfield, own site)",
    eligibility: "SSVF assistance requires at least one day of military service, including Guard and Reserve members (own site)",
    phone: "1-866-406-8449",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site publishes no office hours; intake is via P.O. Box, phone, and online screening form.
    name: "Veterans Legal Services",
    url: "https://www.veteranslegalservices.org/help",
    description:
      "Independent Boston-based 501(c)(3) providing free civil legal aid to Massachusetts veterans through in-person clinics at partner VA and community sites and remote services, covering housing and evictions, CORI sealing, divorce, consumer debt, public benefits, state and federal veterans benefits, and discharge upgrades.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Guard/Reserve"],
    cost: "Free — 'Veterans Legal Services provides free legal assistance to military veterans throughout Massachusetts' (own site)",
    geographicScope: "Massachusetts (in-person clinics at partner sites; remote services available statewide with a waitlist) (own site)",
    eligibility: "Served in the U.S. military, National Guard, or Reserves (any discharge status); currently reside in Massachusetts; household income under 300% of the federal poverty level (or VA SSVF/LSV-H eligible); legal case based in Massachusetts (own site)",
    availability: "Remote services currently have a waiting list; in-person clinics at partner sites (own site)",
    phone: "857-317-4474",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost not stated on the org's own site; confirm whether support is limited to Massachusetts Gold Star Families.
    name: "Massachusetts Fallen Heroes",
    url: "https://www.massfallenheroes.org/",
    description:
      "Boston-based nonprofit supporting post-9/11 Gold Star Families with financial support, basic needs grants, grief counseling, donated vehicles, employment support and legal assistance, and maintaining the state's post-9/11 military memorial.",
    needCategoryIds: ["family-support", "financial-assistance", "purpose-community"],
    audienceTags: ["Gold Star", "Survivor", "Family", "Veteran"],
    cost: "Not stated on the org's own site",
    geographicScope: "Boston, Massachusetts-based; Gold Star Family support described on its own site without a state restriction",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site does not publish age limits or application steps.
    name: "Massachusetts Soldiers Legacy Fund",
    url: "https://mslfund.org/",
    description:
      "Northborough-based nonprofit founded in 2004 awarding educational grants to the children of Massachusetts service members who died in service after 9/11, having awarded $4.1 million total to children from 54 Gold Star families, including $216,732 in 2025.",
    needCategoryIds: ["family-support", "financial-assistance", "career-education"],
    audienceTags: ["Gold Star", "Survivor", "Family"],
    cost: "Grant — educational grants awarded to recipient children (own site); no fee language published",
    geographicScope: "Children of Massachusetts service members; HQ Northborough, MA (own site)",
    eligibility: "Children of Massachusetts service members who died in the line of duty since September 11, 2001 (own site)",
    phone: "508-630-2382",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): phone is published only as vanity number 1-84-HELP-VETS — confirm the numeric equivalent before exposing a tel: link.
    name: "Military Friends Foundation",
    url: "https://militaryfriends.org/",
    description:
      "Swampscott-based 501(c)(3) (d/b/a Friends of the National Guard and Reserve Families) providing Crisis Response, Basic Needs, Casualty Assistance and Warrior Travel grants to Massachusetts military families, plus community wellness events; run by military spouses and current and former service members.",
    needCategoryIds: ["financial-assistance", "family-support", "purpose-community"],
    audienceTags: ["Active Military", "Guard/Reserve", "Family", "Gold Star", "Survivor", "Veteran"],
    cost: "Grant — 'urgent financial assistance to Massachusetts military families facing unexpected crises' (own site); no fee to apply stated",
    geographicScope: "Massachusetts — Active Duty stationed in MA, MA National Guard, Reservists residing in MA, and MA Gold Star Families (own site)",
    eligibility: "Active Duty service members stationed in Massachusetts, Massachusetts National Guard members, Reservists residing in Massachusetts, or Massachusetts Gold Star Families of all eras (own site)",
    availability: "'We aim to respond within three business days'; Crisis Response Grants typically initiated within 72 hours of the crisis (own site)",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost not stated on the org's own site; exact service-area boundaries not published — confirm whether out-of-region veterans are served.
    name: "Montachusett Veterans Outreach Center",
    url: "https://www.veterans-outreach.org/",
    description:
      "Gardner-based Central Massachusetts nonprofit offering housing support, one-time financial assistance for rent, utilities and emergencies, mental health and wellness counseling, benefits counseling, a food and clothing pantry, and medical appointment transportation for veterans.",
    needCategoryIds: ["housing-transportation", "financial-assistance", "mental-health"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Montachusett/Central Massachusetts region, HQ Gardner, MA (own site)",
    availability: "Monday–Friday, 9 a.m.–5 p.m. (own site)",
    phone: "978-632-9601",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): mass.gov page publishes no phone number — add the MassHire career-center locator contact; JVSG/HVRP eligibility is administered by local centers.
    name: "MassHire Department of Career Services — Veteran Career Services",
    url: "https://www.mass.gov/info-details/veteran-career-services",
    description:
      "MassHire career centers offering free career services to Massachusetts veterans with Priority of Service, the JobQuest veterans portal for veterans, transitioning service members and military spouses, and referrals to veteran employment programs such as JVSG, HVRP and the Hilton Honors Veteran Hiring Initiative.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse"],
    cost: "Free — 'free career services available to veterans in Massachusetts' (own page)",
    geographicScope: "Massachusetts — MassHire career centers statewide (own page)",
    eligibility: "Veterans, transitioning service members and military spouses; veterans and eligible spouses receive Priority of Service at MassHire centers (own page)",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm 508-820-2000 (MEMA line listed "For CISM services") is a staffed intake line before presenting it as a crisis number; response times not published.
    name: "Massachusetts State Peer Support Network",
    url: "https://mastatepeersupportnetwork.org/",
    description:
      "Statewide network assigning trained peer-support and Critical Incident Stress Management (CISM) teams to every city and town in Massachusetts to provide crisis intervention for public safety personnel after critical incidents.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections"],
    cost: "Free — CISM and crisis intervention services provided 'free of charge' (own site)",
    geographicScope: "Massachusetts — 'every city and town has a team assigned' (own site)",
    crisisResource: true,
    crisisAudience: "first-responders",
    phone: "508-820-2000",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost/insurance acceptance not stated on the program page; mass.gov's MassMen directory also lists a direct LEADER line (617-855-3141).
    name: "McLean LEADER Program",
    url: "https://www.massgeneralbrigham.org/en/locations/belmont-ma/mclean-law-enforcement-active-duty-emergency-responder-leader-program-loc0000280583",
    description:
      "McLean Hospital (Mass General Brigham) program in Belmont, MA providing specialized, confidential mental health and addiction care for first responders, active-duty service members and veterans, including inpatient, residential and outpatient treatment for trauma, depression and PTSD.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Law Enforcement", "Fire", "EMS", "First Responder"],
    cost: "Not stated on the org's own site",
    geographicScope: "115 Mill Street, Belmont, Massachusetts; inpatient, residential and outpatient care at McLean Hospital (own page)",
    phone: "617-855-2525",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): also appears as a partner inside the Massachusetts Universal Access Program entry — confirm current program schedule/season dates.
    name: "All Out Adventures — Veterans Programs",
    url: "https://www.alloutadventures.org/programs/veterans",
    description:
      "Northampton-based nonprofit running cycling, pickleball and kayaking programs for veterans and disabled members of the armed forces at all ability levels, with a companion welcome alongside each participant.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Active Military", "Disabled", "Caregiver", "Family"],
    cost: "Free — 'open to veterans and their loved ones at no charge. Participants may make a donation if they wish.' (own site)",
    geographicScope: "Northampton/Western Massachusetts; programs at Look Park and partner sites (own site)",
    eligibility: "Veterans and disabled members of the armed forces of any age and ability level; a companion may attend at no charge (own site)",
    phone: "413-584-2052",
    state: "Massachusetts",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Vermont Regional
  // ---------------------------------------------------------------------
  {
    name: "Vermont Adaptive — Veteran Ventures",
    url: "https://www.vermontadaptive.org/veterans/",
    description:
      "Year-round adaptive sports for veterans and their families — skiing, snowboarding, cycling, kayaking, climbing, sailing, and more — with equipment, lessons, and lift tickets provided free.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — equipment, lessons, and tickets are free",
    geographicScope: "Vermont",
    state: "Vermont",
    verifiedDate: "2026-08-27",
    eligibility: "Injured service members, veterans with disabilities (including PTSD/TBI), and their families; advance reservation required.",
  },
  {
    // NOTE: "Heroes on the River — Vermont Events" from source notes was not added — the org is Virginia-based, and its own FAQ describes Vermont programming as still in early planning, not an established offering.
    name: "New England Adventures — Vermont",
    url: "https://www.newenglandadventures.org/",
    description:
      "All-expense-paid outdoor therapeutic activities — hunting, fishing, whitewater rafting, skiing — for New England veterans, active service members, and their immediate families, aimed at reducing isolation and suicide risk.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free / all-expense-paid — approximately 95% of donations go directly to funding events",
    geographicScope: "New England region (multi-state)",
    state: "Vermont",
    verifiedDate: "2026-08-27",
    eligibility: "Honorably discharged veterans, current active service members, and their immediate family members.",
  },
  {
    // TODO(verify): free VSO assistance inferred from standard practice; not stated explicitly on the org's site.
    name: "Vermont Office of Veterans Affairs",
    url: "https://veterans.vermont.gov/",
    description:
      "State agency that administers Vermont's veteran programs and helps veterans and families access earned state and federal benefits.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Vermont",
    verifiedDate: "2026-08-27",
  },
  {
    name: "EAPFirst (Vermont First Responder Employee Assistance Program)",
    url: "https://www.vermonteapfirst.org/who-we-serve-and-about-us",
    description:
      "Confidential, free 24/7 trauma-informed counseling, critical-incident stress debriefings, and peer-support network for Vermont's first responders and their household members, run in partnership with the Vermont League of Cities and Towns.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "Dispatch", "First Responder", "Family"],
    cost: "Free",
    geographicScope: "Vermont (statewide)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    eligibility: "First responders employed by VLCT member towns, the State of Vermont, sheriff's departments, and private rescue services, plus household members",
    phone: "1-855-327-1669",
    availability: "24/7",
  },
  {
    name: "Supportive Services for Veteran Families — University of Vermont",
    url: "https://ssvf-uvm.com",
    description:
      "VA-funded program providing rapid re-housing, homelessness prevention, intensive case management, and financial assistance (rent, security deposits, utilities/arrears) to low-income veteran families who are homeless or at risk within 30 days.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Vermont (all 13 counties, plus Clinton County, NY)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    eligibility: "Head of household or spouse must be a veteran with honorable discharge; household income below 80% area median income; currently homeless or facing homelessness within 30 days",
    phone: "844-820-3232",
  },
  {
    name: "Vermont Veteran Assistance Fund",
    url: "https://veterans.vermont.gov/office-veterans-affairs/programs-administered-office-veterans-affairs/veteran-assistance-fund",
    description:
      "State-administered fund offering financial assistance to low-income Vermont veterans or their families facing a financial crisis for a critical need such as housing or utilities; eligibility is determined by phone consultation.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — specific award amount not published; call for details",
    geographicScope: "Vermont (statewide)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    phone: "802-828-3379",
  },
  {
    name: "Vermont National Guard Charitable Foundation",
    url: "https://vtngcharitable.org/about-us/",
    description:
      "501(c)(3) nonprofit providing emergency financial support (housing, food, other hardship needs) to Vermont service members of any military branch and their families, funded entirely by charitable donations.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Active Military", "Guard/Reserve", "Veteran", "Family", "Military Spouse"],
    cost: "Free to recipients",
    geographicScope: "Vermont (statewide)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    phone: "888-607-8773",
    availability: "24-hour crisis hotline",
  },
  {
    name: "Friends of Veterans",
    url: "https://fovvtnh.org/",
    description:
      "All-volunteer nonprofit (est. 1983, no paid staff) providing temporary crisis financial assistance to veterans and their families — rent/mortgage help, security deposits, utility-shutoff prevention, vehicle and home repairs, and service-dog costs for veterans with PTSD.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Vermont and New Hampshire (White River Junction region)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    phone: "802-296-8368",
  },
  {
    name: "Vermont Department of Labor — Veteran Services",
    url: "https://labor.vermont.gov/workforce-development/veteran-services",
    description:
      "State workforce agency giving veterans priority job-search assistance, one-on-one career counseling with dedicated Veteran Services Coordinators, resume/interview help, and connections to apprenticeships, training, and GI Bill education benefits.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Guard/Reserve"],
    cost: "Free",
    geographicScope: "Vermont (statewide)",
    state: "Vermont",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans receive priority of service",
  },

  // ---------------------------------------------------------------------
  // New Hampshire Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): no pricing stated for hikes, Wilderness First Aid courses, or gear assistance.
    name: "Veterans On The 48",
    url: "https://www.veteransonthe48.org/",
    description:
      "Nonprofit organizing group hikes for veterans across New Hampshire's 48 four-thousand-foot peaks; also funds Wilderness First Aid courses and helps veterans obtain hiking gear.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Sponsored",
    geographicScope: "New Hampshire (White Mountains)",
    state: "New Hampshire",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Camp Resilience",
    url: "https://www.camp-resilience.org/",
    description:
      "3-4 day retreats in New Hampshire's Lakes Region combining outdoor experiential activities with peer-to-peer counseling and life-skills workshops to support physical, mental, social, and emotional wellness.",
    needCategoryIds: ["mental-health", "outdoor-programs", "family-support"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Free — costs for all participants are covered by grants and donations; transportation to/from the retreat is the participant's own responsibility",
    geographicScope: "New Hampshire (Lakes Region)",
    state: "New Hampshire",
    verifiedDate: "2026-08-27",
    eligibility: "Military service members, veterans, first responders, and their families/spouses/caregivers.",
  },
  {
    // TODO(verify): a "no cost to veterans" claim for the winter sports clinic appeared only in a secondary source, not confirmed directly on nehsa.org; general-public sessions carry a fee.
    name: "New England Healing Sports Association (NEHSA)",
    url: "https://nehsa.org/",
    description:
      "Mount Sunapee-based adaptive sports nonprofit hosting an annual disabled-veterans winter sports clinic alongside general adaptive skiing, snowboarding, kayaking, and paddleboarding programs open to the wider disabled community.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free / varies",
    geographicScope: "Mount Sunapee, NH / regional",
    state: "New Hampshire",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): "affordable" housing has no published rent/fee figures; some recreation/therapeutic facilities are still in development, not yet operational.
    name: "Easterseals NH Military & Veterans Campus",
    url: "https://eastersealsnh.org/programs/military-veterans-campus/",
    description:
      "15-acre Franklin, NH campus combining affordable veteran housing, care coordination, career and peer-support resources, and a growing recreation and therapeutic-services hub for veterans, military members, first responders, and families.",
    needCategoryIds: ["housing-transportation", "mental-health", "career-education", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Affordable housing; exact rent/fee structure not published",
    geographicScope: "Franklin, NH / statewide draw",
    state: "New Hampshire",
    verifiedDate: "2026-08-27",
    eligibility: "Residency is by waitlist application.",
  },
  {
    name: "Responders Together NH",
    url: "http://responderstogethernh.org/",
    description:
      "Peer-led wellness and Critical Incident Stress Management (CISM) nonprofit running the Lakes Region CISM peer teams, offering peer support meetings, fitness programs, family game nights, seasonal hiking groups, and CISM/mental-health training for first responders, military members, veterans, and their families across the Lakes Region and northern New Hampshire, overseen by a volunteer licensed clinician.",
    needCategoryIds: ["mental-health", "sports-fitness", "purpose-community"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Veteran", "Active Military", "Family"],
    cost: "Free — \"no cost to participants or departments\" (own site); Friday open gym listed as \"Free open gym for fire/ems, police, dispatchers, veterans, active military & corrections officers\"",
    geographicScope: "New Hampshire (Lakes Region and northern New Hampshire; peer gym sites in Bristol and Laconia)",
    eligibility: "Active or retired responders, military members and veterans, dispatchers, corrections officers, and immediate family/family-equivalent friends (own site).",
    hours: "Free open gym every Friday 2pm-6pm (own site)",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "New Hampshire Police, Fire, & EMS Foundation",
    url: "https://nhpfef.org/",
    description:
      "New Hampshire nonprofit whose stated mission is \"To be a resource for the needs of Police, Fire, and EMS personnel and their families in dealing with crisis or catastrophes not covered by insurance or employing agencies and/or workers compensation funds,\" funded through events, donations, and volunteers.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["First Responder", "Law Enforcement", "Fire", "EMS", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "New Hampshire (statewide; based in Epping)",
    phone: "603-418-8650",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Veterans Legal Justice",
    url: "http://vljnh.org/",
    description:
      "New Hampshire 501(c)(3) nonprofit (EIN 88-324-5729) based in Durham providing pro bono legal services to active duty service members, veterans, and their family members \"in nearly every aspect of the law,\" powered by volunteer attorneys.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free — \"pro-bono legal services\" (own site)",
    geographicScope: "New Hampshire (statewide; based in Durham)",
    phone: "(603) 397-0650",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    name: "603 Legal Aid — Hope for Heroes Project",
    url: "https://www.603legalaid.org/about-us/our-projects/",
    description:
      "603 Legal Aid's veteran-focused project providing free civil legal services to veterans who are homeless or at risk of homelessness in housing, consumer, employment, tax, criminal record annulments, family law and domestic violence, VA service-connected benefits, and discharge upgrades; supported by a VA Legal Services for Homeless Veterans grant and described on its site as \"the only program of its kind in New Hampshire.\"",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — \"provides free legal services for qualifying veterans\" (own site)",
    geographicScope: "New Hampshire (statewide)",
    eligibility: "Veterans who are homeless or at risk of homelessness, generally at least 24 months active duty with a discharge status other than dishonorable; own site lists exceptions and says \"please apply and we will see any way we can help!\"",
    phone: "(603) 224-3333",
    hours: "Intake 9:00am-12:30pm Monday-Wednesday (own site)",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost is not stated on the org's own site.
    name: "New Hampshire Military Assistance Foundation",
    url: "https://nhmaf.org/",
    description:
      "New Hampshire nonprofit whose mission is to \"assist and strengthen members, families and units of the New Hampshire National Guard\" by funding programs and initiatives not supported through traditional government resources; Guard members, families, and unit affiliates submit requests for financial assistance, food, and event/unit support through an online request-for-support form, with approvals contingent on funding availability.",
    needCategoryIds: ["financial-assistance", "family-support", "purpose-community"],
    audienceTags: ["Guard/Reserve", "Family", "Active Military"],
    cost: "Not stated on the org's own site",
    geographicScope: "New Hampshire (NH National Guard community statewide)",
    eligibility: "NH National Guard members, family members, or affiliates of NH National Guard organizations (own request form).",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Veterans Business Outreach Center of New England",
    url: "https://vbocnewengland.org/about-us",
    description:
      "U.S. Small Business Administration resource partner operated by the Center for Women & Enterprise offering \"no cost business advising, workshops, trainings, and community to help veteran entrepreneurs succeed,\" plus Boots to Business and Boots to Business Reboot transition courses and USDA-partnered rural/agribusiness consultations, serving six New England states including New Hampshire.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family", "Disabled"],
    cost: "Free — \"no cost business advising, workshops, trainings\" (own site)",
    geographicScope: "New England (Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island, Vermont)",
    eligibility: "Veterans, service-disabled veterans, reservists, National Guard members, family members, and active-duty service members preparing to transition from military service to business ownership (own site).",
    phone: "844-582-2461",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the own site returned HTTP 403 to automated fetches in this pass; mission, location, phone, and hours were read from the search engine's index of veteranshome.nh.gov. Residency fee schedule and any spouse-eligibility rules need manual confirmation on the FAQ/Admission pages.
    name: "New Hampshire Veterans Home",
    url: "https://www.veteranshome.nh.gov/",
    description:
      "State-run veterans home in Tilton operating since 1890 (established as the Soldier's Home for Civil War Veterans) providing long-term residential care for New Hampshire veterans, with a stated mission \"to provide the best quality of life for NH Veterans with dignity, honor and respect.\"",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Tilton, NH (Lakes Region) — statewide draw",
    eligibility: "New Hampshire veterans seeking long-term care; admission is by application (own site).",
    phone: "603-527-4400",
    hours: "Daily, 7 a.m. - 8 p.m. (own site)",
    state: "New Hampshire",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Maine Regional
  // ---------------------------------------------------------------------
  {
    name: "Maine Adaptive — Veterans No Boundaries",
    url: "https://maineadaptive.org/veterans-no-boundaries/",
    description:
      "Free four-day summer and winter camps offering adaptive sports, custom equipment, and instruction for disabled veterans, active-duty members, and their families or caregivers.",
    needCategoryIds: ["sports-fitness", "outdoor-programs", "equipment-grants", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Active Military", "Family", "Caregiver"],
    cost: "Free — activities, lodging, and meals are free, though a $125 refundable deposit is required upon acceptance; travel to Maine is the participant's own responsibility",
    geographicScope: "Maine (statewide program, regional draw)",
    state: "Maine",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veterans, active-duty service members, and their immediate families/caregivers.",
  },
  {
    // TODO(verify): home-repair/accessibility-modification services weren't independently confirmed as a distinct listed program on the org's site during this pass; heating fuel and vehicle donation are solidly confirmed.
    name: "Maine Veterans Project",
    url: "https://maineveteransproject.org/programs-services/",
    description:
      "Direct-assistance nonprofit providing Maine veterans with heating fuel and vehicle donations, alongside indoor and outdoor recreation programs — jiu-jitsu, fitness, yoga, hunting, fishing, hiking — to rebuild camaraderie.",
    needCategoryIds: ["mental-health", "outdoor-programs", "financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran"],
    cost: "Free to eligible veterans; heating-fuel assistance requires an account with partner RH Foster Energy",
    geographicScope: "Maine (statewide)",
    state: "Maine",
    verifiedDate: "2026-08-27",
    eligibility: "Any veteran in need of assistance with a valid DD214 or ID card; heating-fuel assistance additionally requires demonstrated financial need.",
  },
  {
    // NOTE: not confirmed to be Maine-founded — business-registry sources place the org's registered address in Massachusetts; described here as a regional New England program.
    name: "New England Adventures — Maine",
    url: "https://www.newenglandadventures.org/",
    description:
      "All-expense-paid outdoor therapeutic adventures — hunting, fishing, whitewater rafting, skiing — for New England veterans, service members, and their families, aimed at improving mental and physical well-being.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Free / all-expense-paid",
    geographicScope: "New England region (multi-state)",
    state: "Maine",
    verifiedDate: "2026-08-27",
    eligibility: "Honorably discharged veterans, current active service members, and their immediate family members.",
  },
  {
    name: "Maine Bureau of Veterans' Services",
    url: "https://www.maine.gov/veterans/",
    description:
      "State agency offering free VSO benefits counseling, emergency financial assistance, employment support via Maine CareerCenters, and recreation benefits including a free lifetime state-park and museum pass and free lifetime hunting and fishing licenses for qualifying disabled veterans.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "career-education", "outdoor-programs"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Maine",
    verifiedDate: "2026-08-27",
    eligibility:
      "Free lifetime hunting/fishing licenses require a 50% or greater VA service-connected disability rating; the Veterans' Emergency Financial Assistance Program requires meeting specific residency and service criteria.",
  },
  {
    // TODO(verify): confirm exact cost structure and financial eligibility details from the org's own Admissions/Financial page.
    name: "Maine Veterans' Homes",
    url: "https://maineveteranshomes.org/",
    description:
      "Maine Veterans' Homes is a state-chartered, non-profit organization that operates skilled nursing and long-term care homes for eligible veterans and their spouses in Maine.",
    needCategoryIds: ["housing-transportation", "family-support"],
    audienceTags: ["Veteran", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (locations across Maine)",
    eligibility: "Veterans and eligible spouses, as stated on the Admissions page of the org's own site.",
    availability: "Ongoing residential care",
    phone: "(800) 278-0394",
    state: "Maine",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Travis Mills Foundation",
    url: "https://travismillsfoundation.org/",
    description:
      "Travis Mills Foundation, headquartered in Maine, provides post-9/11 injured veterans and their families with no-cost, week-long adaptive retreats at its Maine facility.",
    needCategoryIds: ["outdoor-programs", "family-support", "mental-health"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver", "Disabled"],
    cost: "Free — \"Our programs are provided at no cost to veterans and their families\" (own site).",
    geographicScope: "Based in Maine with retreats held at the Maine facility",
    eligibility: "Post-9/11 veterans with injuries (and their families/caregivers) as stated on the org's own site.",
    availability: "Week-long retreats offered on a scheduled basis",
    phone: "(207) 632-8873",
    state: "Maine",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): whether trips are offered at no cost to participants is not stated on the org's own Programs/Funding pages.
    name: "Operation ReBoot Outdoors",
    url: "https://operationrebootoutdoors.org/",
    description:
      "Operation ReBoot Outdoors is a Maine-based nonprofit that offers outdoor recreational and therapeutic programs designed for veterans, active military, and first responders.",
    needCategoryIds: ["outdoor-programs", "mental-health", "sports-fitness"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "First Responder", "Fire", "EMS", "Law Enforcement"],
    cost: "Not stated on the org's own site",
    geographicScope: "Maine-based programming",
    eligibility: "Veterans, active military, and first responders as stated on the org's own site.",
    availability: "Scheduled trips and events",
    state: "Maine",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): cost details (free/sliding scale) are not stated on the org's own About/Retreats pages; the site was unreachable at insert time (transport error), so re-confirm the faith quote and the entry facts when it is reachable.
    name: "Shepherd's Cove Ministries",
    url: "https://www.shepherdscoveministries.org/",
    description:
      "Shepherd's Cove Ministries is a Maine-based ministry that provides outdoor retreats and supportive programming for veterans, first responders, and their families.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Maine",
    eligibility: "Veterans, first responders, and their families as stated on the org's own site.",
    availability: "Retreats by reservation/schedule",
    state: "Maine",
    verifiedDate: "2026-10-08",
    // Own About page identifies the org as a faith-based ministry (About page cited as faith source).
    faithBased: true,
    faithAffiliationSource: "https://www.shepherdscoveministries.org/about-us/",
  },
  {
    // TODO(verify): specific services and whether any are provided at no cost are not stated on the org's own Programs/Services pages.
    name: "Maine Heroes",
    url: "https://maineheroes.org/",
    description:
      "Maine Heroes is a Maine-based nonprofit that provides support services and community connections for Maine's veterans, service members, and first responders.",
    needCategoryIds: ["purpose-community", "family-support", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military", "First Responder", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Maine)",
    eligibility: "Maine veterans, service members, and first responders as stated on the org's own site.",
    availability: "Ongoing",
    state: "Maine",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Maine Troop Greeters",
    url: "https://www.mainetroopgreeters.com/",
    description:
      "Maine Troop Greeters is a Maine-based volunteer organization that provides a welcoming presence at Bangor International Airport for military service members traveling through Maine.",
    needCategoryIds: ["purpose-community", "family-support"],
    audienceTags: ["Active Military", "Veteran", "Guard/Reserve"],
    cost: "Free — \"All services provided by volunteers at no cost to service members\" (own site).",
    geographicScope: "Bangor, Maine",
    eligibility: "Active duty, reserve, guard, and traveling service members as stated on the org's own site.",
    availability: "As flights arrive/depart (volunteer-based)",
    state: "Maine",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Maryland Regional
  // ---------------------------------------------------------------------
  {
    name: "NPLB Outdoors",
    url: "https://www.nplboutdoors.org/",
    description:
      "Mount Airy, Maryland-based nonprofit (Operation No Persons Left Behind Outdoors) providing wounded, injured, and ill combat veterans and their families free outdoor experiences — hunting, fishing, golf, hiking, aviation, motorsports, scuba, shooting, and family/couples events.",
    needCategoryIds: ["outdoor-programs", "sports-fitness", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Free — no strings attached and no expectation of repayment",
    geographicScope: "Maryland (headquartered); events run nationally",
    state: "Maryland",
    verifiedDate: "2026-08-27",
    eligibility:
      "Wounded, injured, and ill combat veterans with a service-connected disability, any era, all branches; some events restricted to higher disability ratings or Purple Heart recipients only.",
  },
  {
    // TODO(verify): "free" is described in secondary sources but wasn't confirmable via direct page fetch (pages returned nav-only content).
    name: "Move United Warfighters",
    url: "https://moveunitedsport.org/get-involved/warfighters/",
    description:
      "Rockville, Maryland-headquartered national adaptive-sports nonprofit providing programming for service members and veterans with permanent physical disabilities, connecting participants to a nationwide network of 150+ community chapters.",
    needCategoryIds: ["sports-fitness", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "Disabled"],
    cost: "Free / sponsored",
    geographicScope: "National (HQ in Rockville, MD)",
    state: "Maryland",
    verifiedDate: "2026-08-27",
    eligibility: "Service members and veterans with a permanent physical disability.",
  },
  {
    // NOTE: "Maryland Veterans Services Specialist Program" from source notes is this same office's internal agency-liaison network, listed on this same benefits page — not a distinct program; folded in here rather than published as a separate entry.
    name: "Maryland Department of Veterans & Military Families",
    url: "https://veterans.maryland.gov/benefits-services",
    description:
      "Maryland state agency providing veterans, service members, and families assistance with VA and state benefits — health care, education, burial, housing, recreation, tax exemptions, motor-vehicle benefits, financial support, and claims filing via VA-accredited Benefits Services Specialists, including a network of liaisons across state government agencies.",
    needCategoryIds: ["legal-benefits", "housing-transportation", "career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — claims and benefits assistance from VA-accredited specialists is provided at no cost",
    geographicScope: "Statewide",
    state: "Maryland",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Maryland Veterans Trust Fund",
    url: "https://veterans.maryland.gov/benefits-services/maryland-veterans-trust-fund",
    description:
      "Core program of the Maryland Dept. of Veterans & Military Families providing one-time financial grants, paid directly to vendors, to help Maryland veterans, National Guard members, and surviving spouses cover delinquent rent/mortgage, utilities, car/insurance payments, and emergency home or vehicle repairs.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Guard/Reserve", "Survivor", "Family"],
    cost: "Free to applicants — grants paid directly to vendors",
    geographicScope: "Maryland (statewide)",
    state: "Maryland",
    verifiedDate: "2026-09-29",
    eligibility: "Maryland resident; honorably discharged veteran, MD National Guard member, or surviving spouse of same; bills at least 30-60 days past due",
    phone: "410-260-3838",
  },
  {
    name: "St. Vincent de Paul of Baltimore — Veteran Services (SSVF)",
    url: "https://www.vincentbaltimore.org/what-we-do/veteran-services/",
    description:
      "Supportive Services for Veteran Families program using a Housing First model — case management plus financial assistance (rental arrears, security deposits, utilities, moving costs, transportation, childcare) for low-income veterans who are homeless or at risk of homelessness.",
    needCategoryIds: ["housing-transportation", "financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free — VA-funded program",
    geographicScope: "Baltimore City and Baltimore County",
    state: "Maryland",
    verifiedDate: "2026-09-29",
    eligibility: "U.S. Armed Forces veteran; current or at-risk homelessness; low-income household",
    phone: "410-462-5770",
    // Own history page: founded 1865 "at the Basilica of the Assumption"; a Catholic lay organization of parish-based conferences.
    faithBased: true,
    faithAffiliationSource: "https://www.vincentbaltimore.org/who-we-are/history/",
  },
  {
    // TODO(verify): housing sub-page returned HTTP 400 on fetch; description drawn from org-overview page instead.
    name: "Maryland Center for Veterans Education and Training (MCVET)",
    url: "https://www.mcvet.org/copy-of-what-we-do",
    description:
      "Baltimore-based nonprofit operating a full continuum of homeless-veteran housing — Day Drop In, Emergency Shelter, Bridge Housing, Transitional Housing, and Single Room Occupancy — plus workforce development, benefits counseling, and substance-abuse/mental-health support.",
    needCategoryIds: ["housing-transportation", "career-education", "financial-assistance"],
    audienceTags: ["Veteran"],
    cost: "Not stated on site",
    geographicScope: "Baltimore, Maryland",
    state: "Maryland",
    verifiedDate: "2026-09-29",
    phone: "410-576-9626",
  },
  {
    name: "Team River Runner — Southern Maryland Chapter",
    url: "https://www.teamriverrunner.org/maryland-southern-maryland/",
    description:
      "Regional chapter of the national veteran paddling-therapy nonprofit, offering adaptive flatwater and sea kayaking on the Potomac and Patuxent Rivers and the Chesapeake Bay for veterans and their families.",
    needCategoryIds: ["sports-fitness", "outdoor-programs"],
    audienceTags: ["Veteran", "Family", "Active Military"],
    cost: "Not stated on this chapter page — national program is generally free to participants",
    geographicScope: "Southern Maryland (Potomac/Patuxent Rivers, Chesapeake Bay)",
    state: "Maryland",
    verifiedDate: "2026-09-29",
    eligibility: "Open to veterans; volunteers of any background also accepted",
  },
  {
    name: "Maryland Concerns of Police Survivors (MD COPS)",
    url: "https://www.mdcops.org/",
    description:
      "Maryland chapter of the national C.O.P.S. organization, dedicated to rebuilding the lives of surviving family members and coworkers of law enforcement officers killed in the line of duty, through peer support, survivor weekends/camps, and connection to national C.O.P.S. benefits/scholarships.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Law Enforcement", "Family", "Survivor", "Gold Star", "Coworker"],
    cost: "Not stated — donation-funded 501(c)(3)",
    geographicScope: "Maryland (statewide)",
    state: "Maryland",
    verifiedDate: "2026-09-29",
    eligibility: "Survivors (spouse, children, parents, siblings, extended family, coworkers, and suicide survivors per the Public Safety Officer Support Act of 2022) of a Maryland law enforcement officer whose death meets federal/state line-of-duty criteria",
    phone: "410-371-2732",
  },
  {
    // TODO(verify): eligibility/cost specifics are thin on the chapter page itself — confirm before treating as fully production-checked.
    name: "Blue Star Families — Maryland Chapter",
    url: "https://bluestarfam.org/chapters/baltimore/",
    description:
      "Maryland chapter of the national military-family support nonprofit, offering events, peer-to-peer support networks, career/employment resources, and outdoor/family programming for military-connected families.",
    needCategoryIds: ["family-support", "purpose-community"],
    audienceTags: ["Military Spouse", "Family", "Active Military", "Guard/Reserve", "Veteran"],
    cost: "Not stated on chapter page; the Blue Star Neighborhood digital platform is free",
    geographicScope: "Maryland (Baltimore-area focus)",
    state: "Maryland",
    verifiedDate: "2026-09-29",
  },

  // ---------------------------------------------------------------------
  // Delaware Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): cost not stated anywhere on the org's own site.
    name: "Warrior Community Connect",
    url: "https://warriorcommunityconnect.com/",
    description:
      "Delmar, Delaware-based all-volunteer nonprofit providing wounded, ill, or injured veterans and their families peer-centered health and wellness programming, including beekeeping, equine therapy, fly fishing, couples support, and pickleball.",
    needCategoryIds: ["mental-health", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Sponsored",
    geographicScope: "Delmar, DE / local",
    state: "Delaware",
    verifiedDate: "2026-08-27",
    eligibility: "Wounded, ill, or injured veterans and their families.",
  },
  {
    // TODO(verify): the specific "attendant, respite and recreation funding" dollar breakdown beyond the $1,000/year recreation grant wasn't independently itemized on the org's site.
    name: "Colonial PVA — Grants & Adaptive Sports",
    url: "https://www.colonialpva.org/",
    description:
      "Newark, Delaware-based chapter of Paralyzed Veterans of America serving veterans with spinal cord injury or disease, MS, or ALS across Delaware, Maryland, New Jersey, the Philadelphia area, and DC; provides up to $1,000 in annual adaptive-sports and recreation grants plus a Delaware-specific accessibility grant program.",
    needCategoryIds: ["equipment-grants", "sports-fitness", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Caregiver"],
    cost: "Free — membership and programs are free",
    geographicScope: "Delaware / Mid-Atlantic region (DE, MD, NJ, Philadelphia area, DC)",
    state: "Delaware",
    verifiedDate: "2026-08-27",
    eligibility:
      "Veterans separated under conditions other than dishonorable with a spinal cord injury or disorder (service-connected or not); veterans with ALS or MS automatically qualify. Requires DD214, proof of citizenship, and medical evidence of SCI/D.",
  },
  {
    name: "Delaware Veterans Trust Fund",
    url: "https://vets.delaware.gov/veterans-trust-fund/",
    description:
      "State-administered emergency financial assistance fund for Delaware veterans facing verified financial hardship, covering rent or mortgage, utilities, medical bills, childcare, and vehicle expenses; grants are paid directly to vendors or creditors, not to the applicant.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free to apply; approval is not guaranteed and depends on donation availability",
    geographicScope: "Statewide",
    state: "Delaware",
    verifiedDate: "2026-08-27",
    eligibility: "Delaware resident with an Honorable or General (Under Honorable Conditions) discharge; documented emergency financial need.",
  },
  {
    // TODO(verify): a referral network — cost varies by the individual provider a veteran is referred to; the org's own site doesn't state a blanket cost.
    name: "Delaware Joining Forces",
    url: "https://vets.delaware.gov/djf/",
    description:
      "Statewide collaborative network of Delaware state agencies and community and nonprofit providers connecting military members, veterans, and families with financial and legal aid, employment, housing, education, and behavioral-health services.",
    needCategoryIds: ["mental-health", "housing-transportation", "career-education", "legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Family"],
    cost: "Referral network — cost varies by the individual provider a veteran is referred to",
    geographicScope: "Statewide",
    state: "Delaware",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Delaware Office of Veterans Services",
    url: "https://vets.delaware.gov/",
    description:
      "Delaware Department of State agency providing VA-accredited Veteran Service Officers who help veterans, dependents, and survivors file federal and state benefit claims — compensation, pension, health care, education, employment, housing, transportation, and burial — at no charge.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free — you never pay a VSO to prepare or file your claim",
    geographicScope: "Statewide",
    state: "Delaware",
    verifiedDate: "2026-08-27",
  },

  // ---------------------------------------------------------------------
  // Nebraska Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): cost not stated on the org's own site.
    name: "Miles for Heroes",
    url: "https://www.milesforheroes.com/",
    description:
      "Northeast Nebraska-based nonprofit founded by two Marine veterans in 2013 that raises support and awareness for veterans battling PTSD through outdoor activities — hunting and fishing trips, multi-day walks and relays — and events like Freedom Fest.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Sponsored",
    geographicScope: "Nebraska",
    state: "Nebraska",
    verifiedDate: "2026-08-27",
  },
  {
    // TODO(verify): cost not stated; participation appears to go through a "Warrior Application" process.
    name: "Combat Warriors Nebraska",
    url: "https://combatwarriorsne.org/",
    description:
      "Nebraska chapter of Combat Warriors Inc., connecting combat veterans and active military through hunting, fishing, and outdoor adventures; the parent organization also provides emergency financial aid to veterans and families and support to Gold Star families and widows.",
    needCategoryIds: ["outdoor-programs", "purpose-community", "financial-assistance"],
    audienceTags: ["Veteran", "Active Military"],
    cost: "Sponsored",
    geographicScope: "Nebraska",
    state: "Nebraska",
    verifiedDate: "2026-08-27",
    eligibility: "Combat veterans and active military; requires a Warrior Application.",
  },
  {
    name: "Nebraska Department of Veterans' Affairs — Benefits & Services",
    url: "https://veterans.nebraska.gov/benefits-and-services-overview",
    description:
      "Nebraska's state veterans agency benefits hub, covering education, employment, emergency financial assistance (Nebraska Veterans' Aid), health, housing, and legal advocacy, delivered through County Veterans Service Officers and the State Service Office.",
    needCategoryIds: ["career-education", "financial-assistance", "housing-transportation", "legal-benefits", "mental-health"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Active Military", "Guard/Reserve"],
    cost: "Free — State Service Office assistance is provided at no cost",
    geographicScope: "Statewide",
    state: "Nebraska",
    verifiedDate: "2026-08-27",
    eligibility: "Varies by benefit; broadly veterans, spouses, dependents, active duty, and Guard/Reserve, determined per-benefit by a County Veterans Service Officer.",
  },
  {
    name: "Nebraska Game & Parks — Veteran and Military Permits",
    url: "https://outdoornebraska.gov/permits/veterans-and-military-permits/",
    description:
      "Nebraska Game and Parks Commission program issuing discounted or free park entry, hunting, and fishing permits to veterans, disabled veterans, and active or deployed military — including a free Disabled Veterans' Lifetime Annual Park Entry Permit.",
    needCategoryIds: ["outdoor-programs", "equipment-grants"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Disabled"],
    cost:
      "Free for the Disabled Veterans' Lifetime Annual Park Entry Permit (50%+ service-connected disability, or 100% non-service-connected disability with VA pension); $5 for active-duty park entry and deployed-military hunt/fish/fur permits; $5 for the Veteran's Annual Small Game Hunt/Fish/Fur Harvest Permit for residents age 64+",
    geographicScope: "Statewide",
    state: "Nebraska",
    verifiedDate: "2026-08-27",
    eligibility: "Nebraska legal residency required for most permits; specific criteria vary per permit.",
  },

  // ---------------------------------------------------------------------
  // Iowa Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): cost not stated on the org's own site.
    name: "Iowa Veterans Outdoor Experience",
    url: "https://www.iowaveteransoutdoorexperience.com/",
    description:
      "Solon, Iowa nonprofit providing hunting and fishing trips, VA-trained peer support groups, and PTSD/suicide-awareness programming for veterans and their loved ones.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community", "family-support"],
    audienceTags: ["Veteran", "Family"],
    cost: "Sponsored",
    geographicScope: "Solon, IA / regional",
    state: "Iowa",
    verifiedDate: "2026-08-27",
    eligibility: "Open to any veteran.",
  },
  {
    name: "Adaptive Sports Iowa",
    url: "https://www.adaptivesportsiowa.org/",
    description:
      "Program of the Iowa Sports Foundation providing adaptive and recreational sports — wheelchair basketball, sled hockey, cycling, air rifle — statewide for people with physical or visual disabilities, including a National Veteran Airgun Program specifically for veterans.",
    needCategoryIds: ["sports-fitness", "equipment-grants", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — no programming or equipment fees",
    geographicScope: "Statewide",
    state: "Iowa",
    verifiedDate: "2026-08-27",
    eligibility: "Individuals with physical or visual disabilities, open to all skill levels; the Airgun program serves veterans and non-veterans with disabilities.",
  },
  {
    // NOTE: "Iowa Department of Veterans Affairs — County & State Service Offices" and "Iowa Veterans Benefits & Programs" from source notes are both dva.iowa.gov sub-pages of the same office — consolidated into one entry rather than published as two.
    name: "Iowa Department of Veterans Affairs",
    url: "https://dva.iowa.gov/benefits",
    description:
      "Iowa's state veterans agency, providing a statewide directory of County Veterans Service Offices in all 99 counties plus a benefits catalog covering the Iowa Veterans Home, Iowa Veterans Cemetery, Iowa Veterans Trust Fund, Injured Veterans Grant, homeownership assistance, and federal benefits navigation.",
    needCategoryIds: ["career-education", "financial-assistance", "housing-transportation", "legal-benefits"],
    audienceTags: ["Veteran", "Family", "Military Spouse"],
    cost:
      "Free for County Veterans Service Office assistance; individual benefit programs vary — e.g. Iowa Veterans Cemetery burial is free for veterans ($300 for spouses), lifetime hunting/fishing license is $7, and the Injured Veterans Grant provides up to $10,000",
    geographicScope: "Statewide (with county-level offices)",
    state: "Iowa",
    verifiedDate: "2026-08-27",
    eligibility: "Generally requires honorable discharge; varies per specific program.",
  },
  {
    name: "Peer Support Foundation",
    url: "https://www.peersupportfoundation.org/about",
    description:
      "Johnston, Iowa nonprofit of first responders and mental-health professionals providing peer-support training, critical-incident crisis consulting, and individual/family assistance for public-safety professionals.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Law Enforcement", "Fire", "EMS", "First Responder", "Family"],
    cost: "Not stated for individual/family peer support; annual wellness conference has a separate paid registration",
    geographicScope: "Iowa (headquartered in Johnston)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    phone: "515-978-1078",
  },
  {
    name: "Iowa Department of Public Safety — Wellness & Support Services Bureau",
    url: "https://dps.iowa.gov/wellness-support-services-bureau",
    description:
      "State bureau running a Critical Incident Stress Management Team, Peer Support Team, and Crisis Response Canine Program for DPS personnel, extending support to local first-responder agencies statewide that lack their own resources.",
    needCategoryIds: ["mental-health", "purpose-community"],
    audienceTags: ["Law Enforcement", "First Responder", "Family"],
    cost: "Not stated — appears to be a no-cost state government service",
    geographicScope: "Iowa (statewide, Des Moines-based)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    eligibility: "Primarily Iowa DPS employees; also extends to local first-responder agencies statewide who lack adequate resources",
  },
  {
    name: "Iowa National Guard — Warrior & Family Services",
    url: "https://www.iowanationalguard.com/member-and-family-services/",
    description:
      "Resilience training, suicide prevention, Yellow Ribbon deployment/reintegration support, financial and legal counseling, ID/DEERS assistance, and Survivor Outreach Services for Iowa Guard soldiers, Army civilians, and their families.",
    needCategoryIds: ["family-support", "mental-health", "financial-assistance"],
    audienceTags: ["Guard/Reserve", "Family", "Survivor", "Military Spouse"],
    cost: "Not stated on page",
    geographicScope: "Iowa (statewide)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    eligibility: "Iowa National Guard soldiers, Army civilians, and their families",
  },
  {
    name: "Puppy Jake Foundation",
    url: "https://puppyjakefoundation.org/",
    description:
      "ADI-accredited Urbandale, Iowa nonprofit pairing professionally trained service dogs with military veterans facing physical or mental-health readjustment challenges; has placed 60+ dogs since 2014.",
    needCategoryIds: ["equipment-grants", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "No charge for the dog; a $250 application fee applies (assistance available if unaffordable); ongoing dog-care costs are the veteran's responsibility",
    geographicScope: "Iowa and the broader Midwest (Urbandale, IA)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    eligibility: "Qualified military veteran with a DD214/NGB22, not dishonorably discharged, with a doctor's prescription/mental-health evaluation",
  },
  {
    name: "Home Base Iowa",
    url: "https://workforce.iowa.gov/opportunities/home-base-iowa",
    description:
      "State program connecting veterans, transitioning service members, and their spouses to career opportunities via one-on-one career planners, a jobs portal, 280+ certified veteran-friendly employers, and relocation incentives across 150+ Iowa communities.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Free at any Iowa Works center",
    geographicScope: "Iowa (statewide)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    eligibility: "Veterans (Priority of Service) and eligible spouses; some local relocation incentives have additional criteria",
  },
  {
    name: "Folds of Honor — Iowa Chapter",
    url: "https://iowa.foldsofhonor.org/who-we-are/",
    description:
      "Iowa chapter providing K-12 and higher-education scholarships (tuition, tutoring, trade/technical school, post-graduate) to spouses and children of U.S. service members killed or disabled while serving.",
    needCategoryIds: ["family-support", "career-education"],
    audienceTags: ["Gold Star", "Survivor", "Family", "Military Spouse", "Disabled"],
    cost: "Not applicable — scholarship funds awarded, no cost to applicants",
    geographicScope: "Iowa (chapter based in Carlisle)",
    state: "Iowa",
    verifiedDate: "2026-09-29",
    eligibility: "Spouses and children of military members who have fallen or been disabled while serving",
  },

  // ---------------------------------------------------------------------
  // Illinois Regional
  // ---------------------------------------------------------------------
  {
    name: "Heroes on the Water — Chicago Chapter",
    url: "https://heroesonthewater.org/chapters/chicago/",
    description:
      "Local chapter of the national Heroes on the Water nonprofit providing no-cost therapeutic kayak-fishing outings and social events for veterans, active-duty military, first responders, and their families in the Chicago area.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family", "First Responder"],
    cost: "Free — all equipment provided at no cost",
    geographicScope: "Chicago metro / Cook, Will, DuPage counties",
    state: "Illinois",
    verifiedDate: "2026-08-27",
    eligibility: "Must be active-duty military, veteran, law enforcement officer, first responder, or an immediate family member of one; no prior experience required.",
  },
  {
    // TODO(verify): cost not stated on the org's own site.
    name: "The Giving Ground Foundation",
    url: "https://www.thegivinggroundfoundation.com/",
    description:
      "Illinois nonprofit running guided, therapeutic hunting experiences — flagship Upland Hero Hunt, an annual November pheasant hunt in Roberts, IL — for disabled and able-bodied veterans to build camaraderie and support mental health.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Sponsored",
    geographicScope: "Illinois",
    state: "Illinois",
    verifiedDate: "2026-08-27",
    eligibility: "US military veterans, disabled and able-bodied.",
  },
  {
    name: "Illinois Armed Forces Legal Aid Network (IL-AFLAN)",
    url: "https://ilaflan.org/",
    description:
      "Statewide network of legal aid organizations and law school clinics providing free civil legal services — discharge upgrades, VA benefits appeals, family law, housing, consumer issues — to Illinois veterans, service members, and their dependents via a toll-free hotline.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Illinois",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans, active duty, National Guard, reservists, spouses, and dependents; household income at or below 80% of Chicago Area Median Income; no dishonorable discharge.",
  },
  {
    name: "Illinois Department of Veterans Affairs — Veteran Service Officers",
    url: "https://veterans.illinois.gov/serviceoffices.html",
    description:
      "Free benefits counseling and claims-filing assistance from federally accredited Veteran Service Officers staffing IDVA's full-time and itinerant offices statewide, covering compensation, pensions, health care, education, employment, and burial benefits.",
    needCategoryIds: ["legal-benefits", "career-education", "financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Illinois",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Illinois Department of Employment Security — Veterans Employment Services",
    url: "https://ides.illinois.gov/services/veterans.html",
    description:
      "Illinois Department of Employment Security provides priority employment services for veterans and eligible spouses through veteran representatives, including job referrals, resume assistance, training information, and unemployment benefit guidance at no cost to veterans.",
    needCategoryIds: ["career-education", "financial-assistance"],
    audienceTags: ["Veteran", "Military Spouse", "Disabled"],
    cost: "Free — services provided at no cost to eligible veterans and spouses (own site)",
    geographicScope: "Statewide (Illinois)",
    eligibility: "Veterans with other than dishonorable discharge and eligible spouses as defined by federal/state law.",
    availability: "Available through IDES offices and online services statewide.",
    hours: "Monday–Friday, 8:30 a.m.–5:00 p.m. (general IDES business hours as stated)",
    state: "Illinois",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): site does not state a cost for its referral services — confirm before claiming free.
    name: "Illinois Joining Forces",
    url: "https://www.illinoisjoiningforces.org/",
    description:
      "Statewide public-private coalition connecting service members, veterans, and their families to Illinois-based resources and support, coordinating referrals across agencies and community partners.",
    needCategoryIds: ["family-support", "purpose-community", "mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family", "Caregiver", "Survivor", "Gold Star"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Illinois)",
    eligibility: "Service members, veterans, and their families (as stated on own site).",
    availability: "Statewide resource network; services available via website and referral.",
    state: "Illinois",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Midwest Veterans Closet",
    url: "https://midwestveteranscloset.org/",
    description:
      "Chicago-area nonprofit providing clothing, household essentials, and basic need items to veterans and their families at no cost to help stabilize households in need.",
    needCategoryIds: ["family-support", "financial-assistance"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver", "Disabled"],
    cost: "Free — services provided at no cost to veterans and families (own site)",
    geographicScope: "Chicago metropolitan area (Illinois)",
    eligibility: "Veterans and their families in need (as stated on own site).",
    availability: "By appointment or during service hours as posted on own site.",
    phone: "708-308-4357",
    state: "Illinois",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): program cost and insurance coverage are not stated on the org's own site.
    name: "Road Home Program — Rush University Medical Center",
    url: "https://roadhomeprogram.org/",
    description:
      "Rush University Medical Center program providing trauma-focused mental health care for veterans, service members, and their families, including clinical treatment for PTSD and related conditions.",
    needCategoryIds: ["mental-health", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Military Spouse", "Family", "Caregiver"],
    cost: "Not stated on the org's own site",
    geographicScope: "Illinois (based in Chicago; serves veterans and families as described on own site)",
    eligibility: "Veterans, service members, and their families (program eligibility varies by service; call for details as stated).",
    phone: "312-942-8387",
    state: "Illinois",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): specific program costs are not stated on the org's own veterans services page.
    name: "Volunteers of America Illinois — Veterans Services",
    url: "https://www.voail.org/services/veterans",
    description:
      "Volunteers of America Illinois provides veterans services including transitional and supportive housing, employment assistance, and case management to help veterans achieve stability and self-sufficiency.",
    needCategoryIds: ["housing-transportation", "career-education", "family-support"],
    audienceTags: ["Veteran", "Disabled", "Caregiver", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Illinois (programs as described on own site)",
    eligibility: "Veterans who meet program eligibility criteria (housing and employment programs as stated).",
    state: "Illinois",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): program costs are not stated on the org's own veterans services page.
    name: "Catholic Charities of the Archdiocese of Chicago — Veterans Services",
    url: "https://www.catholiccharities.net/our-services/veterans-services/",
    description:
      "Catholic Charities of the Archdiocese of Chicago provides supportive services for veterans including housing assistance, case management, and basic needs support as part of its faith-based mission to serve those in need.",
    needCategoryIds: ["housing-transportation", "family-support", "financial-assistance"],
    audienceTags: ["Veteran", "Disabled", "Family", "Caregiver", "Military Spouse"],
    cost: "Not stated on the org's own site",
    geographicScope: "Chicago metropolitan area and surrounding counties (Illinois)",
    eligibility: "Veterans and their families in need (program-specific eligibility as stated).",
    state: "Illinois",
    verifiedDate: "2026-10-08",
    // Own site: "We are proud to be a faith-based organization ... anchored in our Christian faith" (Who We Are page).
    faithBased: true,
    faithAffiliationSource: "https://www.catholiccharities.net/about-us/mission/",
  },

  // ---------------------------------------------------------------------
  // Indiana Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): direct site verification was blocked in research (DNS failure); details sourced from cached content of the org's own pages — recommend a manual spot-check.
    name: "Heroes New Hope Foundation",
    url: "https://www.heroesnewhope.org/",
    description:
      "Sullivan, Indiana nonprofit providing all-inclusive, no-cost outdoor ecotherapy experiences — an annual spring turkey hunt, summer fishing trip, fall deer hunt, and disabled-youth turkey hunt — for disabled veterans, plus children of fallen or injured veterans and children with physical or emotional conditions.",
    needCategoryIds: ["mental-health", "outdoor-programs", "family-support", "purpose-community"],
    audienceTags: ["Veteran", "Disabled", "Family", "Gold Star", "Survivor"],
    cost: "Free — transportation, lodging, service-animal support, food, and equipment are all provided at no cost",
    geographicScope: "Indiana (recruits participants nationally)",
    state: "Indiana",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veterans; also extends to children of fallen or injured veterans and children with physical or emotional conditions.",
  },
  {
    // TODO(verify): cost and full geographic reach not stated on the org's own site.
    name: "Disabled Veterans Outdoor Wildlife Experience (DVOWED)",
    url: "https://www.dvowed.com/",
    description:
      "Huntington, Indiana nonprofit offering chartered fishing expeditions and seasonal guided hunting events for disabled veterans.",
    needCategoryIds: ["mental-health", "outdoor-programs", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Sponsored",
    geographicScope: "Huntington, IN",
    state: "Indiana",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veteran status.",
  },
  {
    name: "Indiana County Veteran Service Officers",
    url: "https://www.in.gov/dva/home/cvso-locate/",
    description:
      "Network of 92 county-level offices, each staffed by a state-accredited County Veteran Service Officer, providing free help filing VA claims and appeals for disability compensation, pensions, DIC, health care, education, and burial benefits.",
    needCategoryIds: ["legal-benefits", "career-education", "financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free",
    geographicScope: "Statewide (county-level offices)",
    state: "Indiana",
    verifiedDate: "2026-08-27",
    eligibility: "Indiana veterans, retired service members, and their families.",
  },
  {
    name: "Indiana Military Family Relief Fund",
    url: "https://www.in.gov/dva/divisions/military-family-relief-fund/",
    description:
      "State fund, financed by license-plate sales and administered by the Indiana Department of Veterans Affairs, providing emergency financial assistance — up to $2,500 — for food, housing, utilities, medical bills, and transportation to qualifying military families facing hardship.",
    needCategoryIds: ["financial-assistance", "family-support"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "Family"],
    cost: "Free to applicants — a grant/relief program, not a paid service",
    geographicScope: "Statewide",
    state: "Indiana",
    verifiedDate: "2026-08-27",
    eligibility: "Indiana resident with at least 12 months of qualifying military service including active duty; eligible discharge; household income at or below 2x federal poverty guidelines; documented financial hardship.",
  },

  // ---------------------------------------------------------------------
  // Ohio Regional
  // ---------------------------------------------------------------------
  {
    // NOTE: this org, Veterans Outdoor Adventures Ohio, and Disabled Veterans Outdoors have deliberately similar names but were independently verified as three genuinely distinct 501(c)(3)s (different EINs, addresses, and founders), not a rebrand/duplicate — kept as three separate entries.
    // TODO(verify): cost not formally stated; events are described as "all-expenses paid" without a stated cost policy.
    name: "Ohio Veterans Outdoors",
    url: "https://www.ohvetsoutdoors.org/",
    description:
      "Nonprofit founded in 2016 by retired Air Force pilot Brian Luce that runs a dozen-plus annual all-expenses-paid hunting, fishing, and camping events for veterans to support stress relief, healing, and community building.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free / sponsored",
    geographicScope: "Statewide",
    state: "Ohio",
    verifiedDate: "2026-08-27",
    eligibility: "Veterans of the U.S. Armed Forces.",
  },
  {
    // TODO(verify): cost not stated on the org's own site.
    name: "Veterans Outdoor Adventures Ohio",
    url: "https://voaohio.com/",
    description:
      "Nonprofit founded by Curt Baumann in Zoar, OH, that builds custom, accessibility-outfitted hunting blinds — heat, carpet, ramps or stairs as needed — and provides hunting, fishing, and archery outings specifically for disabled veterans.",
    needCategoryIds: ["outdoor-programs", "equipment-grants", "mental-health"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Sponsored",
    geographicScope: "Northeast and Southeast Ohio",
    state: "Ohio",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veterans, particularly former hunters/outdoorsmen now limited by disability.",
  },
  {
    name: "Disabled Veterans Outdoors",
    url: "https://disabledveteransoutdoors.org/",
    description:
      "All-volunteer nonprofit founded in 2015 hosting free outdoor recreational events — hunting, fishing, camping — across Ohio counties for disabled veterans, including covering food and lodging for overnight events.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — no cost to participants",
    geographicScope: "Ohio (based in Southeastern Ohio; hosts events statewide and occasionally out of state)",
    state: "Ohio",
    verifiedDate: "2026-08-27",
    eligibility: "Any honorably discharged veteran who is now disabled for any reason.",
  },
  {
    name: "Ohio County Veterans Service Offices",
    url: "https://dvs.ohio.gov/",
    description:
      "Statutory network of 88 locally staffed county offices — one per county — where trained Service Officers help veterans and their families apply for federal, state, and local benefits, including compensation, pensions, home loans, health care, and headstones/markers.",
    needCategoryIds: ["legal-benefits", "financial-assistance", "career-education"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Statewide",
    state: "Ohio",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Ohio Department of Veterans Services - Military Family Relief Fund",
    url: "https://www.ohiovet.gov/military-family-relief-fund",
    description:
      "ODVS administers the Military Family Relief Fund to provide financial assistance to Ohio veterans and their families experiencing financial hardship due to deployment, injury, or other qualifying circumstances.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver", "Gold Star", "Survivor", "Guard/Reserve", "Active Military"],
    cost: "Free to applicants — a grant/relief program, not a paid service",
    geographicScope: "Statewide (Ohio)",
    eligibility: "Ohio veterans and eligible family members who meet qualifying criteria published on the ODVS site.",
    availability: "Ongoing as funding allows",
    phone: "614-644-0898",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): the OhioMeansJobs veterans page does not state that services are free — confirm no-fee wording before publishing a firmer cost claim.
    name: "OhioMeansJobs for Veterans",
    url: "https://ohiomeansjobs.ohio.gov/job-seekers/veterans",
    description:
      "OhioMeansJobs provides dedicated veteran employment services through the Jobs for Veterans State Grant, including priority of service, career counseling, apprenticeship connections, and referrals to training opportunities.",
    needCategoryIds: ["career-education"],
    audienceTags: ["Veteran", "Guard/Reserve", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Ohio)",
    eligibility: "Veterans, eligible spouses, and transitioning service members as defined by federal and OhioMeansJobs policy.",
    availability: "Ongoing",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },
  {
    name: "Legal Aid of Western Ohio (LAWO)",
    url: "https://www.lawolaw.org/",
    description:
      "LAWO provides free civil legal services to low-income Ohioans, including veterans, with a focus on housing, benefits, consumer, education, family, and elder law matters.",
    needCategoryIds: ["legal-benefits"],
    audienceTags: ["Veteran", "Military Spouse", "Family", "Caregiver", "Disabled", "Survivor"],
    cost: "Free to eligible clients",
    geographicScope: "Western Ohio (counties served as published; contact for specific coverage)",
    eligibility: "Income-eligible Ohio residents; veterans may qualify for priority or specific services as outlined on the site.",
    availability: "Ongoing",
    phone: "888-534-1432",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm specific veteran housing program costs/referral pathways on COHHIO's own site before publishing cost as Free.
    name: "Coalition on Homelessness and Housing in Ohio (COHHIO)",
    url: "https://cohhio.org/",
    description:
      "COHHIO coordinates statewide housing and homelessness initiatives, including veteran-focused housing resources and advocacy, connecting veterans to programs that prevent and end homelessness.",
    needCategoryIds: ["housing-transportation"],
    audienceTags: ["Veteran", "Disabled", "Family"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Ohio)",
    eligibility: "Varies by program/referral; COHHIO publishes resources for veterans experiencing or at risk of homelessness.",
    availability: "Ongoing",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): confirm participation fees, equipment access/cost, and statewide service claims against current program pages on the org's own site.
    name: "Buckeye Adaptive Sports",
    url: "https://www.buckeyeadaptivesports.org/",
    description:
      "Buckeye Adaptive Sports provides adaptive sports, recreation, and wellness opportunities for individuals with disabilities, including veterans and first responders, across Ohio.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Veteran", "Disabled", "First Responder"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Ohio)",
    eligibility: "Open to individuals with disabilities; veterans and first responders welcome.",
    availability: "Ongoing (program schedule varies by season)",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },
  {
    // TODO(verify): own site's only 'free' statement on the fetched page refers to the 988 line, not OSPTF programs — confirm program cost wording before publishing a firmer claim.
    name: "Ohio Suicide Prevention Foundation",
    url: "https://ohiospf.org/",
    description:
      "Ohio Suicide Prevention Foundation works to reduce suicide through education, training, and resource connection for Ohioans, including veterans, service members, and first responders.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Active Military", "Guard/Reserve", "First Responder", "Family", "Caregiver", "Disabled"],
    cost: "Not stated on the org's own site",
    geographicScope: "Statewide (Ohio)",
    eligibility: "Open to all Ohioans; programs tailored to at-risk populations including veterans and first responders.",
    availability: "Ongoing",
    state: "Ohio",
    verifiedDate: "2026-10-08",
  },

  // ---------------------------------------------------------------------
  // Pennsylvania Regional
  // ---------------------------------------------------------------------
  {
    // TODO(verify): cost not explicitly stated on the org's own site (suggested donation tiers found, but no clear participant-cost statement). Also note: pennsylvaniaoutdoorveterans.org does not resolve — use paoutdoorveterans.org.
    name: "Pennsylvania Outdoor Veterans",
    url: "https://paoutdoorveterans.org/",
    description:
      "Lehighton, PA nonprofit founded in 2015 by combat veteran Ryan Bowman, providing guided fishing, hunting, camping, hiking, and skills-workshop programs aimed at reducing veteran suicide and supporting veterans' physical, mental, and emotional well-being.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "First Responder", "Family"],
    cost: "Sponsored",
    geographicScope: "Statewide",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Patriots Cove",
    url: "https://patriotscove.org/",
    description:
      "Noxen, PA nonprofit founded by veteran Jeff Swire offering free, fully ADA-accessible fishing, hunting, and retreat experiences — including a wheelchair-accessible trout stream, adaptive hunting equipment, and track chairs — for wounded veterans, first responders, and their caregivers.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Caregiver", "Family", "Disabled"],
    cost: "Free — including lodging, meals, and equipment",
    geographicScope: "Noxen, PA / regional (PA, KY, NC, SC)",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
    eligibility: "Wounded/combat veterans (all branches/eras), first responders (fire, police, EMS), military families, and caregivers of veterans/first responders.",
  },
  {
    // TODO(verify): cost not explicitly stated on the org's own site; donation-funded operations imply no charge to guests but this isn't confirmed in writing.
    name: "Camp Freedom",
    url: "https://campfreedompa.org/",
    description:
      "Carbondale, PA nonprofit offering hunting, fishing, shooting sports, hiking, and biking on a 2,350-acre property for disabled veterans and first responders, their families, and Gold Star/Gold Shield families, using outdoor activity in place of clinical settings to promote healing.",
    needCategoryIds: ["outdoor-programs", "mental-health", "family-support"],
    audienceTags: ["Veteran", "First Responder", "Disabled", "Family", "Gold Star"],
    cost: "Sponsored",
    geographicScope: "Carbondale, PA / national (guests from 40+ states)",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
    eligibility: "Disabled veterans, first responders, their family members, Gold Star Families, and Gold Shield Families.",
  },
  {
    // NOTE: this is the grant-making fund, distinct from Veterans Temporary Assistance below (the direct-aid program it finances) — kept as two entries rather than one combined row since they serve different practical functions.
    name: "Pennsylvania Veterans' Trust Fund",
    url: "https://www.pa.gov/agencies/dmva/pennsylvania-veterans/pa-vetconnect/state-veterans-programs/financial-assistance/veterans-trust-fund",
    description:
      "Pennsylvania Department of Military and Veterans Affairs grant fund that provides funding to veteran-service organizations statewide, ultimately assisting PA veterans and families with housing, financial help, food, training, and recovery services.",
    needCategoryIds: ["financial-assistance"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free to eligible partner organizations applying for grants; not a direct-to-individual service",
    geographicScope: "Statewide",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
  },
  {
    name: "Veterans Temporary Assistance",
    url: "https://www.pa.gov/agencies/dmva/pennsylvania-veterans/pa-vetconnect/state-veterans-programs/financial-assistance/benefits--veterans-temporary-assistance",
    description:
      "Pennsylvania DMVA program, funded by the Veterans' Trust Fund, providing up to $1,600 in temporary direct financial assistance per 12-month period to eligible PA veterans or their survivors for shelter, food, fuel, and clothing during hardship.",
    needCategoryIds: ["financial-assistance", "housing-transportation"],
    audienceTags: ["Veteran", "Family", "Survivor"],
    cost: "Free to apply; grants up to $1,600",
    geographicScope: "Statewide",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
    eligibility:
      "Honorable service (DD-214) or service-connected disability; PA resident with no legal residence elsewhere; facing temporary financial hardship not adequately covered by other assistance; eligible survivors of deceased veterans may also apply.",
  },
  {
    // NOTE: distinct organization from the existing "Mission Outdoors" entry (Bonney Lake, WA) — different EIN, domain, and address; a program of Heroes Never Alone Inc. Disambiguated name used to avoid colliding with the WA entry in the site's name-keyed UI.
    name: "Mission Outdoors — Pennsylvania",
    url: "https://www.heroesneveralone.org/Mission_Outdoors",
    description:
      "Program of Heroes Never Alone Inc. providing free guided hunting, fishing, hiking, camping, and shooting-sports outings for veterans in Westmoreland and Indiana Counties, PA, including access to the only publicly available Action Trac-Chair in Pennsylvania for disabled veterans.",
    needCategoryIds: ["outdoor-programs", "mental-health", "purpose-community"],
    audienceTags: ["Veteran", "Disabled"],
    cost: "Free — no cost to the veteran",
    geographicScope: "Westmoreland & Indiana Counties, PA",
    state: "Pennsylvania",
    verifiedDate: "2026-08-27",
    // Own site motto: "Helping Veterans through Christ and the Great Outdoors"; includes a Prayer Request page.
    faithBased: true,
    faithAffiliationSource: "https://www.heroesneveralone.org/Mission_Outdoors",
  },
];

export function getResourcesForFilters(needId: string | null, audience: string | null): Resource[] {
  return RESOURCES.filter((resource) => {
    const matchesNeed = !needId || resource.needCategoryIds.includes(needId);
    const matchesAudience = !audience || resource.audienceTags.includes(audience);
    return matchesNeed && matchesAudience;
  });
}

/** Entries flagged crisisResource, grouped by /crisis page section. */
export function getCrisisResources(group: "veterans" | "first-responders" | "general"): Resource[] {
  return RESOURCES.filter((resource) => resource.crisisResource && resource.crisisAudience === group);
}

/**
 * State-specific entries plus every nationwide entry (no `state` set) —
 * same "state or nationwide, never neither" rule the interactive directory's
 * client-side filter uses, so /resources/[state] never dead-ends into an
 * empty page even for states without a regional pass yet.
 */
export function getResourcesForState(stateName: string): {
  local: Resource[];
  nationwide: Resource[];
} {
  const local = RESOURCES.filter((resource) => resource.state === stateName);
  const nationwide = RESOURCES.filter((resource) => !resource.state);
  return { local, nationwide };
}
