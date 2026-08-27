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
