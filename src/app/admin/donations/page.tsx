import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPartners } from "@/lib/data/partners";
import { getMiles } from "@/lib/data/miles";
import { getDonorTiers } from "@/lib/donor-tiers";
import { Container } from "@/components/shared/container";
import { cn, formatCurrency, formatDateLong } from "@/lib/utils";
import { DonationFields } from "@/components/admin/donation-fields";
import { createDonationAction } from "./actions";
import type { DonationRow } from "@/types/database";

const FILTERS: { value: "all" | "unverified" | "verified"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unverified", label: "Awaiting Verification" },
  { value: "verified", label: "Verified" },
];

export default async function DonationsAdminPage(props: PageProps<"/admin/donations">) {
  await requireAdminUser();
  const searchParams = await props.searchParams;
  const filterParam = Array.isArray(searchParams.filter) ? searchParams.filter[0] : searchParams.filter;
  const errorParam = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;
  const activeFilter = (filterParam ?? "all") as "all" | "unverified" | "verified";

  const admin = createAdminClient();

  let donationsQuery = admin.from("donations").select("*").order("date", { ascending: false });
  if (activeFilter === "unverified") donationsQuery = donationsQuery.eq("verified", false);
  if (activeFilter === "verified") donationsQuery = donationsQuery.eq("verified", true);

  const [partners, miles, donationsResult, mileLookup, donorTiers] = await Promise.all([
    getPartners(),
    getMiles(),
    donationsQuery,
    admin.from("miles").select("id, mile_number"),
    getDonorTiers(admin),
  ]);

  const donations = (donationsResult.data ?? []) as DonationRow[];
  const mileNumberById = new Map((mileLookup.data ?? []).map((m) => [m.id, m.mile_number]));

  return (
    <Container className="max-w-6xl py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold uppercase text-ink">Donations</h1>
        <Link
          href="/admin"
          className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
        >
          Back to Overview
        </Link>
      </div>
      <p className="mt-1 text-sm text-charcoal-light">
        Donations happen off-site through each partner&apos;s own donation platform — record what
        a donor or partner reports here, then mark it verified once confirmed. Verifying a
        donation is what makes it public and rolls it into the campaign and mile totals.
      </p>

      {errorParam && (
        <p role="alert" className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorParam}
        </p>
      )}

      <details className="mt-8 rounded-sm border border-ink/10 bg-off-white p-6" open>
        <summary className="cursor-pointer font-display text-lg font-semibold uppercase tracking-wide text-ink">
          Record a Donation
        </summary>
        <form action={createDonationAction} className="mt-5">
          <DonationFields partners={partners} miles={miles} />
          <button
            type="submit"
            className="mt-5 rounded-sm bg-bronze px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            Save Donation
          </button>
        </form>
      </details>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/donations" : `/admin/donations?filter=${f.value}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              activeFilter === f.value
                ? "border-ink bg-ink text-off-white"
                : "border-ink/20 text-charcoal hover:border-ink/40",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {donationsResult.error && (
        <p className="mt-6 text-sm font-medium text-red-700">Failed to load donations.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 bg-sand-light text-xs font-semibold uppercase tracking-wide text-charcoal-light">
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Mile</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => {
              const mileNumber = donation.mile_id ? mileNumberById.get(donation.mile_id) : null;
              const tier = donation.donor_email ? donorTiers.get(donation.donor_email)?.tier : null;
              return (
                <tr key={donation.id} className="border-b border-ink/5 last:border-0 hover:bg-sand-light/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/donations/${donation.id}`}
                      className="font-medium text-ink hover:text-bronze"
                    >
                      {donation.donor_name}
                    </Link>
                    {donation.anonymous && (
                      <span className="ml-2 text-xs text-charcoal-light">(anonymous)</span>
                    )}
                    {tier && (
                      <span
                        title="Based on cumulative verified giving under this donor's email — internal only, never shown publicly."
                        className="ml-2 rounded-full border border-bronze/30 bg-bronze/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-bronze"
                      >
                        {tier}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal-light">{formatCurrency(donation.amount, { cents: true })}</td>
                  <td className="px-4 py-3 text-charcoal-light">{donation.organization_benefited ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal-light">{mileNumber ? `Mile ${mileNumber}` : "—"}</td>
                  <td className="px-4 py-3 text-charcoal-light">{formatDateLong(donation.date)}</td>
                  <td className="px-4 py-3">
                    {donation.verified ? (
                      <span className="rounded-full border border-olive/30 bg-olive/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-olive">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full border border-ink/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                        Unverified
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {donations.length === 0 && (
          <p className="p-6 text-sm text-charcoal-light">No donations match this filter.</p>
        )}
      </div>
    </Container>
  );
}
