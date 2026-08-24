"use client";

import { useId, useState } from "react";
import { uploadJournalImageAction } from "./actions";

interface JournalImageUploadProps {
  label: string;
  hiddenFieldName: string;
  defaultValue?: string | null;
}

/** Upload widget backing a hidden text input (image_url or one gallery slot's url) — uploads immediately on file select, writes the returned public URL into the hidden field. */
export function JournalImageUpload({ label, hiddenFieldName, defaultValue }: JournalImageUploadProps) {
  const inputId = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadJournalImageAction(formData);

    if ("error" in result) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setUrl(result.url);
    setStatus("idle");
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-xs font-medium text-ink">
        {label}
      </label>
      <input type="hidden" name={hiddenFieldName} value={url} />
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-1.5 block w-full text-sm text-charcoal-light file:mr-3 file:rounded-sm file:border-0 file:bg-ink/5 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-ink"
      />
      {status === "uploading" && <p className="mt-1 text-xs text-charcoal-light">Uploading…</p>}
      {status === "error" && <p className="mt-1 text-xs text-red-700">{errorMessage}</p>}
      {url && status !== "uploading" && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL, not worth a remotePatterns entry just for this admin-only preview
        <img src={url} alt="" className="mt-2 h-20 w-32 rounded-sm border border-ink/10 object-cover" />
      )}
    </div>
  );
}
