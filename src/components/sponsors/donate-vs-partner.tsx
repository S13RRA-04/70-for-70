import { CTAButton } from "@/components/shared/cta-button";
import { SectionHeading } from "@/components/shared/section-heading";

/**
 * Strategically/ethically important distinction, kept explicit rather than
 * implied — see /financial-transparency's matching paragraph, which this
 * section must never contradict. Sponsorship money is never forwarded to
 * beneficiary organizations, and beneficiary donations are never routed
 * through campaign sponsorship.
 */
export function DonateVsPartner() {
  return (
    <div>
      <SectionHeading align="center" title="Two Ways to Support. One Mission." />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Donate</p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink">
            Support the Beneficiaries
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">
            Support the organizations at the heart of the mission. Charitable donations are directed to the
            campaign&apos;s beneficiary organizations through their own donation platforms.
          </p>
          <CTAButton href="/donate" className="mx-auto mt-6">
            Donate to the Mission
          </CTAButton>
        </div>

        <div className="flex flex-col rounded-sm border border-ink/10 bg-off-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Partner</p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-ink">
            Get the Campaign to the Start Line
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-light">
            Help get Tri For the 22 to the starting line. Equipment, services, expertise, and sponsorship
            support campaign execution, training, race preparation, outreach, and related campaign needs.
          </p>
          <CTAButton href="/contact?item=Campaign%20Partnership" className="mx-auto mt-6">
            Become a Partner
          </CTAButton>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-charcoal-light">
        Sponsorship and in-kind campaign support are not charitable donations and are not forwarded to any
        beneficiary organization. See{" "}
        <a href="/financial-transparency" className="text-bronze hover:underline">
          Financial Transparency
        </a>{" "}
        for how each works.
      </p>
    </div>
  );
}
