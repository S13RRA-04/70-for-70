import { NextResponse } from "next/server";
import { subscribeToUpdates } from "@/lib/email-list";
import { handlePublicForm } from "@/lib/public-write";
import { emailSignupSchema } from "@/lib/validation/email-signup";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "subscribe",
      binding: "RATE_LIMITER_FORMS",
      schema: emailSignupSchema,
      turnstileAction: "email_signup",
    },
    "subscribe",
    async ({ firstName, email }) => {
      await subscribeToUpdates(firstName, email);
      return NextResponse.json({ ok: true });
    },
  );
}
