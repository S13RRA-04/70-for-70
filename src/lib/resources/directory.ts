/**
 * Resource directory taxonomy, public DTO, and filter logic.
 *
 * Single source of truth for the /resources tiles, sidebar checkboxes,
 * search synonyms, facet counts, and URL state. Client-safe: it must never
 * value-import `@/lib/content/resources` (that file is ~24k lines of seed
 * data) — the server builds `DirectoryResource`s in
 * `src/lib/data/resource-directory.ts` and only the lean DTO crosses into
 * the client bundle.
 *
 * The site's older taxonomy (10 `NEED_CATEGORIES`, 12 `NEED_PATHWAYS`
 * situations, free-text audience tags) collapses into the 8 needs and 8
 * audiences below. The mapping lives here so legacy deep links
 * (`?need=mental-health`, `?audience=Veteran`, `?pathway=grief-bereavement`)
 * keep landing on the right results.
 */
import { NEED_PATHWAYS } from "@/lib/resources/need-pathways";

export const NEED_IDS = ["mental", "addiction", "health", "financial", "housing", "family", "career", "legal", "fitness", "aging", "children", "access", "safety"] as const;
export type NeedId = (typeof NEED_IDS)[number];

export const AUDIENCE_IDS = ["veteran", "military", "le", "fire", "ems", "dispatch", "corrections", "family"] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];
export const FIRST_RESPONDER_IDS: AudienceId[] = ["le", "fire", "ems", "dispatch", "corrections"];

export type OrgTypeLabel = "VA" | "Government" | "Nonprofit";

/** Public DTO — the only resource shape the directory client ever receives. Unknown values are omitted, never sent as placeholder text. */
export interface DirectoryResource {
  /** Stable slug; also the /resources/:id path segment. */
  id: string;
  name: string;
  orgType?: OrgTypeLabel;
  /** ≤ 160 chars, one sentence. */
  summary: string;
  /** First entry is the primary need, shown as the card tag. */
  needs: NeedId[];
  audiences: AudienceId[];
  isFree: boolean;
  costLabel?: string;
  coverageLabel: string;
  startLabel?: string;
  url: string;
  /** Editorial "Start here" order — lower is earlier. */
  rank: number;
  /** Full state name for state-specific listings; absent means nationwide. */
  state?: string;
  /** Lowercased search text (name, summary, coverage) — synonyms are added client-side from the taxonomy. */
  searchText: string;
}

/** Hand-authored synonyms per need. Situation phrases from NEED_PATHWAYS are merged in below via PATHWAY_TO_NEED. */
const BASE_NEEDS: { id: NeedId; label: string; synonyms: string[] }[] = [
  { id: "mental", label: "Mental health", synonyms: ["ptsd", "depression", "anxiety", "counseling", "therapy", "crisis", "suicide", "grief", "moral injury", "peer support", "purpose", "community"] },
  { id: "addiction", label: "Addiction & recovery", synonyms: ["alcohol", "substance", "sobriety", "drinking", "recovery", "detox"] },
  { id: "health", label: "Health & disability", synonyms: ["tbi", "brain injury", "chronic pain", "prosthetic", "amputee", "adaptive equipment", "wheelchair", "mobility", "hearing loss", "blind", "low vision", "service dog", "dental", "spinal cord", "burn", "physical therapy", "rehabilitation", "disability"] },
  { id: "financial", label: "Financial help", synonyms: ["rent", "bills", "emergency", "grant", "money", "equipment"] },
  { id: "housing", label: "Housing", synonyms: ["homeless", "rent", "shelter", "eviction", "transportation"] },
  { id: "family", label: "Family & caregivers", synonyms: ["caregiver", "spouse", "marriage", "parenting", "children", "respite", "survivor", "gold star"] },
  { id: "career", label: "Career & education", synonyms: ["job", "resume", "school", "transition", "scholarship", "employment"] },
  { id: "legal", label: "Legal & benefits", synonyms: ["lawyer", "va claim", "disability claim", "discharge", "reentry", "benefits"] },
  { id: "fitness", label: "Fitness & outdoors", synonyms: ["sports", "running", "adaptive", "outdoor", "hunting", "fishing", "cycling"] },
  { id: "aging", label: "Aging & long-term care", synonyms: ["older veteran", "elder care", "home health", "nursing home", "aid and attendance", "housebound"] },
  { id: "children", label: "Children & dependents", synonyms: ["military child", "child care", "daycare", "tutoring", "school", "dependent"] },
  { id: "access", label: "Rural & transportation access", synonyms: ["rural", "transportation", "travel reimbursement", "mileage", "telehealth", "remote care"] },
  { id: "safety", label: "Fraud & digital safety", synonyms: ["fraud", "scam", "identity theft", "phishing", "online safety"] },
];

/** Legacy `NEED_PATHWAYS` situation → need. Also used to fold each situation's search phrases into that need's synonyms. */
export const PATHWAY_TO_NEED: Record<string, NeedId> = {
  "chronic-pain-tbi": "health",
  "creative-connection": "mental",
  "grief-bereavement": "mental",
  "emergency-basic-needs": "financial",
  "caregiver-support": "family",
  "addiction-recovery": "addiction",
  "mst-abuse": "mental",
  "transition-moral-injury": "career",
  "justice-involved": "legal",
  "fr-occupational": "mental",
  "women-veterans": "legal",
  "marriage-parenting": "family",
  aging: "aging",
  "children-dependents": "children",
  "rural-access": "access",
  "benefits-complications": "legal",
  "digital-safety": "safety",
};

export const NEEDS: { id: NeedId; label: string; synonyms: string[] }[] = BASE_NEEDS.map((need) => ({
  ...need,
  synonyms: Array.from(
    new Set([
      ...need.synonyms,
      ...NEED_PATHWAYS.filter((pathway) => PATHWAY_TO_NEED[pathway.id] === need.id).flatMap((pathway) => pathway.searchPhrases),
    ]),
  ),
}));

export const AUDIENCES: { id: AudienceId; label: string }[] = [
  { id: "veteran", label: "Veteran" },
  { id: "military", label: "Active military" },
  { id: "le", label: "Law enforcement" },
  { id: "fire", label: "Fire" },
  { id: "ems", label: "EMS" },
  { id: "dispatch", label: "Dispatch" },
  { id: "corrections", label: "Corrections" },
  { id: "family", label: "Family member" },
];

export const NEED_BY_ID = Object.fromEntries(NEEDS.map((n) => [n.id, n])) as Record<NeedId, (typeof NEEDS)[number]>;
export const AUDIENCE_BY_ID = Object.fromEntries(AUDIENCES.map((a) => [a.id, a])) as Record<AudienceId, (typeof AUDIENCES)[number]>;

/** Legacy `NEED_CATEGORIES` id → need. */
export const CATEGORY_TO_NEED: Record<string, NeedId> = {
  "mental-health": "mental",
  "purpose-community": "mental",
  "sports-fitness": "fitness",
  "outdoor-programs": "fitness",
  "equipment-grants": "financial",
  "financial-assistance": "financial",
  "housing-transportation": "housing",
  "family-support": "family",
  "career-education": "career",
  "legal-benefits": "legal",
  "health-disability": "health",
};

/** Resource `audienceTags` value → audience ids. Tags not listed (Disabled, Healthcare, Coworker…) don't map to a chip. */
export const AUDIENCE_TAG_MAP: Record<string, AudienceId[]> = {
  Veteran: ["veteran"],
  "Active Military": ["military"],
  "Guard/Reserve": ["military"],
  "National Guard / Reserve": ["military"],
  "Law Enforcement": ["le"],
  Fire: ["fire"],
  EMS: ["ems"],
  Dispatch: ["dispatch"],
  Corrections: ["corrections"],
  "First Responder": FIRST_RESPONDER_IDS,
  Family: ["family"],
  "Military Spouse": ["family"],
  Caregiver: ["family"],
  "Gold Star": ["family"],
  Survivor: ["family"],
};

export const CRISIS_TERMS = ["crisis", "suicid", "ptsd", "depress", "talk to someone", "hopeless", "kill myself", "end it"];

/* ---------------------------------------------------------------------------
 * Location: state names/codes and ZIP → state, resolved locally (no network,
 * nothing logged). ZIP3 prefixes are the USPS sectional-center ranges; a few
 * prefixes that straddle a border resolve to the majority state.
 * ------------------------------------------------------------------------- */

const STATE_CODES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};
export const STATE_NAMES = Object.values(STATE_CODES);

const ZIP3_RANGES: [from: number, to: number, code: string][] = [
  [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"], [39, 49, "ME"], [50, 59, "VT"], [60, 69, "CT"], [70, 89, "NJ"],
  [100, 149, "NY"], [5, 5, "NY"], [150, 196, "PA"], [197, 199, "DE"], [200, 200, "DC"], [201, 201, "VA"],
  [202, 205, "DC"], [206, 219, "MD"], [220, 246, "VA"], [247, 268, "WV"], [270, 289, "NC"], [290, 299, "SC"],
  [300, 319, "GA"], [398, 399, "GA"], [320, 339, "FL"], [341, 349, "FL"], [350, 369, "AL"], [370, 385, "TN"],
  [386, 397, "MS"], [400, 427, "KY"], [430, 459, "OH"], [460, 479, "IN"], [480, 499, "MI"], [500, 528, "IA"],
  [530, 549, "WI"], [550, 567, "MN"], [569, 569, "DC"], [570, 577, "SD"], [580, 588, "ND"], [590, 599, "MT"],
  [600, 629, "IL"], [630, 658, "MO"], [660, 679, "KS"], [680, 693, "NE"], [700, 714, "LA"], [716, 729, "AR"],
  [730, 732, "OK"], [734, 749, "OK"], [733, 733, "TX"], [750, 799, "TX"], [885, 885, "TX"], [800, 816, "CO"],
  [820, 831, "WY"], [832, 838, "ID"], [840, 847, "UT"], [850, 865, "AZ"], [870, 884, "NM"], [889, 898, "NV"],
  [900, 961, "CA"], [967, 968, "HI"], [970, 979, "OR"], [980, 994, "WA"], [995, 999, "AK"],
];

/** "35203", "AL", "alabama" → "Alabama". Returns null for anything unrecognized (including military/territory ZIPs). */
export function resolveStateInput(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^\d{5}$/.test(value)) {
    const prefix = Number(value.slice(0, 3));
    const hit = ZIP3_RANGES.find(([from, to]) => prefix >= from && prefix <= to);
    return hit ? STATE_CODES[hit[2]] : null;
  }
  const upper = value.toUpperCase();
  if (STATE_CODES[upper]) return STATE_CODES[upper];
  return STATE_NAMES.find((name) => name.toLowerCase() === value.toLowerCase()) ?? null;
}

/* ---------------------------------------------------------------------------
 * URL state: ?who=&need=a,b&q=&free=1&sort=az&state=Alabama
 * ------------------------------------------------------------------------- */

export type DirectorySort = "rec" | "az";
export interface DirectoryState {
  who: AudienceId | "all";
  needs: NeedId[];
  q: string;
  freeOnly: boolean;
  sort: DirectorySort;
  state: string | null;
}

export const EMPTY_DIRECTORY_STATE: DirectoryState = { who: "all", needs: [], q: "", freeOnly: false, sort: "rec", state: null };
export const MAX_QUERY_LENGTH = 100;

type ParamReader = { get(name: string): string | null };

function isNeedId(value: string): value is NeedId {
  return (NEED_IDS as readonly string[]).includes(value);
}
function isAudienceId(value: string): value is AudienceId {
  return (AUDIENCE_IDS as readonly string[]).includes(value);
}

/** Reads URL params, dropping invalid values. Accepts the legacy `audience`, `pathway`, and old category-id `need` params. */
export function parseDirectoryState(params: ParamReader): DirectoryState {
  const needs = new Set<NeedId>();
  for (const raw of (params.get("need") ?? "").split(",")) {
    const id = raw.trim();
    if (isNeedId(id)) needs.add(id);
    else if (CATEGORY_TO_NEED[id]) needs.add(CATEGORY_TO_NEED[id]);
  }
  const pathway = params.get("pathway");
  if (pathway && PATHWAY_TO_NEED[pathway]) needs.add(PATHWAY_TO_NEED[pathway]);

  const whoRaw = params.get("who") ?? "";
  const legacyAudience = AUDIENCE_TAG_MAP[params.get("audience") ?? ""];
  const who: DirectoryState["who"] = isAudienceId(whoRaw)
    ? whoRaw
    : legacyAudience && legacyAudience.length === 1
      ? legacyAudience[0]
      : "all";

  const stateParam = params.get("state");
  return {
    who,
    needs: Array.from(needs),
    q: (params.get("q") ?? "").slice(0, MAX_QUERY_LENGTH),
    freeOnly: params.get("free") === "1",
    sort: params.get("sort") === "az" ? "az" : "rec",
    state: stateParam ? resolveStateInput(stateParam) : null,
  };
}

export function serializeDirectoryState(state: DirectoryState): string {
  const params = new URLSearchParams();
  if (state.who !== "all") params.set("who", state.who);
  if (state.needs.length) params.set("need", state.needs.join(","));
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.freeOnly) params.set("free", "1");
  if (state.sort !== "rec") params.set("sort", state.sort);
  if (state.state) params.set("state", state.state);
  return params.toString();
}

/* ---------------------------------------------------------------------------
 * Filtering. Audience AND needs(OR) AND free AND query AND location.
 * ------------------------------------------------------------------------- */

/** Filler words dropped from queries so "rent help" or "help with PTSD" still match. */
const STOPWORDS = new Set(["a", "an", "and", "the", "for", "to", "of", "my", "me", "i", "im", "with", "help", "need", "in", "on", "or"]);

function queryTerms(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .split(/[^a-z0-9/&-]+/)
    .filter((term) => term.length > 1 && !STOPWORDS.has(term));
}

const synonymTextCache = new Map<NeedId, string>();
function needText(id: NeedId): string {
  let text = synonymTextCache.get(id);
  if (!text) {
    const need = NEED_BY_ID[id];
    text = `${need.label} ${need.synonyms.join(" ")}`.toLowerCase();
    synonymTextCache.set(id, text);
  }
  return text;
}

/** 0 = no match; 3 = name match; 2 = summary/coverage match; 1 = taxonomy-synonym-only match. Used both to filter and to order query results. */
export function queryScore(resource: DirectoryResource, q: string): number {
  const terms = queryTerms(q);
  if (!terms.length) return q.trim() ? 0 : 1;
  const name = resource.name.toLowerCase();
  const full = `${resource.searchText} ${resource.needs.map(needText).join(" ")}`;
  if (!terms.every((term) => full.includes(term))) return 0;
  if (terms.every((term) => name.includes(term))) return 3;
  if (terms.every((term) => resource.searchText.includes(term))) return 2;
  return 1;
}

export function matchesDirectory(resource: DirectoryResource, state: DirectoryState, { ignoreNeeds = false } = {}): boolean {
  if (state.who !== "all" && !resource.audiences.includes(state.who)) return false;
  if (state.freeOnly && !resource.isFree) return false;
  if (!ignoreNeeds && state.needs.length && !resource.needs.some((need) => state.needs.includes(need))) return false;
  const hasQuery = state.q.trim().length > 0;
  // Nationwide programs always show. State-specific ones show for the chosen
  // state — or, with no location set, only when someone searched for them
  // (so "Start here" isn't flooded with one state's listings, but a search
  // by program name still finds a local program).
  if (resource.state && state.state && resource.state !== state.state) return false;
  if (!hasQuery) return !resource.state || Boolean(state.state);
  const score = queryScore(resource, state.q);
  // Without a location, a local program only shows when its own name matches.
  return resource.state && !state.state ? score === 3 : score > 0;
}

export function filterDirectory(resources: DirectoryResource[], state: DirectoryState): DirectoryResource[] {
  const list = resources.filter((resource) => matchesDirectory(resource, state));
  if (state.sort === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
  if (!state.q.trim()) return list.sort((a, b) => a.rank - b.rank);
  const scores = new Map(list.map((resource) => [resource.id, queryScore(resource, state.q)]));
  // Out-of-area local name matches go after every nationwide match.
  const outOfArea = (r: DirectoryResource) => (r.state && !state.state ? 1 : 0);
  return list.sort((a, b) => outOfArea(a) - outOfArea(b) || scores.get(b.id)! - scores.get(a.id)! || a.rank - b.rank);
}

/** Need facet counts: every active filter applied except the needs filter itself, so a selection never dead-ends. */
export function needFacetCounts(resources: DirectoryResource[], state: DirectoryState): Record<NeedId, number> {
  const counts = Object.fromEntries(NEED_IDS.map((id) => [id, 0])) as Record<NeedId, number>;
  for (const resource of resources) {
    if (!matchesDirectory(resource, state, { ignoreNeeds: true })) continue;
    for (const need of resource.needs) counts[need] += 1;
  }
  return counts;
}

export function showsCrisisCard(state: DirectoryState): boolean {
  const q = state.q.toLowerCase();
  return state.needs.includes("mental") || state.needs.includes("addiction") || CRISIS_TERMS.some((term) => q.includes(term));
}

/** "Veteran, Active military, First responders, Family member" — collapses the five first-responder ids into one label. */
export function audienceText(audiences: AudienceId[]): string {
  const allFirstResponders = FIRST_RESPONDER_IDS.every((id) => audiences.includes(id));
  const ids = allFirstResponders ? audiences.filter((id) => !FIRST_RESPONDER_IDS.includes(id)) : audiences;
  const labels = ids.map((id) => AUDIENCE_BY_ID[id].label);
  if (allFirstResponders) labels.splice(ids.filter((id) => id === "veteran" || id === "military").length, 0, "First responders");
  return labels.join(", ");
}

/** sessionStorage key holding the last /resources URL (with query) so a detail page's "Back to results" returns to it. */
export const LAST_RESULTS_KEY = "ft22:resources:last-results";
