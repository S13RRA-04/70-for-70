import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import type { Resource } from "../src/lib/content/resources";

const require = createRequire(import.meta.url);
const { RESOURCES } = require("../src/lib/content/resources.ts") as typeof import("../src/lib/content/resources");
const { VERIFIED_PATHWAY_RESOURCES } = require("../src/lib/resources/verified-pathway-resources.ts") as typeof import("../src/lib/resources/verified-pathway-resources");
const { VERIFIED_EXPANSION_RESOURCES } = require("../src/lib/resources/verified-expansion-resources.ts") as typeof import("../src/lib/resources/verified-expansion-resources");
const { VERIFIED_GAP_RESOURCES } = require("../src/lib/resources/verified-gap-resources.ts") as typeof import("../src/lib/resources/verified-gap-resources");

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supabaseCli = resolve(projectRoot, "node_modules/supabase/dist/supabase.js");
const RETIRED_RESOURCE_KEYS = new Set([
  "operation-code",
  "rallypoint",
  "the-mission-continues",
  "us-military-endurance-sports-usmes",
]);

function resourceKey(resource: Pick<Resource, "name">): string {
  return resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Later, more deeply verified sources enrich matching bundled records.
const resourcesByKey = new Map<string, Resource>();
for (const resource of [...RESOURCES, ...VERIFIED_EXPANSION_RESOURCES, ...VERIFIED_PATHWAY_RESOURCES, ...VERIFIED_GAP_RESOURCES]) {
  const key = resourceKey(resource);
  resourcesByKey.set(key, { ...(resourcesByKey.get(key) ?? {}), ...resource } as Resource);
}

const allRows = [...resourcesByKey.entries()].map(([key, resource]) => ({
  resource_key: key,
  name: resource.name,
  url: resource.url,
  description: resource.description,
  organization_type: resource.organizationType ?? null,
  verification_status: resource.verificationStatus ?? (resource.verifiedDate ? "reviewed" : "pending-review"),
  why_included: resource.whyIncluded ?? null,
  need_category_ids: resource.needCategoryIds,
  audience_tags: resource.audienceTags,
  situational_tags: resource.situationalTags ?? [],
  service_tags: resource.serviceTags ?? [],
  service_type: resource.serviceType ?? null,
  delivery_methods: resource.deliveryMethods ?? [],
  application_status: resource.applicationStatus ?? "unknown",
  review_due: resource.reviewDue ?? null,
  verification_url: resource.verificationUrl ?? null,
  cost: resource.cost,
  geographic_scope: resource.geographicScope,
  state: resource.state ?? null,
  crisis_resource: resource.crisisResource ?? false,
  crisis_audience: resource.crisisAudience ?? null,
  phone: resource.phone ?? null,
  text_contact: resource.text ?? null,
  hours: resource.hours ?? null,
  veteran_led: resource.veteranLed ?? null,
  first_responder_led: resource.firstResponderLed ?? null,
  faith_based: resource.faithBased ?? null,
  faith_affiliation_source: resource.faithAffiliationSource ?? null,
  peer_led: resource.peerLed ?? null,
  virtual_available: resource.virtualAvailable ?? null,
  in_person_available: resource.inPersonAvailable ?? null,
  self_referral: resource.selfReferral ?? null,
  employer_involvement_required: resource.employerInvolvementRequired ?? null,
  anonymous_initial_contact: resource.anonymousInitialContact ?? null,
  outside_agency_provider: resource.outsideAgencyProvider ?? null,
  insurance_required: resource.insuranceRequired ?? null,
  referral_required: resource.referralRequired ?? null,
  application_required: resource.applicationRequired ?? null,
  documentation_required: resource.documentationRequired ?? null,
  confidentiality_policy_url: resource.confidentialityPolicyUrl ?? null,
  eligibility: resource.eligibility ?? null,
  availability: resource.availability ?? null,
  last_verified_at: resource.verifiedDate ?? null,
  verification_source: resource.verificationUrl ?? null,
  is_active: !RETIRED_RESOURCE_KEYS.has(key),
}));

// --only=gap syncs just the records in verified-gap-resources.ts, leaving every
// other row (including fixes applied directly in the database) untouched.
const onlyArgument = process.argv.find((argument) => argument.startsWith("--only="))?.slice("--only=".length);
if (onlyArgument && onlyArgument !== "gap") throw new Error("--only supports: gap");
const onlyKeys = onlyArgument === "gap" ? new Set(VERIFIED_GAP_RESOURCES.map(resourceKey)) : null;
const rows = onlyKeys ? allRows.filter((row) => onlyKeys.has(row.resource_key)) : allRows;
const dryRun = process.argv.includes("--dry-run");

const columns = Object.keys(rows[0]);
const assignments = columns
  .filter((column) => column !== "resource_key")
  .map((column) => {
    if (column === "verification_status") {
      return `${column} = case
        when excluded.${column} = 'pending-review' and resource_records.${column} <> 'pending-review'
          then resource_records.${column}
        else excluded.${column}
      end`;
    }
    if (column === "last_verified_at" || column === "verification_source") {
      return `${column} = coalesce(excluded.${column}, resource_records.${column})`;
    }
    if (column === "is_active") {
      return `${column} = resource_records.${column} and excluded.${column}`;
    }
    return `${column} = excluded.${column}`;
  })
  .concat("updated_at = now()")
  .join(",\n      ");

function buildSql(batch: typeof rows): string {
  const payload = JSON.stringify(batch);
  if (payload.includes("$resource_json$")) throw new Error("Resource payload contains the SQL delimiter.");

  return `
begin;
with source as (
  select *
  from jsonb_populate_recordset(
    null::public.resource_records,
    $resource_json$${payload}$resource_json$::jsonb
  )
)
insert into public.resource_records (${columns.join(", ")}, updated_at)
select ${columns.join(", ")}, now()
from source
on conflict (resource_key) do update set
      ${assignments};
commit;
`;
}

if (dryRun) {
  console.log(`Dry run: would sync ${rows.length} resources.`);
  for (const row of rows) console.log(`  ${row.resource_key}${row.state ? ` (${row.state})` : ""}`);
  process.exit(0);
}

const sqlPath = resolve(tmpdir(), `forthe22-resource-sync-${process.pid}.sql`);
try {
  const batchSize = 100;
  const offsetArgument = process.argv.find((argument) => argument.startsWith("--offset="));
  const startingOffset = offsetArgument ? Number(offsetArgument.slice("--offset=".length)) : 0;
  if (!Number.isInteger(startingOffset) || startingOffset < 0 || startingOffset > rows.length) {
    throw new Error("--offset must be an integer within the resource row range.");
  }

  for (let offset = startingOffset; offset < rows.length; offset += batchSize) {
    const batch = rows.slice(offset, offset + batchSize);
    writeFileSync(sqlPath, buildSql(batch), "utf8");
    execFileSync(process.execPath, [supabaseCli, "db", "query", "--linked", "--file", sqlPath], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    console.log(`Synced ${Math.min(offset + batch.length, rows.length)} of ${rows.length} resources.`);
  }
} finally {
  rmSync(sqlPath, { force: true });
}

console.log(`Synced ${rows.length} unique resources to resource_records.`);
