import Link from "next/link";
import { Phone, MessageSquare, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { getCrisisResources, type Resource } from "@/lib/content/resources";
import { SITE_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Crisis Support",
  description: "Immediate crisis support for veterans and first responders.",
  canonical: "/crisis",
});

/** Help blue is reserved for exactly these actions — see the palette note in globals.css. */
function CrisisResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-6 sm:p-7">
      <p className="font-display text-[26px] uppercase leading-none text-navy">{resource.name}</p>
      <p className="text-base leading-relaxed text-copy">{resource.description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        {resource.phone && (
          <a
            href={`tel:${resource.phone}`}
            className="action-control inline-flex min-h-[50px] items-center gap-2 bg-help px-5 font-bold text-white hover:bg-help-dark"
          >
            <Phone size={16} aria-hidden="true" />
            Call {resource.phone}
          </a>
        )}
        {resource.text && (
          <a
            href={`sms:${resource.text}`}
            className="action-control inline-flex min-h-[50px] items-center gap-2 border-2 border-help px-5 font-bold text-help hover:bg-help hover:text-white"
          >
            <MessageSquare size={16} aria-hidden="true" />
            Text {resource.text}
          </a>
        )}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 px-2 font-bold text-navy hover:text-help hover:underline"
        >
          Visit site
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function CrisisGroup({
  id,
  label,
  title,
  description,
  resources,
}: {
  id?: string;
  label: string;
  title: string;
  description?: string;
  resources: Resource[];
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} className="scroll-mt-28 border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-x-16 gap-y-8 px-6 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-3 lg:sticky lg:top-32 lg:self-start">
          <p className="label-caps text-help">{label}</p>
          <h2 id={id ? `${id}-heading` : undefined} className="font-display text-[clamp(36px,4vw,48px)] uppercase leading-none text-navy">
            {title}
          </h2>
          {description && <p className="max-w-sm text-base leading-relaxed text-copy">{description}</p>}
        </div>
        <div className="grid gap-4">
          {resources.map((resource) => (
            <CrisisResourceCard key={resource.name} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CrisisPage() {
  const general = getCrisisResources("general");
  const veterans = getCrisisResources("veterans");
  const firstResponders = getCrisisResources("first-responders");

  return (
    <>
      <PageHero
        pillar="connection"
        eyebrow="Connection · Need help now"
        title="Crisis support"
        description={`${SITE_NAME} is not a crisis-response service. The organizations below are equipped to provide immediate support — free and confidential.`}
        aside={
          <div className="flex flex-col gap-3 rounded-xl bg-help p-8 text-white">
            <p className="label-caps text-[#d3e6f3]">Veterans Crisis Line · 24/7</p>
            <p className="font-display text-[88px] leading-none">988</p>
            <p className="text-base leading-relaxed text-[#e3eef6]">
              Press 1 to reach responders who understand service. In immediate danger, call 911.
            </p>
            <div className="mt-1 flex flex-wrap gap-2.5">
              <a
                href="tel:988"
                className="action-control inline-flex min-h-[50px] items-center bg-white px-5 font-bold text-help hover:bg-paper"
              >
                Call 988, press 1
              </a>
              <a
                href="sms:838255"
                className="action-control inline-flex min-h-[50px] items-center border-2 border-white px-5 font-bold text-white hover:bg-white/10"
              >
                Text 838255
              </a>
            </div>
          </div>
        }
      />

      {/* Universal fallback — applies regardless of who you are, shown first */}
      <CrisisGroup
        label="Anyone"
        title="Start here"
        description="These lines serve everyone, any time — you don't need to be a veteran or first responder."
        resources={general}
      />
      <CrisisGroup id="veterans" label="Veterans" title="For veterans" resources={veterans} />
      <CrisisGroup
        id="first-responders"
        label="First responders"
        title="For those who answer the call"
        description="Law enforcement, fire, EMS, dispatch, and corrections."
        resources={firstResponders}
      />

      <section id="emergency" aria-labelledby="emergency-heading" className="scroll-mt-28 bg-navy text-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 px-6 py-16 sm:py-20">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="label-caps text-mist">Immediate emergency</p>
            <h2 id="emergency-heading" className="font-display text-[clamp(40px,5vw,64px)] uppercase leading-none">
              If a life is in danger, call 911.
            </h2>
            <p className="text-lg leading-relaxed text-mist">
              If there is an immediate threat to life or safety, call 911 or go to the nearest emergency room.
            </p>
          </div>
          <a
            href="tel:911"
            className="action-control inline-flex min-h-[56px] items-center gap-2 bg-white px-7 text-lg font-bold text-navy hover:bg-paper"
          >
            <Phone size={18} aria-hidden="true" />
            Call 911
          </a>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-[1240px] px-6">
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            These listings are informational and not an endorsement or guarantee of service. {SITE_NAME} is not a
            medical, legal, or crisis-response provider. Program availability, hours, and contact methods may change —
            confirm current information directly with each organization. For non-crisis support, see the full{" "}
            <Link href="/resources" className="font-bold text-navy underline underline-offset-2 hover:text-help">
              resources directory
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
