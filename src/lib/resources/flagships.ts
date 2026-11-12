import type { Resource } from "@/lib/content/resources";

/** Initial cross-category set for structured-data migration. Trust claims remain deliberately conservative. */
export const FLAGSHIP_RESOURCE_NAMES = new Set([
  "Team Red, White & Blue", "Catch A Lift Fund", "Operation WarriorFit", "Veteran Golfers Association",
  "Move United — Warfighters", "Oscar Mike Foundation", "VA National Veterans Sports Programs", "PGA HOPE",
  "Challenged Athletes Foundation — Operation Rebound", "Semper Fi & America's Fund",
  "988 Suicide & Crisis Lifeline", "Veterans Crisis Line", "CopLine", "Responder Health (Safe Call Now)",
  "Boulder Crest Foundation — Warrior PATHH", "Save A Warrior", "Mighty Oaks Foundation", "Cohen Veterans Network",
  "The Headstrong Project", "Home Base", "ResponderStrong", "First Responder Support Network — WCPR",
  "VA Vet Centers", "Give an Hour", "Military OneSource", "SAMHSA National Helpline", "Crisis Text Line",
  "Vets4Warriors", "Stop Soldier Suicide — ROGER", "NAMI HelpLine", "PsychArmor", "Make the Connection",
  "K9s For Warriors", "Patriot PAWS Service Dogs", "National Disabled Veterans Winter Sports Clinic",
  "Creative Forces: NEA Military Healing Arts Network", "Armed Services Arts Partnership (ASAP)", "CreatiVets",
  "Patriot Art Foundation", "TAPS — Tragedy Assistance Program for Survivors",
  "Concerns of Police Survivors (C.O.P.S.)", "National Fallen Firefighters Foundation", "wear blue: run to remember",
  "The Independence Fund", "Project Sanctuary", "Operation Second Chance",
  "Elizabeth Dole Foundation — Hidden Heroes", "Fisher House Foundation", "Wounded Warriors Family Support",
]);

export const NEED_PATHWAY_TAGS: Record<string, string[]> = {
  "National Disabled Veterans Winter Sports Clinic": ["chronic-pain-tbi"],
  "Semper Fi & America's Fund": ["chronic-pain-tbi", "creative-connection", "emergency-basic-needs"],
  "The Independence Fund": ["emergency-basic-needs", "caregiver-support"],
  "Responder Health (Safe Call Now)": ["addiction-recovery"],
  "Home Base": ["chronic-pain-tbi"],
  "VA Vet Centers": ["grief-bereavement"],
  "K9s For Warriors": ["chronic-pain-tbi"],
  "Patriot PAWS Service Dogs": ["chronic-pain-tbi"],
  "Creative Forces: NEA Military Healing Arts Network": ["creative-connection"],
  "Armed Services Arts Partnership (ASAP)": ["creative-connection"],
  "CreatiVets": ["creative-connection"],
  "Patriot Art Foundation": ["creative-connection"],
  "Project Sanctuary": ["caregiver-support"],
  "Operation Second Chance": ["caregiver-support"],
  "Elizabeth Dole Foundation — Hidden Heroes": ["caregiver-support"],
  "Fisher House Foundation": ["caregiver-support"],
  "Concerns of Police Survivors (C.O.P.S.)": ["grief-bereavement"],
  "National Fallen Firefighters Foundation": ["grief-bereavement"],
  "TAPS — Tragedy Assistance Program for Survivors": ["grief-bereavement"],
  "wear blue: run to remember": ["grief-bereavement"],
  "Wounded Warriors Family Support": ["caregiver-support"],
};

export function enrichFlagship(resource: Resource): Resource {
  if (!FLAGSHIP_RESOURCE_NAMES.has(resource.name)) return resource;
  const audiences = resource.audienceTags.slice(0, 3).join(", ");
  return {
    ...resource,
    situationalTags: Array.from(new Set([...(resource.situationalTags ?? []), ...(NEED_PATHWAY_TAGS[resource.name] ?? [])])),
    faithBased: resource.name === "Mighty Oaks Foundation" ? true : resource.faithBased,
    faithAffiliationSource: resource.name === "Mighty Oaks Foundation"
      ? "https://www.mightyoaksprograms.org/"
      : resource.faithAffiliationSource,
    verificationStatus: "reviewed",
    whyIncluded: `Its published information describes services for ${audiences} with ${resource.geographicScope.toLowerCase()} availability. Cost, eligibility, and access details should be confirmed directly with the provider.`,
  };
}
