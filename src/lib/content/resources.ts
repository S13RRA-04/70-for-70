/**
 * Curated directory entries for the Resources page. Kept as data rather
 * than hard-coded JSX so entries can be revised without touching the page.
 * Each entry lists one or more category ids from src/app/resources/page.tsx's
 * CATEGORIES — a resource can span more than one (e.g. Team RWB fits both
 * Veteran Athletes and Community). Every URL was verified live before
 * being added here — this is a public-facing directory, not a placeholder.
 */

export interface Resource {
  name: string;
  url: string;
  description: string;
  categoryIds: string[];
}

export const RESOURCES: Resource[] = [
  {
    name: "Team Red, White & Blue",
    url: "https://teamrwb.org/",
    description:
      "Nonprofit that organizes thousands of weekly and monthly running, cycling, and fitness events nationwide to build community and improve veterans' health and well-being.",
    categoryIds: ["veteran-athletes", "community"],
  },
  {
    name: "Wounded Warrior Project — Soldier Ride",
    url: "https://www.woundedwarriorproject.org/programs/soldier-ride",
    description:
      "Multi-day adaptive cycling program — road bikes, hand cycles, and recumbent trikes — that has served roughly 2,000 veterans and family members annually since 2004.",
    categoryIds: ["veteran-athletes"],
  },
  {
    name: "IRONMAN Foundation — Gold Star Initiative",
    url: "https://ironmanfoundation.org/gold-star-initiative-impact/",
    description:
      "Pairs veterans and active-duty service members with Gold Star Families; participants carry a flag during select IRONMAN run legs and present it to the family at the finish line.",
    categoryIds: ["veteran-athletes"],
  },
  {
    name: "Spartan — Service Member Discounts",
    url: "https://www.spartan.com/en/pages/service-member-discounts",
    description:
      "Discounted race registration and merchandise for current and former military, law enforcement, firefighters, and other first responders (verified via GovX ID).",
    categoryIds: ["veteran-athletes", "first-responders"],
  },
  {
    name: "California Police Athletic Federation",
    url: "https://cpaf.org/",
    description:
      "Administers the U.S. Police & Fire Championships — Olympic-style competition across roughly 40 sports — for active and retired law enforcement and fire personnel.",
    categoryIds: ["first-responders"],
  },
  {
    name: "First Responder Games",
    url: "https://firstrespondergames.com/",
    description:
      "Annual Olympic-style multi-sport competition in Florida for police, fire, EMS/paramedics, military, and federal agents, run by the nonprofit First Responder Sports.",
    categoryIds: ["first-responders"],
  },
  {
    name: "Firefighter Challenge League",
    url: "https://firefighterchallenge.com/",
    description:
      "Sanctioned league of fire-service athletic events — stair climb, hose hoist, forcible entry, victim rescue — open to junior through veteran/retired firefighters.",
    categoryIds: ["first-responders"],
  },
  {
    name: "Move United — Warfighters",
    url: "https://moveunitedsport.org/get-involved/warfighters/",
    description:
      "Free adaptive sports programming across 70+ sports and 245+ chapters for service members and veterans with a permanent physical disability. Official U.S. Olympic & Paralympic Committee affiliate.",
    categoryIds: ["adaptive-sports"],
  },
  {
    name: "Achilles International — Achilles Freedom Team",
    url: "https://www.achillesinternational.org/achilles-freedom-team",
    description:
      "Provides adaptive equipment and training so wounded, ill, and injured service members and veterans can train for and complete mainstream marathons.",
    categoryIds: ["adaptive-sports"],
  },
  {
    name: "Wounded Warrior Project — Adaptive Sports",
    url: "https://www.woundedwarriorproject.org/programs/adaptive-sports",
    description:
      "Single- and multi-day clinics that teach adaptive-equipment use and athletic skills tailored to each warrior's abilities.",
    categoryIds: ["adaptive-sports"],
  },
  {
    name: "Oscar Mike Foundation",
    url: "https://oscarmike.org/pages/mission",
    description:
      "Veteran-founded nonprofit providing adaptive programs — off-roading, skydiving, wheelchair rugby, obstacle courses — and expeditions for wounded veterans.",
    categoryIds: ["adaptive-sports"],
  },
  {
    name: "Challenged Athletes Foundation — Operation Rebound",
    url: "https://www.challengedathletes.org/programs/operation-rebound/",
    description:
      "Grants for U.S. military, veterans, and first responders with permanent physical injuries, covering adaptive sports equipment, competition costs, and training.",
    categoryIds: ["adaptive-sports", "equipment-grants"],
  },
  {
    name: "Veterans and Athletes United (VetsAU)",
    url: "https://www.vetsau.org/",
    description:
      "Runs accessible retreats, adaptive sports and recreation events, and a memorial initiative for fallen service members, to empower wounded, injured, and ill veterans.",
    categoryIds: ["veteran-athletes", "adaptive-sports"],
  },
  {
    name: "Veterans Crisis Line",
    url: "https://www.veteranscrisisline.net/",
    description:
      "Official 24/7 crisis line for veterans and their loved ones, run in partnership with the VA. Dial 988 and press 1, or chat/text.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "CopLine",
    url: "https://www.copline.org/",
    description:
      "24/7 confidential hotline staffed by retired law enforcement officers, exclusively for active and retired law enforcement and their families.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Boulder Crest Foundation — Warrior PATHH",
    url: "https://bouldercrest.org/",
    description:
      "Free, science-based 90-day Posttraumatic Growth program for combat veterans and first responders, beginning with a week-long immersive training and followed by ongoing peer support.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Save A Warrior",
    url: "https://saveawarrior.org/",
    description:
      "A structured intervention plus long-term peer-supported care for active-duty military, veterans, and first responders dealing with complex PTSD and suicidal ideation.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Willing Warriors — Warrior Retreat at Bull Run",
    url: "https://www.willingwarriors.org/warrior-retreat",
    description:
      "A 37-acre, fully handicapped-accessible respite retreat in Northern Virginia where wounded, injured, and ill service members and their families get a therapeutic break from the hospital environment.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Wounded Warriors Family Support (WWFS)",
    url: "https://www.wwfs.org/familyretreats/",
    description:
      "Not affiliated with Wounded Warrior Project. Restorative family retreats and staycations, plus vehicle grants and caregiver support, for the families of those wounded, injured, or killed in combat.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Camp HERO",
    url: "https://www.campheroky.org/activities",
    description:
      "All-volunteer nonprofit running multi-day Appalachian Mountain retreats — hiking, ATV riding, fishing, campfire fellowship — for wounded veterans and first responders, at no cost to participants.",
    categoryIds: ["recovery-wellness", "first-responders"],
  },
  {
    name: "Warriors Renewal Coalition — Rest, Reset, Renewal",
    url: "https://www.warriorsrenewalcoalition.org/rest-reset/",
    description:
      "Fully-funded resort-style retreats (flights, lodging, meals, activities included) for combat-injured post-9/11 veterans, couples, and caregivers to reconnect and decompress.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Project Sanctuary",
    url: "https://projectsanctuary.us/",
    description:
      "Six-day therapeutic family retreats blending outdoor recreation with counseling and relationship-building, plus two years of follow-on family support, for veterans, spouses, caregivers, and children.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Huts for Vets",
    url: "https://www.hutsforvets.org/",
    description:
      "No-cost wilderness therapy retreats in the Colorado Rockies — guided hikes, group discussion, and community — to support veterans' mental, physical, and emotional health.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Operation Second Chance",
    url: "https://operationsecondchance.org/retreats/",
    description:
      "All-inclusive retreats — individual, couples, family, caregiver, and Gold Star Family — for combat-wounded, injured, and ill service members to relax and reconnect outside hospital settings.",
    categoryIds: ["recovery-wellness"],
  },
  {
    name: "Semper Fi & America's Fund",
    url: "https://www.semperfifund.org/get-assistance/",
    description:
      "Direct financial and family assistance for combat-wounded, critically ill, and catastrophically injured service members — bedside support, housing, caregiver retreats, and specialized adaptive equipment.",
    categoryIds: ["equipment-grants", "recovery-wellness"],
  },
  {
    name: "Operation WarriorFit",
    url: "https://www.operationwarriorfit.org/",
    description:
      "501(c)(3) providing free or heavily discounted race entries — 5Ks, marathons, Spartan races, triathlons — to veterans, active duty, reservists/Guard, and first responders as a mental-health tool.",
    categoryIds: ["equipment-grants"],
  },
  {
    name: "Hope For The Warriors — Warrior's Wish",
    url: "https://www.hopeforthewarriors.org/programs-and-services/warriors-wish/",
    description:
      "Grant program that has funded hundreds of individual wishes, including adaptive sporting and exercise equipment, for post-9/11 veterans and military families.",
    categoryIds: ["equipment-grants"],
  },
  {
    name: "The Independence Fund",
    url: "https://independencefund.org/pages/copy-of-apply-for-assistance",
    description:
      "Casework, caregiver support, and a Mobility Program providing mobility assistance and equipment for veterans, through dedicated application portals for each program.",
    categoryIds: ["equipment-grants"],
  },
  {
    name: "Catch A Lift Fund",
    url: "https://www.catchaliftfund.org/apply/",
    description:
      "Free 8-week wellness program for post-9/11 combat veterans with a 50%+ VA disability rating — one-on-one coaching, in-home gym equipment grants, and veteran-led mentorship.",
    categoryIds: ["equipment-grants", "recovery-wellness"],
  },
  {
    name: "Getting Back Up",
    url: "https://www.gettingbackup.org/apply/",
    description:
      "Financial assistance for people with spinal cord injuries, including veterans, to fund exercise-based recovery programs and adaptable products that support independence.",
    categoryIds: ["equipment-grants", "recovery-wellness"],
  },
  {
    name: "High Fives Foundation — Empowerment Fund",
    url: "https://highfivesfoundation.org/grant-application/",
    description:
      "Grants covering adaptive sports equipment, medical equipment, and living expenses for people with life-altering injuries, including service-connected veterans.",
    categoryIds: ["equipment-grants", "adaptive-sports"],
  },
  {
    name: "wear blue: run to remember",
    url: "https://www.wearblueruntoremember.org/",
    description:
      "Weekly no-cost community runs plus a Gold Star & Survivor Endurance Program, built around remembrance and peer support for military families, veterans, and Gold Star families.",
    categoryIds: ["community"],
  },
  {
    name: "DAV 5K",
    url: "https://www.dav.org/events/dav-5k/",
    description:
      "Annual run/walk/roll/ride event series, in person and virtual, from Disabled American Veterans, with free entry for veterans and active-duty service members.",
    categoryIds: ["community"],
  },
  {
    name: "9/11 Heroes Run",
    url: "https://www.travismanion.org/events/911-heroes-run",
    description:
      "Nationwide 5K series across 100+ communities each September, honoring 9/11 and the veterans and first responders who've served since, from the Travis Manion Foundation.",
    categoryIds: ["community"],
  },
  {
    name: "GORUCK",
    url: "https://www.goruck.com/pages/one-percent-for-those-who-serve",
    description:
      "Rucking-events company built on Special Forces values; commits 1% of revenue to vetted nonprofits serving veterans and first responders, and hosts community ruck events.",
    categoryIds: ["community"],
  },
];

export function getResourcesForCategory(categoryId: string): Resource[] {
  return RESOURCES.filter((resource) => resource.categoryIds.includes(categoryId));
}
