import Link from "next/link";
import { cn } from "@/lib/utils";

/** Small, shared building blocks for the /admin/voices screens. */

export const INPUT =
  "mt-1 block w-full rounded-sm border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus-visible:border-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/40";

export const BUTTON =
  "inline-flex min-h-10 items-center justify-center rounded-sm bg-ink px-4 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-charcoal disabled:opacity-50";

export const BUTTON_SECONDARY =
  "inline-flex min-h-10 items-center justify-center rounded-sm border border-ink/20 px-4 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5";

export const BUTTON_DANGER =
  "inline-flex min-h-10 items-center justify-center rounded-sm border border-red-300 bg-red-50 px-4 text-xs font-semibold uppercase tracking-wide text-red-800 hover:bg-red-100";

export function Labeled({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-xs font-medium text-ink", className)}>
      {label}
      {children}
      {hint && <span className="mt-1 block font-normal text-charcoal-light">{hint}</span>}
    </label>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "info" }) {
  const tones = {
    neutral: "border-ink/15 text-charcoal-light",
    good: "border-olive/30 bg-olive/10 text-olive",
    warn: "border-bronze/40 bg-bronze/10 text-bronze",
    bad: "border-red-300 bg-red-50 text-red-800",
    info: "border-help/30 bg-help/10 text-help",
  };
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}

export function Flash({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const error = typeof searchParams.error === "string" ? searchParams.error : null;
  const saved = typeof searchParams.saved === "string" ? searchParams.saved : null;
  if (!error && !saved) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={cn(
        "mt-6 rounded-sm border p-3 text-sm font-medium",
        error ? "border-red-300 bg-red-50 text-red-800" : "border-olive/30 bg-olive/10 text-olive",
      )}
    >
      {error ?? saved}
    </p>
  );
}

export function Panel({ title, children, actions, id }: { title: string; children: React.ReactNode; actions?: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-8 scroll-mt-20 rounded-sm border border-ink/10 bg-off-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">{title}</h2>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminHeader({ title, subtitle, back = { href: "/admin/voices", label: "Voices dashboard" } }: { title: string; subtitle?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div>
      <Link href={back.href} className="text-xs font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink">
        ← {back.label}
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-ink">{title}</h1>
      {subtitle && <div className="mt-1 text-sm text-charcoal-light">{subtitle}</div>}
    </div>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(new Date(value));
}

/** ISO → value for a `datetime-local` input (UTC). */
export function toDateTimeLocal(value: string | null | undefined): string {
  return value ? value.slice(0, 16) : "";
}

export function param(searchParams: Record<string, string | string[] | undefined>, key: string): string {
  const v = searchParams[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
}
