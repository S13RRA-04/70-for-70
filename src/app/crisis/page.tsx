import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageSquare, ExternalLink } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getCrisisResources, type Resource } from "@/lib/content/resources";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Crisis Support",
  description: "Immediate crisis support for veterans and first responders.",
  alternates: { canonical: "/crisis" },
};

const LINK_CLASSES =
  "inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors";

function CrisisResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-5 sm:p-6">
      <p className="font-display text-lg font-semibold uppercase tracking-wide text-ink">{resource.name}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-light">{resource.description}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {resource.phone && (
          <a href={`tel:${resource.phone}`} className={`${LINK_CLASSES} bg-bronze text-off-white hover:bg-bronze-light`}>
            <Phone size={14} aria-hidden="true" />
            Call {resource.phone}
          </a>
        )}
        {resource.text && (
          <a href={`sms:${resource.text}`} className={`${LINK_CLASSES} border border-ink/20 text-ink hover:bg-ink/5`}>
            <MessageSquare size={14} aria-hidden="true" />
            Text {resource.text}
          </a>
        )}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK_CLASSES} border border-ink/20 text-ink hover:bg-ink/5`}
        >
          Visit Site
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default function CrisisPage() {
  const general = getCrisisResources("general");
  const veterans = getCrisisResources("veterans");
  const firstResponders = getCrisisResources("first-responders");

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-12 sm:py-16">
        <Container className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bronze">Need Help Now?</p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
            Crisis Support
          </h1>
          <p className="mt-3 text-base leading-relaxed text-charcoal-light">
            {SITE_NAME} is not a crisis-response service. The organizations below are equipped to
            provide immediate support, free and confidential.
          </p>
        </Container>
      </section>

      {/* Universal fallback — applies regardless of who you are, shown first */}
      <section className="py-10 sm:py-12">
        <Container className="max-w-2xl space-y-4">
          {general.map((resource) => (
            <CrisisResourceCard key={resource.name} resource={resource} />
          ))}
        </Container>
      </section>

      <section id="veterans" className="scroll-mt-20 border-t border-ink/10 py-10 sm:py-12">
        <Container className="max-w-2xl">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">Veterans</h2>
          <div className="mt-5 space-y-4">
            {veterans.map((resource) => (
              <CrisisResourceCard key={resource.name} resource={resource} />
            ))}
          </div>
        </Container>
      </section>

      <section id="first-responders" className="scroll-mt-20 border-t border-ink/10 py-10 sm:py-12">
        <Container className="max-w-2xl">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
            First Responders
          </h2>
          <div className="mt-5 space-y-4">
            {firstResponders.map((resource) => (
              <CrisisResourceCard key={resource.name} resource={resource} />
            ))}
          </div>
        </Container>
      </section>

      <section id="emergency" className="scroll-mt-20 border-t border-ink/10 bg-ink py-10 text-off-white sm:py-12">
        <Container className="max-w-2xl">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Immediate Emergency</h2>
          <p className="mt-3 text-sm leading-relaxed text-off-white/80">
            If there is an immediate threat to life or safety, call 911 or go to the nearest
            emergency room.
          </p>
          <a
            href="tel:911"
            className={`${LINK_CLASSES} mt-5 bg-bronze text-off-white hover:bg-bronze-light`}
          >
            <Phone size={14} aria-hidden="true" />
            Call 911
          </a>
        </Container>
      </section>

      <section className="border-t border-ink/10 py-8">
        <Container className="max-w-2xl">
          <p className="text-xs leading-relaxed text-charcoal-light">
            These listings are informational and not an endorsement or guarantee of service.{" "}
            {SITE_NAME} is not a medical, legal, or crisis-response provider. Program availability,
            hours, and contact methods may change — confirm current information directly with each
            organization. For non-crisis support, see the full{" "}
            <Link href="/resources" className="font-semibold text-bronze hover:underline">
              Resources directory
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
