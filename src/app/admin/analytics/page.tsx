import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase/require-admin";
import { Container } from "@/components/shared/container";
import { StatCard } from "@/components/shared/stat-card";
import { formatNumber } from "@/lib/utils";
import {
  CLOUDFLARE_WEB_ANALYTICS_SITE_TAG,
  isCloudflareAnalyticsApiConfigured,
} from "@/lib/analytics/config";
import { getWebAnalyticsByHost, type WebAnalyticsSummary } from "@/lib/analytics/cloudflare";
import { SITE_NAME, SITE_URL, CAMPAIGN_NAME, CAMPAIGN_URL } from "@/lib/constants";

const DAYS = 30;

export default async function AnalyticsAdminPage() {
  await requireAdminUser();

  const configured = Boolean(CLOUDFLARE_WEB_ANALYTICS_SITE_TAG) && isCloudflareAnalyticsApiConfigured();

  let byHost: Awaited<ReturnType<typeof getWebAnalyticsByHost>> | null = null;
  let error: string | null = null;

  if (configured) {
    try {
      byHost = await getWebAnalyticsByHost(CLOUDFLARE_WEB_ANALYTICS_SITE_TAG!, DAYS);
    } catch (e) {
      error = e instanceof Error ? e.message : "Unknown error";
    }
  }

  return (
    <Container className="max-w-4xl py-16">
      <Link
        href="/admin"
        className="text-sm font-semibold uppercase tracking-wide text-charcoal-light hover:text-ink"
      >
        &larr; Back to Overview
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold uppercase text-ink">Analytics</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal-light">
        Traffic is measured with{" "}
        <a
          href="https://www.cloudflare.com/web-analytics/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-bronze hover:underline"
        >
          Cloudflare Web Analytics
        </a>{" "}
        — cookieless, no persistent visitor identifier, nothing set on the browser. Cloudflare
        auto-installs the beacon for the whole <span className="font-mono">forthe22.org</span>{" "}
        zone (both domains), so this page reads one Web Analytics site and splits it by hostname
        below rather than tracking each domain separately. See{" "}
        <Link href="/privacy" className="text-bronze hover:underline">
          Privacy Policy
        </Link>{" "}
        for what&rsquo;s disclosed publicly. There&rsquo;s no public visitor counter anywhere on
        the site — this page is the only place these numbers are shown, and it&rsquo;s behind
        admin sign-in.
      </p>

      {!configured && (
        <div className="mt-6 rounded-sm border border-ink/10 bg-off-white p-6 text-sm text-charcoal-light">
          <p className="font-semibold text-ink">Not set up yet.</p>
          <p className="mt-2">
            Set <code className="rounded bg-ink/5 px-1.5 py-0.5">CLOUDFLARE_WEB_ANALYTICS_SITE_TAG</code>,{" "}
            <code className="rounded bg-ink/5 px-1.5 py-0.5">CLOUDFLARE_ACCOUNT_ID</code>, and{" "}
            <code className="rounded bg-ink/5 px-1.5 py-0.5">CLOUDFLARE_ANALYTICS_API_TOKEN</code>{" "}
            (an API token scoped to <strong>Account → Account Analytics → Read</strong>) — see the
            README&rsquo;s Analytics section. Traffic is still being collected by Cloudflare&rsquo;s
            automatic install either way; this only affects whether it shows up here.
          </p>
        </div>
      )}

      {configured && error && (
        <div className="mt-6 rounded-sm border border-red-300 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">Couldn&rsquo;t load Cloudflare Analytics data.</p>
          <p className="mt-2 font-mono text-xs">{error}</p>
        </div>
      )}

      {byHost && (
        <>
          <SiteSection label={SITE_NAME} url={SITE_URL} summary={byHost.org} />
          <SiteSection label={CAMPAIGN_NAME} url={CAMPAIGN_URL} summary={byHost.campaign} />
        </>
      )}

      <UtmGuide />
    </Container>
  );
}

function SiteSection({
  label,
  url,
  summary,
}: {
  label: string;
  url: string;
  summary: WebAnalyticsSummary;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
          {label}
        </h2>
        <span className="text-xs text-charcoal-light">{url}</span>
      </div>

      <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-light">
        Trailing {DAYS} days
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pageviews" value={formatNumber(summary.totals.pageviews)} />
        <StatCard label="Unique Visits" value={formatNumber(summary.totals.visits)} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <BreakdownTable title="Top Referrers" rows={summary.topReferrers} />
        <BreakdownTable title="Top Landing Pages" rows={summary.topLandingPaths} />
        <BreakdownTable title="Top Countries" rows={summary.topCountries} />
        <UtmTable rows={summary.utmCampaigns} />
      </div>
    </section>
  );
}

function BreakdownTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; pageviews: number; visits: number }[];
}) {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal-light">No data yet.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-ink/10">
                <td className="max-w-[14rem] truncate py-1.5 pr-2 text-ink" title={row.label}>
                  {row.label}
                </td>
                <td className="py-1.5 text-right tabular-nums text-charcoal-light">
                  {formatNumber(row.pageviews)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function UtmTable({ rows }: { rows: WebAnalyticsSummary["utmCampaigns"] }) {
  return (
    <div className="rounded-sm border border-ink/10 bg-off-white p-4 sm:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-light">
        Campaign Traffic (UTM)
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-charcoal-light">
          No tagged traffic yet — see the UTM guide below. If links using{" "}
          <span className="font-mono">?utm_source=</span> are already going out, make sure{" "}
          &ldquo;Include query string&rdquo; is turned on for this site under Web Analytics
          settings in the Cloudflare dashboard; this table reads it off the tracked path.
        </p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-charcoal-light">
              <th className="pb-1 font-semibold">Source</th>
              <th className="pb-1 font-semibold">Medium</th>
              <th className="pb-1 font-semibold">Campaign</th>
              <th className="pb-1 text-right font-semibold">Pageviews</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.source}-${row.medium}-${row.campaign}`}
                className="border-t border-ink/10"
              >
                <td className="py-1.5 pr-2 text-ink">{row.source}</td>
                <td className="py-1.5 pr-2 text-charcoal-light">{row.medium}</td>
                <td className="py-1.5 pr-2 text-charcoal-light">{row.campaign}</td>
                <td className="py-1.5 text-right tabular-nums text-charcoal-light">
                  {formatNumber(row.pageviews)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const UTM_EXAMPLES = [
  { channel: "Partner org referral link", source: "mighty-oaks", medium: "partner", campaign: "referral" },
  { channel: "QR code (print/signage)", source: "qr", medium: "print", campaign: "race-day-2027" },
  { channel: "Sponsorship outreach email", source: "sponsor-outreach", medium: "email", campaign: "corporate-2026" },
  { channel: "Social post", source: "instagram", medium: "social", campaign: "tri70-launch" },
  { channel: "Fundraising link in bio/newsletter", source: "newsletter", medium: "email", campaign: "fund-a-mile" },
] as const;

function UtmGuide() {
  return (
    <section className="mt-10 rounded-sm border border-ink/10 bg-sand-light p-6 text-sm text-charcoal-light">
      <p className="font-semibold text-ink">UTM conventions for outbound links</p>
      <p className="mt-2">
        Append these to any link shared off-site (partner sites, QR codes, sponsorship emails,
        social posts) so that traffic shows up in the Campaign Traffic table above instead of
        blending into &ldquo;direct.&rdquo; Keep <span className="font-mono">utm_source</span>{" "}
        lowercase, hyphenated, and stable per outlet — it&rsquo;s what distinguishes one partner or
        sponsor&rsquo;s traffic from another&rsquo;s.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-xs">
          <thead>
            <tr className="text-left uppercase tracking-wide text-charcoal-light/80">
              <th className="pb-1 font-semibold">Channel</th>
              <th className="pb-1 font-semibold">utm_source</th>
              <th className="pb-1 font-semibold">utm_medium</th>
              <th className="pb-1 font-semibold">utm_campaign</th>
            </tr>
          </thead>
          <tbody>
            {UTM_EXAMPLES.map((row) => (
              <tr key={row.channel} className="border-t border-ink/10">
                <td className="py-1.5 pr-2 text-ink">{row.channel}</td>
                <td className="py-1.5 pr-2 font-mono">{row.source}</td>
                <td className="py-1.5 pr-2 font-mono">{row.medium}</td>
                <td className="py-1.5 pr-2 font-mono">{row.campaign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs">
        Example: <span className="font-mono">https://forthe22.org/join?utm_source=mighty-oaks&amp;utm_medium=partner&amp;utm_campaign=referral</span>
      </p>
    </section>
  );
}
