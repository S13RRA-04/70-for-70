/**
 * "22 For the 22" Participant Promo Kit — copy and asset metadata for the
 * post-registration promo flow (registration success state, confirmation
 * email content, and /22forthe22/promokit). All verbatim compliance
 * language here (the optional/no-additional-entries disclaimers) should be
 * treated the same as NO_PURCHASE_NECESSARY_DISCLOSURE in
 * ./22-for-the-22.ts — do not paraphrase.
 *
 * Assets themselves live under /public/assets/22forthe22/promokit/ — see
 * that directory's README.txt for the same campaign links/hashtags/
 * captions in plain-text form (shipped inside the downloadable ZIP too).
 */

export const PROMO_KIT_ASSET_BASE_PATH = "/assets/22forthe22/promokit";
export const PROMO_KIT_ZIP_FILENAME = "22-for-the-22-participant-promo-kit.zip";
export const PROMO_KIT_ZIP_PATH = `${PROMO_KIT_ASSET_BASE_PATH}/${PROMO_KIT_ZIP_FILENAME}`;

export interface PromoKitAsset {
  id: string;
  fileName: string;
  label: string;
  description: string;
  width: number;
  height: number;
}

function assetPath(fileName: string): string {
  return `${PROMO_KIT_ASSET_BASE_PATH}/${fileName}`;
}

export const PROMO_KIT_SOCIAL_POSTS: PromoKitAsset[] = [
  {
    id: "square-01",
    fileName: "22ft22-square-01.png",
    label: "Because 22 ≠ 0.",
    description: "Square feed graphic with the 22 For the 22 badge and campaign tagline.",
    width: 1254,
    height: 1254,
  },
  {
    id: "square-02",
    fileName: "22ft22-square-02.png",
    label: "I'm In.",
    description: "Square feed graphic announcing your participation in 22 For the 22.",
    width: 1254,
    height: 1254,
  },
];

export const PROMO_KIT_STORY_GRAPHICS: PromoKitAsset[] = [
  {
    id: "story-01",
    fileName: "22ft22-story-01.png",
    label: "I'm Participating.",
    description: "Vertical graphic sized for Instagram and Facebook Stories.",
    width: 941,
    height: 1672,
  },
];

export const PROMO_KIT_PHOTO_FRAMES: PromoKitAsset[] = [
  {
    id: "photo-frame-square",
    fileName: "22ft22-photo-frame-square.png",
    label: "Square Photo Frame",
    description: "Transparent square overlay — place your own photo behind this frame.",
    width: 1254,
    height: 1254,
  },
  {
    id: "photo-frame-story",
    fileName: "22ft22-photo-frame-story.png",
    label: "Story Photo Frame",
    description: "Transparent Story-format overlay — place your own photo behind this frame.",
    width: 941,
    height: 1672,
  },
];

export const PROMO_KIT_LOGO_ASSET: PromoKitAsset = {
  id: "logo-lockup",
  fileName: "22ft22-logo-lockup.png",
  label: "Logo Badge",
  description: "22 For the 22 logo badge on a transparent background, for use in your own edits.",
  width: 1920,
  height: 1920,
};

export function promoKitAssetHref(asset: PromoKitAsset): string {
  return assetPath(asset.fileName);
}

export interface PromoKitCaption {
  id: string;
  label: string;
  body: string;
}

/** Verbatim — do not paraphrase or introduce unrelated slogans. */
export const PROMO_KIT_CAPTIONS: PromoKitCaption[] = [
  {
    id: "short",
    label: "Short",
    body: "I'm in for 22 For the 22.\n\nWe're using endurance and community to raise awareness for veteran suicide prevention.\n\nBecause 22 ≠ 0.\n\nhttps://tri.forthe22.org/22forthe22",
  },
  {
    id: "mission-focused",
    label: "Mission-Focused",
    body: "I'm participating in 22 For the 22 to help raise awareness for veteran suicide prevention and support the mission behind Tri For the 22.\n\nLearn more, join the event, and help carry the mission:\nhttps://tri.forthe22.org/22forthe22\n\nBecause 22 ≠ 0.",
  },
  {
    id: "participant-focused",
    label: "Participant-Focused",
    body: "I've officially joined 22 For the 22.\n\nThis isn't about a finish time. It's about showing up, carrying the message, and reminding veterans that they do not have to fight their battles alone.\n\nJoin us:\nhttps://tri.forthe22.org/22forthe22\n\nBecause 22 ≠ 0.",
  },
];

/** Verbatim, in the specified order. */
export const PROMO_KIT_HASHTAGS = [
  "#TriForThe22",
  "#22ForThe22",
  "#Because22DoesNotEqual0",
  "#VeteranSuicidePrevention",
  "#VeteransSupportingVeterans",
  "#EnduranceForACause",
] as const;

export const PROMO_KIT_HASHTAGS_TEXT = PROMO_KIT_HASHTAGS.join(" ");

export const PROMO_KIT_HERO_CONTENT = {
  eyebrow: "Participant Promo Kit",
  title: "22 For the 22 Participant Promo Kit",
  tagline: "Because 22 ≠ 0.",
  description:
    "Ready-to-share social graphics, Story assets, photo frames, suggested captions, and hashtags to help carry the mission — entirely optional, and available to every registered participant.",
} as const;

/** Shown near every share/download CTA on the promo kit page. Verbatim. */
export const PROMO_KIT_OPTIONAL_DISCLAIMER =
  "Optional: sharing does not provide additional giveaway entries or improve your odds of winning.";

/** Shown on the registration success state. Verbatim. */
export const PROMO_KIT_SUCCESS_SHARING_NOTE =
  "Sharing campaign content is optional and does not provide additional giveaway entries or increase your odds of winning.";

/** Shown in the confirmation email. Verbatim. */
export const PROMO_KIT_EMAIL_DISCLAIMER =
  "Sharing, posting, tagging, or using campaign promotional materials is completely optional and does not provide additional entries or increase your odds of winning.";

export const REGISTRATION_SUCCESS_CONTENT = {
  headline: "You're Registered.",
  subheadline: "Now help carry the mission.",
  body: "Your registration is complete. Download the 22 For the 22 Participant Promo Kit for ready-to-share social graphics, story assets, photo frames, suggested captions, hashtags, and campaign materials.",
  primaryCta: "Download Participant Promo Kit",
  secondaryCta: "View Individual Assets",
} as const;

export const REGISTRATION_EMAIL_CONTENT = {
  subject: "You're Registered for 22 For the 22",
  heading: "You're officially registered for 22 For the 22.",
  body: "If you'd like to help spread the mission, we've created a Participant Promo Kit with social graphics, story images, photo frames, suggested captions, and hashtags.",
  primaryButtonLabel: "Download Promo Kit",
  secondaryButtonLabel: "View Campaign Page",
  hashtagsLabel: "Suggested hashtags",
  captionLabel: "Suggested caption",
  suggestedCaption: PROMO_KIT_CAPTIONS[0].body,
} as const;
