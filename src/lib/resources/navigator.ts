import type { Resource } from "@/lib/content/resources";
import { NEED_PATHWAYS, PATHWAY_FOLLOW_UPS } from "@/lib/resources/need-pathways";

export const NAVIGATOR_SITUATIONS = [
  ...NEED_PATHWAYS.map((pathway) => ({
    id: pathway.id,
    label: pathway.prompt,
    needs: [...pathway.categoryFallbackIds],
  })),
] as const;

export type NavigatorAnswers = { audiences: string[]; situations: string[]; followUps: string[]; priorities: string[]; privacyConcern: "yes" | "maybe" | "no" | "skip"; locationMode: "state" | "national" | "virtual" | "local" | "any"; state?: string };

export function resourceKey(resource: Resource) { return resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export function rankResources(resources: Resource[], answers: NavigatorAnswers) {
  const selectedPathways = NEED_PATHWAYS.filter((pathway) => answers.situations.includes(pathway.id));
  const needs = new Set<string>(selectedPathways.flatMap((pathway) => [...pathway.categoryFallbackIds]));
  const requestedServiceTags = new Set(
    selectedPathways.flatMap((pathway) =>
      PATHWAY_FOLLOW_UPS[pathway.id].filter((option) => answers.followUps.includes(option.id)).flatMap((option) => option.serviceTags),
    ),
  );
  return resources.map((resource) => {
    let score = 0; const reasons: string[] = [];
    const explicitPathwayMatches = selectedPathways.filter((pathway) => resource.situationalTags?.includes(pathway.id)).length;
    if (explicitPathwayMatches) { score += explicitPathwayMatches * 30; reasons.push("is specifically tagged for the need you selected"); }
    const serviceMatches = resource.serviceTags?.filter((tag) => requestedServiceTags.has(tag)).length ?? 0;
    if (serviceMatches) { score += serviceMatches * 10; reasons.push("offers the kind of help you selected"); }
    const matches = resource.needCategoryIds.filter((id) => needs.has(id)).length;
    if (matches) { score += matches * 8; reasons.push("is in a related support category"); }
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
