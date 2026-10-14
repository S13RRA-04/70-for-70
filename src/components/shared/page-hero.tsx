import { cn } from "@/lib/utils";

/**
 * The mission pillar a page belongs to. Its color marks only the eyebrow and
 * small accents — navy still carries the headline — matching the homepage's
 * 01 Connection / 02 Mobilization / 03 Impact sections.
 */
export type Pillar = "connection" | "mobilization" | "impact" | "neutral";

export const PILLAR_TEXT: Record<Pillar, string> = {
  connection: "text-help",
  mobilization: "text-olive",
  impact: "text-impact",
  neutral: "text-steel",
};

export const PILLAR_BORDER: Record<Pillar, string> = {
  connection: "border-help",
  mobilization: "border-olive",
  impact: "border-impact",
  neutral: "border-steel",
};

/**
 * Inner-page opener for org pages — the homepage's section-header treatment
 * scaled up to a page H1: tracked pillar eyebrow, worn Anton headline in
 * navy, calm body intro, optional actions/aside. Sits on the paper grain
 * (no fill) with the brush-stroke edge art on wide screens only.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  pillar = "neutral",
  children,
  aside,
  narrow = false,
  wide = false,
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  pillar?: Pillar;
  /** Actions or extra content under the intro (buttons, chips, a note). */
  children?: React.ReactNode;
  /** Optional right-hand column on large screens (a stat, an image, a card). */
  aside?: React.ReactNode;
  /** Constrain to a reading width — for single-column pages like /crisis. */
  narrow?: boolean;
  /** Match a full-width page body (e.g. the /resources directory) instead of the 1240px reading width. */
  wide?: boolean;
  /** Anchor id for in-page links (e.g. /about#founders-story). */
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-28 overflow-hidden border-b border-line", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative edge art sized to the section's height */}
      <img
        src="/brand/edge-right.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-auto max-w-[14vw] object-cover object-left opacity-70 lg:block"
      />
      <div
        className={cn(
          "relative mx-auto grid items-center gap-x-16 gap-y-10 px-6 pb-14 pt-16 sm:pb-20 sm:pt-24",
          narrow ? "max-w-3xl" : wide ? "max-w-[min(96vw,2400px)] sm:px-6 lg:px-8" : "max-w-[1240px]",
          aside ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:pr-[11vw] xl:pr-[9vw]" : "lg:pr-[12vw] xl:pr-[10vw]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-5">
          {eyebrow && <p className={cn("label-caps", PILLAR_TEXT[pillar])}>{eyebrow}</p>}
          <h1 className="text-worn text-balance font-display text-[clamp(48px,6.4vw,92px)] uppercase leading-[0.95] text-navy">
            {title}
          </h1>
          {description && (
            <div className="max-w-2xl text-lg leading-relaxed text-copy sm:text-xl">{description}</div>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}
