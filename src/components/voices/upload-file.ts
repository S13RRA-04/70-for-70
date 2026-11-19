"use client";

/**
 * PUTs a file straight to a Supabase Storage signed upload URL with progress
 * events — supabase-js's uploadToSignedUrl uses fetch, which can't report
 * upload progress. The file never passes through the Worker. The anon key
 * is public by design (RLS/signed tokens are the boundary); the gateway
 * requires it as `apikey`.
 */
export function uploadToSignedUrl(
  signedUrl: string,
  file: File,
  contentType: string,
  onProgress: (fraction: number) => void,
): { promise: Promise<void>; abort: () => void } {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<void>((resolve, reject) => {
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", contentType || "application/octet-stream");
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (anonKey) xhr.setRequestHeader("apikey", anonKey);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(1);
        resolve();
      } else {
        reject(new Error(xhr.status === 413 ? "too_large" : `upload_failed_${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.onabort = () => reject(new Error("aborted"));
    xhr.send(file);
  });
  return { promise, abort: () => xhr.abort() };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
