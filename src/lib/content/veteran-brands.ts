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
  {
    name: "Kill Cliff",
    url: "https://killcliff.com",
    product: "Energy & recovery drinks",
    description:
      "Founded by former Navy SEAL Todd Ehrlich and stated on its own site as owned and operated by Navy SEALs. An official partner of the Navy SEAL Foundation since 2011, the company has helped raise and donate over $1 million to the Foundation for service members, veterans, and their families.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Ranger Up",
    url: "https://rangerup.com",
    product: "Military & patriotic apparel",
    description:
      "Founded in 2006 by Nick Palmisciano, a former Army infantry officer — the original military apparel brand, now back under founder ownership after Palmisciano reacquired it. Has employed veterans throughout its history and created a vetrepreneur program that hired veterans and backed their own startups.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Silencio Coffee",
    url: "https://silenciocoffee.com",
    product: "Coffee & apparel",
    description:
      "Founded in 2022 by two U.S. special-operations and Marine Corps veteran friends, with coffee roasted, ground, bagged, and shipped from within Virginia. Veteran-owned and operated, with apparel and gear alongside its 16 oz roasts.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Muertos Coffee Co. (Duty to Act)",
    url: "https://muertoscoffeeco.com",
    product: "Coffee & first-responder merch",
    description:
      "Founded in 2020 by first-responder brothers Eli Held, a firefighter, and Max Held, a police officer. Through its Duty to Act mission the company directs 10% of every purchase to first responders in need and families affected by line-of-duty deaths, funding firefighter and police charities chosen by the customer at checkout.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Hero Forge Apparel & Coffee",
    url: "https://heroforgeapparel.com",
    product: "Apparel & coffee",
    description:
      "Founded by Angela Dellutri, whose father landed on Omaha Beach with the 745th Tank Battalion, and co-owned by her son Christopher, a Cook County Sheriff's Office deputy of more than 20 years. Honors veterans, first responders, and K-9 units, donating a portion of profits to the Gary Sinise Foundation.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Combat Flip Flops",
    url: "https://www.combatflipflops.com",
    product: "Footwear, shemaghs & accessories",
    description:
      "A veteran-owned cause brand that manufactures footwear in Colombia, shemaghs and jewelry in Afghanistan, and jewelry from cleared landmines in Laos. Every product sold funds a day of education for an Afghan girl or the clearance of landmines, and the company donates to veteran-support organizations including The Station Foundation and Team 5 Foundation.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Boldfoot Socks",
    url: "https://boldfoot.com",
    product: "American-made socks",
    description:
      "A family- and veteran-owned company run by U.S. Army veteran Joshua Law, making socks from American-grown cotton sewn near Charlotte, NC. Donates 5% of profits to help U.S. military veterans in need of jobs, housing, and health support through Charity Navigator–rated nonprofits, with a no-questions-asked hole replacement guarantee.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Frag Out Flavor",
    url: "https://fragoutflavor.com",
    product: "Seasonings & spice rubs",
    description:
      "A veteran-owned seasoning company blending its rubs in America. Its Flavor For Troops program ships product to troops deployed in combat zones, and it donates to 501(c)(3) organizations that directly serve veterans in need — combat wounded and families of fallen soldiers.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Livefire Coffee Co.",
    url: "https://livefirecoffeeco.com",
    product: "Coffee & tea",
    description:
      "A veteran-owned coffee brand whose Fireteam Community Fund partners with a local veteran or first-responder organization each quarter, sending $1 from every bag sold straight to them — no middlemen, no bureaucracy.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Firemans Brew",
    url: "https://firemansbrew.com",
    product: "Coffee",
    description:
      "Founded by retired Los Angeles County Fire Captain Rick Brandelli after 38 years of service, including multiple Valor commendations. A portion of every purchase funds its Giving Back Program, which provides firefighters in need with medical assistance, mental health services, and emergency financial support.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "First Responder Coffee Co",
    url: "https://firstrespondercoffees.com",
    product: "Coffee & drinkware",
    description:
      "Founded and run by a full-time police officer who built the company around its 'putting first responders first' mission. A portion of every sale is directed to programs supporting first responders and their families, with roasts named for the thin blue line, the thin red line, and night shifts.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Got Your Six Coffee Co.",
    url: "https://gotyoursixcoffee.com",
    product: "Coffee",
    description:
      "A veteran-owned roaster whose founder, Eric Hadley, built the company on a standing pledge printed on every bag: 25% of net profit goes to first responders, veterans, and healthcare professionals — forever, not as a limited-time promotion. Roasted in-house in small batches, with documented donations to groups like Heroes and Horses.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "22 Sierra Coffee Co.",
    url: "https://22sierracoffee.com",
    product: "Coffee",
    description:
      "Founded in April 2020 by Air Force veterans Patrick Little and Joseph Kidwell, with the '22' in its name a constant reminder of the veteran suicide statistic. Donates $0.50 from every packaged coffee sold — treated as overhead, not leftover profit — to the Grunt Style Foundation, funding veteran and first-responder suicide prevention.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Vets 4 Vets Apparel",
    url: "https://vets4vetsapparel.com",
    product: "Veteran apparel",
    description:
      "A veteran-owned and veteran-operated apparel company (est. 2019) built specifically to raise awareness for the 22-a-day veteran suicide statistic. A portion of all profits supports veterans, with designs and drops centered on keeping that number in front of the public.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fit2Fight Apparel",
    url: "https://fitiifightapparel.com",
    product: "Athletic & casual apparel",
    description:
      "A veteran-owned and veteran-operated apparel brand for the gym and everyday wear, created with a standing commitment to donate a portion of profits to Mission 22 — the nonprofit that provides treatment programs for veterans dealing with PTSD, TBI, and other service-related conditions.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "COLETTI",
    url: "https://coletticoffee.com",
    product: "Stainless steel camping coffee gear",
    description:
      "A California veteran-owned small business (VOSB) founded in 2015 that makes percolators, pour-overs, and grinders with no plastic, aluminum, or synthetics in the brew path. Has donated 10% of profits since day one to causes supporting veteran transition, service members, and religious freedom.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fire & Ice Coffee Company",
    url: "https://fireicecoffeeco.com",
    product: "Coffee",
    description:
      "Founded by a firefighter/paramedic with nearly 18 years on the job, roasting fresh the day each order is placed. Donates 10% of profits to the Leary Firefighters Foundation, which provides life-saving equipment, training, and resources to fire departments across the country.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
];
