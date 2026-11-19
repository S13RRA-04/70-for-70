"use client";

import { useId, useState } from "react";
import { formatBytes, uploadToSignedUrl } from "@/components/voices/upload-file";
import { createAdminUploadAction } from "./actions";

/**
 * Admin-only direct-to-storage upload with progress. Writes the stored
 * object's path (private scopes) or public URL ("publication" scope) into a
 * hidden input named `name`, which the surrounding server-action form submits.
 * Private uploads are signature-checked by the action on save.
 */
export function AdminUpload({
  scope,
  name,
  label,
  accept,
  defaultValue,
  onUploadedName,
}: {
  scope: "submission" | "release" | "publication";
  name: string;
  label: string;
  accept: string;
  defaultValue?: string | null;
  /** Optional hidden input that receives the original filename. */
  onUploadedName?: string;
}) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue ?? "");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);
    const target = await createAdminUploadAction(scope, file.name);
    if ("error" in target) {
      setError(target.error);
      setProgress(null);
      return;
    }
    try {
      await uploadToSignedUrl(target.signedUrl, file, file.type, setProgress).promise;
      setValue(target.publicUrl ?? target.path);
      setFileName(`${file.name} · ${formatBytes(file.size)}`);
      setProgress(null);
    } catch {
      setError("Upload failed or was interrupted — choose the file again to retry.");
      setProgress(null);
    }
  }

  return (
    <div className="text-xs font-medium text-ink">
      <label htmlFor={inputId}>{label}</label>
      <input type="hidden" name={name} value={value} />
      {onUploadedName && <input type="hidden" name={onUploadedName} value={fileName.split(" · ")[0] ?? ""} />}
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={progress !== null}
        className="mt-1 block w-full text-sm text-charcoal-light file:mr-3 file:rounded-sm file:border-0 file:bg-ink/5 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-ink"
      />
      {progress !== null && (
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Upload progress">
          <div className="h-full bg-ink" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-red-700">{error}</p>}
      {value && progress === null && <p className="mt-1 break-all font-normal text-charcoal-light">Uploaded: {fileName || value}</p>}
    </div>
  );
}
