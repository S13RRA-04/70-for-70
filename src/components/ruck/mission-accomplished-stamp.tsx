import { cn } from "@/lib/utils";

/**
 * Rubber-stamp badge marking a Ruck For The 22 mission as done. Shown on
 * every completed mission's card and its page header — and only there, so
 * the stamp always means "this one is finished."
 */
export function MissionAccomplishedStamp({
  date,
  tone = "light",
  className,
}: {
  /** Short completion date shown under the label, e.g. "Oct 24, 2026". */
  date?: string;
  /** "light" for paper/white backgrounds, "dark" for ink/navy ones. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex -rotate-6 select-none flex-col items-center rounded-sm border-[3px] px-3 py-1.5 text-center outline outline-1 outline-offset-2",
        tone === "light" ? "border-olive text-olive outline-olive/60" : "border-sand text-sand outline-sand/60",
        className,
      )}
    >
      <span className="font-display text-lg uppercase leading-none tracking-wide">Mission Accomplished</span>
      {date && <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]">{date}</span>}
    </span>
  );
}
