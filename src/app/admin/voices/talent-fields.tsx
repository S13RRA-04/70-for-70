import { OUTREACH_STATUSES, OUTREACH_STATUS_LABELS, TALENT_CATEGORIES, TALENT_CATEGORY_LABELS } from "@/lib/voices/model";
import type { VoicesTalentRow } from "@/types/voices";
import { INPUT, Labeled } from "./ui";

/** The talent record's own fields — shared by the create and edit forms. */
export function TalentFields({ talent, defaults }: { talent?: VoicesTalentRow | null; defaults?: { name?: string; professional_title?: string } }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Labeled label="Participant name *"><input name="name" required maxLength={200} defaultValue={talent?.name ?? defaults?.name ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Category">
        <select name="category" defaultValue={talent?.category ?? "other"} className={INPUT}>
          {TALENT_CATEGORIES.map((c) => <option key={c} value={c}>{TALENT_CATEGORY_LABELS[c]}</option>)}
        </select>
      </Labeled>
      <Labeled label="Outreach status" hint="Separate from submission review and permission status.">
        <select name="outreach_status" defaultValue={talent?.outreach_status ?? "identified"} className={INPUT}>
          {OUTREACH_STATUSES.map((s) => <option key={s} value={s}>{OUTREACH_STATUS_LABELS[s]}</option>)}
        </select>
      </Labeled>
      <Labeled label="Professional title"><input name="professional_title" maxLength={200} defaultValue={talent?.professional_title ?? defaults?.professional_title ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Public attribution" hint="Only used publicly once an agreement approves it.">
        <input name="public_attribution" maxLength={300} defaultValue={talent?.public_attribution ?? ""} className={INPUT} />
      </Labeled>
      <Labeled label="Contact source" hint="Where the contact info came from (e.g. agency site, referral).">
        <input name="contact_source" maxLength={500} defaultValue={talent?.contact_source ?? ""} className={INPUT} />
      </Labeled>
      <Labeled label="Source verified on"><input type="date" name="source_verified_on" defaultValue={talent?.source_verified_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="First outreach"><input type="date" name="outreach_on" defaultValue={talent?.outreach_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Last contact"><input type="date" name="last_contact_on" defaultValue={talent?.last_contact_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Follow up on"><input type="date" name="follow_up_on" defaultValue={talent?.follow_up_on ?? ""} className={INPUT} /></Labeled>
      <Labeled label="Response summary" className="sm:col-span-2">
        <textarea name="response_summary" rows={2} defaultValue={talent?.response_summary ?? ""} className={INPUT} />
      </Labeled>
      <Labeled label="Internal notes (never public)" className="sm:col-span-2 lg:col-span-3">
        <textarea name="internal_notes" rows={4} defaultValue={talent?.internal_notes ?? ""} className={INPUT} />
      </Labeled>
    </div>
  );
}
