import { RESOURCES } from "@/lib/content/resources";
import type { MissionPartnerRow, PartnerRow } from "@/types/database";
import type { NetworkOrganization, OrganizationRelationship } from "@/types/organization";

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Merges directory, beneficiary, and campaign-partner records by normalized
 * organization name. The source records remain authoritative for their own
 * fields; this layer owns only cross-ecosystem relationships.
 */
export function buildOrganizationNetwork(
  beneficiaries: PartnerRow[],
  campaignPartners: MissionPartnerRow[],
): NetworkOrganization[] {
  const organizations = new Map<string, NetworkOrganization>();

  function add(
    name: string,
    relationship: OrganizationRelationship,
    websiteUrl: string | null,
    relatedCampaigns: string[] = [],
    resourceUrl: string | null = null,
  ) {
    const key = normalizeName(name);
    const current = organizations.get(key) ?? {
      name,
      relationships: [],
      websiteUrl,
      resourceUrl,
      relatedCampaigns: [],
    };
    if (!current.relationships.includes(relationship)) current.relationships.push(relationship);
    current.websiteUrl ??= websiteUrl;
    current.resourceUrl ??= resourceUrl;
    current.relatedCampaigns = Array.from(new Set([...current.relatedCampaigns, ...relatedCampaigns]));
    organizations.set(key, current);
  }

  for (const resource of RESOURCES) add(resource.name, "resource", resource.url, [], resource.url);
  for (const beneficiary of beneficiaries) {
    add(beneficiary.name, "beneficiary", beneficiary.website_url, beneficiary.associated_campaigns ?? []);
  }
  for (const partner of campaignPartners) {
    add(partner.name, "campaign-partner", partner.website_url, partner.associated_campaigns ?? []);
    if (partner.tier === "presenting-partner") {
      add(partner.name, "presenting-partner", partner.website_url, partner.associated_campaigns ?? []);
    }
    if (partner.support_type) {
      add(partner.name, "in-kind-supporter", partner.website_url, partner.associated_campaigns ?? []);
    }
  }

  return Array.from(organizations.values()).sort((a, b) => a.name.localeCompare(b.name));
}
