"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { formatCurrency, mileStatusLabel, percentFunded } from "@/lib/utils";
import type { MileWithDonations } from "@/types/content";

export function MileDetailModal({
  mile,
  onClose,
}: {
  mile: MileWithDonations | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (mile && !dialog.open) {
      dialog.showModal();
    } else if (!mile && dialog.open) {
      dialog.close();
    }
  }, [mile]);

  const remaining = mile ? Math.max(mile.goal_amount - mile.amount_funded, 0) : 0;
  const percent = mile ? percentFunded(mile.amount_funded, mile.goal_amount) : 0;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="mile-detail-heading"
      className="w-[min(32rem,calc(100vw-2rem))] rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
    >
      {mile && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3
              id="mile-detail-heading"
              className="font-display text-2xl font-semibold uppercase tracking-wide"
            >
              Mile {String(mile.mile_number).padStart(2, "0")}
            </h3>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close mile detail"
              className="rounded-sm p-1 text-charcoal-light hover:text-ink"
            >
              <X size={22} aria-hidden />
            </button>
          </div>

          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
            {mileStatusLabel(mile.status)}
          </p>

          <p className="mt-4 font-display text-xl font-semibold text-ink">
            {formatCurrency(mile.amount_funded)} of {formatCurrency(mile.goal_amount)} funded
          </p>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
            <div
              className="h-full rounded-full bg-bronze"
              style={{ width: `${percent}%` }}
            />
          </div>

          {mile.dedication && (
            <p className="mt-3 text-sm italic text-charcoal-light">
              &ldquo;{mile.dedication}&rdquo;
            </p>
          )}

          {mile.donations.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                Supported by
              </p>
              <ul className="mt-2 space-y-1.5">
                {mile.donations.map((donation) => (
                  <li
                    key={donation.id}
                    className="flex items-center justify-between text-sm text-ink"
                  >
                    <span>{donation.donor_name}</span>
                    <span className="tabular-nums text-charcoal-light">
                      {formatCurrency(donation.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {remaining > 0 && (
            <p className="mt-5 text-sm font-medium text-charcoal-light">
              Remaining: <span className="text-ink">{formatCurrency(remaining)}</span>
            </p>
          )}

          <div className="mt-6 space-y-3">
            {mile.status === "funded" && (
              <p className="text-sm font-medium text-olive">
                This mile is fully funded. Thank you to everyone who supported it.
              </p>
            )}

            {(mile.status === "requested" || mile.status === "reserved") && (
              <p className="text-sm font-medium text-charcoal-light">
                A business sponsorship proposal for this mile is under review. It stays pending
                — not reserved for fundraising purposes — until approved.
              </p>
            )}

            {(mile.status === "available" || mile.status === "partially_funded") && (
              <>
                <Link
                  href={`/donate?mile=${mile.mile_number}`}
                  className="inline-flex w-full items-center justify-center rounded-sm bg-bronze px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
                >
                  {mile.amount_funded > 0
                    ? "Help Finish This Mile"
                    : `Be the first to fund Mile ${mile.mile_number}`}
                </Link>
                <Link
                  href={`/sponsors/request?mile=${mile.mile_number}`}
                  className="inline-flex w-full items-center justify-center rounded-sm border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
                >
                  Request Mile {mile.mile_number} Sponsorship
                </Link>
                <p className="text-xs text-charcoal-light">
                  &ldquo;Help Fund&rdquo; is a personal charitable donation toward this mile.
                  &ldquo;Request Sponsorship&rdquo; is a business proposal that&apos;s reviewed
                  before acceptance — see{" "}
                  <Link href="/sponsors" className="text-bronze hover:underline">
                    Sponsors
                  </Link>{" "}
                  for the difference.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
