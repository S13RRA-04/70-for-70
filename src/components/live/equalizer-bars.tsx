const BAR_COUNT = 41;
const MID = (BAR_COUNT - 1) / 2;

/**
 * Deterministic (no Math.random) so server and client render the same
 * bars: a center-weighted envelope with a sine wobble, red across the
 * middle nine. Each bar gets a staggered negative delay so the pulse reads
 * as a level meter rather than one block breathing in unison.
 */
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const envelope = 1 - Math.abs(i - MID) / (MID + 1);
  return {
    height: Math.round(6 + 54 * envelope * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.9)))),
    red: Math.abs(i - MID) <= 4,
    delay: ((i * 137) % 1100) / 1000,
  };
});

/**
 * The audio-level meter under the Live hero wordmark (see .live-eq-bar in
 * globals.css). `tone="dark"` swaps the jet bars for gray so they read on
 * the stage-black premiere hero.
 */
export function EqualizerBars({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div aria-hidden="true" className={`flex h-16 items-center justify-center gap-1 ${className ?? ""}`}>
      {BARS.map((bar, i) => (
        <span
          key={i}
          className={`live-eq-bar ${bar.red ? "bg-live-red" : tone === "dark" ? "bg-[#5a5a5a]" : "bg-jet"}`}
          style={{ height: bar.height, animationDelay: `-${bar.delay}s` }}
        />
      ))}
    </div>
  );
}
