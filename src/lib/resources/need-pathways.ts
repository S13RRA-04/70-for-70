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
  {
    id: "mst-abuse",
    label: "Military sexual trauma or abuse",
    prompt: "I'm dealing with sexual trauma, domestic violence, or abuse",
    categoryFallbackIds: ["mental-health", "legal-benefits", "housing-transportation"],
    searchPhrases: ["military sexual trauma", "mst", "sexual assault", "domestic violence", "intimate partner violence", "abuse", "safety planning", "safe shelter", "someone is hurting me"],
  },
  {
    id: "transition-moral-injury",
    label: "Transition, identity, or moral injury",
    prompt: "I'm struggling with transition, identity, or moral injury",
    categoryFallbackIds: ["purpose-community", "career-education", "mental-health", "legal-benefits"],
    searchPhrases: ["military transition", "leaving service", "civilian life", "loss of purpose", "identity", "moral injury", "career planning", "transition assistance", "i don't know what's next"],
  },
  {
    id: "justice-involved",
    label: "Justice involvement or reentry",
    prompt: "I'm involved with the courts, jail, or reentry",
    categoryFallbackIds: ["legal-benefits", "housing-transportation", "career-education", "mental-health"],
    searchPhrases: ["justice involved", "veterans treatment court", "court", "jail", "incarceration", "reentry", "probation", "parole", "discharge upgrade", "legal help"],
  },
  {
    id: "fr-occupational",
    label: "First-responder job stress",
    prompt: "The first-responder job itself is wearing me down",
    categoryFallbackIds: ["mental-health", "purpose-community", "family-support"],
    searchPhrases: ["first responder", "critical incident", "occupational trauma", "burnout", "peer hotline", "law enforcement stress", "firefighter stress", "ems stress", "dispatcher stress", "the job is getting to me"],
  },
  {
    id: "women-veterans",
    label: "Support for women veterans",
    prompt: "I'm a woman veteran looking for services that fit",
    categoryFallbackIds: ["mental-health", "legal-benefits", "career-education", "financial-assistance", "family-support"],
    searchPhrases: ["women veterans", "woman veteran", "women's health", "women veteran benefits", "women veteran employment", "women veteran financial assistance", "childcare assistance"],
  },
  {
    id: "marriage-parenting",
    label: "Marriage, relationships, or parenting",
    prompt: "My relationship or the way I parent is struggling",
    categoryFallbackIds: ["family-support", "mental-health"],
    searchPhrases: ["marriage", "relationship", "couples", "communication", "parenting", "family conflict", "military family", "deployment reunion", "my partner and i need help"],
  },
  {
    id: "aging",
    label: "Aging or long-term care",
    prompt: "I'm aging and need help staying independent",
    categoryFallbackIds: ["health-disability", "family-support", "housing-transportation", "legal-benefits"],
    searchPhrases: ["aging", "older veteran", "elder care", "long-term care", "nursing home", "home health", "adult day care", "aid and attendance", "housebound", "i need help staying independent"],
  },
  {
    id: "children-dependents",
    label: "Children or dependents",
    prompt: "My children or dependents need support",
    categoryFallbackIds: ["family-support", "financial-assistance", "career-education"],
    searchPhrases: ["military child", "dependent", "child care", "daycare", "tutoring", "school", "deployment support for kids", "extracurricular grant", "my child needs help"],
  },
  {
    id: "rural-access",
    label: "Rural access or transportation",
    prompt: "Distance or transportation is keeping me from care",
    categoryFallbackIds: ["housing-transportation", "health-disability", "mental-health"],
    searchPhrases: ["rural", "transportation", "travel reimbursement", "mileage", "telehealth", "loaned tablet", "internet access", "remote care", "i live far from care"],
  },
  {
    id: "benefits-complications",
    label: "Benefits denials or appeals",
    prompt: "I'm fighting a denial, appeal, or complicated claim",
    categoryFallbackIds: ["legal-benefits"],
    searchPhrases: ["benefits denial", "va appeal", "decision review", "disability claim", "accredited representative", "discharge upgrade", "claims help", "my claim was denied"],
  },
  {
    id: "digital-safety",
    label: "Fraud or identity theft",
    prompt: "I'm dealing with a scam, fraud, or identity theft",
    categoryFallbackIds: ["legal-benefits", "financial-assistance"],
    searchPhrases: ["fraud", "scam", "identity theft", "phishing", "stolen identity", "benefits fraud", "online safety", "someone stole my information"],
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
  "mst-abuse": [
    { id: "mst-care", label: "Military sexual trauma care", serviceTags: ["military-sexual-trauma", "trauma-treatment", "clinical-treatment"] },
    { id: "domestic-violence-safety", label: "Domestic violence or safety planning", serviceTags: ["domestic-violence", "safety-planning", "shelter-referral"] },
    { id: "confidential-sexual-assault", label: "Confidential sexual-assault support", serviceTags: ["sexual-assault", "anonymous-support", "crisis-support"] },
    { id: "abuse-unsure", label: "I'm not sure what is safest", serviceTags: [] },
  ],
  "transition-moral-injury": [
    { id: "transition-benefits", label: "Benefits and health care navigation", serviceTags: ["benefits-navigation", "benefits-education", "health-care-navigation"] },
    { id: "transition-career", label: "Career, education, or entrepreneurship", serviceTags: ["career-planning", "education-planning", "entrepreneurship", "employment-resources"] },
    { id: "identity-purpose", label: "Identity, purpose, or moral injury", serviceTags: ["posttraumatic-growth", "peer-training", "military-culture"] },
    { id: "transition-unsure", label: "I'm not sure where to begin", serviceTags: [] },
  ],
  "justice-involved": [
    { id: "court-jail-support", label: "Court, jail, or treatment-court support", serviceTags: ["justice-outreach", "veterans-treatment-court"] },
    { id: "reentry-support", label: "Reentry and care coordination", serviceTags: ["reentry", "care-coordination", "housing-referral"] },
    { id: "justice-legal-help", label: "Civil or pro bono legal help", serviceTags: ["pro-bono-legal", "civil-legal-help", "legal-clinic-directory"] },
    { id: "discharge-benefits", label: "Discharge or benefits problem", serviceTags: ["discharge-upgrade", "benefits-appeal"] },
  ],
  "fr-occupational": [
    { id: "responder-peer-crisis", label: "A responder peer or crisis line", serviceTags: ["peer-hotline", "crisis-support", "law-enforcement", "fire-ems"] },
    { id: "critical-incident-trauma", label: "Critical-incident or trauma care", serviceTags: ["critical-incident", "trauma-treatment", "residential-retreat"] },
    { id: "responder-provider", label: "A responder-informed provider", serviceTags: ["provider-directory", "first-responder-mental-health"] },
    { id: "department-wellness", label: "Department training or wellness", serviceTags: ["department-training", "stress-management"] },
  ],
  "women-veterans": [
    { id: "women-va-care", label: "VA care and benefits navigation", serviceTags: ["women-veterans", "health-care-navigation", "benefits-navigation"] },
    { id: "women-financial", label: "Financial or childcare assistance", serviceTags: ["emergency-grant", "childcare-assistance", "rent-assistance", "utilities"] },
    { id: "women-career", label: "Employment or transition resources", serviceTags: ["employment-resources", "military-transition"] },
    { id: "women-unsure", label: "Help me explore the options", serviceTags: [] },
  ],
  "marriage-parenting": [
    { id: "couples-relationship", label: "Couples or relationship support", serviceTags: ["couples-support", "relationship-coaching", "communication-skills"] },
    { id: "parenting-family", label: "Parenting or family support", serviceTags: ["parenting", "family-support", "deployment-support"] },
    { id: "helping-veteran-care", label: "Help encouraging a Veteran to seek care", serviceTags: ["family-coaching", "treatment-engagement", "mental-health-referral"] },
    { id: "relationship-unsure", label: "I'm not sure what kind of help fits", serviceTags: [] },
  ],
  aging: [
    { id: "aging-home-community", label: "Help at home or in the community", serviceTags: ["home-health", "adult-day-care", "aging-in-place", "eldercare-referral"] },
    { id: "aging-residential", label: "Residential or nursing-home care", serviceTags: ["long-term-care", "nursing-home"] },
    { id: "aging-benefits", label: "Aid and Attendance or other benefits", serviceTags: ["aid-and-attendance", "housebound-benefit", "benefits-navigation"] },
    { id: "aging-unsure", label: "Caregiver support or a break", serviceTags: ["caregiver-support", "respite-care", "caregiver-training"] },
  ],
  "children-dependents": [
    { id: "children-childcare", label: "Child care or respite", serviceTags: ["childcare-assistance", "respite-care", "efmp"] },
    { id: "children-school", label: "School, tutoring, or activities", serviceTags: ["tutoring", "extracurricular-grant", "education-support", "special-education", "iep-advocacy"] },
    { id: "children-deployment", label: "Deployment, moves, or family change", serviceTags: ["deployment-support", "military-child", "family-resilience"] },
    { id: "children-unsure", label: "Special medical or educational needs", serviceTags: ["special-needs-navigation", "efmp", "special-education"] },
  ],
  "rural-access": [
    { id: "rural-transportation", label: "A ride or travel reimbursement", serviceTags: ["medical-transportation", "travel-reimbursement", "mileage-reimbursement", "charitable-flight", "long-distance-travel"] },
    { id: "rural-telehealth", label: "Telehealth or a connected device", serviceTags: ["telehealth", "loaned-device", "digital-access"] },
    { id: "rural-local-care", label: "Care closer to home", serviceTags: ["rural-health", "mobile-care", "community-care"] },
    { id: "rural-unsure", label: "I'm not sure what would help", serviceTags: [] },
  ],
  "benefits-complications": [
    { id: "benefits-claim", label: "Filing or reviewing a claim", serviceTags: ["benefits-navigation", "claims-assistance"] },
    { id: "benefits-appeal", label: "A denial, review, or appeal", serviceTags: ["benefits-appeal", "decision-review"] },
    { id: "benefits-discharge", label: "A discharge-status problem", serviceTags: ["discharge-upgrade"] },
    { id: "benefits-unsure", label: "I'm not sure where to start", serviceTags: [] },
  ],
  "digital-safety": [
    { id: "safety-report-fraud", label: "Report a scam or benefits fraud", serviceTags: ["fraud-reporting", "veteran-fraud"] },
    { id: "safety-identity-theft", label: "Recover from identity theft", serviceTags: ["identity-theft", "recovery-plan", "victim-assistance"] },
    { id: "safety-prevention", label: "Check something suspicious", serviceTags: ["scam-prevention", "information-referral"] },
    { id: "safety-unsure", label: "I'm not sure what happened", serviceTags: [] },
  ],
};

export function getNeedPathway(id: string) {
  return NEED_PATHWAYS.find((pathway) => pathway.id === id);
}

