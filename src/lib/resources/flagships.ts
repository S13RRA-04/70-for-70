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
]);

export function enrichFlagship(resource: Resource): Resource {
  if (!FLAGSHIP_RESOURCE_NAMES.has(resource.name)) return resource;
  const audiences = resource.audienceTags.slice(0, 3).join(", ");
  return {
    ...resource,
    verificationStatus: "reviewed",
    whyIncluded: `Its published information describes services for ${audiences} with ${resource.geographicScope.toLowerCase()} availability. Cost, eligibility, and access details should be confirmed directly with the provider.`,
  };
}
