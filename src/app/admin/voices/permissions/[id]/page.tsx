import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { humanize } from "@/lib/voices/model";
import { adminDownloadUrl } from "@/lib/voices/storage";
import type { VoicesPermissionRow, VoicesSubmissionRow } from "@/types/voices";
import { revokePermissionAction } from "../../actions";
import { PermissionForm } from "../../permission-form";
import { AdminHeader, BUTTON_DANGER, BUTTON_SECONDARY, Flash, INPUT, Labeled, Panel, Pill, formatDateTime } from "../../ui";

export default async function PermissionDetailPage(props: PageProps<"/admin/voices/permissions/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminClient();
  const { data } = await admin.from("voices_permission_agreements").select("*").eq("id", id).maybeSingle();
  const permission = data as VoicesPermissionRow | null;
  if (!permission) notFound();

  const [{ data: talent }, { data: subs }, docUrl] = await Promise.all([
    admin.from("voices_talent").select("id, name").eq("id", permission.talent_id).single(),
    admin.from("voices_submissions").select("id, reference_code, review_status").eq("talent_id", permission.talent_id),
    adminDownloadUrl(permission.signed_document_path),
  ]);
  const revoked = permission.status === "revoked";

  return (
    <Container className="max-w-4xl py-12">
      <AdminHeader
        title={`Agreement — ${talent?.name ?? "talent"}`}
        back={{ href: `/admin/voices/talent/${permission.talent_id}#permissions`, label: talent?.name ?? "Talent" }}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            Release v{permission.release_version} ·{" "}
            <Pill tone={permission.status === "signed" ? "good" : revoked || permission.status === "expired" ? "bad" : "warn"}>{humanize(permission.status)}</Pill>
          </span>
        }
      />
      <Flash searchParams={searchParams} />

      {docUrl && (
        <p className="mt-6">
          <a href={docUrl} className={BUTTON_SECONDARY}>Download signed document</a>
        </p>
      )}

      {revoked ? (
        <Panel title="Revoked">
          <p className="text-sm text-ink">Revoked {formatDateTime(permission.revoked_at)} — {permission.revocation_reason}</p>
          <p className="mt-2 text-xs text-charcoal-light">Revoked agreements are kept for the audit trail and can&apos;t be edited. Record a new agreement if consent is given again.</p>
        </Panel>
      ) : (
        <>
          <Panel title="Agreement">
            <PermissionForm talentId={permission.talent_id} permission={permission} submissions={(subs ?? []) as Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[]} />
          </Panel>
          <Panel title="Revoke permission">
            <form action={revokePermissionAction} className="grid gap-3">
              <input type="hidden" name="id" value={permission.id} />
              <Labeled label="Reason (e.g. withdrawal request received by email on …)"><textarea name="revocation_reason" required rows={2} className={INPUT} /></Labeled>
              <p className="text-xs text-charcoal-light">Revoking immediately unpublishes every publication that relies on this agreement.</p>
              <div><button type="submit" className={BUTTON_DANGER}>Revoke & unpublish</button></div>
            </form>
          </Panel>
        </>
      )}
    </Container>
  );
}
