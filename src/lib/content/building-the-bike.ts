import type {
  BikeBuildComponentRow,
  BikeBuildContributor,
  BikeBuildStatusSummaryItem,
  BikeBuildTimelineEntry,
} from "@/types/bike-build";

/**
 * Content for /journal/building-the-bike — the living "bike-build
 * adventure" record of turning a donated frame into a race-ready bicycle
 * for IRONMAN 70.3 Chattanooga. Kept as plain structured data (the same
 * pattern as src/lib/content/the-story.ts) rather than a Supabase table:
 * this is one continuing story with a rich per-update shape (technical
 * specs, photos, contributor credit, stable anchors), not a stream of
 * independent posts, and it doesn't need admin CRUD.
 *
 * See the project README's "Bike Build Journal Content" section for a
 * worked example of adding a new update. Short version: append one object
 * to BIKE_BUILD_TIMELINE (oldest-first; the newest entry goes last) and,
 * if a component's status changed, edit its row in
 * BIKE_BUILD_COMPONENT_STATUS. Nothing else needs to change — the page
 * derives "last updated," the latest-update teaser, and the anchor list
 * from this file automatically.
 */

export const BIKE_BUILD_INTRO =
  "Step one was getting a bike. As it turns out, a bicycle frame is sometimes just a very attractive list of additional problems.";

export const BIKE_BUILD_HERO_PHOTO = {
  src: "/journal/building-the-bike/frame-hero.jpg",
  alt: "The donated 2012 Stradalli Sorrento carbon frame and fork, standing on its own in black, white, and red.",
  caption: "The donated 2012 Stradalli Sorrento frame — the current foundation of the build. Not yet a bicycle.",
  width: 2400,
  height: 1800,
};

/**
 * Current-status summary panel — the compact "where things stand" block
 * near the top of the page. Edit in place; this is separate from the
 * per-component board below because it answers "is the bike done yet?"
 * rather than "what's the state of every part."
 */
export const BIKE_BUILD_STATUS_SUMMARY: BikeBuildStatusSummaryItem[] = [
  {
    label: "Frame / Build",
    status: "pending",
    statusLabel: "In Progress",
    detail: "Donated 2012 Stradalli carbon frame is on the repair stand — wheels, handlebar, seatpost, and bottom bracket are installed; assembly is underway.",
  },
  {
    label: "Fit Confirmation",
    status: "pending",
    statusLabel: "Pending",
    detail: "Requires an in-person evaluation, preferably a professional fitting.",
  },
  {
    label: "Major Component Gap",
    status: "confirmed",
    statusLabel: "Resolved",
    detail: "Shimano 105 ST-R7000 mechanical 2×11 brifters purchased August 26, 2026.",
  },
  {
    label: "Aerobars & Seatpost",
    status: "confirmed",
    statusLabel: "Confirmed",
    detail: "Redshift Sports is providing aero bars and a seatpost for the build.",
  },
  {
    label: "Parts Inventory",
    status: "confirmed",
    statusLabel: "Complete",
    detail: "Full inventory taken September 19, 2026 — frame, wheelset, cockpit, crankset, saddle, and controls all confirmed in hand.",
  },
  {
    label: "Remaining Purchases",
    status: "needed",
    statusLabel: "In Progress",
    detail: "Chain and a rim brake set are ordered and awaiting delivery; front/rear derailleurs, tires, and brake cables still need to be ordered.",
  },
  {
    label: "Final Assembly",
    status: "pending",
    statusLabel: "In Progress",
    detail: "Underway as of September 21, 2026 — wheels, handlebar, seatpost, and bottom bracket installed; crankset, pedals, aerobars, brifters, and saddle still to go.",
  },
  {
    label: "First Outdoor Ride",
    status: "pending",
    statusLabel: "Pending",
    detail: "Not yet — will be marked complete only once it actually happens.",
  },
  {
    label: "Race-Day Tune-Up",
    status: "confirmed",
    statusLabel: "Pledged",
    detail: "Bicycle Cove has pledged labor several weeks before race day, parts excluded.",
  },
];

/**
 * Reusable component/part inventory board. `status` drives color+icon;
 * `statusLabel` is the exact accessible text shown (kept close to how MBC
 * and the mechanic actually describe it, even where that's more specific
 * than the 7-value status taxonomy — e.g. "Mostly Available").
 */
export const BIKE_BUILD_COMPONENT_STATUS: BikeBuildComponentRow[] = [
  {
    component: "Frame",
    status: "available",
    statusLabel: "Available / Under Evaluation",
    notes: "Donated 2012 Stradalli carbon frame.",
  },
  {
    component: "Fit",
    status: "pending",
    statusLabel: "Pending",
    notes: "Stack and front-end height require confirmation.",
  },
  {
    component: "Bottom Bracket",
    status: "confirmed",
    statusLabel: "Installed",
    notes: "68 mm threaded; Praxis M30 bottom bracket — installed September 21, 2026.",
  },
  {
    component: "Crankset",
    status: "confirmed",
    statusLabel: "In Hand",
    notes: "170 mm Praxis Zayante Carbon crankset with 50/34 chainrings — arrived September 2, 2026.",
  },
  {
    component: "Chainrings",
    status: "confirmed",
    statusLabel: "Selected",
    notes: "50/34.",
  },
  {
    component: "Wheel & Cassette",
    status: "confirmed",
    statusLabel: "Installed",
    notes: "700C quick-release rim-brake wheelset with a Shimano Ultegra CS-6800 11-speed cassette already mounted — both wheels attached to the frame September 21, 2026.",
  },
  {
    component: "Front Derailleur",
    status: "needed",
    statusLabel: "Needed",
    notes: "Targeting a Shimano 105 FD-R7000-F braze-on derailleur, plus a clamp adapter — the Stradalli doesn't appear to have an integrated braze-on mount.",
  },
  {
    component: "Rear Derailleur",
    status: "needed",
    statusLabel: "Needed",
    notes: "Targeting a Shimano 105 RD-R7000-GS medium cage — not required by the current cassette, but leaves room for a wider-range cassette later.",
  },
  {
    component: "Brake Calipers",
    status: "needed",
    statusLabel: "Ordered — Awaiting Delivery",
    notes: "Front and rear rim-brake calipers ordered September 21, 2026; still awaiting delivery.",
  },
  {
    component: "Handlebars & Stem",
    status: "confirmed",
    statusLabel: "Installed",
    notes: "Specialized Hover drop handlebar on a Specialized V13 stem — handlebar installed September 21, 2026.",
  },
  {
    component: "Brake Cables",
    status: "needed",
    statusLabel: "Needed",
    notes: "Still needs to be purchased to finish connecting the brake calipers once sourced.",
  },
  {
    component: "Brifters",
    status: "confirmed",
    statusLabel: "Purchased",
    notes: "Shimano 105 ST-R7000 mechanical rim-brake 2×11 pair; purchased August 26, 2026.",
  },
  {
    component: "Aerobars",
    status: "confirmed",
    statusLabel: "Confirmed",
    notes: "Quick-Release Clip-on Aerobars, provided by Redshift Sports — an estimated $220 in-kind.",
  },
  {
    component: "Seatpost",
    status: "confirmed",
    statusLabel: "Installed",
    notes: "Redshift Sports Dual Position seatpost — an estimated $250 in-kind; installed September 21, 2026.",
  },
  {
    component: "Seatpost Shim",
    status: "confirmed",
    statusLabel: "Installed",
    notes: "Provided by Redshift Sports to adapt the Dual Position seatpost to the frame's seat tube — an estimated $25 in-kind; installed September 21, 2026.",
  },
  {
    component: "Saddle",
    status: "confirmed",
    statusLabel: "In Hand",
    notes: "ISM PR 3.0 (60mm), provided by ISM Saddles — arrived August 28, 2026.",
  },
  {
    component: "Pedals",
    status: "confirmed",
    statusLabel: "In Hand",
    notes: "RockBros clipless pedals with cleats, purchased online — arrived September 16, 2026.",
  },
  {
    component: "Shifter Cables & Housing",
    status: "confirmed",
    statusLabel: "In Hand",
    notes: "Purchased September 18, 2026 — in hand as of the September 19 inventory.",
  },
  {
    component: "Handlebar Tape",
    status: "confirmed",
    statusLabel: "Purchased",
    notes: "Purchased September 18, 2026 — expected to arrive Sunday, September 20.",
  },
  {
    component: "Chain",
    status: "needed",
    statusLabel: "Ordered — Awaiting Delivery",
    notes: "Ordered September 21, 2026, targeting a Shimano CN-HG601-11, 11-speed; still awaiting delivery.",
  },
  {
    component: "Tires",
    status: "needed",
    statusLabel: "Needed",
    notes: "Targeting Continental Grand Prix 5000s, likely 700×25C — pending a clearance check for 28s on this older frame/brake setup. Two tubes also needed.",
  },
  {
    component: "Assembly",
    status: "pending",
    statusLabel: "In Progress",
    notes: "Frame mounted on the Feedback Sports stand — wheels, handlebar, seatpost, and bottom bracket installed as of September 21, 2026. Crankset, pedals, aerobars, brifters, and saddle still to go.",
  },
  {
    component: "Pre-Race Tune-Up",
    status: "confirmed",
    statusLabel: "Confirmed",
    notes: "Bicycle Cove labor pledged; parts excluded.",
  },
  {
    component: "First Outdoor Ride",
    status: "pending",
    statusLabel: "Pending",
    notes: "Not marked complete until it happens.",
  },
];

/** Text-only for now — structured so a `logoUrl`/`logoAlt` pair can be added later without a redesign. See ContributorsSection. */
export const BIKE_BUILD_CONFIRMED_CONTRIBUTORS: BikeBuildContributor[] = [
  {
    name: "Betsy & MBC",
    role: "Frame sourcing, component inventory, mechanical evaluation",
    note: "Identified the donated Stradalli frame, began cataloguing available components, and connected the build with Bruce and Praxis.",
  },
  {
    name: "Bruce",
    role: "Fit and mechanical assessment",
    note: "Raised the fit question that's currently gating the build, and is evaluating the frame and components in person.",
  },
  {
    name: "Praxis",
    role: "Bottom bracket & crankset",
    note: "Provided a compatible bottom bracket and 170 mm crankset in the selected 50/34 chainring configuration.",
  },
  {
    name: "Bicycle Cove",
    role: "Pre-race tune-up",
    note: "Pledged complimentary labor for a pre-race tune-up, parts excluded, scheduled well ahead of race day.",
  },
  {
    name: "Redshift Sports",
    role: "Aero bars & seatpost",
    note: "Providing aero bars, a seatpost, and a seatpost shim for the race bike build — an estimated $495 in-kind.",
  },
  {
    name: "Feedback Sports",
    role: "Mechanic stand",
    note: "Donated a Pro Mechanic 2.0 repair stand for the build and everything after it.",
  },
  {
    name: "ISM Saddles",
    role: "Saddle",
    note: "Provided the saddle going on the race bike — and sent a shirt along with it.",
  },
];

/** Support being discussed but not yet confirmed — kept separate so nothing here reads as a locked-in sponsorship. */
export const BIKE_BUILD_CONVERSATIONS_IN_PROGRESS: BikeBuildContributor[] = [
  {
    name: "Redemptive Cycles",
    role: "Used brifters request concluded",
    note: "A request for a compatible used pair was submitted August 26, 2026. A suitable Shimano 105 ST-R7000 pair was subsequently sourced and purchased elsewhere, closing the immediate brifter requirement.",
  },
];

/**
 * Photo slots for moments the story hasn't reached yet. Real photos already
 * taken (the bare frame, its details, the front end) live inline on the
 * relevant BIKE_BUILD_TIMELINE entry instead of here — this list is only
 * for future moments so the page never has to fake a photo it doesn't have.
 * Move an item out of this list once a real photo exists for it.
 */
export const BIKE_BUILD_PHOTO_ROADMAP: { label: string; description: string }[] = [
  { label: "Components as They Arrive", description: "Aerobars and the rest of the drivetrain as they're sourced." },
  { label: "The Mechanic's Inspection", description: "Bruce evaluating the frame and components in person." },
  { label: "Assembly Progress", description: "The build coming together, piece by piece." },
  { label: "First Completed Bike", description: "Only once it's actually assembled — not before." },
  { label: "First Outdoor Ride", description: "The first time this bike actually goes anywhere." },
  { label: "Final Race Configuration", description: "The bike as it lines up at IRONMAN 70.3 Chattanooga." },
];

/**
 * The living timeline. Oldest first, newest last — the page renders this
 * array in order and treats the last item as "the latest update." Each
 * entry's `id` becomes its anchor (/journal/building-the-bike#<id>), so
 * once published, don't change an existing entry's id.
 */
export const BIKE_BUILD_TIMELINE: BikeBuildTimelineEntry[] = [
  {
    id: "training-without-a-bike",
    date: "2026-08-01",
    displayDate: "August 2026",
    title: "Training Without a Bike",
    summary:
      "Cycling is the newest of Cody's three disciplines, and training began without a dedicated outdoor bike to develop it on.",
    status: "The search begins",
    body: [
      "When I committed to preparing for the 2027 IRONMAN 70.3 Chattanooga, there was one fairly important detail missing: I did not own an outdoor training or race bike.",
      "Cycling was already the newest of the three disciplines for me. I had no established outdoor power baseline, no validated FTP, no experience sustaining race effort for 56 miles — and no bicycle on which to begin developing any of those things.",
      "The first objective was simple: find a safe, properly sized bicycle that could carry me through training and eventually to the starting line.",
      "Simple objectives have a sense of humor.",
    ],
  },
  {
    id: "knocking-on-doors",
    date: "2026-08-23",
    displayDate: "August 20–23, 2026",
    title: "Knocking on Doors",
    summary: "An outreach campaign to manufacturers, shops, and cycling and veteran-support organizations turned up leads more than answers.",
    status: "Outreach underway",
    body: [
      "I began contacting bicycle manufacturers, component companies, local shops, cycling organizations, and veteran-support groups.",
      "The request was deliberately flexible. A complete bike would have been ideal, but a frameset, demo bike, season-long loaner, meaningful discount, used equipment, or component support could all help move the campaign forward.",
      "Most companies had already committed their sponsorship budgets or were unable to support an individual campaign. The responses were not always the answer I hoped for, but each conversation taught me more about bike sizing, compatibility, sponsorships, and what this build would actually require.",
      "The likely frame-size range appeared to be approximately 51–54 centimeters, but that still needed to be confirmed through an in-person evaluation or professional fitting.",
    ],
  },
  {
    id: "redshift-offers-to-check",
    date: "2026-08-24",
    displayDate: "August 24, 2026",
    title: "Redshift Offers to Check the Parts Shelf",
    summary: "Redshift Sports offered to check whether it has compatible aerobars — pending a bike that didn't exist yet to photograph.",
    status: "Aerobar support under review",
    contributors: ["Redshift Sports"],
    body: [
      "Erik, co-founder and engineer at Redshift Sports, offered to check whether Redshift had aerobars it could provide for the campaign.",
      "Before compatibility could be determined, Redshift needed the bike's make, model, year, handlebar information, and photographs showing the handlebar and stem.",
      "At that point, there was still a small technical obstacle: I did not yet have a completed bike — or even a fully identified cockpit — to photograph.",
      "Redshift's offer remained open while the rest of the bicycle took shape.",
    ],
  },
  {
    id: "a-stradalli-frame-appears",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "A Stradalli Frame Appears",
    summary: "Betsy and the MBC community identified a donated 2012 Stradalli carbon frame as the possible foundation of the build.",
    status: "Donated frame identified",
    featured: false,
    contributors: ["Betsy & MBC"],
    photos: [
      {
        src: "/journal/building-the-bike/frame-hero.jpg",
        alt: "The donated 2012 Stradalli Sorrento carbon frame and fork standing upright in a garage.",
        caption: "The frame, standing on its own for the first time. Confirmed: it looks great. Unconfirmed: everything else.",
        width: 2400,
        height: 1800,
      },
      {
        src: "/journal/building-the-bike/frame-overhead.jpg",
        alt: "The bare Stradalli frame and fork laid out on the floor, showing the full silhouette from above.",
        caption: "The bare frame and fork, laid out in full. A frame is less a bicycle than a very attractive list of future decisions.",
        width: 2000,
        height: 1500,
      },
      {
        src: "/journal/building-the-bike/frame-front-end.jpg",
        alt: "The Stradalli frame's front end, showing the head tube and fork steerer.",
        caption: "The front end — head tube and fork steerer — which is exactly the part later put in question by the fit conversation below.",
        width: 2000,
        height: 1500,
      },
      {
        src: "/journal/building-the-bike/frame-serial-detail.jpg",
        alt: "Close-up of the frame's dropout area showing a stamped serial number plate.",
        caption: "Frame detail and serial marking, for the record.",
        width: 1600,
        height: 1200,
      },
    ],
    technicalDetails: {
      heading: "Frame Geometry",
      note: "Approximate measurements supplied with the donated frame — not a verified manufacturer geometry chart. Final fit still requires an in-person, preferably professional, assessment.",
      items: [
        { label: "RC", value: "410 mm" },
        { label: "O", value: "520 mm" },
        { label: "Reach", value: "approximately 460 mm" },
        { label: "S", value: "510 mm" },
        { label: "HS", value: "135 mm" },
        { label: "F", value: "370 mm" },
        { label: "FC", value: "580 mm" },
        { label: "WB", value: "1000 mm" },
      ],
    },
    body: [
      "The entire project changed when Betsy and the MBC community identified a donated 2012 Stradalli carbon frame that might serve as the foundation of the build.",
      "Even stripped down to the frame, it looked fantastic. Better yet, its black, white, and red appearance fit naturally with the campaign's visual identity. Apparently the bike had received the branding brief before I did.",
      "The frame appeared to be a road-oriented carbon platform that could potentially be configured for triathlon use. It was not yet possible to call it a complete bicycle, a proper fit, or a race-ready machine.",
      "A bare frame is less a bicycle than a very attractive list of future decisions.",
    ],
  },
  {
    id: "the-fit-question",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "The Fit Question",
    summary: "Bruce raised the question that matters most: will the frame's stack and front end actually fit safely?",
    status: "Fit and stack unresolved",
    contributors: ["Bruce"],
    technicalDetails: {
      heading: "Approximate Body Measurements",
      note: "Used only to reason about probable fit — not a substitute for an in-person or professional fitting.",
      items: [
        { label: "Height", value: "5 ft 9.75 in" },
        { label: "Cycling Inseam", value: "31 in" },
        { label: "Torso", value: "26 in" },
        { label: "Arm", value: "26 in" },
        { label: "Shoulder Width", value: "20 in" },
        { label: "Femur", value: "24 in" },
      ],
    },
    body: [
      "Bruce raised the most important question of the entire build: would the frame actually fit me?",
      "The concern was not simply the nominal frame size. The approximate geometry and relatively low front end raised questions about stack, handlebar height, and whether I could maintain a comfortable and sustainable position during a 56-mile bike leg.",
      "Those measurements suggested that the frame might be workable, but “might” is not good enough when comfort, handling, and injury prevention are involved.",
      "The bike still required an in-person evaluation and preferably a professional fitting before significant money was spent completing it.",
      "Fit first. Components second.",
    ],
  },
  {
    id: "mbc-starts-taking-inventory",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "MBC Starts Taking Inventory",
    summary: "Betsy and the MBC team began cataloguing what's on hand and confirmed the frame's bottom-bracket standard.",
    status: "Component inventory underway",
    contributors: ["Betsy & MBC"],
    technicalDetails: {
      heading: "Confirmed & Planned",
      items: [
        { label: "Bottom Bracket", value: "68 mm threaded (confirmed)" },
        { label: "Drivetrain Plan", value: "Shimano-compatible, double chainring" },
        { label: "Wheel & Cassette", value: "11-speed, available through MBC; expected 11–32" },
      ],
    },
    body: [
      "Betsy and the MBC team began evaluating the frame and identifying which components were already available.",
      "The frame uses a 68 mm threaded bottom bracket, resolving one major compatibility question.",
      "MBC also had an 11-speed wheel, an 11-speed cassette, a likely 11–32 cassette range, most of the remaining components needed for the build, and access to mechanics capable of assessing the frame and available parts.",
      "The planned drivetrain would be Shimano-compatible and use a double chainring.",
      "The exact build sheet remained subject to the mechanic's inspection, but the project had moved from searching for an entire bicycle to filling a much shorter component list.",
    ],
  },
  {
    id: "praxis-solves-the-crankset-problem",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "Praxis Solves the Crankset Problem",
    summary: "Praxis offered a compatible bottom bracket and 170 mm crankset, and Cody chose a 50/34 chainring setup.",
    status: "Bottom bracket and crankset support offered",
    contributors: ["Praxis"],
    technicalDetails: {
      heading: "Crankset & Chainrings",
      items: [
        { label: "Crank Length", value: "170 mm" },
        { label: "Chainring Options Offered", value: "48/32, 50/34, 52/36" },
        { label: "Selected", value: "50/34" },
      ],
    },
    body: [
      "Praxis confirmed that it could provide a compatible bottom bracket and crankset in the preferred 170 mm crank length.",
      "I selected 50/34. That combination should provide a practical balance between usable speed, climbing range, training flexibility, and the demands of a first 70.3 bike leg.",
      "Praxis also asked to be included in the bike-build story and campaign updates. Its support transformed the crankset and bottom-bracket question from an unresolved technical problem into one of the strongest confirmed pieces of the proposed build.",
    ],
  },
  {
    id: "bicycle-cove-offers-the-tune-up",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    title: "Bicycle Cove Offers the Final Tune-Up",
    summary: "Bicycle Cove pledged complimentary labor for a pre-race tune-up, parts excluded, well ahead of race day.",
    status: "Pre-race tune-up labor confirmed",
    contributors: ["Bicycle Cove"],
    body: [
      "Jessica at Bicycle Cove offered complimentary labor for a pre-race tune-up, excluding any required parts.",
      "The tune-up will need to take place several weeks before race day — not during the traditional athlete ritual of discovering mechanical problems at the last possible moment.",
      "The bike does not exist as a complete machine yet, but it already has a place to receive its final mechanical inspection before Chattanooga.",
    ],
  },
  {
    id: "one-major-piece-is-still-missing",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "One Major Piece Is Still Missing",
    summary: "The remaining major gap: a matched pair of Shimano-compatible, mechanical rim-brake brifters for a 2×11 drivetrain.",
    status: "Brifters needed",
    technicalDetails: {
      heading: "What Will and Won't Work",
      items: [
        { label: "Preferred", value: "Shimano 105 ST-R7000 pair, or Shimano Ultegra ST-R8000 pair" },
        { label: "Also acceptable", value: "Another matched Shimano road 2×11 mechanical rim-brake pair, mechanic-approved" },
        { label: "Won't work", value: "Hydraulic-disc levers, 12-speed levers, 10-speed levers, 1x/single-lever setups, or unmatched pairs" },
      ],
    },
    body: [
      "After reviewing MBC's available components, the remaining major gap became clear: the bike needs a matched pair of Shimano-compatible mechanical rim-brake STI levers, commonly called brifters, for a 2×11 road drivetrain.",
      "Hydraulic-disc levers, 12-speed levers, 10-speed levers, one-by levers, or randomly mismatched components will not solve the problem.",
      "Brifters are awkwardly named, mechanically important, and apparently quite capable of standing between a carbon frame and its dreams.",
    ],
  },
  {
    id: "redemptive-cycles-joins-the-search",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "Redemptive Cycles Joins the Search",
    summary: "A request for a compatible used brifter set went to Redemptive Cycles in Birmingham; a response is pending.",
    status: "Used brifter request submitted",
    body: [
      "Betsy recommended Redemptive Cycles in Birmingham as a possible source for used components.",
      "I contacted the shop with the specific drivetrain requirements and asked whether it had a compatible used set available, along with questions about condition, pricing, and whether donated or discounted support might be possible.",
      "The request emphasized that the immediate need is not an expensive upgrade. It's a safe, compatible set of controls that will allow the donated frame and available components to become a functioning bicycle.",
      "Redemptive Cycles confirmed receipt of the request. Its response is pending.",
    ],
  },
  {
    id: "where-the-build-stands",
    date: "2026-08-26",
    displayDate: "August 26, 2026",
    title: "Where the Build Stands",
    summary:
      "A donated frame, a bottom bracket and crankset, a wheelset, a pledged tune-up, and now a purchased pair of brifters — aerobar compatibility remains under review.",
    status: "Build in progress",
    body: [
      "The project now has the beginnings of a real bicycle: a donated 2012 Stradalli carbon frame, a confirmed 68 mm threaded bottom-bracket standard, a Praxis M30 bottom bracket and 170 mm crankset in the selected 50/34 configuration, an 11-speed wheel and 11–32 cassette available through MBC, most remaining components available, and now a purchased pair of Shimano 105 ST-R7000 2×11 mechanical brifters.",
      "Possible aerobar support is still being evaluated by Redshift Sports, Bicycle Cove has pledged pre-race tune-up labor, and Bruce is continuing to evaluate the frame and final build configuration.",
      "Important questions remain: Can the frame be fitted comfortably and safely? What exact components will survive the final compatibility check? Does the build still require a new 11-speed chain or additional cable and housing supplies? Will the proposed cockpit accept the Redshift aerobars? What will the completed bike feel like on its first outdoor ride?",
      "The bike is not assembled, fitted, tested, or race-ready.",
      "Not yet.",
      "But one of the largest remaining pieces is no longer a question mark.",
    ],
  },
  {
    id: "brifters-purchased",
    date: "2026-08-27",
    displayDate: "August 26, 2026",
    title: "The Controls Are Covered",
    summary:
      "A matched pair of Shimano 105 ST-R7000 mechanical brifters has been purchased, closing the build's largest remaining drivetrain gap.",
    status: "Brifters purchased",
    contributors: ["Bruce"],
    photos: [
      {
        src: "/journal/building-the-bike/brifters-shimano-105.png",
        alt: "A matched pair of Shimano 105 ST-R7000 mechanical road shift/brake levers.",
        caption: "The Shimano 105 ST-R7000 brifters, purchased August 26, 2026 — the build's primary cockpit controls, now secured.",
        width: 1254,
        height: 1285,
      },
    ],
    technicalDetails: {
      heading: "Brifters Purchased",
      items: [
        { label: "Model", value: "Shimano 105 ST-R7000, mechanical 2×11" },
        { label: "Price", value: "$138.99 for the pair" },
      ],
    },
    body: [
      "The largest remaining drivetrain gap is officially closed.",
      "After confirming compatibility with Bruce, I purchased a matched pair of Shimano 105 ST-R7000 mechanical 2×11 shift/brake levers for the Stradalli build.",
      "The ST-R7000 levers match the planned Shimano-compatible 11-speed drivetrain, double chainring, and mechanical rim-brake configuration. They will control the front and rear shifting while also serving as the bike's primary brake levers.",
      "The pair was purchased for $138.99, considerably less than many current retail listings for the same component.",
      "This means the build now has its primary cockpit controls secured. The remaining details are increasingly becoming matters of final inventory, fit, assembly, cabling, chain selection, and aerobar compatibility rather than major component sourcing.",
      "For a bike that began as a bare carbon frame, that is a substantial step forward.",
    ],
  },
  {
    id: "a-neighbor-lends-a-bike",
    date: "2026-08-28",
    displayDate: "August 28, 2026",
    title: "A Neighbor Lends a Hand — and a Bike",
    summary:
      "The Stradalli still isn't rideable, so a neighbor loaned a bike to train on in the meantime.",
    status: "Training bike secured (loaner)",
    photos: [
      {
        src: "/journal/building-the-bike/loaner-bike-blue-trail.jpg",
        alt: "A red Trek hybrid bike parked on a paved trail beside a \"Blue Trail 4 Miles\" sign.",
        caption: "The loaner — a red Trek — out on the trail. Not the race bike. Just something to actually pedal in the meantime.",
        width: 1512,
        height: 2016,
      },
    ],
    body: [
      "The Stradalli build still isn't rideable — no confirmed fit, no finished cockpit, no assembly. None of that stops training from needing to start.",
      "A neighbor solved the immediate problem by loaning me a bike: a red Trek, already built and already rideable, good for exactly as long as it takes to either finish the Stradalli or find one of my own.",
      "This bike isn't part of the build. It doesn't get a line on the component board below, and it isn't the bike going to Chattanooga. It's a bridge — a way to put in real outdoor miles while the actual race bike is still a list of unresolved questions.",
      "Sometimes the fastest way to keep moving forward is somebody else's spare bike and a trail sign pointing the way.",
    ],
  },
  {
    id: "ism-saddle-arrives",
    date: "2026-08-28",
    displayDate: "August 28, 2026",
    title: "ISM Delivers the Saddle — and a Shirt",
    summary: "The ISM PR 3.0 saddle pledged for the build arrived, along with an ISM t-shirt that wasn't part of the ask.",
    status: "Saddle in hand",
    contributors: ["ISM Saddles"],
    photos: [
      {
        src: "/journal/building-the-bike/ism-saddle-and-shirt.jpeg",
        alt: "An ISM PR 3.0 saddle resting on a dark gray ISM-branded t-shirt.",
        caption: "The ISM PR 3.0 saddle, size 60mm — and the shirt ISM sent along with it.",
        width: 2856,
        height: 2142,
      },
    ],
    technicalDetails: {
      heading: "Saddle",
      items: [
        { label: "Model", value: "ISM PR 3.0" },
        { label: "Size", value: "60mm" },
      ],
    },
    body: [
      "Two weeks after Praxis and Redshift turned open questions into real hardware, ISM did the same for the saddle: the PR 3.0 they pledged showed up, size 60mm, ISM branding intact.",
      "A cutout saddle isn't a small ask — it's the kind of component that either works for a rider's anatomy or genuinely doesn't, no matter how good the rest of the build is. ISM backing that with real hardware instead of just an offer is one more piece of this bike that no longer has to be sourced, guessed at, or worried about.",
      "ISM also sent along a shirt — not something I asked for, just a nice gesture that came with the box.",
      "Huge thanks to ISM Saddles for getting behind this campaign with real support, not just a conversation.",
    ],
  },
  {
    id: "praxis-crankset-arrives",
    date: "2026-09-02",
    displayDate: "September 2, 2026",
    title: "Praxis Delivers: The Crankset Is Here",
    summary: "The Praxis crankset, chainrings, and bottom bracket showed up — turning last week's offer into real parts on the counter.",
    status: "Crankset & bottom bracket in hand",
    featured: true,
    contributors: ["Praxis"],
    photos: [
      {
        src: "/journal/building-the-bike/praxis-crankset-arrived.jpg",
        alt: "A Praxis Zayante Carbon crank arm, a 50/34 chainring, a boxed Praxis bottom bracket, chainring bolts, and bubble wrap laid out on a countertop.",
        caption: "Everything Praxis sent for the crankset and bottom bracket — Zayante Carbon crank arm, 50/34 chainring, boxed M30 bottom bracket, and hardware.",
        width: 2000,
        height: 1500,
      },
    ],
    technicalDetails: {
      heading: "What Arrived",
      items: [
        { label: "Crank Arm", value: "Praxis Zayante Carbon, 170 mm" },
        { label: "Chainrings", value: "50/34, LT2 spider, X-Rings" },
        { label: "Bottom Bracket", value: "Praxis M30" },
      ],
    },
    body: [
      "The parts Praxis offered last week showed up: a Zayante Carbon crank arm, a Praxis 50/34 chainring, a boxed M30 bottom bracket, and the chainring bolts to hold it all together.",
      "It's exactly the 170 mm crank length and 50/34 chainring configuration I selected — the same setup that turned the crankset and bottom-bracket question from an open problem into one of the strongest confirmed pieces of this build.",
      "Huge thanks to Praxis for backing that offer with real hardware, not just a conversation. That's one more component that no longer has to be sourced, guessed at, or worried about before the mechanic's inspection.",
      "Next up: getting these into Bruce's hands so they can be checked against the frame and the rest of the drivetrain.",
    ],
    relatedLinks: [{ label: "See the component board", href: "/journal/building-the-bike#component-status" }],
  },
  {
    id: "redshift-confirms-aero-bars-and-seatpost",
    date: "2026-09-02",
    displayDate: "September 2, 2026",
    title: "Redshift Confirms: Aero Bars and a Seatpost",
    summary:
      "Redshift Sports has confirmed it's providing aero bars, a seatpost, and a seatpost shim for the race bike — an estimated $495 in-kind — closing the aerobar question that had been open since late August.",
    status: "Aero bars & seatpost confirmed",
    featured: true,
    contributors: ["Redshift Sports"],
    costTable: {
      heading: "Donated Value",
      note: "Retail estimates for the components Redshift Sports is providing, not what the team was billed.",
      rows: [
        { part: "Quick-Release Clip-on Aerobars", cost: "$220" },
        { part: "Dual Position seatpost", cost: "$250" },
        { part: "Seatpost shim", cost: "$25" },
      ],
      totalLabel: "Estimated total in-kind value",
      totalValue: "$495",
    },
    body: [
      "The aerobar question that's been open since late August is closed: Redshift Sports is providing aero bars, a seatpost, and a seatpost shim for the race bike.",
      "Erik and the team at Redshift first offered to check compatibility once the final cockpit was known. Now that the frame, crankset, and drivetrain have taken real shape, that offer has turned into confirmed support.",
      "Between the aero bars, the seatpost, and the shim, three more items come off the open-questions list and onto the actual build sheet — an estimated $495 in donated gear.",
      "Huge thanks to Redshift Sports for backing this campaign with real hardware.",
    ],
    relatedLinks: [{ label: "See the component board", href: "/journal/building-the-bike#component-status" }],
  },
  {
    id: "pearl-izumi-cycling-shoes",
    date: "2026-09-10",
    displayDate: "Week of September 8, 2026",
    title: "Cycling Shoes: Pearl iZumi",
    summary: "A pair of Pearl iZumi cycling shoes — purchased, not donated — rounding out the connection from pedal to cockpit.",
    status: "Cycling shoes purchased",
    photos: [
      {
        src: "/journal/building-the-bike/pearl-izumi-shoes.jpeg",
        alt: "A pair of black Pearl iZumi cycling shoes with clipless cleats visible on the sole, on a carpeted floor.",
        caption: "Pearl iZumi cycling shoes, purchased for the build.",
        width: 2856,
        height: 2142,
      },
    ],
    body: [
      "Cycling shoes had been sitting on the gear-needs list as \"Needed\" since this page started. This is the one that came off the list by simply buying it.",
      "A pair of Pearl iZumi cycling shoes: stiff soles, a proper clipless cleat interface, and the actual connection point between the pedals below and the aero position everything else on this bike is built around.",
      "Unlike the saddle, the crankset, or the aero bars, there's no sponsor behind this one — just a purchase, made because training doesn't wait for every piece of the puzzle to be donated.",
    ],
  },
  {
    id: "feedback-sports-mechanic-stand",
    date: "2026-09-16",
    displayDate: "September 16, 2026",
    title: "Feedback Sports Sends a Home Base for the Bike",
    summary:
      "Feedback Sports has provided a Pro Mechanic 2.0 repair stand — the tool that turns a garage floor into an actual workspace between now and race day.",
    status: "Mechanic stand secured",
    contributors: ["Feedback Sports"],
    body: [
      "Somewhere between a bare frame and a race-ready bicycle, a bike needs a place to actually be worked on — something better than a kickstand and a hopeful attitude.",
      "Feedback Sports solved that problem with a donated Pro Mechanic 2.0 repair stand. It isn't a component of the bike itself, but it's about to become one of the most-used tools in this entire build — holding the frame steady through inventory, installation, adjustments, and whatever else turns up between now and Chattanooga.",
      "Between now and race day, this stand is going to earn its keep.",
      "Huge thanks to Feedback Sports for making sure the bike has somewhere to stand while it becomes a bicycle.",
    ],
  },
  {
    id: "mbc-parts-head-home",
    date: "2026-09-16",
    displayDate: "September 16, 2026",
    title: "The Parts Are (Almost) Home",
    summary:
      "Family picked up the available components from Montgomery Bicycle Club — full inventory, and the start of actual assembly, happens this weekend.",
    status: "Inventory pending",
    featured: true,
    contributors: ["Betsy & MBC"],
    body: [
      "The components MBC has been holding for this build didn't stay at MBC. My family picked them up — which means the parts are now closer to this bike than they've been since the search for one started back in August.",
      "I haven't gotten my hands on them yet. That happens this weekend, when I collect everything from my family and finally take a real inventory — not the estimated, conversation-based inventory this page has been running on, but an actual count of what's in the boxes.",
      "Once that's done, the plan is to start assembling. The components I already know are going on this bike: the ISM saddle, the Praxis crankset that arrived a couple weeks ago, the Shimano 105 brifters, and a set of RockBros pedals I picked up online myself.",
      "I also already know two things are missing: tires and a chain. Neither is sourced yet.",
      "Beyond that? What else this build still needs is honestly still an open question — one this weekend's inventory should start answering.",
    ],
    relatedLinks: [{ label: "See the component board", href: "/journal/building-the-bike#component-status" }],
  },
  {
    id: "rockbros-pedals-arrive",
    date: "2026-09-16",
    displayDate: "September 16, 2026",
    title: "Pedals and Cleats: RockBros",
    summary: "A pair of RockBros clipless pedals with cleats arrived — the last piece connecting shoe to crank.",
    status: "Pedals in hand",
    photos: [
      {
        src: "/journal/building-the-bike/rockbros-pedals.png",
        alt: "A pair of RockBros clipless bicycle pedals with matching cleats and hex wrenches, as listed for purchase.",
        caption: "The RockBros clipless pedals and cleats, as ordered.",
        width: 942,
        height: 782,
      },
    ],
    body: [
      "Two days ago, the plan was \"I know I'll need tires and a chain — what else, I don't know yet.\" Pedals turned out to be one of the answers.",
      "A pair of RockBros clipless pedals, cleats included, arrived the same day the MBC parts started their trip home. Between these and the Pearl iZumi shoes bought a couple weeks earlier, the connection from foot to crank is now fully accounted for.",
      "Like the shoes, this was a straightforward purchase, not a donation — sometimes the fastest way to close a gap is just to close it.",
    ],
  },
  {
    id: "cables-tape-and-tomorrows-pickup",
    date: "2026-09-18",
    displayDate: "September 18, 2026",
    title: "Cables, Housing, Bar Tape — and Tomorrow's the Day",
    summary: "Shifter cables, housing, and handlebar tape are ordered and due Sunday — and tomorrow, the parts finally come home.",
    status: "Consumables ordered; pickup tomorrow",
    featured: true,
    body: [
      "Two more purchases went in today: shifter cables and housing, and handlebar tape. Neither is glamorous, and neither was really answerable until the frame and drivetrain were far enough along to know exactly what the cabling needs to do. Both are expected to arrive Sunday, September 20.",
      "The bigger news is what happens before that shipment even shows up: tomorrow, I'm picking up the bike — the actual components MBC has been holding, that my family collected on my behalf a couple of days ago.",
      "That's the moment this page has been building toward since the frame first showed up in a garage in late August: real inventory, in hand, instead of a list of parts scattered across a shop, a family member's car, and a handful of online orders.",
      "Not assembled yet. Not fitted yet. But for the first time, everything is finally about to be in one place.",
    ],
  },
  {
    id: "taking-inventory",
    date: "2026-09-19",
    displayDate: "September 19, 2026",
    title: "Building the Bike: Taking Inventory",
    summary:
      "With the parts finally collected, today was inventory day — laying everything out to see what's actually here, what's compatible, and what's still missing.",
    status: "Full inventory complete",
    featured: true,
    photos: [
      {
        src: "/journal/building-the-bike/inventory-frame.jpeg",
        alt: "The Stradalli Sorrento carbon frame and fork laid out in the bed of a truck.",
        caption: "The frame, laid out for inventory day.",
        width: 2856,
        height: 2142,
      },
      {
        src: "/journal/building-the-bike/inventory-wheelset.jpeg",
        alt: "A front and rear 700C wheelset laid out in the bed of a truck, the rear wheel already fitted with a cassette.",
        caption: "The wheelset — usable as-is, with the cassette already on the rear wheel.",
        width: 2016,
        height: 1512,
      },
      {
        src: "/journal/building-the-bike/inventory-ultegra-cassette.jpeg",
        alt: "A close-up of a Shimano Ultegra CS-6800 11-speed bicycle cassette.",
        caption: "The Shimano Ultegra CS-6800, 11-speed — already mounted on the rear wheel, one less thing to buy.",
        width: 2016,
        height: 1512,
      },
      {
        src: "/journal/building-the-bike/inventory-cockpit.jpeg",
        alt: "A Specialized Hover drop handlebar attached to a Specialized V13 stem.",
        caption: "The cockpit: a Specialized Hover handlebar on a Specialized V13 stem.",
        width: 2856,
        height: 2142,
      },
      {
        src: "/journal/building-the-bike/inventory-bottom-bracket-shell.jpeg",
        alt: "A close-up of the Stradalli frame's bottom bracket shell.",
        caption: "The bottom bracket shell, ready for the Praxis bottom bracket.",
        width: 2856,
        height: 2142,
      },
    ],
    technicalDetails: {
      heading: "Drivetrain Plan",
      items: [
        { label: "Shifting / Braking", value: "Shimano 105 R7000, mechanical 2×11" },
        { label: "Crankset", value: "Praxis 50/34, 170 mm" },
        { label: "Cassette", value: "Shimano Ultegra CS-6800, 11-speed (already on the rear wheel)" },
      ],
    },
    costTable: {
      heading: "The Remaining Shopping List (Estimated)",
      note: "Shift cables and housing are already in hand — the brake-cable line below is a carried-over estimate from before that, not yet re-priced for brake cables alone.",
      rows: [
        { part: "Shimano 105 FD-R7000 front derailleur", cost: "$30–40" },
        { part: "Front derailleur clamp adapter", cost: "$15–25" },
        { part: "Shimano 105 RD-R7000-GS rear derailleur", cost: "$45–70" },
        { part: "Shimano 105 BR-R7000 brake calipers", cost: "$65–90" },
        { part: "Continental GP5000 tires ×2", cost: "$90–120" },
        { part: "Tubes ×2", cost: "$15–25" },
        { part: "Shimano CN-HG601 11-speed chain", cost: "$30–40" },
        { part: "Brake cables", cost: "$30–45" },
      ],
      totalLabel: "Estimated remaining total",
      totalValue: "$320–455",
    },
    body: [
      "The Stradalli build is starting to look less like a pile of bike parts and more like an actual race bike.",
      "Today was inventory day. Before buying anything else, I laid everything out and worked through what came with the frame, what I've already acquired for the build, what's compatible, and — most importantly — what I'm still missing.",
      "There was some good news. The frame already has its rear derailleur hanger installed, the wheelset is usable, and the rear wheel came with a Shimano Ultegra CS-6800 11-speed cassette already mounted. That's several things I thought I might have to buy that are already covered.",
      "The foundation of the build is now pretty solid: the Stradalli full-carbon frame and fork, a 700C quick-release rim-brake wheelset, that Ultegra cassette, the rear derailleur hanger, the Shimano 105 ST-R7000 2×11 mechanical shifters and brake levers, the Praxis 50/34 carbon crankset and bottom bracket, a Specialized cockpit — drop handlebars and a V13 stem, the ISM saddle, the Lazer Victor KinetiCore aero helmet, a pair of Pearl iZumi cycling shoes, and the RockBros pedals and cleats.",
      "The drivetrain plan is also finally settled. I'm building around Shimano 105 R7000 mechanical 2×11, using the Praxis crankset and the existing Ultegra cassette. That's a combination that gives me a reliable, serviceable mechanical drivetrain without throwing money at marginal upgrades just because they say Ultegra on them.",
      "There are really only a handful of major pieces standing between the current pile of parts and a functioning bicycle.",
      "Derailleurs: I still need both. The rear will most likely be a Shimano 105 RD-R7000-GS medium cage. The current cassette doesn't require the GS cage, but it gives me the option of moving to a wider-range cassette later without replacing the derailleur. For the front, I'm looking at the Shimano 105 FD-R7000-F braze-on derailleur. The Stradalli doesn't appear to have an integrated braze-on mount, so I'll also need the correctly sized clamp adapter for the frame.",
      "Brakes: the bike needs front and rear rim-brake calipers. The obvious match is a set of Shimano 105 BR-R7000 dual-pivot calipers.",
      "Tires: the wheels are here, but they're naked. I'm currently looking at Continental Grand Prix 5000s, most likely in 700×25C. I'd like to run 28s if possible, but I'm not buying them until I know this older frame and brake setup has adequate clearance. I'll also need two tubes.",
      "Chain: a fresh 11-speed chain is cheap insurance on a drivetrain being assembled from several different sources. The current target is a Shimano CN-HG601-11.",
      "Finally, I'll need brake cables to finish connecting the new calipers — the shift cables and housing are already in hand from a couple of days ago.",
      "I'll keep hunting for deals rather than blindly ordering everything at retail. This entire build has been about putting together a capable race bike intelligently — not seeing how quickly I can empty my wallet.",
      "There's still work ahead, but the character of the project has changed. I'm not trying to figure out what bike I'm going to build anymore.",
      "The frame is here. The wheels are here. The cockpit is here. The crank and bottom bracket are here. The saddle is here. The controls are here. The shoes and pedals are here. Even the cassette turned out to already be sitting on the rear wheel.",
      "Now it's a finite shopping list. Brakes. Derailleurs. Tires. Chain. Cables.",
      "Then comes assembly. And after spending all this time collecting parts, measuring, researching compatibility, chasing deals, and figuring out what this old Stradalli needs, that's the part I've been waiting for: turning the collection of parts into a bike — and then finding out how fast I can make it go.",
    ],
    relatedLinks: [{ label: "See the component board", href: "/journal/building-the-bike#component-status" }],
  },
  {
    id: "assembly-begins",
    date: "2026-09-21",
    displayDate: "September 21, 2026",
    title: "Assembly Begins",
    summary:
      "The parts didn't just make it home — they made it onto the bike. Wheels, handlebar, seatpost, and bottom bracket are installed; the crankset, pedals, aerobars, brifters, and saddle are next.",
    status: "Assembly underway",
    featured: true,
    photos: [
      {
        src: "/journal/building-the-bike/assembly-begins-frame-on-stand.jpeg",
        alt: "The Stradalli Sorrento frame mounted on a Feedback Sports repair stand in a garage, with both wheels and a drop handlebar already installed.",
        caption: "Up on the Feedback Sports stand, with wheels, handlebar, and seatpost already on.",
        width: 4032,
        height: 3024,
      },
    ],
    technicalDetails: {
      heading: "Assembly Status",
      items: [
        { label: "Installed", value: "Wheels, Specialized handlebar, Redshift Sports seatpost, Praxis bottom bracket" },
        { label: "In hand, not yet installed", value: "Praxis crankset, RockBros pedals, Redshift Sports aerobars, Shimano 105 brifters, ISM saddle" },
        { label: "Ordered, awaiting delivery", value: "Chain, rim brake set" },
        { label: "Still to order", value: "Front derailleur, rear derailleur, tires" },
      ],
    },
    body: [
      "The parts didn't just make it home — they made it onto the bike. Assembly has officially started.",
      "The frame is up on the donated Feedback Sports Mechanic 2.0 stand, which turns out to be exactly as useful as advertised. Both wheels are attached. The Specialized handlebar is on. The Redshift Sports multi-position seatpost is in. The Praxis bottom bracket is installed.",
      "Still to go, but already in hand: the Praxis crankset, the RockBros pedals, the Redshift Sports aerobars, the Shimano 105 brifters, and the ISM saddle. None of that is a sourcing question anymore — it's just a matter of turning wrenches.",
      "A chain and a rim brake set are ordered and on the way. The front and rear derailleurs and a set of tires are still on the shopping list — the last real gaps left in the build.",
      "Next up: another inventory pass once everything's on, a fit adjustment, and then — assuming nothing else goes sideways — a real test ride.",
    ],
    relatedLinks: [{ label: "See the component board", href: "/journal/building-the-bike#component-status" }],
  },
];

export function getLatestBikeBuildEntry(): BikeBuildTimelineEntry {
  return BIKE_BUILD_TIMELINE[BIKE_BUILD_TIMELINE.length - 1];
}

/** ISO date of the newest timeline entry — drives the hero's "Last updated" badge and the page's dateModified metadata. */
export function getBikeBuildLastUpdated(): string {
  return getLatestBikeBuildEntry().date;
}

const STATUS_WORD: Record<string, string> = {
  confirmed: "Confirmed",
  complete: "Complete",
  available: "Acquired",
  offered: "Offered",
  under_review: "Under Review",
  needed: "Needed",
  pending: "Pending",
};

/** Which BIKE_BUILD_COMPONENT_STATUS row backs each teaser highlight, and the label shown for it. */
const TEASER_HIGHLIGHTS: { component: string; label: string }[] = [
  { component: "Frame", label: "Frame" },
  { component: "Remaining Drivetrain", label: "Drivetrain" },
  { component: "Fit", label: "Fit" },
  { component: "Assembly", label: "Assembly" },
];

export interface BikeBuildStatusOverview {
  badge: "BUILD IN PROGRESS" | "BUILD COMPLETE";
  confirmedCount: number;
  totalCount: number;
  highlights: { label: string; statusLabel: string }[];
}

/**
 * Compact teaser-level summary for the Journal index card — a few
 * representative component statuses, not the full board (see
 * ComponentStatusBoard for that). Derived from BIKE_BUILD_COMPONENT_STATUS
 * so it can never drift from the full board's actual data.
 */
export function getBikeBuildStatusOverview(): BikeBuildStatusOverview {
  const confirmedCount = BIKE_BUILD_COMPONENT_STATUS.filter(
    (row) => row.status === "confirmed" || row.status === "complete",
  ).length;

  const highlights = TEASER_HIGHLIGHTS.map(({ component, label }) => {
    const row = BIKE_BUILD_COMPONENT_STATUS.find((r) => r.component === component);
    return { label, statusLabel: row ? (STATUS_WORD[row.status] ?? row.statusLabel) : "TBD" };
  });

  return {
    badge: confirmedCount === BIKE_BUILD_COMPONENT_STATUS.length ? "BUILD COMPLETE" : "BUILD IN PROGRESS",
    confirmedCount,
    totalCount: BIKE_BUILD_COMPONENT_STATUS.length,
    highlights,
  };
}

export interface BikeBuildTeaser {
  title: string;
  displayDate: string;
  summary: string;
  href: string;
}

/** Used by the journal index and The Race page's "Latest Bike-Build Update" teasers. */
export function getBikeBuildTeaser(): BikeBuildTeaser {
  const latest = getLatestBikeBuildEntry();
  return {
    title: latest.title,
    displayDate: latest.displayDate,
    summary: latest.summary,
    href: `/journal/building-the-bike#${latest.id}`,
  };
}
