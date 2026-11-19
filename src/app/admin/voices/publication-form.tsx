import { DISTRIBUTION_CHANNELS, DISTRIBUTION_CHANNEL_LABELS, TALENT_CATEGORIES, TALENT_CATEGORY_LABELS, humanize } from "@/lib/voices/model";
import type { VoicesPermissionRow, VoicesPublicationRow, VoicesSubmissionRow, VoicesTalentRow } from "@/types/voices";
import { savePublicationAction } from "./actions";
import { AdminUpload } from "./admin-upload";
import { BUTTON, INPUT, Labeled, toDateTimeLocal } from "./ui";

/** Draft editor for a publication. Saving never publishes — that's the gated action. */
export function PublicationForm({
  talent,
  publication,
  submissions,
  permissions,
}: {
  talent: Pick<VoicesTalentRow, "id" | "name" | "category" | "public_attribution">;
  publication?: VoicesPublicationRow | null;
  submissions: Pick<VoicesSubmissionRow, "id" | "reference_code" | "review_status">[];
  permissions: Pick<VoicesPermissionRow, "id" | "release_version" | "status" | "approved_attribution">[];
}) {
  const signed = permissions.find((p) => p.status === "signed");
  const approved = submissions.find((s) => s.review_status === "approved");
  const channels = publication?.channels ?? ["website"];
  return (
    <form action={savePublicationAction} className="grid gap-4 sm:grid-cols-2">
      {publication && <input type="hidden" name="id" value={publication.id} />}
      <input type="hidden" name="talent_id" value={talent.id} />

      <Labeled label="Display name *"><input name="display_name" required defaultValue={publication?.display_name ?? talent.name} className={INPUT} /></Labeled>
      <Labeled label="URL slug" hint="/voices/<slug> — never change after publishing."><input name="slug" defaultValue={publication?.slug ?? ""} placeholder="auto from name" className={INPUT} /></Labeled>
      <Labeled label="Attribution" hint="Must match the agreement's approved attribution.">
        <input name="attribution" defaultValue={publication?.attribution ?? signed?.approved_attribution ?? talent.public_attribution ?? ""} className={INPUT} />
      </Labeled>
      <Labeled label="Category">
        <select name="category" defaultValue={publication?.category ?? talent.category} className={INPUT}>
          {TALENT_CATEGORIES.map((c) => <option key={c} value={c}>{TALENT_CATEGORY_LABELS[c]}</option>)}
        </select>
      </Labeled>
      <Labeled label="Approved submission">
        <select name="submission_id" defaultValue={publication?.submission_id ?? approved?.id ?? ""} className={INPUT}>
          <option value="">—</option>
          {submissions.map((s) => <option key={s.id} value={s.id}>{s.reference_code} ({humanize(s.review_status)})</option>)}
        </select>
      </Labeled>
      <Labeled label="Permission agreement">
        <select name="permission_id" defaultValue={publication?.permission_id ?? signed?.id ?? ""} className={INPUT}>
          <option value="">—</option>
          {permissions.map((p) => <option key={p.id} value={p.id}>v{p.release_version} ({humanize(p.status)})</option>)}
        </select>
      </Labeled>
      <Labeled label="Summary (one or two sentences, never an invented quote)" className="sm:col-span-2">
        <textarea name="summary" rows={2} maxLength={1000} defaultValue={publication?.summary ?? ""} className={INPUT} />
      </Labeled>
      <Labeled label="Reviewed transcript (blank line between paragraphs)" className="sm:col-span-2">
        <textarea name="transcript" rows={5} defaultValue={publication?.transcript ?? ""} className={INPUT} />
      </Labeled>

      <div className="grid gap-4 rounded-sm border border-ink/10 bg-white p-4 sm:col-span-2 sm:grid-cols-2">
        <p className="text-xs text-charcoal-light sm:col-span-2">
          Prepared public assets. Upload the final, edited video here (public bucket) — never the raw submission. A site path like
          /video/voices-jon-stewart.mp4 also works for videos already in the repo.
        </p>
        <AdminUpload scope="publication" name="video_upload" label="Upload final video (MP4)" accept=".mp4,video/mp4" />
        <Labeled label="…or video URL / site path"><input name="video_url" defaultValue={publication?.video_url ?? ""} placeholder="/video/… or https://…" className={INPUT} /></Labeled>
        <AdminUpload scope="publication" name="poster_upload" label="Upload poster (JPG/PNG/WebP)" accept=".jpg,.jpeg,.png,.webp" />
        <Labeled label="…or poster URL / site path"><input name="poster_url" defaultValue={publication?.poster_url ?? ""} className={INPUT} /></Labeled>
        <AdminUpload scope="publication" name="captions_upload" label="Upload captions (WebVTT .vtt)" accept=".vtt,text/vtt" />
        <Labeled label="…or captions URL / site path"><input name="captions_url" defaultValue={publication?.captions_url ?? ""} className={INPUT} /></Labeled>
        <Labeled label="Video type">
          <select name="video_type" defaultValue={publication?.video_type ?? "video/mp4"} className={INPUT}>
            <option value="video/mp4">video/mp4</option>
            <option value="video/quicktime">video/quicktime</option>
          </select>
        </Labeled>
      </div>

      <Labeled label="Optional external link (https)"><input name="external_url" type="url" defaultValue={publication?.external_url ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Go-live time (UTC)" hint="Blank = immediately when published. A future time schedules it.">
        <input type="datetime-local" name="publish_at" defaultValue={toDateTimeLocal(publication?.publish_at)} className={INPUT} />
      </Labeled>
      <Labeled label="Display order" hint="Lower first."><input type="number" name="display_order" defaultValue={publication?.display_order ?? 0} className={INPUT} /></Labeled>
      <fieldset className="sm:col-span-2">
        <legend className="text-xs font-medium text-ink">Distribution channels (must be permitted by the agreement)</legend>
        <div className="mt-2 flex flex-col gap-1.5">
          {DISTRIBUTION_CHANNELS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="channels" value={c} defaultChecked={channels.includes(c)} disabled={c === "website"} />
              {c === "website" && <input type="hidden" name="channels" value="website" />}
              {DISTRIBUTION_CHANNEL_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2"><button type="submit" className={BUTTON}>Save draft</button></div>
    </form>
  );
}
