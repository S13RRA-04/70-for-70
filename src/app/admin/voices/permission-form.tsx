import { RELEASE_VERSION } from "@/lib/content/voices-talent";
import {
  DISTRIBUTION_CHANNELS,
  DISTRIBUTION_CHANNEL_LABELS,
  PERMISSION_STATUSES,
  PERMITTED_EDITS,
  PERMITTED_EDIT_LABELS,
  humanize,
} from "@/lib/voices/model";
import type { VoicesPermissionRow, VoicesSubmissionRow } from "@/types/voices";
import { savePermissionAction } from "./actions";
import { AdminUpload } from "./admin-upload";
import { BUTTON, INPUT, Labeled } from "./ui";

/** Create/edit form for a permission agreement. Revocation is a separate action. */
export function PermissionForm({
  talentId,
  permission,
  submissions,
  defaultSubmissionId,
}: {
  talentId: string;
  permission?: VoicesPermissionRow | null;
  submissions: Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[];
  defaultSubmissionId?: string;
}) {
  const channels = permission?.permitted_channels ?? ["website"];
  const edits = permission?.permitted_edits ?? ["length", "captions", "accessibility", "audio_normalization", "aspect_ratio"];
  return (
    <form action={savePermissionAction} className="grid gap-4 sm:grid-cols-2">
      {permission && <input type="hidden" name="id" value={permission.id} />}
      <input type="hidden" name="talent_id" value={talentId} />

      <Labeled label="Status" hint="Only “Signed” allows publication. Use Revoke (below) to withdraw consent.">
        <select name="status" defaultValue={permission?.status === "revoked" ? "draft" : permission?.status ?? "draft"} className={INPUT}>
          {PERMISSION_STATUSES.filter((s) => s !== "revoked").map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </select>
      </Labeled>
      <Labeled label="Release version"><input name="release_version" defaultValue={permission?.release_version ?? RELEASE_VERSION} className={INPUT} /></Labeled>
      <Labeled label="Related submission">
        <select name="submission_id" defaultValue={permission?.submission_id ?? defaultSubmissionId ?? ""} className={INPUT}>
          <option value="">—</option>
          {submissions.map((s) => <option key={s.id} value={s.id}>{s.reference_code} ({humanize(s.review_status)})</option>)}
        </select>
      </Labeled>
      <Labeled label="Signed on"><input type="date" name="signed_on" defaultValue={permission?.signed_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Signatory name"><input name="signatory_name" defaultValue={permission?.signatory_name ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Signatory capacity">
        <select name="signatory_capacity" defaultValue={permission?.signatory_capacity ?? ""} className={INPUT}>
          <option value="">—</option>
          <option value="participant">Participant</option>
          <option value="authorized_representative">Authorized representative</option>
        </select>
      </Labeled>
      <Labeled label="Representative authority" hint="How the representative's authority was confirmed." className="sm:col-span-2">
        <textarea name="representative_authority" rows={2} defaultValue={permission?.representative_authority ?? ""} className={INPUT} />
      </Labeled>

      <fieldset className="sm:col-span-2">
        <legend className="text-xs font-medium text-ink">Approved distribution channels</legend>
        <div className="mt-2 flex flex-col gap-1.5">
          {DISTRIBUTION_CHANNELS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm"><input type="checkbox" name="permitted_channels" value={c} defaultChecked={channels.includes(c)} /> {DISTRIBUTION_CHANNEL_LABELS[c]}</label>
          ))}
        </div>
      </fieldset>
      <Labeled label="Approved mission-related channels (specify)" className="sm:col-span-2">
        <input name="approved_mission_channels" defaultValue={permission?.approved_mission_channels ?? ""} className={INPUT} />
      </Labeled>
      <fieldset className="sm:col-span-2">
        <legend className="text-xs font-medium text-ink">Permitted edits</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
          {PERMITTED_EDITS.map((e) => (
            <label key={e} className="flex items-center gap-2 text-sm"><input type="checkbox" name="permitted_edits" value={e} defaultChecked={edits.includes(e)} /> {PERMITTED_EDIT_LABELS[e]}</label>
          ))}
        </div>
      </fieldset>
      <Labeled label="Approved attribution" hint="Exactly how the name/title may appear."><input name="approved_attribution" defaultValue={permission?.approved_attribution ?? ""} className={INPUT} /></Labeled>
      <label className="flex items-center gap-2 self-end text-sm">
        <input type="checkbox" name="requires_participant_approval" defaultChecked={permission?.requires_participant_approval ?? false} /> Participant must approve the final video
      </label>
      <Labeled label="Usage starts"><input type="date" name="usage_starts_on" defaultValue={permission?.usage_starts_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Usage ends" hint="Blank = until withdrawn."><input type="date" name="usage_ends_on" defaultValue={permission?.usage_ends_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Restrictions & approval requirements" className="sm:col-span-2">
        <textarea name="restrictions" rows={3} defaultValue={permission?.restrictions ?? ""} className={INPUT} />
      </Labeled>
      <div className="sm:col-span-2">
        <AdminUpload scope="release" name="signed_document_path" label={permission?.signed_document_path ? "Replace signed document (PDF/JPG/PNG — private)" : "Signed document (PDF/JPG/PNG — private)"} accept=".pdf,.jpg,.jpeg,.png" />
      </div>
      <div className="sm:col-span-2"><button type="submit" className={BUTTON}>Save agreement</button></div>
    </form>
  );
}
