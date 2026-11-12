#!/usr/bin/env node
/**
 * Record-level coverage audit for the resource directory.
 *
 * This reports, it does not edit. "Explicit" counts come from a resource's
 * `situationalTags`; "keyword candidates" are a broad pre-filter meant to
 * shorten human review, never a basis for tagging on their own.
 *
 * Usage:
 *   node scripts/audit-resources.mjs
 *   node scripts/audit-resources.mjs --situation=substance-use
 *   node scripts/audit-resources.mjs --state=Utah
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "src/lib/content/resources.ts"), "utf8");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const KEYWORDS = {
  "substance-use": /\b(substance|alcohol|alcoholi|addiction|recovery|sobriety|opioid|drug|detox|treatment court)\b/i,
  "tbi-chronic-pain": /\b(traumatic brain|\bTBI\b|concussion|chronic pain|pain management)\b/i,
  "caregiver-respite": /\b(caregiver|respite)\b/i,
  "emergency-basic-needs": /\b(food pantry|food bank|\brent\b|eviction|utilit(y|ies)|emergency financial|homeless|basic needs)\b/i,
  "mst-abuse": /\b(sexual trauma|sexual assault|domestic violence|intimate partner|abuse)\b/i,
  "suicide-loss-grief": /\b(suicide loss|survivor of suicide|grief|bereave)\b/i,
  "transition-moral-injury": /\b(moral injury|transition|reintegration)\b/i,
  "creative-expression": /\b(writing|writer|art therapy|music|creative|photograph)\b/i,
  "marriage-parenting": /\b(marriage|couple|parenting|relationship)\b/i,
  "justice-involved": /\b(justice|reentry|re-entry|incarcerat|expungement|treatment court)\b/i,
  "fr-occupational": /\b(first responder|firefighter|law enforcement|critical incident|burnout)\b/i,
  aging: /\b(aging|elder|senior|long-term care|nursing home)\b/i,
  "women-veterans": /\b(women veteran|female veteran|women's)\b/i,
  "children-dependents": /\b(child|children|youth|teen|dependent|school)\b/i,
  "rural-access": /\b(rural|remote|telehealth|transportation)\b/i,
  "benefits-complications": /\b(appeal|denial|denied|claims? assistance|benefits help)\b/i,
  "digital-safety": /\b(identity theft|fraud|scam|privacy|online safety)\b/i,
};

const LABELS = {
  "substance-use": "Substance use",
  "tbi-chronic-pain": "TBI / chronic pain",
  "caregiver-respite": "Caregiving / respite",
  "emergency-basic-needs": "Emergency basic needs",
  "mst-abuse": "MST / abuse",
  "suicide-loss-grief": "Suicide loss / grief",
  "transition-moral-injury": "Transition / moral injury",
  "creative-expression": "Creative expression",
  "marriage-parenting": "Marriage / parenting",
  "justice-involved": "Justice involvement",
  "fr-occupational": "First-responder job stress",
  aging: "Aging / elder care",
  "women-veterans": "Women veterans",
  "children-dependents": "Children / dependents",
  "rural-access": "Rural access",
  "benefits-complications": "Benefits denials / appeals",
  "digital-safety": "Digital safety / fraud",
};

const blocks = [...source.matchAll(/^  \{\r?\n([\s\S]*?)^  \},$/gm)].map((match) => match[1]);

function valueOf(block, field) {
  const match = block.match(new RegExp(`^\\s*${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m"));
  return match ? match[1] : undefined;
}

function arrayOf(block, field) {
  const match = block.match(new RegExp(`^\\s*${field}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (!match) return [];
  return [...match[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((item) => item[1]);
}

const entries = blocks.map((block) => ({
  name: valueOf(block, "name") ?? "(unnamed)",
  state: valueOf(block, "state") ?? null,
  scope: valueOf(block, "geographicScope") ?? "",
  description: valueOf(block, "description") ?? "",
  needs: arrayOf(block, "needCategoryIds"),
  audiences: arrayOf(block, "audienceTags"),
  situations: arrayOf(block, "situationalTags"),
  block,
})).filter((entry) => entry.name !== "(unnamed)");

const detail = args.get("situation");
const stateFilter = args.get("state");
const situationalIds = Object.keys(KEYWORDS);

console.log(`Parsed ${entries.length} resource entries.`);

function candidateMatches(entry, id) {
  return KEYWORDS[id].test(`${entry.name}\n${entry.description}`) || entry.needs.some((need) => KEYWORDS[id].test(need));
}

if (!detail) {
  console.log("\nExplicit situation coverage:");
  for (const id of situationalIds) {
    const explicit = entries.filter((entry) => entry.situations.includes(id));
    const candidates = entries.filter((entry) => !entry.situations.includes(id) && candidateMatches(entry, id));
    const states = new Set(explicit.map((entry) => entry.state).filter(Boolean));
    console.log(
      `  ${LABELS[id].padEnd(28)} ${String(explicit.length).padStart(4)} tagged` +
        `  ${String(states.size).padStart(2)} states` +
        `  ${String(candidates.length).padStart(4)} keyword candidates`,
    );
  }
} else {
  const label = LABELS[detail] ?? detail;
  const explicit = entries.filter((entry) => entry.situations.includes(detail));
  const candidates = entries.filter((entry) => !entry.situations.includes(detail) && candidateMatches(entry, detail));
  console.log(`\n${label}: ${explicit.length} explicitly tagged, ${candidates.length} keyword candidates.`);
  console.log("\nTagged:");
  for (const entry of explicit.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`  ${entry.state ?? "National"} | ${entry.name} | ${entry.scope}`);
  }
  console.log("\nKeyword candidates (review each against the provider's own site):");
  for (const entry of candidates.sort((a, b) => (a.state ?? "").localeCompare(b.state ?? "") || a.name.localeCompare(b.name))) {
    console.log(`  ${entry.state ?? "National"} | ${entry.name}`);
  }
}

if (stateFilter) {
  const stateEntries = entries.filter((entry) => entry.state === stateFilter);
  console.log(`\n${stateFilter}: ${stateEntries.length} entries.`);
  for (const id of situationalIds) {
    const count = stateEntries.filter((entry) => entry.situations.includes(id)).length;
    if (count > 0) console.log(`  ${LABELS[id].padEnd(28)} ${count}`);
  }
}

const untagged = entries.filter((entry) => entry.situations.length === 0).length;
console.log(`\nUntagged entries: ${untagged} of ${entries.length}.`);
