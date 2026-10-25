import {
  CAMPAIGN_NAME,
  CAMPAIGN_URL,
  CAMPAIGNS,
  CONTACT_EMAIL,
  FUNDRAISING_GOAL,
  MISSION_NAME,
  ORG_SUPPORTING_STATEMENT,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { COMPLETED_RUCK_MISSIONS, UPCOMING_RUCK_MISSIONS } from "@/lib/content/ruck-missions";
import { isCampaignLive, isOrgLive } from "@/lib/launch-gate";
import { getActiveCampaignSlug } from "@/lib/site-mode";
import { formatCurrency } from "@/lib/utils";

/**
 * /llms.txt (https://llmstxt.org) — a plain-Markdown map of the site for AI
 * answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews). Split
 * per requesting host for the same reason as sitemap.ts/robots.ts: each
 * domain describes only its own pages. Page summaries mirror each route's
 * own pageMetadata() description — keep them in sync when one changes.
 * Ungated in src/middleware.ts alongside sitemap.xml; while a domain's
 * launch gate is closed it lists no routes, matching sitemap.ts.
 */

type LinkEntry = [path: string, title: string, summary: string];

const CRISIS_NOTE =
  "> If you or someone you know is in crisis: Veterans Crisis Line, call 988 and press 1, or text 838255. In immediate danger, call 911. " +
  `${SITE_NAME} is not a crisis-response service — see ${SITE_URL}/crisis.`;

const ORG_LINKS: LinkEntry[] = [
  ["/mission", "Mission", `${ORG_SUPPORTING_STATEMENT} Who we serve, how the resource directory works, and why it exists.`],
  ["/about", "About", `Founder Cody Hitson's own story of service, struggle, and recovery — and how it became ${SITE_NAME}.`],
  ["/resources", "Resources", "A resource finder for veterans, first responders, and their families, browsable by state and need."],
  ["/standards", "How Resources Are Reviewed", `What ${SITE_NAME} checks before a program appears in the resource directory — and what "reviewed" does and does not mean.`],
  ["/crisis", "Crisis Support", "Immediate crisis support for veterans and first responders."],
  ["/veteran-brands", "Veteran & First Responder Brands", "Veteran-owned and first-responder-owned companies, and businesses that give back."],
  ["/campaigns", "Campaigns", `Tri For The 22, Ruck For The 22, For The 22: Live, and 22 For the 22 — all contributing toward one shared ${formatCurrency(FUNDRAISING_GOAL)} fundraising goal.`],
  ["/70k", MISSION_NAME, `Current ${SITE_NAME} campaigns contribute toward one shared ${formatCurrency(FUNDRAISING_GOAL)} goal supporting verified veteran-focused nonprofit organizations.`],
  ["/impact", "Mission in Motion", "How the resource directory and the campaigns move the mission forward."],
  ["/network", "The Network", "The resource network, current beneficiaries, campaign partners, and community behind the mission."],
  ["/transparency", "Transparency", `How donations work, how ${SITE_NAME} selects beneficiaries and resources, and the organization's current legal status.`],
  ["/press", "Press & Media", "Mission summary, key numbers, founder bios, campaign and beneficiary information, logos, and media contact."],
  ["/contact", "Contact", `General and media contact for ${SITE_NAME}.`],
];

const TRI_LINKS: LinkEntry[] = [
  ["/the-mission", "The Mission", `${CAMPAIGN_NAME} pairs a 70.3-mile IRONMAN challenge with ${SITE_NAME}'s broader ${formatCurrency(FUNDRAISING_GOAL)} fundraising mission — a shared goal, not Tri's alone.`],
  ["/the-race", "IRONMAN 70.3 Chattanooga", "Training toward IRONMAN 70.3 Chattanooga on May 16, 2027 — a 1.2-mile swim, 56-mile bike, and 13.1-mile run."],
  ["/the-story", "Cody Hitson's Story", `The athletic story behind ${CAMPAIGN_NAME} — training, the road to race day, and why it's run in memory of the 22.`],
  ["/beneficiaries", "Beneficiaries", `The confirmed nonprofit organizations ${CAMPAIGN_NAME} raises funds for.`],
  ["/financial-transparency", "Financial Transparency", `How donation links on this site work, and what ${CAMPAIGN_NAME} does and doesn't do with charitable giving.`],
  ["/donate", "Donate", `Support ${CAMPAIGN_NAME} through an authorized partner donation platform.`],
  ["/journal", "Road to Chattanooga Journal", "Training, setbacks, milestones, partners, and fundraising updates."],
  ["/sponsors", "Partners & Supporters", `Organizations and brands supporting ${CAMPAIGN_NAME}.`],
  ["/get-involved", "Get Involved", `Join the ${CAMPAIGN_NAME} Triathlon Team, support the campaign, or become a partner.`],
  ["/press", "Press", `Media resources for ${CAMPAIGN_NAME}.`],
];

function linkList(baseUrl: string, links: LinkEntry[]) {
  return links.map(([path, title, summary]) => `- [${title}](${baseUrl}${path}): ${summary}`).join("\n");
}

export async function GET() {
  const campaignSlug = await getActiveCampaignSlug();
  const live = campaignSlug ? isCampaignLive() : isOrgLive();

  const name = campaignSlug ? CAMPAIGNS[campaignSlug].name : SITE_NAME;
  const baseUrl = campaignSlug ? CAMPAIGNS[campaignSlug].url : SITE_URL;
  const summary = campaignSlug ? CAMPAIGNS[campaignSlug].description : ORG_SUPPORTING_STATEMENT;

  const sections = [`# ${name}`, `> ${summary}`, CRISIS_NOTE];

  if (live) {
    if (!campaignSlug) {
      sections.push(
        `${SITE_NAME} serves U.S. veterans, first responders, and their families. It runs a reviewed resource directory and fundraising campaigns toward a shared ${formatCurrency(FUNDRAISING_GOAL)} goal for veteran-focused nonprofit organizations.`,
        `## Key pages\n\n${linkList(SITE_URL, ORG_LINKS)}`,
        `## Campaigns\n\n${Object.values(CAMPAIGNS)
          .map((c) => `- [${c.name}](${c.url}/): ${c.description}`)
          .join("\n")}`,
      );
    } else if (campaignSlug === "tri") {
      sections.push(
        `${CAMPAIGN_NAME} is one campaign of ${SITE_NAME} (${SITE_URL}). Founder Cody Hitson is training for IRONMAN 70.3 Chattanooga on May 16, 2027 to raise funds for veteran-focused nonprofit organizations.`,
        `## Key pages\n\n${linkList(CAMPAIGN_URL, TRI_LINKS)}`,
      );
    } else if (campaignSlug === "ruck") {
      const completed = COMPLETED_RUCK_MISSIONS.map(
        (m) => `- [${m.name}](${baseUrl}/missions/${m.slug}): ${m.dateDisplay}, ${m.distanceMiles} miles, ${m.location}. ${m.summary}`,
      );
      const upcoming = UPCOMING_RUCK_MISSIONS.map((m) => `- ${m.name}: ${m.dateDisplay}, ${m.location}.`);
      sections.push(
        `${name} is one campaign of ${SITE_NAME} (${SITE_URL}). Each completed mission page has its media coverage, what ${SITE_NAME} raised, and Cody Hitson's journal from the day.`,
        `## Completed missions\n\n${completed.join("\n")}`,
        ...(upcoming.length > 0 ? [`## Next missions\n\n${upcoming.join("\n")}`] : []),
      );
    } else {
      sections.push(`${name} is one campaign of ${SITE_NAME}. See ${SITE_URL}/campaigns for every campaign and ${SITE_URL}/mission for the parent organization.`);
    }
    sections.push(`## Optional\n\n- [Sitemap](${baseUrl}/sitemap.xml): Every indexable URL on this domain.`);
  }

  if (CONTACT_EMAIL) sections.push(`Contact: ${CONTACT_EMAIL}`);

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
