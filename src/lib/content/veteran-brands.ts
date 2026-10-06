/**
 * Curated directory of commercial brands whose purchases support veterans
 * and first responders — distinct from RESOURCES
 * (src/lib/content/resources.ts), which is explicitly nonprofit/government
 * programs, not commercial products. Kept as data rather than hard-coded
 * JSX so entries can be revised without touching the page, same pattern as
 * resources.ts.
 *
 * Every entry's ownership/giving claim was checked against the brand's own
 * site before being added here — never guessed or inferred from a
 * third-party roundup alone, and never added without confirming the
 * business is still actually operating (a brand that looked legitimate in
 * a roundup article turned out to have closed — see git history). A brand
 * can carry multiple categories (e.g. veteran-owned AND donates a cut of
 * profits) — category is about how the purchase helps, not a ranking.
 */

export interface ServiceBrandCategory {
  id: "veteran-owned" | "first-responder-owned" | "gives-back";
  label: string;
}

export const SERVICE_BRAND_CATEGORIES: ServiceBrandCategory[] = [
  { id: "veteran-owned", label: "Veteran-Owned" },
  { id: "first-responder-owned", label: "First Responder-Owned" },
  { id: "gives-back", label: "Gives Back" },
];

export interface ServiceBrand {
  name: string;
  url: string;
  /** What they sell, in a few words — grounds the card before the mission copy. */
  product: string;
  /** How a purchase actually supports veterans/first responders — specific and sourced, never a vague "supports our heroes." */
  description: string;
  categoryIds: ServiceBrandCategory["id"][];
}

export const SERVICE_BRANDS: ServiceBrand[] = [
  {
    name: "Rags of Honor",
    url: "https://www.ragsofhonor.us",
    product: "Custom apparel & screen printing",
    description:
      "A Chicago silkscreen shop operated entirely by formerly homeless and unemployed veterans, who are paid a living wage and offered continuing education as they rebuild their lives. Every order funds that employment directly.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Veteran Roasters",
    url: "https://veteranroasters.com",
    product: "Coffee",
    description:
      "Rags of Honor's sister company — a Chicago coffee roaster built specifically to hire homeless and at-risk veterans. Every bag purchased funds another veteran's living-wage job roasting, packaging, and shipping the coffee.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Bombs & Blades Hot Sauce",
    url: "https://bombsandblades.com",
    product: "Hot sauce",
    description:
      "Founded in 2025 by Chris Metler, a former U.S. Army EOD technician, with flavors, art, and names dedicated to military members across every branch and occupation. Veteran-owned and operated, hand-bottled and shipped by the founders themselves.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Grunt Style",
    url: "https://www.gruntstyle.com",
    product: "Patriotic apparel",
    description:
      "Founded in 2009 by a former Army Drill Sergeant; over 70% of its team is veterans. Funds the Grunt Style Foundation, a 501(c)(3) focused on veteran mental health, military transition, food insecurity, and homelessness.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Nine Line Apparel",
    url: "https://www.ninelineapparel.com",
    product: "Patriotic & military-themed apparel",
    description:
      "Founded by former Army Captain Tyler Merritt, who formalized the company's giving after a West Point classmate lost three limbs in Afghanistan. A portion of every sale funds the Nine Line Foundation, which runs with zero overhead so donations go directly to wounded veterans.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Hero Soap Company",
    url: "https://herosoapcompany.com",
    product: "Handmade soap",
    description:
      "A veteran-founded, small-batch soap maker in Phoenix, Arizona. A portion of every sale is donated to military/veteran/first-responder charities including the Gary Sinise Foundation and Operation Finally Home, and the company has shipped over 1,000 bars directly to deployed troops.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Black Rifle Coffee Company",
    url: "https://www.blackriflecoffee.com",
    product: "Coffee",
    description:
      "Founded by Green Beret Evan Hafer, veteran-owned with a standing commitment to hire 10,000 veterans. Past campaigns have funded coffee shipments to deployed troops and partnered with Born Primitive to eliminate $34 million in veteran medical debt.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Bottle Breacher",
    url: "https://bottlebreacher.com",
    product: "Bottle openers & accessories made from spent ammunition",
    description:
      "Founded by a Navy SEAL in 2012; its signature .50-caliber bottle opener is still handcrafted by military veterans at a 25% veteran hire rate. The company has given to more than 280 veteran events and organizations, including the Navy SEAL Foundation and Folds of Honor.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fire Department Coffee",
    url: "https://www.firedeptcoffee.com",
    product: "Coffee",
    description:
      "Founded by a retired firefighter/paramedic and Navy veteran. Funds the Fire Department Coffee Foundation, a 501(c)(3) supporting firefighters injured on the job, physically or mentally — already a confirmed partner of this campaign's own 22 For the 22 giveaway.",
    categoryIds: ["veteran-owned", "first-responder-owned", "gives-back"],
  },
  {
    name: "ReLEntless Defender Apparel",
    url: "https://relentlessdefender.com",
    product: "Law enforcement & Thin Blue Line apparel",
    description:
      "Owned and operated by law enforcement veterans. Has donated more than $2.6 million to first-responder charities since 2015, including fundraiser runs for fallen and injured officers and their families.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "13 Fifty Apparel",
    url: "https://thirteenfiftyapparel.com",
    product: "First responder apparel",
    description:
      "Founded in 2016 by a South Florida police officer. Its #OPERATIONRESPONDER program partners with first-responder charities nationwide, including Concerns of Police Survivors (C.O.P.S.) and the First Responders Children's Foundation.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
];
