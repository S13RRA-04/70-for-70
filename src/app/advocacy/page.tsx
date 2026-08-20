import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTAButton } from "@/components/shared/cta-button";
import { findAboutSubsection } from "@/lib/content/about";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Advocacy",
  description: "Why veteran and first-responder support matters — the awareness mission behind For The 22.",
  alternates: { canonical: "/advocacy" },
};

const HOW_TO_HELP = [
  {
    title: "Learn the Signs",
    body: "Isolation, sudden changes in mood or habits, giving away possessions, or talking about being a burden are all worth taking seriously — in a veteran, a first responder, or anyone else.",
  },
  {
    title: "Check In, Directly",
    body: "A direct, specific question — not \"how are you,\" but \"how are you really doing since you got back / since that call\" — tells someone their answer actually matters.",
  },
  {
    title: "Point Toward Real Support",
    body: "You don't have to be the solution. Knowing where to send someone — a resource, a crisis line, a peer support program — is often the most useful thing you can offer.",
  },
  {
    title: "Stay Past the Headline",
    body: "Public attention on veteran and first-responder wellbeing tends to spike around anniversaries and news cycles. The need doesn't. Staying engaged year-round is its own form of advocacy.",
  },
] as const;

export default function AdvocacyPage() {
  const why22 = findAboutSubsection("why-22");

  return (
    <>
      <section className="border-b border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading
            as="h1"
            eyebrow="Mission Two: Advocate"
            title="Why It Matters"
            description="Raising awareness of the challenges carried by those who serve, and asking the public to give them the respect, care, and support they've earned."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            Service Doesn&apos;t End at Discharge
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              Veterans, law-enforcement officers, firefighters, EMS personnel, dispatchers, and
              other frontline professionals routinely serve their communities and country under
              extraordinary physical and psychological demands. Many place their health and
              their lives at risk in service to others.
            </p>
            <p>
              That service doesn&apos;t simply end when the deployment, the shift, or the career
              does. Leaving a role built around mission, unit, and purpose is its own kind of
              transition — one that can leave people carrying real weight without the structure
              that once helped them carry it.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            What They Carry
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
            <p>
              The effects of service aren&apos;t always visible. Physical injury, chronic pain,
              and the strain of years spent operating under pressure can persist long after the
              uniform comes off. So can the harder-to-see costs — reintegration, identity, and
              the mental and emotional load of what the job asked of them.
            </p>
            <p>
              None of that stays contained to one person. Spouses, kids, and coworkers absorb
              part of it too, which is part of why {SITE_NAME}&apos;s resource directory
              includes family and caregiver support alongside programs built for veterans and
              first responders directly.
            </p>
          </div>
        </Container>
      </section>

      {why22 && (
        <section className="py-16 sm:py-20">
          <Container className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
              {why22.heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-light">
              {why22.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 rounded-sm border border-bronze/30 bg-sand-light p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-bronze">
                Need Help Now?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                If you or someone you know is in crisis, immediate support is available.{" "}
                {SITE_NAME} is not a crisis-response service — the organizations listed connect
                you with people equipped to help.
              </p>
              <Link
                href="/crisis"
                className="mt-4 inline-flex text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light"
              >
                Get Crisis Support &rarr;
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
            A Public Responsibility
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal-light">
            Service deserves continued respect, care, and support — not just while it&apos;s
            happening, but long after. Advocacy doesn&apos;t require a uniform, a badge, or a
            donation. It&apos;s a handful of things anyone can actually do.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {HOW_TO_HELP.map((item) => (
              <div key={item.title}>
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                  {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-light">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl text-center">
          <p className="text-balance font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
            Turn Awareness Into Action
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-off-white/75">
            The most direct way to act on this mission is to help someone find support, or to
            become part of the team that carries it forward.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/resources">Find Resources</CTAButton>
            <CTAButton href="/about" variant="secondary" tone="dark">
              Read the Story
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
