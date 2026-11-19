import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { SUBMITTER_RELATIONSHIPS } from "@/lib/voices/model";
import type { VoicesTalentRow } from "@/types/voices";
import { createAdminSubmissionAction } from "../../actions";
import { AdminUpload } from "../../admin-upload";
import { AdminHeader, BUTTON, Flash, INPUT, Labeled, param } from "../../ui";

/**
 * For recordings that arrived outside the portal — an emailed link, or a
 * video already in hand. Creates a normal submission so it goes through the
 * same review → permission → publication gate.
 */
export default async function NewAdminSubmissionPage(props: PageProps<"/admin/voices/submissions/new">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const preselected = param(searchParams, "talent");
  const { data } = await createAdminClient().from("voices_talent").select("id, name").order("name");
  const talent = (data ?? []) as Pick<VoicesTalentRow, "id" | "name">[];

  return (
    <Container className="max-w-4xl py-12">
      <AdminHeader title="Log a recording" subtitle="Received outside the portal. It still needs review, a signed agreement and the publication gate." />
      <Flash searchParams={searchParams} />
      <form action={createAdminSubmissionAction} className="mt-8 grid gap-4 rounded-sm border border-ink/10 bg-off-white p-6 sm:grid-cols-2">
        <Labeled label="Talent record *">
          <select name="talent_id" defaultValue={preselected} required className={INPUT}>
            <option value="">— Choose —</option>
            {talent.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Labeled>
        <Labeled label="Relationship of sender">
          <select name="relationship" defaultValue="Other authorized representative" className={INPUT}>
            {SUBMITTER_RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Labeled>
        <Labeled label="Received from (name)"><input name="submitter_name" className={INPUT} /></Labeled>
        <Labeled label="Received from (email)"><input name="submitter_email" type="email" className={INPUT} /></Labeled>
        <div className="sm:col-span-2">
          <AdminUpload scope="submission" name="video_path" onUploadedName="video_original_name" label="Upload the video (MP4/MOV — stored privately)" accept=".mp4,.mov,video/mp4,video/quicktime" />
        </div>
        <Labeled label="…or https link" className="sm:col-span-2"><input name="video_link" type="url" placeholder="https://" className={INPUT} /></Labeled>
        <Labeled label="Embargo — do not publish before"><input type="date" name="embargo_until" className={INPUT} /></Labeled>
        <Labeled label="Usage restrictions" className="sm:col-span-2"><textarea name="usage_restrictions" rows={2} className={INPUT} /></Labeled>
        <Labeled label="Notes" className="sm:col-span-2"><textarea name="reviewer_notes" rows={2} className={INPUT} /></Labeled>
        <div className="sm:col-span-2"><button type="submit" className={BUTTON}>Log recording</button></div>
      </form>
    </Container>
  );
}
