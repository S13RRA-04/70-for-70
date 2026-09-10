import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Progress" };

/** Honest placeholder — session logging (and the data this screen needs) isn't built yet; see AGENTS.md-adjacent phase notes in this repo's PWA build. */
export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Your Progress</h1>
      <div className="mt-8 rounded-sm border border-dashed border-ink/20 p-8 text-center">
        <p className="text-sm text-charcoal-light">
          Session logging is coming soon. Once it&apos;s live, your session count, minutes, and milestones will show
          up here.
        </p>
        <Link
          href="/app/challenges"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          View Your Challenges
        </Link>
      </div>
    </div>
  );
}
