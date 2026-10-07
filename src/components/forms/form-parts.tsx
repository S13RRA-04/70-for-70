import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The small pieces every public form on this site repeats. Kept together
 * because they only make sense as a set — the control class, the label wrapper
 * that pairs with it, the honeypot, and the error line.
 */

const CONTROL_BASE =
  "mt-1.5 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2.5 text-ink outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/40";

/**
 * The standard control class. Two size variants exist and they are NOT
 * interchangeable: the full-width campaign forms use `text-base sm:text-sm` so
 * a control doesn't shrink to 14px on a phone, while the two-column inquiry and
 * message forms stay at `text-sm` throughout.
 */
export const FORM_CONTROL_CLASS = `${CONTROL_BASE} text-base sm:text-sm`;

export const FORM_CONTROL_CLASS_COMPACT = `${CONTROL_BASE} text-sm`;

/** Appends the invalid-state border/ring to a control class string — pass the field's error message (or undefined) straight through. */
export function controlClassName(base: string, error?: string) {
  return cn(base, error && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-400/40");
}

/** The error id `Field` renders error text at, for wiring a control's own `aria-describedby`. */
export function fieldErrorId(id: string) {
  return `${id}-error`;
}

/** `aria-invalid`/`aria-describedby` for a control, given the field's error message (or undefined). Spread directly onto the `<input>`/`<select>`/`<textarea>`. */
export function fieldA11yProps(id: string, error?: string) {
  return error
    ? { "aria-invalid": true as const, "aria-describedby": fieldErrorId(id) }
    : { "aria-invalid": false as const };
}

/**
 * Label + required/optional marker for one control, plus an inline error
 * slot. `id` is used for the label's `htmlFor` and the error's id, so it
 * must match the control's own id (and whatever `aria-describedby` it's
 * given via `fieldA11yProps`).
 */
export function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}{" "}
        {optional ? (
          <span className="text-charcoal-light">(optional)</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p id={fieldErrorId(id)} role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The hidden `companyWebsite` input. A real person never fills it; anything
 * that does is a bot, and the server discards the submission while replying
 * as though it succeeded (see src/lib/public-write.ts). Off-screen rather than
 * `display: none` so bots that skip visually-hidden fields still trip it.
 *
 * `id` must be unique per page — forms are labelled by their own field prefix.
 */
export function HoneypotField({ id }: { id: string }) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden="true">
      <label htmlFor={id}>Leave this field blank</label>
      <input type="text" id={id} name="companyWebsite" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/**
 * A failed submission's message. `role="alert"` so a screen reader announces
 * it the moment it appears — every form that got this wrong was also
 * inconsistent about *where* the line sat, so put it directly above the submit
 * button.
 */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p role="alert" className="text-sm font-medium text-red-700">
      {message}
    </p>
  );
}
