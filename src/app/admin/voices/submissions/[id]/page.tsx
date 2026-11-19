import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { SUBMISSION_STATUSES, SUBMISSION_STATUS_LABELS } from "@/lib/voices/model";
import { adminDownloadUrl } from "@/lib/voices/storage";
import type { VoicesSubmissionRow, VoicesTalentRow } from "@/types/voices";
import { purgeSubmissionFilesAction, updateSubmissionAction } from "../../actions";
import { AdminHeader, BUTTON, BUTTON_DANGER, BUTTON_SECONDARY, Flash, INPUT, Labeled, Panel, Pill, formatDate, formatDateTime } from "../../ui";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-ink/5 py-2 sm:grid-cols-[200px_1fr]">
      <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-light">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm text-ink">{children || "—"}</dd>
    </div>
  );
}

export default async function SubmissionDetailPage(props: PageProps<"/admin/voices/submissions/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminClient();
  const [{ data }, { data: talentData }] = await Promise.all([
    admin.from("voices_submissions").select("*").eq("id", id).maybeSingle(),
    admin.from("voices_talent").select("id, name").order("name"),
  ]);
  const s = data as VoicesSubmissionRow | null;
  if (!s) notFound();
  const talent = (talentData ?? []) as Pick<VoicesTalentRow, "id" | "name">[];

  // Short-lived (10 min), download-disposition links. Raw uploads are never public.
  const [videoUrl, headshotUrl, releaseUrl] = await Promise.all([
    adminDownloadUrl(s.video_path),
    adminDownloadUrl(s.headshot_path),
    adminDownloadUrl(s.release_path),
  ]);
  const safeLink = s.video_link?.startsWith("https://") ? s.video_link : null;

  return (
    <Container className="max-w-5xl py-12">
      <AdminHeader
        title={s.participant_name}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono">{s.reference_code}</span> · {s.source === "admin" ? "Logged by admin" : "Portal submission"} · <Pill tone="info">{SUBMISSION_STATUS_LABELS[s.review_status]}</Pill>
          </span>
        }
      />
      <Flash searchParams={searchParams} />

      <Panel title="Recording">
        {s.files_deleted_at && <p className="mb-3 text-sm text-red-800">Stored files were deleted on {formatDateTime(s.files_deleted_at)}.</p>}
        <div className="flex flex-wrap gap-3">
          {videoUrl && <a href={videoUrl} className={BUTTON} rel="noopener">Download video{s.video_original_name ? ` (${s.video_original_name})` : ""}</a>}
          {headshotUrl && <a href={headshotUrl} className={BUTTON_SECONDARY} rel="noopener">Download headshot</a>}
          {releaseUrl && <a href={releaseUrl} className={BUTTON_SECONDARY} rel="noopener">Download signed release</a>}
        </div>
        {s.video_link && (
          <div className="mt-4 rounded-sm border border-bronze/40 bg-bronze/10 p-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-bronze">External link — untrusted, never fetched by the server</p>
            <p className="mt-1 break-all font-mono text-xs">{s.video_link}</p>
            {safeLink && <a href={safeLink} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 inline-block text-xs font-semibold underline">Open in a new tab</a>}
          </div>
        )}
        {Object.keys(s.file_check ?? {}).length > 0 && (
          <ul className="mt-4 text-xs text-charcoal-light">
            {Object.entries(s.file_check).map(([kind, check]) => (
              <li key={kind}>
                {kind}: {check.ok ? `verified (${check.detected})` : `rejected — ${check.error ?? check.detected ?? "unknown"}`}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-charcoal-light">
          Files were checked by signature, not scanned for malware (Supabase Storage has no built-in scanning). Open downloads on an up-to-date machine.
        </p>
      </Panel>

      <Panel title="Submission details">
        <dl>
          <Row label="Submitted by">{`${s.submitter_name} <${s.submitter_email}>`}</Row>
          <Row label="Relationship">{s.relationship}</Row>
          <Row label="Professional title">{s.professional_title}</Row>
          <Row label="Representative / agency">{s.representative_agency}</Row>
          <Row label="Preferred attribution">{s.preferred_attribution}</Row>
          <Row label="Social handles">{s.social_handles}</Row>
          <Row label="Website">{s.website}</Row>
          <Row label="Suggested publication">{s.suggested_publication_date && formatDate(s.suggested_publication_date)}</Row>
          <Row label="Additional instructions">{s.additional_instructions}</Row>
          <Row label="Authorized / terms">{`${s.authorized_confirmed ? "Confirmed authority" : "No"} · ${s.terms_acknowledged ? "Acknowledged terms" : "No"}`}</Row>
          <Row label="Submitted">{formatDateTime(s.submitted_at ?? s.created_at)}</Row>
          <Row label="Last review">{s.reviewed_at && `${formatDateTime(s.reviewed_at)} by ${s.reviewed_by}`}</Row>
        </dl>
      </Panel>

      <Panel title="Review">
        <form action={updateSubmissionAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={s.id} />
          <Labeled label="Review status" hint="Approving the recording does NOT publish it or grant permission.">
            <select name="review_status" defaultValue={s.review_status} className={INPUT}>
              {SUBMISSION_STATUSES.map((st) => <option key={st} value={st}>{SUBMISSION_STATUS_LABELS[st]}</option>)}
            </select>
          </Labeled>
          <Labeled label="Talent record">
            <select name="talent_id" defaultValue={s.talent_id ?? ""} className={INPUT}>
              <option value="">— Not linked —</option>
              {talent.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Labeled>
          <Labeled label="Embargo — do not publish before"><input type="date" name="embargo_until" defaultValue={s.embargo_until ?? ""} className={INPUT} /></Labeled>
          <Labeled label="Usage restrictions (from submitter)" className="sm:col-span-2"><textarea name="usage_restrictions" rows={2} defaultValue={s.usage_restrictions ?? ""} className={INPUT} /></Labeled>
          <Labeled label="Reviewer notes (internal)" className="sm:col-span-2"><textarea name="reviewer_notes" rows={3} defaultValue={s.reviewer_notes ?? ""} className={INPUT} /></Labeled>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button type="submit" className={BUTTON}>Save review</button>
            {!s.talent_id && <Link href={`/admin/voices/talent/new?from_submission=${s.id}`} className={BUTTON_SECONDARY}>Create talent from this submission</Link>}
            {s.talent_id && <Link href={`/admin/voices/talent/${s.talent_id}`} className={BUTTON_SECONDARY}>Open talent record</Link>}
            {s.talent_id && s.review_status === "approved" && (
              <Link href={`/admin/voices/permissions/new?talent=${s.talent_id}&submission=${s.id}`} className={BUTTON_SECONDARY}>Record permission agreement</Link>
            )}
          </div>
        </form>
      </Panel>

      {!s.files_deleted_at && (s.video_path || s.headshot_path || s.release_path) && (
        <Panel title="Retention & deletion">
          <form action={purgeSubmissionFilesAction} className="flex flex-wrap items-center gap-4">
            <input type="hidden" name="id" value={s.id} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" /> Permanently delete the stored video, headshot and release (keeps this metadata record)</label>
            <button type="submit" className={BUTTON_DANGER}>Delete files</button>
          </form>
        </Panel>
      )}
    </Container>
  );
}
