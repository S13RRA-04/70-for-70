import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPartners } from "@/lib/data/partners";
import { getMiles } from "@/lib/data/miles";
import { Container } from "@/components/shared/container";
import { DonationFields } from "@/components/admin/donation-fields";
import { deleteDonationAction, updateDonationAction } from "../actions";
import type { DonationRow } from "@/types/database";

export default async function DonationDetailPage(props: PageProps<"/admin/donations/[id]">) {
  await requireAdminUser();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const admin = createAdminClient();

  const [{ data: donation }, partners, miles] = await Promise.all([
    admin.from("donations").select("*").eq("id", id).single(),
    getPartners(),
    getMiles(),
  ]);

  if (!donation) notFound();

  const d = donation as DonationRow;
  const mileNumber = d.mile_id ? miles.find((m) => m.id === d.mile_id)?.mile_number ?? null : null;

  return (
    <Container className="max-w-3xl py-16">
      <Link
        href="/admin/donations"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Donations
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">
        {d.donor_name}
      </h1>

      {errorParam && (
        <p role="alert" className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <form action={updateDonationAction} className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6">
        <input type="hidden" name="id" value={d.id} />
        <DonationFields
          partners={partners}
          miles={miles}
          defaults={{
            donor_name: d.donor_name,
            amount: d.amount,
            organization_benefited: d.organization_benefited,
            mile_number: mileNumber,
            date: d.date.slice(0, 10),
            anonymous: d.anonymous,
            external_reference: d.external_reference,
            dedication_type: d.dedication_type,
            dedication_name: d.dedication_name,
            dedication_branch: d.dedication_branch,
            dedication_message: d.dedication_message,
            dedication_public: d.dedication_public,
            verified: d.verified,
          }}
        />
        <button
          type="submit"
          className="mt-5 rounded-sm bg-bronze px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Save Changes
        </button>
      </form>

      <form
        action={deleteDonationAction}
        className="mt-6 flex items-center justify-between rounded-sm border border-red-200 bg-red-50 p-6"
      >
        <input type="hidden" name="id" value={d.id} />
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-red-900">
            Delete Donation
          </p>
          <p className="mt-1 text-sm text-red-800">
            Permanently removes this record and recalculates campaign/mile totals.
          </p>
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-sm border border-red-300 bg-off-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-800 hover:bg-red-100"
        >
          Delete
        </button>
      </form>
    </Container>
  );
}
