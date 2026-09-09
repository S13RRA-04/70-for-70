import Link from "next/link";

/** Muted placeholder sitting next to confirmed supporter cards — invites more brands in without pretending a confirmed relationship exists yet. */
export function RaffleMoreComingCard() {
  return (
    <div className="flex flex-col justify-center rounded-sm border border-dashed border-ink/20 bg-sand-light/40 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        More Supporters Incoming
      </p>
      <p className="mt-3 text-sm text-charcoal-light">
        We&apos;re currently reaching out to veteran-owned, first responder-owned, outdoor,
        endurance, and service-focused brands to build the prize package.
      </p>
      <p className="mt-3 text-sm font-medium text-ink">Want your brand included?</p>
      <Link
        href="/contact?item=Raffle+Prize+Item"
        className="mx-auto mt-4 inline-flex w-fit items-center text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
      >
        Contribute a Raffle Item &rarr;
      </Link>
    </div>
  );
}
