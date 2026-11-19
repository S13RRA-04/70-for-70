import Link from "next/link";
import { Container } from "@/components/shared/container";

/**
 * Mental health support band for the public Voices pages. For The 22 is not a
 * clinical, emergency or crisis-counseling service — this only points to the
 * 988 Lifeline and to the resource directory.
 */
export function VoicesSupportSection() {
  return (
    <section className="bg-paper py-14 sm:py-16" aria-labelledby="voices-support-heading">
      <Container className="max-w-4xl">
        <h2 id="voices-support-heading" className="font-display text-4xl uppercase leading-none text-navy">
          You don&apos;t have to carry it alone.
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="font-bold text-navy">In the U.S. and struggling, or thinking about suicide?</p>
            <p className="mt-2 text-base leading-relaxed text-copy">
              Call or text <a href="tel:988" className="font-bold text-help underline underline-offset-4">988</a> or chat at{" "}
              <a href="https://988lifeline.org" className="font-bold text-help underline underline-offset-4">988lifeline.org</a> to reach
              the 988 Suicide &amp; Crisis Lifeline — free, confidential, 24/7.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="font-bold text-navy">Veterans and service members</p>
            <p className="mt-2 text-base leading-relaxed text-copy">
              Call <a href="tel:988" className="font-bold text-help underline underline-offset-4">988 and press 1</a>, or text{" "}
              <a href="sms:838255" className="font-bold text-help underline underline-offset-4">838255</a> to reach the Veterans Crisis Line.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-copy">
          If someone is in immediate danger, call 911. For The 22 is not a clinical, emergency or crisis-counseling service — we
          connect people with trusted programs and peer support.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/crisis" className="action-control inline-flex min-h-[50px] items-center bg-help px-6 font-bold text-white hover:bg-help-dark">
            Get Help Now
          </Link>
          <Link
            href="/resources"
            className="action-control inline-flex min-h-[50px] items-center border-2 border-help px-6 font-bold text-help hover:bg-help hover:text-white"
          >
            Find resources
          </Link>
        </div>
      </Container>
    </section>
  );
}
