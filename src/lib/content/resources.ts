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
 * held back until a regional research pass could vet state-specific entries
 * — see the Southeast Regional Resources block below (first pass: AL, TN,
 * GA, FL, MS, NC, SC, KY). Entries there carry a `state` and a
 * `verifiedDate`; a handful still have an inline TODO where the source
 * research flagged something to reconfirm (a specific URL, an active
 * chapter schedule) before treating it as fully production-checked the
 * same way the rest of this file's entries are.
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
}

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
    name: "Project Echelon",
    url: "https://www.projectechelon.org/",
    description:
      "Cycling mentorship and community for veterans — coaching, gear, and a team environment aimed at reducing the barriers to getting into the sport.",
    needCategoryIds: ["sports-fitness", "purpose-community"],
    audienceTags: ["Veteran"],
    cost: "Free / sponsored / grants vary",
    geographicScope: "Nationwide / cycling community",
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

  // ---------------------------------------------------------------------
  // Southeast Regional — Kentucky
  // ---------------------------------------------------------------------
  {
    // TODO(verify): Verify current chapter programming.
    name: "Catalyst Sports – Louisville Chapter",
    url: "https://moveunitedsport.org/locations/",
    description:
      "Community-based adaptive adventure sports through the Catalyst Sports / Move United network.",
    needCategoryIds: ["sports-fitness"],
    audienceTags: ["Disabled"],
    cost: "Varies",
    geographicScope: "Louisville",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
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
    name: "Kentucky Community Crisis Response Team (KCCRT)",
    url: "https://kccrt.ky.gov/PublishingImages/Pages/index/KCCRT%201-Pager.pdf",
    description:
      "Peer and mental-health response after critical incidents, traumatic events and disasters; debriefing and psychological first aid.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["First Responder"],
    cost: "Free / State-supported",
    geographicScope: "Kentucky",
    state: "Kentucky",
    verifiedDate: "2026-08-20",
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
