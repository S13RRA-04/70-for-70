import Image from "next/image";
import { Download } from "lucide-react";
import { promoKitAssetHref, type PromoKitAsset } from "@/lib/content/22-for-the-22-promokit";

/** Preview + individual download button for one social/Story graphic. */
export function AssetDownloadCard({ asset }: { asset: PromoKitAsset }) {
  const href = promoKitAssetHref(asset);

  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-off-white">
      <div className="flex items-center justify-center bg-sand-light p-4">
        <Image
          src={href}
          alt={`${asset.label} — 22 For the 22 promo graphic`}
          width={asset.width}
          height={asset.height}
          className="h-auto max-h-80 w-auto rounded-sm shadow-sm"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">{asset.label}</p>
        <p className="mt-1 flex-1 text-sm text-charcoal-light">{asset.description}</p>
        <a
          href={href}
          download={asset.fileName}
          data-analytics-event="promokit_asset_download"
          data-asset-id={asset.id}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-sm border border-ink/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
        >
          <Download size={14} aria-hidden />
          Download PNG
        </a>
      </div>
    </div>
  );
}
