import Image from "next/image";
import { ArrowUpRight, Download, FileText, Headphones, PlayCircle, Share2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import {
  FOUNDER_BIO_LONG,
  FOUNDER_BIO_SHORT,
  FOUNDER_INTRO,
  INTERVIEW_TOPICS,
  MEDIA_APPEARANCES,
  PRESS_PHOTOS,
  type MediaLink,
} from "@/lib/content/press";
import { cn, formatDateLong } from "@/lib/utils";

/**
 * Building blocks shared by the org (/press) and campaign (/campaign-press)
 * media kits, so the two pages present bios, photos, and coverage the same
 * way and never drift apart.
 */

/**
 * "2026-11-06" parses as UTC midnight, which renders as Nov 5 anywhere west
 * of UTC — anchor date-only strings at noon so the calendar day survives.
 */
export function formatPressDate(date: string): string {
  return formatDateLong(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00` : date);
}

export interface PressNavItem {
  id: string;
  label: string;
}

/** In-page jump links — a reporter usually wants one thing (a photo, the bio, the contact). */
export function PressJumpNav({ items }: { items: readonly PressNavItem[] }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function PressSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <h2 id={`${id}-heading`} className="font-display text-2xl uppercase text-ink">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-charcoal-light">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Label/value rows a reporter can quote directly. */
export function QuickFacts({ facts }: { facts: readonly { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line rounded-xl border border-line bg-white">
      {facts.map((fact) => (
        <div key={fact.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">{fact.label}</dt>
          <dd className="text-base text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CopyableText({ label, text, children }: { label: string; text: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">{label}</p>
        <CopyButton text={text} label="Copy" analyticsEvent="press_copy_bio" className="min-h-[36px] px-3 py-1.5 text-sm" />
      </div>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-charcoal-light">{children}</div>
    </div>
  );
}

/** Intro line, short bio, and full bio — each with a one-click copy. */
export function FounderBios() {
  return (
    <div className="space-y-4">
      <CopyableText label="On-air introduction" text={FOUNDER_INTRO}>
        <p>{FOUNDER_INTRO}</p>
      </CopyableText>
      <CopyableText label="Short bio (≈50 words)" text={FOUNDER_BIO_SHORT}>
        <p>{FOUNDER_BIO_SHORT}</p>
      </CopyableText>
      <CopyableText label="Full bio (≈150 words)" text={FOUNDER_BIO_LONG.join("\n\n")}>
        {FOUNDER_BIO_LONG.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </CopyableText>
    </div>
  );
}

export function InterviewTopics() {
  return (
    <ol className="space-y-2">
      {INTERVIEW_TOPICS.map((topic, index) => (
        <li key={topic} className="flex gap-3 text-base leading-relaxed text-charcoal-light">
          <span className="font-display text-lg leading-snug text-bronze">{String(index + 1).padStart(2, "0")}</span>
          <span>{topic}</span>
        </li>
      ))}
    </ol>
  );
}

export function PressPhotos() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {PRESS_PHOTOS.map((photo) => (
        <li key={photo.src}>
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-sand-light">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 180px, 45vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-2 text-xs leading-snug text-charcoal-light">
              {photo.caption}
              {photo.credit && <span className="block text-[11px] italic">Credit: {photo.credit}</span>}
            </figcaption>
          </figure>
          <a
            href={photo.src}
            download
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-bronze hover:underline"
          >
            <Download size={12} aria-hidden />
            Download
          </a>
        </li>
      ))}
    </ul>
  );
}

const LINK_ICONS: Record<MediaLink["kind"], typeof PlayCircle> = {
  video: PlayCircle,
  audio: Headphones,
  article: FileText,
  social: Share2,
};

/** One card per interview/feature, with every platform it's on as a row of links. */
export function MediaAppearances() {
  return (
    <ul className="space-y-4">
      {MEDIA_APPEARANCES.map((appearance) => (
        <li key={`${appearance.outlet}-${appearance.date}`} className="rounded-xl border border-line bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-light">
            {appearance.outlet} · <time dateTime={appearance.date}>{formatPressDate(appearance.date)}</time>
          </p>
          <h3 className="mt-1 font-display text-xl uppercase leading-tight text-ink">{appearance.title}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {appearance.links.map((link) => {
              const Icon = LINK_ICONS[link.kind];
              return (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                      link.kind === "social"
                        ? "border-line text-charcoal-light hover:border-navy hover:text-navy"
                        : "border-navy text-navy hover:bg-navy hover:text-white",
                    )}
                  >
                    <Icon size={15} aria-hidden />
                    {link.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export interface LogoAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Rendered on the ink background, for the white version of a mark. */
  dark?: boolean;
  label: string;
}

/** Logo/wordmark tiles with one consistent download button, light or dark. */
export function LogoDownloads({ assets }: { assets: readonly LogoAsset[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {assets.map((asset) => (
        <li
          key={asset.src}
          className={cn(
            "flex flex-col items-center gap-4 rounded-xl border p-6",
            asset.dark ? "border-ink/10 bg-ink" : "border-line bg-white",
          )}
        >
          <div className="flex h-40 items-center justify-center">
            <Image
              src={asset.src}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              className="max-h-40 w-auto"
            />
          </div>
          <a
            href={asset.src}
            download
            className={cn(
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border-2 px-4 py-2 text-sm font-bold transition-colors",
              asset.dark
                ? "border-off-white/60 text-off-white hover:bg-off-white/10"
                : "border-navy text-navy hover:bg-navy hover:text-white",
            )}
          >
            <Download size={15} aria-hidden />
            {asset.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Media contact card — the email is the primary action, not a footnote. */
export function MediaContact({ email, fallbackHref }: { email: string | null; fallbackHref: string }) {
  return (
    <div className="rounded-xl border border-navy/20 bg-sand-light/60 p-6">
      <p className="text-base leading-relaxed text-charcoal-light">
        Interview requests, show bookings, and media questions go directly to Cody.
      </p>
      <a
        href={email ? `mailto:${email}?subject=${encodeURIComponent("Media inquiry — For The 22")}` : fallbackHref}
        className="action-control mt-4 inline-flex min-h-[44px] items-center gap-2 bg-navy px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-navy-hover"
      >
        {email ?? "Contact form"}
        <ArrowUpRight size={16} aria-hidden />
      </a>
    </div>
  );
}
