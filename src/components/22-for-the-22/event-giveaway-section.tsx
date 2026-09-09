import Link from "next/link";
import { Container } from "@/components/shared/container";
import { GiveawayPrizeCard } from "./giveaway-prize-card";
import { getGiveawaySummary } from "@/lib/data/giveaway-prizes";
import { GIVEAWAY_ODDS_DISCLOSURE, NO_PURCHASE_NECESSARY_DISCLOSURE } from "@/lib/content/22-for-the-22";
import type { GiveawayPrizeRow, MissionPartnerRow } from "@/types/database";

/** Muted placeholder sitting next to confirmed prize cards — invites more brands in without pretending a confirmed relationship exists yet. */
function GiveawayMoreComingCard() {
  return (
    <div className="flex flex-col justify-center rounded-sm border border-dashed border-ink/20 bg-sand-light/40 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">More Prizes Incoming</p>
      <p className="mt-3 text-sm text-charcoal-light">
        We&apos;re reaching out to veteran-owned, first responder-owned, outdoor, endurance, and
        service-focused brands to build the giveaway prize package.
      </p>
      <p className="mt-3 text-sm font-medium text-ink">Want your brand included?</p>
      <Link
        href="/contact?item=22+For+the+22+Giveaway+Prize"
        className="mx-auto mt-4 inline-flex w-fit items-center text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
      >
        Donate a Giveaway Prize &rarr;
      </Link>
    </div>
  );
}

/**
 * The 22-Hour Giveaway section — reused on both /22forthe22 (the event page)
 * and /sponsors ("Support 22 For the 22"). Takes prizes and mission partners
 * already fetched by the caller (no fetch here) and joins them locally.
 */
export function EventGiveawaySection({
  prizes,
  partners,
  rulesHref = "/22forthe22/rules",
}: {
  prizes: GiveawayPrizeRow[];
  partners: MissionPartnerRow[];
  rulesHref?: string;
}) {
  const partnerById = new Map(partners.map((p) => [p.id, p]));
  const summary = getGiveawaySummary(prizes);

  return (
    <section id="giveaway" data-analytics-event="giveaway_section_view" className="py-16 sm:py-20">
      <Container>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-bronze">22-Hour Giveaway</p>
        <h2 className="text-balance font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
          Free Registration. Free Entry.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-charcoal-light/90">
          Every free registration for 22 For the 22 is automatically entered in the event giveaway. Winner(s)
          are selected after registration closes near the end of the 22-hour challenge.
        </p>

        <p className="mt-4 max-w-2xl text-sm font-semibold uppercase tracking-wide text-ink">
          {NO_PURCHASE_NECESSARY_DISCLOSURE}
        </p>

        {prizes.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-sm border border-ink/10 bg-off-white px-5 py-4">
              <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {summary.prizeCount}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Prizes</p>
            </div>
            <div className="rounded-sm border border-ink/10 bg-off-white px-5 py-4">
              <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {summary.brandCount}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Supporters</p>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {prizes.map((prize) => (
            <GiveawayPrizeCard key={prize.id} prize={prize} partner={prize.partner_id ? partnerById.get(prize.partner_id) ?? null : null} />
          ))}
          <GiveawayMoreComingCard />
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-charcoal-light">
          {GIVEAWAY_ODDS_DISCLOSURE} Eligibility, entry period, and winner-selection details are in the{" "}
          <Link href={rulesHref} className="text-bronze hover:underline">
            Official Rules
          </Link>
          . Retail values are approximate and provided for informational purposes. Product contributions do not
          imply endorsement of Tri For the 22 by any government agency or employer.
        </p>
      </Container>
    </section>
  );
}
