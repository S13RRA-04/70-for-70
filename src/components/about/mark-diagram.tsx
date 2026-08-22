import Image from "next/image";
import { OUTER_RING_COLORS, INNER_RING_COLORS } from "@/lib/content/about";

const ANNOTATIONS = [
  {
    label: "Outer Ring",
    detail: "Every branch of the U.S. Armed Forces",
    dot: { x: 30, y: 33 },
    lineFrom: { x: 0, y: 30 },
    labelPos: "left-0 top-[24%] -translate-x-full pr-3 text-right",
  },
  {
    label: "Inner Ring",
    detail: "Every sector of first-responder service",
    dot: { x: 64, y: 26 },
    lineFrom: { x: 100, y: 24 },
    labelPos: "right-0 top-[17%] translate-x-full pl-3 text-left",
  },
  {
    label: "The Star",
    detail: "The fallen — those lost in service, and those lost after it",
    dot: { x: 50, y: 46 },
    lineFrom: { x: 50, y: 0 },
    labelPos: "left-1/2 top-0 -translate-x-1/2 -translate-y-full pb-3 text-center",
  },
  {
    label: "The 22",
    detail: "Remembrance — the number this movement is built against",
    dot: { x: 50, y: 65 },
    lineFrom: { x: 50, y: 100 },
    labelPos: "left-1/2 bottom-0 -translate-x-1/2 translate-y-full pt-3 text-center",
  },
] as const;

/**
 * The For The 22 mark, large, with its meaning shown as visual annotations
 * rather than paragraphs of explanation. "Black" isn't annotated here since
 * it's the racing kit's color, not a graphic element on this white-ground
 * logo file — it gets its own beat as the full-bleed Why Black section.
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
            <p className="text-xs font-semibold uppercase tracking-wide text-ink">{a.label}</p>
            <p className="mt-0.5 text-xs leading-snug text-charcoal-light">{a.detail}</p>
          </div>
        ))}
      </div>

      {/* mobile: plain logo + stacked annotation list */}
      <div className="sm:hidden">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <Image src="/logo.png" alt="The For The 22 mark" fill className="object-contain" sizes="220px" />
        </div>
        <ul className="mt-8 space-y-4">
          {ANNOTATIONS.map((a) => (
            <li key={a.label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink">{a.label}</p>
              <p className="mt-0.5 text-sm leading-snug text-charcoal-light">{a.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 border-t border-ink/10 pt-8 sm:mt-16">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-charcoal-light">
          Outer Ring — Armed Forces
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OUTER_RING_COLORS.map((ring) => (
            <div key={ring.branch} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full border border-ink/10"
                style={{ backgroundColor: ring.hex }}
              />
              <p className="text-xs text-charcoal-light">
                <span className="font-medium text-ink">{ring.branch}</span> — {ring.color}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
          Inner Ring — First Responders
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {INNER_RING_COLORS.map((ring) => (
            <div key={ring.color} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rounded-full border border-ink/10"
                style={{ backgroundColor: ring.hex }}
              />
              <p className="text-xs text-charcoal-light">
                <span className="font-medium text-ink">{ring.color}</span> — {ring.sector}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
