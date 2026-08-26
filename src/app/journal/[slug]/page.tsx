import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAdjacentJournalEntries, getJournalEntryBySlug } from "@/lib/data/journal";
import { Container } from "@/components/shared/container";
import { ShareButtons } from "@/components/shared/share-buttons";
import { JournalMarkdown } from "@/components/journal/journal-markdown";
import { JournalVideoEmbed } from "@/components/journal/journal-video-embed";
import { TrainingMetricsPanel } from "@/components/journal/training-metrics-panel";
import { MilestoneHeadline } from "@/components/journal/milestone-headline";
import { SponsorDisclosureBanner } from "@/components/journal/sponsor-disclosure-banner";
import { PartnerMentionsFooter } from "@/components/journal/partner-mentions-footer";
import { JournalCta } from "@/components/journal/journal-cta";
import { formatDateLong } from "@/lib/utils";
import { parseVideoUrl } from "@/lib/video-url";
import { CAMPAIGN_NAME, CAMPAIGN_URL, JOURNAL_PLACEHOLDER_IMAGE, SITE_NAME, SITE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import type { JournalEntryWithMentions } from "@/types/database";

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.title,
    description: entry.summary,
    canonical: `${CAMPAIGN_URL}/journal/${entry.slug}`,
    image: entry.image_url ?? JOURNAL_PLACEHOLDER_IMAGE,
  });
}

/**
 * BlogPosting for written/photo/milestone entries; VideoObject for vlogs
 * with a real video attached. Fields are only included when they actually
 * exist — never fabricate an upload date or duration. image/thumbnailUrl
 * always resolve to something real: the entry's own photo, or the on-brand
 * JOURNAL_PLACEHOLDER_IMAGE — never omitted, so a shared link always shows
 * an image. JSON-LD isn't resolved through Next's metadataBase, so this
 * needs a fully-qualified URL, unlike generateMetadata's image above.
 */
function entryJsonLd(entry: JournalEntryWithMentions) {
  const url = `${CAMPAIGN_URL}/journal/${entry.slug}`;
  const imageUrl = entry.image_url ?? `${CAMPAIGN_URL}${JOURNAL_PLACEHOLDER_IMAGE}`;
  const base = {
    "@context": "https://schema.org",
    url,
    mainEntityOfPage: url,
    ...(entry.published_at && { datePublished: entry.published_at }),
    author: { "@type": "Organization", name: CAMPAIGN_NAME, url: CAMPAIGN_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  if (entry.post_type === "vlog" && entry.video_url) {
    return {
      ...base,
      "@type": "VideoObject",
      name: entry.title,
      description: entry.summary,
      thumbnailUrl: imageUrl,
      contentUrl: entry.video_url,
      ...(entry.published_at && { uploadDate: entry.published_at }),
    };
  }

  return {
    ...base,
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.summary,
    image: imageUrl,
  };
}

export default async function JournalEntryPage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const [entry, adjacent] = await Promise.all([getJournalEntryBySlug(slug), getAdjacentJournalEntries(slug)]);

  if (!entry) notFound();

  const video = entry.video_url ? parseVideoUrl(entry.video_url) : null;
  const hasPhoto = Boolean(entry.image_url);

  return (
    <article className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(entryJsonLd(entry)).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="max-w-3xl">
        <Link href="/journal" className="text-xs font-semibold uppercase tracking-widest text-charcoal-light hover:text-ink">
          Journal / {entry.primary_category}
        </Link>

        <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bronze">
          <span>{entry.primary_category}</span>
          {entry.published_at && (
            <>
              <span aria-hidden>&middot;</span>
              <time dateTime={entry.published_at}>{formatDateLong(entry.published_at)}</time>
            </>
          )}
        </div>

        <h1 className="mt-3 text-balance font-display text-3xl font-semibold uppercase tracking-tight text-ink sm:text-4xl">
          {entry.title}
        </h1>

        <SponsorDisclosureBanner text={entry.sponsor_disclosure} />

        {entry.post_type === "vlog" && video ? (
          <div className="mt-8">
            <JournalVideoEmbed
              provider={video.provider}
              videoId={video.id}
              title={entry.title}
              fallbackImageUrl={entry.image_url ?? JOURNAL_PLACEHOLDER_IMAGE}
            />
          </div>
        ) : (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-sm bg-sand-light">
            <Image
              src={entry.image_url ?? JOURNAL_PLACEHOLDER_IMAGE}
              alt={entry.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              // The placeholder is a round crest, not a wide photo —
              // object-cover crops its top/bottom off to fill the 16:9
              // frame. Only a real photo should crop.
              className={hasPhoto ? "object-cover" : "object-contain p-10"}
            />
          </div>
        )}

        {entry.post_type === "milestone" && <MilestoneHeadline entry={entry} />}
        <TrainingMetricsPanel entry={entry} />

        <div className="mt-8 max-w-none">
          <JournalMarkdown body={entry.body} />
        </div>

        <PartnerMentionsFooter partnerMentions={entry.partnerMentions} beneficiaryMentions={entry.beneficiaryMentions} />

        <div className="mt-10 border-t border-ink/10 pt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-charcoal-light">Share This Entry</p>
          <ShareButtons url={`${CAMPAIGN_URL}/journal/${entry.slug}`} title={`${entry.title} | Tri For The 22`} />
        </div>

        <JournalCta category={entry.primary_category} />

        {(adjacent.prev || adjacent.next) && (
          <div className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6 text-sm">
            {adjacent.prev ? (
              <Link href={`/journal/${adjacent.prev.slug}`} className="font-semibold text-charcoal-light hover:text-ink">
                &larr; Previous Entry
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next && (
              <Link href={`/journal/${adjacent.next.slug}`} className="font-semibold text-charcoal-light hover:text-ink">
                Next Entry &rarr;
              </Link>
            )}
          </div>
        )}

        <div className="mt-6">
          <Link href="/journal" className="text-sm font-semibold uppercase tracking-wide text-bronze hover:text-bronze-light">
            &larr; Back to the Journal
          </Link>
        </div>
      </Container>
    </article>
  );
}
