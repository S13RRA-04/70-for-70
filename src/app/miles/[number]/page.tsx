import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMileWithDonations } from "@/lib/data/miles";
import { getCampaign } from "@/lib/data/campaign";
import { Container } from "@/components/shared/container";
import { ShareButtons } from "@/components/shared/share-buttons";
import {
  formatCurrency,
  formatNumber,
  milesFunded,
  mileStatusLabel,
  percentFunded,
} from "@/lib/utils";
import { CAMPAIGN_URL, FEATURED_MILE, MILE_SEGMENTS, TOTAL_FUNDRAISING_MILES } from "@/lib/constants";

function segmentFor(mileNumber: number) {
  return MILE_SEGMENTS.find((s) => mileNumber >= s.start && mileNumber <= s.end) ?? null;
}

export async function generateMetadata(props: PageProps<"/miles/[number]">): Promise<Metadata> {
  const { number } = await props.params;
  const mileNumber = Number.parseInt(number, 10);
  const mile = Number.isFinite(mileNumber) ? await getMileWithDonations(mileNumber) : null;
  if (!mile) return {};

  const isFeatured = mile.mile_number === FEATURED_MILE.number;
  const title = isFeatured
    ? `Mile 22 — ${FEATURED_MILE.title} | Tri For The 22`
    : `Help Fund Mile ${mile.mile_number} | Tri For The 22`;
  const description = isFeatured
    ? FEATURED_MILE.description
    : `${formatCurrency(mile.amount_funded)} of ${formatCurrency(mile.goal_amount)} funded toward Mile ${mile.mile_number} of the Tri For The 22 campaign.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/miles/${mile.mile_number}` },
  };
}

export default async function MilePage(props: PageProps<"/miles/[number]">) {
  const { number } = await props.params;
  const mileNumber = Number.parseInt(number, 10);

  if (!Number.isFinite(mileNumber) || mileNumber < 1 || mileNumber > TOTAL_FUNDRAISING_MILES) {
    notFound();
  }

  const [mile, campaign] = await Promise.all([getMileWithDonations(mileNumber), getCampaign()]);
  if (!mile) notFound();

  const segment = segmentFor(mile.mile_number);
  const percent = percentFunded(mile.amount_funded, mile.goal_amount);
  const remaining = Math.max(mile.goal_amount - mile.amount_funded, 0);
  const campaignPercent = percentFunded(campaign.amount_raised, campaign.fundraising_goal);
  const campaignMiles = milesFunded(campaign.amount_raised);
  const nextMile = mile.mile_number < TOTAL_FUNDRAISING_MILES ? mile.mile_number + 1 : null;
  const shareUrl = `${CAMPAIGN_URL}/miles/${mile.mile_number}`;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-2xl">
        <Link
          href="/fund-a-mile"
          className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
        >
          &larr; All 70 Miles
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            {mile.mile_number === FEATURED_MILE.number && (
              <p className="text-xs font-bold uppercase tracking-widest text-bronze">
                Featured Mile
              </p>
            )}
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink">
              {mile.mile_number === FEATURED_MILE.number
                ? `Mile 22 — ${FEATURED_MILE.title}`
                : `Mile ${String(mile.mile_number).padStart(2, "0")}`}
            </h1>
            {segment && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-bronze">
                {segment.label}
              </p>
            )}
          </div>
          <span className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
            {mileStatusLabel(mile.status)}
          </span>
        </div>

        {mile.mile_number === FEATURED_MILE.number && (
          <p className="mt-3 text-sm italic text-charcoal-light">{FEATURED_MILE.description}</p>
        )}

        {mile.status === "funded" ? (
          <div className="mt-8 rounded-sm border border-olive/40 bg-olive/10 p-6">
            <p className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              Mile {mile.mile_number} is funded.
            </p>
            {nextMile && (
              <p className="mt-2 text-sm text-charcoal-light">
                Thank you to everyone who made it happen.{" "}
                <Link href={`/miles/${nextMile}`} className="font-semibold text-bronze hover:underline">
                  Help take on Mile {nextMile}.
                </Link>
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="mt-8 font-display text-2xl font-semibold text-ink">
              {formatCurrency(mile.amount_funded)} of {formatCurrency(mile.goal_amount)} funded
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
              <div className="h-full rounded-full bg-bronze" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1 text-sm font-medium text-charcoal-light">
              {Math.round(percent)}% funded &middot; {formatCurrency(remaining)} remaining
            </p>
          </>
        )}

        {mile.dedication && (
          <p className="mt-4 text-sm italic text-charcoal-light">&ldquo;{mile.dedication}&rdquo;</p>
        )}

        {mile.donations.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
              Supported by
            </p>
            <ul className="mt-2 space-y-2">
              {mile.donations.map((donation) => (
                <li key={donation.id} className="rounded-sm border border-ink/10 bg-off-white p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">
                      {donation.anonymous ? "Anonymous" : donation.donor_name}
                    </span>
                    <span className="tabular-nums text-charcoal-light">
                      {formatCurrency(donation.amount)}
                    </span>
                  </div>
                  {donation.dedication_public &&
                    donation.dedication_type &&
                    (donation.dedication_name || donation.dedication_message) && (
                      <p className="mt-1 text-xs italic text-charcoal-light">
                        {donation.dedication_type === "in_memory_of" ? "In memory of" : "In honor of"}
                        {donation.dedication_name ? ` ${donation.dedication_name}` : ""}
                        {donation.dedication_branch ? ` (${donation.dedication_branch})` : ""}
                        {donation.dedication_message ? ` — ${donation.dedication_message}` : ""}
                      </p>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mile.status === "available" && mile.amount_funded === 0 && (
          <p className="mt-6 font-display text-lg font-semibold uppercase tracking-wide text-bronze">
            The road is open. Be the first to move this mile.
          </p>
        )}

        {(mile.status === "available" || mile.status === "partially_funded") && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/donate?mile=${mile.mile_number}`}
              className="inline-flex items-center justify-center rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
            >
              {mile.amount_funded > 0
                ? "Help Finish This Mile"
                : `Be the First to Fund Mile ${mile.mile_number}`}
            </Link>
            <Link
              href={`/sponsors/request?mile=${mile.mile_number}`}
              className="inline-flex items-center justify-center rounded-sm border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink/5"
            >
              Request Mile {mile.mile_number} Sponsorship
            </Link>
          </div>
        )}

        <div className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">
            Share This Mile
          </p>
          <ShareButtons url={shareUrl} title={`Help Fund Mile ${mile.mile_number} | Tri For The 22`} />
        </div>

        <p className="mt-10 border-t border-ink/10 pt-6 text-sm text-charcoal-light">
          Campaign total: {formatCurrency(campaign.amount_raised)} raised &middot;{" "}
          {formatNumber(campaignMiles, 1)} of {TOTAL_FUNDRAISING_MILES} miles funded (
          {Math.round(campaignPercent)}%)
        </p>
      </Container>
    </section>
  );
}
