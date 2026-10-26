import Image from "next/image";
import { MARK_COLORS } from "@/lib/content/about";

const [RANGER_GREEN, BLUE, MUTED_GOLD] = MARK_COLORS;

/** "Our military veterans" → "our military veterans", without flattening acronyms like EMS. */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// dot/lineFrom are in the 0–100 box around the logo, which sits at inset 15%.
const ANNOTATIONS = [
  {
    label: RANGER_GREEN.name,
    detail: `${RANGER_GREEN.who} — ${lowerFirst(RANGER_GREEN.detail)}`,
    swatch: RANGER_GREEN.hex,
    dot: { x: 24, y: 34 },
    lineFrom: { x: 0, y: 30 },
    labelPos: "left-0 top-[24%] -translate-x-full pr-3 text-right",
  },
  {
    label: BLUE.name,
    detail: `${BLUE.who} — ${lowerFirst(BLUE.detail)}`,
    swatch: BLUE.hex,
    dot: { x: 80, y: 46 },
    lineFrom: { x: 100, y: 40 },
    labelPos: "right-0 top-[34%] translate-x-full pl-3 text-left",
  },
  {
    label: MUTED_GOLD.name,
    detail: `${MUTED_GOLD.who} — ${lowerFirst(MUTED_GOLD.detail)}`,
    swatch: MUTED_GOLD.hex,
    dot: { x: 50, y: 83 },
    lineFrom: { x: 50, y: 100 },
    labelPos: "left-1/2 bottom-0 -translate-x-1/2 translate-y-full pt-3 text-center",
  },
  {
    label: "The Star",
    detail: "The fallen — those lost in service, and those lost after it",
    dot: { x: 50, y: 43 },
    lineFrom: { x: 50, y: 0 },
    labelPos: "left-1/2 top-0 -translate-x-1/2 -translate-y-full pb-3 text-center",
  },
  {
    label: "The 22",
    detail: "Remembrance — the number this movement is built against",
    dot: { x: 37, y: 64 },
    lineFrom: { x: 0, y: 72 },
    labelPos: "left-0 top-[66%] -translate-x-full pr-3 text-right",
  },
] as const;

const ONE_RING = "One unbroken ring. None of us carries the burden alone.";

function AnnotationLabel({ a }: { a: (typeof ANNOTATIONS)[number] }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-ink">
      {"swatch" in a && (
        <span
          aria-hidden="true"
          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-[-1px]"
          style={{ backgroundColor: a.swatch }}
        />
      )}
      {a.label}
    </p>
  );
}

/**
 * The For The 22 mark, large, with its meaning shown as visual annotations
 * rather than paragraphs of explanation: the three ring colors, the star,
 * and the 22. "Black" isn't annotated here since it's the racing kit's
 * color — it gets its own beat as the full-bleed Why Black section.
 * BrandColorBreakdown (same file) is the swatch/hex reference for the
 * Press page's brand kit.
 */
export function MarkDiagram() {
  return (
    <div className="mx-auto max-w-xl">
      {/* sm+: logo with leader-line callouts around it */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-md sm:block">
        <div className="absolute inset-[15%]">
          <Image src="/logo.png" alt="The For The 22 mark" fill className="object-contain" sizes="400px" />
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full text-bronze/70"
        >
          {ANNOTATIONS.map((a) => (
            <line
              key={a.label}
              x1={a.lineFrom.x}
              y1={a.lineFrom.y}
              x2={a.dot.x}
              y2={a.dot.y}
              stroke="currentColor"
              strokeWidth="0.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {ANNOTATIONS.map((a) => (
            <circle key={a.label} cx={a.dot.x} cy={a.dot.y} r="1" fill="currentColor" />
          ))}
        </svg>
        {ANNOTATIONS.map((a) => (
          <div key={a.label} className={`absolute w-40 ${a.labelPos}`}>
            <AnnotationLabel a={a} />
            <p className="mt-0.5 text-xs leading-snug text-charcoal-light">{a.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-24 hidden text-center font-display text-lg uppercase text-ink sm:block">{ONE_RING}</p>

      {/* mobile: plain logo + stacked annotation list */}
      <div className="sm:hidden">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <Image src="/logo.png" alt="The For The 22 mark" fill className="object-contain" sizes="220px" />
        </div>
        <ul className="mt-8 space-y-4">
          {ANNOTATIONS.map((a) => (
            <li key={a.label}>
              <AnnotationLabel a={a} />
              <p className="mt-0.5 text-sm leading-snug text-charcoal-light">{a.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-display text-lg uppercase text-ink">{ONE_RING}</p>
      </div>
    </div>
  );
}

/** The mark's three colors with their hex values — the Press page's brand-kit reference. */
export function BrandColorBreakdown() {
  return (
    <ul className="mx-auto grid max-w-xl gap-4 sm:grid-cols-3">
      {MARK_COLORS.map((c) => (
        <li key={c.name} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-ink/10"
            style={{ backgroundColor: c.hex }}
          />
          <p className="text-xs leading-snug text-charcoal-light">
            <span className="block font-medium text-ink">
              {c.name} — {c.hex}
            </span>
            {c.who}: {lowerFirst(c.detail)}
          </p>
        </li>
      ))}
    </ul>
  );
}
