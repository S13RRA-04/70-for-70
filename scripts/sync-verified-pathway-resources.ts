import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { VERIFIED_PATHWAY_RESOURCES } = require("../src/lib/resources/verified-pathway-resources.ts") as typeof import("../src/lib/resources/verified-pathway-resources");
const { NEED_PATHWAY_TAGS } = require("../src/lib/resources/flagships.ts") as typeof import("../src/lib/resources/flagships");
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supabaseCli = resolve(projectRoot, "node_modules/supabase/dist/supabase.js");

function resourceKey(resource: { name: string }): string {
  return resource.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

for (const resource of VERIFIED_PATHWAY_RESOURCES) {
  const payload = JSON.stringify({
    resource_key: resourceKey(resource),
    name: resource.name,
    url: resource.url,
    description: resource.description,
    organization_type: resource.organizationType ?? null,
    verification_status: resource.verificationStatus ?? "verified",
    need_category_ids: resource.needCategoryIds,
    audience_tags: resource.audienceTags,
    situational_tags: resource.situationalTags ?? [],
    service_tags: resource.serviceTags ?? [],
    service_type: resource.serviceType ?? null,
    delivery_methods: resource.deliveryMethods ?? [],
    cost: resource.cost,
    geographic_scope: resource.geographicScope,
    state: resource.state ?? null,
    self_referral: resource.selfReferral ?? null,
    insurance_required: resource.insuranceRequired ?? null,
    referral_required: resource.referralRequired ?? null,
    application_required: resource.applicationRequired ?? null,
    documentation_required: resource.documentationRequired ?? null,
    eligibility: resource.eligibility ?? null,
    availability: resource.availability ?? null,
    application_status: resource.applicationStatus ?? "unknown",
    last_verified_at: resource.verifiedDate ?? null,
    review_due: resource.reviewDue ?? null,
    verification_url: resource.verificationUrl ?? null,
    verification_source: resource.verificationUrl ?? null,
    is_active: true,
  });

  const sql = `
    with source as (select ${sqlLiteral(payload)}::jsonb as p)
    insert into public.resource_records (
      resource_key, name, url, description, organization_type, verification_status,
      need_category_ids, audience_tags, situational_tags, service_tags, service_type,
      delivery_methods, cost, geographic_scope, state, self_referral,
      insurance_required, referral_required, application_required, documentation_required,
      eligibility, availability, application_status, last_verified_at, review_due,
      verification_url, verification_source, is_active, updated_at
    )
    select
      p->>'resource_key', p->>'name', p->>'url', p->>'description', p->>'organization_type', p->>'verification_status',
      array(select jsonb_array_elements_text(p->'need_category_ids')),
      array(select jsonb_array_elements_text(p->'audience_tags')),
      array(select jsonb_array_elements_text(p->'situational_tags')),
      array(select jsonb_array_elements_text(p->'service_tags')),
      p->>'service_type',
      array(select jsonb_array_elements_text(p->'delivery_methods')),
      p->>'cost', p->>'geographic_scope', nullif(p->>'state',''),
      (p->>'self_referral')::boolean, (p->>'insurance_required')::boolean,
      (p->>'referral_required')::boolean, (p->>'application_required')::boolean,
      (p->>'documentation_required')::boolean, p->>'eligibility', p->>'availability',
      p->>'application_status', (p->>'last_verified_at')::date, (p->>'review_due')::date,
      p->>'verification_url', p->>'verification_source', true, now()
    from source
    on conflict (resource_key) do update set
      name = excluded.name, url = excluded.url, description = excluded.description,
      organization_type = excluded.organization_type, verification_status = excluded.verification_status,
      need_category_ids = excluded.need_category_ids, audience_tags = excluded.audience_tags,
      situational_tags = excluded.situational_tags, service_tags = excluded.service_tags,
      service_type = excluded.service_type, delivery_methods = excluded.delivery_methods,
      cost = excluded.cost, geographic_scope = excluded.geographic_scope, state = excluded.state,
      self_referral = excluded.self_referral, insurance_required = excluded.insurance_required,
      referral_required = excluded.referral_required, application_required = excluded.application_required,
      documentation_required = excluded.documentation_required, eligibility = excluded.eligibility,
      availability = excluded.availability, application_status = excluded.application_status,
      last_verified_at = excluded.last_verified_at, review_due = excluded.review_due,
      verification_url = excluded.verification_url, verification_source = excluded.verification_source,
      is_active = true, updated_at = now();
  `;

  execFileSync(process.execPath, [supabaseCli, "db", "query", "--linked", sql], {
    stdio: "inherit",
  });
}

const existingTagValues = Object.entries(NEED_PATHWAY_TAGS)
  .map(([name, tags]) => `(${sqlLiteral(name)}, array[${tags.map(sqlLiteral).join(",")}]::text[])`)
  .join(",");
const existingTagSql = `
  with pathway_tags(name, tags) as (values ${existingTagValues})
  update public.resource_records as resource
  set situational_tags = array(
    select distinct tag
    from unnest(resource.situational_tags || pathway_tags.tags) as tag
    order by tag
  ), updated_at = now()
  from pathway_tags
  where resource.name = pathway_tags.name;
`;
execFileSync(process.execPath, [supabaseCli, "db", "query", "--linked", existingTagSql], { stdio: "inherit" });

console.log(`Synced ${VERIFIED_PATHWAY_RESOURCES.length} verified pathway resources and existing-record pathway tags.`);

