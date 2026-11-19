import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { VoiceVideo } from "@/components/voices/voice-video";
import { VoicesSupportSection } from "@/components/voices/voices-support";
import { PORTAL_PATHS } from "@/lib/content/voices-talent";
import { VOICES_SERIES_NAME } from "@/lib/content/voices";
import { SITE_URL } from "@/lib/constants";
import { getVoiceGallery, type VoiceGalleryItem } from "@/lib/data/voices";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { TALENT_CATEGORY_LABELS, type TalentCategory } from "@/lib/voices/model";

export const metadata = pageMetadata({
  title: "Voices For The 22 | Mental Health, Connection & Hope",
  absoluteTitle: true,
  description:
    "Voices For The 22 brings together influential voices to support the mental health of veterans, first responders and their families. Learn how to participate.",
  canonical: "/voices",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: VOICES_SERIES_NAME, url: `${SITE_URL}/voices` },
]);

const PUBLISHED_DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function formatPublished(date: string) {
  return PUBLISHED_DATE.format(new Date(`${date}T00:00:00Z`));
}

function Transcript({ item }: { item: VoiceGalleryItem }) {
  if (!item.transcript) return null;
  return (
    <details className="mt-5 max-w-xl rounded-lg border border-line bg-white p-5">
      <summary className="cursor-pointer font-bold text-navy">Read the transcript</summary>
      <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-copy">
        {item.transcript.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}

export default async function VoicesPage(props: PageProps<"/voices">) {
  const searchParams = await props.searchParams;
  const rawCategory = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;

  const gallery = await getVoiceGallery();
  const categories = [...new Set(gallery.map((i) => i.category).filter((c): c is TalentCategory => c !== null))];
  const activeCategory = rawCategory && categories.includes(rawCategory as TalentCategory) ? (rawCategory as TalentCategory) : null;

  const [featured, ...rest] = gallery;
  const others = activeCategory ? rest.filter((i) => i.category === activeCategory) : rest;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
      <PageHero
        pillar="connection"
        eyebrow="Video series"
        title={VOICES_SERIES_NAME}
        description="Messages of hope from voices across entertainment, music, athletics, military service and public life — to veterans, first responders and their families. Your life matters."
      >
        <Link
          href={PORTAL_PATHS.talent}
          className="action-control inline-flex min-h-[50px] items-center gap-2 bg-navy px-6 font-bold text-white hover:bg-navy-hover"
        >
          Talent &amp; Media Inquiries
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </PageHero>

      {featured ? (
        <section className="border-b border-line py-14 sm:py-16" aria-labelledby="featured-voice">
          <Container>
            <article id={featured.slug} className="grid scroll-mt-28 gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <VoiceVideo message={featured} />
              </div>
              <div className="lg:col-span-7">
                <p className="label-caps text-xs text-help">
                  {featured.featured ? "Featured message" : "Latest message"} · {formatPublished(featured.publishedOn)}
                </p>
                <h2 id="featured-voice" className="mt-3 font-display text-5xl uppercase leading-none text-navy sm:text-6xl">
                  {featured.name}
                </h2>
                {featured.descriptor && <p className="mt-3 text-base text-copy">{featured.descriptor}</p>}
                {featured.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-copy">{featured.summary}</p>}
                <Transcript item={featured} />
                <Link
                  href={`/voices/${featured.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center font-bold text-navy underline underline-offset-4 hover:text-steel"
                >
                  Share this message →
                </Link>
              </div>
            </article>
          </Container>
        </section>
      ) : (
        <section className="border-b border-line py-14">
          <Container className="max-w-3xl text-center">
            <p className="font-display text-3xl uppercase text-navy">The first messages are on their way.</p>
          </Container>
        </section>
      )}

      {rest.length > 0 && (
        <section className="border-b border-line bg-white py-14 sm:py-16" aria-labelledby="more-voices">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="more-voices" className="font-display text-4xl uppercase leading-none text-navy">More voices</h2>
              {categories.length > 1 && (
                <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
                  {[null, ...categories].map((category) => (
                    <Link
                      key={category ?? "all"}
                      href={category ? `/voices?category=${category}` : "/voices"}
                      aria-current={activeCategory === category ? "page" : undefined}
                      scroll={false}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
                        activeCategory === category ? "border-navy bg-navy text-white" : "border-line text-copy hover:border-navy",
                      )}
                    >
                      {category ? TALENT_CATEGORY_LABELS[category] : "All"}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
            <ul className="mt-10 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug} id={item.slug} className="scroll-mt-28">
                  <VoiceVideo message={item} className="relative mx-auto w-full max-w-[300px]" />
                  <div className="mt-8">
                    <p className="label-caps text-xs text-help">{formatPublished(item.publishedOn)}</p>
                    <h3 className="mt-2 font-display text-3xl uppercase leading-none text-navy">{item.name}</h3>
                    {item.descriptor && <p className="mt-2 text-sm text-copy">{item.descriptor}</p>}
                    <Transcript item={item} />
                    <Link href={`/voices/${item.slug}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-navy underline underline-offset-4">
                      View &amp; share →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <VoicesSupportSection />

      <section className="bg-navy py-14 text-white">
        <Container className="flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-caps text-gold">Talent &amp; media inquiries</p>
            <p className="mt-2 font-display text-3xl uppercase leading-none">Add your voice.</p>
          </div>
          <Link
            href={PORTAL_PATHS.talent}
            className="inline-flex min-h-[50px] items-center rounded-sm bg-white px-6 font-bold text-navy hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Visit the talent portal
          </Link>
        </Container>
      </section>
    </>
  );
}
