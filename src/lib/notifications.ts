import "server-only";

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
 * message (see EventRegistrationForm's success state, which shows the
 * verbatim REGISTRATION_SUCCESS_MESSAGE) is the real confirmation until a
 * real email provider is configured.
 */
export async function notifyEventRegistrationSubmitted(input: {
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
}) {
  console.info(
    `[notifications] TODO: email provider not configured — would send ${input.firstName} ` +
      `${input.lastName} (${input.email}) a confirmation email and notify the campaign ` +
      `administrator about 22 For the 22 registration ${input.registrationId}.`,
  );
}
