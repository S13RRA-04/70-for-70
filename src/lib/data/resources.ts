import { RESOURCES, type Resource } from "@/lib/content/resources";
import { enrichFlagship } from "@/lib/resources/flagships";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

type ResourceRow = Record<string, unknown>;

function fromRow(row: ResourceRow): Resource {
  return {
    name: String(row.name), url: String(row.url), description: String(row.description),
    needCategoryIds: (row.need_category_ids as string[]) ?? [], audienceTags: (row.audience_tags as string[]) ?? [],
    cost: String(row.cost), geographicScope: String(row.geographic_scope), state: (row.state as string | null) ?? undefined,
    eligibility: (row.eligibility as string | null) ?? undefined, availability: (row.availability as string | null) ?? undefined,
    verifiedDate: (row.last_verified_at as string | null) ?? undefined,
    organizationType: (row.organization_type as Resource["organizationType"]) ?? undefined,
    verificationStatus: (row.verification_status as Resource["verificationStatus"]) ?? undefined,
    whyIncluded: (row.why_included as string | null) ?? undefined,
    veteranLed: (row.veteran_led as boolean | null) ?? undefined, firstResponderLed: (row.first_responder_led as boolean | null) ?? undefined,
    faithBased: (row.faith_based as boolean | null) ?? undefined, peerLed: (row.peer_led as boolean | null) ?? undefined,
    virtualAvailable: (row.virtual_available as boolean | null) ?? undefined, inPersonAvailable: (row.in_person_available as boolean | null) ?? undefined,
    selfReferral: (row.self_referral as boolean | null) ?? undefined,
    employerInvolvementRequired: (row.employer_involvement_required as boolean | null) ?? undefined,
    anonymousInitialContact: (row.anonymous_initial_contact as boolean | null) ?? undefined,
    outsideAgencyProvider: (row.outside_agency_provider as boolean | null) ?? undefined,
    insuranceRequired: (row.insurance_required as boolean | null) ?? undefined,
    referralRequired: (row.referral_required as boolean | null) ?? undefined,
    applicationRequired: (row.application_required as boolean | null) ?? undefined,
    documentationRequired: (row.documentation_required as boolean | null) ?? undefined,
    confidentialityPolicyUrl: (row.confidentiality_policy_url as string | null) ?? undefined,
    situationalTags: (row.situational_tags as string[]) ?? [],
  };
}

export async function getResources(): Promise<Resource[]> {
  const fallback = RESOURCES.map(enrichFlagship);
  if (!isSupabaseConfigured()) return fallback;
  try {
    const { data, error } = await createPublicClient().from("resource_records").select("*").eq("is_active", true).order("name");
    if (error || !data?.length) return fallback;
    const structured = (data as ResourceRow[]).map(fromRow);
    const byName = new Map(structured.map((resource) => [resource.name, resource]));
    // Structured rows override their bundled counterparts while the rest of
    // the long-tail directory remains available until its migration is done.
    return fallback.map((resource) => byName.get(resource.name) ?? resource)
      .concat(structured.filter((resource) => !fallback.some((item) => item.name === resource.name)));
  } catch {
    return fallback;
  }
}
