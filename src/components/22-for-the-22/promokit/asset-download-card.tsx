import Image from "next/image";
import { Download } from "lucide-react";
import { promoKitAssetHref, type PromoKitAsset } from "@/lib/content/22-for-the-22-promokit";

/** Preview + individual download button for one social/Story graphic. */
export function AssetDownloadCard({ asset }: { asset: PromoKitAsset }) {
  const href = promoKitAssetHref(asset);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
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
        <p className="font-display text-base uppercase text-ink">{asset.label}</p>
        <p className="mt-1 flex-1 text-sm text-charcoal-light">{asset.description}</p>
        <a
          href={href}
          download={asset.fileName}
          data-analytics-event="promokit_asset_download"
          data-asset-id={asset.id}
          className="action-control inline-flex items-center justify-center font-bold mt-4 min-h-[44px] gap-1.5 border-2 border-navy px-4 py-2.5 text-[15px] text-navy transition-colors hover:bg-white"
        >
          <Download size={14} aria-hidden />
          Download PNG
        </a>
      </div>
    </div>
  );
}
