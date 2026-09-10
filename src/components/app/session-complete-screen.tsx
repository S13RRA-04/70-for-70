import Link from "next/link";

export function SessionCompleteScreen({
  sessionNumber,
  totalSessions,
  totalMinutes,
  milestoneTitle,
  milestoneMessage,
  isFinished,
  onDone,
}: {
  sessionNumber: number;
  totalSessions: number;
  totalMinutes: number;
  milestoneTitle: string | null;
  milestoneMessage: string | null;
  isFinished: boolean;
  onDone: () => void;
}) {
  const remaining = Math.max(totalSessions - sessionNumber, 0);

  if (isFinished) {
    return (
      <div className="rounded-sm border border-bronze/30 bg-ink p-8 text-center text-off-white">
        <p className="font-display text-3xl font-bold uppercase tracking-tight">{sessionNumber} of {totalSessions}.</p>
        <p className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-bronze-light">
          Mission Complete.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-off-white/80">
          You completed twenty-two {totalSessions === 22 ? "22-minute" : ""} movement sessions.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-off-white/15 bg-off-white/5 px-4 py-3">
            <p className="font-display text-xl font-semibold tabular-nums">{sessionNumber}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-off-white/60">
              Total Sessions
            </p>
          </div>
          <div className="rounded-sm border border-off-white/15 bg-off-white/5 px-4 py-3">
            <p className="font-display text-xl font-semibold tabular-nums">{totalMinutes}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-off-white/60">
              Total Minutes
            </p>
          </div>
        </div>

        <p className="mt-6 font-display text-lg font-bold uppercase tracking-wide text-bronze-light">
          Because 22 ≠ 0.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/app/share"
            className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Share My Finish
          </Link>
          <button
            type="button"
            onClick={onDone}
            className="flex min-h-[44px] w-full items-center justify-center rounded-sm border border-off-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-off-white/10"
          >
            View My Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-olive/30 bg-olive/10 p-8 text-center">
      <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink">
        Session {sessionNumber} Complete
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-bronze">{totalMinutes} Minutes Moved</p>
      <p className="mt-1 text-sm text-charcoal-light">{remaining} to go.</p>

      {milestoneTitle && (
        <div className="mt-4 rounded-sm border border-bronze/30 bg-off-white p-4">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-bronze">{milestoneTitle}</p>
          {milestoneMessage && <p className="mt-1 text-sm text-charcoal-light">{milestoneMessage}</p>}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/app/share"
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light sm:w-auto sm:flex-1"
        >
          Share This
        </Link>
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5 sm:w-auto sm:flex-1"
        >
          Done
        </button>
      </div>
    </div>
  );
}
