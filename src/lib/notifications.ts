import "server-only";
import {
  PROMO_KIT_CAPTIONS,
  PROMO_KIT_EMAIL_DISCLAIMER,
  PROMO_KIT_HASHTAGS_TEXT,
  PROMO_KIT_ZIP_PATH,
  REGISTRATION_EMAIL_CONTENT,
} from "@/lib/content/22-for-the-22-promokit";
import { EVENT22_CAMPAIGN_URL } from "@/lib/constants";

/**
 * TODO: no email provider is configured yet. Wire this to a real service
 * (e.g. Resend, Postmark, SES) before launch — until then this only logs,
 * so "send acknowledgment" / "notify administrator" are architecturally
 * wired into the submission flow but not actually delivered.
 */
export async function notifySponsorshipRequestSubmitted(input: {
  requestId: string;
  contactName: string;
  organizationName: string;
  email: string;
}) {
  console.info(
    `[notifications] TODO: email provider not configured — would send requester ` +
      `acknowledgment to ${input.email} and notify the campaign administrator ` +
      `about sponsorship request ${input.requestId} from ${input.organizationName} ` +
      `(${input.contactName}).`,
  );
}

/**
 * Same "architecturally wired, not yet delivered" state as
 * notifySponsorshipRequestSubmitted above — the applicant's on-screen
 * confirmation (see TriathlonTeamApplicationForm's success state) is the
 * real confirmation until a real email provider is configured.
 */
export async function notifyTriathlonTeamApplicationSubmitted(input: {
  applicationId: string;
  fullName: string;
  email: string;
}) {
  console.info(
    `[notifications] TODO: email provider not configured — would send ${input.fullName} ` +
      `(${input.email}) a confirmation email and notify the campaign administrator about ` +
      `Triathlon Team application ${input.applicationId}.`,
  );
}

/**
 * Same "architecturally wired, not yet delivered" state as
 * notifyTriathlonTeamApplicationSubmitted above — the on-screen success
 * state (see RegistrationSuccess, which already hands the participant the
 * Promo Kit directly) is the real confirmation until a real email provider
 * is configured. The subject/body built below is the actual, ready-to-send
 * confirmation email content per the Promo Kit brief — once a provider is
 * wired in, sending it is a matter of passing this content through, not
 * writing it from scratch.
 */
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
    `[${REGISTRATION_EMAIL_CONTENT.primaryButtonLabel}](${promoKitZipUrl})`,
    `[${REGISTRATION_EMAIL_CONTENT.secondaryButtonLabel}](${eventPageUrl})`,
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

  console.info(
    `[notifications] TODO: email provider not configured — would send ${input.firstName} ` +
      `${input.lastName} (${input.email}) this confirmation email and notify the campaign ` +
      `administrator about 22 For the 22 registration ${input.registrationId}.\n` +
      `Subject: ${REGISTRATION_EMAIL_CONTENT.subject}\n${emailBody}`,
  );
}
