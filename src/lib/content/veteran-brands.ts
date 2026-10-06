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
 *
 * Stores are additionally separated by the goods/services they provide:
 * every brand carries exactly one typeId (its primary product line) and
 * the page renders one section per entry in SERVICE_BRAND_TYPES. Hybrid
 * shops (e.g. apparel + coffee) go where their lead product sits.
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

/** Store sections on the page, ordered as displayed — not alphabetical, so the biggest and most-shopped sections lead. */
export interface ServiceBrandType {
  id: "coffee-tea" | "apparel" | "food-drink" | "nutrition" | "gear" | "personal-care";
  label: string;
  /** One line under the section heading describing what belongs here. */
  description: string;
}

export const SERVICE_BRAND_TYPES: ServiceBrandType[] = [
  {
    id: "coffee-tea",
    label: "Coffee & Tea",
    description: "Roasters and tea blenders — whole bean, ground, subscriptions, and station-ready brews.",
  },
  {
    id: "apparel",
    label: "Apparel & Footwear",
    description: "T-shirts, hoodies, socks, flip flops, and custom printing for men and women.",
  },
  {
    id: "food-drink",
    label: "Food & Drink",
    description: "Hot sauce, seasonings, and spirits worth putting on the table.",
  },
  {
    id: "nutrition",
    label: "Nutrition & Supplements",
    description: "Protein, pre-workout, and clean energy drinks.",
  },
  {
    id: "gear",
    label: "Gear & Accessories",
    description: "Rucksacks, camp coffee kits, and everyday carry made to last.",
  },
  {
    id: "personal-care",
    label: "Personal Care",
    description: "Soap and grooming goods, made small-batch.",
  },
];

export interface ServiceBrand {
  name: string;
  /** Which store section this brand sits under — exactly one primary goods/services type. */
  typeId: ServiceBrandType["id"];
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
    typeId: "apparel",
    url: "https://www.ragsofhonor.us",
    product: "Custom apparel & screen printing",
    description:
      "A Chicago silkscreen shop operated entirely by formerly homeless and unemployed veterans, who are paid a living wage and offered continuing education as they rebuild their lives. Every order funds that employment directly.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Veteran Roasters",
    typeId: "coffee-tea",
    url: "https://veteranroasters.com",
    product: "Coffee",
    description:
      "Rags of Honor's sister company — a Chicago coffee roaster built specifically to hire homeless and at-risk veterans. Every bag purchased funds another veteran's living-wage job roasting, packaging, and shipping the coffee.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Bombs & Blades Hot Sauce",
    typeId: "food-drink",
    url: "https://bombsandblades.com",
    product: "Hot sauce",
    description:
      "Founded in 2025 by Chris Metler, a former U.S. Army EOD technician, with flavors, art, and names dedicated to military members across every branch and occupation. Veteran-owned and operated, hand-bottled and shipped by the founders themselves.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Grunt Style",
    typeId: "apparel",
    url: "https://www.gruntstyle.com",
    product: "Patriotic apparel",
    description:
      "Founded in 2009 by a former Army Drill Sergeant; over 70% of its team is veterans. Funds the Grunt Style Foundation, a 501(c)(3) focused on veteran mental health, military transition, food insecurity, and homelessness.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Nine Line Apparel",
    typeId: "apparel",
    url: "https://www.ninelineapparel.com",
    product: "Patriotic & military-themed apparel",
    description:
      "Founded by former Army Captain Tyler Merritt, who formalized the company's giving after a West Point classmate lost three limbs in Afghanistan. A portion of every sale funds the Nine Line Foundation, which runs with zero overhead so donations go directly to wounded veterans.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Hero Soap Company",
    typeId: "personal-care",
    url: "https://herosoapcompany.com",
    product: "Handmade soap",
    description:
      "A veteran-founded, small-batch soap maker in Phoenix, Arizona. A portion of every sale is donated to military/veteran/first-responder charities including the Gary Sinise Foundation and Operation Finally Home, and the company has shipped over 1,000 bars directly to deployed troops.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Black Rifle Coffee Company",
    typeId: "coffee-tea",
    url: "https://www.blackriflecoffee.com",
    product: "Coffee",
    description:
      "Founded by Green Beret Evan Hafer, veteran-owned with a standing commitment to hire 10,000 veterans. Past campaigns have funded coffee shipments to deployed troops and partnered with Born Primitive to eliminate $34 million in veteran medical debt.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Bottle Breacher",
    typeId: "gear",
    url: "https://bottlebreacher.com",
    product: "Bottle openers & accessories made from spent ammunition",
    description:
      "Founded by a Navy SEAL in 2012; its signature .50-caliber bottle opener is still handcrafted by military veterans at a 25% veteran hire rate. The company has given to more than 280 veteran events and organizations, including the Navy SEAL Foundation and Folds of Honor.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fire Department Coffee",
    typeId: "coffee-tea",
    url: "https://www.firedeptcoffee.com",
    product: "Coffee",
    description:
      "Founded by a retired firefighter/paramedic and Navy veteran. Funds the Fire Department Coffee Foundation, a 501(c)(3) supporting firefighters injured on the job, physically or mentally — already a confirmed partner of this campaign's own 22 For the 22 giveaway.",
    categoryIds: ["veteran-owned", "first-responder-owned", "gives-back"],
  },
  {
    name: "ReLEntless Defender Apparel",
    typeId: "apparel",
    url: "https://relentlessdefender.com",
    product: "Law enforcement & Thin Blue Line apparel",
    description:
      "Owned and operated by law enforcement veterans. Has donated more than $2.6 million to first-responder charities since 2015, including fundraiser runs for fallen and injured officers and their families.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "13 Fifty Apparel",
    typeId: "apparel",
    url: "https://thirteenfiftyapparel.com",
    product: "First responder apparel",
    description:
      "Founded in 2016 by a South Florida police officer. Its #OPERATIONRESPONDER program partners with first-responder charities nationwide, including Concerns of Police Survivors (C.O.P.S.) and the First Responders Children's Foundation.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Kill Cliff",
    typeId: "nutrition",
    url: "https://killcliff.com",
    product: "Energy & recovery drinks",
    description:
      "Founded by former Navy SEAL Todd Ehrlich and stated on its own site as owned and operated by Navy SEALs. An official partner of the Navy SEAL Foundation since 2011, the company has helped raise and donate over $1 million to the Foundation for service members, veterans, and their families.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Ranger Up",
    typeId: "apparel",
    url: "https://rangerup.com",
    product: "Military & patriotic apparel",
    description:
      "Founded in 2006 by Nick Palmisciano, a former Army infantry officer — the original military apparel brand, now back under founder ownership after Palmisciano reacquired it. Has employed veterans throughout its history and created a vetrepreneur program that hired veterans and backed their own startups.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Silencio Coffee",
    typeId: "coffee-tea",
    url: "https://silenciocoffee.com",
    product: "Coffee & apparel",
    description:
      "Founded in 2022 by two U.S. special-operations and Marine Corps veteran friends, with coffee roasted, ground, bagged, and shipped from within Virginia. Veteran-owned and operated, with apparel and gear alongside its 16 oz roasts.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Muertos Coffee Co. (Duty to Act)",
    typeId: "coffee-tea",
    url: "https://muertoscoffeeco.com",
    product: "Coffee & first-responder merch",
    description:
      "Founded in 2020 by first-responder brothers Eli Held, a firefighter, and Max Held, a police officer. Through its Duty to Act mission the company directs 10% of every purchase to first responders in need and families affected by line-of-duty deaths, funding firefighter and police charities chosen by the customer at checkout.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Hero Forge Apparel & Coffee",
    typeId: "apparel",
    url: "https://heroforgeapparel.com",
    product: "Apparel & coffee",
    description:
      "Founded by Angela Dellutri, whose father landed on Omaha Beach with the 745th Tank Battalion, and co-owned by her son Christopher, a Cook County Sheriff's Office deputy of more than 20 years. Honors veterans, first responders, and K-9 units, donating a portion of profits to the Gary Sinise Foundation.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Combat Flip Flops",
    typeId: "apparel",
    url: "https://www.combatflipflops.com",
    product: "Footwear, shemaghs & accessories",
    description:
      "A veteran-owned cause brand that manufactures footwear in Colombia, shemaghs and jewelry in Afghanistan, and jewelry from cleared landmines in Laos. Every product sold funds a day of education for an Afghan girl or the clearance of landmines, and the company donates to veteran-support organizations including The Station Foundation and Team 5 Foundation.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Boldfoot Socks",
    typeId: "apparel",
    url: "https://boldfoot.com",
    product: "American-made socks",
    description:
      "A family- and veteran-owned company run by U.S. Army veteran Joshua Law, making socks from American-grown cotton sewn near Charlotte, NC. Donates 5% of profits to help U.S. military veterans in need of jobs, housing, and health support through Charity Navigator–rated nonprofits, with a no-questions-asked hole replacement guarantee.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Frag Out Flavor",
    typeId: "food-drink",
    url: "https://fragoutflavor.com",
    product: "Seasonings & spice rubs",
    description:
      "A veteran-owned seasoning company blending its rubs in America. Its Flavor For Troops program ships product to troops deployed in combat zones, and it donates to 501(c)(3) organizations that directly serve veterans in need — combat wounded and families of fallen soldiers.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Livefire Coffee Co.",
    typeId: "coffee-tea",
    url: "https://livefirecoffeeco.com",
    product: "Coffee & tea",
    description:
      "A veteran-owned coffee brand whose Fireteam Community Fund partners with a local veteran or first-responder organization each quarter, sending $1 from every bag sold straight to them — no middlemen, no bureaucracy.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Firemans Brew",
    typeId: "coffee-tea",
    url: "https://firemansbrew.com",
    product: "Coffee",
    description:
      "Founded by retired Los Angeles County Fire Captain Rick Brandelli after 38 years of service, including multiple Valor commendations. A portion of every purchase funds its Giving Back Program, which provides firefighters in need with medical assistance, mental health services, and emergency financial support.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "First Responder Coffee Co",
    typeId: "coffee-tea",
    url: "https://firstrespondercoffees.com",
    product: "Coffee & drinkware",
    description:
      "Founded and run by a full-time police officer who built the company around its 'putting first responders first' mission. A portion of every sale is directed to programs supporting first responders and their families, with roasts named for the thin blue line, the thin red line, and night shifts.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Got Your Six Coffee Co.",
    typeId: "coffee-tea",
    url: "https://gotyoursixcoffee.com",
    product: "Coffee",
    description:
      "A veteran-owned roaster whose founder, Eric Hadley, built the company on a standing pledge printed on every bag: 25% of net profit goes to first responders, veterans, and healthcare professionals — forever, not as a limited-time promotion. Roasted in-house in small batches, with documented donations to groups like Heroes and Horses.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "22 Sierra Coffee Co.",
    typeId: "coffee-tea",
    url: "https://22sierracoffee.com",
    product: "Coffee",
    description:
      "Founded in April 2020 by Air Force veterans Patrick Little and Joseph Kidwell, with the '22' in its name a constant reminder of the veteran suicide statistic. Donates $0.50 from every packaged coffee sold — treated as overhead, not leftover profit — to the Grunt Style Foundation, funding veteran and first-responder suicide prevention.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Vets 4 Vets Apparel",
    typeId: "apparel",
    url: "https://vets4vetsapparel.com",
    product: "Veteran apparel",
    description:
      "A veteran-owned and veteran-operated apparel company (est. 2019) built specifically to raise awareness for the 22-a-day veteran suicide statistic. A portion of all profits supports veterans, with designs and drops centered on keeping that number in front of the public.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fit2Fight Apparel",
    typeId: "apparel",
    url: "https://fitiifightapparel.com",
    product: "Athletic & casual apparel",
    description:
      "A veteran-owned and veteran-operated apparel brand for the gym and everyday wear, created with a standing commitment to donate a portion of profits to Mission 22 — the nonprofit that provides treatment programs for veterans dealing with PTSD, TBI, and other service-related conditions.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "COLETTI",
    typeId: "gear",
    url: "https://coletticoffee.com",
    product: "Stainless steel camping coffee gear",
    description:
      "A California veteran-owned small business (VOSB) founded in 2015 that makes percolators, pour-overs, and grinders with no plastic, aluminum, or synthetics in the brew path. Has donated 10% of profits since day one to causes supporting veteran transition, service members, and religious freedom.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Fire & Ice Coffee Company",
    typeId: "coffee-tea",
    url: "https://fireicecoffeeco.com",
    product: "Coffee",
    description:
      "Founded by a firefighter/paramedic with nearly 18 years on the job, roasting fresh the day each order is placed. Donates 10% of profits to the Leary Firefighters Foundation, which provides life-saving equipment, training, and resources to fire departments across the country.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "Jocko Fuel",
    typeId: "nutrition",
    url: "https://jockofuel.com",
    product: "Protein, supplements & energy drinks",
    description:
      "Founded by Jocko Willink, retired U.S. Navy SEAL commander of SEAL Team Three's Task Unit Bruiser and co-author of Extreme Ownership. Built around clean-label standards — no heavy metals, no junk ingredients — and made in the U.S., with the brand's origin story and veteran founder documented on its own site.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Star Spangled Tea & Coffee Co.",
    typeId: "coffee-tea",
    url: "https://starspangledtea.com",
    product: "Coffee & loose-leaf tea",
    description:
      "A service-disabled, veteran-owned small business (SDVOSB) founded in Columbus, Georgia by Iraq War veteran Roger Owens of the 3rd Infantry Division and his wife, Aimee. Blends tied to American history and landmarks, with a stated mission to support communities, veterans, and national parks — including a portion of proceeds returned to veteran service organizations and first responders.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Counter Strike Coffee Company",
    typeId: "coffee-tea",
    url: "https://counterstrikecoffeecompany.com",
    product: "Coffee",
    description:
      "A veteran-owned, farm-to-cup Texas roaster founded in 2015 by Brandon Buttrey, a U.S. Navy FMF Hospital Corpsman and 10-year combat veteran. A portion of proceeds is donated to charitable veterans organizations, alongside support for the family-owned El Salvador farms where its coffee is grown.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Heroes Rise Coffee Company",
    typeId: "coffee-tea",
    url: "https://heroesrisecoffee.com",
    product: "Coffee & apparel",
    description:
      "A first-responder-owned and operated roaster whose family lineage runs through a small-town police chief who also volunteered as a firefighter and first responder. Donates coffee to first responders across the U.S. and runs partnerships, fundraising programs, and community events supporting veterans, military families, and local organizations.",
    categoryIds: ["first-responder-owned", "gives-back"],
  },
  {
    name: "First Responder's Coffee Company (FRCC)",
    typeId: "coffee-tea",
    url: "https://frccoffee.com",
    product: "Coffee, cigars & apparel",
    description:
      "Founded in November 2022 by Brent Tucker, an Army Green Beret and Delta Force veteran and Purple Heart recipient, around a simple rule: portions of every sale fund first-responder equipment, training, mental health, and family support. Its CAT II Foundation passes 100% of donations to first responders in need, having given hundreds of thousands of dollars since inception.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "FyrFytr Coffee Co.",
    typeId: "coffee-tea",
    url: "https://fyrfytrcoffee.com",
    product: "Coffee",
    description:
      "Donates a portion of proceeds to local nonprofit organizations that benefit first responders, with named partners such as Virginia First Responder Support Services, which provides confidential mental health and peer-support services to first responders at no cost.",
    categoryIds: ["gives-back"],
  },
  {
    name: "GORUCK",
    typeId: "gear",
    url: "https://www.goruck.com",
    product: "Rucksacks, footwear & training gear",
    description:
      "Founded in 2008 by Jason McCarthy, a 10th Special Forces Group Green Beret, and his wife Emily — built to Special Forces gear standards and made in the USA with a lifetime guarantee. Backs its '1% for Those Who Serve' commitment by raising six figures for the Green Beret Foundation and donating rucksacks to its Casualty Support Program.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "Frontier Coffee Company",
    typeId: "coffee-tea",
    url: "https://www.frontiercoffee.com",
    product: "Coffee & candles",
    description:
      "A veteran- and family-owned craft roastery in the Smoky Mountain foothills of East Tennessee, founded in 2017 by Jennifer Dressel and Nate Dressel, a former Special Forces operator with 19 years of combat training experience. Fresh-roasted weekly and built around employing and creating opportunities for veterans.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Munition Apparel",
    typeId: "apparel",
    url: "https://munitionapparel.com",
    product: "Military apparel & accessories",
    description:
      "A veteran-owned family business producing high-quality apparel and accessories, plus custom orders for military and veteran organizations — with a standing commitment that a portion of all profits always goes to support a veteran or military organization.",
    categoryIds: ["veteran-owned", "gives-back"],
  },
  {
    name: "1765 Apparel Co.",
    typeId: "apparel",
    url: "https://1765apparelco.com",
    product: "American-made apparel",
    description:
      "Veteran-owned and operated by founder William Hawn, a UH-60 Blackhawk crew chief who flew two combat tours in Iraq. American-made from cotton grown, spun, knit, and sewn on U.S. soil and printed to order, with apparel built around faith and country.",
    categoryIds: ["veteran-owned"],
  },
  {
    name: "Fire Grounds Coffee Co.",
    typeId: "coffee-tea",
    url: "https://www.firegroundscoffeecompany.com",
    product: "Coffee",
    description:
      "Founded by Paul Clarke, a Dallas firefighter/paramedic and former Marine Corps officer who deployed to Iraq, and run with president Kyle, a Dallas Fire & Rescue lieutenant. Started on a 2 a.m. ambulance call because first responders deserved better than station coffee — now roasted for first responders nationwide.",
    categoryIds: ["first-responder-owned"],
  },
  {
    name: "Warriors & Whiskey",
    typeId: "food-drink",
    url: "https://warriorsandwhiskey.com",
    product: "Whiskey & gear",
    description:
      "A veteran-owned whiskey and gear company founded in December 2020 by veterans of combat and military service, built to cultivate community among those who served — one sip at a time — with limited-run whiskey drops and apparel.",
    categoryIds: ["veteran-owned"],
  },
];
