import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { RevealGrid, RevealOnScroll } from "@/components/shared/reveal-on-scroll";
import {
  AWARENESS_CALENDAR,
  AWARENESS_CATEGORIES,
  findRelatedEntries,
  type AwarenessEntry,
} from "@/lib/content/awareness-calendar";
import { SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export async function generateStaticParams() {
  return AWARENESS_CALENDAR.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = AWARENESS_CALENDAR.find((e) => e.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.name,
    description: entry.description ?? entry.summary,
    canonical: `${SITE_URL}/awareness/${slug}`,
  });
}

function categoryLabels(entry: AwarenessEntry): string[] {
  return entry.categoryIds
    .map((id) => AWARENESS_CATEGORIES.find((c) => c.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}

/** A small, factual card for the "related" rail — no tone-specific CTA here, just enough to invite a click into the full detail page. */
function EntryCard({ entry }: { entry: AwarenessEntry }) {
  return (
    <Link
      href={`/awareness/${entry.slug}`}
      className="hover-lift group flex flex-col rounded-xl border border-line bg-white p-5 hover:border-bronze/40"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">{entry.displayDate}</p>
      <p className="mt-1.5 font-display text-lg uppercase text-ink group-hover:text-bronze">
        {entry.name}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{entry.summary}</p>
    </Link>
  );
}

export default async function AwarenessEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = AWARENESS_CALENDAR.find((e) => e.slug === slug);
  if (!entry) notFound();

  const canonicalUrl = `${SITE_URL}/awareness/${slug}`;
  const labels = categoryLabels(entry);
  const related = findRelatedEntries(entry, AWARENESS_CALENDAR);
  const isRemembrance = entry.tone === "remember";

  const breadcrumbJsonLdData = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Awareness & Action Calendar", url: `${SITE_URL}/awareness` },
    { name: entry.name, url: canonicalUrl },
  ]);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumbJsonLdData)} />

      <section className={`border-b border-line pb-16 pt-16 sm:pb-20 sm:pt-24 ${isRemembrance ? "bg-jet text-paper" : ""}`}>
        <Container className="max-w-3xl">
          <p
            className={`label-caps text-xs ${isRemembrance ? "text-[#bdbdbd]" : "text-muted"}`}
          >
            <Link href="/awareness" className={isRemembrance ? "hover:text-white hover:underline" : "hover:text-navy hover:underline"}>
              Awareness &amp; Action Calendar
            </Link>
            {labels[0] && ` / ${labels[0]}`}
          </p>

          <p className={`label-caps mt-4 ${isRemembrance ? "text-[#bdbdbd]" : "text-olive"}`}>
            {entry.displayDate}
          </p>

          <h1
            className={`text-worn mt-3 text-balance font-display text-[clamp(44px,6vw,80px)] uppercase leading-[0.95] ${isRemembrance ? "text-white" : "text-navy"}`}
          >
            {entry.name}
          </h1>

          <p className={`mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl ${isRemembrance ? "text-[#cfcfcf]" : "text-copy"}`}>
            {entry.description ?? entry.summary}
          </p>

          {labels.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <span
                  key={label}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                    isRemembrance ? "border-off-white/25 text-off-white/80" : "border-ink/15 bg-off-white text-charcoal-light"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/*
            Plain <a>, not <Link>, throughout this block — these hrefs are a
            mix of same-host org paths (/crisis, /70k) and absolute
            cross-host campaign URLs (CAMPAIGN_URL + "/donate" etc., built
            in awareness-calendar.ts), plus the occasional tel: link. Next's
            client-side nav for a relative campaign path would 308
            cross-origin and get CORS-blocked; a full page load handles
            every case uniformly, same reasoning as AwarenessBanner's
            /crisis link and AwarenessEntryBanner's /awareness link.

            Remembrance entries lead with honoring the fallen, not a donate
            CTA — see the content file's own doc comment.
          */}
          {!isRemembrance && (entry.actionCTA || (entry.resourceLinks && entry.resourceLinks.length > 0)) && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {entry.actionCTA && (
                // eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional, see comment above
                <a
                  href={entry.actionCTA.href}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-ink/90"
                >
                  {entry.actionCTA.label}
                </a>
              )}
              {entry.resourceLinks?.map((link) => (
                // eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional, see comment above
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-dark"
                >
                  {link.label} &rarr;
                </a>
              ))}
            </div>
          )}

          {isRemembrance && entry.resourceLinks && entry.resourceLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {entry.resourceLinks.map((link) => (
                // eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional, see comment above
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wide text-bronze-light hover:text-off-white"
                >
                  {link.label} &rarr;
                </a>
              ))}
            </div>
          )}

          {entry.shareGraphic && (
            <a
              href={entry.shareGraphic.src}
              download
              className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide ${
                isRemembrance ? "text-off-white/80 hover:text-off-white" : "text-bronze hover:text-bronze-dark"
              }`}
            >
              <Download size={14} aria-hidden />
              Download Social Graphic
            </a>
          )}
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <RevealOnScroll>
              <SectionHeading eyebrow="Related" title="Other Observances Like This One" />
            </RevealOnScroll>
            <RevealGrid>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((e) => (
                  <EntryCard key={e.slug} entry={e} />
                ))}
              </div>
            </RevealGrid>
          </Container>
        </section>
      )}

      <CTASection
        eyebrow="Keep Exploring"
        title="See the Full Calendar"
        buttons={[{ label: "Browse the Awareness Calendar", href: "/awareness" }]}
      />
    </article>
  );
}
