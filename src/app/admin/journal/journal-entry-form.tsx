"use client";

import { useState } from "react";
import { JournalMarkdown } from "@/components/journal/journal-markdown";
import { JournalImageUpload } from "./journal-image-upload";
import { saveJournalEntryAction } from "./actions";
import type { JournalEntryRow, JournalGalleryImage, PartnerRow } from "@/types/database";

const CATEGORIES: JournalEntryRow["primary_category"][] = [
  "Training",
  "Fundraising",
  "Mighty Oaks",
  "Sponsors",
  "Race Prep",
  "Milestones",
];

const DISCIPLINES: NonNullable<JournalEntryRow["training_discipline"]>[] = [
  "swim",
  "bike",
  "run",
  "brick",
  "strength",
  "rest",
];

const GALLERY_SLOTS = 6;

const inputClass =
  "mt-1.5 block w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-bronze";
const labelClass = "text-xs font-medium text-ink";

interface JournalEntryFormProps {
  entry?: JournalEntryRow;
  partners: PartnerRow[];
  partnerMentionIds?: string[];
  beneficiaryMentionIds?: string[];
}

export function JournalEntryForm({
  entry,
  partners,
  partnerMentionIds = [],
  beneficiaryMentionIds = [],
}: JournalEntryFormProps) {
  const [body, setBody] = useState(entry?.body ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [slug, setSlug] = useState(entry?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(entry));
  const gallery = entry?.gallery ?? [];
  const [isScheduling, setIsScheduling] = useState(entry?.status === "scheduled");
  // datetime-local inputs need "YYYY-MM-DDTHH:mm", not a full ISO timestamp.
  const scheduledForDefault = entry?.scheduled_for ? entry.scheduled_for.slice(0, 16) : "";

  function handleTitleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (slugTouched) return;
    const suggested = e.target.value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(suggested);
  }

  return (
    <form action={saveJournalEntryAction} className="mt-8 space-y-8">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Entry</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={entry?.title}
              onBlur={handleTitleBlur}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="post_type" className={labelClass}>
              Post Type
            </label>
            <select id="post_type" name="post_type" defaultValue={entry?.post_type ?? "article"} className={inputClass}>
              <option value="article">Article</option>
              <option value="vlog">Vlog</option>
              <option value="photo">Photo Update</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>
          <div>
            <label htmlFor="primary_category" className={labelClass}>
              Primary Category
            </label>
            <select
              id="primary_category"
              name="primary_category"
              defaultValue={entry?.primary_category ?? "Training"}
              className={inputClass}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tags" className={labelClass}>
              Tags (comma-separated)
            </label>
            <input id="tags" name="tags" type="text" defaultValue={entry?.tags?.join(", ")} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="summary" className={labelClass}>
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={2}
              defaultValue={entry?.summary}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              defaultChecked={entry?.featured}
              className="h-4 w-4 accent-bronze"
            />
            <label htmlFor="featured" className="text-sm text-ink">
              Featured (shown as the large entry on /journal and the homepage)
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Body (Markdown)</h2>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-sm border border-ink/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        <div className="mt-4">
          {showPreview ? (
            <div className="min-h-[240px] rounded-sm border border-ink/10 p-4">
              <JournalMarkdown body={body || "*Nothing to preview yet.*"} />
            </div>
          ) : (
            <textarea
              name="body"
              required
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="block w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 font-mono text-sm text-ink outline-none focus-visible:border-bronze"
            />
          )}
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Media</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <JournalImageUpload label="Hero / Thumbnail Image" hiddenFieldName="image_url" defaultValue={entry?.image_url} />
          <div>
            <label htmlFor="video_url" className={labelClass}>
              Video URL (YouTube or Vimeo — vlog entries)
            </label>
            <input
              id="video_url"
              name="video_url"
              type="text"
              defaultValue={entry?.video_url ?? ""}
              className={inputClass}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Gallery (optional)</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: GALLERY_SLOTS }, (_, i) => i + 1).map((slot) => {
            const existing: JournalGalleryImage | undefined = gallery[slot - 1];
            return (
              <div key={slot} className="rounded-sm border border-ink/10 p-3">
                <JournalImageUpload
                  label={`Gallery Image ${slot}`}
                  hiddenFieldName={`gallery_url_${slot}`}
                  defaultValue={existing?.url}
                />
                <label htmlFor={`gallery_alt_${slot}`} className="mt-2 block text-xs font-medium text-ink">
                  Alt Text
                </label>
                <input
                  id={`gallery_alt_${slot}`}
                  name={`gallery_alt_${slot}`}
                  type="text"
                  defaultValue={existing?.alt}
                  className={inputClass}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Training Metrics (optional)
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="training_discipline" className={labelClass}>
              Discipline
            </label>
            <select
              id="training_discipline"
              name="training_discipline"
              defaultValue={entry?.training_discipline ?? ""}
              className={inputClass}
            >
              <option value="">—</option>
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="training_distance" className={labelClass}>
              Distance (mi)
            </label>
            <input
              id="training_distance"
              name="training_distance"
              type="number"
              step="0.01"
              defaultValue={entry?.training_distance ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="training_duration_minutes" className={labelClass}>
              Duration (min)
            </label>
            <input
              id="training_duration_minutes"
              name="training_duration_minutes"
              type="number"
              defaultValue={entry?.training_duration_minutes ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="training_pace" className={labelClass}>
              Avg Pace
            </label>
            <input id="training_pace" name="training_pace" type="text" defaultValue={entry?.training_pace ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="training_swim_pace" className={labelClass}>
              Swim Pace
            </label>
            <input
              id="training_swim_pace"
              name="training_swim_pace"
              type="text"
              defaultValue={entry?.training_swim_pace ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="training_elevation_ft" className={labelClass}>
              Elevation (ft)
            </label>
            <input
              id="training_elevation_ft"
              name="training_elevation_ft"
              type="number"
              defaultValue={entry?.training_elevation_ft ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="training_bike_power_watts" className={labelClass}>
              Avg Power (w)
            </label>
            <input
              id="training_bike_power_watts"
              name="training_bike_power_watts"
              type="number"
              defaultValue={entry?.training_bike_power_watts ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="training_avg_hr" className={labelClass}>
              Avg HR (bpm)
            </label>
            <input id="training_avg_hr" name="training_avg_hr" type="number" defaultValue={entry?.training_avg_hr ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="training_rpe" className={labelClass}>
              RPE (1–10)
            </label>
            <input id="training_rpe" name="training_rpe" type="number" min={1} max={10} defaultValue={entry?.training_rpe ?? ""} className={inputClass} />
          </div>
          <div>
            <label htmlFor="training_phase" className={labelClass}>
              Training Phase
            </label>
            <input id="training_phase" name="training_phase" type="text" defaultValue={entry?.training_phase ?? ""} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Milestone (optional)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="milestone_kind" className={labelClass}>
              Milestone Kind
            </label>
            <select id="milestone_kind" name="milestone_kind" defaultValue={entry?.milestone_kind ?? ""} className={inputClass}>
              <option value="">—</option>
              <option value="fundraising">Fundraising</option>
              <option value="training">Training</option>
            </select>
          </div>
          <div>
            <label htmlFor="milestone_value" className={labelClass}>
              Headline Value
            </label>
            <input
              id="milestone_value"
              name="milestone_value"
              type="text"
              placeholder="$10,000 or First 2,000-Yard Swim"
              defaultValue={entry?.milestone_value ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-off-white p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Disclosure &amp; Mentions</h2>
        <div className="mt-4">
          <label htmlFor="sponsor_disclosure" className={labelClass}>
            Sponsor Disclosure (shown prominently near the top of the post — leave blank for none)
          </label>
          <textarea
            id="sponsor_disclosure"
            name="sponsor_disclosure"
            rows={2}
            defaultValue={entry?.sponsor_disclosure ?? ""}
            className={inputClass}
          />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Partner Mentions</p>
            <div className="mt-2 space-y-1.5">
              {partners.length === 0 && <p className="text-xs text-charcoal-light/70">No partners yet.</p>}
              {partners.map((partner) => (
                <label key={partner.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="partner_mentions"
                    value={partner.id}
                    defaultChecked={partnerMentionIds.includes(partner.id)}
                    className="h-4 w-4 accent-bronze"
                  />
                  {partner.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">Beneficiary Mentions</p>
            <div className="mt-2 space-y-1.5">
              {partners.length === 0 && <p className="text-xs text-charcoal-light/70">No beneficiaries yet.</p>}
              {partners.map((partner) => (
                <label key={partner.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="beneficiary_mentions"
                    value={partner.id}
                    defaultChecked={beneficiaryMentionIds.includes(partner.id)}
                    className="h-4 w-4 accent-bronze"
                  />
                  {partner.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-sand-light p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">Publish</h2>
        <div className="mt-4 flex items-center gap-2">
          <input
            id="schedule-toggle"
            type="checkbox"
            checked={isScheduling}
            onChange={(e) => setIsScheduling(e.target.checked)}
            className="h-4 w-4 accent-bronze"
          />
          <label htmlFor="schedule-toggle" className="text-sm text-ink">
            Schedule for later instead of publishing now
          </label>
        </div>
        {isScheduling && (
          <div className="mt-3">
            <label htmlFor="scheduled_for" className={labelClass}>
              Scheduled For
            </label>
            <input
              id="scheduled_for"
              name="scheduled_for"
              type="datetime-local"
              defaultValue={scheduledForDefault}
              className={inputClass}
              required={isScheduling}
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            className="rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
          >
            Save Draft
          </button>
          {isScheduling ? (
            <button
              type="submit"
              name="intent"
              value="schedule"
              className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Schedule
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="publish"
              className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              Publish Now
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
