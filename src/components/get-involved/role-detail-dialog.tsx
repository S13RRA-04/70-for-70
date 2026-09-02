"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { GetInvolvedForm } from "@/components/forms/get-involved-form";
import type { GET_INVOLVED_ROLES } from "@/lib/constants";

type Role = (typeof GET_INVOLVED_ROLES)[number];

/**
 * A role card on /get-involved that opens a native <dialog> with the role's
 * full details and a sign-up form pre-scoped to it (see GetInvolvedForm's
 * defaultInterest) — same hand-rolled <dialog> pattern as
 * ExternalDonateButton, rather than pulling in a dialog library.
 */
export function RoleDetailDialog({ role }: { role: Role }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = `role-${role.id.replace(/\s+/g, "-").toLowerCase()}-heading`;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="w-full rounded-sm border border-ink/10 bg-off-white p-6 text-left transition-colors hover:border-bronze/40 hover:bg-sand-light/40"
      >
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          {role.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{role.description}</p>
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-bronze">
          Learn More &amp; Sign Up
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-labelledby={headingId}
        className="m-auto w-[min(36rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-sm border border-ink/10 bg-off-white p-0 text-ink shadow-xl backdrop:bg-ink/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 id={headingId} className="font-display text-xl font-semibold uppercase tracking-wide">
              {role.title}
            </h3>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="shrink-0 text-charcoal-light hover:text-ink"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-charcoal-light">{role.description}</p>

          {role.details.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
                What&apos;s Needed
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-charcoal-light">
                {role.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span aria-hidden="true" className="text-bronze">
                      &bull;
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-ink/10 pt-6">
            <GetInvolvedForm defaultInterest={role.id} idPrefix={`role-${role.id}-`} />
          </div>
        </div>
      </dialog>
    </>
  );
}
