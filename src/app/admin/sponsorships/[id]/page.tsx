import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Container } from "@/components/shared/container";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import { PROPOSED_TIER_LABELS, SUPPORT_TYPE_LABELS } from "@/lib/validation/sponsorship-request";
import { SPONSORSHIP_STATUS_LABELS } from "@/lib/sponsorship";
import { activateSponsorAction, changeStatusAction, saveVettingAction } from "../actions";
import type {
  SponsorshipRequestRow,
  SponsorshipStatus,
  SponsorshipStatusHistoryRow,
  SponsorTier,
} from "@/types/database";

const SPONSOR_TIER_OPTIONS: { value: SponsorTier; label: string }[] = [
  { value: "mile", label: "Mile Sponsor" },
  { value: "supporting", label: "Supporting Sponsor" },
  { value: "mission", label: "Mission Sponsor" },
  { value: "presenting", label: "Presenting Sponsor" },
  { value: "community", label: "Community Partner" },
];

export default async function SponsorshipDetailPage(
  props: PageProps<"/admin/sponsorships/[id]">,
) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const admin = createAdminClient();

  const [{ data: request }, { data: history }, { data: existingSponsor }] = await Promise.all([
    admin.from("sponsorship_requests").select("*").eq("id", id).single(),
    admin
      .from("sponsorship_status_history")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    admin.from("sponsors").select("id, name, active").eq("sponsorship_request_id", id).maybeSingle(),
  ]);

  if (!request) notFound();

  const r = request as SponsorshipRequestRow;
  const historyRows = (history ?? []) as SponsorshipStatusHistoryRow[];

  return (
    <Container className="max-w-5xl py-16">
      <Link
        href="/admin/sponsorships"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Queue
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-ink">
            {r.organization_name}
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            {r.contact_name} &middot; {r.email}
            {r.phone ? ` · ${r.phone}` : ""}
          </p>
        </div>
        <span className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
          {SPONSORSHIP_STATUS_LABELS[r.status]}
        </span>
      </div>

      {errorParam && (
        <p role="alert" className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          {/* Proposal details */}
          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Proposal
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Info label="Website" value={r.website} />
              <Info label="Industry" value={r.industry} />
              <Info
                label="Requested Level"
                value={r.proposed_tier ? PROPOSED_TIER_LABELS[r.proposed_tier] : null}
              />
              <Info label="Requested Mile" value={r.requested_mile_number ? `Mile ${r.requested_mile_number}` : null} />
              <Info label="Proposed Cash Value" value={r.cash_value ? formatCurrency(r.cash_value) : null} />
              <Info label="Proposed In-Kind Value" value={r.in_kind_value ? formatCurrency(r.in_kind_value) : null} />
              <Info
                label="Support Type"
                value={r.support_type.map((t) => SUPPORT_TYPE_LABELS[t]).join(", ")}
              />
              <Info label="Referral Source" value={r.referral_source} />
            </dl>

            <div className="mt-4 space-y-4">
              <TextBlock label="Description of Proposed Support" value={r.description} />
              <TextBlock label="Desired Recognition / Benefits" value={r.requested_benefits} />
              <TextBlock label="Message" value={r.message} />
            </div>
          </section>

          {/* Vetting */}
          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Internal Vetting
            </h2>
            <p className="mt-1 text-xs text-charcoal-light">
              Internal only — never exposed to the public frontend. This facilitates human
              review; it does not determine legal permissibility.
            </p>

            <form action={saveVettingAction} className="mt-5 space-y-4">
              <input type="hidden" name="requestId" value={r.id} />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <VettingCheckbox name="organization_researched" label="Organization researched" defaultChecked={r.organization_researched} />
                <VettingCheckbox name="website_reviewed" label="Website reviewed" defaultChecked={r.website_reviewed} />
                <VettingCheckbox name="ownership_reviewed" label="Ownership reviewed" defaultChecked={r.ownership_reviewed} />
                <VettingCheckbox name="known_government_relationship" label="Known government relationship" defaultChecked={r.known_government_relationship} />
                <VettingCheckbox name="known_doj_fbi_relationship" label="Known DOJ/FBI relationship" defaultChecked={r.known_doj_fbi_relationship} />
                <VettingCheckbox name="government_contractor_status" label="Government contractor" defaultChecked={r.government_contractor_status} />
                <VettingCheckbox name="prohibited_source_concern" label="Prohibited-source concern" defaultChecked={r.prohibited_source_concern} />
                <VettingCheckbox name="official_position_concern" label="Official-position concern" defaultChecked={r.official_position_concern} />
                <VettingCheckbox name="ethics_consultation_required" label="Ethics consultation required" defaultChecked={r.ethics_consultation_required} />
                <VettingCheckbox name="ethics_approval_received" label="Ethics approval received" defaultChecked={r.ethics_approval_received} />
              </div>

              <VettingText name="relationship_to_campaign_owner" label="Relationship to campaign owner" defaultValue={r.relationship_to_campaign_owner} />
              <VettingText name="ethics_reference" label="Ethics reference / case number" defaultValue={r.ethics_reference} />
              <VettingTextarea name="internal_notes" label="Internal notes" defaultValue={r.internal_notes} />
              <VettingTextarea name="final_disposition" label="Final disposition" defaultValue={r.final_disposition} />

              <button
                type="submit"
                className="rounded-sm border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
              >
                Save Vetting Notes
              </button>
            </form>
          </section>

          {/* Status history */}
          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Status History
            </h2>
            <ul className="mt-4 space-y-3">
              {historyRows.map((h) => (
                <li key={h.id} className="border-t border-ink/10 pt-3 text-sm first:border-0 first:pt-0">
                  <p className="font-medium text-ink">
                    {h.previous_status ? `${SPONSORSHIP_STATUS_LABELS[h.previous_status]} → ` : ""}
                    {SPONSORSHIP_STATUS_LABELS[h.new_status]}
                  </p>
                  <p className="text-xs text-charcoal-light">
                    {formatDateLong(h.created_at)} {h.administrator ? `· ${h.administrator}` : ""}
                  </p>
                  {h.note && <p className="mt-1 text-sm text-charcoal-light">{h.note}</p>}
                </li>
              ))}
              {historyRows.length === 0 && (
                <p className="text-sm text-charcoal-light">No history yet.</p>
              )}
            </ul>
          </section>
        </div>

        <div className="space-y-8">
          {/* Quick actions */}
          <section className="rounded-sm border border-ink/10 bg-sand-light p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Review Actions
            </h2>

            <StatusForm
              requestId={r.id}
              newStatus="under_review"
              label="Start / Continue Review"
              noteRequired={false}
            />
            <StatusForm
              requestId={r.id}
              newStatus="additional_information_requested"
              label="Request More Information"
              noteRequired={false}
            />
            <StatusForm
              requestId={r.id}
              newStatus="ethics_review"
              label="Send to Ethics Review"
              noteRequired={false}
            />
            <StatusForm
              requestId={r.id}
              newStatus="approved"
              label="Approve"
              noteRequired
              tone="approve"
            />
            <StatusForm
              requestId={r.id}
              newStatus="declined"
              label="Decline"
              noteRequired
              tone="decline"
            />

            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Other transitions
              </summary>
              <div className="mt-3 space-y-4">
                <StatusForm requestId={r.id} newStatus="withdrawn" label="Mark Withdrawn" noteRequired={false} />
                <StatusForm requestId={r.id} newStatus="completed" label="Mark Completed" noteRequired={false} />
              </div>
            </details>
          </section>

          {/* Activate sponsor */}
          <section className="rounded-sm border border-ink/10 bg-off-white p-6">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
              Activate Sponsor
            </h2>

            {existingSponsor ? (
              <p className="mt-3 text-sm text-charcoal-light">
                Already activated as <span className="font-medium text-ink">{existingSponsor.name}</span>{" "}
                ({existingSponsor.active ? "active" : "inactive"}). Edit it directly in Supabase Studio.
              </p>
            ) : r.status !== "approved" ? (
              <p className="mt-3 text-sm text-charcoal-light">
                Only available once this request is <span className="font-medium text-ink">Approved</span>.
              </p>
            ) : (
              <form action={activateSponsorAction} className="mt-4 space-y-4">
                <input type="hidden" name="requestId" value={r.id} />

                <div>
                  <label htmlFor="name" className="text-xs font-medium text-ink">
                    Sponsor Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    defaultValue={r.organization_name}
                    required
                    className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="tier" className="text-xs font-medium text-ink">
                    Tier
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    defaultValue={
                      r.proposed_tier && r.proposed_tier !== "unsure" ? r.proposed_tier : "mile"
                    }
                    className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                  >
                    {SPONSOR_TIER_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="contributionValue" className="text-xs font-medium text-ink">
                      Contribution Value ($)
                    </label>
                    <input
                      id="contributionValue"
                      name="contributionValue"
                      type="number"
                      min={0}
                      defaultValue={r.cash_value ?? r.in_kind_value ?? undefined}
                      className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="displayOrder" className="text-xs font-medium text-ink">
                      Display Order
                    </label>
                    <input
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      defaultValue={0}
                      className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="logoUrl" className="text-xs font-medium text-ink">
                    Logo URL
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="websiteUrl" className="text-xs font-medium text-ink">
                    Website URL
                  </label>
                  <input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    defaultValue={r.website ?? ""}
                    className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="text-xs font-medium text-ink">
                    Public Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
                  />
                </div>

                {r.requested_mile_number && (
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input type="checkbox" name="reserveMile" defaultChecked className="h-4 w-4 accent-bronze" />
                    Mark Mile {r.requested_mile_number} as Reserved
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full rounded-sm bg-bronze px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
                >
                  Activate &amp; Publish Sponsor
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
}

function Info({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</dt>
      <dd className="mt-0.5 text-ink">{value || "—"}</dd>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm text-ink">{value}</p>
    </div>
  );
}

function VettingCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-bronze" />
      {label}
    </label>
  );
}

function VettingText({ name, label, defaultValue }: { name: string; label: string; defaultValue: string | null }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
      />
    </div>
  );
}

function VettingTextarea({ name, label, defaultValue }: { name: string; label: string; defaultValue: string | null }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="mt-1 w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
      />
    </div>
  );
}

function StatusForm({
  requestId,
  newStatus,
  label,
  noteRequired,
  tone,
}: {
  requestId: string;
  newStatus: SponsorshipStatus;
  label: string;
  noteRequired: boolean;
  tone?: "approve" | "decline";
}) {
  return (
    <form action={changeStatusAction} className="mt-4 space-y-2 border-t border-ink/10 pt-4 first:mt-0 first:border-0 first:pt-0">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="newStatus" value={newStatus} />
      <label htmlFor={`note-${newStatus}`} className="text-xs font-medium text-ink">
        Note {noteRequired ? <span aria-hidden="true">*</span> : <span className="text-charcoal-light">(optional)</span>}
      </label>
      <textarea
        id={`note-${newStatus}`}
        name="note"
        required={noteRequired}
        rows={2}
        className="w-full rounded-sm border border-ink/20 bg-off-white px-3 py-2 text-sm text-ink"
      />
      <button
        type="submit"
        className={
          tone === "approve"
            ? "w-full rounded-sm bg-olive px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:opacity-90"
            : tone === "decline"
              ? "w-full rounded-sm bg-red-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-off-white hover:opacity-90"
              : "w-full rounded-sm border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        }
      >
        {label}
      </button>
    </form>
  );
}
