/**
 * Need-first entry points for the resource directory. These supplement the
 * ten primary categories; they do not replace or widen those categories.
 *
 * `categoryFallbackIds` are intentionally broad while record-level tagging
 * is audited. Explicit `situationalTags` always rank ahead of fallbacks.
 */
export const NEED_PATHWAYS = [
  {
    id: "chronic-pain-tbi",
    label: "Chronic pain or a brain injury",
    prompt: "I'm dealing with chronic pain or a brain injury",
    categoryFallbackIds: ["mental-health", "equipment-grants", "sports-fitness"],
    searchPhrases: ["chronic pain", "pain management", "brain injury", "tbi", "concussion", "headaches", "cognitive rehabilitation", "i hurt all the time", "can't remember things since my injury"],
  },
  {
    id: "creative-connection",
    label: "Art, music, or creative connection",
    prompt: "I want to reconnect through art or music",
    categoryFallbackIds: ["purpose-community"],
    searchPhrases: ["art", "drawing", "painting", "music", "guitar", "songwriting", "creative writing", "storytelling", "photography", "i want to learn to draw"],
  },
  {
    id: "grief-bereavement",
    label: "Grief, loss, or bereavement",
    prompt: "I'm grieving someone I lost",
    categoryFallbackIds: ["family-support", "mental-health", "purpose-community"],
    searchPhrases: ["grief", "loss", "bereavement", "suicide loss", "line of duty death", "survivor support", "i lost someone to suicide"],
  },
  {
    id: "emergency-basic-needs",
    label: "Emergency financial or basic needs",
    prompt: "I'm having trouble paying for necessities",
    categoryFallbackIds: ["financial-assistance", "housing-transportation"],
    searchPhrases: ["food assistance", "groceries", "rent assistance", "utilities", "utility shutoff", "eviction", "emergency grant", "vehicle repair", "transportation", "childcare", "i can't afford groceries"],
  },
  {
    id: "caregiver-support",
    label: "Caregiver support or respite",
    prompt: "I'm caring for an injured family member",
    categoryFallbackIds: ["family-support"],
    searchPhrases: ["caregiver", "caregiving", "respite", "caregiver burnout", "caregiver training", "caregiver stipend", "home care", "i need a break from caring"],
  },
  {
    id: "addiction-recovery",
    label: "Addiction treatment or recovery",
    prompt: "I'm struggling with alcohol or drugs",
    categoryFallbackIds: ["mental-health"],
    searchPhrases: ["alcohol", "drinking", "substance use", "drugs", "prescription medication misuse", "opioid", "detox", "addiction treatment", "peer recovery", "sobriety", "getting sober", "i think i'm drinking too much"],
  },
] as const;

export type NeedPathwayId = (typeof NEED_PATHWAYS)[number]["id"];

export const PATHWAY_FOLLOW_UPS: Record<NeedPathwayId, { id: string; label: string; serviceTags: string[] }[]> = {
  "chronic-pain-tbi": [
    { id: "pain", label: "Chronic pain", serviceTags: ["chronic-pain", "pain-management", "whole-health"] },
    { id: "brain-injury", label: "Brain injury", serviceTags: ["brain-injury", "cognitive-rehabilitation"] },
    { id: "rehabilitation", label: "Rehabilitation", serviceTags: ["physical-rehabilitation", "cognitive-rehabilitation"] },
    { id: "pain-tbi-unsure", label: "I'm not sure yet", serviceTags: [] },
  ],
  "creative-connection": [
    { id: "visual-art", label: "Visual art", serviceTags: ["visual-art", "drawing", "painting"] },
    { id: "music", label: "Music or songwriting", serviceTags: ["music", "guitar", "songwriting"] },
    { id: "writing-storytelling", label: "Writing or storytelling", serviceTags: ["creative-writing", "storytelling"] },
    { id: "creative-unsure", label: "I'm open to ideas", serviceTags: [] },
  ],
  "grief-bereavement": [
    { id: "suicide-loss", label: "Suicide loss", serviceTags: ["suicide-loss"] },
    { id: "line-of-duty-loss", label: "Line-of-duty death", serviceTags: ["line-of-duty-death"] },
    { id: "other-loss", label: "Another kind of loss", serviceTags: ["bereavement"] },
    { id: "grief-unsure", label: "I'm not sure what support fits", serviceTags: [] },
  ],
  "emergency-basic-needs": [
    { id: "food", label: "Food or groceries", serviceTags: ["food-assistance", "groceries", "immediate-assistance"] },
    { id: "rent-utilities", label: "Rent or utilities", serviceTags: ["rent-assistance", "utilities", "eviction"] },
    { id: "transportation", label: "Transportation or vehicle help", serviceTags: ["transportation", "vehicle-repair"] },
    { id: "emergency-grant", label: "Emergency financial assistance", serviceTags: ["emergency-grant", "financial-hardship"] },
  ],
  "caregiver-support": [
    { id: "respite", label: "Respite or time away", serviceTags: ["respite-care"] },
    { id: "coaching", label: "Training or coaching", serviceTags: ["caregiver-training", "caregiver-coaching"] },
    { id: "financial-benefits", label: "Financial benefits", serviceTags: ["caregiver-stipend"] },
    { id: "emotional-support", label: "Emotional or peer support", serviceTags: ["caregiver-peer-support", "spouse-support", "peer-support"] },
  ],
  "addiction-recovery": [
    { id: "professional-treatment", label: "Professional treatment", serviceTags: ["clinical-treatment", "outpatient-treatment", "residential-treatment"] },
    { id: "detox-medication", label: "Detox or medication treatment", serviceTags: ["detoxification", "medication-assisted-treatment"] },
    { id: "peer-recovery", label: "Peer recovery meetings", serviceTags: ["peer-recovery", "mutual-support"] },
    { id: "help-someone-else", label: "Help for someone else", serviceTags: ["family-addiction-support", "information-referral"] },
  ],
};

export function getNeedPathway(id: string) {
  return NEED_PATHWAYS.find((pathway) => pathway.id === id);
}

