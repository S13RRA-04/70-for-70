import { VERIFIED_EXPANSION_RESOURCES } from "@/lib/resources/verified-expansion-resources";
import { VERIFIED_PATHWAY_RESOURCES } from "@/lib/resources/verified-pathway-resources";
import { VERIFIED_GAP_RESOURCES } from "@/lib/resources/verified-gap-resources";

/** All official-source-verified records that augment or update the bundled directory. */
export const VERIFIED_RESOURCES = [
  ...VERIFIED_EXPANSION_RESOURCES,
  ...VERIFIED_PATHWAY_RESOURCES,
  ...VERIFIED_GAP_RESOURCES,
];
