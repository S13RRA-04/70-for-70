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
