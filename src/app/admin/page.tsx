import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCampaign } from "@/lib/data/campaign";
import { getMiles } from "@/lib/data/miles";
import { getTrainingObjectives } from "@/lib/data/training-objectives";
import { Container } from "@/components/shared/container";
import { StatCard } from "@/components/shared/stat-card";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { formatCurrency } from "@/lib/utils";
import { isWhoopConfigured } from "@/lib/whoop/config";
import { getWhoopConnection } from "@/lib/whoop/tokens";

export default async function AdminPage() {
  const user = await requireAdminUser();

  const campaign = await getCampaign();
  const miles = await getMiles();

  const admin = createAdminClient();
  const { count: pendingInquiries } = await admin
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: openSponsorshipRequests } = await admin
    .from("sponsorship_requests")
    .select("*", { count: "exact", head: true })
    .in("status", ["submitted", "under_review", "additional_information_requested", "ethics_review"]);

  const availableCount = miles.filter((m) => m.status === "available").length;
  const partialCount = miles.filter((m) => m.status === "partially_funded").length;
  const fundedCount = miles.filter((m) => m.status === "funded").length;

  const whoopConnected = isWhoopConfigured() ? Boolean(await getWhoopConnection()) : false;

  const trainingObjectives = await getTrainingObjectives();
  const objectivesCompleted = trainingObjectives.filter((o) => o.completed).length;

  return (
    <Container className="max-w-4xl py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase text-ink">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">Signed in as {user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Raised" value={formatCurrency(campaign.amount_raised)} />
        <StatCard label="Goal" value={formatCurrency(campaign.fundraising_goal)} />
        <StatCard label="Miles Available" value={String(availableCount)} />
        <StatCard label="Miles Funded" value={String(fundedCount)} />
        <StatCard label="Miles Partially Funded" value={String(partialCount)} />
        <StatCard label="New Contact Inquiries" value={String(pendingInquiries ?? 0)} />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-sm border border-bronze/30 bg-bronze/10 p-6">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
            Sponsorship Review Queue
          </p>
          <p className="mt-1 text-sm text-charcoal-light">
            {openSponsorshipRequests ?? 0} request(s) awaiting review, more info, or ethics
            review.
          </p>
        </div>
        <Link
          href="/admin/sponsorships"
          className="rounded-sm bg-bronze px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
        >
          Open Queue
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-sm border border-ink/10 bg-off-white p-6">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
            WHOOP Connection
          </p>
          <p className="mt-1 text-sm text-charcoal-light">
            {whoopConnected
              ? "Connected — powering the public training snapshot."
              : "Not connected — the training snapshot on The Race page is hidden."}
          </p>
        </div>
        <Link
          href="/admin/whoop"
          className="rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Manage
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-sm border border-ink/10 bg-off-white p-6">
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
            Training Objectives
          </p>
          <p className="mt-1 text-sm text-charcoal-light">
            {objectivesCompleted} of {trainingObjectives.length} complete.
          </p>
        </div>
        <Link
          href="/admin/training-objectives"
          className="rounded-sm border border-ink/20 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
        >
          Manage
        </Link>
      </div>

      <div className="mt-10 rounded-sm border border-ink/10 bg-sand-light p-6 text-sm text-charcoal-light">
        <p className="font-semibold text-ink">This is mostly a read-only overview.</p>
        <p className="mt-2">
          Full CRUD management for donations, miles, posts, and partner URLs is planned for a
          future milestone. Sponsorship requests are the exception — they have a working review
          queue (see above) because no sponsor may be published without going through it. Until
          the rest of admin CRUD exists, manage other records directly in Supabase Studio or via
          SQL — see the README and{" "}
          <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5">supabase/schema.sql</code>.
        </p>
      </div>
    </Container>
  );
}
