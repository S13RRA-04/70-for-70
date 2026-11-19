import "server-only";
import {
  PROMO_KIT_CAPTIONS,
  PROMO_KIT_EMAIL_DISCLAIMER,
  PROMO_KIT_HASHTAGS_TEXT,
  PROMO_KIT_ZIP_PATH,
  REGISTRATION_EMAIL_CONTENT,
} from "@/lib/content/22-for-the-22-promokit";
import { CONTACT_EMAIL, EVENT22_CAMPAIGN_URL, SITE_NAME, SITE_URL } from "@/lib/constants";
import { sendEmail } from "@/lib/email/resend";

/**
 * Sends both halves of each submission notification through Resend
 * (src/lib/email/resend.ts): an acknowledgment to the submitter and a
 * heads-up to CONTACT_EMAIL so an admin sees it without checking the
 * dashboard. sendEmail never throws, so a Resend outage degrades to
 * "the submission saved but no email went out" rather than a failed
 * request — the on-screen success state in each form is always the
 * authoritative confirmation.
 */
export async function notifySponsorshipRequestSubmitted(input: {
  requestId: string;
  contactName: string;
  organizationName: string;
  email: string;
}) {
  await sendEmail({
    to: input.email,
    subject: `We received your sponsorship inquiry — ${SITE_NAME}`,
    text: `Hi ${input.contactName},\n\nThanks for reaching out on behalf of ${input.organizationName}. We've received your sponsorship inquiry and will follow up soon.\n\n— ${SITE_NAME}`,
  });

  if (CONTACT_EMAIL) {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `New sponsorship request: ${input.organizationName}`,
      text: `${input.contactName} (${input.email}) submitted a sponsorship request on behalf of ${input.organizationName}.\n\nRequest ID: ${input.requestId}`,
      replyTo: input.email,
    });
  }
}

/** /contact and /get-involved submissions — forwarded in full so they can be answered straight from the inbox. */
export async function notifyInquirySubmitted(input: {
  name: string;
  email: string;
  interest: string;
  message: string;
  organization: string | null;
  phone: string | null;
  website: string | null;
}) {
  if (!CONTACT_EMAIL) return;

  const details = [
    `From: ${input.name} (${input.email})`,
    `Topic: ${input.interest}`,
    input.organization && `Organization: ${input.organization}`,
    input.phone && `Phone: ${input.phone}`,
    input.website && `Website: ${input.website}`,
  ].filter(Boolean);

  await sendEmail({
    to: CONTACT_EMAIL,
    subject: `New ${input.interest} inquiry: ${input.name}`,
    text: `${details.join("\n")}\n\n${input.message}`,
    replyTo: input.email,
  });
}

export async function notifyTriathlonTeamApplicationSubmitted(input: {
  applicationId: string;
  fullName: string;
  email: string;
}) {
  await sendEmail({
    to: input.email,
    subject: `Triathlon Team application received — ${SITE_NAME}`,
    text: `Hi ${input.fullName},\n\nThanks for applying to the Triathlon Team. We've received your application and will follow up soon.\n\n— ${SITE_NAME}`,
  });

  if (CONTACT_EMAIL) {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `New Triathlon Team application: ${input.fullName}`,
      text: `${input.fullName} (${input.email}) submitted a Triathlon Team application.\n\nApplication ID: ${input.applicationId}`,
      replyTo: input.email,
    });
  }
}

export async function notifyEventRegistrationSubmitted(input: {
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const eventPageUrl = EVENT22_CAMPAIGN_URL;
  const promoKitPageUrl = `${EVENT22_CAMPAIGN_URL}/promokit`;
  const promoKitZipUrl = `${SITE_URL}${PROMO_KIT_ZIP_PATH}`;
  const suggestedCaption = PROMO_KIT_CAPTIONS[0].body;

  const emailBody = [
    `${REGISTRATION_EMAIL_CONTENT.heading}`,
    "",
    REGISTRATION_EMAIL_CONTENT.body,
    "",
    `${REGISTRATION_EMAIL_CONTENT.primaryButtonLabel}: ${promoKitZipUrl}`,
    `${REGISTRATION_EMAIL_CONTENT.secondaryButtonLabel}: ${eventPageUrl}`,
    "",
    `View individual assets: ${promoKitPageUrl}`,
    "",
    `${REGISTRATION_EMAIL_CONTENT.hashtagsLabel}: ${PROMO_KIT_HASHTAGS_TEXT}`,
    "",
    `${REGISTRATION_EMAIL_CONTENT.captionLabel}:`,
    suggestedCaption,
    "",
    PROMO_KIT_EMAIL_DISCLAIMER,
  ].join("\n");

  await sendEmail({
    to: input.email,
    subject: REGISTRATION_EMAIL_CONTENT.subject,
    text: emailBody,
  });

  if (CONTACT_EMAIL) {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `New 22 For the 22 registration: ${input.firstName} ${input.lastName}`,
      text: `${input.firstName} ${input.lastName} (${input.email}) registered for 22 For the 22.\n\nRegistration ID: ${input.registrationId}`,
      replyTo: input.email,
    });
  }
}

/**
 * Voices For The 22 talent submission — fires once the upload has been
 * verified (or immediately for a link-only submission). The founder copy
 * carries no file links: recordings are only reachable through /admin/voices.
 */
export async function notifyVoicesSubmissionReceived(input: {
  submissionId: string;
  reference: string;
  participantName: string;
  submitterName: string;
  submitterEmail: string;
  relationship: string;
  delivery: "upload" | "link";
}) {
  await sendEmail({
    to: input.submitterEmail,
    subject: `We received your Voices For The 22 submission (${input.reference})`,
    text: [
      `Hi ${input.submitterName},`,
      "",
      `Thank you — we've received the Voices For The 22 submission for ${input.participantName}.`,
      "",
      `Your reference: ${input.reference}`,
      "",
      "What happens next:",
      "• Every submission is reviewed by our team. Submission does not guarantee publication, and nothing is published automatically.",
      "• Nothing is published until written permission is recorded, and we honor any embargo, restriction or approval requirement you gave us.",
      "• To change restrictions, withdraw, or ask us to delete the recording, reply to this email or write to cody@forthe22.org with your reference.",
      "",
      `Participation terms: ${SITE_URL}/voices/talent/permissions`,
      "",
      "With gratitude,",
      "Cody Hitson",
      `Founder | ${SITE_NAME}`,
      "",
      "Because 22 ≠ 0.",
    ].join("\n"),
    replyTo: CONTACT_EMAIL ?? undefined,
  });

  if (CONTACT_EMAIL) {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `New Voices submission: ${input.participantName} (${input.reference})`,
      text: [
        `Participant: ${input.participantName}`,
        `Submitted by: ${input.submitterName} (${input.submitterEmail}) — ${input.relationship}`,
        `Delivery: ${input.delivery === "upload" ? "File upload (verified MP4/MOV)" : "External link (untrusted — open with care)"}`,
        `Reference: ${input.reference}`,
        "",
        `Review: ${SITE_URL}/admin/voices/submissions/${input.submissionId}`,
      ].join("\n"),
      replyTo: input.submitterEmail,
    });
  }
}
