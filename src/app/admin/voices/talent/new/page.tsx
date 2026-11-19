import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { createTalentAction } from "../../actions";
import { TalentFields } from "../../talent-fields";
import { AdminHeader, BUTTON, Flash, param } from "../../ui";

export default async function NewTalentPage(props: PageProps<"/admin/voices/talent/new">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const fromSubmission = param(searchParams, "from_submission");

  let defaults: { name?: string; professional_title?: string } | undefined;
  if (fromSubmission) {
    const { data } = await createAdminClient()
      .from("voices_submissions")
      .select("participant_name, professional_title")
      .eq("id", fromSubmission)
      .maybeSingle();
    if (data) defaults = { name: data.participant_name, professional_title: data.professional_title ?? undefined };
  }

  return (
    <Container className="max-w-5xl py-12">
      <AdminHeader title="Add talent" subtitle="A prospect, invitee or participant. Nothing here is public." />
      <Flash searchParams={searchParams} />
      <form action={createTalentAction} className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        {fromSubmission && <input type="hidden" name="from_submission" value={fromSubmission} />}
        <TalentFields defaults={defaults} />
        <button type="submit" className={`${BUTTON} mt-6`}>Create</button>
      </form>
    </Container>
  );
}
