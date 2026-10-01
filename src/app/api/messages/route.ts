import { NextResponse } from "next/server";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { messageSchema } from "@/lib/validation/message";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "message",
      binding: "RATE_LIMITER_FORMS",
      schema: messageSchema,
      turnstileAction: "message",
    },
    "messages",
    async (payload) => {
      const unconfigured = skipWhenSupabaseUnconfigured("messages", payload);
      if (unconfigured) return unconfigured;

      // Unapproved by default — nothing reaches the public board until an
      // admin approves it at /admin/messages.
      const { error } = await createAdminClient().from("messages").insert({ ...payload, approved: false });

      return insertionFailed("messages", error) ?? NextResponse.json({ ok: true });
    },
  );
}
