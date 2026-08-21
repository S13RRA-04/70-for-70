import "server-only";
import { isCampaignHost } from "@/lib/site-mode";
import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_ANALYTICS_API_TOKEN,
  isCloudflareAnalyticsApiConfigured,
} from "./config";

const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";

/**
 * Reads Cloudflare Web Analytics (RUM) data back out for /admin/analytics via
 * Cloudflare's GraphQL Analytics API. There is exactly one Web Analytics
 * "site" (one siteTag) for the forthe22.org zone — Cloudflare's automatic,
 * ruleset-based install already covers every hostname under that zone,
 * forthe22.org and tri.forthe22.org included, so a second manual beacon per
 * domain would just double-count pageviews. This module fetches once per
 * siteTag and splits the result by the `requestHost` dimension instead —
 * see getWebAnalyticsByHost(). The dataset/field shape (dimensions/sum/count
 * on rumPageloadEventsAdaptiveGroups under viewer.accounts) and the query
 * itself were both confirmed live against this account (introspection, then
 * a real data query). If Cloudflare ever changes the schema, requests fail
 * with Cloudflare's own GraphQL error text surfaced verbatim on the admin
 * page rather than a silent wrong number.
 */

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data: T | null;
  errors: GraphQLError[] | null;
}

async function cloudflareGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  if (!isCloudflareAnalyticsApiConfigured()) {
    throw new Error(
      "Cloudflare Analytics API isn't configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_ANALYTICS_API_TOKEN.",
    );
  }

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    // RUM data isn't real-time — a few minutes of staleness is fine and
    // saves hitting Cloudflare's API on every admin page load.
    next: { revalidate: 300 },
  });

  const json = (await res.json()) as GraphQLResponse<T>;

  if (!res.ok || json.errors?.length) {
    const message = json.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`Cloudflare Analytics API request failed: ${message}`);
  }

  if (!json.data) {
    throw new Error("Cloudflare Analytics API returned no data.");
  }

  return json.data;
}

interface RumGroup {
  count: number;
  sum: { visits: number };
  dimensions: Record<string, string>;
}

interface RumOverviewResponse {
  viewer: {
    accounts: Array<{
      daily: RumGroup[];
      referrers: RumGroup[];
      paths: RumGroup[];
      countries: RumGroup[];
    }>;
  };
}

// `requestHost` is included on every group (not just as its own breakdown)
// so a single query can be split by domain afterward in getWebAnalyticsByHost
// — see the module comment above for why this is one query, not two.
const OVERVIEW_QUERY = /* GraphQL */ `
  query WebAnalyticsOverview($accountTag: String!, $siteTag: string!, $since: Date!, $until: Date!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        daily: rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $siteTag, date_geq: $since, date_leq: $until, bot: 0 }
          orderBy: [date_ASC]
          limit: 200
        ) {
          count
          sum { visits }
          dimensions { date requestHost }
        }
        referrers: rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $siteTag, date_geq: $since, date_leq: $until, bot: 0 }
          orderBy: [count_DESC]
          limit: 100
        ) {
          count
          sum { visits }
          dimensions { refererHost requestHost }
        }
        paths: rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $siteTag, date_geq: $since, date_leq: $until, bot: 0 }
          orderBy: [count_DESC]
          limit: 100
        ) {
          count
          sum { visits }
          dimensions { requestPath requestHost }
        }
        countries: rumPageloadEventsAdaptiveGroups(
          filter: { siteTag: $siteTag, date_geq: $since, date_leq: $until, bot: 0 }
          orderBy: [count_DESC]
          limit: 100
        ) {
          count
          sum { visits }
          dimensions { countryName requestHost }
        }
      }
    }
  }
`;

export interface WebAnalyticsBreakdownRow {
  label: string;
  pageviews: number;
  visits: number;
}

export interface UtmBreakdownRow {
  source: string;
  medium: string;
  campaign: string;
  pageviews: number;
  visits: number;
}

export interface WebAnalyticsSummary {
  totals: { pageviews: number; visits: number };
  dailyPageviews: { date: string; pageviews: number; visits: number }[];
  topReferrers: WebAnalyticsBreakdownRow[];
  topLandingPaths: WebAnalyticsBreakdownRow[];
  topCountries: WebAnalyticsBreakdownRow[];
  utmCampaigns: UtmBreakdownRow[];
}

export interface WebAnalyticsByHost {
  org: WebAnalyticsSummary;
  campaign: WebAnalyticsSummary;
}

/** yyyy-mm-dd, what the GraphQL API's `Date` scalar expects. */
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Parses `utm_source`/`utm_medium`/`utm_campaign` off a request path, if
 * present. Only populated when the Web Analytics site has "Include query
 * string" enabled in its Cloudflare dashboard settings — otherwise
 * `requestPath` never carries a query string and this always returns null.
 */
function parseUtm(requestPath: string): { source: string; medium: string; campaign: string } | null {
  const queryIndex = requestPath.indexOf("?");
  if (queryIndex === -1) return null;

  const params = new URLSearchParams(requestPath.slice(queryIndex + 1));
  const source = params.get("utm_source");
  if (!source) return null;

  return {
    source,
    medium: params.get("utm_medium") ?? "(none)",
    campaign: params.get("utm_campaign") ?? "(none)",
  };
}

function toBreakdown(groups: RumGroup[], dimensionKey: string): WebAnalyticsBreakdownRow[] {
  const totals = new Map<string, { pageviews: number; visits: number }>();

  for (const g of groups) {
    const label = g.dimensions[dimensionKey] || "(direct/none)";
    const existing = totals.get(label) ?? { pageviews: 0, visits: 0 };
    totals.set(label, {
      pageviews: existing.pageviews + g.count,
      visits: existing.visits + g.sum.visits,
    });
  }

  return Array.from(totals.entries())
    .map(([label, t]) => ({ label, ...t }))
    .sort((a, b) => b.pageviews - a.pageviews);
}

function summarizeGroups(raw: {
  daily: RumGroup[];
  referrers: RumGroup[];
  paths: RumGroup[];
  countries: RumGroup[];
}): WebAnalyticsSummary {
  const dailyPageviews = raw.daily
    .map((g) => ({ date: g.dimensions.date, pageviews: g.count, visits: g.sum.visits }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totals = dailyPageviews.reduce(
    (acc, day) => ({
      pageviews: acc.pageviews + day.pageviews,
      visits: acc.visits + day.visits,
    }),
    { pageviews: 0, visits: 0 },
  );

  // Top landing pages, with any query string stripped for a clean path list.
  const pathTotals = new Map<string, { pageviews: number; visits: number }>();
  const utmTotals = new Map<string, UtmBreakdownRow>();

  for (const group of raw.paths) {
    const requestPath = group.dimensions.requestPath || "/";
    const cleanPath = requestPath.split("?")[0] || "/";
    const existing = pathTotals.get(cleanPath) ?? { pageviews: 0, visits: 0 };
    pathTotals.set(cleanPath, {
      pageviews: existing.pageviews + group.count,
      visits: existing.visits + group.sum.visits,
    });

    const utm = parseUtm(requestPath);
    if (utm) {
      const key = `${utm.source} ${utm.medium} ${utm.campaign}`;
      const existingUtm = utmTotals.get(key) ?? { ...utm, pageviews: 0, visits: 0 };
      utmTotals.set(key, {
        ...existingUtm,
        pageviews: existingUtm.pageviews + group.count,
        visits: existingUtm.visits + group.sum.visits,
      });
    }
  }

  const topLandingPaths = Array.from(pathTotals.entries())
    .map(([label, t]) => ({ label, ...t }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 15);

  const utmCampaigns = Array.from(utmTotals.values()).sort((a, b) => b.pageviews - a.pageviews);

  return {
    totals,
    dailyPageviews,
    topReferrers: toBreakdown(raw.referrers, "refererHost").slice(0, 15),
    topLandingPaths,
    topCountries: toBreakdown(raw.countries, "countryName").slice(0, 15),
    utmCampaigns,
  };
}

const EMPTY_SUMMARY: WebAnalyticsSummary = {
  totals: { pageviews: 0, visits: 0 },
  dailyPageviews: [],
  topReferrers: [],
  topLandingPaths: [],
  topCountries: [],
  utmCampaigns: [],
};

/**
 * Fetches Web Analytics data for the one Web Analytics site covering the
 * forthe22.org zone, over the trailing `days` days, and splits it into the
 * org (forthe22.org) vs. campaign (tri.forthe22.org) domains using the same
 * hostname rule as the rest of the app (see src/lib/site-mode.ts) — not two
 * separate Cloudflare "sites," since Cloudflare's zone-wide automatic
 * install already covers both under this one siteTag.
 */
export async function getWebAnalyticsByHost(
  siteTag: string,
  days = 30,
): Promise<WebAnalyticsByHost> {
  const until = new Date();
  const since = new Date(until);
  since.setDate(since.getDate() - days);

  const data = await cloudflareGraphQL<RumOverviewResponse>(OVERVIEW_QUERY, {
    accountTag: CLOUDFLARE_ACCOUNT_ID,
    siteTag,
    since: toDateString(since),
    until: toDateString(until),
  });

  const account = data.viewer.accounts[0];
  if (!account) {
    return { org: EMPTY_SUMMARY, campaign: EMPTY_SUMMARY };
  }

  const byHost = (predicate: (host: string) => boolean) =>
    summarizeGroups({
      daily: account.daily.filter((g) => predicate(g.dimensions.requestHost)),
      referrers: account.referrers.filter((g) => predicate(g.dimensions.requestHost)),
      paths: account.paths.filter((g) => predicate(g.dimensions.requestHost)),
      countries: account.countries.filter((g) => predicate(g.dimensions.requestHost)),
    });

  return {
    org: byHost((host) => !isCampaignHost(host)),
    campaign: byHost((host) => isCampaignHost(host)),
  };
}
