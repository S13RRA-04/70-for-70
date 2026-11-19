import type { Resource } from "@/lib/content/resources";
import { unstable_cache } from "next/cache";
import { enrichFlagship } from "@/lib/resources/flagships";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";

type ResourceRow = Record<string, unknown>;

export const RESOURCE_DIRECTORY_CACHE_TAG = "resource-directory";

function fromRow(row: ResourceRow): Resource {
  return {
    name: String(row.name), url: String(row.url), description: String(row.description),
    needCategoryIds: (row.need_category_ids as string[]) ?? [], audienceTags: (row.audience_tags as string[]) ?? [],
    cost: String(row.cost), geographicScope: String(row.geographic_scope), state: (row.state as string | null) ?? undefined,
    crisisResource: row.crisis_resource === true ? true : undefined,
    crisisAudience: (row.crisis_audience as Resource["crisisAudience"] | null) ?? undefined,
    phone: (row.phone as string | null) ?? undefined,
    text: (row.text_contact as string | null) ?? undefined,
    hours: (row.hours as string | null) ?? undefined,
    eligibility: (row.eligibility as string | null) ?? undefined, availability: (row.availability as string | null) ?? undefined,
    verifiedDate: (row.last_verified_at as string | null) ?? undefined,
    organizationType: (row.organization_type as Resource["organizationType"]) ?? undefined,
    verificationStatus: (row.verification_status as Resource["verificationStatus"]) ?? undefined,
    whyIncluded: (row.why_included as string | null) ?? undefined,
    veteranLed: (row.veteran_led as boolean | null) ?? undefined, firstResponderLed: (row.first_responder_led as boolean | null) ?? undefined,
    faithBased: (row.faith_based as boolean | null) ?? undefined, peerLed: (row.peer_led as boolean | null) ?? undefined,
    faithAffiliationSource: (row.faith_affiliation_source as string | null) ?? undefined,
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
    serviceTags: (row.service_tags as string[]) ?? [],
    serviceType: (row.service_type as string | null) ?? undefined,
    deliveryMethods: (row.delivery_methods as string[]) ?? [],
    applicationStatus: (row.application_status as Resource["applicationStatus"]) ?? undefined,
    reviewDue: (row.review_due as string | null) ?? undefined,
    verificationUrl: (row.verification_url as string | null) ?? undefined,
  };
}

const getDatabaseResources = unstable_cache(
  async (): Promise<Resource[]> => {
    if (!isSupabaseConfigured()) {
      throw new Error("The resource directory database is not configured.");
    }

    try {
      const client = createPublicClient();
      const rows: ResourceRow[] = [];
      const pageSize = 500;

      for (let from = 0; ; from += pageSize) {
        const { data, error } = await client
          .from("resource_records")
          .select("*")
          .eq("is_active", true)
          .order("name")
          .order("resource_key")
          .range(from, from + pageSize - 1);

        if (error) throw error;
        rows.push(...((data as ResourceRow[] | null) ?? []));
        if (!data || data.length < pageSize) break;
      }

      if (!rows.length) throw new Error("The resource directory returned no active records.");
      return rows.map(fromRow).map(enrichFlagship);
    } catch (error) {
      throw new Error("The resource directory is unavailable.", { cause: error });
    }
  },
  ["active-resource-directory"],
  { revalidate: 300, tags: [RESOURCE_DIRECTORY_CACHE_TAG] },
);

export async function getResources(): Promise<Resource[]> {
  return getDatabaseResources();
}
