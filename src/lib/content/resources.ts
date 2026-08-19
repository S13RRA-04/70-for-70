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
 * Financial & Housing and Legal & Benefits are deliberately not represented
 * yet — those categories need more aggressive eligibility/geography
 * verification before going live (see project notes), so they're held back
 * as a later expansion rather than published half-vetted.
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
    name: "Veterans Crisis Line",
    url: "https://www.veteranscrisisline.net/",
    description:
      "Official 24/7 crisis line for veterans and their loved ones, run in partnership with the VA. Dial 988 and press 1, or chat/text.",
    needCategoryIds: ["mental-health"],
    audienceTags: ["Veteran", "Family"],
    cost: "Free",
    geographicScope: "Nationwide",
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
];

export function getResourcesForFilters(needId: string | null, audience: string | null): Resource[] {
  return RESOURCES.filter((resource) => {
    const matchesNeed = !needId || resource.needCategoryIds.includes(needId);
    const matchesAudience = !audience || resource.audienceTags.includes(audience);
    return matchesNeed && matchesAudience;
  });
}
