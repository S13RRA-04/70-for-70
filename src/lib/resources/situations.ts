/**
 * The second navigation layer for the resource directory: what someone is
 * going through, not who they are or which program they want.
 *
 * A resource may carry any number of situational tags. Tagging is deliberate
 * and source-backed only — never inferred from a keyword match. The audit
 * script (`scripts/audit-resources.mjs`) suggests candidates; a human confirms
 * each one against the provider's own material.
 *
 * `categoryHints` keeps the navigator honest for situations that have thin
 * explicit coverage: when no resource is tagged yet, ranking can fall back to
 * the need categories that most often contain relevant help.
 */
export const SITUATIONAL_TAGS = [
  {
    id: "substance-use",
    label: "Substance use",
    prompt: "I'm drinking or using substances more than I want",
    description: "Alcohol, drugs, or medication misuse — for the person using and for family members.",
    categoryHints: ["mental-health", "purpose-community"],
    crisis: true,
  },
  {
    id: "tbi-chronic-pain",
    label: "TBI or chronic pain",
    prompt: "I'm living with a brain injury, chronic pain, or both",
    description: "Traumatic brain injury, concussion, chronic pain, and co-occurring conditions.",
    categoryHints: ["mental-health", "sports-fitness", "legal-benefits"],
  },
  {
    id: "caregiver-respite",
    label: "Caregiving or respite",
    prompt: "I care for someone and need support or a break",
    description: "Support for spouses, parents, and family members caring for a veteran or first responder.",
    categoryHints: ["family-support", "financial-assistance", "mental-health"],
  },
  {
    id: "emergency-basic-needs",
    label: "Food, bills, or housing emergency",
    prompt: "I'm short on food, money, or a safe place to stay",
    description: "Food, rent, utilities, eviction, and same-week housing crises.",
    categoryHints: ["financial-assistance", "housing-transportation"],
    crisis: true,
  },
  {
    id: "mst-abuse",
    label: "Military sexual trauma or abuse",
    prompt: "I'm dealing with sexual trauma or abuse",
    description: "Military sexual trauma, domestic violence, and other interpersonal abuse.",
    categoryHints: ["mental-health", "legal-benefits"],
    crisis: true,
  },
  {
    id: "suicide-loss-grief",
    label: "Suicide loss or grief",
    prompt: "I lost someone to suicide or I'm grieving",
    description: "Survivors of suicide loss and people navigating grief after a death.",
    categoryHints: ["mental-health", "family-support", "purpose-community"],
    crisis: true,
  },
  {
    id: "transition-moral-injury",
    label: "Transition or moral injury",
    prompt: "I'm struggling with transition, identity, or moral injury",
    description: "Leaving service, loss of mission, and the injury of acting against deeply held values.",
    categoryHints: ["purpose-community", "career-education", "mental-health"],
  },
  {
    id: "creative-expression",
    label: "Creative expression",
    prompt: "I heal through writing, art, or music",
    description: "Writing, visual art, music, and other creative practices used for recovery.",
    categoryHints: ["purpose-community", "mental-health"],
  },
  {
    id: "marriage-parenting",
    label: "Marriage or parenting",
    prompt: "My marriage or the way I parent is struggling",
    description: "Couples counseling, parenting support, and family relationship help.",
    categoryHints: ["family-support", "mental-health"],
  },
  {
    id: "justice-involved",
    label: "Justice involvement",
    prompt: "I'm in or coming out of the criminal justice system",
    description: "Veterans treatment courts, reentry, expungement, and incarceration support.",
    categoryHints: ["legal-benefits", "housing-transportation", "career-education"],
  },
  {
    id: "fr-occupational",
    label: "First-responder job stress",
    prompt: "The job itself is wearing me down",
    description: "Occupational trauma, burnout, critical incidents, and first-responder-specific care.",
    categoryHints: ["mental-health", "purpose-community"],
    crisis: true,
  },
  {
    id: "aging",
    label: "Aging or elder care",
    prompt: "I'm aging and need help staying independent",
    description: "Aging in place, long-term care, and support for older veterans and families.",
    categoryHints: ["housing-transportation", "family-support", "financial-assistance"],
  },
  {
    id: "women-veterans",
    label: "Women veterans",
    prompt: "I'm a woman veteran looking for services that fit",
    description: "Programs designed for or explicitly welcoming women veterans.",
    categoryHints: ["mental-health", "legal-benefits", "career-education"],
  },
  {
    id: "children-dependents",
    label: "Children or dependents",
    prompt: "My kids or dependents need support",
    description: "School support, child care, and services for children of veterans and first responders.",
    categoryHints: ["family-support", "financial-assistance", "career-education"],
  },
  {
    id: "rural-access",
    label: "Rural access",
    prompt: "I live far from the services I need",
    description: "Rural transportation, telehealth, and providers that travel or serve remote areas.",
    categoryHints: ["mental-health", "housing-transportation"],
  },
  {
    id: "benefits-complications",
    label: "Benefits denials or appeals",
    prompt: "I'm fighting a denial, appeal, or complicated claim",
    description: "VA claims, denials, appeals, and benefits problems that need an advocate.",
    categoryHints: ["legal-benefits"],
  },
  {
    id: "digital-safety",
    label: "Digital safety or fraud",
    prompt: "I'm dealing with identity theft, fraud, or online abuse",
    description: "Identity theft, scams, and privacy or online-safety problems.",
    categoryHints: ["legal-benefits", "financial-assistance"],
  },
] as const;

export type SituationalTagId = (typeof SITUATIONAL_TAGS)[number]["id"];
export type SituationalTag = (typeof SITUATIONAL_TAGS)[number];

const BY_ID = new Map<string, SituationalTag>(SITUATIONAL_TAGS.map((tag) => [tag.id, tag]));

export function getSituationalTag(id: string): SituationalTag | undefined {
  return BY_ID.get(id);
}

export function situationalTagLabel(id: string): string {
  return BY_ID.get(id)?.label ?? id;
}
