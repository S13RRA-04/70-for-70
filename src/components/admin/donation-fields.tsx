import type { DedicationType } from "@/types/database";

const DEDICATION_TYPES: { value: DedicationType; label: string }[] = [
  { value: "in_honor_of", label: "In Honor Of" },
  { value: "in_memory_of", label: "In Memory Of" },
];

export interface DonationFieldDefaults {
  donor_name?: string;
  amount?: number;
  organization_benefited?: string | null;
  mile_number?: number | null;
  date?: string;
  anonymous?: boolean;
  external_reference?: string | null;
  dedication_type?: DedicationType | null;
  dedication_name?: string | null;
  dedication_branch?: string | null;
  dedication_message?: string | null;
  dedication_public?: boolean;
  verified?: boolean;
}

/**
 * Field set shared by the "Record a Donation" form (list page) and the
 * per-donation edit form (detail page). Renders only <label>/<input> pairs
 * — each page supplies its own <form action> and submit button, since the
 * two forms post to different server actions.
 */
export function DonationFields({
  partners,
  miles,
  defaults = {},
}: {
  partners: { name: string }[];
  miles: { mile_number: number }[];
  defaults?: DonationFieldDefaults;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Donor Name" htmlFor="donor_name">
          <input
            id="donor_name"
            name="donor_name"
            defaultValue={defaults.donor_name ?? ""}
            required
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </Field>

        <Field label="Amount ($)" htmlFor="amount">
          <input
            id="amount"
            name="amount"
            type="number"
            min={0.01}
            step={0.01}
            defaultValue={defaults.amount ?? ""}
            required
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Beneficiary Organization" htmlFor="organization_benefited">
          <select
            id="organization_benefited"
            name="organization_benefited"
            defaultValue={defaults.organization_benefited ?? ""}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          >
            <option value="">— Not specified —</option>
            {partners.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Credit to Mile" htmlFor="mile_number">
          <select
            id="mile_number"
            name="mile_number"
            defaultValue={defaults.mile_number ? String(defaults.mile_number) : ""}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          >
            <option value="">— None —</option>
            {miles.map((m) => (
              <option key={m.mile_number} value={m.mile_number}>
                Mile {m.mile_number}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Donation Date" htmlFor="date">
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={defaults.date ?? today}
            required
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </Field>
      </div>

      <Field label="Reference Note" htmlFor="external_reference">
        <input
          id="external_reference"
          name="external_reference"
          defaultValue={defaults.external_reference ?? ""}
          placeholder="e.g. partner platform confirmation #, or how the donor reported this"
          className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="anonymous"
          defaultChecked={defaults.anonymous ?? false}
          className="h-4 w-4 accent-bronze"
        />
        Donor wishes to remain anonymous
      </label>

      <div className="grid gap-3 border-t border-ink/10 pt-4 sm:grid-cols-3">
        <Field label="Dedication" htmlFor="dedication_type">
          <select
            id="dedication_type"
            name="dedication_type"
            defaultValue={defaults.dedication_type ?? ""}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          >
            <option value="">— None —</option>
            {DEDICATION_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Honoree Name" htmlFor="dedication_name">
          <input
            id="dedication_name"
            name="dedication_name"
            defaultValue={defaults.dedication_name ?? ""}
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </Field>

        <Field label="Honoree Branch of Service" htmlFor="dedication_branch">
          <input
            id="dedication_branch"
            name="dedication_branch"
            defaultValue={defaults.dedication_branch ?? ""}
            placeholder="e.g. U.S. Army"
            className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
          />
        </Field>
      </div>

      <Field label="Dedication Message" htmlFor="dedication_message">
        <textarea
          id="dedication_message"
          name="dedication_message"
          rows={2}
          defaultValue={defaults.dedication_message ?? ""}
          className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="dedication_public"
          defaultChecked={defaults.dedication_public ?? true}
          className="h-4 w-4 accent-bronze"
        />
        Show this dedication publicly (once verified)
      </label>

      <label className="flex items-center gap-2 border-t border-ink/10 pt-4 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="verified"
          defaultChecked={defaults.verified ?? false}
          className="h-4 w-4 accent-olive"
        />
        Verified — confirmed with the beneficiary organization and safe to show on the public site
      </label>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
