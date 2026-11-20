import "server-only";

import { slugifyResourceName, type Resource } from "@/lib/content/resources";
import { getResources } from "@/lib/data/resources";
import { FLAGSHIP_RESOURCE_NAMES } from "@/lib/resources/flagships";
import {
  AUDIENCE_IDS,
  AUDIENCE_TAG_MAP,
  CATEGORY_TO_NEED,
  NEED_IDS,
  PATHWAY_TO_NEED,
  type AudienceId,
  type DirectoryResource,
  type NeedId,
  type OrgTypeLabel,
} from "@/lib/resources/directory";

/**
 * Editorial "Start here" order — what someone sees with no filters set.
 * Crisis lines first, then one or two widely used programs per type of help.
 * Owned in code so changes are reviewed like any other content edit; names
 * must match `resource_records.name` exactly (unmatched names are ignored).
 * Everything not listed follows: other crisis lines, flagship programs,
 * nationwide, then state-specific; discount listings always sort last.
 */
export const START_HERE_ORDER = [
  "Veterans Crisis Line",
  "988 Suicide & Crisis Lifeline",
  "Responder Health (Safe Call Now)",
  "CopLine",
  "Crisis Text Line",
  "VA Vet Centers",
  "Military OneSource",
  "Give an Hour",
  "Cohen Veterans Network",
  "Vets4Warriors",
  "First Responder Support Network — WCPR",
  "NVFC Share the Load — First Responder Helpline",
  "Stop Soldier Suicide — ROGER",
  "SAMHSA National Helpline",
  "VA Substance Use Treatment",
  "Operation Homefront",
  "United Way 211",
  "National Coalition for Homeless Veterans (NCHV)",
  "Elizabeth Dole Foundation — Hidden Heroes",
  "VA Caregiver Support Program",
  "TAPS — Tragedy Assistance Program for Survivors",
  "Concerns of Police Survivors (C.O.P.S.)",
  "Disabled American Veterans (DAV) — VA Benefits Help",
  "National Veterans Legal Services Program (NVLSP)",
  "Hiring Our Heroes",
  "DoD Transition Assistance Program",
  "Mighty Oaks Foundation",
  "Boulder Crest Foundation — Warrior PATHH",
  "Team Red, White & Blue",
];

/** Commercial discount listings: kept, but never ranked ahead of support programs. Pending a content decision on removing them. */
const DISCOUNT_LISTING = /discount|^goruck$/i;

/** Values research used for "we couldn't confirm this" — never shown to visitors; the field is omitted instead. */
const PLACEHOLDER = /not stated|unknown|not listed|not specified|unclear|not confirmed|^n\/?a$|^tbd$/i;

const ADDICTION_TEXT = /\b(substance[- ]use|addiction|alcohol|sobriety|sober|detox|opioid|chemical dependency|smart recovery)\b/i;
const ADDICTION_SERVICE_TAGS = new Set(["peer-recovery", "detoxification", "medication-assisted-treatment", "family-addiction-support", "mutual-support"]);

/** Physical health and disability signals. Listings matching these gain the "health" need alongside their existing ones. */
const HEALTH_TEXT =
  /\b(tbi|traumatic brain injur\w*|brain injur\w*|chronic pain|pain management|prosthetic\w*|amputees?|amputation|limb loss|spinal cord|paralyz\w*|paralysis|wheelchairs?|adaptive equipment|mobility (?:device|equipment|aid)s?|hearing loss|deaf|hard of hearing|blind\w*|low vision|vision loss|visually impaired|service dogs?|dental|burn (?:survivor|injur)\w*|physical therapy|physical rehabilitation|polytrauma)\b/i;
const HEALTH_SERVICE_TAGS = new Set(["chronic-pain", "pain-management", "brain-injury", "cognitive-rehabilitation", "physical-rehabilitation", "whole-health"]);

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && !PLACEHOLDER.test(trimmed) ? trimmed : undefined;
}

export function isPublished(resource: Resource): boolean {
  return resource.verificationStatus !== "pending-review" && resource.verificationStatus !== "information-incomplete";
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function orgTypeLabel(resource: Resource): OrgTypeLabel | undefined {
  const host = hostOf(resource.url);
  if (host === "va.gov" || host.endsWith(".va.gov") || /^VA\b/.test(resource.name)) return "VA";
  if (resource.organizationType === "government" || host.endsWith(".gov") || host.endsWith(".mil")) return "Government";
  if (resource.organizationType === "nonprofit") return "Nonprofit";
  return undefined;
}

export function resourceNeeds(resource: Resource): NeedId[] {
  const needs: NeedId[] = [];
  const add = (id: NeedId | undefined) => {
    if (id && !needs.includes(id)) needs.push(id);
  };
  for (const category of resource.needCategoryIds) add(CATEGORY_TO_NEED[category]);
  for (const tag of resource.situationalTags ?? []) add(PATHWAY_TO_NEED[tag]);
  if (
    resource.situationalTags?.includes("addiction-recovery") ||
    resource.serviceTags?.some((tag) => ADDICTION_SERVICE_TAGS.has(tag)) ||
    ADDICTION_TEXT.test(`${resource.name} ${resource.description}`)
  ) {
    add("addiction");
  }
  if (resource.serviceTags?.some((tag) => HEALTH_SERVICE_TAGS.has(tag)) || HEALTH_TEXT.test(`${resource.name} ${resource.description}`)) {
    add("health");
  }
  return needs.length ? needs : ["mental"];
}

export function resourceAudiences(resource: Resource): AudienceId[] {
  const set = new Set(resource.audienceTags.flatMap((tag) => AUDIENCE_TAG_MAP[tag] ?? []));
  return AUDIENCE_IDS.filter((id) => set.has(id));
}

export function isFreeResource(resource: Resource): boolean {
  const cost = resource.cost.trim();
  return /^(free|no[- ]cost|\$0)/i.test(cost) || /\bat no cost\b|\bno cost to\b|\bfree of charge\b/i.test(cost);
}

/** One sentence, ≤ 160 chars, cut on a word boundary if it has to be. */
export function shortSummary(description: string): string {
  const text = description.replace(/\s+/g, " ").trim();
  const firstSentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
  if (firstSentence.length <= 160) return firstSentence;
  return `${firstSentence.slice(0, 157).replace(/\s+\S*$/, "").replace(/[,;:—–-]$/, "")}…`;
}

export function coverageLabel(resource: Resource): string {
  const scope = clean(resource.geographicScope);
  let label = scope ?? (resource.state ? resource.state : "Nationwide");
  if (resource.state && scope && !scope.toLowerCase().includes(resource.state.toLowerCase())) label = `${resource.state} · ${scope}`;
  if (resource.hours && /24\s*\/\s*7|24 hours/i.test(resource.hours) && !/24\s*\/\s*7/.test(label)) label += " · 24/7";
  return label;
}

export function startLabel(resource: Resource): string | undefined {
  if (resource.phone && resource.text) return `Call ${resource.phone} or text ${resource.text}`;
  if (resource.phone) return `Call ${resource.phone}`;
  if (resource.text) return `Text ${resource.text}`;
  if (resource.applicationRequired) return "Apply on their website";
  if (resource.selfReferral) return "Contact them directly — no referral needed";
  return undefined;
}

function rankTier(resource: Resource): number {
  if (DISCOUNT_LISTING.test(resource.name)) return 9;
  const curated = START_HERE_ORDER.indexOf(resource.name);
  if (curated >= 0) return 0;
  if (!resource.state && resource.crisisResource) return 1;
  if (!resource.state && FLAGSHIP_RESOURCE_NAMES.has(resource.name)) return 2;
  if (!resource.state) return 3;
  if (resource.crisisResource) return 4;
  return 5;
}

function toDirectoryResource(resource: Resource, rank: number): DirectoryResource {
  const summary = shortSummary(resource.description);
  const coverage = coverageLabel(resource);
  return {
    id: slugifyResourceName(resource.name),
    name: resource.name,
    orgType: orgTypeLabel(resource),
    summary,
    needs: resourceNeeds(resource),
    audiences: resourceAudiences(resource),
    isFree: isFreeResource(resource),
    costLabel: clean(resource.cost),
    coverageLabel: coverage,
    startLabel: startLabel(resource),
    url: resource.url,
    rank,
    state: resource.state,
    searchText: `${resource.name} ${resource.description} ${coverage} ${resource.audienceTags.join(" ")}`.toLowerCase(),
  };
}

function rankOrder(resources: Resource[]): Resource[] {
  return resources
    .map((resource) => ({
      resource,
      tier: rankTier(resource),
      curated: START_HERE_ORDER.indexOf(resource.name),
      need: NEED_IDS.indexOf(resourceNeeds(resource)[0]),
    }))
    .sort((a, b) => a.tier - b.tier || a.curated - b.curated || a.need - b.need || a.resource.name.localeCompare(b.resource.name))
    .map(({ resource }) => resource);
}

export interface PublishedDirectory {
  /** Ranked raw records — server-only, for detail pages. */
  resources: Resource[];
  /** Ranked public DTOs, same order — safe to pass to the client. */
  items: DirectoryResource[];
}

/** Published listings only, ranked, deduplicated by slug. */
export async function getPublishedDirectory(): Promise<PublishedDirectory> {
  const seen = new Set<string>();
  const published = rankOrder((await getResources()).filter(isPublished)).filter((resource) => {
    const id = slugifyResourceName(resource.name);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return { resources: published, items: published.map((resource, index) => toDirectoryResource(resource, index + 1)) };
}
