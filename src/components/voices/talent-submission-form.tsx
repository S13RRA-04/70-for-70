"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Field,
  FORM_CONTROL_CLASS,
  FormError,
  FormSubmitButton,
  HoneypotField,
  controlClassName,
  fieldA11yProps,
} from "@/components/forms/form-parts";
import { TurnstileWidget, isTurnstileEnabled, type TurnstileWidgetHandle } from "@/components/forms/turnstile-widget";
import { formatBytes, uploadToSignedUrl } from "@/components/voices/upload-file";
import { PORTAL_PATHS, TALENT_CONTACT } from "@/lib/content/voices-talent";
import { ACCEPTED_EXTENSIONS, type UploadKind } from "@/lib/voices/file-signature";
import { SUBMITTER_RELATIONSHIPS } from "@/lib/voices/model";
import { VOICES_UPLOAD_LIMIT_MB, voicesSubmissionSchema } from "@/lib/validation/voices-submission";

type Phase = "idle" | "creating" | "uploading" | "finalizing" | "success" | "error";

interface PendingUpload {
  kind: UploadKind;
  signedUrl: string;
  contentType: string;
}

interface Pending {
  submissionId: string;
  finalizeToken: string;
  reference: string;
  uploads: PendingUpload[];
}

const KIND_LABEL: Record<UploadKind, string> = { video: "Video", headshot: "Headshot", release: "Signed release" };

function fileMeta(file: File | null) {
  return file ? { name: file.name, size: file.size, type: file.type } : null;
}

function firstErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Talent submission form. Three network steps, all visible to the user:
 *  1. POST /api/voices/submissions → reference + signed upload URLs
 *  2. PUT each file straight to private storage, with progress
 *  3. POST /api/voices/submissions/complete → server verifies file signatures
 * An interrupted upload keeps step 1's result so "Retry upload" resumes at
 * step 2 without creating a duplicate submission.
 */
export function TalentSubmissionForm() {
  const prefix = useId();
  const id = (name: string) => `${prefix}-${name}`;

  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<UploadKind, File | null>>({ video: null, headshot: null, release: null });
  const [progress, setProgress] = useState<Partial<Record<UploadKind, number>>>({});
  const [pending, setPending] = useState<Pending | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const renderedAtRef = useRef<number | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    renderedAtRef.current = Date.now();
    return () => abortRef.current.forEach((abort) => abort());
  }, []);

  useEffect(() => {
    if (phase === "success") successRef.current?.focus();
  }, [phase]);

  // Warn before leaving mid-upload.
  useEffect(() => {
    if (phase !== "uploading" && phase !== "finalizing") return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  async function uploadAndFinalize(next: Pending) {
    setPhase("uploading");
    setErrorMessage(null);
    try {
      await Promise.all(
        next.uploads.map(async (upload) => {
          const file = files[upload.kind];
          if (!file) throw new Error("missing_file");
          const task = uploadToSignedUrl(upload.signedUrl, file, upload.contentType, (fraction) =>
            setProgress((current) => ({ ...current, [upload.kind]: fraction })),
          );
          abortRef.current.push(task.abort);
          await task.promise;
        }),
      );
    } catch (error) {
      setPhase("error");
      const message = error instanceof Error ? error.message : "";
      setErrorMessage(
        message === "too_large"
          ? `That file is larger than our storage allows. Please share a secure link instead, or email ${TALENT_CONTACT.email}.`
          : "The upload was interrupted. Check your connection and press “Retry upload” — your details are saved.",
      );
      return;
    } finally {
      abortRef.current = [];
    }

    setPhase("finalizing");
    try {
      const res = await fetch("/api/voices/submissions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: next.submissionId, finalizeToken: next.finalizeToken }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; retry?: boolean };
      if (!res.ok || !json.ok) {
        setPhase("error");
        setErrorMessage(json.error ?? "We couldn't confirm your upload. Please try again.");
        if (!json.retry) setPending(null);
        return;
      }
      setPending(null);
      setReference(next.reference);
      setPhase("success");
    } catch {
      setPhase("error");
      setErrorMessage("We couldn't confirm your upload. Press “Retry upload” to try again.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) {
      await uploadAndFinalize(pending);
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");

    const payload = {
      participantName: text("participantName"),
      submitterName: text("submitterName"),
      submitterEmail: text("submitterEmail"),
      relationship: text("relationship"),
      video: fileMeta(files.video),
      videoLink: text("videoLink"),
      headshot: fileMeta(files.headshot),
      release: fileMeta(files.release),
      professionalTitle: text("professionalTitle"),
      representativeAgency: text("representativeAgency"),
      preferredAttribution: text("preferredAttribution"),
      socialHandles: text("socialHandles"),
      website: text("website"),
      suggestedPublicationDate: text("suggestedPublicationDate"),
      embargoUntil: text("embargoUntil"),
      usageRestrictions: text("usageRestrictions"),
      additionalInstructions: text("additionalInstructions"),
      authorized: data.get("authorized") === "on",
      termsAcknowledged: data.get("termsAcknowledged") === "on",
      companyWebsite: text("companyWebsite"),
      renderedAt: renderedAtRef.current ?? Date.now(),
      turnstileToken,
    };

    const parsed = voicesSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const errors = firstErrors(parsed.error.issues);
      setFieldErrors(errors);
      setPhase("error");
      setErrorMessage("Check the highlighted fields below.");
      const first = Object.keys(errors)[0];
      if (first) document.getElementById(id(first))?.focus();
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setPhase("creating");
    try {
      const res = await fetch("/api/voices/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        reference?: string;
        submissionId?: string;
        finalizeToken?: string;
        uploads?: PendingUpload[];
      };
      if (!res.ok || !json.ok) {
        setPhase("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (json.uploads && json.uploads.length > 0 && json.submissionId && json.finalizeToken && json.reference) {
        const next = {
          submissionId: json.submissionId,
          finalizeToken: json.finalizeToken,
          reference: json.reference,
          uploads: json.uploads,
        };
        setPending(next);
        await uploadAndFinalize(next);
        return;
      }
      setReference(json.reference ?? null);
      setPhase("success");
    } catch {
      setPhase("error");
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  }

  if (phase === "success") {
    return (
      <div ref={successRef} role="status" tabIndex={-1} className="rounded-xl border border-white/15 bg-white/5 p-8 text-white focus:outline-none sm:p-10">
        <p className="label-caps text-gold">Submission received</p>
        <h2 className="mt-3 font-display text-4xl uppercase leading-none">Thank you.</h2>
        {reference && (
          <p className="mt-5 text-lg">
            Your reference: <span className="font-mono font-bold tracking-wider text-gold">{reference}</span>
          </p>
        )}
        <ul className="mt-5 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-white/80">
          <li>We&apos;ve notified our founder and sent a confirmation to the email you provided.</li>
          <li>Every submission is reviewed. Submission does not guarantee publication, and nothing is published automatically.</li>
          <li>Nothing is published until written permission is recorded, and we honor any embargo or restriction you gave us.</li>
        </ul>
        <p className="mt-6 text-sm text-white/70">
          Questions or changes? Email{" "}
          <a className="underline underline-offset-4 hover:text-white" href={`mailto:${TALENT_CONTACT.email}`}>
            {TALENT_CONTACT.email}
          </a>{" "}
          with your reference.
        </p>
      </div>
    );
  }

  const busy = phase === "creating" || phase === "uploading" || phase === "finalizing";
  const control = (name: string) => controlClassName(FORM_CONTROL_CLASS, fieldErrors[name]);

  function fileInput(kind: UploadKind, label: string, hint: string, optional: boolean) {
    const file = files[kind];
    const accept = ACCEPTED_EXTENSIONS[kind].map((ext) => `.${ext}`).join(",") + (kind === "video" ? ",video/mp4,video/quicktime" : "");
    return (
      <Field id={id(kind)} label={label} optional={optional} error={fieldErrors[kind]}>
        <p className="mt-1 text-xs text-charcoal-light">{hint}</p>
        <input
          id={id(kind)}
          type="file"
          accept={accept}
          disabled={busy || Boolean(pending)}
          onChange={(event) => setFiles((current) => ({ ...current, [kind]: event.target.files?.[0] ?? null }))}
          className={`${control(kind)} file:mr-3 file:rounded-sm file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-white`}
          {...fieldA11yProps(id(kind), fieldErrors[kind])}
        />
        {file && <p className="mt-1 text-xs text-charcoal-light">{file.name} · {formatBytes(file.size)}</p>}
      </Field>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-10 rounded-xl border border-line bg-white p-6 sm:p-10">
      <HoneypotField id={id("company-website")} />

      <fieldset className="flex flex-col gap-5" disabled={busy || Boolean(pending)}>
        <legend className="font-display text-2xl uppercase text-navy">1 · Who&apos;s in the video</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("participantName")} label="Participant name" error={fieldErrors.participantName}>
            <input id={id("participantName")} name="participantName" autoComplete="off" className={control("participantName")} {...fieldA11yProps(id("participantName"), fieldErrors.participantName)} />
          </Field>
          <Field id={id("professionalTitle")} label="Professional title" optional>
            <input id={id("professionalTitle")} name="professionalTitle" placeholder="e.g. Actor, Musician, Fire Captain" className={control("professionalTitle")} />
          </Field>
          <Field id={id("preferredAttribution")} label="Preferred public attribution" optional>
            <input id={id("preferredAttribution")} name="preferredAttribution" placeholder="Exactly how the name and title should appear" className={control("preferredAttribution")} />
          </Field>
          <Field id={id("socialHandles")} label="Approved social media handles" optional>
            <input id={id("socialHandles")} name="socialHandles" placeholder="@handle (platform)" className={control("socialHandles")} />
          </Field>
          <Field id={id("website")} label="Website" optional error={fieldErrors.website}>
            <input id={id("website")} name="website" type="url" inputMode="url" placeholder="https://" className={control("website")} {...fieldA11yProps(id("website"), fieldErrors.website)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={busy || Boolean(pending)}>
        <legend className="font-display text-2xl uppercase text-navy">2 · Who&apos;s submitting</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("submitterName")} label="Your name" error={fieldErrors.submitterName}>
            <input id={id("submitterName")} name="submitterName" autoComplete="name" className={control("submitterName")} {...fieldA11yProps(id("submitterName"), fieldErrors.submitterName)} />
          </Field>
          <Field id={id("submitterEmail")} label="Your email" error={fieldErrors.submitterEmail}>
            <input id={id("submitterEmail")} name="submitterEmail" type="email" autoComplete="email" className={control("submitterEmail")} {...fieldA11yProps(id("submitterEmail"), fieldErrors.submitterEmail)} />
          </Field>
          <Field id={id("relationship")} label="Relationship to participant" error={fieldErrors.relationship}>
            <select id={id("relationship")} name="relationship" defaultValue="" className={control("relationship")} {...fieldA11yProps(id("relationship"), fieldErrors.relationship)}>
              <option value="" disabled>Select…</option>
              {SUBMITTER_RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field id={id("representativeAgency")} label="Representative or agency" optional>
            <input id={id("representativeAgency")} name="representativeAgency" autoComplete="organization" className={control("representativeAgency")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={busy}>
        <legend className="font-display text-2xl uppercase text-navy">3 · The recording</legend>
        <p className="text-sm text-copy">
          Upload the video or share a secure link (Dropbox, Google Drive, WeTransfer, Frame.io…). Longer than 30 seconds is fine.
        </p>
        {fileInput("video", "Video file", `MP4 or MOV, up to ${VOICES_UPLOAD_LIMIT_MB.video} MB. Uploaded privately — never public.`, true)}
        <Field id={id("videoLink")} label="…or a secure video link" optional error={fieldErrors.videoLink}>
          <input id={id("videoLink")} name="videoLink" type="url" inputMode="url" placeholder="https://" className={control("videoLink")} {...fieldA11yProps(id("videoLink"), fieldErrors.videoLink)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          {fileInput("headshot", "Approved headshot", `JPG, PNG or WebP, up to ${VOICES_UPLOAD_LIMIT_MB.headshot} MB.`, true)}
          {fileInput("release", "Signed release", `PDF, JPG or PNG, up to ${VOICES_UPLOAD_LIMIT_MB.release} MB. You can also send it later.`, true)}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5" disabled={busy || Boolean(pending)}>
        <legend className="font-display text-2xl uppercase text-navy">4 · Timing &amp; restrictions</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("suggestedPublicationDate")} label="Suggested publication date" optional error={fieldErrors.suggestedPublicationDate}>
            <input id={id("suggestedPublicationDate")} name="suggestedPublicationDate" type="date" className={control("suggestedPublicationDate")} />
          </Field>
          <Field id={id("embargoUntil")} label="Embargo — do not publish before" optional error={fieldErrors.embargoUntil}>
            <input id={id("embargoUntil")} name="embargoUntil" type="date" className={control("embargoUntil")} />
          </Field>
        </div>
        <Field id={id("usageRestrictions")} label="Usage restrictions" optional>
          <textarea id={id("usageRestrictions")} name="usageRestrictions" rows={3} placeholder="e.g. Website only; final cut must be approved by our team" className={control("usageRestrictions")} />
        </Field>
        <Field id={id("additionalInstructions")} label="Additional instructions" optional>
          <textarea id={id("additionalInstructions")} name="additionalInstructions" rows={3} className={control("additionalInstructions")} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4" disabled={busy || Boolean(pending)}>
        <legend className="sr-only">Confirmations</legend>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input id={id("authorized")} name="authorized" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-navy" {...fieldA11yProps(id("authorized"), fieldErrors.authorized)} />
          <span>I confirm I am the participant, or I am authorized by the participant to provide this recording and the information above. <span aria-hidden="true">*</span></span>
        </label>
        {fieldErrors.authorized && <p id={`${id("authorized")}-error`} role="alert" className="text-xs font-medium text-red-700">{fieldErrors.authorized}</p>}
        <label className="flex items-start gap-3 text-sm text-ink">
          <input id={id("termsAcknowledged")} name="termsAcknowledged" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-navy" {...fieldA11yProps(id("termsAcknowledged"), fieldErrors.termsAcknowledged)} />
          <span>
            I&apos;ve read the{" "}
            <Link href={PORTAL_PATHS.permissions} className="font-semibold text-navy underline underline-offset-4" target="_blank">
              participation &amp; usage permissions
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className="font-semibold text-navy underline underline-offset-4" target="_blank">
              privacy policy
            </Link>
            , and I understand submission does not guarantee publication. <span aria-hidden="true">*</span>
          </span>
        </label>
        {fieldErrors.termsAcknowledged && <p id={`${id("termsAcknowledged")}-error`} role="alert" className="text-xs font-medium text-red-700">{fieldErrors.termsAcknowledged}</p>}
      </fieldset>

      {(phase === "uploading" || phase === "finalizing" || (pending && phase === "error")) && pending && (
        <div className="flex flex-col gap-3" aria-live="polite">
          {pending.uploads.map((upload) => {
            const pct = Math.round((progress[upload.kind] ?? 0) * 100);
            return (
              <div key={upload.kind}>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-navy">
                  <span>{KIND_LABEL[upload.kind]}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${KIND_LABEL[upload.kind]} upload progress`}>
                  <div className="h-full bg-navy transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {phase === "finalizing" && <p className="text-sm text-copy">Verifying your files…</p>}
        </div>
      )}

      {isTurnstileEnabled && !pending && <TurnstileWidget ref={turnstileRef} action="voices_submission" onToken={setTurnstileToken} />}

      <div className="flex flex-col gap-3">
        <FormError message={errorMessage} />
        <FormSubmitButton
          idleLabel={pending ? "Retry upload" : "Submit your message"}
          submittingLabel={phase === "uploading" ? "Uploading…" : phase === "finalizing" ? "Verifying…" : "Sending…"}
          submitting={busy}
          disabled={busy || (!pending && isTurnstileEnabled && !turnstileToken)}
        />
        <p className="text-xs text-charcoal-light">
          Prefer email? Send a secure link to{" "}
          <a href={`mailto:${TALENT_CONTACT.email}`} className="font-semibold text-navy underline underline-offset-4">{TALENT_CONTACT.email}</a>{" "}
          — we never need the file as an email attachment.
        </p>
      </div>
    </form>
  );
}
