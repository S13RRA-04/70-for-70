import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremierePage } from "@/components/tri/premiere-page";
import { getPremiere } from "@/lib/content/premieres";
import { CAMPAIGN_NAME, SITE_URL, TRI_PAGE_PATH, TRI_PAGE_URL } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/json-ld";

export async function generateMetadata(props: PageProps<"/campaigns/tri/premiere/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const premiere = getPremiere(slug);
  if (!premiere) return {};
  return pageMetadata({
    title: `${premiere.artist} — “${premiere.title}” ${premiere.kind}`,
    description: premiere.summary,
    canonical: `${TRI_PAGE_PATH}/premiere/${premiere.slug}`,
    image: "/og-campaign.png",
  });
}

/** A Tri For The 22 artist premiere — see PREMIERES in src/lib/content/premieres.ts. */
export default async function TriPremierePage(props: PageProps<"/campaigns/tri/premiere/[slug]">) {
  const { slug } = await props.params;
  const premiere = getPremiere(slug);
  if (!premiere) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Campaigns", url: `${SITE_URL}/campaigns` },
    { name: CAMPAIGN_NAME, url: TRI_PAGE_URL },
    { name: `${premiere.artist} — “${premiere.title}”`, url: `${TRI_PAGE_URL}/premiere/${premiere.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(breadcrumb)} />
      <PremierePage premiere={premiere} />
    </>
  );
}
