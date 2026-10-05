import { NextResponse } from "next/server";
import { handlePublicForm, insertionFailed, skipWhenSupabaseUnconfigured } from "@/lib/public-write";
import { createAdminClient } from "@/lib/supabase/admin";
import { journalCommentSchema } from "@/lib/validation/journal-comment";

export async function POST(request: Request) {
  return handlePublicForm(
    request,
    {
      rateLimitKey: "journal-comment",
      binding: "RATE_LIMITER_FORMS",
      schema: journalCommentSchema,
      turnstileAction: "journal_comment",
    },
    "journal-comments",
    async (payload) => {
      const unconfigured = skipWhenSupabaseUnconfigured("journal-comments", payload);
      if (unconfigured) return unconfigured;

      const { journalEntryId, email, name, body } = payload;

      // Unapproved by default — nothing reaches the public post until an
      // admin approves it at /admin/journal-comments.
      const { error } = await createAdminClient().from("journal_comments").insert({
        journal_entry_id: journalEntryId,
        name,
        email: email || null,
        body,
        approved: false,
      });

      return insertionFailed("journal-comments", error) ?? NextResponse.json({ ok: true });
    },
  );
}
