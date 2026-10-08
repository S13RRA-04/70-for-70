import "server-only";
import {
  PROMO_KIT_CAPTIONS,
  PROMO_KIT_EMAIL_DISCLAIMER,
  PROMO_KIT_HASHTAGS_TEXT,
  PROMO_KIT_ZIP_PATH,
  REGISTRATION_EMAIL_CONTENT,
} from "@/lib/content/22-for-the-22-promokit";
import { CONTACT_EMAIL, EVENT22_CAMPAIGN_URL, SITE_NAME } from "@/lib/constants";
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
  const promoKitZipUrl = `${EVENT22_CAMPAIGN_URL}${PROMO_KIT_ZIP_PATH}`;
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
