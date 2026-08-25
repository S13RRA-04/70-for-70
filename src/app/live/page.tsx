import { getCampaign } from "@/lib/data/campaign";
import { getRecentDonations } from "@/lib/data/donations";
import { getRaceDayStatus } from "@/lib/race-day";
import { getTrainingSnapshot } from "@/lib/whoop/client";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { CTASection } from "@/components/shared/cta-section";
import { TrainingSnapshot } from "@/components/training/training-snapshot";
import { Countdown } from "@/components/shared/countdown";
import {
  formatCurrency,
  formatDateLong,
  formatNumber,
  milesFunded,
  percentFunded,
} from "@/lib/utils";
import { CAMPAIGN_URL, DONATE_LINK, RACE_INFO } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { isRaceDayModeEnabled } from "@/lib/race-day-mode";

export const metadata = pageMetadata({
  title: "Race Day Live",
  description: "Live race-day status and fundraising progress for Tri For The 22.",
  canonical: `${CAMPAIGN_URL}/live`,
});

const DISCIPLINE_LABEL: Record<"swim" | "bike" | "run" | "finished", string> = {
  swim: "swimming",
  bike: "on the bike",
  run: "running",
  finished: "finished",
};

/** Shown until RACE_DAY_MODE is turned on — see isRaceDayModeEnabled(). No live dashboard, map, or splits before then; just the confirmed date and a countdown back to /the-race. */
function RaceDayNotActivated() {
  return (
    <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-24">
      <Container className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bronze-light">Race Day</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Race Day Live Isn&apos;t Active Yet
        </h1>
        <p className="mt-3 text-base text-off-white/75">
          Live race-day tracking turns on during race week. Until then, here&apos;s the countdown.
        </p>
        {RACE_INFO.raceDate && (
          <div className="mt-8">
            <Countdown targetIso={RACE_INFO.raceDate} />
          </div>
        )}
        <a
          href="/the-race"
          className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze-light hover:underline"
        >
          &larr; Back to The Race
        </a>
      </Container>
    </section>
  );
}

export default async function LivePage() {
  if (!isRaceDayModeEnabled()) {
    return <RaceDayNotActivated />;
  }

  const [campaign, status, recentDonations, trainingSnapshot] = await Promise.all([
    getCampaign(),
    getRaceDayStatus(),
    getRecentDonations(5),
    getTrainingSnapshot(),
  ]);

  const percent = percentFunded(campaign.amount_raised, campaign.fundraising_goal);
  const miles70 = milesFunded(campaign.amount_raised);
  const remainingMiles = Math.max(70 - miles70, 0);

  return (
    <>
      <section className="border-b border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bronze-light">
            Race Day
          </p>

          {status.isLive ? (
            <>
              <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Cody is {status.currentDiscipline ? DISCIPLINE_LABEL[status.currentDiscipline] : "racing"}
              </h1>
              <p className="mt-3 text-lg text-off-white/85">
                {status.currentMile !== null
                  ? `Mile ${formatNumber(status.currentMile, 1)} of ${status.totalMiles}`
                  : `${status.totalMiles} miles`}
                {status.elapsedTime ? ` · ${status.elapsedTime} elapsed` : ""}
              </p>
              {status.latestSplit && (
                <p className="mt-1 text-sm text-off-white/70">
                  Latest split: {status.latestSplit.discipline} — {status.latestSplit.time}
                </p>
              )}
              {status.mapUrl && (
                <a
                  href={status.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-bronze-light hover:underline"
                >
                  View Live Map
                </a>
              )}
            </>
          ) : (
            <h1 className="mt-4 text-balance font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              Race Day Hasn&apos;t Started Yet
            </h1>
          )}

          <div className="mt-10 max-w-xl rounded-sm border border-off-white/15 bg-ink/40 p-6 backdrop-blur-sm">
            <p className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
              {formatCurrency(campaign.amount_raised)}{" "}
              <span className="text-lg font-medium text-off-white/70">raised</span>
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-bronze-light">
              {formatNumber(miles70, 1)} of 70 fundraising miles funded
            </p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-off-white/15">
              <div className="h-full rounded-full bg-bronze" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-off-white/60">
              {formatNumber(remainingMiles, 1)} fundraising miles left
            </p>
          </div>
        </Container>
      </section>

      {trainingSnapshot && (
        <section className="border-b border-ink/10 py-16 sm:py-20">
          <Container className="max-w-2xl">
            <SectionHeading
              eyebrow="Toward the Goal"
              title="Training Progress & Milestones"
              description="Recovery, sleep, and recent training sessions — pulled live from WHOOP as the work toward race day happens."
            />
            <div className="mt-8">
              <TrainingSnapshot snapshot={trainingSnapshot} />
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Latest Support" title="Recent Mission Support" />
          <div className="mt-8">
            {recentDonations.length > 0 ? (
              <ul className="space-y-3">
                {recentDonations.map((donation) => (
                  <li
                    key={donation.id}
                    className="flex items-center justify-between rounded-sm border border-ink/10 bg-off-white p-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-ink">
                        {donation.anonymous ? "Anonymous" : donation.donor_name}
                        {donation.mile_number !== null && (
                          <span className="font-normal text-charcoal-light">
                            {" "}
                            · Mile {donation.mile_number}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-charcoal-light">{formatDateLong(donation.date)}</p>
                    </div>
                    <span className="tabular-nums font-medium text-ink">
                      {formatCurrency(donation.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No donations recorded yet."
                description="Recent verified support will show up here as it comes in."
              />
            )}
          </div>
        </Container>
      </section>

      <CTASection
        title="Help Get Tri For The 22 Across the Finish Line"
        description="Every mile funded on race day is a mile that mattered beyond the course."
        buttons={[{ label: DONATE_LINK.label, href: DONATE_LINK.href }]}
      />
    </>
  );
}
