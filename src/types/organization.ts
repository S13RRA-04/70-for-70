/** Lifecycle shared by every public For The 22 campaign surface. */
export type CampaignStatus = "planned" | "upcoming" | "active" | "complete" | "in-development";

/**
 * One campaign vehicle under the permanent For The 22 mission. Optional
 * financial fields are intentionally absent unless a campaign has its own
 * substantiated sub-goal; the current campaigns share The $70K Mission.
 */
export interface MovementCampaign {
  id: string;
  name: string;
  slug: string;
  url?: string;
  type: string;
  status: CampaignStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  parentMission: string;
  beneficiaries?: readonly string[];
  image?: string;
}

/** An organization may participate in more than one part of the network. */
export type OrganizationRelationship =
  | "resource"
  | "beneficiary"
  | "presenting-partner"
  | "campaign-partner"
  | "community-partner"
  | "media-partner"
  | "in-kind-supporter";

export interface NetworkOrganization {
  name: string;
  relationships: OrganizationRelationship[];
  websiteUrl: string | null;
  resourceUrl: string | null;
  relatedCampaigns: string[];
}

