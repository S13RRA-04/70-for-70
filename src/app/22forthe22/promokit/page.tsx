import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CampaignPageHero } from "@/components/shared/campaign-page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { ShareButtons } from "@/components/shared/share-buttons";
import { AssetDownloadCard } from "@/components/22-for-the-22/promokit/asset-download-card";
import { PhotoFrameCard } from "@/components/22-for-the-22/promokit/photo-frame-card";
import { CaptionCard } from "@/components/22-for-the-22/promokit/caption-card";
import { HashtagBlock } from "@/components/22-for-the-22/promokit/hashtag-block";
import {
  PROMO_KIT_CAPTIONS,
  PROMO_KIT_HERO_CONTENT,
  PROMO_KIT_LOGO_ASSET,
  PROMO_KIT_OPTIONAL_DISCLAIMER,
  PROMO_KIT_PHOTO_FRAMES,
  PROMO_KIT_SOCIAL_POSTS,
  PROMO_KIT_STORY_GRAPHICS,
  PROMO_KIT_ZIP_FILENAME,
  PROMO_KIT_ZIP_PATH,
} from "@/lib/content/22-for-the-22-promokit";
import { CAMPAIGN_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Participant Promo Kit | 22 For the 22",
  description:
    "Ready-to-share social graphics, Story assets, photo frames, suggested captions, and hashtags for 22 For the 22 participants.",
  canonical: `${CAMPAIGN_URL}/22forthe22/promokit`,
});

const CAMPAIGN_LINKS = [
  { label: "Event Page", href: `${CAMPAIGN_URL}/22forthe22` },
  { label: "Main Site", href: CAMPAIGN_URL },
  { label: "Donate", href: `${CAMPAIGN_URL}/donate` },
];

export default function PromoKitPage() {
  return (
    <div data-analytics-event="promokit_page_view">
      <CampaignPageHero>
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow={PROMO_KIT_HERO_CONTENT.eyebrow}
          title={PROMO_KIT_HERO_CONTENT.title}
          description={PROMO_KIT_HERO_CONTENT.description}
        />
        <p className="mt-2 font-display text-lg font-semibold uppercase tracking-wide text-bronze-light">
          {PROMO_KIT_HERO_CONTENT.tagline}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={PROMO_KIT_ZIP_PATH}
            download={PROMO_KIT_ZIP_FILENAME}
            data-analytics-event="promokit_zip_download"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-bronze px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-bronze-light"
          >
            <Download size={16} aria-hidden />
            Download Full Promo Kit (ZIP)
          </a>
          <Link
            href="/22forthe22"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm border border-off-white/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-off-white transition-colors hover:bg-off-white/10"
          >
            Back to Event Page
          </Link>
        </div>

        <p className="mt-5 max-w-xl text-sm text-off-white/70">{PROMO_KIT_OPTIONAL_DISCLAIMER}</p>
      </CampaignPageHero>

      {/* Social Posts */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Social Posts" title="Square Feed Graphics" description="Ready-to-post square graphics for Instagram, Facebook, and LinkedIn feeds." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_KIT_SOCIAL_POSTS.map((asset) => (
              <AssetDownloadCard key={asset.id} asset={asset} />
            ))}
          </div>
        </Container>
      </section>

      {/* Story Graphics */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Story Graphics"
            title="Instagram & Facebook Stories"
            description="Vertical graphics sized for Stories and other full-screen mobile placements."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_KIT_STORY_GRAPHICS.map((asset) => (
              <AssetDownloadCard key={asset.id} asset={asset} />
            ))}
          </div>
        </Container>
      </section>

      {/* Photo Frames */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Photo Frames"
            title="Overlay Your Own Photo"
            description="Transparent PNG frames — layer one over your own photo in any photo or Story editor."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_KIT_PHOTO_FRAMES.map((asset) => (
              <PhotoFrameCard key={asset.id} asset={asset} />
            ))}
          </div>
        </Container>
      </section>

      {/* Brand Assets */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Brand Assets" title="Logo Badge" description="For your own edits — the 22 For the 22 badge on a transparent background." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AssetDownloadCard asset={PROMO_KIT_LOGO_ASSET} />
          </div>
        </Container>
      </section>

      {/* Suggested Captions */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Suggested Captions" title="Copy & Paste Ready" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_KIT_CAPTIONS.map((caption) => (
              <CaptionCard key={caption.id} caption={caption} />
            ))}
          </div>
        </Container>
      </section>

      {/* Hashtags */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Hashtags" title="Recommended Tags" />
          <div className="mt-8">
            <HashtagBlock />
          </div>
        </Container>
      </section>

      {/* Campaign Links */}
      <section className="border-t border-ink/10 bg-sand-light py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Campaign Links" title="Share These Links" />
          <ul className="mt-6 space-y-3">
            {CAMPAIGN_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-bronze hover:text-bronze-light hover:underline"
                >
                  {link.label} — {link.href}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Social Sharing */}
      <section className="border-t border-ink/10 py-16 sm:py-20">
        <Container className="max-w-2xl">
          <SectionHeading eyebrow="Share" title="Share the Event Page" />
          <div className="mt-6">
            <ShareButtons
              url={`${CAMPAIGN_URL}/22forthe22`}
              title="I'm participating in 22 For the 22 — join the mission."
              analyticsEvent="promokit_share_click"
            />
          </div>
          <p className="mt-4 text-sm text-charcoal-light">
            On Instagram, download an image above and post it directly from your device.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-charcoal-light/80">{PROMO_KIT_OPTIONAL_DISCLAIMER}</p>
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-ink py-16 text-off-white sm:py-20">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-2xl font-semibold uppercase tracking-wide">Ready to Help Carry It?</p>
          <p className="mt-3 text-base text-off-white/75">
            Every optional share helps more people hear about the mission — no pressure, no requirement.
          </p>
          <a
            href={PROMO_KIT_ZIP_PATH}
            download={PROMO_KIT_ZIP_FILENAME}
            data-analytics-event="promokit_zip_download"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-bronze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-off-white hover:bg-bronze-light"
          >
            <Download size={16} aria-hidden />
            Download Full Promo Kit
          </a>
        </Container>
      </section>
    </div>
  );
}
