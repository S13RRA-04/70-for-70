import { SEEN_FIRST_WALL_NOTE } from "@/lib/content/seen-campaign";

/** Positions are units of the 600×620 grid — see .seen-wall-box in globals.css. */
function box(left: number, top: number, width: number, height?: number): React.CSSProperties {
  return {
    left: `calc(var(--u) * ${left})`,
    top: `calc(var(--u) * ${top})`,
    width: `calc(var(--u) * ${width})`,
    ...(height !== undefined && { height: `calc(var(--u) * ${height})` }),
  };
}

/** Scales with the wall but never drops below a readable floor. */
function size(px: number, min: number): string {
  return `max(${min}px, calc(var(--u) * ${px}))`;
}

const FRAMES = [
  { number: "001", pos: box(60, 30, 300, 400), mat: 22, type: 34, caption: true },
  { number: "002", pos: box(400, 30, 190, 250), mat: 16, type: 22, caption: false },
  { number: "003", pos: box(140, 470, 230, 150), mat: 14, type: 20, caption: false },
] as const;

/**
 * The SEEN hero: an empty gallery wall under warm spotlights. Every frame is
 * hatched and empty on purpose — pieces get added here only once they're
 * real (see src/lib/content/seen-campaign.ts).
 */
export function GalleryWall() {
  return (
    <div className="seen-wall" aria-hidden="true">
      <div className="seen-wall-box">
        <span className="seen-spot seen-lights" style={box(40, -80, 380, 640)} />
        <span className="seen-spot seen-lights" style={box(330, -80, 300, 520)} />

        {FRAMES.map((frame) => (
          <div
            key={frame.number}
            className="seen-frame absolute box-border"
            style={{ ...frame.pos, padding: `calc(var(--u) * 14)` }}
          >
            <div className="seen-mat" style={{ padding: `calc(var(--u) * ${frame.mat})` }}>
              <div className="seen-hatch">
                <span className="font-display uppercase leading-none text-[#bdbab2]" style={{ fontSize: size(frame.type, 14) }}>
                  No. {frame.number}
                </span>
                {frame.caption && (
                  <span className="font-serif italic text-[#8a877f]" style={{ fontSize: size(20, 12) }}>
                    awaiting its story
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="seen-label absolute" style={{ ...box(380, 330, 150), fontSize: size(12, 10) }}>
          <strong className="text-jet">No. 001</strong>
          <br />
          Medium: to be chosen
          <br />
          Story: yours?
        </div>
        <div className="seen-label absolute" style={{ ...box(390, 480, 200), fontSize: size(12, 10) }}>
          <strong className="text-jet">The first wall</strong>
          <br />
          {SEEN_FIRST_WALL_NOTE} <span className="seen-dot h-[9px] w-[9px] align-middle" /> marks a piece
          that&apos;s found its home.
        </div>
      </div>
    </div>
  );
}
