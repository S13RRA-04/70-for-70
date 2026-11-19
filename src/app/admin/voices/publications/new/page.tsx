import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import type { VoicesPermissionRow, VoicesSubmissionRow, VoicesTalentRow } from "@/types/voices";
import { PublicationForm } from "../../publication-form";
import { AdminHeader, Flash, Panel, param } from "../../ui";

export default async function NewPublicationPage(props: PageProps<"/admin/voices/publications/new">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const talentId = param(searchParams, "talent");
  if (!/^[0-9a-f-]{36}$/i.test(talentId)) notFound();

  const admin = createAdminClient();
  const [{ data: talent }, { data: subs }, { data: perms }] = await Promise.all([
    admin.from("voices_talent").select("id, name, category, public_attribution").eq("id", talentId).maybeSingle(),
    admin.from("voices_submissions").select("id, reference_code, review_status").eq("talent_id", talentId),
    admin.from("voices_permission_agreements").select("id, release_version, status, approved_attribution").eq("talent_id", talentId),
  ]);
  if (!talent) notFound();

  return (
    <Container className="max-w-4xl py-12">
      <AdminHeader title={`New publication — ${talent.name}`} subtitle="Saved as a draft. Publishing is a separate, permission-gated step." back={{ href: `/admin/voices/talent/${talentId}#publications`, label: talent.name }} />
      <Flash searchParams={searchParams} />
      <Panel title="Draft">
        <PublicationForm
          talent={talent as Pick<VoicesTalentRow, "id" | "name" | "category" | "public_attribution">}
          submissions={(subs ?? []) as Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[]}
          permissions={(perms ?? []) as Pick<VoicesPermissionRow, "id" | "release_version" | "status" | "approved_attribution">[]}
        />
      </Panel>
    </Container>
  );
}
