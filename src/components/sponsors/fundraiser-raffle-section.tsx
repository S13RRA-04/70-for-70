import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { RaffleStatusCard } from "./raffle-status-card";
import { RaffleSupporterCard } from "./raffle-supporter-card";
import { RaffleMoreComingCard } from "./raffle-more-coming-card";
import { getRaffleSummary } from "@/lib/data/raffle-items";
import { DONATE_LINK } from "@/lib/constants";
import type { MissionPartnerRow, RaffleItemRow } from "@/types/database";

/**
 * "Tri For the 22 Fundraiser Raffle" — rendered on /22forthe22, between the
 * free Giveaway section and the event's donation/fundraising-goal section.
 * Deliberately a separate table/data model/naming from the 22 For the 22
 * giveaway (public.giveaway_prizes, partner_type 'giveaway-supporter'): this
 * raffle has no entry mechanic live yet and may eventually be a paid/ticketed
 * fundraiser, whereas the giveaway is free and no-purchase-necessary by law
 * (see NO_PURCHASE_NECESSARY_DISCLOSURE). Never merge the two or borrow
 * giveaway/sweepstakes language for this section. Takes the full partner and
 * raffle-item lists already fetched by the page and filters/joins them
 * locally.
 */
export function FundraiserRaffleSection({
  partners,
  raffleItems,
}: {
  partners: MissionPartnerRow[];
  raffleItems: RaffleItemRow[];
}) {
  const supporters = partners.filter((p) => p.partner_type === "raffle-supporter");
  const summary = getRaffleSummary(raffleItems);
  const itemsByPartnerId = new Map<string, RaffleItemRow[]>();
  for (const item of raffleItems) {
    if (!item.partner_id) continue;
    const existing = itemsByPartnerId.get(item.partner_id) ?? [];
    existing.push(item);
    itemsByPartnerId.set(item.partner_id, existing);
  }

  return (
    <section id="raffle" className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Tri For the 22 Fundraiser Raffle"
          title="Because 22 ≠ 0."
          description="Veteran- and first responder-backed brands are helping us build a prize package to raise money for veteran suicide prevention. The raffle prize package is being assembled from donated products provided by mission-aligned brands and supporters. As contributions are confirmed, they'll be added here."
        />

        <div className="mt-6 flex flex-wrap gap-4">
          <CTAButton href="/contact?item=Raffle+Prize+Item">Donate a Raffle Item</CTAButton>
          <CTAButton href={DONATE_LINK.href} variant="secondary">
            Support the Campaign
          </CTAButton>
        </div>

        <div className="mt-8">
          <RaffleStatusCard supporterCount={supporters.length} summary={summary} />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {supporters.map((partner) => (
            <RaffleSupporterCard
              key={partner.id}
              partner={partner}
              items={itemsByPartnerId.get(partner.id) ?? []}
            />
          ))}
          <RaffleMoreComingCard />
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-charcoal-light">
          Raffle details, eligibility, entry requirements, dates, prize values, and official rules
          will be published before entries open. Product contributions do not imply endorsement of
          Tri For the 22 by any government agency or employer. Retail values are approximate and
          provided for informational purposes.
        </p>
      </Container>
    </section>
  );
}
