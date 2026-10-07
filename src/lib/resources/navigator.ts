import type { Resource } from "@/lib/content/resources";

export const NAVIGATOR_SITUATIONS = [
  { id: "emotional", label: "I'm overwhelmed, anxious, angry, or struggling emotionally", needs: ["mental-health"] },
  { id: "substances", label: "I'm drinking or using substances more than I want", needs: ["mental-health"] },
  { id: "family", label: "My marriage or family is struggling", needs: ["family-support", "mental-health"] },
  { id: "isolated", label: "I feel isolated or miss having a team", needs: ["purpose-community", "sports-fitness", "outdoor-programs"] },
  { id: "purpose", label: "I'm struggling with transition or purpose", needs: ["purpose-community", "career-education"] },
  { id: "work", label: "I need help with work or employment", needs: ["career-education"] },
  { id: "money", label: "I'm dealing with money problems", needs: ["financial-assistance"] },
  { id: "legal", label: "I need legal or benefits help", needs: ["legal-benefits"] },
  { id: "recreation", label: "I want fitness, outdoor, sports, or recreation opportunities", needs: ["sports-fitness", "outdoor-programs", "equipment-grants"] },
  { id: "peer", label: "I need peer support", needs: ["purpose-community", "mental-health"] },
  { id: "worried", label: "I'm worried about someone else", needs: ["mental-health", "family-support"], crisis: true },
  { id: "unsure", label: "I don't know what I need", needs: [] },
] as const;

export type NavigatorAnswers = { audiences: string[]; situations: string[]; priorities: string[]; privacyConcern: "yes" | "maybe" | "no" | "skip"; locationMode: "state" | "national" | "virtual" | "local" | "any"; state?: string };

export function resourceKey(resource: Resource) { return resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export function rankResources(resources: Resource[], answers: NavigatorAnswers) {
  const needs = new Set<string>(NAVIGATOR_SITUATIONS.filter((s) => answers.situations.includes(s.id)).flatMap((s) => [...s.needs]));
  return resources.map((resource) => {
    let score = 0; const reasons: string[] = [];
    const matches = resource.needCategoryIds.filter((id) => needs.has(id)).length;
    if (matches) { score += matches * 12; reasons.push("matches what you described"); }
    if (answers.audiences.some((tag) => resource.audienceTags.includes(tag))) { score += 8; reasons.push("serves the population you selected"); }
    if (answers.state && resource.state === answers.state) { score += 7; reasons.push(`serves ${answers.state}`); }
    else if (!resource.state) { score += 4; reasons.push("is available nationwide"); }
    if (answers.locationMode === "national" && !resource.state) score += 6;
    if (answers.locationMode === "local" && answers.state && resource.state === answers.state) score += 6;
    if (answers.locationMode === "virtual" && resource.virtualAvailable === true) { score += 6; reasons.push("offers virtual access"); }
    if (answers.priorities.includes("low-cost") && /free|no cost/i.test(resource.cost)) { score += 5; reasons.push("is listed as free or no-cost"); }
    if (answers.priorities.includes("family") && resource.audienceTags.includes("Family")) score += 5;
    if (answers.priorities.includes("peer") && resource.peerLed === true) { score += 5; reasons.push("is peer-led"); }
    if (answers.priorities.includes("faith") && resource.faithBased === true) score += 4;
    if (answers.priorities.includes("non-faith") && resource.faithBased === false) score += 4;
    if (answers.priorities.includes("no-insurance") && resource.insuranceRequired === false) { score += 4; reasons.push("does not require insurance"); }
    if (["yes", "maybe"].includes(answers.privacyConcern)) {
      if (resource.selfReferral === true) { score += 5; reasons.push("allows self-referral"); }
      if (resource.employerInvolvementRequired === false) { score += 5; reasons.push("does not require employer involvement"); }
      if (resource.anonymousInitialContact === true) { score += 4; reasons.push("offers a private initial contact option"); }
      if (resource.outsideAgencyProvider === true) score += 3;
    }
    if (resource.verifiedDate) score += 1;
    return { resource, score, reasons: reasons.slice(0, 3) };
  }).filter(({ resource }) => !answers.state || !resource.state || resource.state === answers.state)
    .sort((a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name));
}
