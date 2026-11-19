import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { RELEASE_IS_DRAFT } from "@/lib/content/voices-talent";
import type { VoicesSubmissionRow } from "@/types/voices";
import { PermissionForm } from "../../permission-form";
import { AdminHeader, Flash, Panel, param } from "../../ui";

export default async function NewPermissionPage(props: PageProps<"/admin/voices/permissions/new">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const talentId = param(searchParams, "talent");
  if (!/^[0-9a-f-]{36}$/i.test(talentId)) notFound();

  const admin = createAdminClient();
  const [{ data: talent }, { data: subs }] = await Promise.all([
    admin.from("voices_talent").select("id, name").eq("id", talentId).maybeSingle(),
    admin.from("voices_submissions").select("id, reference_code, review_status").eq("talent_id", talentId).order("created_at", { ascending: false }),
  ]);
  if (!talent) notFound();

  return (
    <Container className="max-w-4xl py-12">
      <AdminHeader title={`Permission agreement — ${talent.name}`} back={{ href: `/admin/voices/talent/${talentId}#permissions`, label: talent.name }} />
      <Flash searchParams={searchParams} />
      {RELEASE_IS_DRAFT && (
        <p className="mt-6 rounded-sm border border-bronze/40 bg-bronze/10 p-3 text-sm text-ink">
          The participation release template is still a draft pending founder and legal review. Record exactly what the participant
          or representative agreed to in writing.
        </p>
      )}
      <Panel title="Agreement">
        <PermissionForm
          talentId={talentId}
          submissions={(subs ?? []) as Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[]}
          defaultSubmissionId={param(searchParams, "submission")}
        />
      </Panel>
    </Container>
  );
}
