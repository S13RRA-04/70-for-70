/**
 * Voices For The 22 — talent participation portal copy.
 *
 * One source for both the /voices/talent pages and the downloadable kit
 * (scripts/voices-kit/build.mts renders the PDFs from this file), so the
 * website and the documents can't drift. Plain data with no imports so
 * Node can load it directly for the kit build.
 *
 * Bump KIT_VERSION / KIT_UPDATED (and RELEASE_VERSION for the release) and
 * re-run `npm run voices:kit` whenever document copy changes.
 *
 * Rules carried from the founder's directive:
 *  - Never describe For The 22 as a registered nonprofit or 501(c)(3).
 *  - Never reference the founder's federal employment or other sensitive affiliations.
 *  - No fundraising calls to action anywhere in the talent portal.
 *  - Never name a contributor here — only published, permission-cleared
 *    contributors appear, and only through the publication workflow.
 */

export const KIT_VERSION = "1.0";
export const KIT_UPDATED = "2026-11-19";
/** The release stays a draft until founder AND legal review sign off. */
export const RELEASE_VERSION = "0.1-draft";
export const RELEASE_IS_DRAFT = true;

export const TALENT_CONTACT = {
  name: "Cody Hitson",
  title: "Founder | For The 22",
  email: "cody@forthe22.org",
  website: "https://forthe22.org",
} as const;

export const TALENT_INQUIRY_MAILTO = `mailto:${TALENT_CONTACT.email}?subject=${encodeURIComponent("Voices For The 22 — talent inquiry")}`;

export const TAGLINE = "Because 22 ≠ 0.";

export const PORTAL_PATHS = {
  voices: "/voices",
  talent: "/voices/talent",
  recordingGuide: "/voices/talent/recording-guide",
  submit: "/voices/talent/submit",
  permissions: "/voices/talent/permissions",
} as const;

export const KIT_FILES = {
  brief: { href: "/voices/kit/voices-talent-participation-brief.pdf", label: "Talent Participation Brief", detail: "PDF · 2 pages" },
  guide: { href: "/voices/kit/voices-recording-guide.pdf", label: "Recording Guide", detail: "PDF · 1 page" },
  release: { href: "/voices/kit/voices-participation-release.pdf", label: "Participation Release (draft)", detail: "PDF · draft for review" },
  zip: { href: "/voices/kit/voices-talent-kit.zip", label: "Complete Talent Participation Kit", detail: "ZIP · PDFs + official logos" },
} as const;

export const HERO = {
  eyebrow: "For The 22 presents",
  title: "Voices For The 22",
  headline: "Your voice could be the reason someone reaches out.",
  body:
    "Voices For The 22 brings together individuals from entertainment, music, athletics, military service and public life to combat isolation, reduce mental health stigma and remind veterans, first responders and their families that their lives matter.",
} as const;

export const PARTICIPATION_SUMMARY = [
  { value: "20–30", unit: "seconds", label: "requested" },
  { value: "$0", unit: "", label: "No financial contribution" },
  { value: "1", unit: "message", label: "of hope" },
] as const;

export const ABOUT_INITIATIVE = [
  "Behind every uniform is a human being. Someone who experiences fear, loss, uncertainty and pain. Someone who deserves the same compassion and support they have spent their lives providing to others.",
  "Voices For The 22 exists to remind those who serve that they are not alone, their lives matter and seeking help is an act of courage.",
  "Through authentic messages from individuals across different communities, we seek to reduce mental health stigma and encourage meaningful human connection.",
] as const;

export const ABOUT_FOUNDER = [
  "For The 22 was founded by Cody Hitson, a U.S. Navy combat veteran and former SWAT operator.",
  "Rooted in lived experience, For The 22 is an independent, veteran-led initiative supporting veterans, first responders and their families through Connection, Mobilization and Impact.",
] as const;

export const INVITATION = {
  intro: "We invite you to contribute a brief video message of encouragement in your own words.",
  voluntary: "Participation is entirely voluntary.",
  points: [
    "Approximately 20–30 seconds.",
    "Recorded on a smartphone.",
    "Vertical orientation preferred.",
    "No professional production required.",
    "No financial contribution requested.",
    "No travel, appearance or performance commitment.",
  ],
  closing: "Your message doesn't need to be perfect. It needs to be human.",
} as const;

export const AUDIENCE =
  "Veterans, first responders and their families — including people who may be quietly struggling and anyone who loves them.";

export const PUBLICATION_TIMING =
  "Messages are published on a rolling basis after review and only once written permission is recorded. We'll share a proposed date in advance and honor any embargo or approval requirement you give us.";

export const TECHNICAL_GUIDELINES = [
  "A smartphone camera is sufficient.",
  "Vertical 9:16 orientation preferred; horizontal recordings accepted.",
  "1080p resolution preferred.",
  "Clear, intelligible audio in a quiet recording environment.",
  "Natural or balanced lighting.",
  "Camera at approximately eye level.",
  "No background music, filters or heavy effects.",
  "Allow about two seconds of silence before and after speaking.",
] as const;

export const DURATION_NOTE =
  "20–30 seconds is a guide, not a limit. If your message runs longer, send it — we never reject a meaningful message on length alone.";

export const TALKING_POINTS = [
  "Thank veterans, first responders and their families.",
  "Acknowledge that talking about mental health is hard.",
  "Encourage anyone feeling isolated to reach out.",
  "Remind people that vulnerability and strength can coexist.",
  "Encourage connection with friends, family, peers or professional support.",
  "Offer a message of hope.",
] as const;

export const TALKING_POINTS_NOTE =
  "Choose any combination, or none — your own words are what matter. You never need to share personal mental health experiences, and there is no script to read.";

export const SAMPLE_MESSAGE =
  "To our veterans, first responders and the families who stand beside them, thank you for everything you do. If you're going through a difficult time, please remember that you're not alone. Your life matters, and there are people who care about you. Asking for help is an act of courage. Because 22 does not equal zero.";

export const SAMPLE_MESSAGE_NOTE = "Optional — use it as a starting point, adapt it, or ignore it entirely.";

export const DISTRIBUTION = [
  "The official For The 22 website.",
  "Organic social media channels operated by For The 22.",
  "Other mission-related channels you specifically approve.",
] as const;

export const PERMITTED_EDITS = [
  "Length",
  "Captions",
  "Accessibility",
  "Audio normalization",
  "Aspect ratio",
  "Approved campaign branding",
] as const;

export const EDIT_LIMIT = "Edits never materially change the meaning or context of your message.";

export const PROHIBITED_USES = [
  "Paid advertisements.",
  "Merchandise.",
  "Commercial endorsements.",
  "Fundraising solicitations.",
  "Third-party promotional campaigns.",
  "AI-generated or synthetic media.",
  "Voice cloning or likeness generation.",
] as const;

export const EXPANDED_USE = "Any expanded use requires your separate written permission.";

export const PARTICIPANT_CONTROLS = [
  "Set additional restrictions on where or how your message appears.",
  "Require your approval of the final edited video before it is published.",
  "Set an embargo date before which nothing is published.",
  "Approve exactly how your name and title appear.",
  "Withdraw at any time, for any reason.",
] as const;

export const WITHDRAWAL = [
  `Email ${TALENT_CONTACT.email} with the participant's name and, if you have it, your submission reference.`,
  "We confirm receipt and unpublish the video from the For The 22 website and remove it from For The 22-operated social channels we control as quickly as practicable — typically within two business days.",
  "On request, we delete the original recording, headshot and signed documents from our private storage, retaining only a minimal record that the withdrawal happened.",
  "Withdrawal can't recall copies third parties may already have shared, but we will not republish the message.",
] as const;

export const PRIVACY_POINTS = [
  "Recordings, headshots and signed releases are stored privately and are visible only to authorized For The 22 administrators.",
  "Representative contact information is never published.",
  "We never ask for medical records, diagnoses or other health information.",
  "Submission does not guarantee publication. Nothing is published automatically.",
] as const;

/** Release sections — the website renders a summary; the PDF renders these in full. */
export const RELEASE_SECTIONS: readonly { heading: string; body: readonly string[] }[] = [
  {
    heading: "1. Participant",
    body: [
      "Participant name: ______________________________________",
      "Preferred public attribution (name and title as it should appear): ______________________________________",
    ],
  },
  {
    heading: "2. Representative and authority (if signing on the participant's behalf)",
    body: [
      "Representative name / agency: ______________________________________",
      "The representative confirms they are authorized by the participant to grant the permissions in this release and to provide the recording.",
    ],
  },
  {
    heading: "3. Voluntary participation",
    body: [
      "Participation is voluntary and unpaid. No financial contribution, appearance, travel or performance is requested. Participation is not an endorsement of For The 22 or of any product, service or fundraising effort.",
    ],
  },
  {
    heading: "4. Permission to publish",
    body: [
      "The participant grants For The 22 a limited, non-exclusive, non-transferable permission to publish the submitted recording, solely to support the mental health of veterans, first responders and their families, on the channels approved in Section 6.",
    ],
  },
  {
    heading: "5. Permitted editing and formatting",
    body: [
      "For The 22 may edit the recording only for length, captions, accessibility, audio normalization, aspect ratio and approved campaign branding. Edits will not materially change the meaning or context of the message.",
      "☐ The participant requires approval of the final edited video before publication.",
    ],
  },
  {
    heading: "6. Approved distribution channels",
    body: [
      "☐ The official For The 22 website (forthe22.org)",
      "☐ Organic (unpaid) social media channels operated by For The 22",
      "☐ Other mission-related channels, specifically: ______________________________________",
    ],
  },
  {
    heading: "7. Usage duration and restrictions",
    body: [
      "Permission begins on ____________ and ends on ____________ (or, if left blank, continues until withdrawn under Section 9).",
      "The recording will NOT be used in paid advertising, merchandise, commercial endorsements, fundraising solicitations, third-party promotional campaigns, AI-generated or synthetic media, or voice cloning or likeness generation. Any expanded use requires separate written permission.",
      "Additional restrictions: ______________________________________",
    ],
  },
  {
    heading: "8. Publication approval",
    body: [
      "For The 22 will not publish before any embargo date given here: ____________, and will confirm the proposed publication date with the participant or representative in advance.",
    ],
  },
  {
    heading: "9. Withdrawal and takedown",
    body: [
      "The participant may withdraw this permission at any time by written notice to cody@forthe22.org. For The 22 will unpublish the recording from the website and from For The 22-operated channels it controls as quickly as practicable (typically within two business days) and, on request, delete stored copies. Withdrawal does not oblige For The 22 to recall copies already shared by third parties.",
    ],
  },
  {
    heading: "10. Signature",
    body: [
      "Signature: ______________________________   Date: ____________",
      "Printed name: ______________________________   Capacity: ☐ Participant  ☐ Authorized representative",
      "For The 22: ______________________________   Date: ____________",
    ],
  },
];

export const RELEASE_DRAFT_NOTICE =
  "DRAFT — Proposed limited-use release. Requires founder and legal review before operational use. Not for signature.";
