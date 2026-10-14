import Image from "next/image";
import { Download } from "lucide-react";
import { promoKitAssetHref, type PromoKitAsset } from "@/lib/content/22-for-the-22-promokit";

/**
 * Transparent photo-frame overlay — previewed over a neutral tactical-toned
 * background rather than a real participant photo (there isn't one to use
 * honestly), with a caption clarifying that. Download is the raw
 * transparent PNG so a participant can layer their own photo behind it.
 */
export function PhotoFrameCard({ asset }: { asset: PromoKitAsset }) {
  const href = promoKitAssetHref(asset);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-charcoal to-ink p-4">
        <div className="relative w-full max-w-[220px]" style={{ aspectRatio: `${asset.width} / ${asset.height}` }}>
          <Image
            src={href}
            alt={`${asset.label} — transparent overlay previewed over a neutral background`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-base uppercase text-ink">{asset.label}</p>
        <p className="mt-1 text-sm text-charcoal-light">{asset.description}</p>
        <p className="mt-2 text-xs italic text-charcoal-light/70">
          Shown over a neutral sample background — the download is a transparent PNG.
        </p>
        <a
          href={href}
          download={asset.fileName}
          data-analytics-event="promokit_asset_download"
          data-asset-id={asset.id}
          className="action-control inline-flex items-center justify-center font-bold mt-4 min-h-[44px] gap-1.5 border-2 border-navy px-4 py-2.5 text-[15px] text-navy transition-colors hover:bg-white"
        >
          <Download size={14} aria-hidden />
          Download Transparent PNG
        </a>
      </div>
    </div>
  );
}
