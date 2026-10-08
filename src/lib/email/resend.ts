import "server-only";
import { logServerError, logServerWarn } from "@/lib/log";

/**
 * Resend client. Deliberately inert until RESEND_API_KEY is configured: every
 * call here logs and returns instead of throwing, so a missing/misconfigured
 * provider (or a flaky Resend API call) never breaks the form submission that
 * triggered it — the same fail-open-while-unconfigured shape as
 * src/lib/turnstile.ts, except sends additionally swallow errors once
 * configured too, since "the donation/registration saved but the confirmation
 * email didn't send" must never surface as a failed submission to the user.
 */

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const RESEND_AUDIENCES_URL = "https://api.resend.com/audiences";

const DEFAULT_FROM = "For The 22 <notifications@forthe22.org>";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logServerWarn("resend: not configured, email not sent", { subject: input.subject });
    return;
  }

  try {
    const res = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
        reply_to: input.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      logServerError("resend: send failed", new Error(`${res.status} ${await res.text()}`));
    }
  } catch (error) {
    logServerError("resend: send threw", error);
  }
}

/**
 * Adds a contact to the Resend Audience used for the newsletter signup list
 * (see src/lib/email-list.ts). Requires both RESEND_API_KEY and
 * RESEND_AUDIENCE_ID (the audience must already exist in the Resend
 * dashboard). Returns whether the sync succeeded so the caller can record
 * `synced_to_provider` accurately instead of assuming success.
 */
export async function addContactToAudience(input: {
  email: string;
  firstName?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    logServerWarn("resend: audience not configured, contact not synced", { email: input.email });
    return false;
  }

  try {
    const res = await fetch(`${RESEND_AUDIENCES_URL}/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        first_name: input.firstName,
        unsubscribed: false,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      logServerError("resend: add contact failed", new Error(`${res.status} ${await res.text()}`));
      return false;
    }
    return true;
  } catch (error) {
    logServerError("resend: add contact threw", error);
    return false;
  }
}
